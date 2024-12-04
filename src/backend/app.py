# app/main.py

import os
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

from app.database import client, database  # Ensure database.py is correctly referenced
from app.routers import users, recipes

app = FastAPI()

# Include routers
app.include_router(users.router)
app.include_router(recipes.router)

# Event handlers for startup and shutdown (optional if needed)
@app.on_event("startup")
async def startup_db_client():
    # Connection is already established in database.py
    print("Connected to MongoDB")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    print("Disconnected from MongoDB")
