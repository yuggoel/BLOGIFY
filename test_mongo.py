import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test_mongo():
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient('mongodb://localhost:27017')
        # Test the connection
        await client.admin.command('ping')
        print("MongoDB connection successful!")
        
        # List databases
        db_names = await client.list_database_names()
        print(f"Available databases: {db_names}")
        
        # Close the connection
        client.close()
    except Exception as e:
        print(f"MongoDB connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_mongo())