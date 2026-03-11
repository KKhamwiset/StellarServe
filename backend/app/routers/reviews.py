from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.cart import Cart, CartItem
from app.models.restaurant import MenuItem, Restaurant
from app.models.reviews import Review
from app.schemas.cart import CartResponse, CartItemCreate, CartItemResponse
from app.routers.auth import get_current_user
from app.schemas.reviews import ReviewCreate, ReviewResponse

router = APIRouter()

@router.post("/{restaurant_id}", response_model=ReviewResponse)
async def create_review(restaurant_id: str, review: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create a new review."""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    new_review = Review(
        rating=review.rating,
        comment=review.comment,
        user_id=current_user.id,
        restaurant_id=restaurant.id
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.restaurant_id == restaurant.id).scalar()
    if avg_rating is not None:
        restaurant.rating = float(avg_rating)
        db.commit()
    
    return new_review

@router.get("/{restaurant_id}", response_model=List[ReviewResponse])
async def get_reviews(restaurant_id: str, db: Session = Depends(get_db)):
    """Get all reviews for a restaurant."""
    reviews = db.query(Review).filter(Review.restaurant_id == restaurant_id).all()

    return reviews

@router.get("/check/{restaurant_id}")
async def check_user_review(
    restaurant_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if the currently logged-in user has already reviewed this restaurant."""
    review = db.query(Review).filter(
        Review.user_id == current_user.id, 
        Review.restaurant_id == restaurant_id
    ).first()
    
    return {"has_reviewed": review is not None}
