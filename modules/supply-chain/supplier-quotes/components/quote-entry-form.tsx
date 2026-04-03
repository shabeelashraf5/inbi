'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  ArrowRight,
  Sparkles,
  User,
  Calculator,
  ChevronRight,
  X,
  FileText,
  Percent,
  Warehouse
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export interface SupplierLineItem {
  rfqItemId: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface SupplierProposal {
  id: string;
  supplierName: string;
  contactPerson: string;
  email: string;
  deliveryDays: number;
  warranty: string;
  reliability: number;
  lineItems: SupplierLineItem[];
  subtotal: number;
  vatPercent: number;
  tax: number;
  grandTotal: number;
  conditions: string[];
}

interface QuoteEntryFormProps {
  rfqItems: any[];
  onSubmit: (proposals: SupplierProposal[]) => void;
  isInventoryMode?: boolean;
}

export function QuoteEntryForm({ rfqItems, onSubmit, isInventoryMode = false }: QuoteEntryFormProps) {
  const [activeVendorIndex, setActiveVendorIndex] = useState(0);
  const [proposals, setProposals] = useState<SupplierProposal[]>([]);

  useEffect(() => {
    if (isInventoryMode) {
      const inventoryProposal = createInitialProposal('inventory-1', rfqItems);
      inventoryProposal.supplierName = 'Internal Inventory (Main Hub)';
      inventoryProposal.contactPerson = 'Warehouse Manager';
      inventoryProposal.email = 'warehouse@inbi-erp.com';
      inventoryProposal.deliveryDays = 1;
      inventoryProposal.warranty = 'Standard Internal Warranty';
      inventoryProposal.vatPercent = 0; // No VAT for internal transfer
      
      // Prefill with mock stock prices ($150.00 base)
      inventoryProposal.lineItems = inventoryProposal.lineItems.map((item, idx) => {
        const unitPrice = 150 + (idx * 25); // Mocked internal SKU valuation
        return {
          ...item,
          unitPrice,
          total: unitPrice * item.quantity
        };
      });
      
      // Calculate totals
      inventoryProposal.subtotal = inventoryProposal.lineItems.reduce((sum, i) => sum + i.total, 0);
      inventoryProposal.tax = 0;
      inventoryProposal.grandTotal = inventoryProposal.subtotal;
      
      setProposals([inventoryProposal]);
    } else {
      setProposals([
        createInitialProposal('1', rfqItems),
        createInitialProposal('2', rfqItems),
      ]);
    }
  }, [isInventoryMode, rfqItems]);

  function createInitialProposal(id: string, items: any[]): SupplierProposal {
    const lineItems = items.map(item => ({
      rfqItemId: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: 0,
      total: 0
    }));

    return {
      id,
      supplierName: '',
      contactPerson: '',
      email: '',
      deliveryDays: 7,
      warranty: '12 Months',
      reliability: 4.5,
      lineItems,
      subtotal: 0,
      vatPercent: 5,
      tax: 0,
      grandTotal: 0,
      conditions: [
        'Material certificates (EN 10204 3.1) provided',
        'Validity: 30 Calendar Days',
        'Standard Payment Terms apply',
      ]
    };
  }

  const handleAddVendor = () => {
    const newId = (proposals.length + 1).toString();
    setProposals([...proposals, createInitialProposal(newId, rfqItems)]);
    setActiveVendorIndex(proposals.length);
  };

  const updateProposal = (index: number, field: keyof SupplierProposal, value: any) => {
    const newProposals = [...proposals];
    newProposals[index] = { ...newProposals[index], [field]: value };
    
    // If updating vatPercent or subtotal, recalculate tax and grandTotal
    if (field === 'vatPercent' || field === 'subtotal') {
      const p = newProposals[index];
      p.tax = p.subtotal * (p.vatPercent / 100);
      p.grandTotal = p.subtotal + p.tax;
    }
    
    setProposals(newProposals);
  };

  const updateLineItem = (vendorIndex: number, itemIndex: number, unitPrice: number) => {
    const newProposals = [...proposals];
    const proposal = newProposals[vendorIndex];
    const item = proposal.lineItems[itemIndex];
    
    item.unitPrice = unitPrice;
    item.total = unitPrice * item.quantity;
    
    // Recalculate totals
    proposal.subtotal = proposal.lineItems.reduce((sum, i) => sum + i.total, 0);
    proposal.tax = proposal.subtotal * (proposal.vatPercent / 100);
    proposal.grandTotal = proposal.subtotal + proposal.tax;
    
    setProposals(newProposals);
  };

  const handleAddCondition = (vendorIndex: number) => {
    const newProposals = [...proposals];
    newProposals[vendorIndex].conditions.push('');
    setProposals(newProposals);
  };

  const handleUpdateCondition = (vendorIndex: number, condIndex: number, value: string) => {
    const newProposals = [...proposals];
    newProposals[vendorIndex].conditions[condIndex] = value;
    setProposals(newProposals);
  };

  const handleRemoveCondition = (vendorIndex: number, condIndex: number) => {
    const newProposals = [...proposals];
    newProposals[vendorIndex].conditions = newProposals[vendorIndex].conditions.filter((_, i) => i !== condIndex);
    setProposals(newProposals);
  };

  const isFormValid = proposals.every(p => p.supplierName && p.grandTotal > 0);

  if (proposals.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/10 rounded-3xl border border-dashed border-border/50 animate-pulse">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Initializing Sourcing Terminal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Vendor Selector Tabs */}
      {!isInventoryMode && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {proposals.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveVendorIndex(idx)}
              className={cn(
                "px-5 py-2.5 rounded-xl flex items-center gap-3 transition-all whitespace-nowrap border-2",
                activeVendorIndex === idx 
                  ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                activeVendorIndex === idx ? "bg-white/20" : "bg-muted-foreground/10"
              )}>
                {idx + 1}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">
                {p.supplierName || `Vendor Proposal ${idx + 1}`}
              </span>
            </button>
          ))}
          <Button variant="ghost" onClick={handleAddVendor} className="h-10 rounded-xl border-2 border-dashed border-border/50 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all">
            <Plus size={14} className="mr-2" /> Add Quote
          </Button>
        </div>
      )}

      {/* Document Proposal Card */}
      <Card className="shadow-2xl shadow-black/[0.04] border-border/40 backdrop-blur-md bg-background/60 overflow-hidden rounded-xl p-8 relative">
          <div className="absolute top-6 right-6 opacity-[0.03] pointer-events-none">
             <FileText size={120} className="text-primary" />
          </div>

          <div className="space-y-10">
            {/* Section 1: Vendor Entity Details */}
            <section className="space-y-8">
               <div className="flex items-center justify-between border-b border-border/30 pb-4">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        {isInventoryMode ? <Warehouse size={20} /> : <Building2 size={20} />}
                     </div>
                     <div>
                        <h3 className="text-base font-bold text-foreground">
                          {isInventoryMode ? 'Internal Allocation Details' : 'Supplier Document Details'}
                        </h3>
                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
                          {isInventoryMode ? 'Logistic Fulfillment Center' : 'Official Corporate Identity'}
                        </p>
                     </div>
                  </div>
                  {!isInventoryMode && proposals.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => {
                      const next = Math.max(0, activeVendorIndex - 1);
                      setProposals(proposals.filter((_, i) => i !== activeVendorIndex));
                      setActiveVendorIndex(next);
                    }} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-[10px] uppercase tracking-wider">
                      <Trash2 size={14} className="mr-2" /> Remove Document
                    </Button>
                  )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/40 ml-1">
                        {isInventoryMode ? 'Fulfillment Warehouse' : 'Supplier Business Entity'}
                     </Label>
                     <div className="relative">
                        {isInventoryMode ? (
                           <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={14} />
                        ) : (
                           <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={14} />
                        )}
                        <Input 
                           placeholder={isInventoryMode ? "Internal Stock" : "e.g. Al Futtaim Engineering"} 
                           value={proposals[activeVendorIndex].supplierName}
                           onChange={(e) => updateProposal(activeVendorIndex, 'supplierName', e.target.value)}
                           disabled={isInventoryMode}
                           className="h-10 pl-9 border-transparent bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold disabled:opacity-80"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/40 ml-1">Contact Representative</Label>
                     <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={14} />
                        <Input 
                           placeholder="John Doe" 
                           value={proposals[activeVendorIndex].contactPerson}
                           onChange={(e) => updateProposal(activeVendorIndex, 'contactPerson', e.target.value)}
                           className="h-10 pl-9 border-transparent bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/40 ml-1">Official Email Address</Label>
                     <div className="relative">
                        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30" size={14} />
                        <Input 
                           placeholder="sales@supplier.com" 
                           value={proposals[activeVendorIndex].email}
                           onChange={(e) => updateProposal(activeVendorIndex, 'email', e.target.value)}
                           className="h-10 pl-9 border-transparent bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                        />
                     </div>
                  </div>
               </div>
            </section>

            {/* Section 2: Line Item Pricing */}
            <section className="space-y-6">
               <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
                     <Calculator size={20} />
                  </div>
                  <div>
                     <h3 className="text-base font-bold text-foreground">Strategic Line-Item Pricing</h3>
                     <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Mapping vendor quotes to requirements</p>
                  </div>
               </div>

               <div className="border border-border/40 rounded-xl overflow-hidden bg-background/40">
                  <table className="w-full">
                     <thead>
                        <tr className="bg-muted/30 h-10 border-b border-border/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground/50">
                           <th className="text-left px-6">Requirement / Product Description</th>
                           <th className="text-center px-4 w-20">Qty</th>
                           <th className="text-center px-4 w-20">Unit</th>
                           <th className="text-right px-4 w-40">Unit Price ($)</th>
                           <th className="text-right px-6 w-40">Line Total</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/20">
                        {proposals[activeVendorIndex].lineItems.map((item, idx) => (
                           <tr key={item.rfqItemId} className="h-14 hover:bg-primary/[0.01] transition-colors group">
                              <td className="px-6">
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground">{item.name}</span>
                                    <span className="text-[10px] font-mono font-bold text-muted-foreground/40 uppercase tracking-widest">SKU REF: {item.rfqItemId.slice(0, 8)}</span>
                                 </div>
                              </td>
                              <td className="px-4 text-center">
                                 <span className="text-sm font-bold font-mono text-muted-foreground">{item.quantity}</span>
                              </td>
                              <td className="px-4 text-center">
                                 <span className="text-[10px] font-black uppercase text-muted-foreground/30">{item.unit}</span>
                              </td>
                              <td className="px-4">
                                 <div className="relative flex justify-end">
                                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={12} />
                                    <Input 
                                       type="number"
                                       value={item.unitPrice || ''}
                                       onChange={(e) => updateLineItem(activeVendorIndex, idx, parseFloat(e.target.value) || 0)}
                                       className="h-9 w-32 border-transparent bg-primary/5 focus:bg-background text-right font-mono font-bold text-sm"
                                    />
                                 </div>
                              </td>
                              <td className="px-6 text-right font-mono font-bold text-sm text-foreground">
                                 ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </section>

            {/* Section 3: Commercial Terms & Aggregation */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
                        <Clock size={20} />
                     </div>
                     <div>
                        <h3 className="text-base font-bold text-foreground">Economic Conditions</h3>
                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Logistics & Sourcing Terms</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/40 ml-1">Lead Time (Days)</Label>
                        <Input 
                           type="number"
                           value={proposals[activeVendorIndex].deliveryDays}
                           onChange={(e) => updateProposal(activeVendorIndex, 'deliveryDays', parseInt(e.target.value) || 0)}
                           className="h-10 border-border/50 bg-background/50 focus:bg-background font-bold text-sm"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/40 ml-1">Warranty Period</Label>
                        <Input 
                           value={proposals[activeVendorIndex].warranty}
                           onChange={(e) => updateProposal(activeVendorIndex, 'warranty', e.target.value)}
                           className="h-10 border-border/50 bg-background/50 focus:bg-background font-bold text-sm"
                        />
                     </div>
                     
                     <div className="space-y-4 col-span-2">
                        <div className="flex items-center justify-between">
                           <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/40 ml-1">Supplier Specific Terms</Label>
                           <Button variant="ghost" size="sm" onClick={() => handleAddCondition(activeVendorIndex)} className="h-6 text-[10px] uppercase font-black text-primary hover:bg-primary/5">
                              <Plus size={12} className="mr-1" /> Add Term
                           </Button>
                        </div>
                        <div className="space-y-3">
                           {proposals[activeVendorIndex].conditions.map((cond, cIdx) => (
                              <div key={cIdx} className="flex gap-2 group/term">
                                 <Input 
                                    value={cond}
                                    onChange={(e) => handleUpdateCondition(activeVendorIndex, cIdx, e.target.value)}
                                    placeholder="e.g. Price valid for 30 days"
                                    className="h-9 border-border/30 bg-background/50 text-xs font-bold transition-all focus:bg-background"
                                 />
                                 <Button variant="ghost" size="icon" onClick={() => handleRemoveCondition(activeVendorIndex, cIdx)} className="h-9 w-9 text-rose-500/20 hover:text-rose-500 opacity-0 group-hover/term:opacity-100 transition-all">
                                    <X size={14} />
                                 </Button>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col justify-end">
                  <div className="bg-primary/[0.03] rounded-2xl p-8 border border-primary/10 space-y-6 shadow-inner relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
                        <Calculator size={80} className="text-primary" />
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-muted-foreground">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Supplier Subtotal</span>
                           <span className="font-mono text-sm font-bold text-foreground">${proposals[activeVendorIndex].subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-muted-foreground gap-4">
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">VAT (%)</span>
                              <div className="flex items-center gap-1.5 bg-background border border-primary/10 rounded-lg px-2 h-7 group-focus-within:border-primary/40">
                                 <Input 
                                    type="number"
                                    value={proposals[activeVendorIndex].vatPercent}
                                    onChange={(e) => updateProposal(activeVendorIndex, 'vatPercent', parseFloat(e.target.value) || 0)}
                                    className="h-full w-10 text-center text-xs font-black border-0 bg-transparent p-0 focus-visible:ring-0"
                                 />
                                 <Percent size={10} className="text-primary/40" />
                              </div>
                           </div>
                           <span className="font-mono text-sm font-bold text-primary/60">${proposals[activeVendorIndex].tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        
                        <Separator className="bg-primary/10" />
                        
                        <div className="flex justify-between items-end pt-2">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Commercial Grand Total</span>
                              <span className="text-3xl font-black text-foreground tracking-tighter">
                                 ${proposals[activeVendorIndex].grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                           </div>
                           <Button 
                              size="lg"
                              className="px-8 rounded-xl font-black text-[10px] uppercase tracking-widest h-12 shadow-2xl shadow-primary/20 bg-primary group"
                              onClick={() => {
                                if (activeVendorIndex < proposals.length - 1) {
                                   setActiveVendorIndex(activeVendorIndex + 1);
                                } else {
                                   onSubmit(proposals);
                                }
                              }}
                           >
                              {activeVendorIndex < proposals.length - 1 ? 'Next' : 'Commit Details'}
                              <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                           </Button>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-2 justify-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                     <ShieldCheck size={12} /> Commercial Data Integrity Guaranteed
                  </div>
               </div>
            </section>
          </div>
      </Card>
    </div>
  );
}
