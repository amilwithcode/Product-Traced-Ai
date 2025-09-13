CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    price REAL,
    currency TEXT,
    url TEXT UNIQUE,
    description TEXT,
    seller TEXT,
    image_url TEXT,
    scraped_at TEXT
);
