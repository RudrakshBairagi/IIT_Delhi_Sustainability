from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, ARRAY, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String, unique=True, index=True) # Firebase Auth UID (if syncing) or Custom ID
    email = Column(String, unique=True, index=True)
    name = Column(String)
    avatar_url = Column(String, nullable=True)
    
    # Gamification
    xp = Column(Integer, default=0)
    coins = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak = Column(Integer, default=0)
    badges = Column(ARRAY(String), default=[])
    
    # Impact
    co2_saved = Column(Float, default=0.0)
    items_traded = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    listings = relationship("Listing", back_populates="seller")
    scans = relationship("Scan", back_populates="user")
    makeover_requests = relationship("MakeoverRequest", back_populates="owner")


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    price = Column(Float)
    condition = Column(String)
    category = Column(String)
    images = Column(ARRAY(String))
    location = Column(String, nullable=True)
    
    status = Column(String, default="available") # available, sold, pending
    is_top_impact = Column(Boolean, default=False)
    co2_saved = Column(Float, default=0.0)
    
    seller_id = Column(Integer, ForeignKey("users.id"))
    seller = relationship("User", back_populates="listings")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String)
    
    # AI Results
    classification = Column(String) # safe, hazardous, non_reusable
    detected_object = Column(String)
    confidence = Column(Float)
    estimated_value = Column(Float)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="scans")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MakeoverRequest(Base):
    """For the Artist Commission / Upcycling path"""
    __tablename__ = "makeover_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    item_title = Column(String)
    description = Column(String)
    status = Column(String, default="pending") # pending, accepted, in_progress, completed
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="makeover_requests")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
