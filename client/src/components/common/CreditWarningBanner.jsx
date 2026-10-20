import { useMemo, useState } from 'react';
import { AlertTriangle, X, Zap, Battery } from 'lucide-react';
import { useCreditWarnings } from '../../hooks/useCreditWarnings';

/**
 * Persistent credit warning banner
 * Shows at top of page when credits are critically low
 */
export function CreditWarningBanner() {
  const { getCreditStatus, effectiveCredits } = useCreditWarnings();
  const [dismissedTypes, setDismissedTypes] = useState(new Set());

  if (!effectiveCredits) return null;

  const creditTypes = ['email', 'phone', 'verification', 'export'];
  const warnings = creditTypes
    .map(type => ({ type, ...getCreditStatus(type) }))
    .filter(({ level }) => ['warning', 'critical', 'danger', 'empty'].includes(level))
    .filter(({ type }) => !dismissedTypes.has(type));

  if (warnings.length === 0) return null;

  const mostSevere = warnings.reduce((prev, curr) => {
    const severity = { empty: 4, danger: 3, critical: 2, warning: 1 };
    return severity[curr.level] > severity[prev.level] ? curr : prev;
  });

  const getBannerConfig = (level) => {
    switch (level) {
      case 'empty':
        return { 
          bg: 'bg-red-50 dark:bg-red-900/20', 
          border: 'border-red-200 dark:border-red-800', 
          icon: Battery, 
          iconColor: 'text-red-500',
          textColor: 'text-red-700 dark:text-red-300',
          label: 'DEPLETED'
        };
      case 'danger':
        return { 
          bg: 'bg-red-50 dark:bg-red-900/20', 
          border: 'border-red-200 dark:border-red-800', 
          icon: AlertTriangle, 
          iconColor: 'text-red-500',
          textColor: 'text-red-700 dark:text-red-300',
          label: 'CRITICAL'
        };
      case 'critical':
        return { 
          bg: 'bg-orange-50 dark:bg-orange-900/20', 
          border: 'border-orange-200 dark:border-orange-800', 
          icon: AlertTriangle, 
          iconColor: 'text-orange-500',
          textColor: 'text-orange-700 dark:text-orange-300',
          label: 'LOW'
        };
      case 'warning':
        return { 
          bg: 'bg-yellow-50 dark:bg-yellow-900/20', 
          border: 'border-yellow-200 dark:border-yellow-800', 
          icon: Zap, 
          iconColor: 'text-yellow-500',
          textColor: 'text-yellow-700 dark:text-yellow-300',
          label: 'WARNING'
        };
      default:
        return { 
          bg: 'bg-blue-50 dark:bg-blue-900/20', 
          border: 'border-blue-200 dark:border-blue-800', 
          icon: AlertTriangle, 
          iconColor: 'text-blue-500',
          textColor: 'text-blue-700 dark:text-blue-300',
          label: 'NOTICE'
        };
    }
  };

  const config = getBannerConfig(mostSevere.level);
  const Icon = config.icon;

  const handleDismiss = (type) => {
    setDismissedTypes(prev => new Set([...prev, type]));
    // Auto-restore after 1 hour
    setTimeout(() => {
      setDismissedTypes(prev => {
        const next = new Set(prev);
        next.delete(type);
        return next;
      });
    }, 3600000);
  };

  return (
    <div className={`${config.bg} ${config.border} border-b sticky top-0 z-40 animate-slide-down`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${config.bg.replace('bg-', 'bg-').replace('50', '100').replace('900/20', '900/30')} flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className={`font-medium ${config.textColor} truncate`}>
                <span className={`px-2 py-0.5 text-xs font-mono rounded ${config.border.replace('border-', 'bg-').replace('200', '100').replace('800', '900/30')}`}>
                  {config.label}
                </span>
                {' '}
                Credit{config.label === 'DEPLETED' ? '' : 's'} {mostSevere.type.charAt(0).toUpperCase() + mostSevere.type.slice(1)}: 
                <span className="font-mono">{mostSevere.current}/{mostSevere.max} ({mostSevere.percentage}%)</span>
              </p>
              {warnings.length > 1 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  +{warnings.length - 1} more credit type{warnings.length > 2 ? 's' : ''} low: 
                  {warnings.slice(1).map(w => w.type).join(', ')}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {mostSevere.level === 'empty' && (
              <a 
                href="/plans-and-billings" 
                className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Upgrade Plan
              </a>
            )}
            {mostSevere.level !== 'empty' && (
              <a 
                href="/plans-and-billings" 
                className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                View Credits
              </a>
            )}
            <button
              onClick={() => handleDismiss(mostSevere.type)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Dismiss this warning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Additional warning details */}
        {warnings.length > 1 && (
          <details className="mt-3 group">
            <summary className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 cursor-pointer py-1">
              <span>Show all {warnings.length} credit warnings</span>
              <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
              {warnings.map(({ type, level, current, max, percentage }) => {
                const c = getBannerConfig(level);
                return (
                  <div key={type} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                    <c.icon className={`w-4 h-4 ${c.iconColor}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {current}/{max} ({percentage}%)
                      </p>
                    </div>
                    <span className={`px-1.5 py-0.5 text-xs font-mono rounded ${c.border.replace('border-', 'bg-').replace('200', '100').replace('800', '900/30')}`}>
                      {level.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

/**
 * Inline credit indicator for CreditBar component
 */
export function CreditLevelIndicator({ type }) {
  const { getCreditStatus } = useCreditWarnings();
  const { level, percentage, current, max } = getCreditStatus(type);

  if (max === 0) return null; // Unlimited

  const config = {
    healthy: { color: 'text-green-500', bg: 'bg-green-500/10', label: '' },
    warning: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: '⚠' },
    critical: { color: 'text-orange-500', bg: 'bg-orange-500/10', label: '🔶' },
    danger: { color: 'text-red-500', bg: 'bg-red-500/10', label: '🔴' },
    empty: { color: 'text-red-500', bg: 'bg-red-500/10', label: '⛔' },
    unlimited: { color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', label: '∞' },
  }[level];

  return (
    <div className="flex items-center gap-1.5" title={`${type}: ${current}/${max} (${percentage}%)`}>
      <span className="text-xs font-medium">{type.charAt(0).toUpperCase()}</span>
      <div className="relative w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${config.bg}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className={`text-xs font-mono ${config.color}`}>{percentage}%</span>
    </div>
  );
}