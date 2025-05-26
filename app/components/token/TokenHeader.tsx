'use client';

import { Star, TrendingUp, TrendingDown } from 'lucide-react';

interface TokenHeaderProps {
  token: {
    symbol: string;
    name: string;
    price: number;
    marketCap: number;
    volume24h: number;
    priceChange24h: number;
    supply: number;
    liquidity: number;
    rCurve: number;
    image?: string;
  };
}

export default function TokenHeader({ token }: TokenHeaderProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="border-b border-gray-700 p-3 bg-[#101114]">
      <div className="flex items-center justify-between">
        {/* Left side - Token info */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            {token.image ? (
              <img src={token.image} alt={token.symbol} className="w-full h-full rounded-lg object-cover" />
            ) : (
              <span className="text-black font-bold text-lg">{token.symbol.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white">{token.symbol}</h1>
              <span className="text-gray-400 text-sm">{token.name}</span>
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
            </div>
          </div>
        </div>

        {/* Right side - Stats */}
        <div className="flex items-center space-x-8">
          {/* Price */}
          <div className="text-center">
            <p className="text-sm text-gray-400">Price</p>
            <p className="text-lg font-bold text-white">{formatNumber(token.price)}</p>
            {/* <div className="flex items-center justify-center space-x-1">
              {token.priceChange24h >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
              </span>
            </div> */}
          </div>

          {/* Liquidity */}
          <div className="text-center">
            <p className="text-sm text-gray-400">Liquidity</p>
            <p className="text-lg font-bold text-white">{formatNumber(token.liquidity)}</p>
          </div>

          {/* Supply */}
          <div className="text-center">
            <p className="text-sm text-gray-400">Supply</p>
            <p className="text-lg font-bold text-white">{token.supply}</p>
          </div>

          {/* R-Curve */}
          <div className="text-center">
            <p className="text-sm text-gray-400">R-Curve</p>
            <p className="text-lg font-bold text-green-500">{token.rCurve.toFixed(1)}%</p>
          </div>

          <button className="text-gray-400 hover:text-yellow-500 transition-colors">
            <Star className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}