import React, { useEffect, useMemo } from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import { SHORTCUT_SETS } from '../../hooks/useKeyboardShortcuts';

/**
 * Keyboard Shortcuts Help Modal
 * Displays all available keyboard shortcuts organized by category
 */
export function KeyboardShortcutsHelp({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcutCategories = useMemo(() => [
    {
      title: 'Global Navigation',
      icon: Command,
      shortcuts: SHORTCUT_SETS.global({
        onCommandPalette: () => {},
        onFocusSearch: () => {},
        onGoHome: () => {},
        onGoSearch: () => {},
        onGoContacts: () => {},
        onGoLists: () => {},
        onGoCompanies: () => {},
        onGoBilling: () => {},
        onGoAdmin: () => {},
        onShowHelp: () => {},
      }),
    },
    {
      title: 'Search & Results',
      icon: Keyboard,
      shortcuts: SHORTCUT_SETS.search({
        onFocusSearch: () => {},
        onEscape: () => {},
        onNext: () => {},
        onPrev: () => {},
        onSelect: () => {},
        onGoHome: () => {},
        onGoSearch: () => {},
        onGoContacts: () => {},
        onGoLists: () => {},
        onGoCompanies: () => {},
        onShowHelp: () => {},
      }),
    },
    {
      title: 'Contact Profile',
      icon: Keyboard,
      shortcuts: SHORTCUT_SETS.profile({
        onEdit: () => {},
        onCopyLinkedIn: () => {},
        onVerifyEmail: () => {},
        onVerifyPhone: () => {},
        onSave: () => {},
        onExport: () => {},
        onClose: () => {},
      }),
    },
    {
      title: 'List Management',
      icon: Keyboard,
      shortcuts: SHORTCUT_SETS.lists({
        onNewList: () => {},
        onNewFolder: () => {},
        onSelectAll: () => {},
        onDeselectAll: () => {},
        onDelete: () => {},
        onClearSelection: () => {},
      }),
    },
  ], []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Keyboard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close shortcuts help"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Press <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">?</kbd> anytime to open this help.
          </p>

          <div className="space-y-8">
            {shortcutCategories.map(({ title, icon: Icon, shortcuts }) => (
              <div key={title} className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <Icon className="w-4 h-4" />
                  {title}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shortcuts.map(({ key, description }) => (
                    <div key={key} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-1.5 shrink-0">
                        {key.split('+').map((k, i) => (
                          <React.Fragment key={i}>
                            <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                              {k.toUpperCase()}
                            </kbd>
                            {i < key.split('+').length - 1 && (
                              <span className="text-slate-400 text-xs">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Shortcuts work globally except when typing in input fields. 
            <span className="ml-2">Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-slate-200 dark:bg-slate-700 rounded">Esc</kbd> to close.</span>
          </p>
        </div>
      </div>
    </div>
  );
}