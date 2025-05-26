'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { X } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onSwitchMode: (mode: 'signin' | 'signup') => void;
}

export function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProviderSignIn = async (provider: string) => {
    setIsLoading(provider);
    try {
      await signIn(provider, { 
        callbackUrl: window.location.href,
        redirect: true 
      });
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    } finally {
      setIsLoading(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'signin' ? 'Log in' : 'Sign up'}
          </h2>
        </div>

        {/* Auth Buttons */}
        <div className="space-y-4">
          {/* Twitter/X Button */}
          <button
            onClick={() => handleProviderSignIn('twitter')}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center space-x-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:opacity-50 text-white py-3 px-4 rounded-full transition-colors duration-200"
          >
            {isLoading === 'twitter' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <BsTwitterX className="w-5 h-5" />
            )}
            <span className="font-medium">Continue with X</span>
          </button>

          {/* Google Button */}
          <button
            onClick={() => handleProviderSignIn('google')}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center space-x-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:opacity-50 text-white py-3 px-4 rounded-full transition-colors duration-200"
          >
            {isLoading === 'google' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <FaGoogle className="w-5 h-5 text-red-500" />
            )}
            <span className="font-medium">Continue with Google</span>
          </button>
        </div>

        {/* Switch Mode */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => onSwitchMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {mode === 'signin' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}