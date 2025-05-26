interface DexScreenerToken {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels?: string[];
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd?: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity?: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  marketCap?: number;
  info?: {
    imageUrl?: string;
    websites?: Array<{ label: string; url: string }>;
    socials?: Array<{ type: string; url: string }>;
  };
}

interface DexScreenerResponse {
  schemaVersion: string;
  pairs: DexScreenerToken[];
}

export class DexScreenerAPI {
  private static readonly BASE_URL = 'https://api.dexscreener.com/latest/dex';

  static async searchByAddress(address: string): Promise<DexScreenerToken | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/tokens/${address}`);
      if (!response.ok) return null;
      
      const data: DexScreenerResponse = await response.json();
      return data.pairs?.[0] || null;
    } catch (error) {
      console.error('DexScreener API error:', error);
      return null;
    }
  }

  static async searchBySymbol(symbol: string, chainId?: string): Promise<DexScreenerToken[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/search/?q=${encodeURIComponent(symbol)}`);
      if (!response.ok) return [];
      
      const data: DexScreenerResponse = await response.json();
      let pairs = data.pairs || [];
      
      if (chainId) {
        pairs = pairs.filter(pair => pair.chainId === chainId);
      }
      
      return pairs.sort((a, b) => {
        const aScore = (a.liquidity?.usd || 0) + (a.volume?.h24 || 0);
        const bScore = (b.liquidity?.usd || 0) + (b.volume?.h24 || 0);
        return bScore - aScore;
      });
    } catch (error) {
      console.error('DexScreener API error:', error);
      return [];
    }
  }

  static mapToTokenData(dexData: DexScreenerToken): {
    symbol: string;
    name: string;
    address: string;
    network: 'solana' | 'bsc';
    price: number;
    marketCap: number;
    volume24h: number;
    priceChange24h: number;
    supply: number;
    liquidity: number;
    rCurve: number;
    image?: string;
  } {
    const network = dexData.chainId === 'solana' ? 'solana' : 'bsc';
    
    return {
      symbol: dexData.baseToken.symbol,
      name: dexData.baseToken.name,
      address: dexData.baseToken.address,
      network,
      price: parseFloat(dexData.priceUsd || '0'),
      marketCap: dexData.marketCap || dexData.fdv || 0,
      volume24h: dexData.volume?.h24 || 0,
      priceChange24h: dexData.priceChange?.h24 || 0,
      supply: 0, 
      liquidity: dexData.liquidity?.usd || 0,
      rCurve: 0, 
      image: dexData.info?.imageUrl,
    };
  }
}
