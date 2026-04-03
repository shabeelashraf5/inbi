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
  CheckCircle,
  Scan,
  ShieldAlert,
  ArrowLeft,
  ChevronRight,
  Printer,
  Download,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

export default function ClientPOPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const router = useRouter();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [linkedRfq, setLinkedRfq] = useState<any | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'verified'>('idle');
  
  // Affirmation Form State
  const [formData, setFormData] = useState({
    poNumber: '',
    poDate: '',
    paymentTerms: '',
    deliveryThreshold: '',
    matchConfidence: 0
  });

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: id, href: `/supply-chain/rfq/${id}` },
      { label: 'Client PO Registration' },
    ]);
  }, [setActivePortal, setBreadcrumbs, id]);

  const handleLinkRfq = () => {
    setLinkedRfq({
      id: id,
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
      setFile(selectedFile);
      setStatus('uploading');
      setIsUploading(true);
      
      setTimeout(() => {
        setIsUploading(false);
        setStatus('analyzing');
        setIsAnalyzing(true);
        toast.info('AI Engine: Extracting PO metadata via Vision OCR...');
        
        setTimeout(() => {
           setIsAnalyzing(false);
           setStatus('verified');
           setFormData({
              poNumber: 'RTA-PO-2026-944-B',
              poDate: '2026-04-03',
              paymentTerms: '50% Advance / 50% PDC on Site',
              deliveryThreshold: '2026-05-15',
              matchConfidence: 98.4
           });
           toast.success('AI Verification Complete: 100% Item Match Found');
        }, 3000);
      }, 1500);
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
       toast.success('Client PO Verified & Logged: Proceeding to Sourcing Dispatch');
       router.push(`/supply-chain/rfq/${id}/supplier-po`);
    }, 2000);
  };

  return (
    <div className="w-full space-y-12 pb-48 px-2 max-w-[1440px] animate-in fade-in duration-1000">
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Client Purchase Order Registration" 
          description="Authenticate and link the incoming PO from the client and verify against the authorized internal quotation." 
        />
        <div className="bg-muted/10 rounded-[2.5rem] p-4 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.CLIENT_PO} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        <div className="lg:col-span-3 space-y-12">
          {/* Section 1: Context Bridge */}
          <section className="space-y-4">
             <div className="flex items-center gap-3 px-6">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">1. Workflow Context Bridge</h2>
             </div>
             
             {!linkedRfq ? (
               <Card className="shadow-2xl border-border/40 bg-background/50 backdrop-blur-md rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center gap-8 group hover:border-primary/30 transition-all">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2.2rem] flex items-center justify-center text-primary/30 group-hover:scale-110 transition-transform shadow-xl">
                     <LinkIcon size={40} />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Awaiting Internal Quote Linkage</h3>
                     <p className="text-sm text-muted-foreground font-medium max-w-sm">To verify the incoming PO, we first need to pull the authorized quotation data for RFQ: <span className="font-bold text-primary font-mono">{id}</span></p>
                  </div>
                  <Button onClick={handleLinkRfq} size="lg" className="h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20">Fetch Quote Context <ChevronRight size={16} className="ml-2" /></Button>
               </Card>
             ) : (
               <div className="bg-primary/[0.02] border border-primary/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-12 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-8">
                     <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-2xl shadow-primary/10">
                        <Briefcase size={36} />
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-[9px] font-black uppercase tracking-widest">Quote Verified</span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 font-mono italic">{id} Reference</span>
                        </div>
                        <h3 className="text-2xl font-black text-foreground tracking-tight">{linkedRfq.title}</h3>
                        <p className="text-xs text-muted-foreground font-medium mt-1">{linkedRfq.client}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-12 bg-background p-6 rounded-[2rem] border border-border/40 shadow-sm">
                     <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Items in Quote</p>
                        <p className="text-xl font-black text-foreground">{linkedRfq.items} <span className="text-[10px] opacity-40">SKUs</span></p>
                     </div>
                     <Separator orientation="vertical" className="h-12 bg-border/50" />
                     <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Quoted Net Value</p>
                        <p className="text-xl font-black text-primary italic">${linkedRfq.quotedValue.toLocaleString()}</p>
                     </div>
                     <Button variant="ghost" size="icon" onClick={() => setLinkedRfq(null)} className="h-12 w-12 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                        <RefreshCcw size={20} />
                     </Button>
                  </div>
               </div>
             )}
          </section>

          {/* Section 2: The Verification Document Frame */}
          <section className="space-y-6">
             <div className="flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-primary rounded-full" />
                   <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">2. PO Intake Verification Document</h2>
                </div>
                {status === 'verified' && (
                  <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-widest text-[10px]">
                     <ShieldCheck size={16} /> Commercial Affirmation Ready
                  </div>
                )}
             </div>

             <div className="bg-background border border-border/40 shadow-[0_45px_120px_-25px_rgba(0,0,0,0.15)] rounded-[4rem] overflow-hidden min-h-[600px] flex flex-col items-center justify-center relative p-16 md:p-24">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                {!file ? (
                   <div className="w-full max-w-xl group relative border-4 border-dashed border-primary/20 rounded-[3rem] p-20 text-center bg-primary/[0.01] hover:bg-primary/[0.03] hover:border-primary/40 transition-all cursor-pointer overflow-hidden animate-in zoom-in-95 duration-500">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleFileUpload} accept=".pdf" />
                      <div className="flex flex-col items-center gap-8 relative z-10">
                         <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary group-hover:scale-125 transition-transform shadow-2xl shadow-primary/20">
                            <FileUp size={40} />
                         </div>
                         <div className="space-y-3">
                            <h3 className="text-2xl font-black text-foreground tracking-tight">Official PO Upload Zone</h3>
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-xs mx-auto">Digitally ingest the client's official PDF Purchase Order for real-time commercial matching.</p>
                         </div>
                         <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                            Supported: PDF / OCR Ready <Separator orientation="vertical" className="h-3 bg-primary/20" /> Max 25MB
                         </div>
                      </div>
                      {/* Scanning Line Animation Mockup */}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-10 transition-opacity" />
                   </div>
                ) : (status === 'uploading' || status === 'analyzing') ? (
                  <div className="w-full max-w-2xl space-y-12 text-center animate-in scale-95 duration-700">
                     <div className="relative w-48 h-48 mx-auto">
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
                        <div className="relative w-48 h-48 bg-primary/10 rounded-[3.5rem] flex items-center justify-center text-primary shadow-inner">
                           <Scan size={80} className="animate-pulse" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-3xl font-black text-foreground tracking-tight uppercase">{status === 'uploading' ? 'Ingesting Document' : 'AI Analysis Active'}</h3>
                        <p className="text-sm text-muted-foreground font-medium italic">Running Vision-OCR Extraction on metadata nodes...</p>
                     </div>
                     <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                        <div className={cn(
                           "h-full bg-primary transition-all duration-1000",
                           status === 'uploading' ? "w-1/3" : "w-3/4"
                        )} />
                     </div>
                     <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Searching for PO# ... Found</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Authenticating TRN ... Verified</span>
                     </div>
                  </div>
                ) : (
                  <div className="w-full space-y-16 animate-in slide-in-from-bottom-8 duration-700">
                     {/* Letterhead Header for PO Intake */}
                     <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-border/40 pb-16">
                        <div className="space-y-6">
                           <div className="w-24 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl italic tracking-tighter">INBI</div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">Registry Entry:</p>
                              <h4 className="text-sm font-black text-foreground">Purchase Order Receipt Log</h4>
                              <p className="text-[10px] text-muted-foreground uppercase opacity-50 tracking-widest">Commercial Affirmation Node 9.044</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-end gap-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">OCR Confidence Score</span>
                              <span className="text-3xl font-black text-emerald-700 italic leading-none">{formData.matchConfidence}%</span>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* Extracted Form Detail */}
                        <div className="space-y-10 group">
                           <div className="flex items-center gap-3">
                              <div className="w-1.5 h-6 bg-primary rounded-full group-hover:h-8 transition-all" />
                              <h3 className="text-lg font-black text-foreground uppercase tracking-widest">Extracted Affirmations</h3>
                           </div>
                           <div className="grid grid-cols-1 gap-8">
                              <div className="space-y-2">
                                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Client PO Serial Number</Label>
                                 <div className="relative">
                                    <Input value={formData.poNumber} readOnly className="h-12 font-black text-sm bg-muted/20 border-emerald-200/50 pl-10" />
                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                                 </div>
                              </div>
                              <div className="grid grid-cols-2 gap-8">
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Official PO Date</Label>
                                    <Input value={formData.poDate} readOnly className="h-12 font-black text-sm bg-muted/20 border-transparent" />
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Delivery Threshold</Label>
                                    <Input value={formData.deliveryThreshold} readOnly className="h-12 font-black text-sm bg-muted/20 border-transparent text-emerald-700" />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Primary Payment Terms</Label>
                                 <div className="relative">
                                    <Input value={formData.paymentTerms} readOnly className="h-12 font-black text-sm bg-muted/20 border-transparent pl-10" />
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={18} />
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Physical Document Mini Preview */}
                        <div className="relative bg-muted/10 rounded-[3rem] border border-dashed border-border/50 p-10 overflow-hidden flex items-center justify-center group cursor-pointer" onClick={() => toast.info('Expanding PO Preview...')}>
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                               <Search className="text-primary" size={48} />
                            </div>
                            <div className="relative w-full max-w-[280px] aspect-[1/1.414] bg-white shadow-2xl rounded-xl p-8 space-y-4 animate-in zoom-in-95 duration-700">
                               <div className="h-4 w-1/2 bg-muted rounded-full" />
                               <div className="h-4 w-full bg-muted/50 rounded-full" />
                               <Separator />
                               <div className="space-y-2">
                                  <div className="h-2 w-full bg-muted/30 rounded-full" />
                                  <div className="h-2 w-full bg-muted/30 rounded-full" />
                                  <div className="h-2 w-3/4 bg-muted/30 rounded-full" />
                               </div>
                               <div className="h-12 w-full border-t-4 border-emerald-500/20 pt-4 mt-8">
                                  <div className="h-8 w-1/3 bg-emerald-500/10 rounded-lg ml-auto" />
                               </div>
                               <div className="absolute bottom-6 left-6 right-6 h-10 border-t-2 border-primary/20 pt-4 flex flex-col items-center">
                                  <span className="text-[8px] font-black text-primary/40 uppercase tracking-widest italic opacity-50">Authorized PO Digital Clone</span>
                               </div>
                            </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-12 border-t border-border/40">
                        <div className="flex items-center gap-12">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Document Ref</p>
                              <p className="text-xs font-black text-foreground italic">{file.name}</p>
                           </div>
                           <div className="space-y-1 text-emerald-600">
                              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Registry Stat</p>
                              <p className="text-xs font-black uppercase tracking-widest">Verified Digital Entry</p>
                           </div>
                        </div>
                        <Button variant="ghost" onClick={() => { setFile(null); setStatus('idle'); }} className="h-12 px-6 rounded-2xl hover:bg-rose-50 text-rose-500 font-black uppercase tracking-widest text-[9px]">Discard & Retry <RefreshCcw size={16} className="ml-2" /></Button>
                     </div>
                  </div>
                )}
             </div>
          </section>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8 sticky top-12 animate-in slide-in-from-right-8 duration-700">
           <Card className="border-primary/20 bg-primary/[0.01] rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-8 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
                 <h4 className="text-lg font-black text-foreground tracking-tight">Receipt Affirmation</h4>
                 <ShieldCheck size={20} className={cn(status === 'verified' ? "text-emerald-500" : "text-muted-foreground/20")} />
              </div>
              <CardContent className="p-8 space-y-8">
                 <div className="space-y-6">
                    <div className="flex justify-between items-center text-muted-foreground/60 border-b border-border/50 pb-4">
                       <span className="text-[10px] font-black uppercase tracking-widest">Items Verified</span>
                       <span className="font-mono text-sm font-bold text-foreground">3 / 3 SKUs</span>
                    </div>
                    <div className="flex justify-between items-center group">
                       <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Est. Managed GP</span>
                          <p className="text-2xl font-black text-foreground tracking-tighter">
                             +${(linkedRfq ? (linkedRfq.quotedValue - linkedRfq.supplierCost) : 0).toLocaleString()}
                          </p>
                       </div>
                       <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                          <TrendingUp size={24} />
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-muted border border-border/50 rounded-[2.5rem] space-y-6">
                    <div className="flex items-center gap-3">
                       <ShieldAlert size={20} className="text-primary/40" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 tracking-[0.2em]">Compliance Deck</span>
                    </div>
                    <p className="text-[10px] leading-relaxed text-muted-foreground/40 font-black uppercase tracking-widest text-center">
                       Affirming intake will trigger immediate sub-supplier PO dispatch based on approved Strategy 2.04
                    </p>
                 </div>

                 <Button 
                    onClick={handleComplete}
                    disabled={status !== 'verified' || !linkedRfq || isCompleting}
                    className="w-full h-24 rounded-[3rem] bg-foreground text-background font-black text-lg uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 group shadow-[0_5px_40px_rgba(0,0,0,0.2)] disabled:opacity-20"
                 >
                    {isCompleting ? <Loader2 className="animate-spin" size={32} /> : (
                       <div className="flex flex-col items-center">
                          <span className="text-[9px] mb-1 opacity-50">Lifecycle Action</span>
                          <span className="flex items-center gap-4 italic font-black">Verify & Proceed <ArrowRight size={24} /></span>
                       </div>
                    )}
                 </Button>
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
