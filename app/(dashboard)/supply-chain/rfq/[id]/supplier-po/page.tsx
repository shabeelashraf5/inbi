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
    <div className="w-full space-y-8 pb-32 px-4 md:px-10 animate-in fade-in duration-700">
      {/* Header & Timeline */}
      <div className="flex flex-col gap-4">
        <PageHeader 
          title="Supplier Purchase Order Portal" 
          description="View, verify, and generate official Purchase Orders for authorized sub-suppliers." 
        />
        <div className="bg-muted/10 rounded-xl p-2 border border-border/50">
           <WorkflowTimeline currentStage={WorkflowStage.SUPPLIER_PO} />
        </div>
      </div>

      {selectedVendorIdx === null ? (
        /* VENDOR QUEUE LIST (MASTER) */
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <div className="w-1 h-4 bg-primary rounded-full" />
                 <h2 className="text-xs font-bold uppercase tracking-wider text-foreground/70">Supplier Purchase Orders Queue</h2>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vendors.map((vendor, idx) => (
                 <Card key={idx} className="group relative border-border/40 bg-background/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelectedVendorIdx(idx)}>
                    <CardContent className="p-6 flex flex-col justify-between h-full space-y-8">
                       <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                <Building size={24} />
                             </div>
                             <div>
                                <h3 className="text-lg font-bold text-foreground tracking-tight">{vendor.name}</h3>
                                <p className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/50 mt-0.5">TRN: {vendor.trn}</p>
                             </div>
                          </div>
                          <div className={cn(
                             "px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider border",
                             vendor.status === 'authorized' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                          )}>
                             {vendor.status}
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-0.5">
                             <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">Procured Items</p>
                             <p className="text-base font-bold text-foreground">{vendor.items.length} SKUs</p>
                          </div>
                          <div className="space-y-0.5 text-right">
                             <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">Order Value</p>
                             <p className="text-base font-bold text-primary font-mono">${vendor.items.reduce((s, i) => s + i.total, 0).toLocaleString()}</p>
                          </div>
                       </div>

                       <Button variant="ghost" size="sm" className="w-full h-9 rounded-lg bg-muted/20 hover:bg-primary hover:text-white transition-all group/btn font-bold uppercase tracking-wider text-[9px]">
                          Review PO Form <ChevronRight size={14} className="ml-2 group-hover/btn:translate-x-1" />
                       </Button>
                    </CardContent>
                 </Card>
              ))}
           </div>
        </div>
      ) : (
        /* PO DOCUMENT FORM (DETAIL) */
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
           {/* Form Header */}
           <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedVendorIdx(null)}
                className="h-10 px-4 rounded-lg hover:bg-muted/50 font-bold uppercase tracking-wider text-[9px] group"
              >
                 <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1" /> Back to Queue
              </Button>
              <div className="flex items-center gap-3">
                 <Button variant="outline" size="sm" className="h-10 px-4 rounded-lg border-border/50 font-bold uppercase tracking-wider text-[9px]"><Printer size={16} className="mr-2" /> Print</Button>
                 <Button onClick={handleDownload} disabled={isDownloading} size="sm" className="h-10 px-4 rounded-lg font-bold uppercase tracking-wider text-[9px] bg-muted-foreground hover:bg-foreground">
                    {isDownloading ? <Loader2 className="animate-spin" size={16} /> : <><Download size={16} className="mr-2" /> Export PDF</>}
                 </Button>
              </div>
           </div>

           {/* The PO Document */}
           <div className="bg-background border border-border/40 shadow-xl rounded-2xl overflow-hidden max-w-4xl mx-auto p-12 md:p-16 relative">
              {/* Official Stamp Mockup */}
              <div className="absolute top-16 right-16 rotate-12 opacity-10 pointer-events-none">
                 <div className="w-32 h-32 border-4 border-primary rounded-full flex flex-col items-center justify-center text-primary font-bold uppercase text-lg leading-none">
                    <span>Authorized</span>
                    <span className="text-[8px] mt-1 tracking-widest">INBI-PO-944</span>
                 </div>
              </div>

              {/* Document Header */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                 <div className="space-y-4">
                    <div className="w-20 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg italic tracking-tighter">INBI</div>
                    <div className="space-y-0.5">
                       <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/30">From:</p>
                       <p className="text-xs font-bold text-foreground">INBI Technical Solutions LLC</p>
                       <p className="text-[9px] text-muted-foreground leading-relaxed max-w-[200px]">Suite 405, Business Bay Tower,<br/>Downtown Dubai, UAE.<br/>TRN: 100994401200003</p>
                    </div>
                 </div>
                 <div className="text-right space-y-4">
                    <h2 className="text-3xl font-bold text-foreground tracking-tighter uppercase">Purchase Order</h2>
                    <div className="space-y-0.5">
                       <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/30">PO Serial Number:</p>
                       <p className="text-base font-bold text-primary font-mono tracking-tighter">PO-{id}-V0{selectedVendorIdx + 1}</p>
                       <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 italic">Date: April 03, 2026</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                 <div className="p-6 bg-muted/20 border border-border/50 rounded-xl space-y-3">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-primary">To: (Supplier)</p>
                    <div className="space-y-0.5">
                       <h4 className="text-base font-bold text-foreground">{selectedVendor?.name}</h4>
                       <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">{selectedVendor?.address}</p>
                       <p className="text-[9px] font-bold text-foreground mt-2 uppercase tracking-wider">Attn: {selectedVendor?.contact}</p>
                    </div>
                 </div>
                 <div className="p-6 bg-muted/5 border border-border/30 rounded-xl space-y-3">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">Ship To: (Delivery Location)</p>
                    <div className="space-y-0.5">
                       <h4 className="text-base font-bold text-foreground">Dubai Metro Site - Phase 4</h4>
                       <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Jumeirah Village Circle Link,<br/>Dubai, UAE</p>
                       <p className="text-[9px] font-bold text-primary mt-2 uppercase tracking-wider">Ref RFQ: {id}</p>
                    </div>
                 </div>
              </div>

              {/* Line Items Table */}
              <div className="mb-16">
                 <table className="w-full">
                    <thead>
                       <tr className="border-b border-border/50 h-11">
                          <th className="text-left py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50">Item (SKU)</th>
                          <th className="text-center py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50">Qty</th>
                          <th className="text-right py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50">Unit (Ex)</th>
                          <th className="text-right py-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50">Total (Ex)</th>
                       </tr>
                    </thead>
                    <tbody>
                       {selectedVendor?.items.map((item, i) => (
                          <tr key={i} className="border-b border-border/30 h-16 group">
                             <td className="py-4">
                                <p className="text-xs font-bold text-foreground">{item.name}</p>
                                <p className="text-[8px] font-mono text-muted-foreground/50 group-hover:text-primary transition-colors">{item.sku}</p>
                             </td>
                             <td className="text-center font-bold text-xs text-foreground">{item.qty}</td>
                             <td className="text-right font-bold text-xs text-muted-foreground/70">${item.unitPrice.toLocaleString()}</td>
                             <td className="text-right font-bold text-xs text-foreground italic">${item.total.toLocaleString()}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              {/* Commercial Summary */}
              <div className="flex flex-col items-end space-y-4 mb-16">
                 <div className="w-full md:w-64 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                       <span className="font-bold uppercase tracking-wider text-muted-foreground/50 text-[9px]">Net Subtotal</span>
                       <span className="font-bold text-foreground">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="font-bold uppercase tracking-wider text-muted-foreground/50 text-[9px]">VAT (5%)</span>
                       <span className="font-bold text-foreground">${(subtotal * 0.05).toLocaleString()}</span>
                    </div>
                    <Separator className="bg-border/50 h-0.5" />
                    <div className="flex justify-between items-center py-1">
                       <span className="font-bold uppercase tracking-wider text-primary text-[10px]">Total Amount</span>
                       <span className="font-bold text-2xl text-foreground tracking-tighter italic">
                          ${(subtotal * 1.05).toLocaleString()}
                       </span>
                    </div>
                 </div>
              </div>

              {/* Approvals & Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
                 <div className="space-y-4">
                    <h4 className="text-[9px] font-bold uppercase tracking-wider text-primary">PO Terms & Conditions</h4>
                    <p className="text-[8px] text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4">
                       1. Official document valid with digital seal.<br/>
                       2. Payment terms as per Master Service Agreement (MSA).<br/>
                       3. Delivery required within 14 business days.<br/>
                       4. TRN linkage mandatory for tax reconciliation.
                    </p>
                 </div>
                 <div className="space-y-6 flex flex-col items-center">
                    <div className="w-full p-6 border-2 border-dashed border-border/60 rounded-xl bg-muted/5 flex flex-col items-center justify-center group relative overflow-hidden h-32">
                       {selectedVendor?.status === 'authorized' ? (
                          <div className="flex flex-col items-center animate-in zoom-in-90 gap-2">
                             <ShieldCheck className="text-emerald-500" size={32} />
                             <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Authorization Verified</span>
                          </div>
                       ) : (
                         <>
                           <FileCheck className="text-muted-foreground/20 group-hover:text-primary transition-all" size={32} />
                           <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/40 mt-4 group-hover:text-primary transition-all">Procurement Seal Pending</span>
                         </>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Floating Action Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-500">
         <div className="bg-background/80 backdrop-blur-2xl border-2 border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] rounded-3xl p-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 px-4">
            {selectedVendorIdx === null ? (
               <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Total Suppliers</p>
                  <p className="text-sm font-black text-foreground tracking-tighter">{vendors.length} Vendors</p>
               </div>
            ) : (
               <div>
                  <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1">PO Total (incl. VAT)</p>
                  <p className="text-sm font-black text-foreground tracking-tighter">
                    ${(subtotal * 1.05).toLocaleString()}
                  </p>
               </div>
            )}
            <Separator orientation="vertical" className="h-8 hidden md:block bg-border/40" />
            <div className="hidden md:block">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Queue Status</p>
              <p className="text-sm font-black text-foreground tracking-tighter">
                {vendors.filter(v => v.status === 'authorized').length} / {vendors.length} Authorized
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedVendorIdx !== null && selectedVendor?.status !== 'authorized' && (
              <Button 
                onClick={() => handleAuthorize(selectedVendorIdx)} 
                disabled={isAuthorizing}
                size="sm"
                className="h-11 rounded-xl px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
              >
                {isAuthorizing ? <Loader2 className="animate-spin" size={16} /> : 'Authorize PO'}
              </Button>
            )}
            
            {selectedVendorIdx === null ? (
              <Button 
                onClick={handleFinalDispatch}
                disabled={!vendors.every(v => v.status === 'authorized')}
                size="sm"
                className="h-11 rounded-xl px-8 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-all disabled:opacity-20 shadow-xl"
              >
                Commit Final Dispatch <Send size={16} className="ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={() => setSelectedVendorIdx(null)}
                variant="ghost"
                size="sm"
                className="h-11 rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-all"
              >
                Close Document
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}
