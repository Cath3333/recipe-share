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
    try:
        print("Connecting to MongoDB")
        await client.server_info()
        print("Connected to MongoDB")
        yield 
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise

    finally:
        client.close()
        print("Disconnected from MongoDB")


app = FastAPI(lifespan=lifespan)

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
