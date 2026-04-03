'use client';

import React, { useEffect, useState, use } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  CheckCircle2, 
  CreditCard, 
  DollarSign, 
  FileText, 
  History, 
  Loader2, 
  PieChart, 
  ShieldCheck, 
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Scale,
  Receipt,
  CheckCircle,
  Printer,
  Download,
  AlertCircle,
  ArrowLeft,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

interface MatchRow {
  item: string;
  poQty: number;
  grnQty: number;
  unitPrice: number;
  invoiceQty: number;
  status: 'match' | 'variance';
}

export default function FinancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const router = useRouter();
  
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [invoiceReady, setInvoiceReady] = useState(false);
  const [status, setStatus] = useState<'open' | 'closed'>('open');

  const matchData: MatchRow[] = [
    { item: 'Structural Steel I-Beam (HEB 300)', poQty: 45, grnQty: 45, unitPrice: 85, invoiceQty: 45, status: 'match' },
    { item: 'Steel Plate 10mm - Grade A', poQty: 120, grnQty: 118, unitPrice: 42, invoiceQty: 118, status: 'match' },
    { item: 'High-Tensile Anchor Bolts (M24)', poQty: 500, grnQty: 500, unitPrice: 2.5, invoiceQty: 500, status: 'match' },
  ];

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: id, href: `/supply-chain/rfq/${id}` },
      { label: 'Finance Affirmation' },
    ]);
  }, [setActivePortal, setBreadcrumbs, id]);

  const handleGenerateInvoice = () => {
    setIsGeneratingInvoice(true);
    setTimeout(() => {
       setIsGeneratingInvoice(false);
       setInvoiceReady(true);
       toast.success('Commercial Settlement Generated: Ready for Dispatch');
    }, 1500);
  };

  const handleProjectClosure = () => {
    setIsFinalizing(true);
    setTimeout(() => {
       setStatus('closed');
       setIsFinalizing(false);
       toast.success('Project Lifecycle Closed: Final Registry Lock Active');
    }, 2500);
  };

  const totalCost = 5287.50;
  const totalRevenue = 6611.80;
  const grossProfit = totalRevenue - totalCost;
  const margin = (grossProfit / totalRevenue) * 100;

  return (
    <div className="w-full space-y-8 pb-32 px-4 md:px-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4">
        <PageHeader 
          title="Finance Affirmation Hub" 
          description="Final commercial settlement and three-way matching. Verify the project ledger and authorize final project closure." 
        />
        <div className="bg-muted/10 rounded-xl p-2 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.FINANCE} />
        </div>
      </div>

      <div className="space-y-8">
         {/* The Settlement Voucher (A4 Frame) */}
         <div className="bg-background border border-border/40 shadow-xl rounded-2xl overflow-hidden p-12 md:p-16 relative animate-in slide-in-from-bottom-8 duration-700">
            
            {status === 'closed' && (
               <div className="absolute top-16 right-16 z-20 animate-in zoom-in-50 duration-700">
                  <div className="w-40 h-40 border-4 border-rose-500 rounded-full flex flex-col items-center justify-center text-rose-600 font-bold uppercase text-lg leading-none rotate-[-25deg] opacity-60">
                     <span>Project Closed</span>
                     <span className="text-[8px] mt-1 tracking-widest italic opacity-50">Archive Ref: INBI-{id}</span>
                  </div>
               </div>
            )}

            {/* Document Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16 border-b border-border/40 pb-8">
               <div className="space-y-4">
                  <div className="w-20 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg italic tracking-tighter">INBI</div>
                  <div className="space-y-0.5">
                     <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">From Registry:</p>
                     <h4 className="text-sm font-bold text-foreground uppercase tracking-tight">Commercial Settlement Voucher</h4>
                     <p className="text-[9px] text-muted-foreground uppercase opacity-50 tracking-wider italic">Node 9.4 Final Reconciliation</p>
                  </div>
               </div>
               <div className="text-right space-y-2">
                  <h2 className="text-3xl font-bold text-foreground tracking-tighter uppercase leading-none italic">Ledger Affirmation</h2>
                  <div className="space-y-0.5">
                     <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">Reconciliation Ref:</p>
                     <p className="text-lg font-bold text-primary font-mono tracking-tighter uppercase">{id}</p>
                     <p className="text-[9px] font-bold text-muted-foreground opacity-50 uppercase tracking-widest italic">Closed: April 03, 2026</p>
                  </div>
               </div>
            </div>

            {/* Three-Way Match Integration Matrix */}
            <div className="mb-16 space-y-4">
               <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/70">1. Commercial Three-Way Alignment</h3>
               </div>
               <div className="overflow-hidden rounded-xl border border-border/40">
                  <table className="w-full">
                     <thead>
                        <tr className="bg-muted/30 h-12 border-b border-border/50">
                           <th className="text-left px-8 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Product Node</th>
                           <th className="text-center px-4 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 w-32">PO Qty</th>
                           <th className="text-center px-4 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 w-32">GRN Qty</th>
                           <th className="text-right px-8 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 w-48">Audit Status</th>
                        </tr>
                     </thead>
                     <tbody>
                        {matchData.map((row, idx) => (
                           <tr key={idx} className="h-16 border-b border-border/20 last:border-0 hover:bg-primary/[0.01] transition-colors">
                              <td className="px-8">
                                 <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-foreground uppercase truncate max-w-[250px]">{row.item}</p>
                                    <p className="text-[8px] font-bold text-muted-foreground/30 font-mono tracking-widest opacity-50 italic">NODE: {id}-0{idx}</p>
                                 </div>
                              </td>
                              <td className="text-center">
                                 <span className="font-bold text-xs text-muted-foreground/60 italic">{row.poQty}</span>
                              </td>
                              <td className="text-center">
                                 <span className={cn(
                                    "font-bold text-xs",
                                    row.grnQty === row.poQty ? "text-foreground" : "text-amber-600"
                                 )}>{row.grnQty}</span>
                              </td>
                              <td className="px-8 text-right">
                                 <div className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                                    <CheckCircle2 size={10} />
                                    <span className="text-[8px] font-bold uppercase tracking-wider whitespace-nowrap">Commercial Match</span>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Realized Profitability Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-end">
               <div className="space-y-8">
                  <div className="flex items-center gap-2">
                     <div className="w-1 h-4 bg-primary rounded-full" />
                     <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/70">2. Realized Profitability Post-Mortem</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-6 bg-primary/5 rounded-xl border border-primary/20 space-y-2 group transition-all hover:bg-primary/10">
                        <p className="text-[8px] font-bold uppercase tracking-wider text-primary/60">Gross Profit (GP)</p>
                        <p className="text-2xl font-bold text-foreground tracking-tighter italic leading-none">${grossProfit.toLocaleString()}</p>
                        <TrendingUp className="text-emerald-500/40 group-hover:text-emerald-500 transition-colors" size={16} />
                     </div>
                     <div className="p-6 bg-muted/10 rounded-xl border border-border/40 space-y-2 group transition-all hover:border-emerald-500/20">
                        <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/60">Realized Margin</p>
                        <p className="text-2xl font-bold text-foreground tracking-tighter italic leading-none">{margin.toFixed(1)}%</p>
                        <Scale className="text-primary/20 group-hover:text-primary transition-colors" size={16} />
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-background border border-border/40 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between h-full min-h-[160px]">
                  <div className="flex items-center justify-between mb-4">
                     <DollarSign size={32} className="text-primary/20" />
                     <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">+2.4% Strategy Drift</span>
                  </div>
                  <div>
                     <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">Total Project Revenue Lifecycle</p>
                     <p className="text-4xl font-bold text-foreground tracking-tighter italic leading-tight">${totalRevenue.toLocaleString()}</p>
                  </div>
               </div>
            </div>

            {/* Commercial Seal & Final Footnotes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t border-border/40 items-end">
               <div className="space-y-6">
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={18} className="text-primary" />
                     <h4 className="text-[9px] font-bold uppercase tracking-wider text-primary leading-tight">Registry Persistence Guard</h4>
                  </div>
                  <p className="text-[9px] text-muted-foreground/60 leading-relaxed italic max-w-sm border-l-2 border-primary/20 pl-4">
                     All commercial affirmation confirms physical intake matches authorized quotation. Ledger release authorized.
                  </p>
               </div>

               <div className="space-y-6">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40 text-center italic">Commercial Finalizer Affirmation</p>
                  <div className="p-8 border-2 border-dashed border-border/40 rounded-xl bg-muted/5 flex flex-col items-center justify-center gap-4 relative group overflow-hidden h-32">
                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     {invoiceReady ? (
                        <div className="flex flex-col items-center gap-3 animate-in zoom-in-95">
                           <CheckCircle className="text-emerald-500" size={40} />
                           <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Settlement Voucher Active</span>
                        </div>
                     ) : (
                        <>
                           <History className="text-muted-foreground/20 group-hover:scale-110 transition-all" size={32} />
                           <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40 text-center leading-relaxed">Prepare settlement to <br/> enable final lifecycle closure.</p>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-500">
         <div className="bg-background/80 backdrop-blur-2xl border-2 border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] rounded-3xl p-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 px-4">
            <div className="hidden md:block">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Gross Profit</p>
              <p className="text-sm font-black text-emerald-600 tracking-tighter">${grossProfit.toLocaleString()} ({margin.toFixed(1)}%)</p>
            </div>
            <Separator orientation="vertical" className="h-8 hidden md:block bg-border/40" />
            <div>
              <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1">Settlement Status</p>
              <p className={cn("text-sm font-black tracking-tighter italic uppercase", invoiceReady ? "text-emerald-600" : "text-amber-600")}>
                {invoiceReady ? 'Authorized' : 'Pending'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-11 rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-all">
              <Printer size={16} className="mr-2" /> Print Voucher
            </Button>
            {!invoiceReady ? (
              <Button 
                onClick={handleGenerateInvoice}
                disabled={isGeneratingInvoice}
                size="sm"
                className="h-11 rounded-xl px-10 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-all border border-primary shadow-xl shadow-primary/20"
              >
                {isGeneratingInvoice ? <Loader2 className="animate-spin mr-2" size={16} /> : 'Generate Settlement'}
              </Button>
            ) : (status === 'open' && (
              <Button 
                onClick={handleProjectClosure}
                disabled={isFinalizing}
                size="sm"
                className="h-11 rounded-xl px-10 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-all shadow-xl"
              >
                {isFinalizing ? <Loader2 className="animate-spin mr-2" size={16} /> : (
                  <span className="flex items-center gap-2 italic">Lock Registry <ShieldCheck size={16} /></span>
                )}
              </Button>
            ))}
            {status === 'closed' && (
              <div className="px-6 py-2 rounded-2xl bg-muted/30 border border-border/40">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Lifecycle Locked</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}
