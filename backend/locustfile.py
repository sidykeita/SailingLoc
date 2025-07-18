import random
import string
from locust import HttpUser, task


class WebsiteUser(HttpUser):
    @task
    def get_users(self):
        self.client.get("/auth/users")
    
def random_email():
    return f"jean{random.randint(1, 1000000)}@test.com"

class WebsiteUser(HttpUser):
    @task
    def postUser(self):
        payload = {
            "name": "Jean Dupont",
            "email": random_email(),
            "password": "123456"
        }
        # Attention ici : bien utiliser `json=payload`
        with self.client.post("/auth/users", json=payload, catch_response=True) as response:
            print(response.text)   # <--- AJOUTE CETTE LIGNE pour debug
            if response.status_code != 201:
                response.failure(f"POST failed: {response.text}")