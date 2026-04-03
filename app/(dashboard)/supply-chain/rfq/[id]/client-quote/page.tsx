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
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  Mail,
  Download,
  Loader2,
  ShieldAlert,
  Printer,
  Truck,
  Clock,
  FileCheck
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
  const [vatPercent] = useState(5);
  const [status, setStatus] = useState<'draft' | 'authorized'>('draft');

  const clientDetails = {
    rfqNumber: id,
    title: 'Dubai Metro Expansion - Phase 4 Structural Steel',
    client: 'Road & Transport Authority',
    clientEmail: 'procurement@rta.ae',
    address: 'Deira, Near Metro Stn, Dubai, UAE',
    priority: 'high',
    dueDate: '2026-04-12',
    notes: 'Uplifted pricing based on premium Grade A steel availability and accelerated shipping.'
  };

  // Selected supplier info (from previous step)
  const selectedSupplier = {
    name: 'Al Futtaim Steel Trading LLC',
    contactPerson: 'Ahmad Al-Rashid',
    email: 'quotes@alfuttaim-steel.ae',
    deliveryDays: 14,
    warranty: '12 Months',
    paymentTerms: 'Net 30 Days',
    incoterms: 'CIF Dubai Port',
    validity: '30 Calendar Days',
    conditions: [
      'Material certificates (EN 10204 3.1) provided with each shipment',
      'Partial deliveries accepted with prior written approval',
      'Force majeure clause applies per ICC 2020 rules',
      'Price validity subject to LME steel index fluctuation ±5%',
      'Minimum order quantity applies per line item',
    ]
  };

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
      { label: 'Client Quotation' },
    ]);
  }, [setActivePortal, setBreadcrumbs, id]);

  const updateItemUplift = (itemId: string, percent: number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const upliftAmount = (item.supplierCost * percent) / 100;
        const clientPrice = item.supplierCost + upliftAmount;
        return { ...item, upliftPercent: percent, upliftAmount, clientPrice, totalAmount: clientPrice * item.quantity };
      }
      return item;
    }));
  };

  const applyGlobalMarkup = () => {
    setItems(items.map(item => {
      const upliftAmount = (item.supplierCost * globalMarkup) / 100;
      const clientPrice = item.supplierCost + upliftAmount;
      return { ...item, upliftPercent: globalMarkup, upliftAmount, clientPrice, totalAmount: clientPrice * item.quantity };
    }));
    toast.success(`Global ${globalMarkup}% markup applied to all items`);
  };

  const totals = items.reduce((acc, item) => ({
    supplierTotal: acc.supplierTotal + (item.supplierCost * item.quantity),
    clientTotal: acc.clientTotal + item.totalAmount,
    totalProfit: acc.totalProfit + (item.upliftAmount * item.quantity),
  }), { supplierTotal: 0, clientTotal: 0, totalProfit: 0 });

  const vatAmount = totals.clientTotal * (vatPercent / 100);
  const grandTotal = totals.clientTotal + vatAmount;

  const handleAuthorize = () => {
    setIsFinalizing(true);
    setTimeout(() => {
       setStatus('authorized');
       setIsFinalizing(false);
       toast.success('Quotation Authorized & Locked');
    }, 1500);
  };

  const handleCommitAndSend = () => {
    setIsFinalizing(true);
    setTimeout(() => {
       toast.success('Quote Dispatched — Moving to Client PO');
       router.push(`/supply-chain/rfq/${id}/client-po`);
    }, 2000);
  };

  return (
    <div className="w-full space-y-6 pb-20 px-4 md:px-10 animate-in fade-in duration-700">
      {/* Header & Timeline */}
      <div className="flex flex-col gap-4">
        <PageHeader 
          title="Client Quotation" 
          description="Apply profit margins, review supplier terms, and finalize the commercial proposal for the end client." 
        />
        <div className="bg-muted/10 rounded-xl p-4 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.CLIENT_QUOTE} />
        </div>
      </div>

      {/* Margin Strategy Bar */}
      <section className="bg-primary/[0.03] border border-primary/15 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-5">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
               <TrendingUp size={20} />
            </div>
            <div>
               <h3 className="text-base font-semibold text-foreground">Margin Strategy</h3>
               <p className="text-xs text-muted-foreground">Apply markup across all line items</p>
            </div>
         </div>

         <div className="flex flex-wrap items-center gap-6 bg-background/60 px-5 py-3 rounded-lg border border-border/40">
            <div className="space-y-0.5">
               <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Supplier Cost</p>
               <p className="text-base font-semibold text-foreground font-mono">${totals.supplierTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div className="space-y-0.5">
               <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Global Markup %</p>
               <div className="flex items-center gap-2">
                  <Input 
                     type="number"
                     value={globalMarkup}
                     onChange={(e) => setGlobalMarkup(parseFloat(e.target.value) || 0)}
                     className="h-8 w-16 px-2 font-semibold text-xs border-border/30 bg-background text-center"
                  />
                  <Button onClick={applyGlobalMarkup} size="sm" className="h-8 rounded-md px-3 text-xs font-semibold">Apply</Button>
               </div>
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div className="space-y-0.5 text-right">
               <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Net Profit</p>
               <p className="text-base font-semibold text-emerald-600 font-mono">+${totals.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
         </div>
      </section>

      {/* ===== Quotation Document — Full Width ===== */}
      <div className="bg-background border border-border/40 shadow-lg rounded-xl overflow-hidden p-8 relative animate-in slide-in-from-bottom-4 duration-500">
         {/* Watermark */}
         <div className="absolute top-6 right-16 rotate-12 opacity-[0.03] pointer-events-none">
            <FileText size={160} className="text-primary" />
         </div>

         {status === 'authorized' && (
            <div className="absolute top-8 right-8 z-20 animate-in zoom-in-50 duration-500">
               <div className="w-28 h-28 border-4 border-emerald-500 rounded-full flex flex-col items-center justify-center text-emerald-600 font-bold uppercase text-sm leading-none rotate-[-15deg] opacity-60">
                  <span>Authorized</span>
                  <span className="text-[9px] mt-1 tracking-wider font-mono">INBI-QUO-944</span>
               </div>
            </div>
         )}

         {/* Letterhead */}
         <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-border/30 pb-6">
            <div className="space-y-4">
               <div className="w-24 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm italic tracking-tight">INBI</div>
               <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">From:</p>
                  <h4 className="text-sm font-semibold text-foreground">INBI Technical Solutions LLC</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Suite 405, Business Bay Tower,<br/>Dubai, UAE &bull; TRN: 100994401200003</p>
               </div>
            </div>
            <div className="text-right space-y-3">
               <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">Quotation</h2>
               <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Reference:</p>
                  <p className="text-base font-semibold text-primary font-mono">{id}</p>
                  <p className="text-xs text-muted-foreground">Valid Until: {clientDetails.dueDate}</p>
               </div>
            </div>
         </div>

         {/* Client & Project Info */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
               <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">To: (The Client)</p>
               <h4 className="text-base font-semibold text-foreground">{clientDetails.client}</h4>
               <p className="text-xs text-muted-foreground">{clientDetails.address}</p>
               <p className="text-xs text-primary flex items-center gap-1.5 mt-1">
                  <Mail size={11} /> {clientDetails.clientEmail}
               </p>
            </div>
            <div className="p-4 bg-muted/15 border border-border/40 rounded-lg space-y-2">
               <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Project</p>
               <h4 className="text-sm font-semibold text-foreground leading-snug">{clientDetails.title}</h4>
               <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Grade A Priority</span>
            </div>
            <div className="p-4 bg-muted/15 border border-border/40 rounded-lg space-y-2">
               <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Selected Supplier</p>
               <h4 className="text-sm font-semibold text-foreground">{selectedSupplier.name}</h4>
               <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock size={11} /> {selectedSupplier.deliveryDays} days</span>
                  <span className="flex items-center gap-1"><ShieldCheck size={11} /> {selectedSupplier.warranty}</span>
               </div>
            </div>
         </div>

         {/* Line Items Table */}
         <div className="mb-6 overflow-hidden rounded-lg border border-border/40">
            <table className="w-full">
               <thead>
                  <tr className="bg-muted/30 h-10 border-b border-border/40">
                     <th className="text-left px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Item Description</th>
                     <th className="text-center px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 w-16">Qty</th>
                     <th className="text-right px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 w-28">Unit Cost</th>
                     <th className="text-center px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 w-24">Markup %</th>
                     <th className="text-right px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 w-28">Unit Price</th>
                     <th className="text-right px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 w-32">Line Total</th>
                  </tr>
               </thead>
               <tbody>
                  {items.map((item, idx) => (
                     <tr key={item.id} className="h-12 border-b border-border/20 last:border-0 hover:bg-muted/5 group transition-colors">
                        <td className="px-4">
                           <p className="text-sm font-medium text-foreground">{item.name}</p>
                           <p className="text-[10px] font-mono text-muted-foreground/40">SKU: IN-PRO-0{idx}9-L</p>
                        </td>
                        <td className="text-center px-3">
                           <span className="text-xs font-medium text-muted-foreground">{item.quantity} {item.unit}</span>
                        </td>
                        <td className="text-right px-3">
                           <span className="text-xs font-mono text-muted-foreground">${item.supplierCost.toFixed(2)}</span>
                        </td>
                        <td className="px-3">
                           <div className="flex items-center gap-1 justify-center">
                              <Input 
                                 type="number"
                                 value={item.upliftPercent}
                                 disabled={status === 'authorized'}
                                 onChange={(e) => updateItemUplift(item.id, parseFloat(e.target.value) || 0)}
                                 className="h-8 w-16 text-center font-medium text-xs border-border/30 bg-primary/5 focus:bg-background"
                              />
                              <Percent size={10} className="text-muted-foreground/40" />
                           </div>
                        </td>
                        <td className="text-right px-3">
                           <span className="text-xs font-semibold text-foreground font-mono">${item.clientPrice.toFixed(2)}</span>
                        </td>
                        <td className="px-4 text-right">
                           <span className="text-sm font-semibold text-foreground font-mono">${item.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                           <p className="text-[10px] text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">GP +${(item.upliftAmount * item.quantity).toFixed(2)}</p>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Totals & Terms Footer */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/30">
            {/* Terms & Conditions */}
            <div className="space-y-4">
               <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Supplier Terms & Conditions</h4>
               <ul className="space-y-2">
                  {selectedSupplier.conditions.map((condition, idx) => (
                     <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                        <FileCheck size={12} className="text-primary/40 mt-0.5 shrink-0" />
                        {condition}
                     </li>
                  ))}
               </ul>
               <Separator className="bg-border/30" />
               <div className="flex flex-wrap gap-x-8 gap-y-2">
                  <div className="space-y-0.5">
                     <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Payment Terms</p>
                     <p className="text-xs font-medium text-foreground">{selectedSupplier.paymentTerms}</p>
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Incoterms</p>
                     <p className="text-xs font-medium text-foreground">{selectedSupplier.incoterms}</p>
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Validity</p>
                     <p className="text-xs font-medium text-foreground">{selectedSupplier.validity}</p>
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Delivery</p>
                     <p className="text-xs font-medium text-foreground">{selectedSupplier.deliveryDays} Business Days</p>
                  </div>
               </div>
            </div>

            {/* Financial Summary */}
            <div className="flex flex-col justify-end">
               <div className="bg-muted/10 p-5 rounded-lg border border-border/30 space-y-3">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                     <span className="font-medium">Subtotal (excl. VAT)</span>
                     <span className="font-mono font-semibold">${totals.clientTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                     <span className="font-medium">VAT ({vatPercent}%)</span>
                     <span className="font-mono font-semibold">${vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <Separator className="bg-border/40" />
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-semibold uppercase tracking-wider text-primary">Grand Total (incl. VAT)</span>
                     <span className="text-lg font-bold text-foreground font-mono">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-emerald-600">
                     <span className="font-medium">Your Gross Profit</span>
                     <span className="font-mono font-semibold">+${totals.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* ===== Action Bar — Full Width Below Document ===== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-muted/20 border border-border/40 rounded-xl">
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" className="h-9 rounded-lg text-xs font-medium gap-2">
                  <Download size={14} /> Export Draft
               </Button>
               <Button variant="outline" size="sm" className="h-9 rounded-lg text-xs font-medium gap-2">
                  <Printer size={14} /> Print Preview
               </Button>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
               <ShieldAlert size={12} />
               <span>Committing will generate the official PDF and notify the client.</span>
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <Button 
               onClick={handleAuthorize}
               disabled={status === 'authorized' || isFinalizing}
               variant={status === 'authorized' ? "outline" : "default"}
               className="h-9 rounded-lg font-semibold text-xs gap-2"
            >
               {status === 'authorized' ? <><CheckCircle2 size={14} className="text-emerald-500" /> Authorized</> : isFinalizing ? <Loader2 size={14} className="animate-spin" /> : 'Authorize Pricing'}
            </Button>

            <Button 
               onClick={handleCommitAndSend}
               disabled={status !== 'authorized' || isFinalizing}
               className="h-9 rounded-lg bg-foreground text-background font-semibold text-xs gap-2 hover:bg-foreground/90 disabled:opacity-30"
            >
               {isFinalizing ? <Loader2 size={14} className="animate-spin" /> : <>Commit & Send <ArrowRight size={14} /></>}
            </Button>
         </div>
      </div>
    </div>
  );
}
