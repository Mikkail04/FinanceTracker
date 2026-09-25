from pydantic import BaseModel, EmailStr
from datetime import datetime


class Transaction(BaseModel):
    amount: float
    merchant: str
    date: datetime
    category: str | None = None


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
