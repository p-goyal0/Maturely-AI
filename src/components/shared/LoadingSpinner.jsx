/**
 * Loading Spinner Component
 * Reusable loading indicator with consistent styling
 */

import { DotSpinner } from '../ui/DotSpinner';

export function LoadingSpinner({ 
  size = 'md', 
  className = '',
  text = null,
  color = '#183153'
}) {
  const sizeMap = {
    sm: '1.5rem',
    md: '2.8rem',
    lg: '4rem',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <DotSpinner size={sizeMap[size] || sizeMap.md} color={color} />
      {text && (
        <p className="text-sm text-slate-600 font-medium">{text}</p>
      )}
    </div>
  );
}


