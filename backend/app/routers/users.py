"""User routes."""
from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.models import User
from app.schemas import UserResponse

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user's profile."""
    return current_user

