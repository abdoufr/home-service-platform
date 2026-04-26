import consul
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def register_service():
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
                'traefik.http.routers.api.rule=PathPrefix(`/api`) && !PathPrefix(`/api/auth`)',
                'traefik.http.routers.api.entrypoints=web',
                'traefik.http.services.api.loadbalancer.server.port=8002',
                'api', 'services', 'django'
            ],
            check=consul.Check.http(
                f"http://{settings.SERVICE_HOST}:{settings.SERVICE_PORT}/api/health/",
                interval='10s',
                timeout='5s'
            )
        )
        logger.info(f"Service {settings.SERVICE_NAME} enregistré dans Consul")
    except Exception as e:
        logger.error(f"Erreur Consul: {e}")