import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auth_service.settings')
application = get_wsgi_application()

# Enregistrement Consul au démarrage
from auth_service.consul_register import register_service
try:
    register_service()
except Exception:
    pass