from locust import HttpUser, task, between
import random
import string

def random_email():
    return ''.join(random.choices(string.ascii_lowercase, k=8)) + "@test.com"


class SailingLocUser(HttpUser):
    wait_time = between(1, 3)
    user_id = None
    boat_id = None

    def on_start(self):
        # Crée un user unique pour chaque client virtuel et sauvegarde son ID
        data = {
            "name": "TestUser_" + ''.join(random.choices(string.ascii_lowercase, k=5)),
            "email": random_email(),
            "password": "azerty"
        }
        with self.client.post("/auth/users", json=data, catch_response=True) as response:
            if response.status_code == 201:
                self.user_id = response.json().get("_id")
            else:
                response.failure("User creation failed")

        # Récupère un boat aléatoire depuis l’API (on prend le 1er de la liste ici)
        with self.client.get("/api/boats", catch_response=True) as response:
            if response.status_code == 200 and len(response.json()) > 0:
                self.boat_id = response.json()[0]["_id"]  # Change selon ta structure de réponse
            else:
                response.failure("No boat found")

    @task(2)
    def get_users(self):
        self.client.get("/auth/users")

    @task(1)
    def create_reservation(self):
        # Seulement si les IDs ont été récupérés
        if self.user_id and self.boat_id:
            data = {
                "user": self.user_id,
                "boat": self.boat_id,
                "startDate": "2025-08-01",
                "endDate": "2025-08-02"
            }
            self.client.post("/api/reservations", json=data)

    
