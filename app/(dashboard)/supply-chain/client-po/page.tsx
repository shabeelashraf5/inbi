'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileUp, 
  Search, 
  ArrowRight, 
  Link as LinkIcon, 
  FileText, 
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Loader2,
  MoreVertical,
  Briefcase,
  RefreshCcw,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

export default function ClientPOPage() {
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const [rfqSearch, setRfqSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [linkedRfq, setLinkedRfq] = useState<any | null>(null);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: 'Client PO Registration' },
    ]);
  }, [setActivePortal, setBreadcrumbs]);

  const handleLinkRfq = () => {
    if (!rfqSearch) return;
    // Mock linking logic (inheriting Bestway/Dubai Metro context)
    setLinkedRfq({
      id: 'RFQ-2026-9447',
      title: 'Dubai Metro Expansion - Phase 4 Structural Steel',
      client: 'Road & Transport Authority',
      supplierCost: 5287.50,
      quotedValue: 6611.80,
      date: '2026-04-03',
      items: 3
    });
    toast.success('RFQ Context Linked Successfully');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setIsUploading(true);
      setFile(selectedFile);
      setTimeout(() => {
        setIsUploading(false);
        toast.success('External Purchase Order Document Processed');
      }, 1500);
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
       toast.success('Client PO Registered & Sourcing Notified');
       // In a real app, this would route to Step 6: Supplier PO
    }, 2000);
  };

  return (
    <div className="w-full space-y-12 pb-48 px-2 max-w-[1440px] animate-in fade-in duration-1000">
      {/* 1. Page Header & Timeline (Step 5) */}
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Client Purchase Order Intake" 
          description="Formalize the project by linking the official Client PO and triggering sub-supplier procurement." 
        />
        <div className="bg-muted/10 rounded-[2.5rem] p-4 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.CLIENT_PO} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        <div className="lg:col-span-3 space-y-12">
          {/* Section 1: RFQ & Quotation Heritage */}
          <section className="space-y-4">
             <div className="flex items-center gap-3 px-6">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">1. RFQ & Quotation Heritage</h2>
             </div>
             <Card className={cn(
                "shadow-2xl shadow-black/[0.02] border-border/40 backdrop-blur-sm bg-background/80 overflow-hidden rounded-[2.5rem] transition-all duration-700",
                linkedRfq && "border-primary/20 bg-primary/[0.01]"
             )}>
                <CardContent className="p-10">
                   {!linkedRfq ? (
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Reference Sourcing ID / Quote Ref</Label>
                           <div className="flex gap-3">
                              <div className="relative flex-1 group">
                                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                 <Input 
                                    placeholder="Search active quotes (e.g. RFQ-2026-9447)..." 
                                    className="pl-12 h-14 text-lg border-transparent bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                                    value={rfqSearch}
                                    onChange={(e) => setRfqSearch(e.target.value)}
                                 />
                              </div>
                              <Button onClick={handleLinkRfq} size="lg" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs">Link Context</Button>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 p-4 bg-muted/10 rounded-2xl text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 italic">
                           <Loader2 size={12} className="animate-spin" /> Awaiting active sourcing linkage...
                        </div>
                     </div>
                   ) : (
                     <div className="flex flex-col md:flex-row items-center justify-between gap-8 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-8">
                           <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-2xl shadow-primary/10">
                              <Briefcase size={32} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Active Sourcing Document Linked</p>
                              <h3 className="text-2xl font-black text-foreground tracking-tight">{linkedRfq.title}</h3>
                              <div className="flex items-center gap-4 mt-2">
                                 <span className="px-3 py-1 bg-background border border-border/50 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">{linkedRfq.id}</span>
                                 <span className="text-[11px] font-bold text-muted-foreground/60">{linkedRfq.client}</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-12 bg-background p-6 rounded-3xl border border-border/40 shadow-sm">
                           <div className="text-center">
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Items</p>
                              <p className="text-xl font-black text-foreground">{linkedRfq.items}</p>
                           </div>
                           <Separator orientation="vertical" className="h-10 border-border/50" />
                           <div className="text-center">
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Value (Ex)</p>
                              <p className="text-xl font-black text-primary">${linkedRfq.quotedValue.toLocaleString()}</p>
                           </div>
                           <Button variant="ghost" size="icon" onClick={() => setLinkedRfq(null)} className="h-10 w-10 text-rose-500 hover:bg-rose-50 rounded-xl">
                              <RefreshCcw size={18} />
                           </Button>
                        </div>
                     </div>
                   )}
                </CardContent>
             </Card>
          </section>

          {/* Section 2: Document Intake */}
          <section className="space-y-4">
             <div className="flex items-center gap-3 px-6">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">2. Official PO Document Intake</h2>
             </div>
             <Card className={cn(
                "shadow-2xl shadow-black/[0.02] border-border/40 backdrop-blur-sm bg-background/80 overflow-hidden rounded-[2.5rem] transition-all duration-700",
                file && "border-emerald-200 bg-emerald-50/10"
             )}>
                <CardContent className="p-10">
                   {!file ? (
                     <div className="group relative border-2 border-dashed border-primary/20 rounded-[2.5rem] p-16 text-center bg-primary/[0.01] hover:bg-primary/[0.03] hover:border-primary/50 transition-all cursor-pointer overflow-hidden">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileUpload} accept=".pdf" />
                        <div className="flex flex-col items-center gap-6">
                           <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <FileUp size={32} />
                           </div>
                           <div className="space-y-1">
                              <p className="text-xl font-black text-foreground">Secure Document Upload</p>
                              <p className="text-sm font-medium text-muted-foreground">Select the official PDF Purchase Order received from the client.</p>
                           </div>
                           <div className="mt-4 px-6 py-2 bg-background border border-border/50 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                              Max Size: 25MB (PDF only)
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-6 bg-background border border-emerald-100 rounded-[2rem] shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                              <FileText size={28} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Verification Status: Verified</p>
                              <h4 className="text-lg font-black text-foreground">{file.name}</h4>
                              <p className="text-xs font-medium text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • Digital Signature Found</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                              Readiness Check Green
                           </div>
                           <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-12 w-12 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                              <RefreshCcw size={20} />
                           </Button>
                        </div>
                     </div>
                   )}
                </CardContent>
             </Card>
          </section>

          {/* Section 3: Commercial Affirmation */}
          <section className="space-y-4">
             <div className="flex items-center gap-3 px-6">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">3. Commercial Affirmation</h2>
             </div>
             <Card className="shadow-2xl shadow-black/[0.02] border-border/40 backdrop-blur-sm bg-background/80 overflow-hidden rounded-[2.5rem]">
                <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Client PO Serial Number</Label>
                      <Input 
                         placeholder="e.g. RTA-PO-2026-004-B" 
                         className="h-12 text-sm font-bold border-transparent bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Official PO Date</Label>
                      <div className="relative">
                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                         <Input 
                            type="date"
                            className="h-12 pl-12 text-sm font-bold border-transparent bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Affirmed Payment Terms</Label>
                      <Input 
                         placeholder="e.g. 50% Advance / 50% PDC on Site Delivery" 
                         className="h-12 text-sm font-bold border-transparent bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Guaranteed Delivery Threshold</Label>
                      <div className="relative">
                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                         <Input 
                            type="date"
                            className="h-12 pl-12 text-sm font-bold border-transparent bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all"
                         />
                      </div>
                   </div>
                </CardContent>
             </Card>
          </section>
        </div>

        {/* Sidebar Summary & Action */}
        <div className="space-y-8 sticky top-12 animate-in slide-in-from-right-8 duration-700">
           <Card className="border-primary/20 bg-primary/[0.01] rounded-[2.5rem] shadow-xl overflow-hidden">
              <div className="p-8 bg-primary/5 border-b border-primary/10">
                 <h4 className="text-lg font-black text-foreground tracking-tight">Project Summary Deck</h4>
              </div>
              <CardContent className="p-8 space-y-8">
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Procurement Budget</span>
                       <span className="text-sm font-bold">${linkedRfq?.supplierCost.toLocaleString() || '0.00'}</span>
                    </div>
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Final Quoted Pool</span>
                       <span className="text-sm font-bold">${linkedRfq?.quotedValue.toLocaleString() || '0.00'}</span>
                    </div>
                    <Separator className="bg-primary/10" />
                    <div className="flex justify-between items-center group cursor-help">
                       <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Est. Operational GP</span>
                          <p className="text-2xl font-black text-foreground tracking-tighter transition-all group-hover:scale-105">
                             +${(linkedRfq ? (linkedRfq.quotedValue - linkedRfq.supplierCost) : 0).toLocaleString()}
                          </p>
                       </div>
                       <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                          <TrendingUp size={24} />
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-amber-50 dark:bg-amber-950/20 rounded-[2rem] border border-amber-200/50 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="text-amber-600" size={20} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-amber-800">Compliance Warning</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-700/80 font-medium">
                       Registering this PO will lock commercial terms and move the workflow to **Supplier PO Generation**. Sub-suppliers will be automatically notified.
                    </p>
                 </div>

                 <Button 
                    onClick={handleComplete}
                    disabled={!file || !linkedRfq || isCompleting}
                    className="w-full h-20 rounded-3xl shadow-2xl shadow-primary/30 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden"
                 >
                    {isCompleting ? (
                       <Loader2 className="animate-spin" size={24} />
                    ) : (
                       <div className="flex items-center gap-4">
                          Finalize PO Registration
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                       </div>
                    )}
                 </Button>
                 
                 {!linkedRfq && (
                    <p className="text-center text-[9px] font-bold text-rose-500/50 uppercase tracking-[0.2em] animate-pulse">
                       * Link an active RFQ to proceed
                    </p>
                 )}
              </CardContent>
           </Card>

           <div className="px-6 space-y-4">
              <div className="flex items-center justify-between text-muted-foreground/30">
                 <span className="text-[9px] font-black uppercase tracking-widest">Document Integrity</span>
                 <CheckCircle2 size={12} />
              </div>
              <div className="flex items-center justify-between text-muted-foreground/30">
                 <span className="text-[9px] font-black uppercase tracking-widest">Sourcing Continuity</span>
                 <CheckCircle2 size={12} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
