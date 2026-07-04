from fastapi import APIRouter
from app.db import db
from datetime import datetime
from collections import defaultdict

router = APIRouter()


@router.get("/analytics/summary")
def get_summary():
    transactions = list(db.transactions.find())

    total_spent = 0
    category_totals = defaultdict(float)
    monthly_totals = defaultdict(float)

    for tx in transactions:
        amount = tx.get("amount", 0)
        category = tx.get("category", "Other")

        # handle date safely
        date = tx.get("date")
        if isinstance(date, str):
            dt = datetime.fromisoformat(date)
        else:
            dt = date

        month_key = dt.strftime("%Y-%m")

        total_spent += amount
        category_totals[category] += amount
        monthly_totals[month_key] += amount

    return {
        "total_spent": round(total_spent, 2),
        "category_breakdown": dict(category_totals),
        "monthly_breakdown": dict(monthly_totals)
    }