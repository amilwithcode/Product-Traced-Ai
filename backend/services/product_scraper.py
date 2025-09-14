import aiohttp
from bs4 import BeautifulSoup
import re
from typing import Dict, Optional
from urllib.parse import urlparse

class ProductScraper:
    async def scrape_product(self, url: str) -> Optional[Dict]:
        try:
            domain = urlparse(url).netloc
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }) as response:
                    if response.status != 200:
                        return None
                    
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    if 'amazon' in domain:
                        return self._parse_amazon(soup)
                    elif 'ebay' in domain:
                        return self._parse_ebay(soup)
                    
                    return self._parse_generic(soup)
        
        except Exception as e:
            print(f"Scraping error: {str(e)}")
            return None

    def _parse_amazon(self, soup: BeautifulSoup) -> Dict:
        title_elem = soup.select_one('#productTitle')
        price_elem = soup.select_one('.a-price-whole')
        desc_elem = soup.select_one('#productDescription')
        img_elem = soup.select_one('#landingImage')

        return {
            'name': title_elem.text.strip() if title_elem else 'Unknown Product',
            'price': self._extract_price(price_elem) if price_elem else 0.0,
            'currency': 'USD',
            'description': desc_elem.text.strip() if desc_elem else '',
            'image_url': img_elem.get('src') if img_elem else None,
            'store': 'Amazon'
        }

    def _parse_ebay(self, soup: BeautifulSoup) -> Dict:
        title_elem = soup.select_one('h1.x-item-title')
        price_elem = soup.select_one('.x-price-primary')
        desc_elem = soup.select_one('.x-item-description')
        img_elem = soup.select_one('.ux-image-carousel-item img')

        return {
            'name': title_elem.text.strip() if title_elem else 'Unknown Product',
            'price': self._extract_price(price_elem) if price_elem else 0.0,
            'currency': 'USD',
            'description': desc_elem.text.strip() if desc_elem else '',
            'image_url': img_elem.get('src') if img_elem else None,
            'store': 'eBay'
        }

    def _parse_generic(self, soup: BeautifulSoup) -> Dict:
        title_elem = soup.select_one('h1')
        desc_meta = soup.select_one('meta[name="description"]')
        img_meta = soup.select_one('meta[property="og:image"]')

        return {
            'name': title_elem.text.strip() if title_elem else 'Unknown Product',
            'price': self._extract_price(str(soup)),
            'currency': 'USD',
            'description': desc_meta.get('content') if desc_meta else '',
            'image_url': img_meta.get('content') if img_meta else None,
            'store': 'Unknown'
        }

    def _extract_price(self, element) -> float:
        if not element:
            return 0.0
        price_text = str(element)
        price_match = re.search(r'\d+\.?\d*', price_text)
        return float(price_match.group()) if price_match else 0.0