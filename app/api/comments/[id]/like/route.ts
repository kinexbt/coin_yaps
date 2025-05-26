import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../../lib/db';
import { authOptions } from '../../../../lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await the params Promise
    const { id } = await params;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const hasLiked = comment.likedBy.includes(user.id);

    let updatedComment;
    if (hasLiked) {
      // Unlike
      updatedComment = await prisma.comment.update({
        where: { id },
        data: {
          likes: { decrement: 1 },
          likedBy: {
            set: comment.likedBy.filter((userId: string) => userId !== user.id)
          }
        },
      });
    } else {
      // Like
      updatedComment = await prisma.comment.update({
        where: { id },
        data: {
          likes: { increment: 1 },
          likedBy: {
            push: user.id
          }
        },
      });
    }

    return NextResponse.json({ 
      liked: !hasLiked, 
      likes: updatedComment.likes 
    });
  } catch (error) {
    console.error('Like comment API error:', error);
    return NextResponse.json({ error: 'Failed to like comment' }, { status: 500 });
  }
}