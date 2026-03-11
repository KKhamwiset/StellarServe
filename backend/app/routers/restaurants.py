from app.schemas import RestaurantResponse
from app.models.restaurant import Restaurant
from app.models.user import User
from app.routers.auth import get_current_user
from app.database import get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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

@router.get("/{restaurant_id}", response_model=RestaurantResponse)
async def get_restaurant(restaurant_id: str, db: Session = Depends(get_db)):
    """Get a specific restaurant by ID."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

