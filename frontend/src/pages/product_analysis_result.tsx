'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AlternativeProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function ProductAnalysisResults() {
  const [alternativeProducts] = useState<AlternativeProduct[]>([
    { id: '1', name: 'Alternative Product 1', price: 29.99, imageUrl: '/product1.jpg' },
    { id: '2', name: 'Alternative Product 2', price: 34.99, imageUrl: '/product2.jpg' },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/" className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold ml-4">Product Analysis</h1>
        </div>

        {/* Product Card */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6">
          <div className="aspect-square relative rounded-xl overflow-hidden mb-4 bg-neutral-200">
            <Image
              src="/placeholder.jpg"
              alt="Product"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Product Name</h2>
            <span className="text-xl">$49.99</span>
          </div>
          <p className="text-sm text-gray-400">Found at: Online Store</p>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6">
          <div className="mb-6">
            <h3 className="flex items-center text-lg font-semibold mb-3">
              <span className="text-blue-400 mr-2">✨</span>
              AI-Translated Description
            </h3>
            <p className="text-gray-300">
              `Our AI has processed the original description and translated it into clear,
              concise, and human-readable language. This makes it easier to understand the product`s
              features and benefits.`
            </p>
          </div>
        </div>

        {/* Alternative Products */}
        <div className="bg-gray-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">AI-Suggested Alternatives</h3>
          <div className="grid grid-cols-2 gap-4">
            {alternativeProducts.map((product) => (
              <div
                key={product.id}
                className="bg-neutral-100/10 rounded-xl p-4"
              >
                <div className="aspect-square relative rounded-lg overflow-hidden mb-3 bg-neutral-200">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-sm font-medium">{product.name}</h4>
                <p className="text-sm text-blue-400">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}