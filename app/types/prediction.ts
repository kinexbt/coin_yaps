import { User } from './user';

export interface Prediction {
  id: string;
  userId: string;
  tokenId: string;
  priceRange: string;
  percentage: number;
  createdAt: Date;
  user: {
    id: string;
    name?: string;
    username?: string;
  };
}