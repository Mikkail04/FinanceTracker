# from collections import defaultdict
# from datetime import datetime

# def detect_subscriptions(transactions):
#     grouped = defaultdict(list)

#     # Group by merchant
#     for tx in transactions:
#         grouped[tx["merchant"].lower()].append(tx)

#     subscriptions = []

#     for merchant, txs in grouped.items():
#         if len(txs) < 2:
#             continue

#         # Sort by date
#         dates = sorted([datetime.fromisoformat(tx["date"]) for tx in txs])

#         # Check consistency in amount
#         amounts = [tx["amount"] for tx in txs]
#         avg_amount = sum(amounts) / len(amounts)

#         # Simple heuristic: repeated similar charges
#         consistent = all(abs(a - avg_amount) < 0.5 for a in amounts)

#         if not consistent:
#             continue

#         # Estimate frequency (very simple)
#         if len(dates) >= 2:
#             diff_days = (dates[-1] - dates[0]).days
#             avg_gap = diff_days / (len(dates) - 1)

#             if 25 <= avg_gap <= 35:
#                 frequency = "monthly"
#             elif 6 <= avg_gap <= 8:
#                 frequency = "weekly"
#             else:
#                 frequency = "irregular"
#         else:
#             frequency = "unknown"

#         subscriptions.append({
#             "merchant": merchant,
#             "avg_amount": round(avg_amount, 2),
#             "frequency": frequency,
#             "count": len(txs)
#         })

#     return subscriptions
from collections import defaultdict
from datetime import datetime

def normalize_date(value):
    """
    Handles both string and datetime safely
    """
    if isinstance(value, datetime):
        return value

    if isinstance(value, str):
        return datetime.fromisoformat(value)

    return None


def detect_subscriptions(transactions):
    grouped = defaultdict(list)

    # Group by merchant
    for tx in transactions:
        merchant = tx.get("merchant", "").lower()
        grouped[merchant].append(tx)

    subscriptions = []

    for merchant, txs in grouped.items():
        if len(txs) < 2:
            continue

        dates = []
        amounts = []

        for tx in txs:
            dt = normalize_date(tx.get("date"))
            if dt:
                dates.append(dt)

            if tx.get("amount") is not None:
                amounts.append(tx["amount"])

        if len(dates) < 2 or len(amounts) < 2:
            continue

        avg_amount = sum(amounts) / len(amounts)
        
        # sort dates
        dates.sort()

        # compute gaps between consecutive transactions
        gaps = [
            (dates[i] - dates[i - 1]).days
            for i in range(1, len(dates))
        ]

        if len(gaps) == 0:
            frequency = "unknown"
        else:
            median_gap = sorted(gaps)[len(gaps) // 2]

        if 24 <= median_gap <= 33:
            frequency = "monthly"
        elif 6 <= median_gap <= 8:
            frequency = "weekly"
        else:
            frequency = "irregular"

        subscriptions.append({
            "merchant": merchant,
            "avg_amount": round(avg_amount, 2),
            "frequency": frequency,
            "count": len(txs)
        })

    return subscriptions