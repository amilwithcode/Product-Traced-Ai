from fastapi import FastAPI
from pydantic import BaseModel
import random
from db import init_db, save_product, get_all_products

app = FastAPI()

init_db()  # DB start zamanı yaradılsın

class ProductRequest(BaseModel):
    url: str

@app.post("/backend/product")
async def add_product(req: ProductRequest):
    # Mock məhsul
    fake_product = {
        "title": "PlayStation 5 Slim",
        "price": random.randint(400, 600),
        "currency": "USD",
        "url": req.url,
        "description": "Next-gen gaming console",
        "seller": "Amazon",
        "image_url": "https://example.com/ps5.jpg"
    }

    save_product(fake_product)

    return {"message": "✅ Məhsul əlavə olundu", "product": fake_product}

@app.get("/api/products")
async def list_products():
    rows = get_all_products()
    return {"products": rows}
