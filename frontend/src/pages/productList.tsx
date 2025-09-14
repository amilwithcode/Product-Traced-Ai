'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
    id: number;
    title: string;
    price: number;
    currency: string;
    url: string;
    description: string;
    seller: string;
    image_url: string;
    scraped_at: string;
}

export default function TrackedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/tracked-products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data.products);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    if (!products.length) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-400">No products tracked yet. Add your first product above!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {products.map((product) => (
                <div key={product.id} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                    <div className="relative h-48 mb-4 bg-gray-900 rounded-lg overflow-hidden">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.title}
                                fill
                                className="object-contain"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-gray-500">No image available</span>
                            </div>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.title}</h3>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xl font-bold text-blue-400">
                            {product.currency} {product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400">{product.seller}</span>
                    </div>
                    {product.description && (
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {product.description}
                        </p>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                            Added: {new Date(product.scraped_at).toLocaleDateString()}
                        </span>
                        <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                            View Product →
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}