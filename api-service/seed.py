import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api_service.settings')
django.setup()

from services.models import Category

categories = [
    {"name": "Plomberie", "slug": "plomberie", "icon": "Wrench"},
    {"name": "Électricité", "slug": "electricite", "icon": "Zap"},
    {"name": "Ménage", "slug": "menage", "icon": "Sparkles"},
    {"name": "Jardinage", "slug": "jardinage", "icon": "Leaf"},
    {"name": "Bricolage", "slug": "bricolage", "icon": "Hammer"},
    {"name": "Informatique", "slug": "informatique", "icon": "Monitor"},
]

for cat in categories:
    Category.objects.get_or_create(
        slug=cat["slug"],
        defaults={"name": cat["name"], "icon": cat["icon"], "description": f"Services de {cat['name'].lower()}"}
    )

print("Catégories créées avec succès !")
