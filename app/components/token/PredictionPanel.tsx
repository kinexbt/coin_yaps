'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface PredictionPanelProps {
  tokenId: string;
}

interface PredictionData {
  priceRange: string;
  percentage: number;
  votes: number;
  userVoted?: boolean;
}

const PRICE_RANGES = [
  { range: '$0-100K', label: '$0-100K', color: 'bg-red-500' },
  { range: '$100K-1M', label: '$100K-1M', color: 'bg-orange-500' },
  { range: '$1M-5M', label: '$1M-5M', color: 'bg-yellow-500' },
  { range: '$5M-20M', label: '$5M-20M', color: 'bg-green-500' },
  { range: '$20M+', label: '$20M+', color: 'bg-blue-500' },
];

export default function PredictionPanel({ tokenId }: PredictionPanelProps) {
  const { isAuthenticated, user } = useAuth();
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, [tokenId]);

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`/api/predictions?tokenId=${tokenId}`);
      const data = await response.json();
      
      // Initialize predictions with mock data for demo
      const mockPredictions: PredictionData[] = [
        { priceRange: '$0-100K', percentage: 3, votes: 4, userVoted: false },
        { priceRange: '$100K-1M', percentage: 5, votes: 6, userVoted: false },
        { priceRange: '$1M-5M', percentage: 82, votes: 101, userVoted: false },
        { priceRange: '$5M-20M', percentage: 10, votes: 12, userVoted: false },
        { priceRange: '$20M+', percentage: 0, votes: 0, userVoted: false },
      ];
      
      setPredictions(mockPredictions);
      setTotalVotes(123); // Mock total votes
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (priceRange: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to vote');
      return;
    }

    setIsVoting(true);
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId,
          priceRange,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      setUserVote(priceRange);
      toast.success('Vote submitted successfully!');
      // Refresh predictions after voting
      fetchPredictions();
    } catch (error) {
      toast.error('Failed to submit vote');
      console.error('Vote error:', error);
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) {
    return <PredictionSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Market Cap Prediction Section by KOLs */}
      <div className="flex items-center space-x-2 py-3 text-sm text-gray-400 border-b border-gray-700 px-4">
        $NYLA Rating ( by KOLs ) 
      </div>

      <div>
        <div className="space-y-3 px-4">
          {[
            { username: 'Ga_ke', action: 'set at $5-20M', time: '05/28/25 1:35AM', price: '$20M+' },
            { username: 'Ansenm', action: 'set at $5-20M', time: '05/28/25 1:35AM', price: '$5-20M' },
            { username: 'Poww', action: 'set at $5-20M', time: '05/25/25 1:35AM', price: '$5-20M' },
            { username: 'Ga_ke', action: 'set at $5-20M', time: '05/28/25 1:35AM', price: '$5-20M' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{activity.username.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium text-blue-400">{activity.username}</span>
                    <span className="text-gray-400"> has {activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                activity.price === '$20M+' ? 'bg-blue-500' :
                activity.price === '$5-20M' ? 'bg-green-500' : 'bg-gray-500'
              }`}>
                {activity.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
}

function PredictionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/6"></div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


