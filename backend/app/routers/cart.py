from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.cart import Cart, CartItem
from app.models.restaurant import MenuItem, Restaurant
from app.schemas.cart import CartResponse, CartItemCreate, CartItemResponse
from .auth import get_current_user

router = APIRouter()


@router.get("/", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get the current user's active cart."""
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        # Create an empty cart if one doesn't exist
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    return _build_cart_response(cart, db)


@router.post("/items", response_model=CartResponse)
async def add_item_to_cart(
    item_in: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a MenuItem to the cart."""
    menu_item = db.query(MenuItem).filter(MenuItem.id == item_in.menu_item_id).first()
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    if not menu_item.is_available:
        raise HTTPException(status_code=400, detail="Menu item is not available")

    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.flush()

    # Check if item already exists in cart
    cart_item = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.menu_item_id == menu_item.id)
        .first()
    )

    if cart_item:
        cart_item.quantity += item_in.quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id, menu_item_id=menu_item.id, quantity=item_in.quantity, restaurant_id=item_in.restaurant_id
        )
        db.add(cart_item)

    db.commit()
    db.refresh(cart)
    return _build_cart_response(cart, db)


@router.delete("/items/{item_id}", response_model=CartResponse)
async def remove_item_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove an item from the cart."""
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart_item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    db.delete(cart_item)
    db.commit()
    db.refresh(cart)

    return _build_cart_response(cart, db)


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Clear the entire cart."""
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if cart:
        db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        db.commit()
    return


def _build_cart_response(cart: Cart, db: Session) -> CartResponse:
    """Helper to calculate totals and populate nested response."""
    items = []
    total_price = 0.0

    # Ensure items are loaded
    for item in cart.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
        if menu_item:
            subtotal = menu_item.price * item.quantity
            total_price += subtotal
            items.append(
                CartItemResponse(
                    id=item.id,
                    menu_item_id=item.menu_item_id,
                    quantity=item.quantity,
                    restaurant_id=item.restaurant_id,
                    name=menu_item.name,
                    price=menu_item.price,
                    subtotal=subtotal,
                )
            )

    return CartResponse(
        id=cart.id,
        user_id=cart.user_id,
        items=items,
        total_price=total_price,
    )
