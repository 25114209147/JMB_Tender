from pydantic import BaseModel, EmailStr, fields
from typing import Optional

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str = "contractor"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginUser(BaseModel):
    id: int
    email: EmailStr
    role: str
    name: Optional[str] = None
    
    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: LoginUser

class UserProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    company_name: Optional[str] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    name: Optional[str] = None
    company_name: Optional[str] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None

    class Config:
        from_attributes = True