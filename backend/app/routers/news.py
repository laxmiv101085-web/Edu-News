"""News/Articles routes."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import Optional
from math import ceil
from app.database import get_db
from app.models import Article
from app.schemas import ArticleResponse, ArticleListResponse, ArticleCreate
from app.dependencies import get_current_user, get_current_admin_user
from app.models import User
from datetime import datetime

router = APIRouter(prefix="/api/news", tags=["news"])


@router.get("", response_model=ArticleListResponse)
async def get_news(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    tag: Optional[str] = None,
    q: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get paginated list of news articles."""
    # Build query
    query = select(Article)
    
    # Apply filters
    if tag:
        query = query.where(Article.tags.contains([tag]))
    
    if q:
        search_term = f"%{q}%"
        query = query.where(
            or_(
                Article.title.ilike(search_term),
                Article.content.ilike(search_term),
                Article.summary.ilike(search_term),
            )
        )
    
    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination and ordering
    query = query.order_by(Article.published_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)
    
    # Execute
    result = await db.execute(query)
    articles = result.scalars().all()
    
    total_pages = ceil(total / page_size) if total > 0 else 0
    
    return ArticleListResponse(
        items=articles,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(
    article_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a single article by ID."""
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalar_one_or_none()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    return article


@router.post("", response_model=ArticleResponse, status_code=201)
async def create_article(
    article: ArticleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new article (admin only)."""
    # Check for duplicate source_url
    result = await db.execute(select(Article).where(Article.source_url == article.source_url))
    existing = result.scalar_one_or_none()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Article with this source URL already exists",
        )
    
    # Create article
    db_article = Article(**article.model_dump())
    db.add(db_article)
    await db.commit()
    await db.refresh(db_article)
    
    return db_article

