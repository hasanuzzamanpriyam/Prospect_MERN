import React, { useEffect, useRef } from 'react';
import { X, Search, Clock, Trash2, RotateCcw, Filter } from 'lucide-react';
import { useSearchHistoryDropdown } from '../../hooks/useSearchHistory';

/**
 * Search History Dropdown Component
 * Shows recent searches for quick reuse
 */
export function SearchHistoryDropdown({ 
  triggerRef, 
  onSelectSearch,
  position = 'bottom-left',
  className = '' 
}) {
  const {
    history,
    isOpen,
    isEmpty,
    selectedId,
    close,
    handleSelect,
    handleRemove,
    clearHistory,
    formatTime,
    getFilterSummary,
  } = useSearchHistoryDropdown();

  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (triggerRef?.current && !triggerRef.current.contains(e.target)) {
          close();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close, triggerRef]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateHistory(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateHistory(-1);
      } else if (e.key === 'Enter') {
        if (selectedId) {
          const item = history.find(h => h.id === selectedId);
          if (item && onSelectSearch) {
            onSelectSearch(item.filters);
            close();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, history, selectedId, close, onSelectSearch]);

  const navigateHistory = (direction) => {
    const visibleItems = history.filter(h => !h.hidden);
    if (visibleItems.length === 0) return;
    
    const currentIndex = selectedId 
      ? visibleItems.findIndex(h => h.id === selectedId)
      : -1;
    
    let newIndex = currentIndex + direction;
    if (newIndex >= visibleItems.length) newIndex = 0;
    if (newIndex < 0) newIndex = visibleItems.length - 1;
    
    // We can't easily set selectedId from here without the hook
    // This would need the hook to expose navigation
  };

  if (!isOpen) return null;

  const positionClasses = {
    'bottom-left': 'origin-top-left left-0 top-full',
    'bottom-right': 'origin-top-right right-0 top-full',
    'top-left': 'origin-bottom-left left-0 bottom-full',
    'top-right': 'origin-bottom-right right-0 bottom-full',
  }[position] || 'origin-top-left left-0 top-full';

  return (
    <div 
      ref={dropdownRef}
      className={`fixed z-50 mt-2 w-96 max-h-96 ${positionClasses} ${className} animate-fade-in`}
      role="menu"
    >
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">Search History</span>
            <span className="px-2 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
              {history.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={close}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close history"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[500px] overflow-y-auto">
          {isEmpty ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No search history yet</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                Your recent searches will appear here
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800" role="listbox">
              {history.map((item) => {
                const { summary, moreCount } = getFilterSummary(item.filters);
                const isSelected = item.id === selectedId;

                return (
                  <li 
                    key={item.id}
                    role="option"
                    aria-selected={isSelected}
                    className={`px-4 py-3 transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-primary-50 dark:bg-primary-900/20' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => handleSelect(item.id)}
                    onMouseEnter={() => handleSelect(item.id)} // For keyboard nav
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-slate-900 dark:text-slate-100'}`}>
                          {item.label}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
                          {summary}
                          {moreCount > 0 && <span className="ml-1 text-primary-500">+{moreCount} more</span>}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 dark:text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(item.timestamp)}
                          </span>
                          {item.resultCount > 0 && (
                            <span className="flex items-center gap-1 text-green-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              {item.resultCount.toLocaleString()} results
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.id, e);
                        }}
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Remove from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Load more / clear at bottom */}
          {history.length >= 10 && (
            <div className="p-3 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={clearHistory}
                className="w-full text-sm text-red-500 hover:text-red-600 font-medium py-2"
              >
                Clear all history
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Search History Trigger Button
 * Wraps a button that opens the dropdown
 */
export function SearchHistoryTrigger({ 
  children, 
  className = '',
  onSelectSearch,
  position = 'bottom-left'
}) {
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        ref={triggerRef}
        className={`flex items-center gap-2 ${className}`}
        onClick={() => {}}
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        {children}
      </button>
      <SearchHistoryDropdown
        triggerRef={triggerRef}
        onSelectSearch={onSelectSearch}
        position={position}
      />
    </div>
  );
}

import { useRef } from 'react';