from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.restaurant import MenuItem
from app.schemas import MenuItemResponse

router = APIRouter()

@router.get("/{restaurant_id}", response_model=list[MenuItemResponse])
async def get_menu(restaurant_id: str, db: Session = Depends(get_db)):
    """Get menu items for a specific restaurant."""
    items = db.query(MenuItem).filter(MenuItem.restaurant_id == restaurant_id).all()
    return items


@router.get("/{restaurant_id}/{item_id}", response_model=MenuItemResponse)
async def get_menu_item(restaurant_id: str, item_id: str, db: Session = Depends(get_db)):
    """Get a specific menu item."""
    item = db.query(MenuItem).filter(
        MenuItem.restaurant_id == restaurant_id,
        MenuItem.id == item_id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
        
    return item
