from pydantic import BaseModel, EmailStr
from typing import Optional, List

# Base Schemas
class UserBase(BaseModel):
    email: EmailStr
    role: str = "contractor"
    name: Optional[str] = None
    company_name: Optional[str] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None

# Request models
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str
    role: str = "contractor"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    company_name: Optional[str] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None

# Response models
class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int