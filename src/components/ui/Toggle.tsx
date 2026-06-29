import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  size = 'md',
  className,
  disabled = false,
}) => {
  const trackSize = size === 'sm' ? 'w-8 h-4' : 'w-11 h-6';
  const thumbSize = size === 'sm' ? 'w-3 h-3' : 'w-5 h-5';
  const thumbX = size === 'sm' ? 17 : 21;

  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', disabled && 'opacity-60 cursor-not-allowed', className)}>
      <div
        className={cn(
          'relative rounded-full transition-colors duration-200',
          trackSize,
          checked ? 'bg-indigo-600' : 'bg-slate-600'
        )}
        onClick={() => !disabled && onChange(!checked)}
      >
        <motion.div
          className={cn('absolute top-0.5 left-0.5 bg-white rounded-full shadow', thumbSize)}
          animate={{ x: checked ? thumbX - (size === 'sm' ? 4 : 5) : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      {label && <span className="text-sm text-slate-300">{label}</span>}
    </label>
  );
};
