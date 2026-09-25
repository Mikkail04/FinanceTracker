from fastapi import APIRouter, Depends, HTTPException
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
from app.auth_utils import get_current_user

router = APIRouter()


@router.post("/transactions")
def add_transaction(tx: Transaction, user_id: str = Depends(get_current_user)):
    category = categorize_transaction(tx.merchant, tx.amount)

    if not category:
        category = "Other"

    tx_dict = tx.dict()
    tx_dict["category"] = category
    tx_dict["user_id"] = user_id

    result = db.transactions.insert_one(tx_dict)

    return {"id": str(result.inserted_id), "category": category}


# GET all transactions
@router.get("/transactions")
def get_transactions(user_id: str = Depends(get_current_user)):
    data = list(db.transactions.find({"user_id": user_id}))

    for item in data:
        item["_id"] = str(item["_id"])

    return data


@router.get("/subscriptions")
def get_subscriptions(user_id: str = Depends(get_current_user)):
    transactions = list(db.transactions.find({"user_id": user_id}))

    for tx in transactions:
        tx["_id"] = str(tx["_id"])

    return detect_subscriptions(transactions)


@router.delete("/transactions/{tx_id}")
def delete_transaction(tx_id: str, user_id: str = Depends(get_current_user)):
    result = db.transactions.delete_one({"_id": ObjectId(tx_id), "user_id": user_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return {"message": "Deleted successfully"}


class TransactionUpdate(BaseModel):
    merchant: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[datetime] = None
    category: Optional[str] = None


@router.put("/transactions/{tx_id}")
def update_transaction(
    tx_id: str, update: TransactionUpdate, user_id: str = Depends(get_current_user)
):
    update_data = {k: v for k, v in update.dict().items() if v is not None}

    if not update_data:
        return {"message": "Nothing to update"}

    result = db.transactions.update_one(
        {"_id": ObjectId(tx_id), "user_id": user_id}, {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return {"message": "Updated successfully"}
