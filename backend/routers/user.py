from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from core.security import get_current_user
from database import get_db
from models.user import User
from schemas.user import RegisterRequest, LoginResponse, UserResponse, UserProfileUpdateRequest, UserListResponse
from services.user_service import UserService

router = APIRouter()

@router.get("/", response_model=UserListResponse)
async def get_users(page: int = 1, page_size: int = 10, db: AsyncSession = Depends(get_db)):
    """Get paginated list of users"""
    # Service returns raw data
    users, total_count = await UserService.get_users_paginated(db, page, page_size)
    
    # Router handles API schema serialization
    return UserListResponse(
        users=[UserResponse.model_validate(user) for user in users],
        total=total_count,
        page=page,
        page_size=page_size
    )

@router.post("/register", response_model=LoginResponse)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    # Service returns raw domain objects
    user, access_token = await UserService.register_user(db, data)
    
    # Router handles API schema creation
    user_data = UserResponse.model_validate(user)
    return LoginResponse(access_token=access_token, token_type="bearer", user=user_data)


@router.post("/login", response_model=LoginResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    """Login with email and password (OAuth2 compatible)"""
    # Service returns raw domain objects
    user, access_token = await UserService.authenticate_user(
        db, 
        email=form_data.username,  # OAuth2 form uses 'username' for email
        password=form_data.password
    )
    
    # Router handles API schema creation
    user_data = UserResponse.model_validate(user)
    return LoginResponse(access_token=access_token, token_type="bearer", user=user_data)
    

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current authenticated user profile"""
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_user_profile(
    profile_data: UserProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user profile"""
    return await UserService.update_user_profile(db, current_user, profile_data)

