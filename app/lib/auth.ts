import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import TwitterProvider from 'next-auth/providers/twitter';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './db';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            username: true,
            twitterId: true,
          },
        });
        
        if (dbUser) {
          session.user.username = dbUser.username || undefined;
          session.user.twitterId = dbUser.twitterId || undefined;
        }
      }
      return session;
    },
    
    async signIn({ user, account, profile }) {
      if (account?.provider === 'twitter' && profile && user.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              twitterId: (profile as any).id_str || (profile as any).id,
              username: (profile as any).screen_name || (profile as any).username,
              name: user.name || (profile as any).name,
              image: user.image || (profile as any).profile_image_url_https,
            },
          });
        } catch (error) {
          console.error('Error updating user with Twitter data:', error);
        }
      }
      
      if (account?.provider === 'google' && user.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              name: user.name,
              image: user.image,
            },
          });
        } catch (error) {
          console.error('Error updating user with Google data:', error);
        }
      }
      
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
  debug: process.env.NODE_ENV === 'development',
};



