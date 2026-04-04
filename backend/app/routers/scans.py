from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated

from .. import crud, models, schemas, database, auth
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

router = APIRouter(
    prefix="/scans",
    tags=["scans"]
)

# Get accessibility to the limiter from the app state in a real app, 
# or just instantiate a new one if using key_func=get_remote_address which is stateless enough
limiter = Limiter(key_func=get_remote_address)

@router.post("/", response_model=schemas.Scan)
@limiter.limit("5/minute")
def create_scan(
    request: Request,
    scan: schemas.ScanCreate,
    current_user: Annotated[models.User, Depends(auth.get_current_user)],
    db: Session = Depends(database.get_db)
):
    # Here we would integrate the AI analysis logic
    # For now, the client sends the result, and we just save it.
    return crud.create_scan(db=db, scan=scan, user_id=current_user.id)
