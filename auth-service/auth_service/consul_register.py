import consul
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def register_service():
    """Enregistre le service auth dans Consul."""
    try:
        c = consul.Consul(
            host=settings.CONSUL_HOST,
            port=settings.CONSUL_PORT
        )
        c.agent.service.register(
            name=settings.SERVICE_NAME,
            service_id=f"{settings.SERVICE_NAME}-{settings.SERVICE_PORT}",
            address=settings.SERVICE_HOST,
            port=settings.SERVICE_PORT,
            tags=[
                'traefik.enable=true',
                'traefik.http.routers.auth.rule=PathPrefix("/api/auth")',
                'traefik.http.routers.auth.entrypoints=web',
                'traefik.http.services.auth.loadbalancer.server.port=8001',
                'auth', 'jwt', 'django'
            ],
            check=consul.Check.http(
                f"http://{settings.SERVICE_HOST}:{settings.SERVICE_PORT}/api/auth/health/",
                interval='10s',
                timeout='5s'
            )
        )
        logger.info(f"Service {settings.SERVICE_NAME} enregistré dans Consul")
    except Exception as e:
        logger.error(f"Erreur lors de l'enregistrement Consul: {e}")

def deregister_service():
    """Désenregistre le service de Consul."""
    try:
        c = consul.Consul(
            host=settings.CONSUL_HOST,
            port=settings.CONSUL_PORT
        )
        c.agent.service.deregister(
            f"{settings.SERVICE_NAME}-{settings.SERVICE_PORT}"
        )
        logger.info(f"Service {settings.SERVICE_NAME} désenregistré de Consul")
    except Exception as e:
        logger.error(f"Erreur lors du désenregistrement Consul: {e}")