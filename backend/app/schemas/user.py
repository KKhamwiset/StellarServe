from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = "consumer"  # "consumer" or "seller"

class UserCreate(UserBase):
    password: str
    restaurant_name: Optional[str] = None

class UserLogin(BaseModel):
    identifier: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    role: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
