'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import EnhancedSearchResults from './EnhancedSearchResult';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div className="w-full max-w-4xl">
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search CA..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#4D5157] text-white pl-12 pr-12 py-3 rounded-full text-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-200"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {query && (
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-400">
              Search results will appear below as you type
            </p>
          </div>
        )}
      </div>

      {/* Search Results */}
      <EnhancedSearchResults 
        query={query} 
        isSearching={false}
      />
    </div>
  );
}