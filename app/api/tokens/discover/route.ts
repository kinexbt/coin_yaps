import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../lib/db';
import { authOptions } from '../../../lib/auth';
import { DexScreenerAPI } from '../../../lib/dexscreener';

export async function POST(request: NextRequest) {
  try {
    const { query, isAddress } = await request.json();
    
    if (!query?.trim()) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const searchQuery = query.trim().toUpperCase();

    let existingToken;
    
    if (isAddress) {
      existingToken = await prisma.token.findUnique({
        where: { address: query.trim() },
        include: {
          comments: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } else {
      existingToken = await prisma.token.findUnique({
        where: { symbol: searchQuery },
        include: {
          comments: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    if (existingToken) {
      return NextResponse.json({
        found: true,
        token: existingToken,
        isNewChannel: false,
      });
    }

    let dexData;
    
    if (isAddress) {
      dexData = await DexScreenerAPI.searchByAddress(query.trim());
    } else {
      const results = await DexScreenerAPI.searchBySymbol(searchQuery);
      dexData = results[0]; 
    }

    if (!dexData) {
      return NextResponse.json({
        found: false,
        error: 'Token not found on DexScreener',
      });
    }

    const tokenData = DexScreenerAPI.mapToTokenData(dexData);
    
    const newToken = await prisma.token.create({
      data: tokenData,
    });

    const session = await getServerSession(authOptions);
    let isFirstUser = false;
    
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      
      if (user) {
        isFirstUser = true;
        await prisma.comment.create({
          data: {
            content: `🎉 Congratulations! You're the first person to discover ${tokenData.symbol} on CoinYaps! Welcome to the ${tokenData.name} community channel.`,
            userId: user.id,
            tokenId: newToken.id,
          },
        });
      }
    }

    return NextResponse.json({
      found: true,
      token: newToken,
      isNewChannel: true,
      isFirstUser,
      congratulations: `🎉 You discovered ${tokenData.symbol}! You're the first to create this channel.`,
    });

  } catch (error) {
    console.error('Token discovery error:', error);
    return NextResponse.json(
      { error: 'Failed to discover token' },
      { status: 500 }
    );
  }
}