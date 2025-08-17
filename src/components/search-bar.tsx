'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  X, 
  Filter, 
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { products } from '@/lib/products';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: number;
  name: string;
  category: string;
  categoryDisplayName: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
}

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  showFilters?: boolean;
}

export default function SearchBar({ 
  className, 
  placeholder = "Search for royal artifacts...",
  showFilters = true 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    'sword', 'turban', 'painting', 'book', 'necklace', 'shield'
  ]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = searchQuery.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.categoryDisplayName.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.material.toLowerCase().includes(searchTerm)
    );

    setResults(filtered.slice(0, 8)); // Limit to 8 results
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      performSearch(value);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      } else if (query.trim()) {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    addToRecentSearches(result.name);
    router.push(`/products/${result.category}/${result.id}`);
    setShowResults(false);
    setQuery('');
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      addToRecentSearches(searchTerm);
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowResults(false);
      setQuery('');
    }
  };

  const addToRecentSearches = (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-2xl", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
                  Search Results
                </div>
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                      selectedIndex === index && "bg-muted"
                    )}
                    onClick={() => handleResultClick(result)}
                  >
                    <img
                      src={result.image}
                      alt={result.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{result.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {result.categoryDisplayName}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{result.rating}</span>
                          <span>({result.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {formatPrice(result.price)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && (
              <div className="p-2 border-t">
                <div className="flex items-center justify-between mb-2 px-2">
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Recent Searches
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={clearRecentSearches}
                  >
                    Clear
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recentSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {!query && (
              <div className="p-2 border-t">
                <div className="text-sm font-medium text-muted-foreground mb-2 px-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </div>
                <div className="flex flex-wrap gap-1">
                  {trendingSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {query && results.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">Try searching with different keywords</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 