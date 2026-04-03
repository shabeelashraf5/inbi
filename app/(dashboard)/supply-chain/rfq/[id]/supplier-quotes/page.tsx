'use client';

import React, { useEffect, useState, use } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import { QuoteComparison } from '@/modules/supply-chain/supplier-quotes/components/quote-comparison';
import { QuoteEntryForm, type SupplierProposal } from '@/modules/supply-chain/supplier-quotes/components/quote-entry-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { 
  FileSearch, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  ChevronLeft,
  LayoutGrid,
  FileEdit,
  ExternalLink,
  Warehouse
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ViewMode = 'entry' | 'comparison';

// Mock active RFQ context
const MOCK_ACTIVE_RFQ = {
  rfqNumber: 'RFQ-2026-9447',
  title: 'Dubai Metro Expansion - Phase 4 Structural Steel',
  client: 'Road & Transport Authority',
  items: [
    { id: 'item-1', name: 'Structural Steel I-Beam (HEB 300)', quantity: 45, unit: 'pcs' },
    { id: 'item-2', name: 'Steel Plate 10mm - Grade A', quantity: 120, unit: 'pcs' },
    { id: 'item-3', name: 'High-Tensile Anchor Bolts (M24)', quantity: 500, unit: 'pcs' },
  ]
};

export default function SupplierQuotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInventoryMode = searchParams.get('source') === 'inventory';

  const [viewMode, setViewMode] = useState<ViewMode>('entry');
  const [proposals, setProposals] = useState<SupplierProposal[]>([]);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Sourcing Terminal', href: '/supply-chain' },
      { label: 'RFQ Pipeline', href: '/supply-chain/rfq' },
      { label: id, href: `/supply-chain/rfq/${id}` },
      { label: 'Strategic Selection' },
    ]);
  }, [setActivePortal, setBreadcrumbs, id]);

  const handleEntrySubmit = (enteredProposals: SupplierProposal[]) => {
    setProposals(enteredProposals);
    setViewMode('comparison');
    toast.success('Strategic proposals processed successfully');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelect = (quote: SupplierProposal) => {
    toast.success(`Proposal from ${quote.supplierName} selected! Transitioning to Client Strategy...`);
    setTimeout(() => {
       router.push(`/supply-chain/rfq/${id}/client-quote`); 
    }, 1500);
  };

  return (
    <div className="w-full space-y-10 pb-32 px-4 md:px-10 animate-in fade-in duration-1000 bg-background/50">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <PageHeader 
              title={
                isInventoryMode 
                ? (viewMode === 'entry' ? "Internal Fulfillment Terminal" : "Stock Certification Matrix")
                : (viewMode === 'entry' ? "Strategic Sourcing Terminal" : "Economic Comparison Matrix")
              }
              description={
                isInventoryMode
                ? (viewMode === 'entry' ? "Allocate items from internal warehouse stock and verify internal transfer pricing." : "Verification of internal stock availability and project allocation readiness.")
                : (viewMode === 'entry' ? "Digitize and normalize vendor proposals for automated multi-vendor economic analysis." : "A high-fidelity comparative model of vendor pricing, lead times, and commercial terms.")
              }
            />
            {!isInventoryMode && (
              <div className="hidden lg:flex items-center gap-3">
                 <div className="flex bg-muted/40 p-1 rounded-xl border border-border/50">
                    <button 
                      onClick={() => setViewMode('entry')}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        viewMode === 'entry' ? "bg-background text-primary shadow-sm" : "text-muted-foreground/40 hover:text-muted-foreground"
                      )}
                    >
                       <FileEdit size={12} /> Entry
                    </button>
                    <button 
                      onClick={() => {
                          if (proposals.length > 0) setViewMode('comparison');
                          else toast.error('Complete data entry first');
                      }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        viewMode === 'comparison' ? "bg-background text-primary shadow-sm" : "text-muted-foreground/40 hover:text-muted-foreground"
                      )}
                    >
                       <LayoutGrid size={12} /> Analysis
                    </button>
                 </div>
              </div>
            )}
        </div>
        
        {/* Unified 10-Step Timeline (Step 3: Supplier Quote) */}
        <div className="bg-background/40 backdrop-blur-sm rounded-2xl p-5 border border-border/40 shadow-xl shadow-black/[0.02]">
           <WorkflowTimeline currentStage={WorkflowStage.SUPPLIER_QUOTE} />
        </div>
      </div>

      {/* RFQ Context Document-Header */}
      <div className="bg-gradient-to-r from-primary/[0.03] to-background border-2 border-primary/10 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-10 group hover:border-primary/20 transition-all shadow-2xl shadow-primary/[0.02] relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none rotate-12">
            {isInventoryMode ? <Warehouse size={180} className="text-primary" /> : <FileSearch size={180} className="text-primary" />}
         </div>

         <div className="flex items-start gap-8 relative z-10">
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shadow-2xl shadow-primary/20 border border-primary/20">
               {isInventoryMode ? <Warehouse size={32} strokeWidth={2.5} /> : <FileSearch size={32} strokeWidth={2.5} />}
            </div>
            <div>
               <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1 rounded-full border border-primary/10 shadow-sm">
                    {isInventoryMode ? 'Internal Allocation Session' : 'Active Procurement Session'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center gap-2">
                     <ExternalLink size={10} /> {MOCK_ACTIVE_RFQ.rfqNumber}
                  </span>
               </div>
               <h3 className="text-2xl font-black text-foreground leading-tight tracking-tighter max-w-xl">{MOCK_ACTIVE_RFQ.title}</h3>
               <div className="flex items-center gap-6 mt-5">
                  <span className="flex items-center gap-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">
                     <div className="w-5 h-5 bg-muted/50 rounded-full flex items-center justify-center border border-border/50">
                        <Mail size={10} className="text-primary/40" />
                     </div>
                     Client: {MOCK_ACTIVE_RFQ.client}
                  </span>
                  <div className="w-1 h-1 bg-border/50 rounded-full" />
                  <span className="flex items-center gap-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">
                      Line Artifacts Linked: {MOCK_ACTIVE_RFQ.items.length}
                  </span>
               </div>
            </div>
         </div>
         
         <div className="flex items-center gap-10 text-right relative z-10 px-8 border-l border-border/20 py-2">
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Target Sourcing Date</p>
               <p className="text-sm font-black text-foreground tracking-tighter">APRIL 12, 2026</p>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Project Vertical</p>
               <p className="text-sm font-black text-foreground tracking-tighter">HEAVY INDUSTRY</p>
            </div>
         </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {viewMode === 'entry' ? (
           <QuoteEntryForm isInventoryMode={isInventoryMode} rfqItems={MOCK_ACTIVE_RFQ.items} onSubmit={handleEntrySubmit} />
        ) : (
           <QuoteComparison 
              isInventoryMode={isInventoryMode}
              quotes={proposals as any} 
              onSelect={handleSelect} 
              onBack={() => setViewMode('entry')}
           />
        )}
      </div>

      {/* Global Fixed Action Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-500">
         <div className="bg-background/80 backdrop-blur-2xl border-2 border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] rounded-3xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 px-4">
               <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                  <ShieldCheck size={20} strokeWidth={2.5} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Governance Engine Active</p>
                  <p className="text-[9px] font-bold text-muted-foreground/60 uppercase">Phase: Strategic Sourcing & Analysis</p>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <Button 
                 variant="ghost" 
                 size="sm"
                 className="h-11 rounded-2xl text-[10px] font-black uppercase tracking-widest px-6"
                 onClick={() => router.back()}
               >
                  <ChevronLeft size={16} className="mr-2" /> Back
               </Button>
               <Separator orientation="vertical" className="h-8 bg-border/40" />
               <Button 
                className="h-11 rounded-2xl px-10 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 group hover:scale-105 active:scale-95 transition-all"
                disabled={viewMode === 'comparison' && !proposals.some(p => p.grandTotal > 0)}
                onClick={() => {
                   if (viewMode === 'entry' && proposals.length > 0) setViewMode('comparison');
                   else if (viewMode === 'comparison') {
                      // Final logic handled within QuoteComparison
                      toast.info('Select a vendor proposal to proceed');
                   } else {
                      toast.info('Complete data entry to analyze');
                   }
                }}
               >
                  {viewMode === 'entry' ? 'Execute Comparison' : 'Awaiting Nomination'}
                  <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
