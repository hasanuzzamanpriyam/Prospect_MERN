import React, { useState, useMemo, useCallback } from 'react';
import { Check, ChevronDown, ChevronUp, Search, Download, X, Columns } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Column definition for export
 */
export const EXPORT_COLUMNS = {
  contact: [
    { key: 'person_first_name', label: 'First Name', default: true, category: 'Personal' },
    { key: 'person_last_name', label: 'Last Name', default: true, category: 'Personal' },
    { key: 'person_email', label: 'Email', default: true, category: 'Contact' },
    { key: 'person_email_status_cd', label: 'Email Status', default: true, category: 'Contact' },
    { key: 'person_phone', label: 'Phone', default: true, category: 'Contact' },
    { key: 'person_title', label: 'Job Title', default: true, category: 'Professional' },
    { key: 'person_seniority', label: 'Seniority', default: true, category: 'Professional' },
    { key: 'person_location_city', label: 'City', default: true, category: 'Location' },
    { key: 'person_location_state', label: 'State', default: true, category: 'Location' },
    { key: 'person_location_country', label: 'Country', default: true, category: 'Location' },
    { key: 'person_linkedin_url', label: 'LinkedIn', default: true, category: 'Social' },
    { key: 'organization_name', label: 'Company', default: true, category: 'Company' },
    { key: 'organization_domain', label: 'Domain', default: false, category: 'Company' },
    { key: 'organization_industries', label: 'Industries', default: true, category: 'Company' },
    { key: 'organization_num_current_employees', label: 'Employees', default: true, category: 'Company' },
    { key: 'organization_revenue_in_thousands_int', label: 'Revenue (K)', default: false, category: 'Company' },
    { key: 'organization_website_url', label: 'Website', default: false, category: 'Company' },
    { key: 'organization_keywords', label: 'Keywords', default: false, category: 'Company' },
    { key: 'organization_current_technologies', label: 'Technologies', default: false, category: 'Company' },
    { key: 'is_saved', label: 'Saved', default: false, category: 'Meta' },
  ],
  company: [
    { key: 'organization_name', label: 'Company Name', default: true, category: 'Basic' },
    { key: 'organization_domain', label: 'Domain', default: true, category: 'Basic' },
    { key: 'organization_website_url', label: 'Website', default: true, category: 'Basic' },
    { key: 'organization_industries', label: 'Industries', default: true, category: 'Basic' },
    { key: 'organization_num_current_employees', label: 'Employees', default: true, category: 'Basic' },
    { key: 'organization_revenue_in_thousands_int', label: 'Revenue (K)', default: true, category: 'Basic' },
    { key: 'organization_founded_year', label: 'Founded', default: false, category: 'Basic' },
    { key: 'organization_keywords', label: 'Keywords', default: false, category: 'Details' },
    { key: 'organization_current_technologies', label: 'Technologies', default: false, category: 'Details' },
    { key: 'organization_location_city', label: 'City', default: true, category: 'Location' },
    { key: 'organization_location_state', label: 'State', default: true, category: 'Location' },
    { key: 'organization_location_country', label: 'Country', default: true, category: 'Location' },
    { key: 'organization_hq_location_postal_code', label: 'Postal Code', default: false, category: 'Location' },
    { key: 'organization_linkedin_url', label: 'LinkedIn', default: false, category: 'Social' },
    { key: 'doc_count', label: 'Contact Count', default: true, category: 'Meta' },
    { key: 'is_saved', label: 'Saved', default: false, category: 'Meta' },
  ],
};

/**
 * Export Column Picker Modal
 */
export function ExportColumnPicker({ 
  isOpen, 
  onClose, 
  onExport,
  type = 'contact',
  selectedData,
  defaultColumns = [],
}) {
  const columns = EXPORT_COLUMNS[type] || EXPORT_COLUMNS.contact;
  const [selectedKeys, setSelectedKeys] = useState(
    defaultColumns.length > 0 
      ? defaultColumns 
      : columns.filter(c => c.default).map(c => c.key)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Get columns grouped by category
  const groupedColumns = useMemo(() => {
    const filtered = columns.filter(col => 
      col.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.key.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered.reduce((acc, col) => {
      if (!acc[col.category]) acc[col.category] = [];
      acc[col.category].push(col);
      return acc;
    }, {});
  }, [columns, searchTerm]);

  const categories = Object.keys(groupedColumns).sort();

  const toggleCategory = useCallback((category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  const isCategoryExpanded = useCallback((category) => {
    return expandedCategories[category] !== false;
  }, [expandedCategories]);

  const toggleColumn = useCallback((key) => {
    setSelectedKeys(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedKeys(columns.map(c => c.key));
  }, [columns]);

  const deselectAll = useCallback(() => {
    setSelectedKeys([]);
  }, []);

  const selectDefaults = useCallback(() => {
    setSelectedKeys(columns.filter(c => c.default).map(c => c.key));
  }, [columns]);

  const handleExport = () => {
    if (selectedKeys.length === 0) {
      toast.error('Please select at least one column');
      return;
    }
    onExport(selectedKeys);
    onClose();
  };

  const selectedCount = selectedKeys.length;
  const totalCount = columns.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Columns className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Select Export Columns</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose which columns to include in your CSV export
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close column picker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[65vh]">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search columns..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <button onClick={selectAll} className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Select All
            </button>
            <button onClick={deselectAll} className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Deselect All
            </button>
            <button onClick={selectDefaults} className="px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
              Defaults
            </button>
            <div className="flex-1" />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {selectedCount} of {totalCount} selected
            </span>
          </div>

          {/* Column list */}
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No columns match your search
              </div>
            ) : (
              categories.map(category => {
                const cols = groupedColumns[category];
                const isExpanded = isCategoryExpanded(category);
                const selectedInCategory = cols.filter(c => selectedKeys.includes(c.key)).length;
                const totalInCategory = cols.length;

                return (
                  <div key={category} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${isExpanded ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                          {category}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                          {selectedInCategory}/{totalInCategory}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="p-4 space-y-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        {cols.map(col => (
                          <label key={col.key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedKeys.includes(col.key)}
                              onChange={() => toggleColumn(col.key)}
                              className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-2 focus:ring-primary-500"
                            />
                            <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{col.label}</span>
                            <span className="text-xs text-slate-400 font-mono">{col.key}</span>
                            {col.default && (
                              <span className="px-1.5 py-0.5 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                                Default
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            )}
          )}

          {/* Export button */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleExport}
              disabled={selectedKeys.length === 0}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export {selectedCount} Columns as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo, useCallback } from 'react';
import { Check, ChevronDown, ChevronUp, Search, Download, X, Columns } from 'lucide-react';
import toast from 'react-hot-toast';