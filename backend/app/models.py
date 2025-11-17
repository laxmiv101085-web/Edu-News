"""SQLAlchemy database models."""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ARRAY
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime


class User(Base):
    """User model."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Article(Base):
    """Article/News model."""
    __tablename__ = "articles"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False, index=True)
    content = Column(Text, nullable=False)
    source_url = Column(String(1000), unique=True, index=True, nullable=False)
    summary = Column(Text)
    tags = Column(ARRAY(String), default=[], nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ScrapeLog(Base):
    """Scraping operation log."""
    __tablename__ = "scrape_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(255), nullable=False)
    scraped_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    status = Column(String(50), nullable=False)  # 'success', 'failed', 'partial'
    notes = Column(Text)

