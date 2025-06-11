'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Copy, TrendingDown, MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../lib/utils';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Token {
  id: string;
  symbol: string;
  name: string;
  address: string;
  network: string;
  marketCap: number;
  liquidity: number;
  price?: number;
  priceChange24h?: number;
  image?: string;
  commentCount: number;
}

interface Prediction {
  priceRange: string;
  percentage: number;
  voteCount: number;
}

interface SidebarProps {
  currentToken?: {
    id: string;
    symbol: string;
    name: string;
    price: number;
    priceChange24h: number;
    image?: string;
  };
}

export default function Sidebar({ currentToken }: SidebarProps) {
  const { isAuthenticated } = useAuth();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [currentTokenSymbol, setCurrentTokenSymbol] = useState<string>('NYLA');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTokens = async () => {
      try {
        const response = await fetch('/api/tokens/top-by-comments');
        if (response.ok) {
          const data = await response.json();
          setTokens(data);
        }
      } catch (error) {
        console.error('Error fetching top tokens:', error);
        setTokens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTokens();
  }, []);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!currentTokenSymbol) return;
      
      try {
        const response = await fetch(`/api/predictions/${currentTokenSymbol}`);
        if (response.ok) {
          const data = await response.json();
          setPredictions(data);
        } else {
          setPredictions(getDefaultPredictions());
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
        setPredictions(getDefaultPredictions());
      }
    };

    fetchPredictions();
  }, [currentTokenSymbol]);

  const getDefaultPredictions = (): Prediction[] => [
    { priceRange: '$0-100K', percentage: 0, voteCount: 0 },
    { priceRange: '$100K-1M', percentage: 0, voteCount: 0 },
    { priceRange: '$1M-5M', percentage: 0, voteCount: 0 },
    { priceRange: '$5M-20M', percentage: 0, voteCount: 0 },
    { priceRange: '$20M+', percentage: 0, voteCount: 0 },
  ];

  const totalVotes = predictions.reduce((sum, pred) => sum + pred.voteCount, 0);

  if (loading) {
    return (
      <div className="w-1/4 bg-[#101114] border-r border-gray-700 flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    if (num >= 1)   return `$${(num).toFixed(6)}`;
    return `$${num.toFixed(6)}`;
  };

  return (
    <div className="w-1/5 bg-[#101114] border-r border-gray-700 h-screen flex flex-col">
      
      {/* TOP HALF - Token List Section */}
      <div className="h-3/7 flex flex-col">
        {/* Search Index Header */}
        <div className="flex justify-between items-center px-3 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-400">Search Index</h3>
          <div className="flex items-center text-xs text-gray-500 space-x-2">
            <span>1m</span>
            <span>5m</span>
            <span>30m</span>
            <span>1h</span>
            <span>24h</span>
            <button className="text-gray-400 hover:text-yellow-500 transition-colors ml-2">
              <Star className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Token List - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-2">
            {tokens.length > 0 ? (
              tokens.map((token) => (
                <Link
                  key={token.id}
                  href={`/token/${token.symbol}`}
                  className={`block px-2 py-1 mb-2 transition-colors hover:bg-gray-700 ${
                    currentToken?.symbol === token.symbol ? 'bg-gray-700 border-l-2 border-blue-500' : ''
                  }`}
                  onClick={() => setCurrentTokenSymbol(token.symbol)}
                >
                  <div className="flex items-center justify-between">
                    {/* Left side - Token info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-500 flex items-center justify-center">
                        {token.image ? (
                          <img src={token.image} alt={token.symbol} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-black font-bold text-lg">{token.symbol.charAt(0)}</span>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <div className="flex items-center space-x-2">
                          <h1 className="text-xs font-bold text-white">{token.symbol}</h1>
                          <span className="text-gray-400 text-xs">{token.name.slice(0, 10)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs font-mono text-gray-400 bg-gray-700 py-1">
                            {token.address.slice(0, 6)}...{token.address.slice(-6)}
                          </code>
                          
                        </div>
                        <div className='text-xs'>
                            {formatNumber(token.marketCap)}({formatNumber(token.liquidity)})
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Price info */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm text-green-300 font-medium ${
                        token.priceChange24h && token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {token.price ? formatPrice(token.price) : 'N/A'}
                      </p>
                      <div className="text-md text-green-300">
                        Comments: {token.commentCount}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <div className="text-gray-500 text-4xl mb-2">📊</div>
                <div className="text-gray-400 text-sm">No tokens found</div>
                <div className="text-gray-500 text-xs mt-1">Add some tokens to get started</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM HALF - Market Cap Prediction Section */}
      <div className="h-3/7 flex flex-col border-t border-gray-700">
        {/* Prediction Header */}
        <div className="p-3 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-400">
            ${currentTokenSymbol} Market Cap Prediction
          </h3>
        </div>
        
        {/* Prediction Content - Scrollable if needed */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-3">
            {/* Prediction Options */}
            <div className="space-y-3">
              {predictions.map((prediction) => (
                <div 
                  key={prediction.priceRange} 
                  className="flex items-center justify-between p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => handleVote(prediction.priceRange)}
                >
                  <span className="text-sm text-gray-300 hover:text-white transition-colors">
                    {prediction.priceRange}
                  </span>
                  <span className="text-sm font-medium text-white">{prediction.percentage}%</span>
                </div>
              ))}
            </div>
            
            {/* Vote Count */}
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-400">{totalVotes} votes</span>
            </div>

          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar { 
          display: none;  /* Safari and Chrome */
        }
      `}</style>
    </div>
  );

  // Handle voting
  async function handleVote(priceRange: string) {
    if (!isAuthenticated) {
      // Could show login modal here
      console.log('Please log in to vote');
      return;
    }

    try {
      const response = await fetch('/api/predictions/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenSymbol: currentTokenSymbol,
          priceRange: priceRange,
        }),
      });

      if (response.ok) {
        // Refresh predictions after voting
        const updatedResponse = await fetch(`/api/predictions/${currentTokenSymbol}`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setPredictions(updatedData);
        }
      } else {
        console.error('Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  }
}