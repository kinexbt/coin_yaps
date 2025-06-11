import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { DexScreenerAPI } from '../../../lib/dexscreener';

export async function POST(request: NextRequest) {
  try {
    const { query, isAddress } = await request.json();
    
    if (!query?.trim()) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const searchQuery = query.trim().toUpperCase();
    let tokens = [];

    // First, check existing tokens in database
    let existingTokens;
    
    if (isAddress) {
      existingTokens = await prisma.token.findMany({
        where: { address: query.trim() },
        include: {
          comments: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } else {
      existingTokens = await prisma.token.findMany({
        where: { 
          OR: [
            { symbol: { contains: searchQuery } },
            { name: { contains: searchQuery, mode: 'insensitive' } }
          ]
        },
        include: {
          comments: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
        take: 10, // Limit results
      });
    }

    tokens.push(...existingTokens);

    let dexResults: any[] = [];
    
    if (isAddress) {
      const dexData = await DexScreenerAPI.searchByAddress(query.trim());
      if (dexData) {
        dexResults = [dexData];
      }
    } else {
      dexResults = await DexScreenerAPI.searchBySymbol(searchQuery);
      dexResults = dexResults.slice(0, 15);
    }

    const dexTokens = dexResults.map(dexData => {
      const tokenData = DexScreenerAPI.mapToTokenData(dexData);
      return {
        ...tokenData,
        id: `dex-${tokenData.address}`, 
        comments: [],
      };
    });

    const existingAddresses = new Set(existingTokens.map(t => t.address.toLowerCase()));
    const newDexTokens = dexTokens.filter(token => 
      !existingAddresses.has(token.address.toLowerCase())
    );

    tokens.push(...newDexTokens);

    tokens.sort((a, b) => {
      const aExactMatch = a.symbol.toUpperCase() === searchQuery;
      const bExactMatch = b.symbol.toUpperCase() === searchQuery;
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      // Then sort by market cap + volume (higher is better)
      const aScore = (a.marketCap || 0) + (a.volume24h || 0);
      const bScore = (b.marketCap || 0) + (b.volume24h || 0);
      
      return bScore - aScore;
    });

    tokens = tokens.slice(0, 20);

    return NextResponse.json({
      success: true,
      tokens,
      total: tokens.length,
    });

  } catch (error) {
    console.error('Token search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search tokens' },
      { status: 500 }
    );
  }
}