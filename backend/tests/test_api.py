"""Basic API tests."""
import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    """Test health check endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_signup():
    """Test user signup."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/signup",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "password": "Test1234"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data


@pytest.mark.asyncio
async def test_login():
    """Test user login."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # First signup
        await client.post(
            "/api/auth/signup",
            json={
                "name": "Test User",
                "email": "testlogin@example.com",
                "password": "Test1234"
            }
        )
        
        # Then login
        response = await client.post(
            "/api/auth/login",
            json={
                "email": "testlogin@example.com",
                "password": "Test1234"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data


@pytest.mark.asyncio
async def test_get_news():
    """Test get news endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/news")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data

