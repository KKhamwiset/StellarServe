from pydantic import BaseModel, Field
from datetime import datetime


# ─── Restaurant ──────────────────────────────────────────
class RestaurantBase(BaseModel):
    name: str
    description: str | None = None
    cuisine_type: str | None = None
    address: str
    phone: str | None = None
    image_url: str | None = None
    rating: float = Field(default=0.0, ge=0, le=5)
    is_open: bool = True
    opening_time: str | None = None  # e.g. "18:00"
    closing_time: str | None = None  # e.g. "04:00"


class RestaurantResponse(RestaurantBase):
    id: str
    created_at: datetime | None = None


# ─── Menu Item ───────────────────────────────────────────
class MenuItemBase(BaseModel):
    name: str
    description: str | None = None
    price: float = Field(ge=0)
    category: str | None = None
    image_url: str | None = None
    is_available: bool = True


class MenuItemResponse(MenuItemBase):
    id: str
    restaurant_id: str


# ─── Order ───────────────────────────────────────────────
class OrderItemCreate(BaseModel):
    menu_item_id: str
    quantity: int = Field(ge=1)
    special_instructions: str | None = None


class OrderCreate(BaseModel):
    restaurant_id: str
    items: list[OrderItemCreate]
    delivery_address: str
    phone: str
    notes: str | None = None


class OrderItemResponse(BaseModel):
    menu_item_id: str
    name: str
    quantity: int
    price: float
    subtotal: float


class OrderResponse(BaseModel):
    id: str
    restaurant_id: str
    restaurant_name: str
    items: list[OrderItemResponse]
    total: float
    status: str  # pending, confirmed, preparing, delivering, delivered, cancelled
    delivery_address: str
    phone: str
    notes: str | None = None
    created_at: datetime


# ─── Auth ────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    phone: str | None = None


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str | None = None
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
