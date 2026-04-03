'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { usePurchaseOrders } from '@/modules/supply-chain/purchase-orders/hooks/use-purchase-orders';
import { POStatus } from '@/modules/supply-chain/purchase-orders/types/purchase-orders.types';
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
import { Search, Plus, Filter, FileText, ExternalLink, Calendar, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PurchaseOrdersPage() {
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const { pos, isLoading, setFilters } = usePurchaseOrders();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: 'Purchase Orders' },
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
      status: !value || value === 'all' ? undefined : (value as POStatus),
    }));
  };

  const stats = [
    { label: 'Total Orders', value: pos.length, icon: FileText, color: 'text-blue-600' },
    { label: 'Open Deliveries', value: pos.filter(p => !['received', 'closed', 'cancelled'].includes(p.status)).length, icon: Package, color: 'text-orange-600' },
    { label: 'Total Commitment', value: `$${pos.reduce((sum, p) => sum + p.totalAmount, 0).toLocaleString()}`, icon: Calendar, color: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Purchase Orders" 
          description="Track fulfillment and manage vendor orders." 
        />
        <Button size="sm">
          <Plus size={16} className="mr-2" /> Create PO
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.value}</p>
              </div>
              <div className={cn("p-2 rounded-lg bg-background", stat.color)}>
                <stat.icon size={20} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search by vendor, PO #, or Quote..."
                className="pl-9 bg-background/50"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full md:w-[150px] bg-background/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={POStatus.ISSUED}>Issued</SelectItem>
                  <SelectItem value={POStatus.SHIPPED}>Shipped</SelectItem>
                  <SelectItem value={POStatus.RECEIVED}>Received</SelectItem>
                  <SelectItem value={POStatus.CLOSED}>Closed</SelectItem>
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
                  <th className="px-6 py-4 font-medium text-muted-foreground w-40">PO Number</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Vendor</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Exp. Delivery</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {pos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No purchase orders found.
                    </td>
                  </tr>
                ) : (
                  pos.map((po) => (
                    <tr key={po.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4">
                        <Link 
                          href={`/supply-chain/purchase-orders/${po.id}`}
                          className="font-bold text-primary hover:underline"
                        >
                          {po.poNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{po.vendor}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{po.vendorEmail}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {po.currency} {po.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={po.status} />
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(po.expectedDeliveryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/supply-chain/purchase-orders/${po.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink size={14} />
                          </Button>
                        </Link>
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
