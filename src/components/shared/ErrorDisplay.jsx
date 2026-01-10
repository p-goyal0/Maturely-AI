/**
 * Error Display Component
 * Reusable component for displaying error messages consistently
 */

import { AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function ErrorDisplay({ 
  message, 
  onDismiss, 
  className = '',
  variant = 'error' // 'error' | 'warning' | 'info'
}) {
  if (!message) return null;

  const variantStyles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-start gap-3 p-4 rounded-xl border-2 ${variantStyles[variant]} ${className}`}
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium text-sm">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 hover:bg-black/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}


