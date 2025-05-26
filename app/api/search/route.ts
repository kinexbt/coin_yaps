import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ tokens: [] });
    }

    // Search tokens by symbol, name, or address
    const tokens = await prisma.token.findMany({
      where: {
        OR: [
          { symbol: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: [
        { marketCap: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}