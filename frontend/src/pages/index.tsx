'use client';
import { useState } from 'react';
import React from 'react';
import TrackedProducts from './productList'
import ProductAnalysis from './product_analysis_result'

interface AIAnalysis {
  price_prediction: {
    trend: string;
    forecast: number;
    confidence: number;
  };
  market_insights: {
    best_time_to_buy: string;
    price_history: {
      date: string;
      price: number;
    }[];
    similar_products: {
      name: string;
      price: number;
      url: string;
    }[];
  };
}

export default function Home(): React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  const [productUrl, setProductUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productData, setProductData] = useState<{
    url: string;
    price: number;
    description: string;
    name: string;
    website: string;
  } | null>(null);

  const handleTrackProduct = async () => {
    // Basic URL validation
    if (!productUrl.startsWith('http://') && !productUrl.startsWith('https://')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    // Check if URL is valid
    try {
      new URL(productUrl);
    } catch {
      setError('Please enter a valid product URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/track-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: productUrl.trim(),
          website: new URL(productUrl).hostname,
          notify: true,
          // Add default values that will be updated by the backend
          name: "Product",
          price: 0,
          description: "Product description will be fetched by the backend"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to track product');
      }

      const data = await response.json();
      setProductData(data);
      alert('Product successfully tracked!');
      setProductUrl('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to track product';
      console.error('Track product error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111827] dark justify-between group/design-root overflow-x-hidden">
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-center p-4">
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Track Product</h2>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
            <div className="mb-8 p-6 bg-blue-500/10 rounded-full">

              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                <radialGradient id="FBuol9Qptgpq4Ciu6aqyFa_sYUarM89AhbU_gr1" cx="242.011" cy="49.827" r=".028" gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -63653.82 -151597.453)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1ba1e3"></stop><stop offset="0" stop-color="#1ba1e3"></stop><stop offset=".3" stop-color="#5489d6"></stop><stop offset=".545" stop-color="#9b72cb"></stop><stop offset=".825" stop-color="#d96570"></stop><stop offset="1" stop-color="#f49c46"></stop></radialGradient><path fill="url(#FBuol9Qptgpq4Ciu6aqyFa_sYUarM89AhbU_gr1)" d="M15.304,21.177l-1.203,2.756c-0.463,1.06-1.929,1.06-2.391,0l-1.203-2.756	c-1.071-2.453-2.999-4.406-5.403-5.473l-3.313-1.47c-1.053-0.467-1.053-2,0-2.467l3.209-1.424c2.466-1.095,4.429-3.12,5.481-5.656	L11.7,1.748c0.452-1.09,1.959-1.09,2.411,0l1.219,2.938c1.053,2.537,3.015,4.562,5.481,5.656l3.209,1.424	c1.053,0.467,1.053,2,0,2.467l-3.313,1.47C18.303,16.771,16.375,18.724,15.304,21.177z"></path><radialGradient id="FBuol9Qptgpq4Ciu6aqyFb_sYUarM89AhbU_gr2" cx="242.011" cy="49.827" r=".028" gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -63653.82 -151597.453)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1ba1e3"></stop><stop offset="0" stop-color="#1ba1e3"></stop><stop offset=".3" stop-color="#5489d6"></stop><stop offset=".545" stop-color="#9b72cb"></stop><stop offset=".825" stop-color="#d96570"></stop><stop offset="1" stop-color="#f49c46"></stop></radialGradient><path fill="url(#FBuol9Qptgpq4Ciu6aqyFb_sYUarM89AhbU_gr2)" d="M26.488,29.868l-0.338,0.776	c-0.248,0.568-1.034,0.568-1.282,0l-0.338-0.776c-0.603-1.383-1.69-2.484-3.046-3.087l-1.043-0.463c-0.564-0.25-0.564-1.07,0-1.321	l0.984-0.437c1.391-0.618,2.497-1.76,3.09-3.19l0.348-0.838c0.242-0.584,1.05-0.584,1.292,0l0.348,0.838	c0.593,1.43,1.699,2.572,3.09,3.19l0.984,0.437c0.564,0.251,0.564,1.07,0,1.321l-1.043,0.463	C28.178,27.384,27.092,28.485,26.488,29.868z"></path><linearGradient id="FBuol9Qptgpq4Ciu6aqyFc_sYUarM89AhbU_gr3" x1="12.905" x2="12.905" y1=".93" y2="24.728" gradientUnits="userSpaceOnUse"><stop offset="0" stop-opacity=".02"></stop><stop offset="1" stop-opacity=".15"></stop></linearGradient><path fill="url(#FBuol9Qptgpq4Ciu6aqyFc_sYUarM89AhbU_gr3)" d="M24.02,11.766l-3.209-1.424	c-2.466-1.095-4.429-3.12-5.481-5.656L14.11,1.748c-0.226-0.545-0.716-0.818-1.206-0.818S11.926,1.203,11.7,1.748L10.48,4.685	c-1.053,2.537-3.015,4.562-5.482,5.656L1.79,11.766c-1.053,0.467-1.053,2,0,2.467l3.313,1.47c2.405,1.067,4.332,3.02,5.403,5.473	l1.203,2.756c0.231,0.53,0.714,0.795,1.196,0.795c0.482,0,0.964-0.265,1.196-0.795l1.203-2.756c1.071-2.453,2.999-4.406,5.403-5.473	l3.313-1.47C25.073,13.766,25.073,12.234,24.02,11.766z M23.919,14.005l-3.313,1.47c-2.468,1.095-4.432,3.085-5.531,5.601	l-1.203,2.756c-0.174,0.398-0.544,0.645-0.967,0.645s-0.793-0.247-0.967-0.645l-1.203-2.756c-1.099-2.517-3.063-4.506-5.531-5.601	l-3.313-1.47C1.418,13.795,1.25,13.348,1.25,13s0.168-0.795,0.641-1.005L5.1,10.57c2.536-1.126,4.529-3.182,5.611-5.789l1.219-2.938	c0.203-0.489,0.637-0.663,0.975-0.663c0.338,0,0.772,0.174,0.975,0.663l1.219,2.938c1.082,2.607,3.075,4.663,5.611,5.789	l3.209,1.424c0.473,0.21,0.641,0.657,0.641,1.005C24.56,13.348,24.391,13.795,23.919,14.005z"></path><linearGradient id="FBuol9Qptgpq4Ciu6aqyFd_sYUarM89AhbU_gr4" x1="25.509" x2="25.509" y1="20.094" y2="31.07" gradientUnits="userSpaceOnUse"><stop offset="0" stop-opacity=".02"></stop><stop offset="1" stop-opacity=".15"></stop></linearGradient><path fill="url(#FBuol9Qptgpq4Ciu6aqyFd_sYUarM89AhbU_gr4)" d="M30.577,24.997l-0.984-0.437	c-1.391-0.618-2.497-1.76-3.09-3.19l-0.348-0.838c-0.121-0.292-0.384-0.438-0.646-0.438c-0.262,0-0.525,0.146-0.646,0.438	l-0.348,0.838c-0.593,1.43-1.699,2.572-3.09,3.19l-0.984,0.437c-0.564,0.25-0.564,1.07,0,1.321l1.043,0.463	c1.356,0.602,2.443,1.704,3.046,3.087l0.338,0.776c0.124,0.284,0.382,0.426,0.641,0.426c0.259,0,0.517-0.142,0.641-0.426	l0.339-0.776c0.603-1.383,1.69-2.484,3.046-3.087l1.043-0.463C31.141,26.068,31.141,25.248,30.577,24.997z M30.476,26.09	l-1.043,0.463c-1.417,0.629-2.544,1.771-3.174,3.215l-0.339,0.776c-0.075,0.173-0.229,0.276-0.412,0.276	c-0.182,0-0.336-0.103-0.412-0.276l-0.339-0.776c-0.63-1.444-1.757-2.586-3.174-3.215l-1.043-0.463	c-0.172-0.076-0.274-0.238-0.274-0.432c0-0.194,0.103-0.356,0.274-0.432l0.984-0.437c1.456-0.647,2.599-1.827,3.219-3.323	l0.348-0.838c0.074-0.178,0.229-0.284,0.415-0.284c0.186,0,0.341,0.106,0.415,0.284l0.348,0.838c0.62,1.496,1.764,2.676,3.219,3.323	l0.984,0.437c0.172,0.076,0.274,0.238,0.274,0.432C30.75,25.852,30.647,26.013,30.476,26.09z"></path>
              </svg>
            </div>
            <h1 className="text-white tracking-tight text-3xl font-bold leading-tight px-4 text-center pb-3">Paste a product link</h1>
            <p className="text-gray-400 text-base font-normal leading-normal pb-8 pt-1 px-4 text-center max-w-sm">Our AI will analyze the product and track its price for you, sending you notifications on the best time to buy.</p>
            <div className="w-full max-w-md px-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  link
                </span>
                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="https://example.com/product" // Updated placeholder
                  className="w-full px-10 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
                <p className="text-gray-400 text-xs mt-2">
                  Enter any product URL to track its price
                </p>
              </div>
              <button
                className={`flex min-w-[84px] w-full mt-4 cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 py-5 bg-blue-500 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleTrackProduct}
                disabled={loading}
              >
                <span className="truncate">
                  {loading ? 'Processing...' : 'Track Product'}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="flex gap-2 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm px-4 pb-3 pt-2">
            <a className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-blue-400" href="#">
              <div className="text-blue-400 flex h-8 w-16 items-center justify-center bg-blue-500/20 rounded-full" data-icon="House" data-size="24px" data-weight="fill">

                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
                </svg>
              </div>
              <p className="text-white text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-400" href="#">
              <div className="text-gray-400 flex h-8 items-center justify-center" data-icon="MagnifyingGlass" data-size="24px" data-weight="regular">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <p className="text-gray-400 text-xs font-medium leading-normal tracking-[0.015em]">Search</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-400" href="#">
              <div className="text-gray-400 flex h-8 items-center justify-center" data-icon="Bookmark" data-size="24px" data-weight="regular">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32ZM72,48H184V161.57l-51.77-32.35a8,8,0,0,0-8.48,0L72,161.56V48Z"></path>
                </svg>
              </div>
              <p className="text-gray-400 text-xs font-medium leading-normal tracking-[0.015em]">Favorites</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-400" href="#">
              <div className="text-gray-400 flex h-8 items-center justify-center" data-icon="User" data-size="24px" data-weight="regular">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                </svg>
              </div>
              <p className="text-gray-400 text-xs font-medium leading-normal tracking-[0.015em]">Profile</p>
            </a>
          </div>
          {/* <div className="h-5 bg-gray-900/50 backdrop-blur-sm"></div> */}
        </div>
        <div className="mt-8">
          <ProductAnalysis />
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Tracked Products</h2>
          <TrackedProducts />
        </div>
      </div>
    </main>
  );
}