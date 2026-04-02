import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_service.settings')
application = get_wsgi_application()

from api_service.consul_register import register_service

try:
    register_service()
except Exception:
    pass