from typing import List, Dict, Optional
import aiohttp
import asyncio
import google.generativeai as genai
import os
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import json

load_dotenv()

class ProductScraperService:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-pro')
        self.supported_sites = {
            "amazon": "https://www.amazon.com",
            "ebay": "https://www.ebay.com",
            "bestbuy": "https://www.bestbuy.com",
            "walmart": "https://www.walmart.com"
        }
        
    async def analyze_products_across_sites(self, query: str) -> Dict:
        try:
            # First, let Gemini analyze the query to understand requirements
            query_analysis = await self._analyze_query(query)
            
            # Gather products from multiple sites
            products = await self._gather_products(query_analysis)
            
            # Analyze and rank products using Gemini
            analyzed_products = await self._analyze_and_rank_products(products, query_analysis)
            
            return analyzed_products
        except Exception as e:
            print(f"Error in product analysis: {str(e)}")
            return {"error": str(e)}

    async def _analyze_query(self, query: str) -> Dict:
        prompt = f"""
        Analyze this product search query: "{query}"
        Extract the following information:
        1. Main product category
        2. Key features required
        3. Price range (if implied)
        4. Quality expectations
        5. Specific requirements
        Format the response as JSON.
        """
        
        response = await self.model.generate_content(prompt)
        return json.loads(response.text)

    async def _gather_products(self, query_analysis: Dict) -> List[Dict]:
        async with aiohttp.ClientSession() as session:
            tasks = []
            for site, base_url in self.supported_sites.items():
                task = self._scrape_site(session, site, base_url, query_analysis)
                tasks.append(task)
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            all_products = []
            for result in results:
                if isinstance(result, list):
                    all_products.extend(result)
            
            return all_products

    async def _scrape_site(self, session: aiohttp.ClientSession, site: str, base_url: str, query_analysis: Dict) -> List[Dict]:
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            
            search_url = self._build_search_url(site, base_url, query_analysis)
            async with session.get(search_url, headers=headers) as response:
                html = await response.text()
                products = await self._extract_products(site, html)
                return products
        except Exception as e:
            print(f"Error scraping {site}: {str(e)}")
            return []

    async def _analyze_and_rank_products(self, products: List[Dict], query_analysis: Dict) -> Dict:
        prompt = f"""
        Analyze these products based on the search requirements:
        Requirements: {json.dumps(query_analysis)}
        
        Products:
        {json.dumps(products)}
        
        Provide:
        1. Top 5 best matching products
        2. Reasoning for each selection
        3. Price analysis
        4. Alternative suggestions
        Format the response as JSON.
        """
        
        response = await self.model.generate_content(prompt)
        analysis = json.loads(response.text)
        
        return {
            "query_analysis": query_analysis,
            "top_products": analysis["top_products"],
            "reasoning": analysis["reasoning"],
            "price_analysis": analysis["price_analysis"],
            "alternatives": analysis["alternatives"]
        }

    def _build_search_url(self, site: str, base_url: str, query_analysis: Dict) -> str:
        # Customize search URL based on site
        search_terms = query_analysis["main_category"] + " " + " ".join(query_analysis["key_features"])
        
        if site == "amazon":
            return f"{base_url}/s?k={search_terms}"
        elif site == "ebay":
            return f"{base_url}/sch/i.html?_nkw={search_terms}"
        elif site == "bestbuy":
            return f"{base_url}/site/searchpage.jsp?st={search_terms}"
        elif site == "walmart":
            return f"{base_url}/search?q={search_terms}"
        
        return f"{base_url}/search?q={search_terms}"

    async def _extract_products(self, site: str, html: str) -> List[Dict]:
        soup = BeautifulSoup(html, 'html.parser')
        products = []
        
        # Site-specific extraction logic
        if site == "amazon":
            products = self._extract_amazon_products(soup)
        elif site == "ebay":
            products = self._extract_ebay_products(soup)
        # Add more site-specific extraction methods
        
        return products

    def _extract_amazon_products(self, soup: BeautifulSoup) -> List[Dict]:
        products = []
        for item in soup.select('.s-result-item'):
            try:
                product = {
                    "title": item.select_one('h2 span').text,
                    "price": item.select_one('.a-price-whole').text,
                    "rating": item.select_one('.a-icon-star-small .a-icon-alt').text,
                    "reviews": item.select_one('.a-size-base').text,
                    "url": "https://amazon.com" + item.select_one('a')['href'],
                    "source": "amazon"
                }
                products.append(product)
            except:
                continue
        return products