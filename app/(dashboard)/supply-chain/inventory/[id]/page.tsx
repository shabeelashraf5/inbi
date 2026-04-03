'use client';

import { useEffect, use } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { useInventoryDetail } from '@/modules/supply-chain/inventory/hooks/use-inventory';
import { InventoryStatus } from '@/modules/supply-chain/inventory/types/inventory.types';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { DetailSkeleton } from '@/components/shared/loading-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, Boxes, History, TrendingUp, AlertTriangle, 
  ArrowDownToLine, ArrowUpFromLine, Settings, FileText,
  Warehouse, MoreVertical, BarChart
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const { item, isLoading, error } = useInventoryDetail(id);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    if (item) {
      setBreadcrumbs([
        { label: 'Overview', href: '/dashboard' },
        { label: 'Supply Chain', href: '/supply-chain' },
        { label: 'Inventory', href: '/supply-chain/inventory' },
        { label: item.sku },
      ]);
    }
  }, [setActivePortal, setBreadcrumbs, item]);

  if (isLoading) return <div className="space-y-6"><DetailSkeleton /></div>;
  if (error || !item) return <div className="py-20 text-center text-muted-foreground">Material not found</div>;

  const stockSafetyPercentage = Math.min((item.quantityOnHand / (item.minStockLevel * 2)) * 100, 100);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/supply-chain/inventory">
            <Button variant="ghost" size="icon" className="h-10 w-10 mt-1">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
              <StatusBadge status={item.status} />
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground font-medium">
               <span className="flex items-center gap-1.5"><Boxes size={14} /> {item.sku}</span>
               <span className="h-1 w-1 rounded-full bg-border" />
               <span className="uppercase tracking-wider text-[10px] bg-muted px-2 py-0.5 rounded-md">{item.category}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings size={14} className="mr-1" /> Adjust Stock
          </Button>
          <Button size="sm" className="bg-primary shadow-lg shadow-primary/20">
            <FileText size={14} className="mr-1" /> View Reports
          </Button>
        </div>
      </div>

      {item.status !== InventoryStatus.IN_STOCK && (
        <div className={cn(
          "p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-500",
          item.status === InventoryStatus.OUT_OF_STOCK 
            ? "bg-rose-50/50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/30" 
            : "bg-amber-50/50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/30"
        )}>
           <AlertTriangle size={20} className="shrink-0 mt-0.5" />
           <div>
              <p className="text-sm font-bold uppercase tracking-tight">
                {item.status === InventoryStatus.OUT_OF_STOCK ? "CRITICAL: Stock Depleted" : "Warning: Low Stock Level"}
              </p>
              <p className="text-xs opacity-90 mt-0.5 font-medium leading-relaxed">
                Management action required. Current stock ({item.quantityOnHand} {item.unit}) is below the set reorder point of {item.minStockLevel} {item.unit}.
              </p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quantities Overview */}
        <Card className="md:col-span-1 border-border/50">
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stock Quantities</CardTitle>
            <Warehouse size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">On Hand</p>
                  <p className="text-2xl font-bold mt-1">{item.quantityOnHand.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-[10px] font-bold text-primary uppercase">Available</p>
                  <p className="text-2xl font-bold mt-1 text-primary">{item.availableQuantity.toLocaleString()}</p>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reserved</p>
                      <p className="text-sm font-semibold">{item.reservedQuantity.toLocaleString()} {item.unit}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reorder Level</p>
                      <p className="text-sm font-semibold">{item.minStockLevel.toLocaleString()} {item.unit}</p>
                   </div>
                </div>
                <div className="space-y-1.5">
                   <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tighter">
                      <span className="text-muted-foreground">Stock Safety Margin</span>
                      <span className={cn(
                        stockSafetyPercentage < 30 ? "text-rose-600" : stockSafetyPercentage < 60 ? "text-amber-600" : "text-emerald-600"
                      )}>
                        {stockSafetyPercentage.toFixed(0)}%
                      </span>
                   </div>
                   <Progress value={stockSafetyPercentage} className="h-1.5" />
                </div>
             </div>

             <Separator />

             <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wider">Valuation</span>
                   </div>
                   <span className="text-lg font-bold text-primary">${item.totalValuation.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-muted-foreground text-center italic">Calculated at ${item.unitPrice} per {item.unit}</p>
             </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="md:col-span-2 border-border/50">
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
               <History size={16} /> Stock Movements
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={14} /></Button>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-sm">
                   <thead>
                      <tr className="bg-muted/20 border-b border-border/50">
                         <th className="text-left py-3 px-6 font-medium text-muted-foreground uppercase text-[10px]">Date</th>
                         <th className="text-left py-3 px-6 font-medium text-muted-foreground uppercase text-[10px]">Type</th>
                         <th className="text-left py-3 px-6 font-medium text-muted-foreground uppercase text-[10px]">Reference</th>
                         <th className="text-right py-3 px-6 font-medium text-muted-foreground uppercase text-[10px]">Qty</th>
                         <th className="text-left py-3 px-6 font-medium text-muted-foreground uppercase text-[10px]">Handled By</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border/50">
                      {item.movements.map((move) => (
                        <tr key={move.id} className="hover:bg-muted/10 transition-colors">
                           <td className="py-4 px-6 text-muted-foreground tabular-nums">
                              {new Date(move.date).toLocaleDateString()}
                           </td>
                           <td className="py-4 px-6">
                              <span className={cn(
                                "flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider",
                                move.type === 'receive' ? "text-emerald-600" : move.type === 'issue' ? "text-rose-600" : "text-amber-600"
                              )}>
                                 {move.type === 'receive' ? <ArrowDownToLine size={12} /> : move.type === 'issue' ? <ArrowUpFromLine size={12} /> : <BarChart size={12} />}
                                 {move.type}
                              </span>
                           </td>
                           <td className="py-4 px-6">
                              <p className="font-semibold text-primary/80 leading-none">{move.referenceNumber}</p>
                              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-mono">{move.referenceId}</p>
                           </td>
                           <td className={cn(
                              "py-4 px-6 text-right font-bold tabular-nums",
                              move.type === 'receive' ? "text-emerald-700" : move.type === 'issue' ? "text-rose-700" : "text-amber-700"
                           )}>
                              {move.type === 'receive' ? '+' : move.type === 'issue' ? '-' : '±'}{move.quantity.toLocaleString()}
                           </td>
                           <td className="py-4 px-6 text-muted-foreground italic font-medium">
                              {move.handledBy}
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="border-border/50 bg-muted/20">
            <CardContent className="p-4 flex items-start gap-4">
               <div className="p-2 rounded-lg bg-background border border-border shadow-sm">
                  <BarChart size={20} className="text-primary" />
               </div>
               <div>
                  <p className="text-sm font-bold">Automatic Monitoring</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    System monitors inventory levels in real-time. Forecast alerts will be sent once stock reaches 120% of the reorder level to allow for procurement lead time.
                  </p>
               </div>
            </CardContent>
         </Card>
         <Card className="border-border/50 bg-muted/20">
            <CardContent className="p-4 flex items-start gap-4">
               <div className="p-2 rounded-lg bg-background border border-border shadow-sm">
                  <Warehouse size={20} className="text-primary" />
               </div>
               <div>
                  <p className="text-sm font-bold">Storage Location</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    Primary Bin: **SECTION-A / AISLE-2 / SHELF-4**. Materials must be inspected for physical damage upon any stock movement.
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
