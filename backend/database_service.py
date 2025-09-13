import sqlite3
from datetime import datetime

DB_NAME = "products.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
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

def save_product(product: dict):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    try:
        cursor.execute("""
        INSERT OR REPLACE INTO products
        (title, price, currency, url, description, seller, image_url, scraped_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            product.get("title"),
            product.get("price"),
            product.get("currency", "USD"),
            product.get("url"),
            product.get("description"),
            product.get("seller"),
            product.get("image_url"),
            datetime.utcnow().isoformat()
        ))
        conn.commit()
    except Exception as e:
        print("❌ DB Error:", e)
    finally:
        conn.close()

def get_all_products():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products ORDER BY scraped_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return rows
