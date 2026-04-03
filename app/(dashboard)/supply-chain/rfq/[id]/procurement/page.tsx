'use client';

import React, { useState, useEffect, use } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Package, 
  ShoppingCart, 
  ArrowRight, 
  FileSearch, 
  Loader2, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Mock heritage from Step 1
const MOCK_RFQ_HERITAGE = {
  rfqNumber: 'RFQ-2026-9447',
  title: 'Dubai Metro Expansion - Phase 4 Structural Steel',
  client: 'Road & Transport Authority',
  items: [
     { id: '1', name: 'Structural Steel I-Beam (HEB 300)', quantity: 45, unit: 'pcs', specs: 'Grade S355JR' },
     { id: '2', name: 'Steel Plate 10mm - Grade A', quantity: 120, unit: 'pcs', specs: 'Shipbuilding grade' },
     { id: '3', name: 'High-Tensile Anchor Bolts (M24)', quantity: 500, unit: 'pcs', specs: 'Zinc-plated' }
  ]
};

export default function ProcurementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const router = useRouter();
  
  const [isCheckingStock, setIsCheckingStock] = useState(false);
  const [stockResults, setStockResults] = useState<any>({});

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: 'RFQ', href: `/supply-chain/rfq/${id}` },
      { label: 'Sourcing & Procurement' },
    ]);
  }, [setActivePortal, setBreadcrumbs, id]);

  const handleAiStockCheck = async () => {
    setIsCheckingStock(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Auto-fulfill most items for mock demo
    const results: any = {};
    MOCK_RFQ_HERITAGE.items.forEach(item => {
       results[item.id] = { status: 'full', available: item.quantity + 10, matchName: item.name };
    });
    
    setStockResults(results);
    setIsCheckingStock(false);
    toast.success('AI Inventory Scan Complete');
  };

  const handleDecision = (mode: 'inventory' | 'supplier') => {
    if (mode === 'inventory') {
      router.push(`/supply-chain/rfq/${id}/supplier-quotes?source=inventory`);
    } else {
      router.push(`/supply-chain/rfq/${id}/supplier-quotes`);
    }
  };

  return (
    <div className="w-full space-y-8 pb-20 px-4 md:px-10 animate-in fade-in duration-1000">
      {/* 1. Header & Full 9-Step Timeline */}
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Procurement Strategy" 
          description="Analyze inventory levels and determine the sourcing path for the validated bill of materials." 
        />
        <div className="bg-muted/10 rounded-2xl p-4 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.PROCUREMENT} />
        </div>
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Sourcing Stage Header */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-2xl shadow-primary/5">
                   <FileSearch size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-foreground leading-tight">{MOCK_RFQ_HERITAGE.title}</h3>
                   <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">{id}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 font-mono">Status: Awaiting Procurement Strategy</span>
                   </div>
                </div>
             </div>
             <div className="text-right hidden md:block px-6 py-3 bg-background/50 rounded-xl border border-border/40">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">Bill of Materials</p>
                <div className="font-mono text-xl font-bold text-foreground leading-none">
                   {MOCK_RFQ_HERITAGE.items.length} <span className="text-xs font-medium text-muted-foreground/60">SKUs</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-xl bg-background/80 backdrop-blur-xl rounded-2xl" onClick={handleAiStockCheck}>
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <Package size={160} />
              </div>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 ring-4 ring-primary/5">
                   {isCheckingStock ? <Loader2 className="text-primary animate-spin" size={24} /> : <Package className="text-primary" size={24} />}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Automated Inventory Check</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-sm mb-8">
                   {isCheckingStock ? 'AI is scanning the warehouse database...' : 'Cross-reference items with real-time Enterprise stock levels using AI parsing matching.'}
                </p>
                
                {isCheckingStock ? (
                   <div className="flex items-center text-primary font-bold text-xs uppercase tracking-wider animate-pulse">
                      Synthesizing Results...
                   </div>
                ) : (
                  <div className="flex items-center text-primary font-bold text-xs uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                    Run AI Multi-Warehouse Scan <ArrowRight size={16} className="ml-2" />
                  </div>
                )}
                
                {Object.keys(stockResults).length > 0 && !isCheckingStock && (
                   <div className="mt-6 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Verification Found: {Object.keys(stockResults).length} / {MOCK_RFQ_HERITAGE.items.length} Available</span>
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-emerald-600 hover:bg-emerald-100" onClick={(e) => { e.stopPropagation(); handleDecision('inventory'); }}>
                        Fulfill Sourcing <ArrowRight size={14} className="ml-2" />
                      </Button>
                   </div>
                )}
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:border-blue-500/50 transition-all cursor-pointer shadow-sm hover:shadow-xl bg-background/80 backdrop-blur-xl rounded-2xl" onClick={() => handleDecision('supplier')}>
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity -rotate-12">
                <ShoppingCart size={160} />
              </div>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 ring-4 ring-blue-500/5">
                  <ShoppingCart className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Request Market Quotations</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-sm mb-8">
                   Initiate the Strategic Sourcing flow for items not in stock or requiring fresh manufacturer pricing.
                </p>
                <div className="flex items-center text-blue-600 font-bold text-xs uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                   Initiate Sourcing Sub-workflow <ArrowRight size={16} className="ml-2" />
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2 bg-muted/20 p-8 rounded-3xl border border-border/50">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 bg-primary rounded-full" />
                     <h4 className="font-bold text-xs uppercase tracking-wider text-foreground/70">
                        Detailed Item Readiness List
                     </h4>
                  </div>
                  {isCheckingStock && (
                     <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary animate-pulse bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                        <Loader2 size={12} className="animate-spin" /> Cross-Referencing Master SKU List...
                     </div>
                  )}
               </div>
               
               <div className="space-y-4">
                  {MOCK_RFQ_HERITAGE.items.map(item => {
                    const result = stockResults[item.id];
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-background/60 backdrop-blur-md rounded-2xl border border-border/40 shadow-sm transition-all hover:border-primary/30 group">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground/30 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                              <Package size={20} />
                           </div>
                           <div>
                              <p className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/40">{item.specs}</span>
                                 <Separator orientation="vertical" className="h-2.5 border-border/50" />
                                 <span className="text-xs font-bold text-primary">{item.quantity} {item.unit} Required</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                           {result ? (
                              <div className="flex items-center gap-4 animate-in slide-in-from-right-4 duration-500">
                                 <div className="text-right">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/40 mb-1">Stock Availability</p>
                                    <p className="text-xs font-bold text-foreground">{result.matchName}</p>
                                 </div>
                                 <div className={cn(
                                    "px-4 py-2 rounded-xl flex items-center gap-2 font-bold uppercase tracking-wider text-xs border shadow-sm",
                                    result.status === 'full' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                    "bg-rose-50 text-rose-700 border-rose-100"
                                 )}>
                                    {result.status === 'full' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                    {result.status === 'full' ? `Available (${result.available})` : `Out of Stock`}
                                 </div>
                              </div>
                           ) : (
                              <div className="text-right flex flex-col items-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                 <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pre-Scan Waitstate</span>
                                 <span className="h-1.5 w-12 bg-muted rounded-full overflow-hidden">
                                     <div className="h-full bg-primary/20 w-0 group-hover:w-full transition-all duration-1000" />
                                 </span>
                              </div>
                           )}
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
}
