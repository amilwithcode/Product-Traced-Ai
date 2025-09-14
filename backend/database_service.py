import sqlite3
from datetime import datetime
from typing import List, Dict

class DatabaseService:
    def __init__(self):
        self.db_name = "products.db"
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            price REAL,
            currency TEXT,
            url TEXT UNIQUE,
            description TEXT,
            seller TEXT,
            image_url TEXT,
            scraped_at TEXT
        )
        """)
        conn.commit()
        conn.close()

    async def save_product(self, product: Dict) -> int:
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        try:
            cursor.execute("""
            INSERT OR REPLACE INTO products
            (title, price, currency, url, description, seller, image_url, scraped_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                product.get("name"),  # Changed from title to name to match scraper
                product.get("price"),
                product.get("currency", "USD"),
                product.get("url"),
                product.get("description"),
                product.get("store"),  # Changed from seller to store to match scraper
                product.get("image_url"),
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return cursor.lastrowid
        except Exception as e:
            print("❌ DB Error:", e)
            return 0
        finally:
            conn.close()

    async def get_tracked_products(self) -> List[Dict]:
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT * FROM products ORDER BY scraped_at DESC")
            return [dict(row) for row in cursor.fetchall()]
        finally:
            conn.close()