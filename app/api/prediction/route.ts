
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../lib/db';
import { authOptions } from '../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get('tokenId');

    if (!tokenId) {
      return NextResponse.json({ error: 'Token ID required' }, { status: 400 });
    }

    // Get all predictions for this token
    const predictions = await prisma.prediction.findMany({
      where: { tokenId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    // Group by price range and calculate percentages
    const ranges = ['$0-100K', '$100K-1M', '$1M-5M', '$5M-20M', '$20M+'];
    const total = predictions.length;
    
    const result = ranges.map(range => {
      const count = predictions.filter((p: any) => p.priceRange === range).length;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      
      return {
        priceRange: range,
        percentage,
        votes: count,
        users: predictions
          .filter((p:any) => p.priceRange === range)
          .map((p: any) => p.user)
          .slice(0, 5), 
      };
    });

    return NextResponse.json({ predictions: result, totalVotes: total });
  } catch (error) {
    console.error('Get predictions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tokenId, priceRange } = body;

    // Validate price range
    const validRanges = ['$0-100K', '$100K-1M', '$1M-5M', '$5M-20M', '$20M+'];
    if (!validRanges.includes(priceRange)) {
      return NextResponse.json({ error: 'Invalid price range' }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or update prediction
    const prediction = await prisma.prediction.upsert({
      where: {
        userId_tokenId: {
          userId: user.id,
          tokenId,
        },
      },
      update: {
        priceRange,
      },
      create: {
        userId: user.id,
        tokenId,
        priceRange,
        percentage: 0, // Will be calculated in recalculation
      },
    });

    // Recalculate percentages for all predictions for this token
    await recalculatePredictionPercentages(tokenId);

    return NextResponse.json({ prediction }, { status: 201 });
  } catch (error) {
    console.error('Create prediction API error:', error);
    return NextResponse.json({ error: 'Failed to create prediction' }, { status: 500 });
  }
}

async function recalculatePredictionPercentages(tokenId: string) {
  const predictions = await prisma.prediction.findMany({
    where: { tokenId },
  });

  const total = predictions.length;
  const ranges = ['$0-100K', '$100K-1M', '$1M-5M', '$5M-20M', '$20M+'];
  
  for (const range of ranges) {
    const count = predictions.filter((p: any) => p.priceRange === range).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    
    await prisma.prediction.updateMany({
      where: {
        tokenId,
        priceRange: range,
      },
      data: {
        percentage,
      },
    });
  }
}