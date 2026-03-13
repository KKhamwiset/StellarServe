from app.schemas import MenuItemBase
from uuid import uuid4
from app.models.restaurant import Restaurant
from app.schemas import MenuItemCreate
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.restaurant import MenuItem
from app.schemas.menu import MenuItemResponse
from app.models.user import User
from app.routers.auth import get_current_user

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

@router.post("/{restaurant_id}", response_model=MenuItemResponse)
async def add_menu(restaurant_id : str , items: MenuItemCreate ,db : Session = Depends(get_db)):
    rest = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not rest:
        raise HTTPException(status_code=404, detail="Restaurants not found")
    new_menu = MenuItem(
        id=f"m-{uuid4().hex[:4]}",
        restaurant_id=restaurant_id,
        name=items.name,
        description=items.description,
        price=items.price,
        category=items.category or "Main",
        is_available=True        
    )
    db.add(new_menu)
    db.commit()
    db.refresh(new_menu)
    return new_menu

@router.put("/{restaurant_id}/{item_id}", response_model=MenuItemResponse)
async def update_menu(
    restaurant_id: str,
    item_id: str,
    data: MenuItemBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    item = db.query(MenuItem).join(Restaurant).filter(
        MenuItem.id == item_id,
        MenuItem.restaurant_id == restaurant_id,
        Restaurant.owner_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    item.name = data.name
    item.description = data.description
    item.price = data.price
    item.category = data.category
    item.is_available = data.is_available

    db.commit()
    db.refresh(item)

    return item