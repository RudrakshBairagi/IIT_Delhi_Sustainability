from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, users, listings, scans, ai
from .database import engine, Base

# Rate Limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)

# Create tables on startup (simple approach for dev)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ReLoop API",
    description="Backend for ReLoop - Sustainable Campus Trading Platform",
    version="0.1.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(users.router)
app.include_router(listings.router)
app.include_router(scans.router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to ReLoop API v1"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
