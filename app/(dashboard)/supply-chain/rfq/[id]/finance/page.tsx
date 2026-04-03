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
    <div className="w-full space-y-12 pb-48 px-2 max-w-[1440px] animate-in fade-in duration-1000">
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Finance Affirmation Hub" 
          description="Final commercial settlement and three-way matching. Verify the project ledger and authorize final project closure." 
        />
        <div className="bg-muted/10 rounded-[2.5rem] p-4 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.FINANCE} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
         <div className="lg:col-span-3 space-y-12">
            {/* The Settlement Voucher (A4 Frame) */}
            <div className="bg-background border border-border/40 shadow-[0_45px_120px_-25px_rgba(0,0,0,0.15)] rounded-[4rem] overflow-hidden p-16 md:p-24 relative animate-in slide-in-from-bottom-8 duration-700">
               
               {status === 'closed' && (
                  <div className="absolute top-24 right-24 z-20 animate-in zoom-in-50 duration-700">
                     <div className="w-56 h-56 border-8 border-rose-500 rounded-full flex flex-col items-center justify-center text-rose-600 font-black uppercase text-2xl leading-none rotate-[-25deg] opacity-60">
                        <span>Project Closed</span>
                        <span className="text-[10px] mt-1 tracking-widest italic opacity-50">Archive Ref: INBI-{id}</span>
                     </div>
                  </div>
               )}

               {/* Document Header */}
               <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24 border-b border-border/40 pb-16">
                  <div className="space-y-6">
                     <div className="w-24 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl italic tracking-tighter">INBI</div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">From Registry:</p>
                        <h4 className="text-sm font-black text-foreground uppercase tracking-tight">Commercial Settlement Voucher</h4>
                        <p className="text-[10px] text-muted-foreground uppercase opacity-50 tracking-widest italic">Node 9.4 Final Reconciliation</p>
                     </div>
                  </div>
                  <div className="text-right space-y-4">
                     <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none italic">Ledger Affirmation</h2>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Reconciliation Ref:</p>
                        <p className="text-xl font-black text-primary font-mono tracking-tighter uppercase">{id}</p>
                        <p className="text-[10px] font-bold text-muted-foreground opacity-50 uppercase tracking-widest">Closed: April 03, 2026</p>
                     </div>
                  </div>
               </div>

               {/* Three-Way Match Integration Matrix */}
               <div className="mb-24 space-y-8">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 bg-primary rounded-full" />
                     <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">1. Commercial Three-Way Alignment</h3>
                  </div>
                  <div className="overflow-hidden rounded-3xl border border-border/40">
                     <table className="w-full">
                        <thead>
                           <tr className="bg-muted/30 h-16 border-b border-border/50">
                              <th className="text-left px-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Product Node</th>
                              <th className="text-center px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-32">PO Qty</th>
                              <th className="text-center px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-32">GRN Qty</th>
                              <th className="text-right px-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-48">Audit Status</th>
                           </tr>
                        </thead>
                        <tbody>
                           {matchData.map((row, idx) => (
                              <tr key={idx} className="h-20 border-b border-border/20 last:border-0 hover:bg-primary/[0.01] transition-colors">
                                 <td className="px-10">
                                    <div className="space-y-1">
                                       <p className="text-xs font-black text-foreground uppercase truncate max-w-[250px]">{row.item}</p>
                                       <p className="text-[8px] font-black text-muted-foreground/30 font-mono tracking-widest opacity-50 italic">NODE: {id}-0{idx}</p>
                                    </div>
                                 </td>
                                 <td className="text-center">
                                    <span className="font-bold text-xs text-muted-foreground/60 italic">{row.poQty}</span>
                                 </td>
                                 <td className="text-center">
                                    <span className={cn(
                                       "font-black text-xs",
                                       row.grnQty === row.poQty ? "text-foreground" : "text-amber-600"
                                    )}>{row.grnQty}</span>
                                 </td>
                                 <td className="px-10 text-right">
                                    <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                       <CheckCircle2 size={12} />
                                       <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Commercial Match</span>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Realized Profitability Matrix */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-end">
                  <div className="space-y-12">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">2. Realized Profitability Post-Mortem</h3>
                     </div>
                     <div className="grid grid-cols-2 gap-8">
                        <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/20 space-y-2 group transition-all hover:bg-primary/10">
                           <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">Gross Profit (GP)</p>
                           <p className="text-3xl font-black text-foreground tracking-tighter italic leading-none">${grossProfit.toLocaleString()}</p>
                           <TrendingUp className="text-emerald-500/40 group-hover:text-emerald-500 transition-colors" size={20} />
                        </div>
                        <div className="p-8 bg-muted/10 rounded-[2.5rem] border border-border/40 space-y-2 group transition-all hover:border-emerald-500/20">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Realized Margin</p>
                           <p className="text-3xl font-black text-foreground tracking-tighter italic leading-none">{margin.toFixed(1)}%</p>
                           <Scale className="text-primary/20 group-hover:text-primary transition-colors" size={20} />
                        </div>
                     </div>
                  </div>

                  <div className="p-12 bg-background border border-border/40 rounded-[3rem] shadow-xl relative overflow-hidden flex flex-col justify-between h-full min-h-[220px]">
                     <div className="flex items-center justify-between mb-8">
                        <DollarSign size={40} className="text-primary/20" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">+2.4% Strategy Drift</span>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Total Project Revenue Lifecycle</p>
                        <p className="text-5xl font-black text-foreground tracking-tighter italic leading-tight">${totalRevenue.toLocaleString()}</p>
                     </div>
                  </div>
               </div>

               {/* Commercial Seal & Final Footnotes */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-24 pt-16 border-t-2 border-dashed border-border/50 items-end">
                  <div className="space-y-8">
                     <div className="flex items-center gap-3">
                        <ShieldCheck size={24} className="text-primary" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary leading-tight">Registry Persistence Guard</h4>
                     </div>
                     <p className="text-[10px] text-muted-foreground/60 leading-relaxed italic max-w-sm">
                        "The commercial affirmation confirms that physical intake has been matched against the authorized quotation, and all vendor payments are cleared for ledger release."
                     </p>
                  </div>

                  <div className="space-y-8">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center italic">Commercial Finalizer Affirmation</p>
                     <div className="p-10 border-2 border-dashed border-border/40 rounded-[3rem] bg-muted/5 flex flex-col items-center justify-center gap-6 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {invoiceReady ? (
                           <div className="flex flex-col items-center gap-4 animate-in zoom-in-95">
                              <CheckCircle className="text-emerald-500" size={56} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Settlement Voucher Active</span>
                           </div>
                        ) : (
                           <>
                              <History className="text-muted-foreground/20 group-hover:scale-110 transition-all" size={48} />
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 text-center leading-relaxed">Prepare settlement to <br/> enable final lifecycle closure.</p>
                           </>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Actions */}
         <div className="space-y-8 sticky top-12 animate-in slide-in-from-right-8 duration-700">
            <Card className="border-primary/20 bg-primary/[0.01] rounded-[2.5rem] shadow-2xl overflow-hidden">
               <div className="p-8 bg-primary/5 border-b border-primary/10">
                  <h4 className="text-lg font-black text-foreground tracking-tight">Ledger Controls</h4>
               </div>
               <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                     <Button 
                        onClick={handleGenerateInvoice}
                        disabled={isGeneratingInvoice || invoiceReady}
                        variant={invoiceReady ? "outline" : "default"}
                        className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl group border-primary/20"
                     >
                        {invoiceReady ? <><CheckCircle size={16} className="mr-2 text-emerald-500" /> Settlement Ready</> : isGeneratingInvoice ? <Loader2 className="animate-spin" /> : 'Generate Final Settlement'}
                     </Button>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="space-y-8">
                     <div className="p-8 bg-muted border border-border/50 rounded-[2.5rem] flex flex-col gap-6 text-center shadow-inner">
                        <AlertCircle size={32} className="mx-auto text-primary/40" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 leading-relaxed italic">
                           Closing the project will lock all commercial entries and remove the node from active supply-chain sourcing.
                        </p>
                     </div>

                     <Button 
                        onClick={handleProjectClosure}
                        disabled={isFinalizing || !invoiceReady || status === 'closed'}
                        className="w-full h-24 rounded-[3rem] bg-foreground text-background font-black text-lg uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 group shadow-[0_5px_40px_rgba(0,0,0,0.5)] disabled:opacity-20"
                     >
                        {isFinalizing ? <Loader2 className="animate-spin" size={32} /> : (
                           <div className="flex flex-col items-center">
                              <span className="text-[10px] mb-1 opacity-60">Lifecycle End</span>
                              <span className="flex items-center gap-4 italic font-black">Lock Registry <Separator orientation="vertical" className="h-6 bg-white/20" /> <ShieldCheck size={24} /></span>
                           </div>
                        )}
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl border border-border/40 hover:bg-muted text-muted-foreground/30"><Printer size={20} /></Button>
              <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl border border-border/40 hover:bg-muted text-muted-foreground/30"><Download size={20} /></Button>
           </div>
         </div>
      </div>
    </div>
  );
}
