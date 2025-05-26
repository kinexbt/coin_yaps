import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const protectedPaths = ['/api/comments', '/api/predictions'];
        const isProtectedApiRoute = protectedPaths.some(path => 
          req.nextUrl.pathname.startsWith(path)
        );
        
        if (isProtectedApiRoute && req.method !== 'GET') {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/api/:path*']
};
