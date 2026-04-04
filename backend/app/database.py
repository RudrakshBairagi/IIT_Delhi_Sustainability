from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Default to local postgres if not specified
# Ensure you create a database named 'reloop' in your postgres instance
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://ankushjha@localhost/reloop")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
