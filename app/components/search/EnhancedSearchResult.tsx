'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Sparkles, Users } from 'lucide-react';
import { formatPrice, formatNumber } from '../../lib/utils';
import toast from 'react-hot-toast';
import React from 'react';

interface Token {
  id: string;
  symbol: string;
  name: string;
  address: string;
  network: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  image?: string;
  comments?: any[];
}

interface SearchResultsProps {
  query: string;
  isSearching: boolean;
}

export default function EnhancedSearchResults({ query, isSearching }: SearchResultsProps) {
  const [results, setResults] = useState<Token[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryResult, setDiscoveryResult] = useState<any>(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsDiscovering(true);
    try {
      // Determine if query is an address (simplified check)
      const isAddress = query.length > 20 && (query.startsWith('0x') || /^[A-Za-z0-9]{32,}$/.test(query));
      
      const response = await fetch('/api/tokens/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          isAddress,
        }),
      });

      const data = await response.json();

      if (data.found) {
        setDiscoveryResult(data);
        
        if (data.isNewChannel) {
          toast.success(data.congratulations, {
            duration: 5000,
            icon: '🎉',
          });
        }
        
        setTimeout(() => {
          router.push(`/token/${data.token.symbol}`);
        }, data.isNewChannel ? 2000 : 500);
        
      } else {
        toast.error(data.error || 'Token not found');
        setDiscoveryResult(null);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsDiscovering(false);
    }
  };

  React.useEffect(() => {
    if (query.trim()) {
      const timeoutId = setTimeout(handleSearch, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [query]);

  if (isDiscovering || isSearching) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-gray-300">
            {isDiscovering ? 'Discovering token...' : 'Searching...'}
          </span>
        </div>
      </div>
    );
  }

  if (discoveryResult) {
    const { token, isNewChannel, isFirstUser } = discoveryResult;
    
    return (
      <div className="bg-gray-800 rounded-lg p-6 border-2 border-green-500">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            {token.image ? (
              <img
                src={token.image}
                alt={token.symbol}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Sparkles className="w-8 h-8 text-white" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-white">{token.symbol}</h3>
              <span className="text-sm bg-green-500 text-white px-2 py-1 rounded">
                {token.network.toUpperCase()}
              </span>
              {isNewChannel && (
                <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">
                  NEW CHANNEL
                </span>
              )}
            </div>
            
            <p className="text-gray-300 mb-2">{token.name}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Price: </span>
                <span className="font-medium">{formatPrice(token.price)}</span>
              </div>
              <div>
                <span className="text-gray-400">Market Cap: </span>
                <span className="font-medium">{formatNumber(token.marketCap)}</span>
              </div>
              <div>
                <span className="text-gray-400">24h Change: </span>
                <span className={`font-medium ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-gray-400">Liquidity: </span>
                <span className="font-medium">{formatNumber(token.liquidity)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {isNewChannel && (
          <div className="mt-4 p-4 bg-green-900/30 rounded-lg border border-green-500/50">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-green-400">Congratulations!</span>
            </div>
            <p className="text-sm text-gray-300">
              You're the first person to discover <strong>{token.symbol}</strong> on CoinYaps! 
              A new discussion channel has been created for this token.
            </p>
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{token.comments?.length || 0} discussions</span>
          </div>
          
          <div className="text-sm text-blue-400">
            Redirecting to channel...
          </div>
        </div>
      </div>
    );
  }

  if (!query) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-center">
      <p className="text-gray-400">Enter a token symbol or contract address to search</p>
    </div>
  );
}