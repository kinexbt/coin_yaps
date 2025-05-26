// components/search/SearchResults.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Token {
  id: string;
  symbol: string;
  name: string;
  address: string;
  network: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  image?: string;
}

interface SearchResultsProps {
  query: string;
  isSearching: boolean;
}

export default function SearchResults({ query, isSearching }: SearchResultsProps) {
  const [results, setResults] = useState<Token[]>([]);

  useEffect(() => {
    if (query.trim()) {
      searchTokens(query);
    }
  }, [query]);

  const searchTokens = async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.tokens || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  };

  if (isSearching) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">No tokens found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
      <div className="space-y-3">
        {results.map((token) => (
          <Link
            key={token.id}
            href={`/token/${token.symbol}`}
            className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                {token.image ? (
                  <img
                    src={token.image}
                    alt={token.symbol}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold">{token.symbol.charAt(0)}</span>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{token.symbol}</span>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                    {token.network.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{token.name}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold">${token.price.toFixed(6)}</p>
              <div className="flex items-center space-x-1">
                {token.priceChange24h >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.priceChange24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}