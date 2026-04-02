# HomeService Platform 🏠🚀

Une plateforme moderne de mise en relation entre clients et prestataires de services à domicile (plomberie, électricité, ménage, etc.), basée sur une architecture **microservices** robuste.

## 🏗️ Architecture

Le projet est divisé en plusieurs services spécialisés :

- **Frontend** : Application React moderne (Tailwind CSS). accessible sur `http://localhost`.
- **Auth Service** : Gestion des utilisateurs et authentification JWT (Django + PostgreSQL).
- **API Service** : Logique métier : catalogue de services, réservations et avis (Django + PostgreSQL).
- **Notification Worker** : Service asynchrone pour l'envoi de notifications (Python + RabbitMQ).
- **Traefik** : Reverse Proxy & Load Balancer pour router le trafic sur le port 80.
- **Consul** : Service Discovery pour la découverte dynamique des services.
- **RabbitMQ** : Message Broker pour la communication asynchrone entre services.

## 🚀 Installation Rapide (Docker)

Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine.

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/abdoufr/home-service-platform.git
   cd home-service-platform
   ```

2. **Lancer les services** :
   ```bash
   docker-compose up -d --build
   ```

3. **Accéder à l'application** :
   - Interface Web : [http://localhost](http://localhost)
   - Dashboard Traefik : [http://localhost:8080](http://localhost:8080)
   - Interface Consul : [http://localhost:8500](http://localhost:8500)
   - RabbitMQ Management : [http://localhost:15672](http://localhost:15672) (guest/guest)

## 👤 Rôles Utilisateurs

- **Client** : Peut parcourir les services, réserver et laisser des avis.
- **Prestataire** : Peut créer des services et gérer ses réservations (accepter/annuler/terminer).
- **Admin** : Gestion complète des utilisateurs, catégories et réservations globales.

## 🛠️ Stack Technique

- **Backend** : Django REST Framework, Python 3.
- **Frontend** : React, Tailwind CSS, Axios.
- **Bases de données** : PostgreSQL (x2).
- **DevOps** : Docker, Docker Compose, Traefik, Consul.
- **Messaging** : RabbitMQ, Celery.

## 📝 Configuration (Windows - Docker Desktop)

Si vous développez sur Windows, assurez-vous d'activer l'option **"Expose daemon on tcp://localhost:2375 without TLS"** dans les paramètres de Docker Desktop pour permettre la découverte automatique des services par Traefik.
