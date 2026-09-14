from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.transactions import router as tx_router
from app.routes.analytics import router as analytics_router

app = FastAPI()

app.include_router(tx_router)
app.include_router(analytics_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://finance-tracker-phi-brown.vercel.app",
    ],
    allow_origin_regex=r"https://finance-tracker-[a-z0-9]+-youngkels04-8891s-projects\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Finance Tracker API running"}
