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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart3, 
  Box, 
  Camera, 
  CheckCircle2, 
  FileCheck, 
  History, 
  Loader2, 
  Package, 
  QrCode, 
  ShieldAlert, 
  ShieldCheck, 
  Truck,
  Warehouse,
  ArrowRight,
  RefreshCcw,
  Plus,
  Printer,
  Download,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ReceiptItem {
  id: string;
  name: string;
  ordered: number;
  received: number;
  unit: string;
  condition: 'perfect' | 'damaged' | 'none';
  batch: string;
}

export default function GoodsReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanningQC, setIsScanningQC] = useState(false);
  const [qcPhoto, setQcPhoto] = useState<boolean>(false);
  const [status, setStatus] = useState<'draft' | 'receipted'>('draft');
  
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: '1', name: 'Structural Steel I-Beam (HEB 300)', ordered: 45, received: 45, unit: 'pcs', condition: 'none', batch: 'B26-094-A' },
    { id: '2', name: 'Steel Plate 10mm - Grade A', ordered: 120, received: 118, unit: 'pcs', condition: 'none', batch: 'B26-095-S' },
    { id: '3', name: 'High-Tensile Anchor Bolts (M24)', ordered: 500, received: 500, unit: 'pcs', condition: 'none', batch: 'B26-096-B' },
  ]);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: id, href: `/supply-chain/rfq/${id}` },
      { label: 'Warehouse Intake (GRN)' },
    ]);
  }, [setActivePortal, setBreadcrumbs, id]);

  const handleUpdateQty = (itemId: string, qty: number) => {
    setItems(items.map(item => item.id === itemId ? { ...item, received: qty } : item));
  };

  const handleQCScan = () => {
    if (!qcPhoto) return;
    setIsScanningQC(true);
    setTimeout(() => {
       setIsScanningQC(false);
       setItems(items.map(item => ({ ...item, condition: 'perfect' })));
       toast.success('AI Quality Inspection Complete: No Anomalies Detected');
    }, 2500);
  };

  const handleFinalize = () => {
    setIsProcessing(true);
    setTimeout(() => {
       setStatus('receipted');
       setIsProcessing(false);
       toast.success('Inventory Updated: Goods Successfully Received');
       router.push(`/supply-chain/rfq/${id}/delivery`);
    }, 2000);
  };

  const totalOrdered = items.reduce((sum, i) => sum + i.ordered, 0);
  const totalReceived = items.reduce((sum, i) => sum + i.received, 0);
  const variance = totalOrdered - totalReceived;

  return (
    <div className="w-full space-y-12 pb-48 px-2 max-w-[1440px] animate-in fade-in duration-1000">
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Warehouse Intake (GRN)" 
          description="Authenticate physical arrival, perform vision-QC inspections, and generate the official Goods Received Note." 
        />
        <div className="bg-muted/10 rounded-[2.5rem] p-4 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.GOODS_RECEIPT} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
         <div className="lg:col-span-3 space-y-12">
            {/* The GRN Document (A4 Frame) */}
            <div className="bg-background border border-border/40 shadow-[0_45px_120px_-25px_rgba(0,0,0,0.15)] rounded-[4rem] overflow-hidden p-16 md:p-24 relative animate-in slide-in-from-bottom-8 duration-700">
               {/* Document Header */}
               <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24 border-b border-border/40 pb-16">
                  <div className="space-y-6">
                     <div className="w-24 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl italic tracking-tighter">INBI</div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">From Registry:</p>
                        <h4 className="text-sm font-black text-foreground">Goods Received Note (GRN)</h4>
                        <p className="text-[10px] text-muted-foreground uppercase opacity-50 tracking-widest">W-Logistics Cluster UAE</p>
                     </div>
                  </div>
                  <div className="text-right space-y-4">
                     <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none italic">Arrival Verified</h2>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Logistics Ref:</p>
                        <p className="text-xl font-black text-primary font-mono tracking-tighter uppercase">{id}</p>
                        <p className="text-[10px] font-bold text-muted-foreground opacity-50">Intake Date: April 03, 2026</p>
                     </div>
                  </div>
               </div>

               {/* Logistics Heritage Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
                  <div className="p-8 bg-muted/20 border border-border/50 rounded-3xl space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary">Warehouse Assignment</p>
                     <div className="space-y-2">
                        <Select defaultValue="jebel-ali-main">
                           <SelectTrigger className="h-11 border-transparent bg-background shadow-sm font-bold text-xs rounded-xl">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="jebel-ali-main">Jebel Ali Hub (Main)</SelectItem>
                              <SelectItem value="shorthaul-bay-4">Shorthaul Bay 4</SelectItem>
                           </SelectContent>
                        </Select>
                        <p className="text-[9px] text-muted-foreground italic ml-1">Auto-Inventory Sync Active</p>
                     </div>
                  </div>
                  <div className="p-8 bg-muted/5 border border-border/30 rounded-3xl space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Linked PO Heritage</p>
                     <div className="space-y-1">
                        <p className="text-xs font-black text-foreground">PO-BEST-2026-904</p>
                        <p className="text-[10px] font-medium text-muted-foreground">Supplier: Bestway Hardware Ltd</p>
                        <div className="h-1.5 w-full bg-emerald-500/10 rounded-full mt-4 overflow-hidden">
                           <div className="h-full bg-emerald-500 w-full" />
                        </div>
                     </div>
                  </div>
                  <div className="p-8 bg-emerald-500/[0.03] border border-emerald-500/20 rounded-3xl space-y-4 text-center flex flex-col items-center justify-center">
                     <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
                        <Truck size={24} />
                     </div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-emerald-800">Arrival Status</p>
                     <p className="text-xs font-black text-emerald-700 uppercase italic">On Dock: B-14</p>
                  </div>
               </div>

               {/* High-Precision Receipt Grid */}
               <div className="mb-24 overflow-hidden rounded-3xl border border-border/40">
                  <table className="w-full">
                     <thead>
                        <tr className="bg-muted/30 h-16 border-b border-border/50">
                           <th className="text-left px-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-1/3">Verification SKU Spec</th>
                           <th className="text-center px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Ordered</th>
                           <th className="text-center px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-40">Actual Intake</th>
                           <th className="text-right px-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">QC Assurance</th>
                        </tr>
                     </thead>
                     <tbody>
                        {items.map((item, idx) => (
                           <tr key={item.id} className="h-24 border-b border-border/20 last:border-0 hover:bg-primary/[0.01] group transition-colors">
                              <td className="px-10">
                                 <div className="space-y-1">
                                    <p className="text-sm font-black text-foreground uppercase truncate max-w-[250px]">{item.name}</p>
                                    <div className="flex items-center gap-2">
                                       <QrCode size={10} className="text-primary/40" />
                                       <span className="text-[9px] font-black text-muted-foreground/40 font-mono italic">BATCH: {item.batch}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="text-center">
                                 <span className="font-bold text-xs text-muted-foreground/60">{item.ordered} {item.unit}</span>
                              </td>
                              <td className="px-4">
                                 <div className="flex items-center gap-3 justify-center">
                                    <Input 
                                       type="number"
                                       value={item.received}
                                       disabled={status === 'receipted'}
                                       onChange={(e) => handleUpdateQty(item.id, parseInt(e.target.value) || 0)}
                                       className={cn(
                                          "h-10 w-24 text-center font-black text-xs border-transparent transition-all",
                                          item.received < item.ordered ? "bg-amber-100 text-amber-700" : "bg-primary/5 focus:bg-background"
                                       )}
                                    />
                                 </div>
                              </td>
                              <td className="px-10 text-right">
                                 <div className="flex items-center justify-end gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-100">
                                    {item.condition === 'perfect' ? (
                                       <><CheckCircle2 size={12} /><span className="text-[9px] font-black uppercase tracking-widest">Verified</span></>
                                    ) : (
                                       <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 italic">Pre-Intake</span>
                                    )}
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Footnote & QC Affirmation */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-24 pt-16 border-t-2 border-dashed border-border/50 items-end">
                  <div className="space-y-8">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                        <ShieldCheck size={18} /> Vision QC Affirmation Hub
                     </p>
                     <div className="p-8 bg-muted/10 rounded-[2.5rem] border border-border/40 min-h-[180px] flex flex-col items-center justify-center gap-4 group relative overflow-hidden group">
                        {isScanningQC ? (
                           <div className="flex flex-col items-center gap-4 animate-pulse">
                              <Loader2 className="animate-spin text-primary" size={32} />
                              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Structural Scan Active...</span>
                              <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 animate-[scan_2s_ease-in-out_infinite]" />
                           </div>
                        ) : !qcPhoto ? (
                           <>
                              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={() => setQcPhoto(true)} />
                              <Camera className="text-muted-foreground/30 group-hover:scale-110 transition-transform" size={40} />
                              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Upload Pallet Snapshot</span>
                           </>
                        ) : (
                           <div className="flex flex-col items-center gap-4">
                              <Button onClick={handleQCScan} className="h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] px-8">Run AI Diagnosis</Button>
                              <Button variant="ghost" onClick={() => setQcPhoto(false)} className="text-[9px] font-black uppercase tracking-widest text-rose-500">Discard Frame</Button>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="p-10 bg-primary/[0.02] border border-primary/20 rounded-[3rem] space-y-6">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                           <span>Receipt Anomaly Pool</span>
                           <span className={cn("font-bold text-sm", variance > 0 ? "text-rose-600" : "text-emerald-600")}>
                              {variance > 0 ? `- ${variance} Units Short` : 'Full Balance'}
                           </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                           <span>Authorized Intake Total</span>
                           <span className="text-4xl font-black text-foreground italic leading-none">{totalReceived} <span className="text-[10px] opacity-40">SKUs</span></span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Actions */}
         <div className="space-y-8 sticky top-12 animate-in slide-in-from-right-8 duration-700">
            <Card className="border-primary/20 bg-primary/[0.01] rounded-[2.5rem] shadow-2xl overflow-hidden">
               <div className="p-8 bg-primary/5 border-b border-primary/10">
                  <h4 className="text-lg font-black text-foreground tracking-tight">GRN Affinity Zone</h4>
               </div>
               <CardContent className="p-8 space-y-8">
                   <div className="space-y-6">
                     <div className="flex items-center gap-4 p-4 bg-background/50 rounded-2xl border border-border/40 group hover:border-primary/30 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                           <Download size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Download GRN Log</span>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-background/50 rounded-2xl border border-border/40 group hover:border-blue-500/30 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-blue-500/5 rounded-xl flex items-center justify-center text-blue-600">
                           <Printer size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Thermal Receipt</span>
                     </div>
                  </div>

                  <div className="p-6 bg-muted border border-border/50 rounded-[2rem] flex flex-col gap-4 text-center">
                     <History size={24} className="mx-auto text-muted-foreground/30" />
                     <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 leading-relaxed italic">
                        Intake affirmation will trigger Stage 8: Logistics & Delivery Note Dispatch.
                     </p>
                  </div>

                  <Button 
                    onClick={handleFinalize}
                    disabled={isProcessing || status === 'receipted'}
                    className="w-full h-24 rounded-[3rem] bg-primary text-primary-foreground font-black text-lg uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 group shadow-[0_5px_40px_rgba(var(--primary),0.4)]"
                  >
                     {isProcessing ? <Loader2 className="animate-spin" size={32} /> : (
                        <div className="flex flex-col items-center">
                           <span className="text-[10px] mb-1 opacity-60">Supply Node</span>
                           <span className="flex items-center gap-4 italic font-black">Confirm GRN <Separator orientation="vertical" className="h-6 bg-white/20" /> <FileCheck size={24} /></span>
                        </div>
                     )}
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(180px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
