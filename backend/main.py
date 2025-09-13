from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase
cred = credentials.Certificate("path/to/your/firebase-credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

class ProductSearch(BaseModel):
    query: str
    price_range: Optional[Dict[str, float]] = None
    categories: Optional[List[str]] = None

@app.post("/api/search")
async def search_products(search: ProductSearch):
    try:
        # Initialize AI service
        ai_service = AIService()

        # Analyze search query using AI
        query_analysis = await ai_service.analyze_product_query(search.query)

        # Get product recommendations
        mock_products = [
            {"name": "Test Product 1", "price": 99.99, "rating": 4.5},
            {"name": "Test Product 2", "price": 149.99, "rating": 4.2}
        ]
        recommendations = await ai_service.generate_product_recommendation(mock_products)

        # Store AI analysis in Firebase
        db.collection('ai_analysis').add({
            'query': search.query,
            'analysis': query_analysis,
            'recommendations': recommendations,
            'timestamp': firestore.SERVER_TIMESTAMP
        })

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
        # TODO: Implement getting tracked products from Firebase
        return {"products": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))