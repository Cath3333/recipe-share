import motor.motor_asyncio
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve MongoDB connection details from the environment
MONGO_DETAILS = os.getenv("MONGO_ATLAS_URL")
print(f"MONGO_DETAILS: {MONGO_DETAILS}")

if not MONGO_DETAILS:
    raise ValueError("MONGO_ATLAS_URL environment variable not set or empty")

load_dotenv()


# Create an async MongoDB client
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
