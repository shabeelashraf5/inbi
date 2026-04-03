'use client';

import React, { useEffect, useState, use } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import { QuoteComparison } from '@/modules/supply-chain/supplier-quotes/components/quote-comparison';
import { QuoteEntryForm, type SupplierProposal } from '@/modules/supply-chain/supplier-quotes/components/quote-entry-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FileSearch, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  const [viewMode, setViewMode] = useState<ViewMode>('entry');
  const [proposals, setProposals] = useState<SupplierProposal[]>([]);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: 'RFQ Pipeline', href: '/supply-chain/rfq' },
      { label: id, href: `/supply-chain/rfq/${id}` },
      { label: 'Strategic Sourcing' },
    ]);
  }, [setActivePortal, setBreadcrumbs, id]);

  const handleEntrySubmit = (enteredProposals: SupplierProposal[]) => {
    setProposals(enteredProposals);
    setViewMode('comparison');
    toast.success('Strategic proposals processed successfully');
  };

  const handleSelect = (quote: SupplierProposal) => {
    toast.success(`Proposal from ${quote.supplierName} selected! Transitioning to Client Strategy...`);
    setTimeout(() => {
       router.push(`/supply-chain/rfq/${id}/client-quote`); 
    }, 1500);
  };

  return (
    <div className="w-full space-y-12 pb-20 px-2 max-w-[1440px] animate-in fade-in duration-1000">
      <div className="flex flex-col gap-6">
        <PageHeader 
          title={viewMode === 'entry' ? "Strategic Sourcing Intake" : "Economic Proposal Comparison"} 
          description={
             viewMode === 'entry' 
             ? "Digitize offline vendor quotes into line-item proposals for automated comparative analysis." 
             : "Leverage AI-augmented economic metrics to select the optimal fulfillment partner."
          }
        />
        
        {/* Unified 9-Step Timeline (Step 3: Supplier Quote) */}
        <div className="bg-muted/10 rounded-[2rem] p-4 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.SUPPLIER_QUOTE} />
        </div>
      </div>

      {/* RFQ Context Header */}
      <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-primary/[0.07] transition-all">
         <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shadow-inner">
               <FileSearch size={32} />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">Active Sourcing Session</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{id}</span>
               </div>
               <h3 className="text-2xl font-black text-foreground leading-tight tracking-tight">{MOCK_ACTIVE_RFQ.title}</h3>
               <div className="flex items-center gap-6 mt-3">
                  <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground/70 uppercase">
                     <Mail size={14} className="text-primary/40" /> Client: {MOCK_ACTIVE_RFQ.client}
                  </span>
                  <Separator orientation="vertical" className="h-4 bg-border/50" />
                  <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground/70 uppercase">
                      Line Items Linked: {MOCK_ACTIVE_RFQ.items.length}
                  </span>
               </div>
            </div>
         </div>
         
         <div className="flex items-center gap-12 text-right">
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Target Sourcing Completion</p>
               <p className="text-sm font-black text-foreground">April 12, 2026</p>
            </div>
            <div className="h-12 w-px bg-border/50 hidden md:block" />
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Project Category</p>
               <p className="text-sm font-black text-foreground">Structural Hardware</p>
            </div>
         </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {viewMode === 'entry' ? (
           <QuoteEntryForm rfqItems={MOCK_ACTIVE_RFQ.items} onSubmit={handleEntrySubmit} />
        ) : (
           <QuoteComparison 
              quotes={proposals as any} 
              onSelect={handleSelect} 
              onBack={() => setViewMode('entry')}
           />
        )}
      </div>
    </div>
  );
}
