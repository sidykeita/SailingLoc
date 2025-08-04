from locust import HttpUser, task, between
import random
import string
import time

def random_email():
    millis = int(time.time() * 1000)
    rand = ''.join(random.choices(string.ascii_lowercase, k=8))
    return f"{rand}{millis}@test.com"

class SailingLocUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def create_user(self):
        password = "azerty123"
        data = {
            "name": "Test User",
            "email": random_email(),
            "password": password,
            "confirmPassword": password
        }
        with self.client.post("/api/users", json=data, catch_response=True) as resp:
            if resp.status_code != 201:
                resp.failure(f"POST failed: {resp.text}")
            else:
                resp.success()
