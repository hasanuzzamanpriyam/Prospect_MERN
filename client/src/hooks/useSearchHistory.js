import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'prospct_search_history';
const MAX_HISTORY = 20;

/**
 * Hook for managing search history in localStorage
 * Stores filter combinations for quick reuse
 */
export function useSearchHistory() {
  const [history, setHistory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate structure
        if (Array.isArray(parsed)) {
          setHistory(parsed.filter(item => item && item.filters && item.timestamp));
        }
      }
    } catch (error) {
      console.warn('Failed to load search history:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  const saveHistory = useCallback((newHistory) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }, []);

  // Add a new search to history
  const addSearch = useCallback((filters, metadata = {}) => {
    if (!filters || Object.keys(filters).length === 0) return;

    // Create a normalized key for deduplication
    const filterKey = JSON.stringify(filters, Object.keys(filters).sort());
    
    setHistory(prev => {
      // Remove duplicates
      const withoutDuplicates = prev.filter(item => 
        JSON.stringify(item.filters, Object.keys(item.filters).sort()) !== filterKey
      );

      const newEntry = {
        id: Date.now().toString(),
        filters,
        timestamp: Date.now(),
        label: metadata.label || generateLabel(filters),
        resultCount: metadata.resultCount || 0,
        ...metadata,
      };

      const updated = [newEntry, ...withoutDuplicates].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  // Remove a specific search from history
  const removeSearch = useCallback((id) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  // Clear all history
  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  // Get search by ID
  const getSearch = useCallback((id) => {
    return history.find(item => item.id === id);
  }, [history]);

  // Update metadata (e.g., result count after search completes)
  const updateSearch = useCallback((id, updates) => {
    setHistory(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  return {
    history,
    isLoaded,
    addSearch,
    removeSearch,
    clearHistory,
    getSearch,
    updateSearch,
  };
}

/**
 * Generate a human-readable label from filters
 */
function generateLabel(filters) {
  const parts = [];
  
  if (filters.personTitle?.length) {
    parts.push(`${filters.personTitle.length} title${filters.personTitle.length > 1 ? 's' : ''}`);
  }
  if (filters.companyName?.length) {
    parts.push(`${filters.companyName.length} compan${filters.companyName.length > 1 ? 'ies' : 'y'}`);
  }
  if (filters.country?.length) {
    parts.push(`${filters.country.length} countr${filters.country.length > 1 ? 'ies' : 'y'}`);
  }
  if (filters.industry?.length) {
    parts.push(`${filters.industry.length} industr${filters.industry.length > 1 ? 'ies' : 'y'}`);
  }
  if (filters.seniority?.length) {
    parts.push(`${filters.seniority.length} seniority`);
  }
  if (filters.employeeRange?.length) {
    parts.push('employee range');
  }
  if (filters.emailStatus?.length) {
    parts.push('email status');
  }

  if (parts.length === 0) {
    return 'Custom search';
  }

  return parts.slice(0, 3).join(', ') + (parts.length > 3 ? ` +${parts.length - 3} more` : '');
}

/**
 * Hook for the search history dropdown UI
 */
export function useSearchHistoryDropdown() {
  const { history, removeSearch, clearHistory, addSearch } = useSearchHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setIsOpen(false);
  }, []);

  const handleRemove = useCallback((id, e) => {
    e.stopPropagation();
    removeSearch(id);
    if (selectedId === id) setSelectedId(null);
  }, [removeSearch, selectedId]);

  // Format timestamp for display
  const formatTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  }, []);

  // Get filter summary for display
  const getFilterSummary = useCallback((filters) => {
    const activeFilters = Object.entries(filters)
      .filter(([_, v]) => Array.isArray(v) ? v.length > 0 : v)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
      .slice(0, 3);
    
    const totalFilters = Object.entries(filters)
      .filter(([_, v]) => Array.isArray(v) ? v.length > 0 : v).length;

    return {
      summary: activeFilters.join(' • '),
      moreCount: totalFilters > 3 ? totalFilters - 3 : 0,
    };
  }, []);

  return {
    history,
    isOpen,
    selectedId,
    isEmpty: history.length === 0,
    toggle,
    open,
    close,
    handleSelect,
    handleRemove,
    clearHistory,
    formatTime,
    getFilterSummary,
    addSearch,
  };
}