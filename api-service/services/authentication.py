"""
Authentification JWT personnalisée.
Le token est validé localement avec la clé partagée.
"""
import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings


class SimpleUser:
    """Objet utilisateur léger reconstitué depuis le JWT."""

    def __init__(self, payload):
        self.id = payload.get('user_id')
        self.username = payload.get('username', '')
        self.role = payload.get('role', 'CLIENT')
        self.is_authenticated = True
        self.is_active = True
        self.is_staff = self.role == 'ADMIN'
        self.is_superuser = self.role == 'ADMIN'

    def __str__(self):
        return self.username


class JWTAuthenticationFromAuthService(BaseAuthentication):
    """Vérifie le JWT avec la clé partagée."""

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(
                token,
                settings.SIMPLE_JWT['SIGNING_KEY'],
                algorithms=[settings.SIMPLE_JWT['ALGORITHM']],
            )
            user = SimpleUser(payload)
            return (user, token)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expiré.')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Token invalide.')