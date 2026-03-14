from sqlalchemy import Column, Integer, String, DateTime, UniqueConstraint , ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(String, ForeignKey("restaurants.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "restaurant_id", name="unique_user_restaurant"),
    )

    user = relationship("User", back_populates="favorites")
    restaurant = relationship("Restaurant", back_populates="favorites")