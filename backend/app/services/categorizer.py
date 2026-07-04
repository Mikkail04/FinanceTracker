def categorize_transaction(merchant: str, amount: float = None):
    merchant = merchant.lower()

    if any(x in merchant for x in ["netflix", "spotify", "hulu", "disney"]):
        return "Entertainment"

    if any(x in merchant for x in ["uber", "lyft", "doordash"]):
        return "Transport"

    if any(x in merchant for x in ["starbucks", "mcdonald", "chipotle", "restaurant"]):
        return "Food"

    if any(x in merchant for x in ["amazon", "walmart", "target"]):
        return "Shopping"

    return "Other"