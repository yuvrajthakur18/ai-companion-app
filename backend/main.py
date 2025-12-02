from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from .models import User
from .database import db
from .auth import verify_password, get_password_hash, create_access_token, get_current_user
from .routers import companions

app = FastAPI(title="AI Companion API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # React dev server
        "https://your-frontend.up.railway.app",   # Change to your actual frontend URL
        "https://*.railway.app",          # Or use wildcard if multiple
        "https://yourdomain.com",          # Your future custom domain
    ],
    allow_credentials=True,
    allow_methods=["*"],       
    allow_headers=["*"],      
)

app.include_router(companions.router)

@app.post("/register")
async def register(user: User):
    if db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    db.users.insert_one({"username": user.username, "hashed_password": hashed_password})
    return {"msg": "User created"}

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}