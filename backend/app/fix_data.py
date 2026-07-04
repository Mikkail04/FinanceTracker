from db import db

db.transactions.update_many(
    {"category": None},
    {"$set": {"category": "Other"}}
)