from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, models, schemas, database, auth
from typing import Annotated

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/me", response_model=schemas.User)
async def read_users_me(
    current_user: Annotated[models.User, Depends(auth.get_current_user)]
):
    return current_user

@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(database.get_db)):
    db_user = crud.get_user(db, user_id=user_id) # Need to add get_user to crud
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
