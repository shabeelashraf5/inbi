'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { KPICard } from '@/components/shared/kpi-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SC_KPIS, SC_PIPELINE_DATA, SC_RECENT_RFQS, SC_REVENUE_TREND } from '@/lib/mock/supply-chain-dashboard.mock';
import Link from 'next/link';
import { Plus, ArrowRight, Activity, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area, Legend, Cell
} from 'recharts';
import { cn } from '@/lib/utils';

export default function SupplyChainDashboardPage() {
  const { setActivePortal, setBreadcrumbs } = useAppStore();

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain' },
    ]);
  }, [setActivePortal, setBreadcrumbs]);

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Supply Chain Operations"
        description="Monitor the end-to-end flow from client RFQ to final delivery."
        actions={
          <div className="flex items-center gap-3">
             <Link href="/supply-chain/rfq/new">
                <Button size="sm" className="shadow-lg shadow-primary/20">
                  <Plus size={16} className="mr-1" />
                  New RFQ
                </Button>
              </Link>
          </div>
        }
      />

      {/* Hero Workflow Section */}
      <Card className="border-primary/20 bg-primary/[0.01] shadow-sm overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Activity size={120} className="text-primary" />
         </div>
         <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="text-lg font-bold">Active Order Pipeline</CardTitle>
                  <CardDescription>Real-time status of all active transactions across the 10-step lifecycle.</CardDescription>
               </div>
               <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[10px] font-black">
                  Live Status
               </Badge>
            </div>
         </CardHeader>
         <CardContent className="pt-6">
            <WorkflowTimeline currentStage={WorkflowStage.PROCUREMENT} completedStages={[WorkflowStage.RFQ_ENTRY, WorkflowStage.AI_PARSING]} />
         </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SC_KPIS.map((kpi) => (
          <KPICard key={kpi.label} data={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Activity Column */}
         <div className="lg:col-span-2 space-y-8">
            {/* Pipeline Chart */}
            <Card className="border-border/50 shadow-sm">
               <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Volume by Stage</CardTitle>
                    <CardDescription className="text-xs">Number of active orders in each workflow phase.</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                     Detailed Analytics <ArrowRight size={14} className="ml-1" />
                  </Button>
               </CardHeader>
               <CardContent>
                  <div className="h-[320px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={SC_PIPELINE_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.01 75)" vertical={false} />
                        <XAxis dataKey="stage" tick={{ fontSize: 11, fontWeight: 'bold' }} stroke="oklch(0.52 0.02 60)" axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.52 0.02 60)" axisLine={false} tickLine={false} />
                        <RechartsTooltip
                           cursor={{ fill: 'oklch(0.95 0.01 75)', opacity: 0.4 }}
                           contentStyle={{
                              backgroundColor: 'oklch(0.995 0.002 80)',
                              border: '1px solid oklch(0.90 0.01 75)',
                              borderRadius: '12px',
                              fontSize: '13px',
                              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                           }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                           {SC_PIPELINE_DATA.map((entry, index) => (
                              <Cell 
                                 key={`cell-${index}`} 
                                 fill={index % 2 === 0 ? 'oklch(0.62 0.09 55)' : 'oklch(0.58 0.12 160)'} 
                              />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
                  </div>
               </CardContent>
            </Card>

            {/* Recent Table */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
               <CardHeader className="pb-3 flex flex-row items-center justify-between border-b">
                  <div>
                    <CardTitle className="text-base font-semibold">Active Transactions</CardTitle>
                    <CardDescription className="text-xs">Overview of recent RFQs and their current progress.</CardDescription>
                  </div>
                  <Link href="/supply-chain/rfq">
                    <Button variant="outline" size="sm" className="text-xs">
                      View All <Activity size={14} className="ml-1" />
                    </Button>
                  </Link>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                     <thead>
                        <tr className="bg-muted/30">
                           <th className="text-left font-bold text-[10px] uppercase tracking-widest text-muted-foreground px-6 py-4">Order ID</th>
                           <th className="text-left font-bold text-[10px] uppercase tracking-widest text-muted-foreground px-6 py-4">Client</th>
                           <th className="text-left font-bold text-[10px] uppercase tracking-widest text-muted-foreground px-6 py-4">Stage</th>
                           <th className="text-left font-bold text-[10px] uppercase tracking-widest text-muted-foreground px-6 py-4">Status</th>
                           <th className="text-right font-bold text-[10px] uppercase tracking-widest text-muted-foreground px-6 py-4">Value</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/50">
                        {SC_RECENT_RFQS.map((rfq) => (
                           <tr key={rfq.id} className="hover:bg-muted/20 transition-colors group">
                           <td className="px-6 py-4 font-bold text-primary">{rfq.id}</td>
                           <td className="px-6 py-4">
                              <p className="font-semibold">{rfq.client}</p>
                              <p className="text-[10px] text-muted-foreground">{rfq.title}</p>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <Clock size={14} className="text-muted-foreground" />
                                 <span className="text-xs font-medium">Procurement</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <StatusBadge status={rfq.status} />
                           </td>
                           <td className="px-6 py-4 text-right font-black">{rfq.value}</td>
                           </tr>
                        ))}
                     </tbody>
                     </table>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Alerts & Sidebar Column */}
         <div className="space-y-8">
            <Card className="border-rose-200 bg-rose-50/10 dark:border-rose-900/30 shadow-sm">
               <CardHeader className="pb-3 border-b border-rose-100 dark:border-rose-900/20">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-rose-600 flex items-center gap-2">
                     <AlertCircle size={14} /> Critical Alerts
                  </CardTitle>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-rose-100/50 dark:bg-rose-950/20 border border-rose-200/50">
                     <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/20">
                        <Plus size={16} className="text-white rotate-45" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-rose-900 dark:text-rose-100 leading-tight">Delayed Supplier Quote</p>
                        <p className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">RFQ-1022: Vendor response overdue by 24h.</p>
                     </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-lg bg-amber-100/50 dark:bg-amber-950/20 border border-amber-200/50">
                     <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                        <AlertCircle size={16} className="text-white" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-amber-900 dark:text-amber-100 leading-tight">Low Stock Alert</p>
                        <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">High-Tensile Bolts (M24) reaching critical level.</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
               <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     <CheckCircle2 size={14} className="text-emerald-500" /> Pending Approvals
                  </CardTitle>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                  {[
                     { id: 'PO-551', value: '$8,200', user: 'Procurement Officer' },
                     { id: 'RFQ-102', value: '$45,000', user: 'Sales Engineer' },
                  ].map((item, i) => (
                     <div key={i} className="flex flex-col gap-3 p-4 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors">
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-black text-primary">{item.id}</span>
                           <span className="text-xs font-bold">{item.value}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">Requested by {item.user}</p>
                        <div className="flex gap-2">
                           <Button size="sm" className="h-8 flex-1 text-[10px] uppercase font-black tracking-wider">Approve</Button>
                           <Button size="sm" variant="outline" className="h-8 flex-1 text-[10px] uppercase font-black tracking-wider">Review</Button>
                        </div>
                     </div>
                  ))}
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
      className
    )}>
      {children}
    </span>
  );
}
