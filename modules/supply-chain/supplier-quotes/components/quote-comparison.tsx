'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  Star,
  ArrowRight,
  Info,
  ChevronRight,
  Award,
  AlertCircle,
  FileText,
  Percent,
  Warehouse
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SupplierProposal } from './quote-entry-form';

interface QuoteComparisonProps {
  quotes: SupplierProposal[];
  onSelect: (quote: SupplierProposal) => void;
  onBack?: () => void;
  isInventoryMode?: boolean;
}

export function QuoteComparison({ quotes, onSelect, onBack, isInventoryMode = false }: QuoteComparisonProps) {
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  // AI-Powered Analytics: Calculate Best Price and Fastest Lead Time
  const analytics = useMemo(() => {
    if (quotes.length === 0 || isInventoryMode) return { bestPriceId: null, fastestId: null };

    let minPrice = Infinity;
    let minPriceId = null;
    let minDays = Infinity;
    let minDaysId = null;

    quotes.forEach(q => {
      if (q.grandTotal < minPrice) {
        minPrice = q.grandTotal;
        minPriceId = q.id;
      }
      if (q.deliveryDays < minDays) {
        minDays = q.deliveryDays;
        minDaysId = q.id;
      }
    });

    return { bestPriceId: minPriceId, fastestId: minDaysId };
  }, [quotes]);

  const handleConfirm = () => {
    const selected = isInventoryMode ? quotes[0] : quotes.find(q => q.id === selectedQuoteId);
    if (selected) onSelect(selected);
  };

  // Pre-select the only option in inventory mode
  React.useEffect(() => {
    if (isInventoryMode && quotes.length > 0) {
      setSelectedQuoteId(quotes[0].id);
    }
  }, [isInventoryMode, quotes]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-border/30 pb-4">
         <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-600 p-2.5 rounded-xl border border-emerald-500/20 shadow-inner">
               <TrendingDown size={22} strokeWidth={2.5} />
            </div>
            <div>
               <h3 className="text-base font-black text-foreground uppercase tracking-tight">Technical Evaluation Active</h3>
               <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Strategic comparison of multiple vendor proposals</p>
            </div>
         </div>
         {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.2em] hover:bg-muted text-primary/60 hover:text-primary transition-all">
               ← Return to Entry
            </Button>
         )}
      </div>      {/* Comparison Grid or Inventory Single View */}
      <div className={cn(
        "grid gap-8",
        isInventoryMode ? "grid-cols-1 max-w-2xl mx-auto" : "grid-cols-1 lg:grid-cols-3"
      )}>
        {quotes.map((quote, index) => {
          const isBestPrice = analytics.bestPriceId === quote.id;
          const isFastest = analytics.fastestId === quote.id;
          const isSelected = selectedQuoteId === quote.id;

          return (
            <div 
              key={quote.id} 
              onClick={() => !isInventoryMode && setSelectedQuoteId(quote.id)}
              className={cn(
                "relative transition-all duration-500 border-2 overflow-hidden rounded-2xl group",
                isSelected 
                  ? "border-primary bg-primary/[0.03] shadow-2xl scale-[1.02] -translate-y-1" 
                  : "border-border/40 hover:border-primary/20 hover:shadow-xl backdrop-blur-sm bg-background/50",
                !isInventoryMode && "cursor-pointer"
              )}
            >
              {isInventoryMode && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-blue-600 text-[10px] text-white font-black px-4 py-2 rounded-bl-2xl flex items-center gap-2 uppercase tracking-[0.2em] shadow-lg">
                    <ShieldCheck size={14} strokeWidth={3} /> INTERNAL ASSET
                  </div>
                </div>
              )}
              {isBestPrice && !isInventoryMode && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-emerald-600 text-[10px] text-white font-black px-4 py-2 rounded-bl-2xl flex items-center gap-2 uppercase tracking-[0.2em] shadow-lg">
                    <TrendingDown size={14} strokeWidth={3} /> BEST PRICE
                  </div>
                </div>
              )}
              {isFastest && !isBestPrice && !isInventoryMode && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-blue-600 text-[10px] text-white font-black px-4 py-2 rounded-bl-2xl flex items-center gap-2 uppercase tracking-[0.2em] shadow-lg">
                    <Clock size={14} strokeWidth={3} /> FASTEST
                  </div>
                </div>
              )}

              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border transition-all",
                    isSelected ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-muted/50 text-muted-foreground/40 border-border/50"
                  )}>
                    {isInventoryMode ? <Warehouse size={16} /> : `VQ-${index + 1}`}
                  </div>
                  <div className="flex items-center gap-2 text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                    <ShieldCheck size={14} strokeWidth={2.5} />
                    <span className="text-[10px] font-black tracking-widest text-primary uppercase">Stock Certified</span>
                  </div>
                </div>

                <div>
                   <h4 className={cn(
                     "text-xl font-black tracking-tight transition-colors",
                     isSelected ? "text-primary" : "text-foreground"
                   )}>{quote.supplierName || 'Unnamed Vendor'}</h4>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mt-1">
                    {isInventoryMode ? 'Enterprise Logistics Channel' : 'Sourcing Path Approved'}
                   </p>
                </div>

                <div className="space-y-1 p-5 rounded-2xl bg-background/40 border border-border/20 shadow-sm">
                  <span className="text-[10px] font-black uppercase text-muted-foreground/30 tracking-[0.2em]">
                    {isInventoryMode ? 'Internal Transfer Value' : 'Aggregate Quote'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-foreground tracking-tighter">
                      ${(quote.grandTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    {quote.vatPercent > 0 && (
                      <span className="text-[10px] font-black text-primary/40 uppercase">Inc. {quote.vatPercent}% VAT</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 py-6 border-y border-border/20">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/30 flex items-center gap-2 tracking-[0.2em]">
                      <Clock size={12} className="text-primary/40" strokeWidth={2.5} /> Hub Dispatch
                    </span>
                    <span className="text-sm font-bold text-foreground">Immediate (24hrs)</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/30 flex items-center gap-2 tracking-[0.2em]">
                      <ShieldCheck size={12} className="text-primary/40" strokeWidth={2.5} /> Fulfillment
                    </span>
                    <span className="text-sm font-bold text-foreground">Direct Stock</span>
                  </div>
                </div>

                <Button 
                   variant={isSelected ? "default" : "outline"}
                   className={cn(
                     "w-full h-11 rounded-xl transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-lg",
                     isSelected ? "shadow-primary/20 bg-primary" : "border-border shadow-none"
                   )}
                >
                   {isInventoryMode ? "STOCK COMMITTED" : (isSelected ? "PROPOSAL NOMINATED" : "SELECT RECOMMENDATION")}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {!isInventoryMode && (
        <Card className="rounded-2xl border-border/40 shadow-2xl shadow-black/[0.04] bg-background/60 overflow-hidden backdrop-blur-md">
           <div className="p-8 border-b border-border/30 bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Award size={22} strokeWidth={2.5} />
                 </div>
                 <div>
                    <h3 className="text-base font-black text-foreground uppercase tracking-tight">Line-Item Cost Matrix</h3>
                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Transparent comparison of unit pricing and extended totals</p>
                 </div>
              </div>
              <div className="flex items-center gap-6">
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-wider">Analysis Status</span>
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-2">
                       <AlertCircle size={12} fill="currentColor" className="text-emerald-500/20" /> Compliant
                    </span>
                 </div>
              </div>
           </div>
           <CardContent className="p-0">
              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead>
                       <tr className="h-12 bg-muted/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 border-b border-border/40">
                          <th className="text-left px-8 min-w-[200px]">Technical Requirement</th>
                          <th className="text-center px-4 w-20">Qty</th>
                          {quotes.map(q => (
                             <th key={q.id} className={cn(
                               "text-right px-8 w-48 border-l border-border/20",
                               selectedQuoteId === q.id ? "bg-primary/5 text-primary" : ""
                             )}>
                                {q.supplierName || 'Vendor'} ($/Unit)
                             </th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                       {quotes[0]?.lineItems.map((item, idx) => (
                          <tr key={item.rfqItemId} className="h-16 hover:bg-muted/10 transition-colors">
                             <td className="px-8 flex flex-col justify-center h-full">
                                <span className="text-xs font-black text-foreground uppercase tracking-tight">{item.name}</span>
                                <span className="text-[9px] font-mono font-bold text-muted-foreground/40">REF: {item.rfqItemId.slice(0, 8)}</span>
                             </td>
                             <td className="px-4 text-center">
                                <span className="text-xs font-bold font-mono text-muted-foreground/60">{item.quantity}</span>
                             </td>
                             {quotes.map(q => {
                                const qItem = q.lineItems[idx];
                                const isMin = quotes.every(otherQ => (otherQ.lineItems[idx].unitPrice >= qItem.unitPrice) || otherQ.lineItems[idx].unitPrice === 0);
                                return (
                                   <td key={q.id} className={cn(
                                     "px-8 text-right border-l border-border/10",
                                     selectedQuoteId === q.id ? "bg-primary/[0.02]" : ""
                                   )}>
                                      <div className="flex flex-col items-end">
                                         <span className={cn(
                                           "font-mono font-black text-sm",
                                           isMin && qItem.unitPrice > 0 ? "text-emerald-500" : "text-foreground"
                                         )}>
                                            ${qItem.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                         </span>
                                         <span className="text-[10px] font-mono font-bold text-muted-foreground/30 italic">
                                            Σ: ${qItem.total.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                         </span>
                                      </div>
                                   </td>
                                );
                             })}
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </CardContent>
        </Card>
      )}

      {/* Decision Guidance Footer */}
      <div className={cn(
        "flex flex-col lg:flex-row items-center justify-between p-10 backdrop-blur-md rounded-2xl border gap-8 shadow-2xl relative overflow-hidden",
        isInventoryMode ? "bg-blue-500/[0.03] border-blue-500/20 shadow-blue-500/[0.05]" : "bg-primary/[0.03] border-primary/20 shadow-primary/[0.05]"
      )}>
         <div className="absolute -bottom-10 -left-10 opacity-[0.02] pointer-events-none rotate-12">
            {isInventoryMode ? <Warehouse size={200} className="text-blue-600" /> : <Info size={200} className="text-primary" />}
         </div>
        
         <div className="flex items-start gap-6 relative z-10">
            <div className={cn(
              "p-4 rounded-2xl border shadow-inner",
              isInventoryMode ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-primary/10 text-primary border-primary/20"
            )}>
               {isInventoryMode ? <Warehouse size={28} strokeWidth={2.5} /> : <Info size={28} strokeWidth={2.5} />}
            </div>
            <div>
               <h4 className={cn(
                 "text-xs font-black uppercase tracking-[0.2em] mb-2",
                 isInventoryMode ? "text-blue-600" : "text-primary"
               )}>
                {isInventoryMode ? 'Internal Stock Reservation Notice' : 'Final Procurement Governance Notice'}
               </h4>
               <p className="text-xs leading-relaxed font-bold text-muted-foreground/70 max-w-2xl uppercase tracking-wider">
                  {isInventoryMode 
                    ? "By finalizing, you are confirming the reservation of internal stock assets for this project. This action bypasses external procurement and commits the inventory for dispatch in the next logistics phase."
                    : "By clicking finalize, you are endorsing this technical evaluation and the selected sub-supplier. This action will initiate the Purchase Order (PO) sequence and lock the negotiated sourcing costs."
                  }
               </p>
            </div>
         </div>
         <Button 
            size="lg" 
            disabled={!selectedQuoteId} 
            onClick={handleConfirm}
            className={cn(
              "h-14 px-12 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.03] active:scale-95 group relative z-10 overflow-hidden",
              isInventoryMode ? "bg-blue-600 text-white shadow-blue-600/40" : "bg-primary text-primary-foreground shadow-primary/40"
            )}
         >
            {isInventoryMode ? 'Confirm Stock Allocation' : 'Finalize Strategic Selection'}
            <ChevronRight size={20} className="ml-4 group-hover:translate-x-2 transition-transform h-full" />
         </Button>
      </div>
    </div>
  );
}
