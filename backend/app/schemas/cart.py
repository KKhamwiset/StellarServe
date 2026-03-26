from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .restaurant import RestaurantResponse

class CartItemBase(BaseModel):
    menu_item_id: str
    quantity: int
    restaurant_id: str

class CartItemCreate(CartItemBase):
    pass

class CartItemResponse(CartItemBase):
    id: int
    name: str
    price: float
    subtotal: float
    restaurant: RestaurantResponse
    class Config:
        from_attributes = True

class CartBase(BaseModel):
    pass

class CartResponse(CartBase):
    id: int
    user_id: int
    items: List[CartItemResponse] = []
    total_price: float = 0.0

    class Config:
        from_attributes = True
