import { cn } from '@/lib/utils';
import { FileX, Inbox, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

type EmptyStateVariant = 'no-data' | 'no-results' | 'error';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
  className?: string;
}

const DEFAULT_ICONS: Record<EmptyStateVariant, ReactNode> = {
  'no-data': <Inbox size={48} className="text-muted-foreground/30" />,
  'no-results': <Search size={48} className="text-muted-foreground/30" />,
  error: <FileX size={48} className="text-destructive/30" />,
};

export function EmptyState({
  variant = 'no-data',
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="mb-4">{icon || DEFAULT_ICONS[variant]}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-[400px]">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-4" size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}
