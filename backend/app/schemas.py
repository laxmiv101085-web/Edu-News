"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# Auth Schemas
class SignupRequest(BaseModel):
    """Signup request schema."""
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=8)


class LoginRequest(BaseModel):
    """Login request schema."""
    email: EmailStr
    password: str


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema."""
    refresh_token: str


class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


# User Schemas
class UserResponse(BaseModel):
    """User response schema."""
    id: int
    name: str
    email: str
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Article Schemas
class ArticleBase(BaseModel):
    """Base article schema."""
    title: str = Field(..., min_length=1, max_length=500)
    content: str = Field(..., min_length=1)
    source_url: str = Field(..., min_length=1, max_length=1000)
    summary: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    published_at: datetime


class ArticleCreate(ArticleBase):
    """Article creation schema."""
    pass


class ArticleResponse(ArticleBase):
    """Article response schema."""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ArticleListResponse(BaseModel):
    """Paginated article list response."""
    items: List[ArticleResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Admin Schemas
class AdminStatsResponse(BaseModel):
    """Admin statistics response."""
    user_count: int
    article_count: int
    last_scrape_time: Optional[datetime]


# Error Schemas
class ErrorResponse(BaseModel):
    """Error response schema."""
    detail: str

