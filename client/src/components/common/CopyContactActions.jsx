import { useState, useCallback } from 'react';
import { Copy, Check, ExternalLink, Linkedin } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Copy to clipboard with toast feedback
 */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(null);

  const copy = useCallback(async (text, label = 'Copied') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast.success(`${label} copied to clipboard!`, { 
        duration: 2000,
        icon: '✅',
      });
      setTimeout(() => setCopied(null), 2000);
      return true;
    } catch (error) {
      toast.error('Failed to copy', { duration: 3000 });
      return false;
    }
  }, []);

  return { copy, copied };
}

/**
 * Copy LinkedIn URL button for contact cards
 */
export function CopyLinkedInButton({ 
  linkedinUrl, 
  contactName, 
  variant = 'icon',
  className = '' 
}) {
  const { copy, copied } = useCopyToClipboard();
  const isCopied = copied === 'LinkedIn URL';

  if (!linkedinUrl) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    copy(linkedinUrl, 'LinkedIn URL');
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
        aria-label="Copy LinkedIn URL"
        disabled={isCopied}
      >
        {isCopied ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <Linkedin className="w-5 h-5" />
        )}
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${className} ${
          isCopied 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
        }`}
        disabled={isCopied}
      >
        {isCopied ? (
          <>
            <Check className="w-4 h-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Linkedin className="w-4 h-4" />
            <span>Copy LinkedIn</span>
          </>
        )}
      </button>
    );
  }

  return null;
}

/**
 * Copy contact email button
 */
export function CopyEmailButton({ email, variant = 'icon' }) {
  const { copy, copied } = useCopyToClipboard();
  const isCopied = copied === 'Email';

  if (!email) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    copy(email, 'Email');
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
      aria-label="Copy email"
      disabled={isCopied}
    >
      {isCopied ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )}
    </button>
  );
}

/**
 * Copy phone button
 */
export function CopyPhoneButton({ phone, variant = 'icon' }) {
  const { copy, copied } = useCopyToClipboard();
  const isCopied = copied === 'Phone';

  if (!phone) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    copy(phone, 'Phone');
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
      aria-label="Copy phone"
      disabled={isCopied}
    >
      {isCopied ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )}
    </button>
  );
}

/**
 * Open LinkedIn profile in new tab
 */
export function OpenLinkedInButton({ linkedinUrl, variant = 'icon' }) {
  if (!linkedinUrl) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className="p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Open LinkedIn profile"
      >
        <ExternalLink className="w-5 h-5" />
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <Linkedin className="w-4 h-4" />
        <span>Open LinkedIn</span>
        <ExternalLink className="w-4 h-4" />
      </button>
    );
  }

  return null;
}

/**
 * Contact action buttons group - combines all contact actions
 */
export function ContactActionButtons({ contact }) {
  return (
    <div className="flex items-center gap-1">
      <CopyLinkedInButton linkedinUrl={contact.person_linkedin_url || contact._source?.person_linkedin_url} contactName={contact.person_first_name} />
      <OpenLinkedInButton linkedinUrl={contact.person_linkedin_url || contact._source?.person_linkedin_url} />
      <CopyEmailButton email={contact.person_email || contact._source?.person_email} />
      <CopyPhoneButton phone={contact.person_phone || contact._source?.person_phone} />
    </div>
  );
}