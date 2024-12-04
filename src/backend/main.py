# app/main.py

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager

from database import client, database
from routers import users, recipes, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    try:
        # Explicitly attempt to connect to MongoDB to ensure connection is valid
        print("Connecting to MongoDB")
        await client.server_info()  # Asynchronously verifies that MongoDB is reachable
        print("Connected to MongoDB")
        yield  # Continue with the application lifecycle
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise

    # Shutdown tasks
    finally:
        client.close()
        print("Disconnected from MongoDB")


app = FastAPI(lifespan=lifespan)

# Include routers
app.include_router(users.router)
app.include_router(recipes.router)
app.include_router(auth.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
