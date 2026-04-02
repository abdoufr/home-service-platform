from django.db import models


class Category(models.Model):
    """Catégorie de service (plomberie, électricité, ménage…)."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # nom d'icône
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Service(models.Model):
    """Service proposé par un prestataire."""
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='services'
    )
    provider_id = models.IntegerField()  # ID du prestataire (auth-service)
    provider_name = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_unit = models.CharField(
        max_length=20,
        choices=[
            ('HOUR', 'Par heure'),
            ('FIXED', 'Forfait'),
            ('SQMETER', 'Par m²'),
        ],
        default='HOUR'
    )
    city = models.CharField(max_length=100)
    address = models.TextField(blank=True)
    image = models.URLField(blank=True, null=True)
    rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.00
    )
    total_reviews = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'services'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} — {self.provider_name}"


class Booking(models.Model):
    """Réservation d'un service."""

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        CONFIRMED = 'CONFIRMED', 'Confirmée'
        IN_PROGRESS = 'IN_PROGRESS', 'En cours'
        COMPLETED = 'COMPLETED', 'Terminée'
        CANCELLED = 'CANCELLED', 'Annulée'

    service = models.ForeignKey(
        Service, on_delete=models.CASCADE, related_name='bookings'
    )
    client_id = models.IntegerField()
    client_name = models.CharField(max_length=150)
    client_email = models.CharField(max_length=254, blank=True)
    provider_id = models.IntegerField()
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    duration_hours = models.DecimalField(
        max_digits=4, decimal_places=1, default=1.0
    )
    total_price = models.DecimalField(
        max_digits=10, decimal_places=2
    )
    address = models.TextField()
    notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking #{self.id} — {self.service.title}"


class Review(models.Model):
    """Avis sur un service après réservation."""
    booking = models.OneToOneField(
        Booking, on_delete=models.CASCADE, related_name='review'
    )
    service = models.ForeignKey(
        Service, on_delete=models.CASCADE, related_name='reviews'
    )
    client_id = models.IntegerField()
    client_name = models.CharField(max_length=150)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']

    def __str__(self):
        return f"Review {self.rating}★ — {self.service.title}"