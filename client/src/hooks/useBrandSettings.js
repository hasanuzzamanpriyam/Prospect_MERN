import { useEffect, useState } from 'react';

/**
 * Hook to fetch and apply brand settings from the server
 * Applies brand settings to document (title, favicon, meta tags, etc.)
 */
export function useBrandSettings() {
  const [brandSettings, setBrandSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch brand settings from server
  useEffect(() => {
    const fetchBrandSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings/public', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBrandSettings(data);
        }
      } catch (err) {
        console.error('Failed to fetch brand settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandSettings();
  }, []);

  // Apply brand settings to document
  useEffect(() => {
    if (!brandSettings) return;

    const {
      brandName,
      brandTagline,
      brandLogoUrl,
      brandFaviconUrl,
      brandPrimaryColor,
      brandSecondaryColor,
      brandFontFamily,
      metaTitle,
      metaDescription,
      ogImageUrl,
      twitterHandle,
      copyrightText,
      supportEmail,
    } = brandSettings;

    // Update document title
    if (metaTitle) {
      document.title = metaTitle;
    } else if (brandName) {
      document.title = `${brandName} - ${brandTagline || 'B2B Prospect Intelligence Platform'}`;
    }

    // Update favicon
    if (brandFaviconUrl) {
      let faviconLink = document.querySelector('link[rel="icon"]');
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        document.head.appendChild(faviconLink);
      }
      faviconLink.href = brandFaviconUrl;
    }

    // Update meta tags
    const updateMetaTag = (name, content, property = false) => {
      if (!content) return;
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (property) meta.setAttribute('property', name);
        else meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Standard meta tags
    updateMetaTag('description', metaDescription);
    updateMetaTag('keywords', 'B2B, prospect, intelligence, sales, leads, contacts');

    // Open Graph tags
    updateMetaTag('og:title', metaTitle || brandName, true);
    updateMetaTag('og:description', metaDescription, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:image', ogImageUrl || '', true);
    updateMetaTag('og:site_name', brandName, true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:site', twitterHandle || '', true);
    updateMetaTag('twitter:title', metaTitle || brandName, true);
    updateMetaTag('twitter:description', metaDescription, true);
    updateMetaTag('twitter:image', ogImageUrl || '', true);

    // Favicon for different sizes
    if (brandFaviconUrl) {
      updateMetaTag('icon', brandFaviconUrl, false);
      updateMetaTag('shortcut icon', brandFaviconUrl, false);
    }

    // Apply theme colors
    if (brandPrimaryColor) {
      document.documentElement.style.setProperty('--color-primary', brandPrimaryColor);
    }
    if (brandSecondaryColor) {
      document.documentElement.style.setProperty('--color-secondary', brandSecondaryColor);
    }
    if (brandFontFamily) {
      document.documentElement.style.setProperty('--font-family', brandFontFamily);
    }
  }, [brandSettings]);

  return { brandSettings, loading };
}

export default useBrandSettings;