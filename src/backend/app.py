# app/main.py

import os
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from database import (
    client,
    database,
)
from routers import users, recipes

app = FastAPI()

# Include routers
app.include_router(users.router)
app.include_router(recipes.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Event handlers for startup and shutdown (optional if needed)
@app.on_event("startup")
async def startup_db_client():
    # Connection is already established in database.py
    print("Connected to MongoDB")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    print("Disconnected from MongoDB")
