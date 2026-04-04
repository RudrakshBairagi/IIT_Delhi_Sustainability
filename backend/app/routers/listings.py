from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Annotated

from .. import crud, models, schemas, database, auth

router = APIRouter(
    prefix="/listings",
    tags=["listings"]
)

@router.get("/", response_model=List[schemas.Listing])
def read_listings(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    listings = crud.get_listings(db, skip=skip, limit=limit)
    return listings

@router.post("/", response_model=schemas.Listing)
def create_listing(
    listing: schemas.ListingCreate,
    current_user: Annotated[models.User, Depends(auth.get_current_user)],
    db: Session = Depends(database.get_db)
):
    return crud.create_listing(db=db, listing=listing, user_id=current_user.id)
