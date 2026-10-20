import { useEffect, useCallback, useMemo } from 'react';
import useStore from '../store/store';
import toast from 'react-hot-toast';

/**
 * Credit thresholds for warnings
 */
export const CREDIT_THRESHOLDS = {
  warning: 0.20,    // 20% - yellow toast
  critical: 0.10,   // 10% - orange toast + banner
  danger: 0.05,     // 5% - red toast + persistent banner
  empty: 0,         // 0% - block actions
};

/**
 * Hook for monitoring credit levels and showing warnings
 * Works with team/shared workspace model
 */
export function useCreditWarnings() {
  const { 
    user, 
    teamRole, 
    workspaceOwner,
    isAdminLoggedIn 
  } = useStore();

  // Get credits from user object
  const credits = user?.credits;
  
  const [warningsShown, setWarningsShown] = useMemo(() => ({
    warning: false,
    critical: false,
    danger: false,
  }), []);

  // Get effective credits (owner's credits for team members)
  const effectiveCredits = useMemo(() => {
    if (teamRole === 'member' && workspaceOwner) {
      // In shared workspace, member uses owner's credits
      // This would need to be fetched from owner's data
      // For now, use user's credits as fallback
      return credits;
    }
    return credits;
  }, [credits, teamRole, workspaceOwner]);

  // Check credit levels and show warnings
  const checkCreditLevels = useCallback(() => {
    if (!effectiveCredits) return;

    const creditTypes = ['email', 'phone', 'verification', 'export'];
    
    creditTypes.forEach(type => {
      // Handle different credit structures
      const creditData = effectiveCredits[type];
      if (!creditData) return;
      
      const current = creditData.current ?? creditData.currentCredits ?? 0;
      const max = creditData.max ?? creditData.maxCredits ?? 0;
      
      if (max === 0) return; // Unlimited or not configured
      
      const ratio = current / max;
      const percentage = Math.round(ratio * 100);

      // Warning at 20%
      if (ratio <= CREDIT_THRESHOLDS.warning && ratio > CREDIT_THRESHOLDS.critical && !warningsShown.warning) {
        toast(`⚠️ ${type.charAt(0).toUpperCase() + type.slice(1)} credits at ${percentage}% (${current}/${max})`, {
          icon: '⚠️',
          duration: 8000,
          style: { background: '#fef3c7', color: '#92400e' },
        });
        setWarningsShown(prev => ({ ...prev, warning: true }));
      }
      
      // Critical at 10%
      if (ratio <= CREDIT_THRESHOLDS.critical && ratio > CREDIT_THRESHOLDS.danger && !warningsShown.critical) {
        toast(`🔶 ${type.charAt(0).toUpperCase() + type.slice(1)} credits critically low: ${percentage}% (${current}/${max})`, {
          icon: '🔶',
          duration: 12000,
          style: { background: '#ffedd5', color: '#c2410c' },
        });
        setWarningsShown(prev => ({ ...prev, critical: true }));
      }
      
      // Danger at 5%
      if (ratio <= CREDIT_THRESHOLDS.danger && ratio > CREDIT_THRESHOLDS.empty && !warningsShown.danger) {
        toast(`🔴 ${type.charAt(0).toUpperCase() + type.slice(1)} credits almost depleted: ${percentage}% (${current}/${max})`, {
          icon: '🔴',
          duration: 15000,
          style: { background: '#fef2f2', color: '#991b1b' },
        });
        setWarningsShown(prev => ({ ...prev, danger: true }));
      }
      
      // Empty - block actions (handled in components)
      if (ratio <= CREDIT_THRESHOLDS.empty) {
        // Components should check canDeduct before allowing actions
      }
    });

    // Reset warnings when credits are replenished
    creditTypes.forEach(type => {
      const creditData = effectiveCredits[type];
      if (!creditData) return;
      
      const current = creditData.current ?? creditData.currentCredits ?? 0;
      const max = creditData.max ?? creditData.maxCredits ?? 0;
      if (max > 0) {
        const ratio = current / max;
        if (ratio > CREDIT_THRESHOLDS.warning) {
          setWarningsShown(prev => ({ 
            ...prev, 
            warning: false, 
            critical: false, 
            danger: false 
          }));
        }
      }
    });
  }, [effectiveCredits, warningsShown]);

  // Run check on credit changes
  useEffect(() => {
    checkCreditLevels();
  }, [effectiveCredits, checkCreditLevels]);

  // Helper to check if action can proceed
  const canDeduct = useCallback((type, amount = 1) => {
    if (!effectiveCredits) return { allowed: false, reason: 'No credits data' };
    
    const creditData = effectiveCredits[type];
    if (!creditData) return { allowed: false, reason: `No ${type} credits data` };
    
    const current = creditData.current ?? creditData.currentCredits ?? 0;
    const max = creditData.max ?? creditData.maxCredits ?? 0;
    
    if (max === 0) return { allowed: true, reason: 'Unlimited' };
    if (current < amount) return { allowed: false, reason: `Insufficient ${type} credits (${current}/${max})` };
    
    const afterDeduct = current - amount;
    const ratio = afterDeduct / max;
    
    let warning = null;
    if (ratio <= CREDIT_THRESHOLDS.danger) warning = 'danger';
    else if (ratio <= CREDIT_THRESHOLDS.critical) warning = 'critical';
    else if (ratio <= CREDIT_THRESHOLDS.warning) warning = 'warning';
    
    return { allowed: true, warning, remaining: afterDeduct, max };
  }, [effectiveCredits]);

  // Get credit status for UI
  const getCreditStatus = useCallback((type) => {
    if (!effectiveCredits) return { level: 'unknown', percentage: 0, current: 0, max: 0 };
    
    const creditData = effectiveCredits[type];
    if (!creditData) return { level: 'unknown', percentage: 0, current: 0, max: 0 };
    
    const current = creditData.current ?? creditData.currentCredits ?? 0;
    const max = creditData.max ?? creditData.maxCredits ?? 0;
    
    if (max === 0) return { level: 'unlimited', percentage: 100, current, max };
    
    const ratio = current / max;
    const percentage = Math.round(ratio * 100);
    
    let level = 'healthy';
    if (ratio <= CREDIT_THRESHOLDS.empty) level = 'empty';
    else if (ratio <= CREDIT_THRESHOLDS.danger) level = 'danger';
    else if (ratio <= CREDIT_THRESHOLDS.critical) level = 'critical';
    else if (ratio <= CREDIT_THRESHOLDS.warning) level = 'warning';
    
    return { level, percentage, current, max };
  }, [effectiveCredits]);

  return {
    checkCreditLevels,
    canDeduct,
    getCreditStatus,
    effectiveCredits,
    thresholds: CREDIT_THRESHOLDS,
  };
}

/**
 * Hook for credit deduction with automatic warning
 * Use in components that deduct credits
 */
export function useCreditDeduction() {
  const { deductCredits, refreshCredits } = useStore();
  const { canDeduct, getCreditStatus } = useCreditWarnings();

  const deductWithWarning = useCallback(async (type, amount = 1, actionDescription = '') => {
    const check = canDeduct(type, amount);
    
    if (!check.allowed) {
      toast.error(check.reason, { duration: 5000 });
      return { success: false, reason: check.reason };
    }

    // Show pre-deduction warning if entering warning zone
    if (check.warning) {
      const status = getCreditStatus(type);
      const msg = `${type.charAt(0).toUpperCase() + type.slice(1)} credits will be at ${status.percentage}% after this ${actionDescription || 'action'}`;
      
      if (check.warning === 'danger') {
        toast.error(`🔴 ${msg}`, { duration: 8000 });
      } else if (check.warning === 'critical') {
        toast(`🔶 ${msg}`, { duration: 6000 });
      } else if (check.warning === 'warning') {
        toast(`⚠️ ${msg}`, { duration: 4000 });
      }
    }

    try {
      const result = await deductCredits(type, amount);
      if (result.success) {
        await refreshCredits();
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} credits deducted: ${amount}`, { duration: 3000 });
      }
      return result;
    } catch (error) {
      toast.error(`Failed to deduct credits: ${error.message}`, { duration: 5000 });
      return { success: false, reason: error.message };
    }
  }, [deductCredits, refreshCredits, canDeduct, getCreditStatus]);

  return { deductWithWarning, canDeduct, getCreditStatus };
}