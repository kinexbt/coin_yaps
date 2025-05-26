
// hooks/useTokenData.ts - Custom hook for token data
import { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useTokenData(symbol: string) {
  const { data, error, isLoading, mutate } = useSWR(
    symbol ? `/api/tokens/${symbol}` : null,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    token: data,
    error,
    isLoading,
    mutate,
  };
}