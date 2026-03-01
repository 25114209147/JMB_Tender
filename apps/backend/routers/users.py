from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from core.security import get_current_user, hash_password, validate_password_strength, verify_password, create_access_token, require_role
from database import get_db
from models.users import User
from schemas.users import RegisterRequest, LoginResponse, UserResponse, UserProfileUpdateRequest, UserListResponse, LoginRequest
from datetime import timedelta

router = APIRouter()


@router.post("/token", response_model=LoginResponse, include_in_schema=True)
async def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    OAuth2 compatible token endpoint for Swagger UI authorization.
    Use this endpoint to authorize in Swagger UI's "Authorize" button.
    
    - **username**: Your email address
    - **password**: Your password
    """
    # Find user by email (username field contains email)
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
    
    user_data = UserResponse.model_validate(user)
    return LoginResponse(access_token=access_token, token_type="bearer", user=user_data)



@router.get("/", response_model=UserListResponse)
async def get_users(page: int = 1, page_size: int = 10, current_user: User = Depends(require_role("admin")), db: AsyncSession = Depends(get_db)):
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)  # Max 100 items per page
    
    offset = (page - 1) * page_size
    
    # Get users for current page
    result = await db.execute(select(User).offset(offset).limit(page_size))
    users = list(result.scalars().all())
    
    # Get total count
    total_count_result = await db.execute(
        select(func.count()).select_from(User)
    )
    total_count = total_count_result.scalar_one()

    total_pages = (total_count + page_size - 1) // page_size

    return UserListResponse(
        users=[UserResponse.model_validate(user) for user in users],
        total=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )



@router.post("/register", response_model=LoginResponse)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    is_valid, message = validate_password_strength(data.password)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=message)
    
    if data.password != data.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Passwords do not match")
    
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == data.email))
    user_existed = result.scalars().first()
    
    if user_existed:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    allowed_roles = ["JMB", "contractor", "admin"]
    if data.role not in allowed_roles:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
    
    # Create new user
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        role=data.role
    )
    db.add(user)
    try:
        await db.commit()
        await db.refresh(user)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    # Create access token for auto login
    access_token = create_access_token(data={"sub": str(user.id)})
    
    user_data = UserResponse.model_validate(user)
    return LoginResponse(access_token=access_token, token_type="bearer", user=user_data)



@router.post("/login", response_model=LoginResponse)
async def login(form_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Find user by email
    result = await db.execute(select(User).where(User.email == form_data.email))  
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    # Set token expiration based on remember_me
    expires_delta = timedelta(days=30) if form_data.remember_me else timedelta(minutes=15)
    
    access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=expires_delta)
    
    user_data = UserResponse.model_validate(user)
    return LoginResponse(access_token=access_token, token_type="bearer", user=user_data)



@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    current_user: User = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific user by ID (Admin only)
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    
    return UserResponse.model_validate(user)


@router.patch("/me", response_model=UserResponse)
async def update_user_profile(
    profile_data: UserProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    update_data = profile_data.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return UserResponse.model_validate(current_user)
