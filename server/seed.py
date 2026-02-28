"""
seed.py — Populate the skillsync database with sample data.
Run with: python seed.py
"""

import bcrypt

from database import engine, SessionLocal, Base
from models import User


def hash_password(plain: str) -> str:
    """Hash a password using bcrypt directly (avoids passlib version issues)."""
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


# ── sample users ──────────────────────────────────────────────
SAMPLE_USERS = [
    {"email": "alice@example.com", "password": "Alice@123"},
    {"email": "bob@example.com", "password": "Bob@456"},
    {"email": "charlie@example.com", "password": "Charlie@789"},
    {"email": "admin@skillsync.com", "password": "Admin@2024"},
]


def seed():
    # Create tables if they don't exist yet
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        added = 0
        skipped = 0

        for user_data in SAMPLE_USERS:
            existing = db.query(User).filter(User.email == user_data["email"]).first()
            if existing:
                print(f"  [skip]  {user_data['email']} already exists")
                skipped += 1
                continue

            new_user = User(
                email=user_data["email"],
                password=hash_password(user_data["password"]),
            )
            db.add(new_user)
            print(f"  [add]   {user_data['email']}")
            added += 1

        db.commit()
        print(f"\n✅ Seeding complete — {added} added, {skipped} skipped.")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("🌱 Seeding database...\n")
    seed()
