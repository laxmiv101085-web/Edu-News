"""Seed database with initial data."""
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import User, Article
from app.security import get_password_hash
from scripts.scraper import generate_sample_articles
from datetime import datetime


async def seed_database(db: AsyncSession):
    """Seed database with admin user and sample articles."""
    # Create admin user if not exists
    from sqlalchemy import select
    
    admin_result = await db.execute(select(User).where(User.email == "admin@local"))
    admin_user = admin_result.scalar_one_or_none()
    
    if not admin_user:
        admin_user = User(
            name="Admin",
            email="admin@local",
            password_hash=get_password_hash("Test1234"),
            is_admin=True,
        )
        db.add(admin_user)
        await db.commit()
        print("✓ Admin user created: admin@local / Test1234")
    else:
        print("✓ Admin user already exists")
    
    # Create sample articles
    articles_data = generate_sample_articles(count=10)
    new_articles = []
    
    for article_data in articles_data:
        # Check if article exists
        from sqlalchemy import select
        result = await db.execute(
            select(Article).where(Article.source_url == article_data["source_url"])
        )
        existing = result.scalar_one_or_none()
        
        if not existing:
            article = Article(**article_data)
            db.add(article)
            new_articles.append(article)
    
    if new_articles:
        await db.commit()
        print(f"✓ Created {len(new_articles)} sample articles")
    else:
        print("✓ Articles already exist")

