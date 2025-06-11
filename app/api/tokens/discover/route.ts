import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../lib/db';
import { authOptions } from '../../../lib/auth';
import { DexScreenerAPI } from '../../../lib/dexscreener';

export async function POST(request: NextRequest) {
  try {
    const { query, isAddress, tokenData } = await request.json();
    
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

    let finalTokenData = tokenData;
    
    if (!finalTokenData) {
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
          error: 'Token not found',
        });
      }

      finalTokenData = DexScreenerAPI.mapToTokenData(dexData);
    }

    const newToken = await prisma.token.create({
      data: {
        symbol: finalTokenData.symbol,
        name: finalTokenData.name,
        address: finalTokenData.address,
        network: finalTokenData.network,
        price: finalTokenData.price,
        marketCap: finalTokenData.marketCap,
        volume24h: finalTokenData.volume24h,
        priceChange24h: finalTokenData.priceChange24h,
        supply: finalTokenData.supply,
        liquidity: finalTokenData.liquidity,
        bCurve: finalTokenData.bCurve,
        image: finalTokenData.image,
      },
    });

    // Check if user is authenticated and create welcome comment
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
            content: `🎉 Welcome to the ${finalTokenData.symbol} community! This channel has been created for discussing ${finalTokenData.name}.`,
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
      congratulations: `🎉 New channel created for ${finalTokenData.symbol}!`,
    });

  } catch (error) {
    console.error('Token discovery error:', error);
    return NextResponse.json(
      { error: 'Failed to discover token' },
      { status: 500 }
    );
  }
}