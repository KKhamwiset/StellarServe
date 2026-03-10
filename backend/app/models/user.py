from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    phone = Column(String, unique=True, index=True)
    role = Column(String, default="consumer", nullable=False)  # "consumer" or "seller"
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    # Audit timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

    # Relationships
    restaurants = relationship("Restaurant", back_populates="owner")

