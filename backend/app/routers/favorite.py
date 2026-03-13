# from fastapi import APIRouter , Depends , HTTPException , status
# from sqlalchemy.orm import Session
# from app.database import get_db
# from app.models.user import User
# from app.models.user import Favorite
# from app.schemas.favorite import FavoriteResponse, FavoriteCreate
# from app.routers.auth import get_current_user

# router = APIRouter()

# @router.post("/", response_model=FavoriteResponse)
# async def add_favorite(favorite_in: FavoriteCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     favorite = Favorite(**favorite_in.dict(), user_id=current_user.id)
#     db.add(favorite)
#     db.commit()
#     db.refresh(favorite)
#     return favorite

# @router.get("/", response_model=list[FavoriteResponse])
# async def get_favorites(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     favorites = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
#     return favorites

# @router.delete("/{favorite_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def remove_favorite(favorite_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     favorite = db.query(Favorite).filter(Favorite.id == favorite_id, Favorite.user_id == current_user.id).first()
#     if not favorite:
#         raise HTTPException(status_code=404, detail="Favorite not found")
#     db.delete(favorite)
#     db.commit()
#     return

# @router.get("/check/{restaurant_id}", response_model=bool)
# async def check_favorite(restaurant_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     favorite = db.query(Favorite).filter(Favorite.restaurant_id == restaurant_id, Favorite.user_id == current_user.id).first()
#     return favorite is not None