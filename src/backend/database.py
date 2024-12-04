import motor.motor_asyncio
import os

MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.recipe_sharing  # Database name

# Collections
user_collection = database.get_collection("users")
recipe_collection = database.get_collection("recipes")

# Ensure indexes (optional but recommended)
import pymongo

# Example: Ensure unique index on username
user_collection.create_index("username", unique=True)
recipe_collection.create_index("title")