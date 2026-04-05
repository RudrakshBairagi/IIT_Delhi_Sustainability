from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Token ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

# --- User ---
class UserBase(BaseModel):
    email: str
    name: str | None = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    xp: int = 0
    coins: int = 0
    level: int = 1
    
    class Config:
        from_attributes = True

# --- Scan ---
class ScanBase(BaseModel):
    image_url: str
    classification: str
    detected_object: str | None = None
    confidence: float | None = None

class ScanCreate(ScanBase):
    pass

class Scan(ScanBase):
    id: int
    created_at: datetime
    user_id: int | None = None

    class Config:
        from_attributes = True

# --- Listing ---
class ListingBase(BaseModel):
    title: str
    description: str
    price: float
    category: str
    condition: str
    images: List[str] = []
    location: str | None = None

class ListingCreate(ListingBase):
    pass

class Listing(ListingBase):
    id: int
    seller_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
