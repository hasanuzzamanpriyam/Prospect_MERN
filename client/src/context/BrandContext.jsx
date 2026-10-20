import { createContext, useContext, useEffect, useState } from 'react';
import { useBrandSettings as useBrandSettingsHook } from '../hooks/useBrandSettings';

const BrandContext = createContext(null);

/**
 * Provider component that fetches and provides brand settings to the entire app
 */
export function BrandProvider({ children }) {
  const { brandSettings, loading } = useBrandSettingsHook();
  
  return (
    <BrandContext.Provider value={{ brandSettings, loading }}>
      {children}
    </BrandContext.Provider>
  );
}

/**
 * Hook to access brand settings from any component
 */
export function useBrandSettings() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrandSettings must be used within a BrandProvider');
  }
  return context;
}

export default BrandProvider;