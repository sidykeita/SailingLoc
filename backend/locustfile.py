from locust import HttpUser, task, between
import random
import string
import time
import os
from datetime import datetime, timedelta


def random_email():
    millis = int(time.time() * 1000)
    rand = ''.join(random.choices(string.ascii_lowercase, k=8))
    return f"{rand}{millis}@test.com"


def random_name():
    return ''.join(random.choices(string.ascii_letters, k=10))


def random_phone():
    return ''.join(random.choices('0123456789', k=10))


def env_truthy(name: str, default: str = 'false') -> bool:
    return (os.getenv(name, default) or '').lower() in ('1', 'true', 'yes', 'on')


class PublicUser(HttpUser):
    wait_time = between(1, 2)
    weight = 3

    def on_start(self):
        self._boat_ids = []

    @task(3)
    def health(self):
        with self.client.get("/api/health", catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"health failed: {resp.status_code} {resp.text}")

    @task(5)
    def list_boats(self):
        with self.client.get("/api/boats", catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    data = resp.json()
                    if isinstance(data, list):
                        self._boat_ids = [b.get('_id') for b in data if b.get('_id')]
                    resp.success()
                except Exception as e:
                    resp.failure(f"boats json parse error: {e}")
            else:
                resp.failure(f"boats failed: {resp.status_code}")

    @task(2)
    def list_available(self):
        # Provide valid date range to avoid 400
        start = (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d")
        end = (datetime.utcnow() + timedelta(days=7)).strftime("%Y-%m-%d")
        path = f"/api/boats/available?start={start}&end={end}"
        with self.client.get(path, catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"available failed: {resp.status_code}")

    @task(2)
    def boat_detail(self):
        if not self._boat_ids:
            return
        boat_id = random.choice(self._boat_ids)
        with self.client.get(f"/api/boats/{boat_id}", catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"boat {boat_id} failed: {resp.status_code}")

    @task(2)
    def reviews_list(self):
        # Prefer filtered by boat if we have ids, else list all
        path = "/api/reviews"
        if self._boat_ids:
            boat_id = random.choice(self._boat_ids)
            path = f"/api/reviews?boat={boat_id}"
        with self.client.get(path, catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"GET {path} failed: {resp.status_code}")

    @task(1)
    def payments_list(self):
        with self.client.get("/api/payments", catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"GET /api/payments failed: {resp.status_code}")

    @task(1)
    def blocks_public_by_boat(self):
        if not self._boat_ids:
            return
        boat_id = random.choice(self._boat_ids)
        with self.client.get(f"/api/blocks/public/boat/{boat_id}", catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"GET /api/blocks/public/boat/{boat_id} failed: {resp.status_code}")


class AuthUser(HttpUser):
    wait_time = between(1, 2)
    weight = 1

    def on_start(self):
        self._boat_ids = []
        # Prefer safe online behavior: try login with provided creds; only register if allowed
        read_only = os.getenv('LOCUST_READ_ONLY', 'true').lower() in ('1', 'true', 'yes')
        email_env = os.getenv('LOCUST_AUTH_EMAIL')
        password_env = os.getenv('LOCUST_AUTH_PASSWORD')

        if email_env and password_env:
            with self.client.post("/api/auth/login", json={"email": email_env, "password": password_env}, catch_response=True) as resp:
                if resp.status_code != 200:
                    resp.failure(f"login failed: {resp.status_code} {resp.text}")
                    return
                try:
                    data = resp.json()
                    token = data.get("token")
                    if token:
                        self.client.headers.update({"Authorization": f"Bearer {token}"})
                        # Preload boats for owner/public dependent tasks
                        try:
                            r = self.client.get("/api/boats")
                            if r.status_code == 200:
                                arr = r.json()
                                if isinstance(arr, list):
                                    self._boat_ids = [b.get('_id') for b in arr if b.get('_id')]
                        except Exception:
                            pass
                except Exception as e:
                    resp.failure(f"login parse error: {e}")
            return

        if read_only:
            # In read-only mode without credentials, skip auth flows
            return

        # Register a fresh tenant user and set Authorization header (write operation)
        email = random_email()
        payload = {
            "firstName": random_name(),
            "lastName": random_name(),
            "email": email,
            "password": "Azerty123!",
            "phone": random_phone(),
            "role": "locataire"
        }
        with self.client.post("/api/auth/register", json=payload, catch_response=True) as resp:
            if resp.status_code != 201:
                resp.failure(f"register failed: {resp.status_code} {resp.text}")
                return
            try:
                data = resp.json()
                token = data.get("token")
                if token:
                    self.client.headers.update({"Authorization": f"Bearer {token}"})
                # Preload boats list for other tasks
                try:
                    r = self.client.get("/api/boats")
                    if r.status_code == 200:
                        arr = r.json()
                        if isinstance(arr, list):
                            self._boat_ids = [b.get('_id') for b in arr if b.get('_id')]
                except Exception:
                    pass
            except Exception as e:
                resp.failure(f"register parse error: {e}")

    @task(3)
    def me(self):
        if 'Authorization' not in self.client.headers:
            return
        with self.client.get("/api/auth/user", catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"/auth/user failed: {resp.status_code}")

    @task(3)
    def my_reservations(self):
        if 'Authorization' not in self.client.headers:
            return
        with self.client.get("/api/reservations/my-reservations", catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"/reservations/my-reservations failed: {resp.status_code}")

    @task(2)
    def owner_reservations(self):
        if 'Authorization' not in self.client.headers:
            return
        # Will return 403 for a tenant; it's fine to exercise auth layer
        with self.client.get("/api/reservations/owner", catch_response=True) as resp:
            if resp.status_code not in (200, 403):
                resp.failure(f"/reservations/owner unexpected: {resp.status_code}")

    @task(2)
    def my_reviews(self):
        if 'Authorization' not in self.client.headers:
            return
        with self.client.get("/api/reviews/user/my-reviews", catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"/reviews/user/my-reviews failed: {resp.status_code}")

    @task(2)
    def favorites_get(self):
        if 'Authorization' not in self.client.headers:
            return
        with self.client.get("/api/favorites", catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"GET /api/favorites failed: {resp.status_code}")

    @task(2)
    def contractual_documents_list(self):
        if 'Authorization' not in self.client.headers:
            return
        with self.client.get("/api/contractual-documents", catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"GET /api/contractual-documents failed: {resp.status_code}")

    @task(1)
    def blocks_owner_by_boat(self):
        if 'Authorization' not in self.client.headers:
            return
        if not self._boat_ids:
            return
        boat_id = random.choice(self._boat_ids)
        with self.client.get(f"/api/blocks/boat/{boat_id}", catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"GET /api/blocks/boat/{boat_id} failed: {resp.status_code}")

    @task(1)
    def logout(self):
        if 'Authorization' not in self.client.headers:
            return
        with self.client.post("/api/auth/logout", catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"POST /api/auth/logout failed: {resp.status_code}")

    @task(1)
    def stripe_checkout_session(self):
        # Only if explicitly enabled to avoid hitting Stripe unintentionally
        if 'Authorization' not in self.client.headers:
            return
        if not env_truthy('LOCUST_STRIPE', 'false'):
            return
        payload = {
            "amount": 100,  # cents
            "currency": "eur",
            "description": "Load test checkout session",
        }
        with self.client.post("/api/stripe/create-checkout-session", json=payload, catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"/stripe/create-checkout-session failed: {resp.status_code}")
