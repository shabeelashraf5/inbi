'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  tax: number;
  grandTotal: number;
}

interface QuoteEntryFormProps {
  rfqItems: any[];
  onSubmit: (proposals: SupplierProposal[]) => void;
}

export function QuoteEntryForm({ rfqItems, onSubmit }: QuoteEntryFormProps) {
  const [activeVendorIndex, setActiveVendorIndex] = useState(0);
  const [proposals, setProposals] = useState<SupplierProposal[]>([
    createInitialProposal('1', rfqItems),
    createInitialProposal('2', rfqItems),
  ]);

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
      tax: 0,
      grandTotal: 0
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
    proposal.tax = proposal.subtotal * 0.05; // 5% VAT example
    proposal.grandTotal = proposal.subtotal + proposal.tax;
    
    setProposals(newProposals);
  };

  const isFormValid = proposals.every(p => p.supplierName && p.grandTotal > 0);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Vendor Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {proposals.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setActiveVendorIndex(idx)}
            className={cn(
              "px-6 py-3 rounded-2xl flex items-center gap-3 transition-all whitespace-nowrap border-2",
              activeVendorIndex === idx 
                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
            )}
          >
            <div className={cn(
               "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black",
               activeVendorIndex === idx ? "bg-white/20" : "bg-muted-foreground/10"
            )}>
               {idx + 1}
            </div>
            <span className="text-sm font-black uppercase tracking-widest">
               {p.supplierName || `Vendor Proposal ${idx + 1}`}
            </span>
          </button>
        ))}
        <Button variant="ghost" onClick={handleAddVendor} className="h-12 rounded-2xl border-2 border-dashed border-border/50 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all">
          <Plus size={16} className="mr-2" /> Add Quote
        </Button>
      </div>

      {/* Document Proposal Card */}
      <Card className="shadow-2xl shadow-black/[0.04] border-border/40 backdrop-blur-md bg-background/60 overflow-hidden rounded-[2.5rem]">
        <CardContent className="p-10 space-y-12">
          {/* Section 1: Vendor Entity Details */}
          <section className="space-y-8">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Building2 size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-foreground">Supplier Document Details</h3>
                      <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">Enter official vendor identity and contact info</p>
                   </div>
                </div>
                {proposals.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => {
                    const next = Math.max(0, activeVendorIndex - 1);
                    setProposals(proposals.filter((_, i) => i !== activeVendorIndex));
                    setActiveVendorIndex(next);
                  }} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                    <Trash2 size={16} className="mr-2" /> Remove Document
                  </Button>
                )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Supplier Business Entity</Label>
                   <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
                      <Input 
                         placeholder="e.g. Al Futtaim Engineering" 
                         value={proposals[activeVendorIndex].supplierName}
                         onChange={(e) => updateProposal(activeVendorIndex, 'supplierName', e.target.value)}
                         className="h-12 pl-10 border-transparent bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Contact Representative</Label>
                   <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
                      <Input 
                         placeholder="John Doe" 
                         value={proposals[activeVendorIndex].contactPerson}
                         onChange={(e) => updateProposal(activeVendorIndex, 'contactPerson', e.target.value)}
                         className="h-12 pl-10 border-transparent bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Official Email Address</Label>
                   <div className="relative">
                      <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30" size={16} />
                      <Input 
                         placeholder="sales@supplier.com" 
                         value={proposals[activeVendorIndex].email}
                         onChange={(e) => updateProposal(activeVendorIndex, 'email', e.target.value)}
                         className="h-12 pl-10 border-transparent bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                      />
                   </div>
                </div>
             </div>
          </section>

          <Separator className="bg-border/40" />

          {/* Section 2: Line Item Pricing (The Core Request) */}
          <section className="space-y-6">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                   <Calculator size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-black text-foreground">Strategic Line-Item Pricing</h3>
                   <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">Map unit prices to original RFQ requirements</p>
                </div>
             </div>

             <div className="border border-border/40 rounded-[1.5rem] overflow-hidden bg-background/40">
                <Table>
                   <TableHeader className="bg-muted/40">
                      <TableRow className="border-b border-border/50 h-14">
                         <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-8">Requirement / Product Description</TableHead>
                         <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-4 text-center w-24">Qty</TableHead>
                         <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-4 text-center w-24">Unit</TableHead>
                         <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-4 w-48">Supplier Unit Price ($)</TableHead>
                         <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-8 text-right w-40">Extended Total</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {proposals[activeVendorIndex].lineItems.map((item, idx) => (
                         <TableRow key={item.rfqItemId} className="group hover:bg-primary/[0.02] border-b border-border/30 last:border-0 transition-all">
                            <TableCell className="px-8 py-6">
                               <div className="flex flex-col">
                                  <span className="text-sm font-black text-foreground uppercase tracking-tight">{item.name}</span>
                                  <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Original Reference SKU: {item.rfqItemId.slice(0, 8)}</span>
                               </div>
                            </TableCell>
                            <TableCell className="px-4 py-6 text-center font-mono font-black text-sm">{item.quantity}</TableCell>
                            <TableCell className="px-4 py-6 text-center text-[10px] font-black uppercase text-muted-foreground/60">{item.unit}</TableCell>
                            <TableCell className="px-4 py-6">
                               <div className="relative group/input">
                                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within/input:text-primary transition-colors" size={14} />
                                  <Input 
                                     type="number"
                                     placeholder="0.00" 
                                     value={item.unitPrice || ''}
                                     onChange={(e) => updateLineItem(activeVendorIndex, idx, parseFloat(e.target.value) || 0)}
                                     className="h-10 pl-8 border-transparent bg-primary/5 focus:bg-background focus:ring-4 focus:ring-primary/10 text-sm font-black transition-all"
                                  />
                               </div>
                            </TableCell>
                            <TableCell className="px-8 py-6 text-right font-mono font-black text-sm text-foreground">
                               ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </TableCell>
                         </TableRow>
                      ))}
                   </TableBody>
                </Table>
             </div>
          </section>

          {/* Section 3: Commercial Terms & Aggregation */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
             <div className="space-y-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
                      <Clock size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-foreground">Economic Conditions</h3>
                      <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">Delivery and logistics confirmation</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Logistics Lead Time (Days)</Label>
                      <Input 
                         type="number"
                         value={proposals[activeVendorIndex].deliveryDays}
                         onChange={(e) => updateProposal(activeVendorIndex, 'deliveryDays', parseInt(e.target.value) || 0)}
                         className="h-11 border-border/50 bg-background/50 focus:bg-background font-bold"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Standard Warranty</Label>
                      <Input 
                         value={proposals[activeVendorIndex].warranty}
                         onChange={(e) => updateProposal(activeVendorIndex, 'warranty', e.target.value)}
                         className="h-11 border-border/50 bg-background/50 focus:bg-background font-bold"
                      />
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                   <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Vendor Reliability Rating</Label>
                      <span className="text-sm font-black text-amber-500">{proposals[activeVendorIndex].reliability} / 5.0</span>
                   </div>
                   <Input 
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={proposals[activeVendorIndex].reliability}
                      onChange={(e) => updateProposal(activeVendorIndex, 'reliability', parseFloat(e.target.value))}
                      className="h-2 bg-muted transition-all cursor-pointer accent-amber-500"
                   />
                </div>
             </div>

             <div className="bg-primary/[0.03] rounded-[2rem] p-10 border border-primary/10 flex flex-col justify-center space-y-4 shadow-inner">
                <div className="flex justify-between items-center text-muted-foreground mb-2">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sourcing Subtotal</span>
                   <span className="font-mono text-sm font-bold">${proposals[activeVendorIndex].subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground pb-6 border-b border-primary/10">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Value Added Tax (5%)</span>
                   <span className="font-mono text-sm font-bold">${proposals[activeVendorIndex].tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Final Quoted Grand Total</span>
                      <span className="text-3xl font-black text-foreground tracking-tighter">
                         ${proposals[activeVendorIndex].grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                   </div>
                   <Button 
                      size="lg"
                      className="px-8 rounded-xl font-black text-[10px] uppercase tracking-widest h-12 shadow-xl shadow-primary/20"
                      onClick={() => {
                        if (activeVendorIndex < proposals.length - 1) {
                           setActiveVendorIndex(activeVendorIndex + 1);
                        } else {
                           onSubmit(proposals);
                        }
                      }}
                   >
                      {activeVendorIndex < proposals.length - 1 ? 'Next Proposal' : 'Finalize All Documents'}
                      <ChevronRight size={14} className="ml-2" />
                   </Button>
                </div>
             </div>
          </section>
        </CardContent>
      </Card>

      {/* Persistence Floating Summary */}
      <div className="flex flex-col items-center gap-4 pb-12">
          <Button 
            size="lg"
            disabled={!isFormValid}
            onClick={() => onSubmit(proposals)}
            className="h-16 px-16 rounded-[2rem] shadow-[0_20px_50px_rgba(var(--primary),0.25)] bg-primary text-primary-foreground font-black text-sm uppercase tracking-[0.3em] active:scale-95 transition-all group border-b-4 border-primary-foreground/20"
          >
             Commit Strategic Analysis
             <Sparkles size={20} className="ml-4 animate-pulse fill-primary-foreground" />
          </Button>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
             <ShieldCheck size={12} /> Encrypted Governance Protocol Active
          </div>
      </div>
    </div>
  );
}
