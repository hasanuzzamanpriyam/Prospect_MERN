import { useEffect, useCallback, useRef, useState } from 'react';
import hotkeys from 'hotkeys-js';

/**
 * Custom hook for global keyboard shortcuts
 * Provides consistent keyboard navigation across the app
 */
export function useKeyboardShortcuts(shortcuts, dependencies = []) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    // Configure hotkeys-js
    hotkeys.filter = (event) => {
      // Allow shortcuts in input/textarea/select only for specific keys
      const target = event.target;
      const isInput = target.isContentEditable || 
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      
      // Always allow Escape, / (search focus), and global navigation
      const alwaysAllow = ['escape', '/', '?', 'g', 'h', 'j', 'k', 'l'];
      if (alwaysAllow.includes(event.key.toLowerCase())) return true;
      
      // Block other shortcuts when typing in inputs
      return !isInput;
    };

    // Register shortcuts
    const handler = (event, handlerData) => {
      const { key, action, description, preventDefault = true, stopPropagation = true } = handlerData;
      const matchingShortcut = shortcutsRef.current.find(s => s.key === key);
      
      if (matchingShortcut) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        matchingShortcut.handler(event, handlerData);
      }
    };

    // Bind all shortcuts
    shortcuts.forEach(({ key, action, description }) => {
      if (key) {
        hotkeys(key, { description }, handler);
      }
    });

    // Cleanup
    return () => {
      shortcuts.forEach(({ key }) => {
        if (key) hotkeys.unbind(key);
      });
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Predefined shortcut sets for common use cases
 */
export const SHORTCUT_SETS = {
  // Search page shortcuts
  search: (actions) => [
    { key: '/', action: 'focusSearch', description: 'Focus search input', handler: actions.onFocusSearch },
    { key: 'escape', action: 'closeModals', description: 'Close modals/dropdowns', handler: actions.onEscape },
    { key: 'j', action: 'nextResult', description: 'Next result', handler: actions.onNext },
    { key: 'k', action: 'prevResult', description: 'Previous result', handler: actions.onPrev },
    { key: 'enter', action: 'openResult', description: 'Open selected result', handler: actions.onSelect },
    { key: 'g h', action: 'goHome', description: 'Go to dashboard', handler: actions.onGoHome },
    { key: 'g s', action: 'goSearch', description: 'Go to search', handler: actions.onGoSearch },
    { key: 'g c', action: 'goContacts', description: 'Go to contacts', handler: actions.onGoContacts },
    { key: 'g l', action: 'goLists', description: 'Go to lists', handler: actions.onGoLists },
    { key: 'g p', action: 'goCompanies', description: 'Go to companies', handler: actions.onGoCompanies },
    { key: '?', action: 'showHelp', description: 'Show keyboard shortcuts', handler: actions.onShowHelp },
  ],

  // Contact/Lead profile shortcuts
  profile: (actions) => [
    { key: 'e', action: 'editContact', description: 'Edit contact', handler: actions.onEdit },
    { key: 'c', action: 'copyLinkedIn', description: 'Copy LinkedIn URL', handler: actions.onCopyLinkedIn },
    { key: 'v', action: 'verifyEmail', description: 'Verify email', handler: actions.onVerifyEmail },
    { key: 'p', action: 'verifyPhone', description: 'Verify phone', handler: actions.onVerifyPhone },
    { key: 's', action: 'saveContact', description: 'Save/unsave contact', handler: actions.onSave },
    { key: 'x', action: 'exportContact', description: 'Export contact', handler: actions.onExport },
    { key: 'escape', action: 'closeProfile', description: 'Close profile', handler: actions.onClose },
  ],

  // List management shortcuts
  lists: (actions) => [
    { key: 'n', action: 'newList', description: 'Create new list', handler: actions.onNewList },
    { key: 'f', action: 'newFolder', description: 'Create new folder', handler: actions.onNewFolder },
    { key: 'a', action: 'selectAll', description: 'Select all visible', handler: actions.onSelectAll },
    { key: 'shift+a', action: 'deselectAll', description: 'Deselect all', handler: actions.onDeselectAll },
    { key: 'delete', action: 'deleteSelected', description: 'Delete selected', handler: actions.onDelete },
    { key: 'escape', action: 'clearSelection', description: 'Clear selection', handler: actions.onClearSelection },
  ],

  // Global app shortcuts
  global: (actions) => [
    { key: 'ctrl+k', action: 'commandPalette', description: 'Open command palette', handler: actions.onCommandPalette },
    { key: 'ctrl+/', action: 'focusSearch', description: 'Focus global search', handler: actions.onFocusSearch },
    { key: 'ctrl+shift+h', action: 'goHome', description: 'Go to dashboard', handler: actions.onGoHome },
    { key: 'ctrl+shift+s', action: 'goSearch', description: 'Go to search', handler: actions.onGoSearch },
    { key: 'ctrl+shift+c', action: 'goContacts', description: 'Go to contacts', handler: actions.onGoContacts },
    { key: 'ctrl+shift+l', action: 'goLists', description: 'Go to lists', handler: actions.onGoLists },
    { key: 'ctrl+shift+p', action: 'goCompanies', description: 'Go to companies', handler: actions.onGoCompanies },
    { key: 'ctrl+shift+b', action: 'goBilling', description: 'Go to billing', handler: actions.onGoBilling },
    { key: 'ctrl+shift+a', action: 'goAdmin', description: 'Go to admin (if admin)', handler: actions.onGoAdmin },
    { key: '?', action: 'showHelp', description: 'Show keyboard shortcuts help', handler: actions.onShowHelp },
  ],
};

/**
 * Hook for showing keyboard shortcuts help modal
 */
export function useShortcutsHelp(shortcuts) {
  const [showHelp, setShowHelp] = useState(false);

  const toggleHelp = useCallback(() => setShowHelp(prev => !prev), []);
  const closeHelp = useCallback(() => setShowHelp(false), []);

  // Register ? key globally
  useEffect(() => {
    const handler = () => toggleHelp();
    hotkeys('?', handler);
    return () => hotkeys.unbind('?', handler);
  }, [toggleHelp]);

  return { showHelp, toggleHelp, closeHelp };
}