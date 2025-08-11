"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, X, Calendar, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFilters {
  type?: 'studio' | 'coworking' | 'all';
  date?: Date;
  timeSlot?: string;
  capacity?: number;
  priceRange?: [number, number];
  amenities?: string[];
  availability?: 'available' | 'booked' | 'all';
}

interface SearchResult {
  id: string;
  title: string;
  type: 'studio' | 'coworking';
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  availability: 'available' | 'booked';
  image?: string;
  rating?: number;
}

interface SmartSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onResultSelect: (result: SearchResult) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

export function SmartSearch({
  onSearch,
  onResultSelect,
  placeholder,
  showFilters = true,
  className
}: SmartSearchProps) {
  const t = useTranslations('common');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounced search
  const debouncedSearch = useCallback(
    useDebounce((searchQuery: string, searchFilters: SearchFilters) => {
      if (searchQuery.length >= 2 || Object.keys(searchFilters).length > 0) {
        performSearch(searchQuery, searchFilters);
      } else {
        setResults([]);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query, filters);
  }, [query, filters, debouncedSearch]);

  const performSearch = async (searchQuery: string, searchFilters: SearchFilters) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, filters: searchFilters })
      });
      
      const data = await response.json();
      setResults(data.results || []);
      setSuggestions(data.suggestions || []);
      setShowResults(true);
      onSearch(searchQuery, searchFilters);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          onResultSelect(results[selectedIndex]);
          setShowResults(false);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const removeFilter = (key: keyof SearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).length;
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className={cn('relative w-full max-w-2xl', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('search')}
          className="pl-10 pr-12 h-12 text-base"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.type && (
            <Badge variant="secondary" className="gap-1">
              {filters.type}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeFilter('type')}
              />
            </Badge>
          )}
          {filters.date && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="w-3 h-3" />
              {filters.date.toLocaleDateString()}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeFilter('date')}
              />
            </Badge>
          )}
          {filters.capacity && (
            <Badge variant="secondary" className="gap-1">
              <Users className="w-3 h-3" />
              {filters.capacity}+ people
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeFilter('capacity')}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex gap-2 mt-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                {t('filter')}
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                {/* Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select
                    value={filters.type || 'all'}
                    onValueChange={(value) => 
                      updateFilter('type', value === 'all' ? undefined : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="coworking">Coworking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <CalendarComponent
                    mode="single"
                    selected={filters.date}
                    onSelect={(date) => updateFilter('date', date)}
                    className="rounded-md border"
                  />
                </div>

                {/* Capacity Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Minimum Capacity</label>
                  <Select
                    value={filters.capacity?.toString() || ''}
                    onValueChange={(value) => 
                      updateFilter('capacity', value ? parseInt(value) : undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+ people</SelectItem>
                      <SelectItem value="5">5+ people</SelectItem>
                      <SelectItem value="10">10+ people</SelectItem>
                      <SelectItem value="20">20+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Search Results */}
      <AnimatePresence>
        {showResults && (results.length > 0 || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3 border-b">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                  Suggestions
                </p>
                <div className="flex flex-wrap gap-1">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-muted-foreground mb-2 px-2 uppercase tracking-wide">
                  Results ({results.length})
                </p>
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors",
                      selectedIndex === index ? "bg-accent" : "hover:bg-accent/50"
                    )}
                    onClick={() => onResultSelect(result)}
                  >
                    <div className="flex items-start gap-3">
                      {result.image && (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {result.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                          {result.availability === 'available' && (
                            <Badge variant="default" className="text-xs bg-green-500">
                              Available
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {result.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            ${result.price}/hr
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {result.capacity}
                          </span>
                          {result.rating && (
                            <span>★ {result.rating}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Debounce hook
function useDebounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedCallback = useCallback(
    (...args: Args) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return debouncedCallback as (...args: Args) => void;
} 