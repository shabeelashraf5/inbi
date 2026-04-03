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
    <div className="w-full space-y-8 pb-32 px-4 md:px-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4">
        <PageHeader 
          title="Client Purchase Order Registration" 
          description="Authenticate and link the incoming PO from the client and verify against the internal quotation." 
        />
        <div className="bg-muted/10 rounded-xl p-2 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.CLIENT_PO} />
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1: Context Bridge */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 px-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground/70">1. Workflow Context Bridge</h2>
           </div>
           
           {!linkedRfq ? (
             <Card className="border-border/40 bg-background/50 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center justify-center text-center gap-6 group hover:border-primary/30 transition-all">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary/30 group-hover:scale-105 transition-transform">
                   <LinkIcon size={32} />
                </div>
                <div className="space-y-1">
                   <h3 className="text-lg font-bold text-foreground tracking-tight">Awaiting Internal Quote Linkage</h3>
                   <p className="text-sm text-muted-foreground font-medium max-w-sm">To verify the incoming PO, we first need to pull the authorized quotation data for RFQ: <span className="font-bold text-primary font-mono">{id}</span></p>
                </div>
                <Button onClick={handleLinkRfq} size="sm" className="h-10 px-8 rounded-lg font-bold uppercase tracking-wider text-[10px]">Fetch Quote Context <ChevronRight size={14} className="ml-2" /></Button>
             </Card>
           ) : (
             <div className="bg-primary/[0.02] border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                      <Briefcase size={24} />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-[8px] font-bold uppercase tracking-wider">Quote Verified</span>
                         <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/40 font-mono italic">{id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground tracking-tight">{linkedRfq.title}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{linkedRfq.client}</p>
                   </div>
                </div>
                <div className="flex items-center gap-8 bg-background p-4 rounded-xl border border-border/40 shadow-sm">
                   <div className="text-right">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-0.5">Items</p>
                      <p className="text-base font-bold text-foreground">{linkedRfq.items} <span className="text-[9px] opacity-40">SKUs</span></p>
                   </div>
                   <Separator orientation="vertical" className="h-8 bg-border/50" />
                   <div className="text-right">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-0.5">Quoted Value</p>
                      <p className="text-base font-bold text-primary">${linkedRfq.quotedValue.toLocaleString()}</p>
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setLinkedRfq(null)} className="h-10 w-10 text-rose-500 hover:bg-rose-50 rounded-xl">
                      <RefreshCcw size={16} />
                   </Button>
                </div>
             </div>
           )}
        </section>

        {/* Section 2: The Verification Document Frame */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <div className="w-1 h-4 bg-primary rounded-full" />
                 <h2 className="text-xs font-bold uppercase tracking-wider text-foreground/70">2. PO Intake Verification</h2>
              </div>
              {status === 'verified' && (
                <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-wider text-[9px]">
                   <ShieldCheck size={14} /> Commercial Affirmation Ready
                </div>
              )}
           </div>

           <div className="bg-background border border-border/40 shadow-xl rounded-2xl overflow-hidden min-h-[500px] flex flex-col items-center justify-center relative p-8 md:p-12">
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

              {!file ? (
                 <div className="w-full max-w-lg group relative border-2 border-dashed border-primary/20 rounded-2xl p-12 text-center bg-primary/[0.01] hover:bg-primary/[0.03] hover:border-primary/40 transition-all cursor-pointer overflow-hidden">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleFileUpload} accept=".pdf" />
                    <div className="flex flex-col items-center gap-6 relative z-10">
                       <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                          <FileUp size={32} />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-lg font-bold text-foreground tracking-tight">Official PO Upload Zone</h3>
                          <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-xs mx-auto">Digitally ingest the client's official PDF Purchase Order for real-time matching.</p>
                       </div>
                       <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider text-primary">
                          PDF / OCR READY <Separator orientation="vertical" className="h-3 bg-primary/20" /> MAX 25MB
                       </div>
                    </div>
                 </div>
              ) : (status === 'uploading' || status === 'analyzing') ? (
                <div className="w-full max-w-md space-y-8 text-center py-12 animate-in scale-95 duration-700">
                   <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
                      <div className="relative w-32 h-32 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                         <Scan size={48} className="animate-pulse" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground tracking-tight uppercase">{status === 'uploading' ? 'Ingesting Document' : 'AI Analysis active'}</h3>
                      <p className="text-xs text-muted-foreground font-medium italic">Running Vision-OCR Extraction...</p>
                   </div>
                   <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
                      <div className={cn(
                         "h-full bg-primary transition-all duration-1000",
                         status === 'uploading' ? "w-1/3" : "w-3/4"
                      )} />
                   </div>
                </div>
              ) : (
                <div className="w-full space-y-12 animate-in slide-in-from-bottom-8 duration-700">
                   <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-border/40 pb-8">
                      <div className="space-y-4">
                         <div className="w-20 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg italic tracking-tighter">INBI</div>
                         <div className="space-y-0.5">
                            <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/30">Registry Entry:</p>
                            <h4 className="text-sm font-bold text-foreground">Purchase Order Receipt Log</h4>
                            <p className="text-[9px] text-muted-foreground uppercase opacity-50 tracking-wider">Commercial Affirmation Node 9.044</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col items-end gap-0.5">
                            <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-600">OCR Confidence</span>
                            <span className="text-2xl font-bold text-emerald-700 italic leading-none">{formData.matchConfidence}%</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                         <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-primary rounded-full" />
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Extracted Affirmations</h3>
                         </div>
                         <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1.5">
                               <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50 ml-0.5">Client PO Serial Number</Label>
                               <div className="relative">
                                  <Input value={formData.poNumber} readOnly className="h-10 font-bold text-xs bg-muted/20 border-emerald-200/50 pl-9" />
                                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" size={16} />
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-1.5">
                                  <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50 ml-0.5">Official PO Date</Label>
                                  <Input value={formData.poDate} readOnly className="h-10 font-bold text-xs bg-muted/20 border-transparent" />
                               </div>
                               <div className="space-y-1.5">
                                  <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50 ml-0.5">Delivery Threshold</Label>
                                  <Input value={formData.deliveryThreshold} readOnly className="h-10 font-bold text-xs bg-muted/20 border-transparent text-emerald-700" />
                               </div>
                            </div>

                            {/* Extracted Items Table */}
                            <div className="space-y-4 pt-4 border-t border-border/40">
                               <p className="text-[9px] font-bold uppercase tracking-wider text-primary">Extracted Line Items (OCR)</p>
                               <div className="overflow-hidden rounded-xl border border-border/40">
                                  <table className="w-full text-[10px]">
                                     <thead>
                                        <tr className="bg-muted/30 h-10 border-b border-border/40">
                                           <th className="text-left px-4 font-bold text-muted-foreground/60 uppercase">Description</th>
                                           <th className="text-center px-2 font-bold text-muted-foreground/60 uppercase">Qty</th>
                                           <th className="text-right px-4 font-bold text-muted-foreground/60 uppercase">Unit Price</th>
                                        </tr>
                                     </thead>
                                     <tbody className="divide-y divide-border/20">
                                        <tr className="h-12 hover:bg-primary/[0.01]">
                                           <td className="px-4 font-bold text-foreground">Structural Steel I-Beam</td>
                                           <td className="text-center font-bold">45</td>
                                           <td className="px-4 text-right font-bold">$85.00</td>
                                        </tr>
                                        <tr className="h-12 hover:bg-primary/[0.01]">
                                           <td className="px-4 font-bold text-foreground">Steel Plate 10mm</td>
                                           <td className="text-center font-bold">118</td>
                                           <td className="px-4 text-right font-bold">$42.00</td>
                                        </tr>
                                     </tbody>
                                  </table>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="relative bg-muted/10 rounded-2xl border border-dashed border-border/50 p-8 flex items-center justify-center group cursor-pointer" onClick={() => toast.info('Expanding PO Preview...')}>
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                             <Search className="text-primary" size={32} />
                          </div>
                          <div className="relative w-full max-w-[200px] aspect-[1/1.414] bg-white shadow-xl rounded-lg p-6 space-y-3">
                             <div className="h-3 w-1/2 bg-muted rounded-full" />
                             <div className="h-3 w-full bg-muted/50 rounded-full" />
                             <Separator />
                             <div className="space-y-1.5">
                                <div className="h-1.5 w-full bg-muted/30 rounded-full" />
                                <div className="h-1.5 w-full bg-muted/30 rounded-full" />
                                <div className="h-1.5 w-3/4 bg-muted/30 rounded-full" />
                             </div>
                             <div className="h-8 w-full border-t-2 border-emerald-500/20 pt-3 mt-6">
                                <div className="h-6 w-1/3 bg-emerald-500/10 rounded ml-auto" />
                             </div>
                          </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-8 border-t border-border/40">
                      <div className="flex items-center gap-8">
                         <div className="space-y-0.5">
                            <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">Document Ref</p>
                            <p className="text-xs font-bold text-foreground italic">{file.name}</p>
                         </div>
                         <div className="space-y-0.5 text-emerald-600">
                            <p className="text-[8px] font-bold uppercase tracking-wider opacity-60">Registry Stat</p>
                            <p className="text-xs font-bold uppercase tracking-wider">Verified Digital Entry</p>
                         </div>
                      </div>
                      <Button variant="ghost" onClick={() => { setFile(null); setStatus('idle'); }} className="h-9 px-4 rounded-lg hover:bg-rose-50 text-rose-500 font-bold uppercase tracking-wider text-[9px]">Discard & Retry <RefreshCcw size={14} className="ml-2" /></Button>
                   </div>
                </div>
              )}
           </div>
        </section>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-500">
         <div className="bg-background/80 backdrop-blur-2xl border-2 border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] rounded-3xl p-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 px-4">
            <div className="hidden md:block">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Items Verified</p>
              <p className="text-sm font-black text-foreground tracking-tighter">3 / 3 SKUs</p>
            </div>
            <Separator orientation="vertical" className="h-8 hidden md:block bg-border/40" />
            <div>
              <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1">Est. Managed GP</p>
              <p className="text-sm font-black text-foreground tracking-tighter">
                +${(linkedRfq ? (linkedRfq.quotedValue - linkedRfq.supplierCost) : 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-11 rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-all">
              <Printer size={16} className="mr-2" /> Print
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={status !== 'verified' || !linkedRfq || isCompleting}
              size="sm"
              className="h-11 rounded-2xl px-10 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-all disabled:opacity-20 shadow-xl"
            >
              {isCompleting ? <Loader2 className="animate-spin mr-2" size={16} /> : (
                <span className="flex items-center gap-2 italic">Verify & Proceed <ArrowRight size={16} /></span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
