'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import EnhancedSearchResults from './EnhancedSearchResult';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="w-full max-w-4xl">
      {/* Search Input */}
      <div className="relative mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search token symbol or paste contract address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#4D5157] text-white pl-12 pr-12 py-2 rounded-full text-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSearching(true)}
            disabled={!query.trim()}
            className="bg-[#303134] hover:bg-gray-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Next-Gen Crypto Search
          </button>
        </div>
      </div>

      {/* Search Results */}
      <EnhancedSearchResults 
        query={query} 
        isSearching={isSearching}
      />
    </div>
  );
}