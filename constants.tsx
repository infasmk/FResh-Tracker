
import React from 'react';

export const COLORS = {
  primary: '#3b82f6',
  secondary: '#64748b',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  background: '#f8fafc',
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const getCurrentDate = () => new Date().toISOString().split('T')[0];
export const getMonthYear = (date: string) => date.substring(0, 7); // YYYY-MM
