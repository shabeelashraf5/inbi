'use client';

import React, { useEffect, useState, use } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Printer, 
  Smartphone, 
  Globe, 
  CheckCircle,
  Loader2,
  Box,
  FileText,
  Mail,
  MoreVertical,
  History,
  QrCode,
  Download,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

export default function DeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const router = useRouter();
  
  const [fleetType, setFleetType] = useState<'internal' | 'external'>('internal');
  const [isGeneratingDN, setIsGeneratingDN] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [dnGenerated, setDnGenerated] = useState(false);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: id, href: `/supply-chain/rfq/${id}` },
      { label: 'Delivery Note (DN)' },
    ]);
  }, [setActivePortal, setBreadcrumbs, id]);

  const handleGenerateDN = () => {
    setIsGeneratingDN(true);
    setTimeout(() => {
       setIsGeneratingDN(false);
       setDnGenerated(true);
       toast.success('Delivery Note (DN-2026-944) Authorized Successfully');
    }, 1500);
  };

  const handleFinalize = () => {
    setIsFinalizing(true);
    setTimeout(() => {
       toast.success('Logistics Phase Finalized: Moving to Step 9 (Finance)');
       router.push(`/supply-chain/rfq/${id}/finance`);
    }, 2000);
  };

  return (
    <div className="w-full space-y-8 pb-32 px-4 md:px-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4">
        <PageHeader 
          title="Logistics Dispatch (DN)" 
          description="Authenticate outbound transitions, select fleet carriers, and mobilize the official Delivery Note." 
        />
        <div className="bg-muted/10 rounded-xl p-2 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.DELIVERY} />
        </div>
      </div>

      <div className="space-y-8">
         {/* Fleet Intelligence Selection */}
         <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
               <div className="w-1 h-4 bg-primary rounded-full" />
               <h2 className="text-xs font-bold uppercase tracking-wider text-foreground/70">1. Fleet Intelligence Strategy</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card 
                  onClick={() => setFleetType('internal')}
                  className={cn(
                     "cursor-pointer transition-all duration-300 rounded-xl border-2 group relative overflow-hidden",
                     fleetType === 'internal' ? "border-primary bg-primary/[0.02]" : "border-border/40 bg-background/50 hover:border-primary/20"
                  )}
               >
                  <CardContent className="p-6 space-y-4">
                     <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
                        fleetType === 'internal' ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-muted/50 text-muted-foreground"
                     )}>
                        <Navigation size={24} />
                     </div>
                     <div>
                        <h4 className="text-base font-bold text-foreground uppercase tracking-tight">Internal Dispatch</h4>
                        <p className="text-[11px] text-muted-foreground font-medium mt-1 leading-relaxed">INBI Fleet Cluster for local site offloading. Optimized for Deira/Metro Project zones.</p>
                     </div>
                     <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider text-primary">
                        8 Units Active <span className="opacity-20">•</span> Multi-Route GPS
                     </div>
                  </CardContent>
                  {fleetType === 'internal' && <div className="absolute top-6 right-6 text-primary animate-in zoom-in-50"><CheckCircle size={20} /></div>}
               </Card>

               <Card 
                  onClick={() => setFleetType('external')}
                  className={cn(
                     "cursor-pointer transition-all duration-300 rounded-xl border-2 group relative overflow-hidden",
                     fleetType === 'external' ? "border-primary bg-primary/[0.02]" : "border-border/40 bg-background/50 hover:border-primary/20"
                  )}
               >
                  <CardContent className="p-6 space-y-4">
                     <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
                        fleetType === 'external' ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-muted/50 text-muted-foreground"
                     )}>
                        <Globe size={24} />
                     </div>
                     <div>
                        <h4 className="text-base font-bold text-foreground uppercase tracking-tight">Carrier API Link</h4>
                        <p className="text-[11px] text-muted-foreground font-medium mt-1 leading-relaxed">Integrated dispatch via Global Carriers (DHL/Aramex) for cross-city logistics nodes.</p>
                     </div>
                     <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider text-blue-600">
                        Fulfillment Ready <span className="opacity-20">•</span> Waybill API
                     </div>
                  </CardContent>
                  {fleetType === 'external' && <div className="absolute top-6 right-6 text-blue-600 animate-in zoom-in-50"><CheckCircle size={20} /></div>}
               </Card>
            </div>
         </section>

         {/* The Delivery Note Document (A4 Frame) */}
         <div className="bg-background border border-border/40 shadow-xl rounded-2xl overflow-hidden p-12 md:p-16 relative animate-in slide-in-from-bottom-8 duration-700">
            {/* Document Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16 border-b border-border/40 pb-8">
               <div className="space-y-4">
                  <div className="w-20 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg italic tracking-tighter">INBI</div>
                  <div className="space-y-0.5">
                     <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">From Ops Hub:</p>
                     <h4 className="text-sm font-bold text-foreground">Delivery Note (DN)</h4>
                     <p className="text-[9px] text-muted-foreground uppercase opacity-50 tracking-wider">Outbound Dispatch Phase 8.0</p>
                  </div>
               </div>
               <div className="text-right space-y-2">
                  <h2 className="text-3xl font-bold text-foreground tracking-tighter uppercase leading-none italic">Dispatch Mobilized</h2>
                  <div className="space-y-0.5">
                     <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">Shipment Ref:</p>
                     <p className="text-lg font-bold text-primary font-mono tracking-tighter uppercase">{id}</p>
                     <p className="text-[9px] font-bold text-muted-foreground opacity-50 uppercase tracking-widest italic">Service Date: April 03, 2026</p>
                  </div>
               </div>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Consignee Address</p>
                  <div className="space-y-1">
                     <h4 className="text-base font-bold text-foreground uppercase tracking-tight">Road & Transport Authority</h4>
                     <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed italic max-w-[280px]">Site Office 22, Al Jaddaf Extension,<br/>Adjacent to Business Bay Link,<br/>Dubai, UAE</p>
                  </div>
               </div>
               <div className="p-8 bg-primary/[0.03] border border-primary/20 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shadow-sm">
                        <Clock size={20} />
                     </div>
                     <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Estimated Transit</p>
                        <p className="text-xs font-bold text-foreground italic">Today, ~17:45 GST</p>
                     </div>
                  </div>
                  <Separator className="bg-primary/20 opacity-30" />
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shadow-sm">
                        <Truck size={20} />
                     </div>
                     <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Fleet Node</p>
                        <p className="text-xs font-bold text-foreground italic">AE-LOG-944-G</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Transit Simulation Deck */}
            <div className="mb-16 relative h-48 bg-muted/10 rounded-2xl border border-border/40 overflow-hidden flex items-center justify-center group">
               <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
               
               <div className="relative w-full max-w-xl h-0.5 border-t border-dashed border-primary/30 flex justify-between items-center px-8">
                  <div className="relative">
                     <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center outline outline-4 outline-white shadow-md">
                        <MapPin size={18} className="text-primary" />
                     </div>
                     <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-wider text-muted-foreground/50">Warehouse</span>
                  </div>
                  
                  <div className="relative animate-in slide-in-from-left-[5%] duration-[15000ms] infinite">
                     <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/20 text-white flex flex-col items-center gap-0.5">
                        <Truck size={20} className="animate-pulse" />
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg border border-border/40 shadow-md whitespace-nowrap">
                           <span className="text-[8px] font-bold text-primary uppercase tracking-wider italic">AE-LOG-944 Transit</span>
                        </div>
                     </div>
                  </div>

                  <div className="relative">
                     <div className="w-10 h-10 bg-muted/60 rounded-full flex items-center justify-center outline outline-4 outline-white shadow-sm">
                        <MapPin size={18} className="text-muted-foreground/30" />
                     </div>
                     <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-wider text-muted-foreground/50">DXB Site</span>
                  </div>
               </div>
            </div>

            {/* Recipient Affirmation Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t border-border/40 items-end">
               <div className="space-y-6">
                  <div className="flex items-center gap-2">
                     <QrCode size={20} className="text-primary/40" />
                     <h4 className="text-[9px] font-bold uppercase tracking-wider text-primary">Compliance Acknowledgement</h4>
                  </div>
                  <div className="p-8 border-2 border-dashed border-border/40 rounded-2xl bg-muted/5 flex flex-col items-center justify-center gap-4 relative group overflow-hidden h-40">
                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     {dnGenerated ? (
                        <div className="flex flex-col items-center gap-3 animate-in zoom-in-95">
                           <ShieldCheck className="text-emerald-500" size={40} />
                           <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Digital Lock Authorized</span>
                        </div>
                     ) : (
                        <>
                           <Smartphone className="text-muted-foreground/20 group-hover:scale-110 transition-all" size={32} />
                           <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40 text-center leading-relaxed">Dispatch to trigger site <br/> contact verification link.</p>
                        </>
                     )}
                  </div>
               </div>

               <div className="flex flex-col gap-6">
                  <div className="p-8 bg-primary/[0.03] border border-primary/10 rounded-2xl space-y-4 relative overflow-hidden">
                     <div className="absolute -top-2 -right-2 opacity-5 pointer-events-none">
                        <Truck size={80} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-primary">Verification Action</p>
                        <p className="text-xs font-bold text-foreground italic leading-tight uppercase">Commit Dispatch Metadata</p>
                     </div>
                     <Button 
                       onClick={handleGenerateDN}
                       disabled={isGeneratingDN || dnGenerated}
                       size="sm"
                       className="w-full h-11 rounded-lg bg-foreground text-background font-bold uppercase tracking-wider text-[10px] shadow-lg transition-all active:scale-95 group"
                     >
                        {isGeneratingDN ? <Loader2 className="animate-spin" size={16} /> : dnGenerated ? <span className="flex items-center gap-2"><CheckCircle size={14} /> DN Authorized</span> : <span className="flex items-center gap-2">Authorize Dispatch <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>}
                     </Button>
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
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Fleet Selection</p>
              <p className="text-sm font-black text-foreground tracking-tighter uppercase">{fleetType} Cluster</p>
            </div>
            <Separator orientation="vertical" className="h-8 hidden md:block bg-border/40" />
            <div>
              <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1">Authorization Status</p>
              <p className={cn("text-sm font-black tracking-tighter italic uppercase", dnGenerated ? "text-emerald-600" : "text-amber-600")}>
                {dnGenerated ? 'DN Authorized' : 'Sign-off Required'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-11 rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-all">
              <Printer size={16} className="mr-2" /> Print DN
            </Button>
            <Button 
              onClick={handleFinalize}
              disabled={isFinalizing || !dnGenerated}
              size="sm"
              className="h-11 rounded-xl px-10 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-all disabled:opacity-20 shadow-xl"
            >
              {isFinalizing ? <Loader2 className="animate-spin mr-2" size={16} /> : (
                <span className="flex items-center gap-2 italic">Finish Logistics <ArrowRight size={16} /></span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  )
}
