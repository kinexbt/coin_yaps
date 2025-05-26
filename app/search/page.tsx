'use client';

import AuthButton from '../components/auth/AuthButton';
import SearchBar from '../components/search/SearchBar';
import Link from 'next/link';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#282828] text-white">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-4 right-6">
          <AuthButton />
        </div>
        
        {/* Main Content */}
        <div className='flex flex-col justify-start'>
          <div className="flex flex-col items-center justify-start pt-15 min-h-screen">
            <div className="w-full max-w-3xl text-center">
              {/* Logo and Title */}
              <h1 className="text-8xl font-bold mb-2 tracking-wider">CoinYaps</h1>
              <p className="text-gray-400 text-sm mb-6">
                Search, analyze, and discuss cryptocurrency trends with the community.
              </p>
              <SearchBar />
            </div>
          </div>


        </div>
        
        
        {/* Footer */}
        <div className="flex justify-between items-center absolute bottom-0 left-0 right-0 bg-black p-3 text-center">
          
          <div></div>
          <p className="text-gray-400 text-sm">
            Your one-step platform for meme coin insights.
          </p>

          <Link href="https://x.com">
            <img src="./images/x-white.png" width={20} alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
}