'use client';

import React, { useEffect, useState, use } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  CheckCircle, 
  Download, 
  FileText, 
  FileCheck, 
  Send, 
  ArrowLeft, 
  Printer, 
  Package, 
  ShieldCheck, 
  ChevronRight,
  MoreVertical,
  History,
  CreditCard,
  Truck,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

interface POItem {
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
}

interface Vendor {
  name: string;
  address: string;
  trn: string;
  contact: string;
  email: string;
  items: POItem[];
  status: 'pending' | 'authorized' | 'dispatched';
}

export default function SupplierPOPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const router = useRouter();
  
  const [selectedVendorIdx, setSelectedVendorIdx] = useState<number | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // High-precision mock data for selected sub-suppliers
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      name: 'Bestway Hardware Ltd',
      address: 'Plot 4, Industrial Area 3, Jebel Ali Freezone, Dubai, UAE',
      trn: '100034490200003',
      contact: 'John Smith (+971 50 123 4567)',
      email: 'sales@bestwayhardware.ae',
      status: 'pending',
      items: [
        { sku: 'HEB-300-S', name: 'Structural Steel I-Beam (HEB 300) - Grade 50', qty: 45, unitPrice: 85, total: 3825 },
        { sku: 'PLT-10-A', name: 'Steel Plate 10mm - Grade A (2440x1220)', qty: 120, unitPrice: 42, total: 5040 }
      ]
    },
    {
      name: 'SteelCo Manufacturing',
      address: 'Al Quoz Industrial Area 4, Street 25, Dubai, UAE',
      trn: '100455610200103',
      contact: 'Ahmed Ali (+971 55 987 6543)',
      email: 'logistics@steelcomfg.com',
      status: 'pending',
      items: [
        { sku: 'BOLT-M24-HT', name: 'High-Tensile Anchor Bolts (M24 x 600mm)', qty: 500, unitPrice: 24, total: 12000 }
      ]
    }
  ]);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: id, href: `/supply-chain/rfq/${id}` },
      { label: 'Supplier PO Generation' },
    ]);
  }, [setActivePortal, setBreadcrumbs, id]);

  const handleAuthorize = (idx: number) => {
    setIsAuthorizing(true);
    setTimeout(() => {
       const newVendors = [...vendors];
       newVendors[idx].status = 'authorized';
       setVendors(newVendors);
       setIsAuthorizing(false);
       toast.success(`Purchase Order for ${vendors[idx].name} Authorized`);
    }, 1500);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
       setIsDownloading(false);
       toast.success('PO Document (PDF) Generated: Downloading...');
    }, 1200);
  };

  const handleFinalDispatch = () => {
     const allAuthorized = vendors.every(v => v.status === 'authorized' || v.status === 'dispatched');
     if (!allAuthorized) {
        toast.error('Please authorize all Purchase Orders before final dispatch.');
        return;
     }
     toast.success('All Supplier POs Dispatched and Notified');
     router.push(`/supply-chain/rfq/${id}/goods-receipt`);
  };

  const selectedVendor = selectedVendorIdx !== null ? vendors[selectedVendorIdx] : null;
  const subtotal = selectedVendor?.items.reduce((acc, item) => acc + item.total, 0) || 0;

  return (
    <div className="w-full space-y-12 pb-48 px-2 max-w-[1440px] animate-in fade-in duration-1000">
      {/* Header & Timeline */}
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Supplier Purchase Order Portal" 
          description="View, verify, and generate official Purchase Orders for authorized sub-suppliers." 
        />
        <div className="bg-muted/10 rounded-[2.5rem] p-4 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.SUPPLIER_PO} />
        </div>
      </div>

      {selectedVendorIdx === null ? (
        /* VENDOR QUEUE LIST (MASTER) */
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
           <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-primary rounded-full" />
                 <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">Supplier Purchase Orders Queue</h2>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {vendors.map((vendor, idx) => (
                 <Card key={idx} className="group relative border-border/40 bg-background/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/[0.02] hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelectedVendorIdx(idx)}>
                    <CardContent className="p-10 flex flex-col justify-between h-full space-y-12">
                       <div className="flex items-start justify-between">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 bg-primary/10 rounded-[1.8rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl shadow-primary/10">
                                <Building size={28} />
                             </div>
                             <div>
                                <h3 className="text-xl font-black text-foreground tracking-tight">{vendor.name}</h3>
                                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/50 mt-1">TRN: {vendor.trn}</p>
                             </div>
                          </div>
                          <div className={cn(
                             "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                             vendor.status === 'authorized' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                          )}>
                             {vendor.status}
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Procured Items</p>
                             <p className="text-lg font-black text-foreground">{vendor.items.length} SKUs</p>
                          </div>
                          <div className="space-y-1 text-right">
                             <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Order Value</p>
                             <p className="text-lg font-black text-primary font-mono">${vendor.items.reduce((s, i) => s + i.total, 0).toLocaleString()}</p>
                          </div>
                       </div>

                       <Button variant="ghost" className="w-full h-12 rounded-2xl bg-muted/20 hover:bg-primary hover:text-white transition-all group/btn font-black uppercase tracking-widest text-[9px]">
                          Review PO Form <ChevronRight size={14} className="ml-2 group-hover/btn:translate-x-1" />
                       </Button>
                    </CardContent>
                 </Card>
              ))}
           </div>

           <div className="flex justify-center pt-8">
              <Button 
                onClick={handleFinalDispatch}
                className="h-20 px-16 rounded-[2rem] bg-primary text-primary-foreground font-black text-lg uppercase tracking-[0.3em] transition-all hover:scale-[1.02] shadow-[0_20px_50px_rgba(var(--primary),0.3)] group"
              >
                 Commit Final Dispatch <Send size={24} className="ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
           </div>
        </div>
      ) : (
        /* PO DOCUMENT FORM (DETAIL) */
        <div className="space-y-12 animate-in slide-in-from-right-8 duration-700">
           {/* Form Header */}
           <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedVendorIdx(null)}
                className="h-14 px-6 rounded-2xl hover:bg-muted/50 font-black uppercase tracking-widest text-[10px] group"
              >
                 <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1" /> Back to Vendor Queue
              </Button>
              <div className="flex items-center gap-4">
                 <Button variant="outline" className="h-14 px-8 rounded-2xl border-border/50 font-black uppercase tracking-widest text-[10px]"><Printer size={16} className="mr-2" /> Print Preview</Button>
                 <Button onClick={handleDownload} disabled={isDownloading} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-muted-foreground hover:bg-foreground">
                    {isDownloading ? <Loader2 className="animate-spin" size={16} /> : <><Download size={16} className="mr-2" /> Download PDF</>}
                 </Button>
              </div>
           </div>

           {/* The PO Document */}
           <div className="bg-background border border-border/40 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] rounded-[4rem] overflow-hidden max-w-[1000px] mx-auto p-16 md:p-24 relative">
              {/* Official Stamp Mockup */}
              <div className="absolute top-24 right-24 rotate-12 opacity-10 pointer-events-none">
                 <div className="w-40 h-40 border-8 border-primary rounded-full flex flex-col items-center justify-center text-primary font-black uppercase text-xl leading-none">
                    <span>Authorized</span>
                    <span className="text-[10px] mt-1 tracking-widest">INBI-PO-944</span>
                 </div>
              </div>

              {/* Document Header */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
                 <div className="space-y-6">
                    <div className="w-24 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl italic tracking-tighter">INBI</div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">From:</p>
                       <p className="text-xs font-black text-foreground">INBI Technical Solutions LLC</p>
                       <p className="text-[10px] text-muted-foreground leading-relaxed max-w-[250px]">Suite 405, Business Bay Tower,<br/>Downtown Dubai, UAE.<br/>TRN: 100994401200003</p>
                    </div>
                 </div>
                 <div className="text-right space-y-6">
                    <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase">Purchase Order</h2>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">PO Serial Number:</p>
                       <p className="text-lg font-black text-primary font-mono tracking-tighter">PO-{id}-V0{selectedVendorIdx + 1}</p>
                       <p className="text-[10px] font-bold text-muted-foreground">Date: April 03, 2026</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
                 <div className="p-8 bg-muted/20 border border-border/50 rounded-3xl space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">To: (Supplier)</p>
                    <div className="space-y-1">
                       <h4 className="text-lg font-black text-foreground">{selectedVendor?.name}</h4>
                       <p className="text-xs font-medium text-muted-foreground leading-relaxed">{selectedVendor?.address}</p>
                       <p className="text-[10px] font-black text-foreground mt-2 uppercase tracking-widest">Attn: {selectedVendor?.contact}</p>
                    </div>
                 </div>
                 <div className="p-8 bg-muted/5 border border-border/30 rounded-3xl space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Ship To: (Delivery Location)</p>
                    <div className="space-y-1">
                       <h4 className="text-lg font-black text-foreground">Dubai Metro Site - Phase 4</h4>
                       <p className="text-xs font-medium text-muted-foreground leading-relaxed">Jumeirah Village Circle Link,<br/>Dubai, UAE</p>
                       <p className="text-[10px] font-black text-primary mt-2 uppercase tracking-widest">Ref RFQ: {id}</p>
                    </div>
                 </div>
              </div>

              {/* Line Items Table */}
              <div className="mb-24">
                 <table className="w-full">
                    <thead>
                       <tr className="border-b border-border/50 h-14">
                          <th className="text-left py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Item (SKU)</th>
                          <th className="text-center py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Qty</th>
                          <th className="text-right py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Unit (Ex)</th>
                          <th className="text-right py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Total (Ex)</th>
                       </tr>
                    </thead>
                    <tbody>
                       {selectedVendor?.items.map((item, i) => (
                          <tr key={i} className="border-b border-border/30 h-20 group">
                             <td className="py-6">
                                <p className="text-sm font-black text-foreground">{item.name}</p>
                                <p className="text-[9px] font-mono text-muted-foreground/50 group-hover:text-primary transition-colors">{item.sku}</p>
                             </td>
                             <td className="text-center font-bold text-sm text-foreground">{item.qty}</td>
                             <td className="text-right font-black text-sm text-muted-foreground/70">${item.unitPrice.toLocaleString()}</td>
                             <td className="text-right font-black text-sm text-foreground italic">${item.total.toLocaleString()}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              {/* Commercial Summary */}
              <div className="flex flex-col items-end space-y-6 mb-24">
                 <div className="w-full md:w-80 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                       <span className="font-black uppercase tracking-[0.15em] text-muted-foreground/50 text-[10px]">Net Value (Ex VAT)</span>
                       <span className="font-black text-foreground">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="font-black uppercase tracking-[0.15em] text-muted-foreground/50 text-[10px]">VAT Amount (5%)</span>
                       <span className="font-black text-foreground">${(subtotal * 0.05).toLocaleString()}</span>
                    </div>
                    <Separator className="bg-border/50 h-0.5" />
                    <div className="flex justify-between items-center py-2">
                       <span className="font-black uppercase tracking-[0.2em] text-primary text-[11px]">Authorized Total</span>
                       <span className="font-black text-3xl text-foreground tracking-tighter italic">
                          ${(subtotal * 1.05).toLocaleString()}
                       </span>
                    </div>
                 </div>
              </div>

              {/* Approvals & Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end">
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">PO Terms & Conditions</h4>
                    <p className="text-[9px] text-muted-foreground leading-relaxed">
                       1. This Purchase Order is valid only with an authorized digital stamp.<br/>
                       2. Payment terms as per Master Service Agreement (MSA).<br/>
                       3. Goods must be delivered within 14 business days of authorization.<br/>
                       4. TRN linkage is mandatory for VAT reconciliation.
                    </p>
                 </div>
                 <div className="space-y-8 flex flex-col items-center">
                    <div className="w-full p-10 border-2 border-dashed border-border/60 rounded-3xl bg-muted/5 flex flex-col items-center justify-center group relative overflow-hidden h-40">
                       {selectedVendor?.status === 'authorized' ? (
                          <div className="flex flex-col items-center animate-in zoom-in-90 gap-4">
                             <ShieldCheck className="text-emerald-500 scale-[2.5]" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-4">Procurement Authorization Verified</span>
                          </div>
                       ) : (
                         <>
                           <FileCheck className="text-muted-foreground/20 group-hover:text-primary transition-all scale-[2]" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-8 group-hover:text-primary transition-all">Procurement Officer Seal</span>
                         </>
                       )}
                    </div>
                    
                    {selectedVendor?.status !== 'authorized' && (
                       <Button 
                        onClick={() => handleAuthorize(selectedVendorIdx)} 
                        disabled={isAuthorizing}
                        className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                       >
                          {isAuthorizing ? <Loader2 className="animate-spin" /> : 'Authorize Purchase Order'}
                       </Button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
