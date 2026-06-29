import React from 'react';
import { cn } from '../../utils/helpers';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, lines = 1 }) => {
  if (lines === 1) {
    return (
      <div className={cn('skeleton rounded-lg h-4 bg-slate-700/50', className)} />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'skeleton rounded-lg h-4 bg-slate-700/50',
            i === lines - 1 && 'w-3/4',
            className
          )}
        />
      ))}
    </div>
  );
};

export const DomainSkeleton: React.FC = () => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-700" />
        <div>
          <div className="h-5 w-40 bg-slate-700 rounded mb-2" />
          <div className="h-3 w-20 bg-slate-700/50 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-6 w-16 bg-slate-700 rounded-full" />
        <div className="h-9 w-24 bg-slate-700 rounded-xl" />
      </div>
    </div>
  </div>
);

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-slate-800/50 border border-slate-700 rounded-2xl p-6 animate-pulse', className)}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-slate-700" />
      <div>
        <div className="h-4 w-24 bg-slate-700 rounded mb-1" />
        <div className="h-3 w-16 bg-slate-700/50 rounded" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full bg-slate-700/50 rounded" />
      <div className="h-3 w-5/6 bg-slate-700/50 rounded" />
      <div className="h-3 w-4/6 bg-slate-700/50 rounded" />
    </div>
  </div>
);
