from fastapi import APIRouter, HTTPException
from app.db import db
from app.models import UserCreate, UserLogin
from passlib.context import CryptContext
from jose import jwt
import os

router = APIRouter()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
def register(user: UserCreate):
    existing_user = db.users.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(user.password)

    result = db.users.insert_one(
        {"email": user.email, "password_hash": hashed_password}
    )

    token = jwt.encode(
        {
            "user_id": str(result.inserted_id),
            "email": user.email,
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return {
        "message": "User created",
        "token": token,
    }


@router.post("/login")
def login(user: UserLogin):
    existing_user = db.users.find_one({"email": user.email})

    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    password_correct = pwd_context.verify(user.password, existing_user["password_hash"])

    if not password_correct:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = jwt.encode(
        {"user_id": str(existing_user["_id"]), "email": existing_user["email"]},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return {"message": "Login successful", "token": token}
