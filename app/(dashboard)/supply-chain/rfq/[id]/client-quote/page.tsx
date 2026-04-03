'use client';

import React, { useEffect, useState, use } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  Mail,
  MoreVertical,
  Download,
  Send,
  Loader2,
  RefreshCcw,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Building,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UpliftItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  supplierCost: number;
  upliftPercent: number;
  upliftAmount: number;
  clientPrice: number;
  totalAmount: number;
}

export default function ClientQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const router = useRouter();
  
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [globalMarkup, setGlobalMarkup] = useState(25);
  const [status, setStatus] = useState<'draft' | 'authorized'>('draft');

  // Document Mock Data
  const [clientDetails, setClientDetails] = useState({
    rfqNumber: id,
    title: 'Dubai Metro Expansion - Phase 4 Structural Steel',
    client: 'Road & Transport Authority',
    clientEmail: 'procurement@rta.ae',
    address: 'Deira, Near Metro Stn, Dubai, UAE',
    priority: 'high',
    dueDate: '2026-04-12',
    notes: 'Uplifted pricing based on premium Grade A steel availability and accelerated shipping.'
  });

  const [items, setItems] = useState<UpliftItem[]>([
    { id: '1', name: 'Structural Steel I-Beam (HEB 300)', quantity: 45, unit: 'pcs', supplierCost: 45.50, upliftPercent: 25, upliftAmount: 11.38, clientPrice: 56.88, totalAmount: 2559.60 },
    { id: '2', name: 'Steel Plate 10mm - Grade A', quantity: 120, unit: 'pcs', supplierCost: 18.25, upliftPercent: 25, upliftAmount: 4.56, clientPrice: 22.81, totalAmount: 2737.20 },
    { id: '3', name: 'High-Tensile Anchor Bolts (M24)', quantity: 500, unit: 'pcs', supplierCost: 2.10, upliftPercent: 25, upliftAmount: 0.53, clientPrice: 2.63, totalAmount: 1315.00 },
  ]);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: id, href: `/supply-chain/rfq/${id}` },
      { label: 'Strategic Client Quoting' },
    ]);
  }, [setActivePortal, setBreadcrumbs, id]);

  const updateItemUplift = (itemId: string, percent: number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const upliftAmount = (item.supplierCost * percent) / 100;
        const clientPrice = item.supplierCost + upliftAmount;
        return {
          ...item,
          upliftPercent: percent,
          upliftAmount,
          clientPrice,
          totalAmount: clientPrice * item.quantity
        };
      }
      return item;
    }));
  };

  const applyGlobalMarkup = () => {
    setItems(items.map(item => {
      const upliftAmount = (item.supplierCost * globalMarkup) / 100;
      const clientPrice = item.supplierCost + upliftAmount;
      return {
        ...item,
        upliftPercent: globalMarkup,
        upliftAmount,
        clientPrice,
        totalAmount: clientPrice * item.quantity
      };
    }));
    toast.success(`Global ${globalMarkup}% markup applied to all items`);
  };

  const totals = items.reduce((acc, item) => ({
    supplierTotal: acc.supplierTotal + (item.supplierCost * item.quantity),
    clientTotal: acc.clientTotal + item.totalAmount,
    totalProfit: acc.totalProfit + (item.upliftAmount * item.quantity),
  }), { supplierTotal: 0, clientTotal: 0, totalProfit: 0 });

  const handleAuthorize = () => {
    setIsFinalizing(true);
    setTimeout(() => {
       setStatus('authorized');
       setIsFinalizing(false);
       toast.success('Strategic Quotation Authorized & Locked');
    }, 1500);
  };

  const handleCommitAndSend = () => {
    setIsFinalizing(true);
    setTimeout(() => {
       toast.success('Quote Dispatched: Moving to Step 5 (Client PO)');
       router.push(`/supply-chain/rfq/${id}/client-po`);
    }, 2000);
  };

  return (
    <div className="w-full space-y-12 pb-48 px-2 max-w-[1440px] animate-in fade-in duration-1000">
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Strategic Client Quoting" 
          description="Refine your commercial proposal by applying profit margins and finalizing terms for the end client." 
        />
        <div className="bg-muted/10 rounded-[2.5rem] p-4 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.CLIENT_QUOTE} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
         <div className="lg:col-span-3 space-y-12">
            {/* Strategy Control Deck */}
            <section className="bg-primary/[0.03] border border-primary/20 rounded-[3rem] p-10 backdrop-blur-sm shadow-xl shadow-primary/[0.02] flex flex-col lg:flex-row items-center justify-between gap-12">
               <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-[2.2rem] flex items-center justify-center text-primary shadow-2xl shadow-primary/20 transition-all hover:scale-110">
                     <TrendingUp size={36} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-foreground tracking-tight">Active Uplift Strategy</h3>
                     <p className="text-[11px] font-black uppercase text-primary tracking-[0.2em] mt-1 italic">Real-time Margin Optimization Active</p>
                  </div>
               </div>

               <div className="flex flex-wrap items-center gap-8 bg-background/50 p-6 rounded-[2.5rem] border border-border/50 shadow-inner">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Base Cost</p>
                     <p className="text-xl font-black text-foreground">${totals.supplierTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="h-12 w-px bg-border/50" />
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Global Markup</p>
                     <div className="flex items-center gap-3">
                        <Input 
                           type="number"
                           value={globalMarkup}
                           onChange={(e) => setGlobalMarkup(parseFloat(e.target.value) || 0)}
                           className="h-10 w-20 px-3 font-black text-sm border-transparent bg-primary/5 focus:bg-background transition-all"
                        />
                        <Button onClick={applyGlobalMarkup} size="sm" className="h-10 rounded-xl px-4 font-black uppercase tracking-widest text-[10px]">Apply</Button>
                     </div>
                  </div>
                  <div className="h-12 w-px bg-border/50" />
                  <div className="space-y-1 text-right">
                     <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Net Profit</p>
                     <p className="text-xl font-black text-emerald-600">+${totals.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
               </div>
            </section>

            {/* The Quotation Document (A4 Frame) */}
            <div className="bg-background border border-border/40 shadow-[0_45px_120px_-25px_rgba(0,0,0,0.15)] rounded-[4rem] overflow-hidden p-16 md:p-24 relative animate-in slide-in-from-bottom-8 duration-700">
               {/* Document Watermark Seal */}
               <div className="absolute top-24 right-24 rotate-12 opacity-5 pointer-events-none">
                  <FileText size={250} className="text-primary" />
               </div>

               {status === 'authorized' && (
                  <div className="absolute top-12 right-12 z-20 animate-in zoom-in-50 duration-500">
                     <div className="w-44 h-44 border-8 border-emerald-500 rounded-full flex flex-col items-center justify-center text-emerald-600 font-black uppercase text-xl leading-none rotate-[-15deg] opacity-70">
                        <span>Authorized</span>
                        <span className="text-[10px] mt-1 tracking-widest">INBI-QUO-944</span>
                     </div>
                  </div>
               )}

               {/* Letterhead Header */}
               <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24 border-b border-border/40 pb-16">
                  <div className="space-y-6">
                     <div className="w-32 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-2xl italic tracking-tighter">INBI</div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">From:</p>
                        <h4 className="text-sm font-black text-foreground">INBI Technical Solutions LLC</h4>
                        <p className="text-[10px] text-muted-foreground leading-relaxed max-w-[300px]">Suite 405, Business Bay Tower,<br/>Dubai, UAE • TRN: 100994401200003</p>
                     </div>
                  </div>
                  <div className="text-right space-y-4">
                     <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase italic leading-none">Quotation</h2>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Reference Ref:</p>
                        <p className="text-xl font-black text-primary font-mono tracking-tighter uppercase">{id}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Valid Until: {clientDetails.dueDate}</p>
                     </div>
                  </div>
               </div>

               {/* Stakeholder Details */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
                  <div className="space-y-4 px-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary">To: (The Client)</p>
                     <div className="space-y-1">
                        <h4 className="text-xl font-black text-foreground uppercase tracking-tight">{clientDetails.client}</h4>
                        <p className="text-xs font-semibold text-muted-foreground">{clientDetails.address}</p>
                        <p className="text-[10px] font-black text-primary mt-4 flex items-center gap-2">
                           <Mail size={12} /> {clientDetails.clientEmail}
                        </p>
                     </div>
                  </div>
                  <div className="p-8 bg-muted/20 border border-border/50 rounded-3xl space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Opportunity Mapping</p>
                     <div className="space-y-1">
                        <h4 className="text-sm font-black text-foreground leading-snug">{clientDetails.title}</h4>
                        <div className="flex items-center gap-3 mt-4">
                           <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Grade A Priority</span>
                           <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Project ID: DXB-LT-2026</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* High-Density Matrix Table */}
               <div className="mb-24 overflow-hidden rounded-3xl border border-border/40">
                  <table className="w-full">
                     <thead>
                        <tr className="bg-muted/30 h-16 border-b border-border/50">
                           <th className="text-left px-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Product Specification</th>
                           <th className="text-center px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-32">Qty</th>
                           <th className="text-center px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-40">Uplift (%)</th>
                           <th className="text-right px-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Quoted Total</th>
                        </tr>
                     </thead>
                     <tbody>
                        {items.map((item, idx) => (
                           <tr key={item.id} className="h-24 border-b border-border/20 last:border-0 hover:bg-primary/[0.01] group transition-colors">
                              <td className="px-10">
                                 <div className="space-y-1">
                                    <p className="text-sm font-black text-foreground uppercase truncate max-w-[300px]">{item.name}</p>
                                    <p className="text-[9px] font-mono text-muted-foreground/40 group-hover:text-primary transition-colors">SKU Ref: IN-PRO-0{idx}9-L</p>
                                 </div>
                              </td>
                              <td className="text-center">
                                 <span className="font-bold text-xs text-muted-foreground">{item.quantity} {item.unit}</span>
                              </td>
                              <td className="px-4">
                                 <div className="flex items-center gap-2 justify-center">
                                    <Input 
                                       type="number"
                                       value={item.upliftPercent}
                                       disabled={status === 'authorized'}
                                       onChange={(e) => updateItemUplift(item.id, parseFloat(e.target.value) || 0)}
                                       className="h-10 w-20 text-center font-black text-xs border-transparent bg-primary/5 focus:bg-background"
                                    />
                                    <Percent size={12} className="text-primary/40" />
                                 </div>
                              </td>
                              <td className="px-10 text-right">
                                 <div className="flex flex-col items-end gap-1">
                                    <span className="text-lg font-black text-foreground italic">${item.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">GP +${(item.upliftAmount * item.quantity).toLocaleString()}</span>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Commercial Recap Footer */}
               <div className="flex flex-col md:flex-row justify-between items-end gap-16 pt-16 border-t-2 border-dashed border-border/50">
                  <div className="space-y-6 max-w-sm">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Commercial Affirmations</h4>
                     <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                        "The proposed pricing includes accelerated warehousing intake and premium batch verification for Grade S355JR structural elements."
                     </p>
                     <div className="flex items-center gap-6">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Validity Period</p>
                           <p className="text-xs font-black text-foreground">30 Calendar Days</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Incoterms</p>
                           <p className="text-xs font-black text-foreground">CIF Dubai Port</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="w-full md:w-96 space-y-6">
                     <div className="bg-muted/10 p-10 rounded-[3rem] border border-border/40 space-y-6">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                           <span>Total Document Value</span>
                           <span className="font-mono text-xs">${totals.clientTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                           <span>Authorized Quote Total</span>
                           <span className="text-4xl font-black text-foreground tracking-tighter italic leading-none">${totals.clientTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Final Action Sidebar */}
         <div className="space-y-8 sticky top-12 animate-in slide-in-from-right-8 duration-700">
            <Card className="border-primary/20 bg-primary/[0.01] rounded-[2.5rem] shadow-2xl overflow-hidden">
               <div className="p-8 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
                  <h4 className="text-lg font-black text-foreground tracking-tight">Strategy Control</h4>
                  <ShieldCheck size={20} className={cn(status === 'authorized' ? "text-emerald-500" : "text-muted-foreground/20")} />
               </div>
               <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                     <div className="flex items-center gap-4 p-4 bg-background/50 rounded-2xl border border-border/40 group hover:border-primary/30 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                           <Download size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Internal P&L Draft</span>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-background/50 rounded-2xl border border-border/40 group hover:border-blue-500/30 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-blue-500/5 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                           <Printer size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Print Review</span>
                     </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="space-y-4">
                     <Button 
                        onClick={handleAuthorize}
                        disabled={status === 'authorized' || isFinalizing}
                        variant={status === 'authorized' ? "outline" : "default"}
                        className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl group"
                     >
                        {status === 'authorized' ? <><CheckCircle2 size={16} className="mr-2 text-emerald-500" /> Authorized</> : isFinalizing ? <Loader2 className="animate-spin" /> : 'Authorize Pricing Seal'}
                     </Button>

                     <Button 
                        onClick={handleCommitAndSend}
                        disabled={status !== 'authorized' || isFinalizing}
                        className="w-full h-24 rounded-[2.5rem] bg-foreground text-background font-black text-lg uppercase tracking-[0.25em] transition-all hover:bg-foreground/90 disabled:opacity-20"
                     >
                        {isFinalizing ? <Loader2 className="animate-spin" /> : (
                           <div className="flex flex-col items-center">
                              <span className="text-[9px] mb-1 opacity-50">Global Action</span>
                              <span className="flex items-center gap-4 italic font-black">Commit & Send <ArrowRight size={24} /></span>
                           </div>
                        )}
                     </Button>
                  </div>

                  <div className="pt-4 p-6 bg-muted border border-border/50 rounded-[2rem]">
                     <div className="flex items-center gap-3 mb-4">
                        <ShieldAlert size={16} className="text-primary/40" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 leading-tight">Price Lock Affirmation Engine</span>
                     </div>
                     <p className="text-[9px] text-muted-foreground/40 uppercase tracking-widest leading-relaxed text-center">
                        Committing will generate the official Quote PDF and notify the client contact.
                     </p>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
