from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
from services.ai_service import AIService
from services.database_service import DatabaseService
from typing import Dict, List

app = FastAPI()
db = DatabaseService()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProductSearch(BaseModel):
    query: str
    price_range: Optional[Dict[str, float]] = None
    categories: Optional[List[str]] = None

@app.post("/api/search")
async def search_products(search: ProductSearch):
    try:
        ai_service = AIService()
        query_analysis = await ai_service.analyze_product_query(search.query)
        
        mock_products = [
            {"name": "Test Product 1", "price": 99.99, "rating": 4.5},
            {"name": "Test Product 2", "price": 149.99, "rating": 4.2}
        ]
        recommendations = await ai_service.generate_product_recommendation(mock_products)

        return {
            "query_analysis": query_analysis,
            "recommendations": recommendations,
            "products": mock_products
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tracked-products")
async def get_tracked_products():
    try:
        products = await db.get_tracked_products()
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add a test endpoint to verify the server is running
@app.get("/")
async def root():
    return {"message": "Price Tracker AI API is running"}