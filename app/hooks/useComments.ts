import { useState } from 'react';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

export function useComments(tokenId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    tokenId ? `/api/comments?tokenId=${tokenId}` : null,
    fetcher // Use the fetcher function instead of fetch directly
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addComment = async (content: string, parentId?: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          tokenId,
          parentId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const result = await response.json();
      mutate(); // Refresh comments
      return result.comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to like comment');
      }

      const result = await response.json();
      mutate(); // Refresh comments
      return result;
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  };

  return {
    comments: data?.comments || [],
    error,
    isLoading,
    isSubmitting,
    addComment,
    likeComment,
    mutate,
  };
}
