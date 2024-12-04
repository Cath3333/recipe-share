import motor.motor_asyncio
import asyncio
import os
from dotenv import load_dotenv

# Load the environment variables
load_dotenv()

async def test_mongo_connection():
    try:
        MONGO_DETAILS = os.getenv("MONGO_ATLAS_URL")
        if not MONGO_DETAILS:
            raise ValueError("MONGO_ATLAS_URL environment variable not set or empty")

        # Create an async MongoDB client with a 10-second timeout
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS, serverSelectionTimeoutMS=10000)
        await client.server_info()  # Will raise an error if unable to connect
        print("MongoDB Atlas is reachable")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")

asyncio.run(test_mongo_connection())
