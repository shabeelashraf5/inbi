'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvoices } from '@/modules/finance/hooks/use-finance';
import { InvoiceStatus } from '@/modules/finance/types/finance.types';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Calendar,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/shared/loading-skeleton';

export default function FinanceDashboardPage() {
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const { invoices, isLoading } = useInvoices();

  useEffect(() => {
    setActivePortal(Portal.FINANCE);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Finance' },
    ]);
  }, [setActivePortal, setBreadcrumbs]);

  const totalReceivable = 0; // In a real app this would come from a separate service
  const totalPayable = invoices.reduce((sum, inv) => sum + inv.amountRemaining, 0);
  const overduePayable = invoices
    .filter(inv => inv.status === InvoiceStatus.OVERDUE)
    .reduce((sum, inv) => sum + inv.amountRemaining, 0);

  if (isLoading) return <TableSkeleton rows={10} />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Finance Dashboard" 
        description="Comprehensive overview of company financials and accounts." 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-rose-100 rounded-lg dark:bg-rose-900/20">
                <ArrowUpRight className="text-rose-600" size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Accounts Payable</span>
            </div>
            <h3 className="text-2xl font-bold">${totalPayable.toLocaleString()}</h3>
            <p className="text-xs text-muted-foreground mt-1">Total outstanding to vendors</p>
            {overduePayable > 0 && (
              <div className="mt-4 flex items-center gap-2 text-rose-600 bg-rose-50 dark:bg-rose-950/20 p-2 rounded-md">
                <AlertCircle size={14} />
                <span className="text-[10px] font-bold uppercase">${overduePayable.toLocaleString()} Overdue</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg dark:bg-emerald-900/20">
                <ArrowDownRight className="text-emerald-600" size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Accounts Receivable</span>
            </div>
            <h3 className="text-2xl font-bold">${totalReceivable.toLocaleString()}</h3>
            <p className="text-xs text-muted-foreground mt-1">Total pending from customers</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                <Wallet className="text-blue-600" size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cash Position</span>
            </div>
            <h3 className="text-2xl font-bold">$1,240,500</h3>
            <p className="text-xs text-muted-foreground mt-1">Total liquidity across accounts</p>
            <div className="mt-4 flex items-center gap-1 text-emerald-600">
               <TrendingUp size={14} />
               <span className="text-[10px] font-bold">+12% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-border/50">
                {invoices.slice(0, 5).map(inv => (
                  <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors cursor-pointer" onClick={() => window.location.href=`/finance/invoices/${inv.id}`}>
                    <div>
                      <p className="text-sm font-bold">{inv.vendor}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{inv.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">${inv.totalAmount.toLocaleString()}</p>
                      <StatusBadge status={inv.status} />
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
             {invoices.filter(i => i.status !== InvoiceStatus.PAID).map(inv => (
                <div key={inv.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border/30">
                   <div className="bg-background p-2 rounded-md shadow-sm">
                      <Calendar size={16} className="text-muted-foreground" />
                   </div>
                   <div className="flex-1">
                      <p className="text-xs font-bold">{inv.vendor}</p>
                      <p className="text-[10px] text-muted-foreground">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold text-rose-600">${inv.amountRemaining.toLocaleString()}</p>
                   </div>
                </div>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
