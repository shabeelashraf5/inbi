'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { useInvoices } from '@/modules/finance/hooks/use-finance';
import { InvoiceStatus } from '@/modules/finance/types/finance.types';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { Search, Plus, Filter, FileText, CreditCard, AlertCircle, TrendingDown, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InvoicesPage() {
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const { invoices, isLoading, setFilters } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setActivePortal(Portal.FINANCE);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Finance', href: '/finance' },
      { label: 'Invoices' },
    ]);
  }, [setActivePortal, setBreadcrumbs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleStatusChange = (value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      status: !value || value === 'all' ? undefined : (value as InvoiceStatus),
    }));
  };

  const stats = [
    { 
      label: 'Total Payables', 
      value: `$${invoices.reduce((sum, i) => sum + i.amountRemaining, 0).toLocaleString()}`, 
      icon: CreditCard, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Overdue', 
      value: `$${invoices.filter(i => i.status === InvoiceStatus.OVERDUE).reduce((sum, i) => sum + i.amountRemaining, 0).toLocaleString()}`, 
      icon: AlertCircle, 
      color: 'text-rose-600' 
    },
    { 
      label: 'Paid This Month', 
      value: `$${invoices.filter(i => i.status === InvoiceStatus.PAID).reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}`, 
      icon: TrendingDown, 
      color: 'text-emerald-600' 
    },
    { 
      label: 'Draft Invoices', 
      value: invoices.filter(i => i.status === InvoiceStatus.DRAFT).length, 
      icon: FileText, 
      color: 'text-slate-600' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Invoices" 
          description="Manage vendor billing and accounts payable." 
        />
        <Button size="sm">
          <Plus size={16} className="mr-2" /> New Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className={cn("text-xl font-bold mt-1", stat.color)}>{stat.value}</p>
              </div>
              <div className={cn("p-2 rounded-lg bg-background", stat.color)}>
                <stat.icon size={18} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search by vendor, Invoice #, or PO..."
                className="pl-9 bg-background/50"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-[150px] bg-background/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={InvoiceStatus.PENDING_APPROVAL}>Pending Approval</SelectItem>
                  <SelectItem value={InvoiceStatus.APPROVED}>Approved</SelectItem>
                  <SelectItem value={InvoiceStatus.PARTIALLY_PAID}>Partially Paid</SelectItem>
                  <SelectItem value={InvoiceStatus.PAID}>Paid</SelectItem>
                  <SelectItem value={InvoiceStatus.OVERDUE}>Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="px-6 py-4 font-medium text-muted-foreground">Invoice Details</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Vendor</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-right">Total Amount</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-right">Remaining</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-right">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-muted/20 transition-colors group cursor-pointer" onClick={() => window.location.href=`/finance/invoices/${invoice.id}`}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-primary group-hover:underline">
                          {invoice.invoiceNumber}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <p className="text-[10px] text-muted-foreground font-mono uppercase">Ref: {invoice.poNumber}</p>
                          <ArrowUpRight size={10} className="text-muted-foreground" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{invoice.vendor}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold">
                        {invoice.currency} {invoice.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={cn("font-bold", invoice.amountRemaining > 0 ? "text-rose-600" : "text-emerald-600")}>
                          {invoice.currency} {invoice.amountRemaining.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums font-medium text-muted-foreground">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
