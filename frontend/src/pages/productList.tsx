'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  url: string;
  store: string;
  description: string;
  current_price: number;
  sentiment_score: number;
  ai_recommendation: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-gray-800 rounded-xl p-4">
          <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
            <Image
              src={product.url || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold text-blue-400">
              ${product.current_price}
            </span>
            <span className="text-sm text-gray-400">
              from {product.store}
            </span>
          </div>
          
          {product.ai_recommendation && (
            <div className="bg-gray-700/50 rounded-lg p-3 mt-3">
              <p className="text-sm text-gray-300">
                {product.ai_recommendation}
              </p>
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-2">Sentiment:</span>
              <div className={`h-2 w-16 rounded-full ${
                product.sentiment_score > 0.5 ? 'bg-green-500' :
                product.sentiment_score > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
            </div>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View Details →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}