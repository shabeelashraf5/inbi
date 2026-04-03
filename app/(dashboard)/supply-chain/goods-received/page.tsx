'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Package, 
  Upload,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/status-badge';
import { Progress } from '@/components/ui/progress';

interface GRNItem {
  id: string;
  description: string;
  orderedQty: number;
  receivedQty: number;
  unit: string;
  status: 'pending' | 'partially_received' | 'received';
}

const MOCK_GRN_ITEMS: GRNItem[] = [
  { id: '1', description: 'Industrial Steel Beam - H Section', orderedQty: 50, receivedQty: 0, unit: 'pcs', status: 'pending' },
  { id: '2', description: 'High-Tensile Bolts & Nuts', orderedQty: 500, receivedQty: 500, unit: 'sets', status: 'received' },
  { id: '3', description: 'Welding Electrodes - E7018', orderedQty: 200, receivedQty: 100, unit: 'kg', status: 'partially_received' },
];

export default function GoodsReceivedPage() {
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const [items, setItems] = useState<GRNItem[]>(MOCK_GRN_ITEMS);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: 'Goods Received' },
    ]);
  }, [setActivePortal, setBreadcrumbs]);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Mock update
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col gap-4">
        <PageHeader 
          title="Goods Receipt Management" 
          description="Log and verify incoming shipments from suppliers against purchase orders." 
          actions={
            <Button onClick={handleVerify} disabled={isVerifying} className="shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700">
               {isVerifying ? 'Verifying Documents...' : 'Finalize & Verify Receipt'}
            </Button>
          }
        />
        <WorkflowTimeline currentStage={WorkflowStage.GOODS_RECEIPT} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold">Items Awaiting Receipt</CardTitle>
              <Badge variant="outline" className="text-[10px] font-black uppercase">PO-5521</Badge>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="text-left font-medium text-muted-foreground px-6 py-3">Description</th>
                        <th className="text-center font-medium text-muted-foreground px-4 py-3">Ordered</th>
                        <th className="text-center font-medium text-muted-foreground px-4 py-3">Received</th>
                        <th className="text-center font-medium text-muted-foreground px-4 py-3">Unit</th>
                        <th className="text-right font-medium text-muted-foreground px-6 py-3">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold">{item.description}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">Lot #LT-2026-X1</p>
                          </td>
                          <td className="px-4 py-3 text-center font-medium">{item.orderedQty}</td>
                          <td className="px-4 py-3 text-center">
                             <Input 
                                type="number" 
                                defaultValue={item.receivedQty} 
                                className="w-16 h-8 text-center mx-auto" 
                             />
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground font-bold uppercase text-[10px]">{item.unit}</td>
                          <td className="px-6 py-3 text-right">
                             <div className="flex flex-col items-end gap-1.5">
                                <Progress value={(item.receivedQty / item.orderedQty) * 100} className="h-1.5 w-24" />
                                <span className={cn(
                                   "text-[10px] font-black uppercase tracking-widest",
                                   item.status === 'received' ? "text-emerald-600" : item.status === 'partially_received' ? "text-amber-600" : "text-slate-400"
                                )}>
                                   {item.status.replace(/_/g, ' ')}
                                </span>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Upload size={20} className="text-primary" />
                </div>
                <p className="text-sm font-bold">Supplier Invoice</p>
                <p className="text-[10px] text-muted-foreground mt-1">Upload for financial verification</p>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2 hover:border-blue-500/50 transition-colors cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <FileCheck size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-bold">Delivery Note</p>
                <p className="text-[10px] text-muted-foreground mt-1">Upload signed vendor document</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
           <Card className="border-amber-200 bg-amber-50/10 dark:border-amber-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-amber-700 dark:text-amber-400">
                   <AlertTriangle size={16} /> Quality Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full border border-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">Verify physical damage to packaging</p>
                 </div>
                 <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full border border-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">Check heat numbers against certificates</p>
                 </div>
                 <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full border border-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">Confirm material grade matches PO specs</p>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2 text-center">
                 <CardTitle className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Storage Location</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 py-6">
                 <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                    <Package className="text-primary" size={32} />
                 </div>
                 <div className="text-center">
                    <p className="text-lg font-black tracking-tight">WH-A, Rack 04</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Jebel Ali South Facility</p>
                 </div>
                 <Button variant="ghost" size="sm" className="text-primary text-xs">Change Location</Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'outline', className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border",
      variant === 'outline' ? "border-border text-foreground" : "bg-primary text-primary-foreground border-transparent",
      className
    )}>
      {children}
    </span>
  );
}
