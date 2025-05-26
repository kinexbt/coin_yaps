'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import AuthButton from '../../components/auth/AuthButton';
import TokenHeader from '../../components/token/TokenHeader';
import CommentSection from '../../components/token/CommentSection';
import PredictionPanel from '../../components/token/PredictionPanel';
import Sidebar from '../../components/layout/Sidebar';
import Link from 'next/link';

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  address: string;
  network: string;
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  image?: string;
  supply: number;
  liquidity: number;
  rCurve: number;
}

export default function TokenPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (symbol) {
      fetchTokenData(symbol);
    }
  }, [symbol]);

  const fetchTokenData = async (tokenSymbol: string) => {
    try {
      const response = await fetch(`/api/tokens/${tokenSymbol}`);
      const data = await response.json();
      setTokenData(data);
    } catch (error) {
      console.error('Error fetching token data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Token not found</h1>
          <p className="text-gray-400">The token "{symbol}" could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#282828] text-white flex">
      
      
      {/* Main Content - Takes remaining space */}
      <div className="w-full flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 pl-8 pr-8 bg-[#282828]">
            <h1 className="text-2xl font-bold">CoinYaps</h1>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search CA"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#4D5157] text-white pl-10 pr-10 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          
          <AuthButton />
        </div>

        {/* Token Header */}
        

        {/* Main Content Area */}
        <div className="flex flex-wrap mx-8 bg-[#101114] overflow-hidden">

          <Sidebar currentToken={tokenData} />

          <div className='min-w-1/2'>
            <TokenHeader token={tokenData} />

            {/* Center - Comments Section */}
            <div className="max-h-screen flex flex-col">
              {/* Chart Area Placeholder */}
              <div className="h-[270px] border-b border-gray-700 p-4 flex items-center justify-center bg-gray-800/50">
                <h2 className="text-3xl font-bold text-gray-400">Chart like AXIOM</h2>
              </div>

              {/* Share Section */}
              <div className="h-[170px] flex flex-col justify-between border-b border-gray-700 px-6 pb-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                  <span className="text-sm text-gray-400">
                    Share your yaps on ${tokenData.symbol}(${tokenData.address.slice(0, 8)}...bonk)
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className='flex justify-between'>
                  <div className="flex space-x-1">
                    <button className="bg-white text-green-500 px-2 rounded-sm text-sm">
                      Bullish
                    </button>
                    <button className="bg-white rounded-sm text-red-500 hover:text-white px-2  text-sm transition-colors">
                      Bearish
                    </button>
                  </div>

                  <button className="text-gray-400 bg-gray-100 rounded-lg hover:bg-gray-300 hover:text-white px-4 py-2 text-sm transition-colors">
                      POST
                  </button>
                </div>
                
              </div>

              {/* Comments Section */}
              <div className="flex-1 px-6 pb-6 overflow-y-auto">
                <CommentSection tokenId={tokenData.id} />
              </div>
            </div>
          </div>
         {/* Right Panel */}
          <div className="w-1/4 border-l border-gray-700 bg-[#101114] flex flex-col">
            <div className="h-1/2">
              <h3 className="text-lg font-bold border-b border-gray-700 p-3">Latest ${tokenData.symbol} News</h3>
              <div className="space-y-4 text-sm text-gray-400 p-3">
                <p>
                  Use the official X API (formerly Twitter) API to access tweets or replies related to CA (e.g., tagged with ${tokenData.symbol} or CA).
                </p>
                <p>
                  Filter out irrelevant or noisy information.
                </p>
              </div>
            </div>

            <div className="h-1/2 flex-1 border-t border-gray-700">
              <PredictionPanel tokenId={tokenData.id} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center absolute bottom-0 left-0 right-0 bg-black p-3 text-center">
          
          <div></div>
          <p className="text-gray-400 text-sm">
            Memecoin search trends and community chatter.
          </p>

          <Link href="https://x.com">
            <img src="../../images/x-white.png" width={20} alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
}