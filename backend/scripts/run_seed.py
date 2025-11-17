"""Standalone script to seed database."""
import asyncio
from app.database import AsyncSessionLocal
from scripts.seed_data import seed_database


async def main():
    """Run seed database."""
    async with AsyncSessionLocal() as db:
        await seed_database(db)
        print("✓ Database seeding completed!")


if __name__ == "__main__":
    asyncio.run(main())

