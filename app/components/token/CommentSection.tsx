
// components/token/CommentSection.tsx - Complete implementation
'use client';

import { useState } from 'react';
import { MessageCircle, Heart, Share, MoreHorizontal, Reply } from 'lucide-react';
import { useComments } from '../../hooks/useComments';
import { useAuth } from '../../hooks/useAuth';
import { formatTimeAgo } from '../../lib/utils';
import toast from 'react-hot-toast';

interface CommentSectionProps {
  tokenId: string;
}

export default function CommentSection({ tokenId }: CommentSectionProps) {
  const { comments, isLoading, addComment, likeComment, isSubmitting } = useComments(tokenId);
  const { isAuthenticated, user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await addComment(newComment);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to reply');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    try {
      await addComment(replyContent, parentId);
      setReplyContent('');
      setReplyTo(null);
      toast.success('Reply added successfully');
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like comments');
      return;
    }

    try {
      await likeComment(commentId);
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  if (isLoading) {
    return <CommentSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Comment Input */}
      {isAuthenticated && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || ''}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold">{user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this token..."
                className="w-full bg-gray-700 text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-400">
                  {280 - newComment.length} characters remaining
                </span>
                <button
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Count */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{comments.length} Comments</h3>
        <div className="flex space-x-2">
          <button className="text-sm text-gray-400 hover:text-white">Latest</button>
          <button className="text-sm text-gray-400 hover:text-white">Popular</button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment: any) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={() => handleLikeComment(comment.id)}
            onReply={() => setReplyTo(comment.id)}
            replyTo={replyTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            onSubmitReply={() => handleSubmitReply(comment.id)}
            onCancelReply={() => setReplyTo(null)}
            isAuthenticated={isAuthenticated}
            currentUserId={user?.id}
          />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No comments yet</h3>
          <p className="text-gray-500">Be the first to share your thoughts about this token!</p>
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: any;
  onLike: () => void;
  onReply: () => void;
  replyTo: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
  isAuthenticated: boolean;
  currentUserId?: string;
}

function CommentItem({
  comment,
  onLike,
  onReply,
  replyTo,
  replyContent,
  setReplyContent,
  onSubmitReply,
  onCancelReply,
  isAuthenticated,
  currentUserId,
}: CommentItemProps) {
  const isLiked = currentUserId && comment.likedBy?.includes(currentUserId);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex space-x-3">
        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
          {comment.user.image ? (
            <img
              src={comment.user.image}
              alt={comment.user.name || ''}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold">
              {comment.user.name?.charAt(0) || comment.user.username?.charAt(0) || 'U'}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium">{comment.user.name || comment.user.username}</span>
            <span className="text-sm text-gray-400">@{comment.user.username}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">{formatTimeAgo(new Date(comment.createdAt))}</span>
          </div>
          
          <p className="text-gray-200 mb-3">{comment.content}</p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onLike}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-1 text-sm ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              } transition-colors`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likes}</span>
            </button>
            
            <button
              onClick={onReply}
              disabled={!isAuthenticated}
              className="flex items-center space-x-1 text-sm text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span>Reply</span>
            </button>
            
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              <Share className="w-4 h-4" />
            </button>
            
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          
          {/* Reply Input */}
          {replyTo === comment.id && (
            <div className="mt-4 ml-4 border-l-2 border-gray-700 pl-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.user.name || comment.user.username}...`}
                className="w-full bg-gray-700 text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={onCancelReply}
                  className="text-sm text-gray-400 hover:text-white px-3 py-1"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmitReply}
                  disabled={!replyContent.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                  Reply
                </button>
              </div>
            </div>
          )}
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply: any) => (
                <div key={reply.id} className="ml-4 border-l-2 border-gray-700 pl-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      {reply.user.image ? (
                        <img
                          src={reply.user.image}
                          alt={reply.user.name || ''}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold">
                          {reply.user.name?.charAt(0) || reply.user.username?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{reply.user.name || reply.user.username}</span>
                        <span className="text-xs text-gray-400">@{reply.user.username}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{formatTimeAgo(new Date(reply.createdAt))}</span>
                      </div>
                      <p className="text-gray-200 text-sm">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}