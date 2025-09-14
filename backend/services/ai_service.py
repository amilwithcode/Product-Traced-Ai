from services.product_scraper import ProductScraper
from typing import Dict, List

class AIService:
    def __init__(self):
        # Initialize AI service clients
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT_ID")
        self.location = "us-central1"
        self.product_scraper = ProductScraperService()

    async def analyze_product_query(self, query: str) -> dict:
        try:
            response = await openai.ChatCompletion.create(
                model="gemini-2.5-pro",
                messages=[
                    {"role": "system", "content": "You are a shopping assistant AI."},
                    {"role": "user", "content": f"Analyze this shopping query: {query}"}
                ]
            )
            
            analysis_results = await self.product_scraper.analyze_products_across_sites(query)
            
            return {
                "analyzed_query": analysis_results["query_analysis"],
                "top_products": analysis_results["top_products"],
                "price_analysis": analysis_results["price_analysis"],
                "confidence": True if analysis_results["top_products"] else False
            }
        except Exception as e:
            print(f"Product analysis error: {str(e)}")
            return {"analyzed_query": query, "confidence": False}

    async def generate_product_recommendation(self, products: list[dict]) -> Dict:
        try:
            # Format products for AI analysis
            products_text = "\n".join([
                f"Product: {p.get('name')}, Price: {p.get('price')}, Rating: {p.get('rating')}"
                for p in products[:5]  # Analyze top 5 products
            ])

            response = await openai.ChatCompletion.create(
                model="gemini-2.5-pro",
                messages=[
                    {"role": "system", "content": "You are a product recommendation expert."},
                    {"role": "user", "content": f"Analyze these products and provide recommendations:\n{products_text}"}
                ]
            )
            
            return {
                "recommendation": response.choices[0].message.content,
                "confidence_score": 0.85 if response.choices[0].finish_reason == "stop" else 0.5
            }
        except Exception as e:
            print(f"AI Recommendation error: {str(e)}")
            return {"recommendation": "Unable to generate recommendation", "confidence_score": 0}

    async def analyze_product_sentiment(self, product_reviews: List[str]) -> Dict:
        try:
            client = language_v1.LanguageServiceClient()
            
            # Analyze sentiment of each review
            sentiments = []
            for review in product_reviews:
                document = language_v1.Document(
                    content=review,
                    type_=language_v1.Document.Type.PLAIN_TEXT
                )
                sentiment = client.analyze_sentiment(document=document)
                sentiments.append(sentiment.document_sentiment.score)

            # Calculate average sentiment
            avg_sentiment = sum(sentiments) / len(sentiments) if sentiments else 0

            return {
                "sentiment_score": avg_sentiment,
                "sentiment_magnitude": abs(avg_sentiment),
                "review_count": len(product_reviews)
            }
        except Exception as e:
            print(f"Sentiment Analysis error: {str(e)}")
            return {"sentiment_score": 0, "sentiment_magnitude": 0, "review_count": 0}