
import asyncio
import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))
from db import get_database

async def test_db_connection():
    db = get_database()
    collections = await db.list_collection_names()
    print("Collections:", collections)

if __name__ == "__main__":
    asyncio.run(test_db_connection())
