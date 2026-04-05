from sqlalchemy.orm import Session
from . import models, schemas, auth

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email, 
        name=user.name, 
        uid=user.email, # Using email as UID for simple auth, or generate uuid
        xp=0,
        coins=50 # Signup bonus
    )
    # Note: We'd store hashed password in specific field (e.g. hashed_password)
    # Updating model to support password for this demo (if using local auth)
    # For now, let's assume we integrate this fully later.
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_scan(db: Session, scan: schemas.ScanCreate, user_id: int):
    db_scan = models.Scan(**scan.dict(), user_id=user_id)
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    return db_scan

def get_listings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Listing).offset(skip).limit(limit).all()

def create_listing(db: Session, listing: schemas.ListingCreate, user_id: int):
    db_listing = models.Listing(**listing.dict(), seller_id=user_id)
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing
