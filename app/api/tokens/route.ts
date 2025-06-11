import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/db';

export async function GET() {
  try {
    const tokens = await prisma.token.findMany({
      take: 50,
      orderBy: { marketCap: 'desc' },
    });

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Tokens API error:', error);
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbol, name, address, network, price, marketCap, image } = body;

    // Check if token already exists
    const existingToken = await prisma.token.findFirst({
      where: {
        OR: [
          { symbol: symbol },
          { address: address }
        ]
      }
    });

    if (existingToken) {
      return NextResponse.json({ error: 'Token already exists' }, { status: 400 });
    }

    const token = await prisma.token.create({
      data: {
        symbol: symbol.toUpperCase(),
        name,
        address,
        network: network.toLowerCase(),
        price: price || 0,
        marketCap: marketCap || 0,
        volume24h: 0,
        priceChange24h: 0,
        supply: 0,
        liquidity: 0,
        bCurve: 0,
        image,
      },
    });

    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.error('Create token API error:', error);
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
  }
}