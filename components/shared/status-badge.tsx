import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type StatusVariant = 'draft' | 'pending' | 'submitted' | 'under_review' | 'quoted' | 'approved' | 'rejected' | 'completed' | 'cancelled' | 'issued' | 'confirmed' | 'shipped' | 'partially_received' | 'received' | 'closed' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'pending_approval' | 'partially_paid' | 'paid' | 'overdue' | 'voided';

const STATUS_STYLES: Record<StatusVariant, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  submitted: {
    label: 'Submitted',
    className: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  under_review: {
    label: 'Under Review',
    className: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  quoted: {
    label: 'Quoted',
    className: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  },
  issued: {
    label: 'Issued',
    className: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  partially_received: {
    label: 'Partially Received',
    className: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  received: {
    label: 'Received',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  closed: {
    label: 'Closed',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  in_stock: {
    label: 'In Stock',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  low_stock: {
    label: 'Low Stock',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  out_of_stock: {
    label: 'Out of Stock',
    className: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  },
  pending_approval: {
    label: 'Pending Approval',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  partially_paid: {
    label: 'Partially Paid',
    className: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  paid: {
    label: 'Paid',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  },
  voided: {
    label: 'Voided',
    className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_STYLES[status as StatusVariant] || {
    label: status,
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-medium text-[11px] px-2 py-0.5 border-0 rounded-md',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
