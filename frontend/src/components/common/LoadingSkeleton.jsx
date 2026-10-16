// frontend/src/components/common/LoadingSkeleton.jsx
import { motion } from 'framer-motion';

// ── Base Skeleton Block ───────────────────────────────────
const SkeletonBlock = ({ className = '', rounded = 'rounded-lg' }) => (
  <div className={`skeleton ${rounded} ${className}`} />
);

// ── Stat Card Skeleton ────────────────────────────────────
export const CardSkeleton = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-start justify-between">
      <SkeletonBlock className="h-4 w-28" />
      <SkeletonBlock className="h-11 w-11" rounded="rounded-xl" />
    </div>
    <SkeletonBlock className="h-9 w-24" rounded="rounded-xl" />
    <SkeletonBlock className="h-5 w-32" rounded="rounded-full" />
  </div>
);

// ── Table Skeleton ────────────────────────────────────────
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="card overflow-hidden">
    {/* Header */}
    <div className="px-5 py-4 border-b border-neutral-200
                    dark:border-neutral-700
                    bg-neutral-50 dark:bg-neutral-800/80">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-3" />
        ))}
      </div>
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i}
        className="flex items-center gap-4 px-5 py-4
                   border-b border-neutral-100
                   dark:border-neutral-800 last:border-0">
        <SkeletonBlock className="h-10 w-10 flex-shrink-0"
          rounded="rounded-xl" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="h-3 w-24" />
        </div>
        <SkeletonBlock className="h-6 w-16" rounded="rounded-full" />
        <SkeletonBlock className="h-8 w-8" rounded="rounded-lg" />
      </div>
    ))}
  </div>
);

// ── Dashboard Skeleton ────────────────────────────────────
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-40" rounded="rounded-xl" />
        <SkeletonBlock className="h-4 w-64" />
      </div>
      <SkeletonBlock className="h-10 w-52" rounded="rounded-xl" />
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="card p-6 lg:col-span-2 space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-40" rounded="rounded-lg" />
            <SkeletonBlock className="h-3 w-28" />
          </div>
          <SkeletonBlock className="h-6 w-24" rounded="rounded-full" />
        </div>
        <SkeletonBlock className="h-56 w-full" rounded="rounded-xl" />
      </div>
      <div className="card p-6 space-y-5">
        <SkeletonBlock className="h-5 w-36" rounded="rounded-lg" />
        <SkeletonBlock className="h-48 w-48 mx-auto"
          rounded="rounded-full" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-3/4" />
        </div>
      </div>
    </div>

    {/* Bottom Row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="card p-6 lg:col-span-2 space-y-4">
        <SkeletonBlock className="h-5 w-40" rounded="rounded-lg" />
        <SkeletonBlock className="h-44 w-full" rounded="rounded-xl" />
      </div>
      <div className="card p-6 space-y-3">
        <SkeletonBlock className="h-5 w-32" rounded="rounded-lg" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}
            className="flex items-center gap-3 p-3
                       bg-neutral-50 dark:bg-neutral-700/50
                       rounded-xl">
            <SkeletonBlock className="h-2 w-2"
              rounded="rounded-full" />
            <div className="flex-1 space-y-1.5">
              <SkeletonBlock className="h-3 w-32" />
              <SkeletonBlock className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Form Skeleton ─────────────────────────────────────────
export const FormSkeleton = ({ fields = 4 }) => (
  <div className="space-y-5">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-11 w-full" rounded="rounded-xl" />
      </div>
    ))}
    <div className="flex justify-end gap-3 pt-2">
      <SkeletonBlock className="h-11 w-24" rounded="rounded-xl" />
      <SkeletonBlock className="h-11 w-32" rounded="rounded-xl" />
    </div>
  </div>
);

// ── Page Skeleton ─────────────────────────────────────────
export const PageSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-48" rounded="rounded-xl" />
        <SkeletonBlock className="h-4 w-64" />
      </div>
      <SkeletonBlock className="h-10 w-36" rounded="rounded-xl" />
    </div>
    <div className="card overflow-hidden">
      <TableSkeleton rows={8} />
    </div>
  </div>
);

export default SkeletonBlock;