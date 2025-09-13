'use client';
import { useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  return (`
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Price Tracker AI</h1>
        
        {/* Search Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Describe what you're looking for..."
              className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg"
              onClick={() => {/* TODO: Implement search */}}
            >
              Search
            </button>
          </div>
        </div>

        {/* Tracked Products */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tracked Products</h2>
          <div className="space-y-4">
            {/* Product items will go here */}
          </div>
        </div>
      </div>
    </main>`
  );
}