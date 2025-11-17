"""Celery application configuration."""
from celery import Celery
from app.config import settings

celery_app = Celery(
    "edunews",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "scrape-news": {
            "task": "app.tasks.scrape.scrape_news_task",
            "schedule": settings.SCRAPE_INTERVAL_MINUTES * 60.0,  # Schedule in seconds
        },
    },
)

