'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Sparkles, Users, ExternalLink } from 'lucide-react';
import { formatPrice, formatNumber } from '../../lib/utils';
import toast from 'react-hot-toast';

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
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(false);
    
    try {
      const isAddress = query.length > 20 && (query.startsWith('0x') || /^[A-Za-z0-9]{32,}$/.test(query));
      
      const response = await fetch('/api/tokens/search', {
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

      if (data.success) {
        setResults(data.tokens || []);
      } else {
        setResults([]);
        toast.error(data.error || 'No tokens found');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  const handleTokenSelect = async (token: Token) => {
    try {
      // Check if token exists in database, if not create it
      const response = await fetch('/api/tokens/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: token.address,
          isAddress: true,
          tokenData: token,
        }),
      });

      const data = await response.json();

      if (data.found) {
        if (data.isNewChannel) {
          toast.success(data.congratulations, {
            duration: 3000,
            icon: '🎉',
          });
        }
        router.push(`/token/${token.symbol}`);
      } else {
        toast.error('Failed to access token channel');
      }
    } catch (error) {
      console.error('Token selection error:', error);
      toast.error('Failed to select token');
    }
  };

  useEffect(() => {
    if (query.trim()) {
      const timeoutId = setTimeout(handleSearch, 800);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  }, [query]);

  if (isLoading || isSearching) {
    return (
      <div className="bg-[#303134] rounded-lg p-4 mx-auto max-w-[340px] text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-gray-300">Searching tokens...</span>
        </div>
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="bg-[#303134] rounded-lg p-4 mx-auto max-w-[340px] text-center">
        <p className="text-gray-400">Next-Gen Crypto Search</p>
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className="bg-[#303134] rounded-lg p-6 text-center">
        <p className="text-gray-400">No tokens found for "{query}"</p>
        <p className="text-sm text-gray-500 mt-2">Try searching with a different symbol</p>
      </div>
    );
  }

  if (results.length > 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Search Results ({results.length})</h3>
          <span className="text-sm text-gray-400">Click a token to join its channel</span>
        </div>
        
        {results.map((token, index) => (
          <div
            key={`${token.address}-${index}`}
            onClick={() => handleTokenSelect(token)}
            className="bg-[#303134] hover:bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 border border-gray-700 hover:border-blue-500"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                {token.image ? (
                  <img
                    src={token.image}
                    alt={token.symbol}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-white font-bold text-sm">{token.symbol.slice(0, 2)}</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-white font-semibold truncate">{token.symbol}</h4>
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                    {token.network.toUpperCase()}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                
                <p className="text-gray-300 text-sm truncate mb-1">{token.name}</p>
                
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs text-gray-400">CA:</span>
                  <code className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded font-mono">
                    {token.address.slice(0, 6)}...{token.address.slice(-4)}
                  </code>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(token.address);
                      toast.success('Address copied!', { duration: 2000 });
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400">Price: </span>
                    <span className="font-medium text-white">{formatPrice(token.price)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Market Cap: </span>
                    <span className="font-medium text-white">{formatNumber(token.marketCap)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">24h Change: </span>
                    <div className="flex items-center space-x-1">
                      {token.priceChange24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`font-medium ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Volume 24h: </span>
                    <span className="font-medium text-white">{formatNumber(token.volume24h)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-gray-400">
                  <Users className="w-3 h-3" />
                  <span>{token.comments?.length || 0} discussions</span>
                </div>
                <div className="text-gray-400">
                  Liquidity: {formatNumber(token.liquidity)}
                </div>
              </div>
              
              <div className="text-blue-400 font-medium">
                Join Channel →
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}