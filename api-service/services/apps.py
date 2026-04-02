from django.apps import AppConfig

class ServicesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'services'

    def ready(self):
        import os
        # Éviter la double exécution si le reloader de Django est actif
        if os.environ.get('RUN_MAIN') == 'true' or not os.environ.get('DEBUG') == 'True':
            try:
                from api_service.consul_register import register_service
                register_service()
            except Exception as e:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Erreur enregistrement Consul : {e}")
