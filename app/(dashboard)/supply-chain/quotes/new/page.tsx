'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
  Trash2
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
  supplierCost: number; // Inherited from Step 3
  upliftPercent: number; // User input
  upliftAmount: number; // Calculated
  clientPrice: number; // Calculated (Supplier Cost + Uplift)
  totalAmount: number; // clientPrice * quantity
}

export default function NewClientQuotePage() {
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const router = useRouter();
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [globalMarkup, setGlobalMarkup] = useState(25); // Default 25%

  // Document Form State
  const [clientDetails, setClientDetails] = useState({
    rfqNumber: 'RFQ-2026-9447',
    title: 'Dubai Metro Expansion - Phase 4 Structural Steel',
    client: 'Road & Transport Authority',
    clientEmail: 'procurement@rta.ae',
    priority: 'high',
    dueDate: '2026-04-12',
    notes: 'Uplifted pricing based on premium Grade A steel availability and accelerated shipping.'
  });

  const [terms, setTerms] = useState([
    { id: '1', label: 'Price Basis', value: 'CIF Dubai Port' },
    { id: '2', label: 'Validity', value: '30 Days' },
    { id: '3', label: 'Payment', value: '50% Advance / 50% on Delivery' },
  ]);

  // Mock inherited data from Selected Supplier (Bestway from previous step)
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
      { label: 'Client Quotes', href: '/supply-chain/quotes' },
      { label: 'Strategic Uplift' },
    ]);
  }, [setActivePortal, setBreadcrumbs]);

  const updateItemUplift = (id: string, percent: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
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

  const addTerm = () => {
    setTerms([...terms, { id: Math.random().toString(36).substr(2, 9), label: '', value: '' }]);
  };

  const updateTerm = (id: string, field: 'label' | 'value', value: string) => {
    setTerms(terms.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTerm = (id: string) => {
    setTerms(terms.filter(t => t.id !== id));
  };

  const totals = items.reduce((acc, item) => ({
    supplierTotal: acc.supplierTotal + (item.supplierCost * item.quantity),
    clientTotal: acc.clientTotal + item.totalAmount,
    totalProfit: acc.totalProfit + (item.upliftAmount * item.quantity),
  }), { supplierTotal: 0, clientTotal: 0, totalProfit: 0 });

  const marginPercent = (totals.totalProfit / totals.clientTotal) * 100;

  const handleFinalize = () => {
    setIsFinalizing(true);
    setTimeout(() => {
       toast.success('Strategic Client Quote Generated & Sent');
       router.push('/supply-chain/client-po');
    }, 2000);
  };

  return (
    <div className="w-full space-y-12 pb-48 px-2 max-w-[1440px] animate-in fade-in duration-1000">
      {/* 1. Page Header & Timeline (Step 4) */}
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Strategic Client Quoting" 
          description="Apply profit margins and finalize the commercial proposal for the end client." 
        />
        <div className="bg-muted/10 rounded-[2.5rem] p-4 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.CLIENT_QUOTE} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
         {/* Section 1: Client & Reference (Inherited Documentation) */}
         <section className="space-y-4">
            <div className="flex items-center gap-3 px-6">
               <div className="w-1.5 h-6 bg-primary rounded-full" />
               <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">1. Client & Reference (Inherited)</h2>
            </div>
            <Card className="shadow-2xl shadow-black/[0.02] border-border/40 backdrop-blur-sm bg-background/80 overflow-hidden rounded-[2.5rem]">
               <CardContent className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="md:col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Document Title / Opportunity Name</Label>
                        <Input 
                           value={clientDetails.title}
                           onChange={(e) => setClientDetails({...clientDetails, title: e.target.value})}
                           className="h-14 text-lg font-bold border-transparent bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all px-4"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Official RFQ Ref</Label>
                        <div className="h-14 flex items-center px-4 bg-primary/5 border border-primary/10 rounded-2xl text-primary font-mono text-sm font-black">
                           {clientDetails.rfqNumber}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Client Entity</Label>
                        <Input 
                           value={clientDetails.client}
                           onChange={(e) => setClientDetails({...clientDetails, client: e.target.value})}
                           className="h-11 border-border/50 bg-background/50 focus:bg-background font-bold"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Client Contact Email</Label>
                        <div className="relative">
                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={14} />
                           <Input 
                              type="email"
                              value={clientDetails.clientEmail}
                              onChange={(e) => setClientDetails({...clientDetails, clientEmail: e.target.value})}
                              className="h-11 pl-9 border-border/50 bg-background/50 focus:bg-background font-bold"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Priority Level</Label>
                        <Select value={clientDetails.priority} onValueChange={(v: string | null) => setClientDetails({...clientDetails, priority: v || 'medium'})}>
                           <SelectTrigger className="h-11 border-border/50 bg-background/50 focus:bg-background font-bold">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Quote Validity Date</Label>
                        <div className="relative">
                           <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={14} />
                           <Input 
                              type="date" 
                              value={clientDetails.dueDate}
                              onChange={(e) => setClientDetails({...clientDetails, dueDate: e.target.value})}
                              className="h-11 pl-9 border-border/50 bg-background/50 focus:bg-background font-bold"
                           />
                        </div>
                     </div>
                  </div>

                  <Separator className="bg-border/40" />

                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Strategic Remarks (Internal)</Label>
                     <Textarea 
                        value={clientDetails.notes}
                        onChange={(e) => setClientDetails({...clientDetails, notes: e.target.value})}
                        className="min-h-[80px] resize-none border-transparent bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-sm p-4 font-medium"
                     />
                  </div>
               </CardContent>
            </Card>
         </section>

         {/* Section 2: Strategy Control Bar */}
         <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-primary/[0.03] border border-primary/20 rounded-[3rem] p-10 backdrop-blur-sm shadow-inner group transition-all hover:bg-primary/[0.05]">
            <div className="flex items-center gap-8">
               <div className="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-2xl shadow-primary/20 transition-all group-hover:scale-110">
                  <TrendingUp size={32} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-foreground leading-tight tracking-tight">Active Uplift Strategy</h3>
                  <p className="text-[11px] font-black uppercase text-primary tracking-[0.2em] mt-1">AI-Assisted Margin Calculation Active</p>
               </div>
            </div>

            <div className="flex flex-row items-center gap-6 bg-background/50 p-4 rounded-3xl border border-border/50 shadow-sm">
               <div className="space-y-1.5 px-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Supplier Base Cost</p>
                  <p className="text-xl font-black text-foreground">${totals.supplierTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
               </div>
               <Separator orientation="vertical" className="h-12 bg-border/50" />
               <div className="space-y-1.5 px-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Target Client Total</p>
                  <p className="text-xl font-black text-primary">${totals.clientTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
               </div>
               <Separator orientation="vertical" className="h-12 bg-border/50" />
               <div className="space-y-1.5 px-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Global Strategy (%)</Label>
                  <div className="flex items-center gap-3">
                     <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30" size={14} />
                        <Input 
                           type="number"
                           value={globalMarkup}
                           onChange={(e) => setGlobalMarkup(parseFloat(e.target.value) || 0)}
                           className="h-10 w-20 pl-8 font-black text-sm border-transparent bg-primary/5 focus:bg-background transition-all"
                        />
                     </div>
                     <Button onClick={applyGlobalMarkup} size="sm" className="h-10 rounded-xl px-4 font-black uppercase tracking-widest text-[10px]">
                        Apply
                     </Button>
                  </div>
               </div>
               <Separator orientation="vertical" className="h-12 bg-border/50" />
               <div className="space-y-1.5 px-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Total Profit</p>
                  <p className="text-xl font-black text-emerald-600">+${totals.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
               </div>
            </div>
         </div>

         {/* Section 2 (Cont.): Strategic Pricing Matrix */}
         <section className="space-y-6">
            <div className="flex items-center gap-3 px-6">
               <div className="w-1.5 h-6 bg-primary rounded-full" />
               <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">2. Strategic Pricing Matrix</h2>
            </div>
            
            <Card className="shadow-2xl shadow-black/[0.04] border-border/40 backdrop-blur-md bg-background/60 overflow-hidden rounded-[2.5rem]">
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-muted/40">
                        <TableRow className="border-b border-border/50 h-16">
                           <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-10">Product Description</TableHead>
                           <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-4 text-center">Qty</TableHead>
                           <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-4 text-right">Supplier Cost (S)</TableHead>
                           <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-4 w-40 text-center">Uplift Margin (%)</TableHead>
                           <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-4 text-right">Client Price (C)</TableHead>
                           <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-10 text-right">Extended Total</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {items.map((item) => (
                           <TableRow key={item.id} className="group hover:bg-primary/[0.02] border-b border-border/30 last:border-0 transition-all h-20">
                              <TableCell className="px-10">
                                 <span className="text-sm font-black text-foreground uppercase tracking-tight">{item.name}</span>
                              </TableCell>
                              <TableCell className="px-4 text-center font-mono font-bold text-muted-foreground">{item.quantity} {item.unit}</TableCell>
                              <TableCell className="px-4 text-right font-mono font-medium text-muted-foreground/60">
                                 ${item.supplierCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="px-4">
                                 <div className="flex items-center justify-center gap-2">
                                    <div className="relative group/input w-24">
                                       <TrendingUp className="absolute left-2.5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within/input:text-primary transition-colors" size={12} />
                                       <Input 
                                          type="number"
                                          value={item.upliftPercent}
                                          onChange={(e) => updateItemUplift(item.id, parseFloat(e.target.value) || 0)}
                                          className="h-10 pl-8 pr-2 text-xs font-black text-center bg-primary/5 border-transparent focus:bg-background transition-all"
                                       />
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell className="px-4 text-right">
                                 <div className="flex flex-col items-end">
                                    <span className="text-sm font-black text-foreground">${item.clientPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    <span className="text-[10px] font-bold text-emerald-600">GP: +${item.upliftAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                 </div>
                              </TableCell>
                              <TableCell className="px-10 text-right">
                                 <span className="text-lg font-black text-primary tracking-tighter">
                                    ${item.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                 </span>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </section>

         {/* Section 3: Commercial Terms (Client Facing) */}
         <section className="space-y-4">
            <div className="flex items-center justify-between px-6">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">3. Commercial Terms (Client Facing)</h2>
               </div>
               <Button variant="ghost" size="sm" onClick={addTerm} className="h-8 text-[10px] font-black text-primary hover:bg-primary/5 uppercase tracking-widest px-4">
                  <Plus size={14} className="mr-2" /> Add Term
               </Button>
            </div>
            <Card className="shadow-2xl shadow-black/[0.02] border-border/40 backdrop-blur-sm bg-background/80 overflow-hidden rounded-[2.5rem]">
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-muted/40">
                        <TableRow className="border-b border-border/50 h-16">
                           <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-10">Term Category</TableHead>
                           <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-4">Value / Specific Detail</TableHead>
                           <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-10 text-right w-20"></TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {terms.map((term) => (
                           <TableRow key={term.id} className="group hover:bg-primary/[0.01] border-b border-border/30 last:border-0 transition-all h-20">
                              <TableCell className="px-10">
                                 <Input 
                                    value={term.label} 
                                    onChange={(e) => updateTerm(term.id, 'label', e.target.value)}
                                    placeholder="Term Category..."
                                    className="h-10 text-xs font-black uppercase tracking-widest border-transparent bg-transparent focus:bg-background focus:border-input transition-all"
                                 />
                              </TableCell>
                              <TableCell className="px-4">
                                 <Input 
                                    value={term.value} 
                                    onChange={(e) => updateTerm(term.id, 'value', e.target.value)}
                                    placeholder="e.g. 50% Advance Payment..."
                                    className="h-10 text-sm font-medium border-transparent bg-transparent focus:bg-background focus:border-input transition-all"
                                 />
                              </TableCell>
                              <TableCell className="px-10 text-right">
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground/30 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                                    onClick={() => removeTerm(term.id)}
                                 >
                                    <Trash2 size={14} />
                                 </Button>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </section>
      </div>

      {/* 4. Document Summary & Profit Deck */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
         <div className="bg-muted/20 border border-border flex flex-col justify-between p-12 rounded-[3rem] shadow-sm">
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                     <Calculator size={24} />
                  </div>
                  <h3 className="text-xl font-black text-foreground">Gross Profit Analysis</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-muted-foreground/60 border-b border-border/50 pb-4">
                     <span className="text-[11px] font-black uppercase tracking-widest">Total Procurement Cost</span>
                     <span className="font-mono text-sm font-bold">${totals.supplierTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600 border-b border-border/50 pb-4">
                     <span className="text-[11px] font-black uppercase tracking-widest">Target Operational Profit</span>
                     <span className="font-mono text-sm font-black">+${totals.totalProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                     <span className="text-[11px] font-black uppercase tracking-widest text-primary">Final Client Quoted Value</span>
                     <span className="text-2xl font-black text-foreground tracking-tighter">${totals.clientTotal.toLocaleString()}</span>
                  </div>
               </div>
            </div>
            
            <div className="mt-12 flex items-center gap-4 p-4 bg-background/50 rounded-2xl border border-border/50">
               <ShieldCheck className="text-emerald-500" size={24} />
               <p className="text-[10px] leading-relaxed text-muted-foreground font-medium uppercase tracking-wider">
                  Margin analysis satisfies enterprise profitability standards (Tier 1 Governance). All line items adjusted to nearest cent.
               </p>
            </div>
         </div>

         <div className="flex flex-col gap-6">
            <Card className="border-border shadow-sm rounded-3xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer group">
               <CardContent className="p-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-all">
                        <Download size={24} />
                     </div>
                     <div>
                        <h4 className="text-sm font-black uppercase tracking-widest">Preview Client Document</h4>
                        <p className="text-[11px] text-muted-foreground">Download official Proposal PDF</p>
                     </div>
                  </div>
                  <MoreVertical size={20} className="text-muted-foreground/30" />
               </CardContent>
            </Card>

            <Button 
               size="lg" 
               onClick={handleFinalize}
               disabled={isFinalizing}
               className="h-24 rounded-[2.5rem] shadow-[0_20px_50px_rgba(var(--primary),0.3)] bg-primary text-primary-foreground font-black text-lg uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
            >
               {isFinalizing ? (
                  <Loader2 className="animate-spin" size={32} />
               ) : (
                  <div className="flex items-center gap-4">
                     Commit & Send Quote
                     <Send size={24} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                  </div>
               )}
            </Button>
            
            <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
               Action will lock prices and move to Stage 5: Client PO
            </p>
         </div>
      </section>
    </div>
  );
}
