"""Application configuration from environment variables."""
from pydantic_settings import BaseSettings  # pyright: ignore[reportMissingImports]
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@db:5432/edunews"
    
    # Redis
    REDIS_URL: str = "redis://redis:6379/0"
    
    # JWT
    JWT_SECRET: str = "changeme123"
    ACCESS_TOKEN_EXPIRES_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRES_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    # Server
    BACKEND_PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    # Celery
    CELERY_BROKER_URL: str = "redis://redis:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://redis:6379/0"
    
    # Scraper
    SCRAPE_INTERVAL_MINUTES: int = 15
    
    class Config:
        env_file = ".env"
        env_file_encoding ="utf-8"
        extra ="ignore"  # pyright: ignore[reportUndefinedVariable]
        case_sensitive = True
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()