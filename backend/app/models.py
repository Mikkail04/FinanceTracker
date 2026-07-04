from pydantic import BaseModel
from datetime import datetime

class Transaction(BaseModel):
    user_id: str
    amount: float
    merchant: str
    date: datetime
    category: str | None = None