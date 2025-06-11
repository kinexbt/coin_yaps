'use client';

import { Star, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface TokenHeaderProps {
  token: {
    symbol: string;
    name: string;
    address: string;
    price: number;
    marketCap: number;
    volume24h: number;
    priceChange24h: number;
    supply: number;
    liquidity: number;
    bCurve: number;
    image?: string;
  };
}

export default function TokenHeader({ token }: TokenHeaderProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    if (num >= 1)   return `$${(num).toFixed(6)}`;
    return `$${num.toFixed(6)}`;
  };

  return (
    <div className="border-b border-gray-700 p-3 bg-[#101114]">
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
              <h1 className="text-lg font-bold text-white">{token.symbol}</h1>
              <span className="text-gray-400 text-sm">{token.name}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <code className="text-xs text-gray-400 font-mono bg-gray-700 px-2 py-1 rounded">
                {token.address.slice(0, 4)}...{token.address.slice(-4)}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(token.address);
                  toast.success('Address copied!', { duration: 2000 });
                }}
                className="text-gray-400 hover:text-white transition-colors p-1"
                title="Copy address"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Stats */}
        <div className="flex items-center space-x-6">
          {/* Market Cap */}
          <div className='text-center'>{formatNumber(token.marketCap)}</div>
          {/* Price */}
          <div className="text-center">
            <p className="text-sm text-gray-400">Price</p>
            <p className="text-md font-bold text-white">{formatNumber(token.price)}</p>
          </div>

          {/* Liquidity */}
          <div className="text-center">
            <p className="text-sm text-gray-400">Liquidity</p>
            <p className="text-md font-bold text-white">{formatNumber(token.liquidity)}</p>
          </div>

          {/* Supply */}
          <div className="text-center">
            <p className="text-sm text-gray-400">Supply</p>
            <p className="text-md font-bold text-white">{token.supply}B</p>
          </div>

          {/* B-Curve */}
          <div className="text-center">
            <p className="text-sm text-gray-400">B-Curve</p>
            <p className="text-md font-bold text-green-500">{token.bCurve.toFixed(1)}%</p>
          </div>

          <button className="text-gray-400 hover:text-yellow-500 transition-colors">
            <Star className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}