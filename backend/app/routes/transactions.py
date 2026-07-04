# from fastapi import APIRouter
# from app.db import db
# from app.models import Transaction

# router = APIRouter()

# @router.post("/transactions")
# def add_transaction(tx: Transaction):
#     result = db.transactions.insert_one(tx.dict())
#     return {"id": str(result.inserted_id)}

from fastapi import APIRouter
from app.db import db
from app.models import Transaction
from bson import ObjectId
from app.services.categorizer import categorize_transaction
from app.services.subscriptions import detect_subscriptions
from bson import ObjectId
from fastapi import HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from typing import Optional

router = APIRouter()

# CREATE transaction
# @router.post("/transactions")
# def add_transaction(tx: Transaction):
#     result = db.transactions.insert_one(tx.dict())
#     return {"id": str(result.inserted_id)}
@router.post("/transactions")
def add_transaction(tx: Transaction):
    category = categorize_transaction(tx.merchant, tx.amount)
    
    if not category:
        category = "Other"

    tx_dict = tx.dict()
    tx_dict["category"] = category

    result = db.transactions.insert_one(tx_dict)

    return {
        "id": str(result.inserted_id),
        "category": category
    }


# GET all transactions
@router.get("/transactions")
def get_transactions():
    data = list(db.transactions.find())

    for item in data:
        item["_id"] = str(item["_id"])

    return data

@router.get("/subscriptions")
def get_subscriptions():
    transactions = list(db.transactions.find())

    for tx in transactions:
        tx["_id"] = str(tx["_id"])

    return detect_subscriptions(transactions)

@router.delete("/transactions/{tx_id}")
def delete_transaction(tx_id: str):
    result = db.transactions.delete_one({"_id": ObjectId(tx_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return {"message": "Deleted successfully"}

class TransactionUpdate(BaseModel):
    merchant: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[datetime] = None
    category: Optional[str] = None

@router.put("/transactions/{tx_id}")
def update_transaction(tx_id: str, update: TransactionUpdate):
    update_data = {k: v for k, v in update.dict().items() if v is not None}

    if not update_data:
        return {"message": "Nothing to update"}

    result = db.transactions.update_one(
        {"_id": ObjectId(tx_id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return {"message": "Updated successfully"}