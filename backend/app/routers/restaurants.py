from app.schemas import RestaurantResponse, RestaurantUpdate
from app.models.restaurant import Restaurant
from app.models.user import User
from app.routers.auth import get_current_user
from app.database import get_db
from app.models.restaurant import MenuItem
from app.models.order import Order
from app.schemas import MenuItemResponse, OrderResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
import datetime

router = APIRouter()


@router.get("/", response_model=list[RestaurantResponse])
async def list_restaurants(db: Session = Depends(get_db)):
    """List all available restaurants."""
    restaurants = db.query(Restaurant).all()
    return restaurants


@router.get("/mine", response_model=RestaurantResponse)
async def get_my_restaurant(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.owner_id == current_user.id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="No restaurant found")
    return restaurant

@router.patch("/{restaurant_id}/status", response_model=RestaurantResponse)
async def update_restaurant_status(
    restaurant_id: str, 
    is_open: bool, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggle a restaurant's open/closed status."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    if restaurant.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this restaurant")
    
    restaurant.is_open = is_open
    db.commit()
    db.refresh(restaurant)
    return restaurant

@router.get("/{restaurant_id}", response_model=RestaurantResponse)
async def get_restaurant(restaurant_id: str, db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)):
    """Get a specific restaurant by ID."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

@router.put("/{restaurant_id}", response_model=RestaurantResponse)
async def update_restaurant(
    restaurant_id: str,
    update_data: RestaurantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update restaurant details including image_url"""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    if restaurant.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this restaurant")
    
    if update_data.name is not None:
        restaurant.name = update_data.name
    if update_data.description is not None:
        restaurant.description = update_data.description
    if update_data.image_url is not None:
        restaurant.image_url = update_data.image_url
        
    db.commit()
    db.refresh(restaurant)
    return restaurant

@router.get("/{restaurant_id}/revenue")
async def get_total_revenue(
    restaurant_id : str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status=401,detail="Unthorized access endpoint")
    if current_user.role != "seller":
        raise HTTPException(status=401,detail="Unthorized access endpoint")
    
    sum = db.query(func.sum(Order.total_price)).filter(Order.restaurant_id == restaurant_id).scalar()
    return {"total_revenue": sum or 0}

@router.get("/{restaurant_id}/menu")
async def get_restaurant_menu(
    restaurant_id: str, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Retrieve the total count of items in the restaurant's menu."""
    if not db.query(Restaurant.id).filter(Restaurant.id == restaurant_id).first():
        raise HTTPException(status_code=404, detail="Restaurant not found")
    item_count = db.query(func.count(MenuItem.id)).filter(MenuItem.restaurant_id == restaurant_id).scalar()
    
    return {"items": item_count or 0}

@router.get("/{restaurant_id}/order")
async def get_restaurant_orders(
    restaurant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = db.query(
        func.count(Order.id),
        func.sum(Order.total_price)
    ).filter(
        Order.restaurant_id == restaurant_id,
        func.date(Order.created_at) == datetime.date.today()
    ).first()

    return {
        "orders_count": result[0],
        "income": result[1] or 0
    }
