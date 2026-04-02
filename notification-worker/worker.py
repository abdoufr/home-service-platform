"""
Worker de notifications — consomme les événements RabbitMQ
et traite les notifications (email, log, etc.)
"""
import pika
import json
import os
import time
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)

RABBITMQ_HOST = os.environ.get('RABBITMQ_HOST', 'rabbitmq')
EXCHANGE_NAME = 'home_service_events'


def process_booking_created(data):
    """Traitement d'une nouvelle réservation."""
    logger.info("="*60)
    logger.info("📧 NOUVELLE RÉSERVATION")
    logger.info(f"   Service   : {data.get('service_title')}")
    logger.info(f"   Client    : {data.get('client_name')}")
    logger.info(f"   Email     : {data.get('client_email')}")
    logger.info(f"   Date      : {data.get('scheduled_date')} {data.get('scheduled_time')}")
    logger.info(f"   Prix      : {data.get('total_price')} DA")
    logger.info(f"   Adresse   : {data.get('address')}")
    logger.info("="*60)
    # Ici : envoyer un vrai email (SendGrid, SMTP, etc.)


def process_booking_status_changed(data):
    """Traitement d'un changement de statut."""
    logger.info("="*60)
    logger.info("🔔 CHANGEMENT DE STATUT")
    logger.info(f"   Booking ID : {data.get('booking_id')}")
    logger.info(f"   Nouveau    : {data.get('new_status')}")
    logger.info(f"   Email      : {data.get('client_email')}")
    logger.info("="*60)


def process_user_registered(data):
    """Traitement d'une nouvelle inscription."""
    logger.info("="*60)
    logger.info("👤 NOUVEL UTILISATEUR")
    logger.info(f"   Username : {data.get('username')}")
    logger.info(f"   Email    : {data.get('email')}")
    logger.info(f"   Rôle     : {data.get('role')}")
    logger.info("="*60)


# Mapping des événements vers les handlers
EVENT_HANDLERS = {
    'booking_created': process_booking_created,
    'booking_status_changed': process_booking_status_changed,
    'user_registered': process_user_registered,
    'user_logged_in': lambda d: logger.info(f"🔑 Connexion: {d.get('username')}"),
}


def callback(ch, method, properties, body):
    """Callback pour chaque message reçu."""
    try:
        message = json.loads(body)
        event_type = message.get('event_type', 'unknown')
        data = message.get('data', {})

        logger.info(f"📩 Événement reçu: {event_type}")

        handler = EVENT_HANDLERS.get(event_type)
        if handler:
            handler(data)
        else:
            logger.warning(f"Événement inconnu: {event_type}")

        ch.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        logger.error(f"Erreur traitement message: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


def main():
    """Boucle principale du worker."""
    logger.info("🚀 Démarrage du Notification Worker...")

    while True:
        try:
            credentials = pika.PlainCredentials('guest', 'guest')
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=RABBITMQ_HOST,
                    port=5672,
                    credentials=credentials,
                    heartbeat=600,
                    blocked_connection_timeout=300
                )
            )
            channel = connection.channel()

            # Déclarer l'exchange
            channel.exchange_declare(
                exchange=EXCHANGE_NAME,
                exchange_type='topic',
                durable=True
            )

            # Déclarer la queue
            queue_result = channel.queue_declare(
                queue='notification_queue',
                durable=True
            )

            # Binder la queue aux routing keys
            for key in ['auth.*', 'booking.*']:
                channel.queue_bind(
                    exchange=EXCHANGE_NAME,
                    queue='notification_queue',
                    routing_key=key
                )

            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(
                queue='notification_queue',
                on_message_callback=callback,
                auto_ack=False
            )

            logger.info("✅ Worker connecté à RabbitMQ. En attente de messages...")
            channel.start_consuming()

        except pika.exceptions.AMQPConnectionError:
            logger.warning("⚠️ Connexion RabbitMQ perdue. Reconnexion dans 5s...")
            time.sleep(5)
        except KeyboardInterrupt:
            logger.info("Worker arrêté.")
            break
        except Exception as e:
            logger.error(f"Erreur inattendue: {e}")
            time.sleep(5)


if __name__ == '__main__':
    main()