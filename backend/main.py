from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl, validator
from urllib.parse import urlparse
from typing import Dict, List, Optional
from services.ai_service import AIService
from database_service import DatabaseService
from typing import Dict, List
from services.product_scraper import ProductScraper


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

class ProductURL(BaseModel):
    url: str

    @validator('url')
    def validate_url(cls, v):
        if not v:
            raise ValueError('URL cannot be empty')
        try:
            parsed = urlparse(v.strip())
            if not all([parsed.scheme, parsed.netloc]):
                raise ValueError('Invalid URL format. URL must include http:// or https://')
            if parsed.scheme not in ['http', 'https']:
                raise ValueError('URL must start with http:// or https://')
            return v.strip()
        except Exception:
            raise ValueError('Invalid URL format. Please check the URL and try again.')


class ProductSearch(BaseModel):
    query: str
    price_range: Optional[Dict[str, float]] = None
    categories: Optional[List[str]] = None

@app.post("/search")
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

@app.get("/api/tracked-products")  # Update the route to match frontend
async def get_tracked_products():
    try:
        products = await db.get_tracked_products()
        return {"products": products, "count": len(products)}
    except Exception as e:
        print(f"Error fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch tracked products")

@app.post("/api/track-product")
async def track_product(product: ProductURL):
    try:
        # Validate URL
        if not product.url:
            raise HTTPException(status_code=400, detail="URL cannot be empty")

        # Initialize scraper with error handling
        scraper = ProductScraper()
        print(f"Attempting to scrape URL: {product.url}")  # Debug log
        
        product_data = await scraper.scrape_product(product.url)
        print(f"Scraped data: {product_data}")  # Debug log
        
        if not product_data:
            raise HTTPException(status_code=400, detail="Could not extract product data from the provided URL")
        
        # Ensure required fields are present
        required_fields = ['name', 'price', 'currency', 'description']
        missing_fields = [field for field in required_fields if not product_data.get(field)]
        
        if missing_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required product data: {', '.join(missing_fields)}"
            )
        
        # Add URL to product data
        product_data['url'] = product.url
        
        try:
            product_id = await db.save_product(product_data)
            if not product_id:
                raise HTTPException(status_code=500, detail="Failed to save product to database")
        except Exception as db_error:
            print(f"Database error: {str(db_error)}")
            raise HTTPException(status_code=500, detail="Database operation failed")
        
        return {
            "message": "Product tracking started",
            "product": product_data,
            "product_id": product_id
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error processing URL {product.url}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process product tracking: {str(e)}")