import { Comment } from './comment';
import { Prediction } from './prediction';

export interface Token {
  id: string;
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
  bCurve: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenWithComments extends Token {
  comments: Comment[];
  predictions: Prediction[];
}