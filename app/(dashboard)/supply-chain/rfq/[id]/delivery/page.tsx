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
    <div className="w-full space-y-12 pb-48 px-2 max-w-[1440px] animate-in fade-in duration-1000">
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Logistics Dispatch (DN)" 
          description="Authenticate outbound transitions, select fleet carriers, and mobilize the official Delivery Note." 
        />
        <div className="bg-muted/10 rounded-[2.5rem] p-4 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.DELIVERY} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
         <div className="lg:col-span-8 xl:col-span-9 space-y-12">
            {/* Fleet Intelligence Selection */}
            <section className="space-y-6">
               <div className="flex items-center gap-3 px-6">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">1. Fleet Intelligence Strategy</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card 
                     onClick={() => setFleetType('internal')}
                     className={cn(
                        "cursor-pointer transition-all duration-500 rounded-[2.5rem] border-2 group relative overflow-hidden",
                        fleetType === 'internal' ? "border-primary bg-primary/[0.02]" : "border-border/40 bg-background/50 grayscale hover:grayscale-0"
                     )}
                  >
                     <CardContent className="p-10 space-y-6">
                        <div className={cn(
                           "w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-500 shadow-xl",
                           fleetType === 'internal' ? "bg-primary text-primary-foreground scale-110 shadow-primary/20" : "bg-muted/50 text-muted-foreground"
                        )}>
                           <Navigation size={32} />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Internal Dispatch</h3>
                           <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed">Utilize INBI Fleet Cluster for local site offloading. Optimized for Deira/Metro Project zones.</p>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary">
                           8 Units Active <span className="opacity-20">•</span> Multi-Route GPS
                        </div>
                     </CardContent>
                     {fleetType === 'internal' && <div className="absolute top-8 right-8 text-primary animate-in zoom-in-50"><CheckCircle size={28} /></div>}
                  </Card>

                  <Card 
                     onClick={() => setFleetType('external')}
                     className={cn(
                        "cursor-pointer transition-all duration-500 rounded-[2.5rem] border-2 group relative overflow-hidden",
                        fleetType === 'external' ? "border-primary bg-primary/[0.02]" : "border-border/40 bg-background/50 grayscale hover:grayscale-0"
                     )}
                  >
                     <CardContent className="p-10 space-y-6">
                        <div className={cn(
                           "w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-500 shadow-xl",
                           fleetType === 'external' ? "bg-blue-600 text-white scale-110 shadow-blue-500/20" : "bg-muted/50 text-muted-foreground"
                        )}>
                           <Globe size={32} />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Carrier API Link</h3>
                           <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed">Integrated dispatch via Global Carriers (DHL/Aramex) for cross-city logistics nodes.</p>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-blue-600">
                           Fulfillment Ready <span className="opacity-20">•</span> Automated Waybill
                        </div>
                     </CardContent>
                     {fleetType === 'external' && <div className="absolute top-8 right-8 text-blue-600 animate-in zoom-in-50"><CheckCircle size={28} /></div>}
                  </Card>
               </div>
            </section>

            {/* The Delivery Note Document (A4 Frame) */}
            <div className="bg-background border border-border/40 shadow-[0_45px_120px_-25px_rgba(0,0,0,0.15)] rounded-[4rem] overflow-hidden p-16 md:p-24 relative animate-in slide-in-from-bottom-8 duration-700">
               {/* Document Header */}
               <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24 border-b border-border/40 pb-16">
                  <div className="space-y-6">
                     <div className="w-24 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl italic tracking-tighter">INBI</div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">From Ops Hub:</p>
                        <h4 className="text-sm font-black text-foreground">Delivery Note (DN)</h4>
                        <p className="text-[10px] text-muted-foreground uppercase opacity-50 tracking-widest">Outbound Dispatch Phase 8.0</p>
                     </div>
                  </div>
                  <div className="text-right space-y-4">
                     <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none italic">Dispatch Mobilized</h2>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Shipment Ref:</p>
                        <p className="text-xl font-black text-primary font-mono tracking-tighter uppercase">{id}</p>
                        <p className="text-[10px] font-bold text-muted-foreground opacity-50 uppercase">Service Date: April 03, 2026</p>
                     </div>
                  </div>
               </div>

               {/* Recipient Details */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-24">
                  <div className="space-y-6">
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary">Consignee Address</p>
                     <div className="space-y-2">
                        <h4 className="text-lg font-black text-foreground uppercase tracking-tight">Road & Transport Authority</h4>
                        <p className="text-xs font-semibold text-muted-foreground leading-relaxed italic max-w-[280px]">Site Office 22, Al Jaddaf Extension,<br/>Adjacent to Business Bay Link,<br/>Dubai, UAE</p>
                     </div>
                  </div>
                  <div className="p-10 bg-primary/[0.03] border border-primary/20 rounded-[3rem] space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/5">
                           <Clock size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Transit Estimated</p>
                           <p className="text-sm font-black text-foreground italic">Today, Approx 17:45 GST</p>
                        </div>
                     </div>
                     <Separator className="bg-primary/20 opacity-30" />
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/5">
                           <Truck size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Fleet Node</p>
                           <p className="text-sm font-black text-foreground italic">AE-LOG-944-G</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Transit Simulation Deck */}
               <div className="mb-24 relative h-64 bg-muted/10 rounded-[3rem] border border-border/40 overflow-hidden flex items-center justify-center group">
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                  
                  <div className="relative w-full max-w-2xl h-1 border-t-2 border-dashed border-primary/20 flex justify-between items-center px-12">
                     <div className="relative">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center outline outline-8 outline-white shadow-2xl">
                           <MapPin size={24} className="text-primary" />
                        </div>
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Warehouse</span>
                     </div>
                     
                     <div className="relative animate-in slide-in-from-left-[10%] duration-[15000ms] infinite">
                        <div className="p-4 bg-primary rounded-2xl shadow-2xl shadow-primary/30 text-white flex flex-col items-center gap-1">
                           <Truck size={28} className="animate-pulse" />
                           <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-2xl border border-border/40 shadow-xl whitespace-nowrap">
                              <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] italic">In Transit (AE-LOG-944)</span>
                           </div>
                        </div>
                     </div>

                     <div className="relative">
                        <div className="w-12 h-12 bg-muted/60 rounded-full flex items-center justify-center outline outline-8 outline-white shadow-sm">
                           <MapPin size={24} className="text-muted-foreground/30" />
                        </div>
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Site (DXB-M4)</span>
                     </div>
                  </div>
               </div>

               {/* Recipient Affirmation Block */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-24 pt-16 border-t-2 border-dashed border-border/50 items-end">
                  <div className="space-y-8">
                     <div className="flex items-center gap-3">
                        <QrCode size={24} className="text-primary/40" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">POD Compliance Block</h4>
                     </div>
                     <div className="p-10 border-2 border-dashed border-border/40 rounded-[3rem] bg-muted/5 flex flex-col items-center justify-center gap-6 relative group overflow-hidden h-48">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {dnGenerated ? (
                           <div className="flex flex-col items-center gap-4 animate-in zoom-in-95">
                              <ShieldCheck className="text-emerald-500" size={56} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Digital Seal Link Verified</span>
                           </div>
                        ) : (
                           <>
                              <Smartphone className="text-muted-foreground/20 group-hover:scale-110 transition-all" size={48} />
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 text-center leading-relaxed">Finalize to trigger Site Foreman <br/> mobile signature link.</p>
                           </>
                        )}
                     </div>
                  </div>

                  <div className="flex flex-col gap-8">
                     <div className="p-10 bg-primary/[0.03] border border-primary/10 rounded-[3rem] space-y-6 relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none">
                           <Truck size={120} />
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary">Dispatch Commitment</p>
                           <p className="text-sm font-black text-foreground italic leading-tight uppercase">Confirmed Site Handover Mode</p>
                        </div>
                        <Button 
                          onClick={handleGenerateDN}
                          disabled={isGeneratingDN || dnGenerated}
                          className="w-full h-16 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all active:scale-95 group"
                        >
                           {isGeneratingDN ? <Loader2 className="animate-spin" /> : dnGenerated ? <span className="flex items-center gap-2"><CheckCircle size={16} /> DN Authorized</span> : <span className="flex items-center gap-2">Authorize Dispatch <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /></span>}
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Controls - Logistics Deck */}
         <div className="lg:col-span-4 xl:col-span-3 space-y-8 sticky top-28 animate-in slide-in-from-right-8 duration-1000">
            <Card className="border-border/40 bg-background/60 backdrop-blur-xl rounded-[3rem] shadow-2xl overflow-hidden">
               <div className="p-8 pb-4">
                  <h4 className="text-xs font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Lifecycle Deck</h4>
               </div>
               
               <CardContent className="p-8 pt-0 space-y-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-4 p-4 bg-muted/20 border border-border/50 rounded-2xl group hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <Box size={20} />
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-[10px] font-black uppercase tracking-widest text-foreground">POD Mobile Link</p>
                           <p className="text-[8px] text-muted-foreground/60 font-black uppercase tracking-widest opacity-50">Gateway 944</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-muted/20 border border-border/50 rounded-2xl group hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <Download size={20} />
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Delivery Note</p>
                           <p className="text-[8px] text-muted-foreground/60 font-black uppercase tracking-widest opacity-50">Logistics Log</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 bg-amber-50/30 border border-amber-200/50 rounded-[2.5rem] space-y-4 text-center">
                     <AlertCircle size={24} className="mx-auto text-amber-600/40" />
                     <p className="text-[9px] font-black uppercase tracking-widest text-amber-800/60 leading-relaxed italic">
                        Confirming final fulfillment will move the commercial lifecycle to Step 9: Finance Affirmation.
                     </p>
                  </div>

                  <Button 
                    onClick={handleFinalize}
                    disabled={isFinalizing || !dnGenerated}
                    className="w-full h-20 rounded-[2.5rem] bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_15px_40px_rgba(var(--primary),0.3)] group overflow-hidden relative"
                  >
                     <div className="relative z-10 flex items-center gap-4">
                        {isFinalizing ? <Loader2 className="animate-spin" size={20} /> : (
                           <>
                              <span>Dispatch Done</span>
                              <Separator orientation="vertical" className="h-4 bg-white/20" />
                              <CheckCircle size={18} />
                           </>
                        )}
                     </div>
                  </Button>
               </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-4 px-8">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl border border-border/40 hover:bg-muted text-muted-foreground/30"><Printer size={18} /></Button>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl border border-border/40 hover:bg-muted text-muted-foreground/30"><Download size={18} /></Button>
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
