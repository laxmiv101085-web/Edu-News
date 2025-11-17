"""News scraping tasks."""
from app.tasks.celery_app import celery_app
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from app.config import settings
from app.models import Article, ScrapeLog
from app.database import Base
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# Create engine for worker
engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@celery_app.task(name="app.tasks.scrape.scrape_news_task")
def scrape_news_task():
    """Scrape news articles and save to database."""
    import asyncio
    return asyncio.run(_scrape_news_async())


async def _scrape_news_async():
    """Async scraping logic."""
    async with AsyncSessionLocal() as db:
        try:
            logger.info("Starting news scrape...")
            
            # Import scraper
            from scripts.scraper import generate_sample_articles
            
            # Generate sample articles
            articles_data = generate_sample_articles()
            
            new_count = 0
            skipped_count = 0
            
            for article_data in articles_data:
                # Check if article already exists by source_url
                result = await db.execute(
                    select(Article).where(Article.source_url == article_data["source_url"])
                )
                existing = result.scalar_one_or_none()
                
                if existing:
                    skipped_count += 1
                    continue
                
                # Create new article
                article = Article(**article_data)
                db.add(article)
                new_count += 1
            
            await db.commit()
            
            # Log scrape result
            log_entry = ScrapeLog(
                source="sample_scraper",
                status="success" if new_count > 0 else "partial",
                notes=f"Added {new_count} new articles, skipped {skipped_count} duplicates",
            )
            db.add(log_entry)
            await db.commit()
            
            logger.info(f"Scrape completed: {new_count} new, {skipped_count} skipped")
            return {"new": new_count, "skipped": skipped_count}
            
        except Exception as e:
            logger.error(f"Scraping failed: {str(e)}", exc_info=True)
            
            # Log failure
            async with AsyncSessionLocal() as db:
                log_entry = ScrapeLog(
                    source="sample_scraper",
                    status="failed",
                    notes=f"Error: {str(e)}",
                )
                db.add(log_entry)
                await db.commit()
            
            raise

