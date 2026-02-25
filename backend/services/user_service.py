from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status

from models.user import User
from schemas.user import RegisterRequest, UserProfileUpdateRequest
from core.security import hash_password, validate_password_strength


class UserService:
    @staticmethod
    async def get_users_paginated(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 10
    ) -> tuple[list[User], int]:
        """Get paginated list of users. Returns: (users, total_count)"""
        # 🔥 Improvement #3: Pagination safety
        page = max(page, 1)
        page_size = min(max(page_size, 1), 100)  # Max 100 items per page
        
        offset = (page - 1) * page_size
        
        # Get users for current page
        result = await db.execute(
            select(User).offset(offset).limit(page_size)
        )
        users = list(result.scalars().all())  # Ensure it's a list, not Sequence
        
        # Get total count
        total_count_result = await db.execute(
            select(func.count()).select_from(User)
        )
        # 🔥 Improvement #4: Use scalar_one() for safety
        total_count = total_count_result.scalar_one()
        
        # 🔥 Improvement #1: Return raw domain data, not Pydantic schemas
        return users, total_count
    
    @staticmethod
    async def register_user(
        db: AsyncSession,
        data: RegisterRequest
    ) -> tuple[User, str]:
        """
        Register a new user
        Returns: (user, access_token)
        """
        from core.security import create_access_token
        
        # Validate password strength
        is_valid, message = validate_password_strength(data.password)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
        
        # Check if email already exists
        result = await db.execute(select(User).where(User.email == data.email))
        user_existed = result.scalars().first()
        
        if user_existed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        user = User(
            email=data.email,
            hashed_password=hash_password(data.password),
            role=data.role
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        return user, access_token
    
    @staticmethod
    async def authenticate_user(
        db: AsyncSession,
        email: str,
        password: str
    ) -> tuple[User, str]:
        """
        Authenticate user and return user with access token
        Returns: (user, access_token)
        """
        from core.security import verify_password, create_access_token
        
        # Find user by email
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        return user, access_token
    
    @staticmethod
    async def update_user_profile(
        db: AsyncSession,
        user: User,
        profile_data: UserProfileUpdateRequest
    ) -> User:
        """Update user profile"""
        update_data = profile_data.model_dump(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(user, key, value)
        
        await db.commit()
        await db.refresh(user)
        
        return user
