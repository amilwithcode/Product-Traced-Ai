'use client';
import { useState, useEffect } from 'react';

interface AnalysisResult {
  query_analysis: {
    category: string;
    key_features?: string[];  // Changed from features to key_features and made optional
    price_range: string;
  };
  recommendations: {
    name: string;
    price: number;
    rating: number;
  }[];
  products: {
    name: string;
    price: number;
    url: string;
    rating: number;
    description?: string;
  }[];
}
interface ProductAnalysisProps {
  initialData?: {
    url: string;
  };
}

export default function ProductAnalysis({ initialData }: ProductAnalysisProps) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch('http://localhost:8000/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: initialData ? initialData.url : null,
            price_range: null,
            categories: null
          }),
        });

        const data = await response.json();
        setAnalysisResult(data);
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch analysis');
      }
    };

    if (initialData) {
      fetchAnalysis();
    }
  }, [initialData]);

  if (!analysisResult) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-xl">
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 mb-2">Category</p>
            <p className="text-white">
              {analysisResult?.query_analysis?.category || 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-2">Price Range</p>
            <p className="text-white">
              {analysisResult?.query_analysis?.price_range || 'Not specified'}
            </p>
          </div>
          {analysisResult?.query_analysis?.key_features && analysisResult.query_analysis.key_features.length > 0 && (
            <div>
              <p className="text-gray-400 mb-2">Key Features</p>
              <ul className="list-disc list-inside text-white">
                {analysisResult.query_analysis.key_features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Similar Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisResult?.recommendations?.map((product, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-medium mb-2">{product.name}</h4>
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-bold">${product.price}</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>{product.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}