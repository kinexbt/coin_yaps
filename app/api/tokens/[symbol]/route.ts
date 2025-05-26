import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> } // Changed to Promise
) {
  try {
    // Await the params Promise
    const { symbol } = await params;

    const token = await prisma.token.findUnique({
      where: { symbol: symbol.toUpperCase() },
      include: {
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                  },
                },
              },
            },
          },
          where: {
            parentId: null, // Only top-level comments
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        predictions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    return NextResponse.json(token);
  } catch (error) {
    console.error('Token API error:', error);
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> } // Changed to Promise
) {
  try {
    // Await the params Promise
    const { symbol } = await params;
    const body = await request.json();

    const updatedToken = await prisma.token.update({
      where: { symbol: symbol.toUpperCase() },
      data: body,
    });

    return NextResponse.json(updatedToken);
  } catch (error) {
    console.error('Update token API error:', error);
    return NextResponse.json({ error: 'Failed to update token' }, { status: 500 });
  }
}