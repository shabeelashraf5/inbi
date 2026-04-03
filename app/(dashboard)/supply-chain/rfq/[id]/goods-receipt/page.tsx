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
    <div className="w-full space-y-8 pb-32 px-4 md:px-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4">
        <PageHeader 
          title="Warehouse Intake (GRN)" 
          description="Authenticate physical arrival, perform vision-QC inspections, and generate the official Goods Received Note." 
        />
        <div className="bg-muted/10 rounded-xl p-2 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.GOODS_RECEIPT} />
        </div>
      </div>

      <div className="space-y-8">
         {/* The GRN Document (A4 Frame) */}
         <div className="bg-background border border-border/40 shadow-xl rounded-2xl overflow-hidden p-12 md:p-16 relative animate-in slide-in-from-bottom-8 duration-700">
            {/* Document Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16 border-b border-border/40 pb-8">
               <div className="space-y-4">
                  <div className="w-20 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg italic tracking-tighter">INBI</div>
                  <div className="space-y-0.5">
                     <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">From Registry:</p>
                     <h4 className="text-sm font-bold text-foreground">Goods Received Note (GRN)</h4>
                     <p className="text-[9px] text-muted-foreground uppercase opacity-50 tracking-wider">W-Logistics Cluster UAE</p>
                  </div>
               </div>
               <div className="text-right space-y-2">
                  <h2 className="text-3xl font-bold text-foreground tracking-tighter uppercase leading-none italic">Arrival Verified</h2>
                  <div className="space-y-0.5">
                     <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">Logistics Ref:</p>
                     <p className="text-lg font-bold text-primary font-mono tracking-tighter uppercase">{id}</p>
                     <p className="text-[9px] font-bold text-muted-foreground opacity-50 uppercase tracking-widest italic">Intake Date: April 03, 2026</p>
                  </div>
               </div>
            </div>

            {/* Logistics Heritage Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
               <div className="p-6 bg-muted/20 border border-border/50 rounded-xl space-y-3">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-primary">Warehouse Assignment</p>
                  <div className="space-y-1.5">
                     <Select defaultValue="jebel-ali-main">
                        <SelectTrigger className="h-10 border-transparent bg-background shadow-sm font-bold text-xs rounded-lg">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="jebel-ali-main">Jebel Ali Hub (Main)</SelectItem>
                           <SelectItem value="shorthaul-bay-4">Shorthaul Bay 4</SelectItem>
                        </SelectContent>
                     </Select>
                     <p className="text-[8px] text-muted-foreground italic ml-1">Auto-Inventory Sync Active</p>
                  </div>
               </div>
               <div className="p-6 bg-muted/5 border border-border/30 rounded-xl space-y-3">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">Linked PO Heritage</p>
                  <div className="space-y-0.5">
                     <p className="text-xs font-bold text-foreground">PO-BEST-2026-904</p>
                     <p className="text-[10px] font-medium text-muted-foreground">Bestway Hardware Ltd</p>
                     <div className="h-1 w-full bg-emerald-500/10 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-emerald-500 w-full" />
                     </div>
                  </div>
               </div>
               <div className="p-6 bg-emerald-500/[0.03] border border-emerald-500/20 rounded-xl space-y-3 text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 mb-1">
                     <Truck size={20} />
                  </div>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-800">Arrival Status</p>
                  <p className="text-xs font-bold text-emerald-700 uppercase italic">On Dock: B-14</p>
               </div>
            </div>

            {/* High-Precision Receipt Grid */}
            <div className="mb-16 overflow-hidden rounded-xl border border-border/40">
               <table className="w-full">
                  <thead>
                     <tr className="bg-muted/30 h-12 border-b border-border/50">
                        <th className="text-left px-8 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 w-1/3">Verification SKU Spec</th>
                        <th className="text-center px-4 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Ordered</th>
                        <th className="text-center px-4 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 w-40">Actual Intake</th>
                        <th className="text-right px-8 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">QC Assurance</th>
                     </tr>
                  </thead>
                  <tbody>
                     {items.map((item, idx) => (
                        <tr key={item.id} className="h-16 border-b border-border/20 last:border-0 hover:bg-primary/[0.01] group transition-colors">
                           <td className="px-8">
                              <div className="space-y-0.5">
                                 <p className="text-xs font-bold text-foreground uppercase truncate max-w-[250px]">{item.name}</p>
                                 <div className="flex items-center gap-2">
                                    <QrCode size={10} className="text-primary/40" />
                                    <span className="text-[8px] font-bold text-muted-foreground/40 font-mono italic">BATCH: {item.batch}</span>
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
                                       "h-8 w-20 text-center font-bold text-xs border-transparent transition-all",
                                       item.received < item.ordered ? "bg-amber-100 text-amber-700" : "bg-primary/5 focus:bg-background shadow-none"
                                    )}
                                 />
                              </div>
                           </td>
                           <td className="px-8 text-right">
                              <div className="inline-flex items-center justify-end gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                                 {item.condition === 'perfect' ? (
                                    <><CheckCircle2 size={10} /><span className="text-[8px] font-bold uppercase tracking-wider">Verified</span></>
                                 ) : (
                                    <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/30 italic">Pre-Intake</span>
                                 )}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Footnote & QC Affirmation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t border-border/40 items-end">
               <div className="space-y-6">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                     <ShieldCheck size={14} /> Vision QC Affirmation Hub
                  </p>
                  <div className="p-6 bg-muted/10 rounded-xl border border-border/40 min-h-[140px] flex flex-col items-center justify-center gap-3 group relative overflow-hidden">
                     {isScanningQC ? (
                        <div className="flex flex-col items-center gap-3 animate-pulse">
                           <Loader2 className="animate-spin text-primary" size={24} />
                           <span className="text-[8px] font-bold uppercase tracking-wider text-primary">Structural Scan Active...</span>
                           <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/40 animate-[scan_2s_ease-in-out_infinite]" />
                        </div>
                     ) : !qcPhoto ? (
                        <>
                           <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={() => setQcPhoto(true)} />
                           <Camera className="text-muted-foreground/30 group-hover:scale-110 transition-transform" size={32} />
                           <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">Upload Pallet Snapshot</span>
                        </>
                     ) : (
                        <div className="flex flex-col items-center gap-3">
                           <Button onClick={handleQCScan} size="sm" className="h-9 rounded-lg font-bold uppercase tracking-wider text-[9px] px-6">Run AI Diagnosis</Button>
                           <Button variant="ghost" size="sm" onClick={() => setQcPhoto(false)} className="text-[8px] font-bold uppercase tracking-wider text-rose-500 h-6">Discard Frame</Button>
                        </div>
                     )}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="p-8 bg-primary/[0.02] border border-primary/20 rounded-2xl space-y-4">
                     <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50">
                        <span>Receipt Anomaly Pool</span>
                        <span className={cn("font-bold text-xs text-right", variance > 0 ? "text-rose-600" : "text-emerald-600")}>
                           {variance > 0 ? `- ${variance} Units Short` : 'Full Balance'}
                        </span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-primary">
                        <span>Authorized Intake</span>
                        <span className="text-3xl font-bold text-foreground italic leading-none">{totalReceived} <span className="text-[9px] opacity-40">SKUs</span></span>
                     </div>
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
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Intake Total</p>
              <p className="text-sm font-black text-foreground tracking-tighter">{totalReceived} SKUs Received</p>
            </div>
            <Separator orientation="vertical" className="h-8 hidden md:block bg-border/40" />
            <div>
              <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1">Receipt Variance</p>
              <p className={cn("text-sm font-black tracking-tighter uppercase italic", variance > 0 ? "text-rose-600" : "text-emerald-600")}>
                {variance > 0 ? `${variance} Units Variance` : 'Zero Discrepancy'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-11 rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-all">
              <Printer size={16} className="mr-2" /> Print GRN
            </Button>
            <Button 
              onClick={handleFinalize}
              disabled={isProcessing || status === 'receipted'}
              size="sm"
              className="h-11 rounded-xl px-10 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-all disabled:opacity-20 shadow-xl"
            >
              {isProcessing ? <Loader2 className="animate-spin mr-2" size={16} /> : (
                <span className="flex items-center gap-2 italic">Confirm GRN <FileCheck size={16} /></span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0; }
        }
      `}</style>
    </div>

  );
}
