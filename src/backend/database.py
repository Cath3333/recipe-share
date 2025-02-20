import motor.motor_asyncio
import os
from dotenv import load_dotenv
import pymongo


load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_ATLAS_URL")
print(f"MONGO_DETAILS: {MONGO_DETAILS}")

if not MONGO_DETAILS:
    raise ValueError("MONGO_ATLAS_URL environment variable not set or empty")

load_dotenv()


client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.recipe_sharing

user_collection = database.get_collection("users")
recipe_collection = database.get_collection("recipes")


user_collection.create_index("username", unique=True)
recipe_collection.create_index("title")
