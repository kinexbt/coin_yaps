import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user || null,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    session,
    userId: session?.user?.id,
    username: session?.user?.username,
    twitterId: session?.user?.twitterId,
  };
}