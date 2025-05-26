
import { User } from './user';

export interface Comment {
  id: string;
  content: string;
  userId: string;
  tokenId: string;
  parentId?: string;
  likes: number;
  likedBy: string[];
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name?: string;
    username?: string;
    image?: string;
  };
  replies?: Comment[];
}
