import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username?: string;
      twitterId?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    username?: string;
    twitterId?: string;
  }

  interface Profile {
    id: string;
    username?: string;
    data?: {
      id: string;
      username: string;
      name: string;
      profile_image_url?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username?: string;
    twitterId?: string;
  }
}