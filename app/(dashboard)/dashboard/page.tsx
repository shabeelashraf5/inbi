'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app.store';
import { useAuth } from '@/lib/auth/use-auth';
import { PageHeader } from '@/components/shared/page-header';
import { KPICard } from '@/components/shared/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OVERVIEW_KPIS, REVENUE_CHART_DATA, ORDER_STATUS_DATA, RECENT_ACTIVITY } from '@/lib/mock/dashboard.mock';
import { getEnabledPortals } from '@/lib/constants/portals';
import Link from 'next/link';
import { ArrowRight, FileText, ShoppingCart, MessageSquare, Package, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const RevenueAreaChart = dynamic(() => import('@/components/dashboard/revenue-area-chart'), {
  loading: () => <Skeleton className="w-full h-[280px] rounded-xl" />,
  ssr: false
});

const OrderStatusPieChart = dynamic(() => import('@/components/dashboard/order-status-pie-chart'), {
  loading: () => <Skeleton className="w-full h-[200px] rounded-xl" />,
  ssr: false
});
import { cn } from '@/lib/utils';

const ACTIVITY_ICONS: Record<string, typeof FileText> = {
  rfq: FileText,
  po: ShoppingCart,
  quote: MessageSquare,
  inventory: Package,
  invoice: FileText,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { setBreadcrumbs } = useAppStore();
  const enabledPortals = getEnabledPortals();

  useEffect(() => {
    setBreadcrumbs([{ label: 'Overview' }]);
  }, [setBreadcrumbs]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good ${getGreeting()}, ${user?.name?.split(' ')[0] || 'there'}`}
        description="Here's what's happening across your organization today."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {OVERVIEW_KPIS.map((kpi) => (
          <KPICard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart data={REVENUE_CHART_DATA} />
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusPieChart data={ORDER_STATUS_DATA} />
            <div className="grid grid-cols-2 gap-2 mt-2">
              {ORDER_STATUS_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {RECENT_ACTIVITY.map((activity) => {
                const Icon = ACTIVITY_ICONS[activity.type] || FileText;
                return (
                  <div key={activity.id} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
                      <Icon size={14} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Portals */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {enabledPortals.map((portal) => (
              <Link
                key={portal.id}
                href={portal.basePath}
                className="flex items-center gap-3 rounded-lg border border-border/50 p-3 hover:bg-muted/30 hover:border-border transition-all group"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: portal.color + '15', color: portal.color }}
                >
                  <Package size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{portal.name}</p>
                  <p className="text-xs text-muted-foreground">{portal.description}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
