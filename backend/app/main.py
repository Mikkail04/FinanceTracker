from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.transactions import router as tx_router
from app.routes.analytics import router as analytics_router

app = FastAPI()

app.include_router(tx_router)
app.include_router(analytics_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Finance Tracker API running"}