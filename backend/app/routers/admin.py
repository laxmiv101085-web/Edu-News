"""Admin routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime
from typing import Optional
from app.database import get_db
from app.models import User, Article, ScrapeLog
from app.schemas import AdminStatsResponse
from app.dependencies import get_current_admin_user
from app.tasks.scrape import scrape_news_task
from app.models import User

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/seed")
async def seed_data(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Seed database with sample data (admin only)."""
    from scripts.seed_data import seed_database
    
    try:
        await seed_database(db)
        return {"message": "Database seeded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Seeding failed: {str(e)}")


@router.get("/stats", response_model=AdminStatsResponse)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get admin statistics (admin only)."""
    # Count users
    user_count_result = await db.execute(select(func.count(User.id)))
    user_count = user_count_result.scalar()
    
    # Count articles
    article_count_result = await db.execute(select(func.count(Article.id)))
    article_count = article_count_result.scalar()
    
    # Get last scrape time
    last_scrape_result = await db.execute(
        select(ScrapeLog.scraped_at)
        .order_by(ScrapeLog.scraped_at.desc())
        .limit(1)
    )
    last_scrape_time = last_scrape_result.scalar_one_or_none()
    
    return AdminStatsResponse(
        user_count=user_count,
        article_count=article_count,
        last_scrape_time=last_scrape_time,
    )


@router.post("/scrape")
async def trigger_scrape(
    current_user: User = Depends(get_current_admin_user)
):
    """Manually trigger news scraping (admin only)."""
    try:
        task = scrape_news_task.delay()
        return {
            "message": "Scraping task started",
            "task_id": task.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start scraping: {str(e)}")

