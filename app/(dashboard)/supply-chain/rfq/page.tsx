'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { useRFQs } from '@/modules/supply-chain/rfq/hooks/use-rfqs';
import { RFQStatus, type RFQFilters, type RFQ } from '@/modules/supply-chain/rfq/types/rfq.types';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  ArrowUpRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Box,
  Truck,
  FileSearch,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIORITY_STYLES: Record<string, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-rose-100 text-rose-700',
};

// Step mapping for the 10-stage supply chain workflow
const STATUS_TO_STEP: Record<RFQStatus, number> = {
  [RFQStatus.DRAFT]: 1,
  [RFQStatus.SUBMITTED]: 2,
  [RFQStatus.UNDER_REVIEW]: 3,
  [RFQStatus.QUOTED]: 4,
  [RFQStatus.APPROVED]: 10,
  [RFQStatus.REJECTED]: 1,
  [RFQStatus.CANCELLED]: 1,
};

export default function RFQListPage() {
  const router = useRouter();
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const { rfqs, isLoading, filters, setFilters } = useRFQs();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: 'RFQ Pipeline' },
    ]);
  }, [setActivePortal, setBreadcrumbs]);

  const handleSearch = (value: string) => {
    setFilters((prev: RFQFilters) => ({ ...prev, search: value }));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // In a real app, this would filter by phase
    // For now we just track it in state
  };

  const metrics = [
    { label: 'Active Intake', value: rfqs.filter(r => STATUS_TO_STEP[r.status] <= 2).length, icon: FileSearch, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Sourcing Items', value: rfqs.filter(r => STATUS_TO_STEP[r.status] >= 3 && STATUS_TO_STEP[r.status] <= 5).length, icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Urgent Action', value: rfqs.filter(r => r.priority === 'urgent').length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Delivered (MTD)', value: 12, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <PageHeader title="Supply Chain Pipeline" description="Real-time procurement tracking" />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full pb-20 px-2 max-w-[1440px]">
      {/* 1. Header with Global Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Supply Chain Pipeline"
          description="Central command for all procurement and fulfillment documents."
        />
        <Link href="/supply-chain/rfq/new">
          <Button className="h-12 px-6 rounded-2xl shadow-xl shadow-primary/20 font-black text-xs uppercase tracking-widest active:scale-95 transition-all group">
            <Plus size={16} className="mr-2" />
            Initiate RFQ
          </Button>
        </Link>
      </div>

      {/* 2. Logistics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden group hover:border-primary/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-2xl transition-colors", metric.bg)}>
                  <metric.icon className={cn("transition-transform group-hover:scale-110 duration-500", metric.color)} size={20} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{metric.label}</p>
                  <h3 className="text-2xl font-black mt-1 leading-none">{metric.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Pipeline Filter & Search */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-muted/20 p-2 rounded-3xl border border-border/50">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full lg:w-auto">
          <TabsList className="bg-transparent h-11 p-1 gap-1">
            <TabsTrigger value="all" className="rounded-2xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-tighter transition-all">All Pipeline</TabsTrigger>
            <TabsTrigger value="intake" className="rounded-2xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-tighter transition-all">Intake</TabsTrigger>
            <TabsTrigger value="sourcing" className="rounded-2xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-tighter transition-all">Sourcing</TabsTrigger>
            <TabsTrigger value="fulfillment" className="rounded-2xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-tighter transition-all">Logistics</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full lg:w-80 px-2 lg:px-0">
          <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="h-10 pl-10 pr-4 rounded-2xl border-transparent bg-background shadow-sm focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all"
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 4. Premium Document Table */}
      <Card className="border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm bg-background/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground/70 px-8 py-5">RFQ Document</th>
                <th className="text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground/70 px-6 py-5 hidden md:table-cell">Client Entity</th>
                <th className="text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground/70 px-6 py-5">Live Progress</th>
                <th className="text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground/70 px-6 py-5 hidden lg:table-cell">Priority</th>
                <th className="text-right font-black text-[10px] uppercase tracking-widest text-muted-foreground/70 px-6 py-5">Estimated Value</th>
                <th className="px-8 py-5 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {rfqs.map((rfq) => (
                <tr key={rfq.id} className="group hover:bg-primary/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1 min-w-[200px]">
                      <Link href={`/supply-chain/rfq/${rfq.id}`} className="font-bold text-sm hover:text-primary transition-colors flex items-center gap-2">
                        {rfq.rfqNumber}
                        <ArrowUpRight size={14} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                      </Link>
                      <p className="text-xs text-muted-foreground font-medium truncate max-w-[240px]">{rfq.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6 hidden md:table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-black uppercase text-muted-foreground border border-border/50">
                        {rfq.client.substring(0, 2)}
                      </div>
                      <span className="font-semibold text-xs">{rfq.client}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 min-w-[200px]">
                     <div className="space-y-3">
                        <div className="flex items-center justify-between">
                           <StatusBadge status={rfq.status} />
                           <span className="text-[10px] font-black uppercase text-muted-foreground/60">{Math.round((STATUS_TO_STEP[rfq.status] / 10) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex gap-0.5 p-0.5">
                           {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
                              <div 
                                 key={step}
                                 className={cn(
                                    "h-full flex-1 rounded-full transition-all duration-500",
                                    STATUS_TO_STEP[rfq.status] >= step ? "bg-primary" : "bg-muted-foreground/10"
                                 )}
                              />
                           ))}
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-6 hidden lg:table-cell">
                    <span className={cn('px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', PRIORITY_STYLES[rfq.priority])}>
                      {rfq.priority}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex flex-col gap-1">
                       <span className="font-black text-sm">${rfq.totalEstimate.toLocaleString()}</span>
                       <span className="text-[10px] font-medium text-muted-foreground/60 uppercase">Expected {rfq.dueDate}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-muted" />}>
                        <MoreHorizontal size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-border/40 backdrop-blur-sm">
                        <DropdownMenuItem className="py-2.5 rounded-lg font-medium" onClick={() => router.push(`/supply-chain/rfq/${rfq.id}`)}>
                          <Eye size={14} className="mr-3 text-muted-foreground" /> View Document
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2.5 rounded-lg font-medium">
                          <Edit size={14} className="mr-3 text-muted-foreground" /> Modify Content
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-2.5 rounded-lg font-medium text-rose-600 bg-rose-50/0 hover:bg-rose-50 transition-colors">
                          <Trash2 size={14} className="mr-3" /> Terminate RFQ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* 5. Summary Stats Footer */}
      <div className="flex items-center justify-between px-8 py-4 bg-muted/20 rounded-3xl border border-border/50 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
         <div className="flex items-center gap-8">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Tracking Active</span>
            <span>Total Value: ${rfqs.reduce((acc, curr) => acc + curr.totalEstimate, 0).toLocaleString()}</span>
         </div>
         <div className="flex items-center gap-4">
            <span className="hover:text-primary cursor-pointer transition-colors">Export Report (PDF)</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="hover:text-primary cursor-pointer transition-colors">Export CSV</span>
         </div>
      </div>
    </div>
  );
}

function Separator({ className, orientation = 'horizontal' }: { className?: string; orientation?: 'horizontal' | 'vertical' }) {
   return (
      <div className={cn(
         "bg-border/50",
         orientation === 'horizontal' ? "h-[1px] w-full" : "w-[1px] h-full",
         className
      )} />
   );
}
