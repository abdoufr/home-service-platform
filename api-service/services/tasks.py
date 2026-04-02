"""Tâches Celery asynchrones."""
from celery import shared_task
import pika
import json
import os
import logging

logger = logging.getLogger(__name__)


def publish_to_rabbitmq(routing_key, message):
    """Publie un message dans RabbitMQ."""
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=os.environ.get('RABBITMQ_HOST', 'rabbitmq'),
                port=5672,
                credentials=pika.PlainCredentials('guest', 'guest')
            )
        )
        channel = connection.channel()
        channel.exchange_declare(
            exchange='home_service_events',
            exchange_type='topic',
            durable=True
        )
        channel.basic_publish(
            exchange='home_service_events',
            routing_key=routing_key,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2,
                content_type='application/json'
            )
        )
        connection.close()
        logger.info(f"Message publié: {routing_key}")
    except Exception as e:
        logger.error(f"Erreur RabbitMQ: {e}")


@shared_task
def send_booking_notification(booking_data):
    """Envoie une notification de réservation via RabbitMQ."""
    publish_to_rabbitmq('booking.created', {
        'event_type': 'booking_created',
        'data': booking_data
    })
    return f"Notification envoyée pour booking {booking_data.get('id')}"


@shared_task
def send_status_update_notification(booking_id, new_status, client_email):
    """Notifie le changement de statut."""
    publish_to_rabbitmq('booking.status_changed', {
        'event_type': 'booking_status_changed',
        'data': {
            'booking_id': booking_id,
            'new_status': new_status,
            'client_email': client_email,
        }
    })
    return f"Status update notification pour booking {booking_id}"


@shared_task
def update_service_rating(service_id):
    """Recalcule la note moyenne d'un service."""
    from .models import Service, Review
    try:
        service = Service.objects.get(id=service_id)
        reviews = Review.objects.filter(service=service)
        if reviews.exists():
            from django.db.models import Avg
            avg = reviews.aggregate(Avg('rating'))['rating__avg']
            service.rating = round(avg, 2)
            service.total_reviews = reviews.count()
            service.save()
            logger.info(f"Rating mis à jour pour service {service_id}: {service.rating}")
    except Exception as e:
        logger.error(f"Erreur mise à jour rating: {e}")