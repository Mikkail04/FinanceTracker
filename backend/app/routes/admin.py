from fastapi import APIRouter, Depends
from app.db import db
from app.auth_utils import get_current_admin
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/admin/stats")
def admin_stats(user_id: str = Depends(get_current_admin)):

    total_users = db.users.count_documents({})

    total_transactions = db.transactions.count_documents({})

    active_users = db.users.count_documents(
        {"last_login": {"$gte": datetime.utcnow() - timedelta(days=7)}}
    )

    total_subscriptions = 0

    merchants = db.transactions.aggregate(
        [
            {
                "$group": {
                    "_id": {"user_id": "$user_id", "merchant": "$merchant"},
                    "count": {"$sum": 1},
                }
            }
        ]
    )

    for merchant in merchants:
        if merchant["count"] >= 2:
            total_subscriptions += 1

    return {
        "total_users": total_users,
        "total_transactions": total_transactions,
        "active_users_7d": active_users,
        "subscriptions_detected": total_subscriptions,
    }
