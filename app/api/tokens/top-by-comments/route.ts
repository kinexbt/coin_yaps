import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // First, get all tokens with comment counts
    const tokens = await prisma.token.findMany({
      select: {
        id: true,
        symbol: true,
        name: true,
        address: true,
        network: true,
        price: true,
        priceChange24h: true,
        marketCap: true,
        liquidity: true,
        image: true,
        comments: {
          select: {
            id: true
          }
        }
      },
      orderBy: [
        {
          comments: {
            _count: 'desc'
          }
        },
        {
          createdAt: 'desc' // Secondary sort by creation date
        }
      ]
    });

    // Transform data to include comment count
    const tokensWithCommentCount = tokens.map(token => ({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      network: token.network,
      price: token.price || 0,
      priceChange24h: token.priceChange24h || 0,
      marketCap: token.marketCap || 0,
      liquidity: token.liquidity || 0,
      image: token.image,
      commentCount: token.comments.length
    }));

    // If no tokens found, return empty array
    if (tokensWithCommentCount.length === 0) {
      console.log('No tokens found in database');
      return Response.json([]);
    }

    console.log(`Found ${tokensWithCommentCount.length} tokens`);
    return Response.json(tokensWithCommentCount);

  } catch (error) {
    console.error('Error fetching tokens:', error);
    return Response.json({ error: 'Failed to fetch tokens' }, { status: 500 });
  }
}
