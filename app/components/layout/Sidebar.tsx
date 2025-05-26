'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../lib/utils';
import { Star } from 'lucide-react';

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

// Mock data matching Figma design
const mockTokens = [
  { id: '1', symbol: 'NYLA', name: 'NYLA Token', price: 44300, priceChange24h: 15.5, comments: 65, status: 'MOONING' },
  { id: '2', symbol: 'PEPE', name: 'Pepe Coin', price: 66532, priceChange24h: -8.2, comments: 65, status: 'MOONING' },
  { id: '3', symbol: 'DOGE', name: 'Dogecoin', price: 66532, priceChange24h: 3.1, comments: 65, status: 'MOONING' },
  { id: '4', symbol: 'SHIB', name: 'Shiba Inu', price: 66532, priceChange24h: -2.4, comments: 65, status: 'MOONING' },
  { id: '5', symbol: 'BONK', name: 'Bonk Token', price: 66532, priceChange24h: 12.8, comments: 65, status: 'MOONING' },
  { id: '6', symbol: 'FLOKI', name: 'Floki Token', price: 66532, priceChange24h: 5.2, comments: 65, status: 'MOONING' },
  { id: '7', symbol: 'DOGE2', name: 'Doge 2.0', price: 66532, priceChange24h: -1.8, comments: 65, status: 'MOONING' },
];

export default function Sidebar({ currentToken }: SidebarProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-1/4 bg-[#101114] border-r border-gray-700 overflow-y-auto">
      <div className="flex flex-col justify-between">
        {/* Search Index Header */}
        <div className="flex justify-between items-center p-2 border-b-1 border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Search Index</h3>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className='mx-2'>1m</span>
            <span className='mx-2'>5m</span>
            <span className='mx-2'>30m</span>
            <span className='mx-2'>1h</span>
            <span className='mx-2'>24h</span>
            <button className="text-gray-400 hover:text-yellow-500 transition-colors">
              <Star className="w-5 h-5" />
          </button>
          </div>
        </div>

        {/* Token List */}
        <div className="space-y-2 max-h-[350px] overflow-y-auto overflow-hidden border-b border-gray-700">
          {mockTokens.map((token) => (
            <Link
              key={token.id}
              href=""
              className={`block p-3 rounded-lg transition-colors hover:bg-gray-700 ${
                currentToken?.symbol === token.symbol ? 'bg-gray-700 border-l-2 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Left side - Token info */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{token.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-white">{token.symbol}</span>
                      <span className="text-xs text-gray-400 uppercase">{token.status}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{token.comments}</span>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Price info */}
                <div className="text-right">
                  <p className="text-sm font-medium text-green-400">{token.price.toLocaleString()}</p>
                  <div className="flex items-center text-xs justify-end space-x-1">
                    <span>Comment {token.comments}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Market Cap Prediction Section */}
        <div className="flex flex-col justify-between bg-[#101114]">
          <h3 className="text-sm font-medium text-gray-400 border-b border-gray-700 mb-4 p-3">$NYLA Market Cap Prediction</h3>
          
          {/* Prediction Options */}
          <div className="space-y-4 pl-3 pr-3">
            {[
              { range: '$0-100K', percentage: 3 },
              { range: '$100K-1M', percentage: 5 },
              { range: '$1M-5M', percentage: 82 },
              { range: '$5M-20M', percentage: 10 },
              { range: '$20M+', percentage: 0 },
            ].map((prediction) => (
              <div key={prediction.range} className="flex items-center justify-between p-4 rounded-full bg-gray-700">
                <button className="text-sm text-gray-300 hover:text-white transition-colors">
                  {prediction.range}
                </button>
                <span className="text-sm font-medium text-white">{prediction.percentage}%</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 mb-8 text-center">
            <span className="text-sm text-gray-400">1236 votes</span>
          </div>
        </div>
      </div>
    </div>
  );
}