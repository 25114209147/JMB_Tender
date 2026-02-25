from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from core.security import get_current_user, create_access_token, verify_password, hash_password, validate_password_strength
from database import get_db
from models.user import User
from schemas.user import RegisterRequest, LoginRequest, LoginResponse, UserResponse, UserProfileUpdateRequest, LoginUser  
from sqlalchemy import select

router = APIRouter()

@router.post("/register", response_model=LoginResponse)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
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

    # Auto-login after registration
    access_token = create_access_token(data={"sub": str(user.id)})
    user_data = LoginUser(
        id=user.id,
        email=user.email,
        role=user.role,
        name=user.name
    )
    return LoginResponse(access_token=access_token, token_type="bearer", user=user_data)


@router.post("/login", response_model=LoginResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # Find user by email (OAuth2 form uses 'username' field for email)
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    user_data = LoginUser(
        id=user.id,
        email=user.email,
        role=user.role,
        name=user.name
    )
    
    return LoginResponse(access_token=access_token, token_type="bearer", user=user_data)
    

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_user_profile(
    profile_data: UserProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    update_date = profile_data.model_dump(exclude_unset=True)
    for key, value in update_date.items():
        setattr(current_user, key, value)

    await db.commit()
    await db.refresh(current_user)
    return current_user

