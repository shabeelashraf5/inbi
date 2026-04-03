'use client';

import {
  TrendingUp, TrendingDown, Minus,
  DollarSign, FileText, FileCheck, ShoppingCart, Warehouse,
  CheckCircle, Users, Package, type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { KPIData } from '@/types/common.types';

const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  FileText,
  FileCheck,
  ShoppingCart,
  Warehouse,
  CheckCircle,
  Users,
  Package,
};

interface KPICardProps {
  data: KPIData;
  className?: string;
}

export function KPICard({ data, className }: KPICardProps) {
  const Icon = data.icon ? ICON_MAP[data.icon] || Package : Package;

  return (
    <Card className={cn('group hover:shadow-md transition-all duration-300 border-border/50', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{data.label}</p>
            <p className="text-2xl font-bold tracking-tight mt-2">{data.value}</p>
            {data.change !== undefined && (
              <div className="flex items-center gap-1.5 mt-2">
                {data.trend === 'up' && (
                  <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={14} />
                    <span className="text-xs font-medium">+{Math.abs(data.change)}%</span>
                  </span>
                )}
                {data.trend === 'down' && (
                  <span className="flex items-center gap-0.5 text-red-500 dark:text-red-400">
                    <TrendingDown size={14} />
                    <span className="text-xs font-medium">{data.change}%</span>
                  </span>
                )}
                {data.trend === 'neutral' && (
                  <span className="flex items-center gap-0.5 text-muted-foreground">
                    <Minus size={14} />
                    <span className="text-xs font-medium">{data.change}%</span>
                  </span>
                )}
                {data.changeLabel && (
                  <span className="text-xs text-muted-foreground">{data.changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
