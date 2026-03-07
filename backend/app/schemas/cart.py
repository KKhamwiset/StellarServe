from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CartItemBase(BaseModel):
    menu_item_id: str
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemResponse(CartItemBase):
    id: int
    name: str
    price: float
    subtotal: float

    class Config:
        from_attributes = True

class CartBase(BaseModel):
    restaurant_id: Optional[str] = None

class CartResponse(CartBase):
    id: int
    user_id: int
    items: List[CartItemResponse] = []
    total_price: float = 0.0

    class Config:
        from_attributes = True
