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
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SupplierProposal } from './quote-entry-form';

interface QuoteComparisonProps {
  quotes: SupplierProposal[];
  onSelect: (quote: SupplierProposal) => void;
  onBack?: () => void;
}

export function QuoteComparison({ quotes, onSelect, onBack }: QuoteComparisonProps) {
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  // AI-Powered Analytics: Calculate Best Price and Fastest Lead Time
  const analytics = useMemo(() => {
    if (quotes.length === 0) return { bestPriceId: null, fastestId: null };

    let minPrice = Infinity;
    let minPriceId = null;
    let minDays = Infinity;
    let minDaysId = null;

    quotes.forEach(q => {
      // Comparison based on grandTotal
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

  const handleSelect = (quote: SupplierProposal) => {
    setSelectedQuoteId(quote.id);
  };

  const handleConfirm = () => {
    const selected = quotes.find(q => q.id === selectedQuoteId);
    if (selected) onSelect(selected);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-600 p-2 rounded-xl">
               <TrendingDown size={20} />
            </div>
            <div>
               <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Economic Analysis Active</h3>
               <p className="text-[10px] font-medium text-muted-foreground uppercase opacity-60">AI is highlighting optimal vendor paths</p>
            </div>
         </div>
         {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="text-[10px] font-black uppercase tracking-widest hover:bg-muted">
               ← Re-enter Details
            </Button>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {quotes.map((quote, index) => {
          const isBestPrice = analytics.bestPriceId === quote.id;
          const isFastest = analytics.fastestId === quote.id;

          return (
            <Card 
              key={quote.id} 
              className={cn(
                "relative transition-all duration-500 border-2 cursor-pointer overflow-hidden group",
                selectedQuoteId === quote.id 
                  ? "border-primary bg-primary/[0.02] shadow-xl scale-[1.02]" 
                  : "border-border/40 hover:border-primary/20 hover:shadow-lg backdrop-blur-sm bg-background/50"
              )}
              onClick={() => handleSelect(quote)}
            >
              {isBestPrice && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-emerald-600 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl flex items-center gap-1.5 uppercase tracking-[0.1em] shadow-sm">
                    <TrendingDown size={12} strokeWidth={3} /> BEST PRICE
                  </div>
                </div>
              )}
              {isFastest && !isBestPrice && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl flex items-center gap-1.5 uppercase tracking-[0.1em] shadow-sm">
                    <Clock size={12} strokeWidth={3} /> FASTEST
                  </div>
                </div>
              )}

              <CardHeader className="pt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center text-[10px] font-black text-muted-foreground/60 border border-border/50">
                    Q{index + 1}
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-black">{quote.reliability?.toFixed(1) || '4.5'}</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{quote.supplierName || 'Unnamed Vendor'}</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                   Verified Hardware Vendor
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex flex-col gap-1 p-4 rounded-2xl bg-muted/30 border border-border/20">
                  <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.15em]">Total Quoted cost</span>
                  <span className="text-3xl font-black text-foreground">
                    ${(quote.grandTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-border/30">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/50 flex items-center gap-1.5 tracking-widest">
                      <Clock size={12} className="text-primary/50" /> Lead Time
                    </span>
                    <span className="text-sm font-black">{quote.deliveryDays} Business Days</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/50 flex items-center gap-1.5 tracking-widest">
                      <ShieldCheck size={12} className="text-primary/50" /> Warranty
                    </span>
                    <span className="text-sm font-black">{quote.warranty}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                   <div className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground/70">
                      <Check size={16} className="text-emerald-500" strokeWidth={3} />
                      <span className="uppercase tracking-widest">Inc. Shipping & Insurance</span>
                   </div>
                   <div className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground/70">
                      <Check size={16} className="text-emerald-500" strokeWidth={3} />
                      <span className="uppercase tracking-widest">Quality Certified Materials</span>
                   </div>
                </div>

                <Button 
                  variant={selectedQuoteId === quote.id ? "default" : "outline"}
                  className={cn(
                    "w-full h-12 rounded-xl transition-all font-black text-[10px] uppercase tracking-[0.2em]",
                    selectedQuoteId === quote.id 
                      ? "shadow-lg shadow-primary/20" 
                      : "border-border hover:border-primary/30 hover:bg-primary/[0.03]"
                  )}
                >
                  {selectedQuoteId === quote.id ? "PROPOSAL SELECTED" : "SELECT VENDOR"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Decision Guidance Footer */}
      <div className="flex flex-col lg:flex-row items-center justify-between p-8 bg-muted/20 backdrop-blur-sm rounded-[2rem] border border-border/50 gap-8">
        <div className="flex items-start gap-4">
          <div className="bg-blue-600/10 p-3 rounded-2xl">
            <Info className="text-blue-600" size={24} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-1">Procurement Governance Notice</h4>
            <p className="text-[10px] leading-relaxed font-medium text-muted-foreground/80 max-w-xl uppercase tracking-wider">
              Ensure you have reviewed the technical specifications for each vendor before making a final selection. This decision will lock the procurement costs and initiate the Purchase Order (PO) generation workflow.
            </p>
          </div>
        </div>
        <Button 
          size="lg" 
          disabled={!selectedQuoteId} 
          onClick={handleConfirm}
          className="h-14 px-10 rounded-2xl shadow-2xl shadow-primary/30 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 group"
        >
          Finalize Selection 
          <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
