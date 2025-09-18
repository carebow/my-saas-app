import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { safeLocalStorage } from '../lib/safeStorage';

const FREE_CONSULTATION_LIMIT = 3;

export const useConsultationGate = () => {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const [consultationCount, setConsultationCount] = useState(0);

  // Get storage key based on user ID
  const getStorageKey = React.useCallback(() => {
    return user ? `consultation_count_${user.id}` : 'consultation_count_guest';
  }, [user]);

  // Load consultation count from localStorage
  useEffect(() => {
    if (user) {
      const storageKey = getStorageKey();
      const savedCount = safeLocalStorage.get(storageKey);
      setConsultationCount(savedCount ? parseInt(savedCount, 10) : 0);
    }
  }, [user, getStorageKey]);

  // Save consultation count to localStorage
  const saveConsultationCount = (count: number) => {
    if (user) {
      const storageKey = getStorageKey();
      safeLocalStorage.set(storageKey, count.toString());
    }
  };

  const incrementConsultationCount = () => {
    if (!isSubscribed) {
      const newCount = consultationCount + 1;
      setConsultationCount(newCount);
      saveConsultationCount(newCount);
    }
  };

  const canUseConsultation = () => {
    if (isSubscribed) return true;
    return consultationCount < FREE_CONSULTATION_LIMIT;
  };

  const getRemainingConsultations = () => {
    if (isSubscribed) return Infinity;
    return Math.max(0, FREE_CONSULTATION_LIMIT - consultationCount);
  };

  const handleConsultationStart = () => {
    if (!canUseConsultation()) {
      return false;
    }
    incrementConsultationCount();
    return true;
  };

  return {
    consultationCount,
    canUseConsultation,
    getRemainingConsultations,
    handleConsultationStart,
    isAtLimit: consultationCount >= FREE_CONSULTATION_LIMIT && !isSubscribed,
    freeLimit: FREE_CONSULTATION_LIMIT,
  };
};