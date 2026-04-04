'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import { RFQParser } from '@/modules/supply-chain/rfq/components/rfq-parser';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  Package, 
  ShoppingCart, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Sparkles, 
  Mail, 
  Calendar as CalendarIcon, 
  CircleDot,
  FileSearch,
  Loader2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MOCK_INVENTORY } from '@/lib/mock/inventory.mock';

import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';

type StockStatus = 'full' | 'partial' | 'unavailable' | 'none';

interface StockCheckResult {
  status: StockStatus;
  available: number;
  matchName?: string;
  sku?: string;
}

export default function NewRFQPage() {
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WorkflowStage>(WorkflowStage.RFQ_ENTRY);
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  // Stock Check State
  const [isCheckingStock, setIsCheckingStock] = useState(false);
  const [stockResults, setStockResults] = useState<Record<string, StockCheckResult>>({});

  // Manual Form State
  const [manualRfq, setManualRfq] = useState({
    rfqNumber: `RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    title: '',
    client: '',
    clientEmail: '',
    priority: 'medium' as string,
    dueDate: '',
    notes: '',
    items: [{ id: '1', name: '', quantity: 1, unit: 'pcs', specs: '' }],
    terms: [
      { id: '1', label: 'Price Basis', value: 'Ex-Works' },
      { id: '2', label: 'Delivery', value: '2-4 Weeks' },
      { id: '3', label: 'Payment', value: '30 Days Net' },
    ]
  });

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: 'New RFQ' },
    ]);
  }, [setActivePortal, setBreadcrumbs]);

  const handleParsed = (items: any[]) => {
    setParsedItems(items);
    setManualRfq(prev => ({ ...prev, items }));
    setIsAiOpen(false);
    toast.success('Items extracted via AI successfully');
  };

  const handleAiStockCheck = async () => {
    setIsCheckingStock(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results: Record<string, StockCheckResult> = {};
    
    manualRfq.items.forEach(item => {
      const match = MOCK_INVENTORY.find(inv => 
        inv.name.toLowerCase().includes(item.name.toLowerCase()) || 
        item.name.toLowerCase().includes(inv.name.toLowerCase())
      );
      
      if (match) {
        if (match.availableQuantity >= item.quantity) {
          results[item.id] = { status: 'full', available: match.availableQuantity, matchName: match.name, sku: match.sku };
        } else if (match.availableQuantity > 0) {
          results[item.id] = { status: 'partial', available: match.availableQuantity, matchName: match.name, sku: match.sku };
        } else {
          results[item.id] = { status: 'unavailable', available: 0, matchName: match.name, sku: match.sku };
        }
      } else {
        results[item.id] = { status: 'none', available: 0 };
      }
    });
    
    setStockResults(results);
    setIsCheckingStock(false);
    toast.success('AI Inventory Scan Complete');
  };

  const handleManualSubmit = () => {
    if (!manualRfq.title || !manualRfq.client || !manualRfq.clientEmail) {
      toast.error('Please fill in the required client and project details.');
      return;
    }
    
    // In a real app, this would be the ID returned from the API
    const newId = manualRfq.rfqNumber;
    toast.success('RFQ Committed to Sourcing Stage');
    
    // Redirect to dynamic Step 2
    router.push(`/supply-chain/rfq/${newId}/procurement`);
  };

  const addManualItem = () => {
    setManualRfq({
      ...manualRfq,
      items: [...manualRfq.items, { id: Math.random().toString(36).substr(2, 9), name: '', quantity: 1, unit: 'pcs', specs: '' }]
    });
  };

  const removeManualItem = (id: string) => {
    if (manualRfq.items.length > 1) {
      setManualRfq({
        ...manualRfq,
        items: manualRfq.items.filter(item => item.id !== id)
      });
    }
  };

  const updateManualItem = (id: string, field: string, value: any) => {
    setManualRfq({
      ...manualRfq,
      items: manualRfq.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const addTerm = () => {
    setManualRfq({
      ...manualRfq,
      terms: [...manualRfq.terms, { id: Math.random().toString(36).substr(2, 9), label: '', value: '' }]
    });
  };

  const updateTerm = (id: string, field: 'label' | 'value', value: string) => {
     setManualRfq({
      ...manualRfq,
      terms: manualRfq.terms.map(t => t.id === id ? { ...t, [field]: value } : t)
    });
  };

  const removeTerm = (id: string) => {
     setManualRfq({
      ...manualRfq,
      terms: manualRfq.terms.filter(t => t.id !== id)
    });
  };

  const handleProcurementDecision = (mode: 'inventory' | 'supplier') => {
    if (mode === 'inventory') {
      router.push('/supply-chain/inventory');
    } else {
      router.push('/supply-chain/supplier-quotes');
    }
  };

  const availableCount = Object.values(stockResults).filter(r => r.status === 'full').length;

  return (
    <div className="w-full space-y-12 pb-48 px-2 max-w-[1440px]">
      {/* 1. Page Header & Full 9-Step Timeline */}
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <PageHeader 
            title="SaaS Supply Chain Command Center" 
            description="Manage your enterprise procurement lifecycle within a unified, high-density dashboard." 
          />
          <Sheet open={isAiOpen} onOpenChange={setIsAiOpen}>
             <SheetTrigger render={
                <Button variant="outline" className="h-12 px-6 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 font-black transition-all shadow-sm" />
             }>
                <>
                   <Sparkles size={16} className="mr-2 fill-primary" /> AI Document Entry
                </>
             </SheetTrigger>
             <SheetContent side="right" className="w-[450px] sm:w-[540px]">
                <SheetHeader className="mb-8">
                   <SheetTitle className="flex items-center gap-2 text-xl">
                      <Sparkles className="text-primary fill-primary" /> AI Sourcing Assistant
                   </SheetTitle>
                   <SheetDescription>
                      Upload the client&apos;s RFQ PDF. Our AI will analyze the document and automatically populate the item table for you.
                   </SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                   <RFQParser onParsed={handleParsed} />
                </div>
             </SheetContent>
          </Sheet>
        </div>
        
        <div className="bg-muted/10 rounded-3xl p-4 border border-border/50">
           <WorkflowTimeline currentStage={currentStep} />
        </div>
      </div>

      {currentStep === WorkflowStage.RFQ_ENTRY && (
         <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
            <div className="space-y-12">
               {/* 1. Client & Reference (Document Card) */}
               <section className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                     <div className="w-1.5 h-6 bg-primary rounded-full" />
                     <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">1. Client & Reference</h2>
                  </div>
                  <Card className="shadow-2xl shadow-black/[0.02] border-border/40 backdrop-blur-sm bg-background/80 overflow-hidden">
                     <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <div className="md:col-span-2 space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Project Name</Label>
                              <Input 
                                 placeholder="e.g. Dubai Metro Expansion - Phase 4 Structural Steel" 
                                 value={manualRfq.title}
                                 onChange={(e) => setManualRfq({...manualRfq, title: e.target.value})}
                                 className="h-14 text-lg font-medium border-transparent bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all px-4"
                              />
                           </div>
                           <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Official RFQ Ref</Label>
                              <div className="h-14 flex items-center px-4 bg-primary/5 border border-primary/10 rounded-xl text-primary font-mono text-sm font-black">
                                 {manualRfq.rfqNumber}
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                           <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Client Entity</Label>
                              <Input 
                                 placeholder="Client name..." 
                                 value={manualRfq.client}
                                 onChange={(e) => setManualRfq({...manualRfq, client: e.target.value})}
                                 className="h-11 border-border/50 bg-background/50 focus:bg-background"
                              />
                           </div>
                           <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Client Contact Email</Label>
                              <div className="relative">
                                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={14} />
                                 <Input 
                                    type="email"
                                    placeholder="procurement@client.com" 
                                    value={manualRfq.clientEmail}
                                    onChange={(e) => setManualRfq({...manualRfq, clientEmail: e.target.value})}
                                    className="h-11 pl-9 border-border/50 bg-background/50 focus:bg-background"
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Priority Level</Label>
                              <Select value={manualRfq.priority as string} onValueChange={(v) => setManualRfq({...manualRfq, priority: v || 'medium'})}>
                                 <SelectTrigger className="h-11 border-border/50 bg-background/50 focus:bg-background">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Required Quote Date</Label>
                              <div className="relative">
                                 <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={14} />
                                 <Input 
                                    type="date" 
                                    value={manualRfq.dueDate}
                                    onChange={(e) => setManualRfq({...manualRfq, dueDate: e.target.value})}
                                    className="h-11 pl-9 border-border/50 bg-background/50 focus:bg-background"
                                 />
                              </div>
                           </div>
                        </div>

                        <Separator className="bg-border/40" />

                        <div className="space-y-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Internal Commentary / Special Instructions</Label>
                           <Textarea 
                              placeholder="Describe any internal requirements, site conditions, or special instructions..." 
                              value={manualRfq.notes}
                              onChange={(e) => setManualRfq({...manualRfq, notes: e.target.value})}
                              className="min-h-[100px] resize-none border-transparent bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-sm leading-relaxed p-4 font-medium"
                           />
                        </div>
                     </CardContent>
                  </Card>
               </section>

               {/* 2. Requested Items (Document Table) */}
               <section className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">2. Requested Items</h2>
                     </div>
                     <Button variant="ghost" size="sm" onClick={addManualItem} className="h-8 text-xs font-black text-primary hover:bg-primary/5">
                        <Plus size={14} className="mr-1" /> Add Row
                     </Button>
                  </div>
                  <Card className="shadow-2xl shadow-black/[0.02] border-border/40 backdrop-blur-sm bg-background/80 overflow-hidden">
                     <CardContent className="p-0">
                        <Table>
                           <TableHeader className="bg-muted/40">
                              <TableRow className="border-b border-border/50">
                                 <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-8 h-12">Product Description</TableHead>
                                 <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-4 h-12">Specifications</TableHead>
                                 <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-4 h-12 text-center w-24">Qty</TableHead>
                                 <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-4 h-12 text-center w-24">Unit</TableHead>
                                 <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-8 h-12 text-right w-20"></TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {manualRfq.items.map((item) => (
                                 <TableRow key={item.id} className="group hover:bg-primary/[0.01] border-b border-border/30 last:border-0 transition-colors">
                                    <TableCell className="px-8 py-5">
                                       <Input 
                                          value={item.name} 
                                          onChange={(e) => updateManualItem(item.id, 'name', e.target.value)}
                                          placeholder="Item name..."
                                          className="h-10 text-sm font-medium bg-transparent border-transparent focus:border-primary/20 focus:bg-background transition-all"
                                       />
                                    </TableCell>
                                    <TableCell className="px-4 py-5">
                                       <Input 
                                          value={item.specs} 
                                          onChange={(e) => updateManualItem(item.id, 'specs', e.target.value)}
                                          placeholder="Specs..."
                                          className="h-10 text-xs bg-transparent border-transparent focus:border-primary/20 focus:bg-background transition-all"
                                       />
                                    </TableCell>
                                    <TableCell className="px-4 py-5">
                                       <Input 
                                          type="number"
                                          value={item.quantity} 
                                          onChange={(e) => updateManualItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                          className="h-10 text-center font-black bg-muted/20 border-transparent focus:bg-background focus:border-primary/20"
                                       />
                                    </TableCell>
                                    <TableCell className="px-4 py-5">
                                       <Input 
                                          value={item.unit} 
                                          onChange={(e) => updateManualItem(item.id, 'unit', e.target.value)}
                                          className="h-10 text-center text-[10px] font-black uppercase border-transparent bg-transparent hover:bg-muted/30"
                                       />
                                    </TableCell>
                                    <TableCell className="px-8 py-5 text-right">
                                       <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 text-muted-foreground/30 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                                          onClick={() => removeManualItem(item.id)}
                                       >
                                          <Trash2 size={14} />
                                       </Button>
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </CardContent>
                  </Card>
               </section>

               {/* 3. Commercial Terms */}
               <section className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70">3. Commercial Terms</h2>
                     </div>
                     <Button variant="ghost" size="sm" onClick={addTerm} className="h-8 text-xs font-black text-primary hover:bg-primary/5">
                        <Plus size={14} className="mr-1" /> Add Term
                     </Button>
                  </div>
                  <Card className="shadow-2xl shadow-black/[0.02] border-border/40 backdrop-blur-sm bg-background/80 overflow-hidden">
                     <CardContent className="p-0">
                        <Table>
                           <TableHeader className="bg-muted/40">
                              <TableRow className="border-b border-border/50">
                                 <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-8 h-12">Term Category</TableHead>
                                 <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-4 h-12">Value / Detail</TableHead>
                                 <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] px-8 h-12 text-right w-20"></TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {manualRfq.terms.map((term) => (
                                 <TableRow key={term.id} className="group hover:bg-primary/[0.01] border-b border-border/30 last:border-0 transition-colors">
                                    <TableCell className="px-8 py-4">
                                       <Input 
                                          value={term.label} 
                                          onChange={(e) => updateTerm(term.id, 'label', e.target.value)}
                                          placeholder="e.g. Price Basis"
                                          className="h-9 text-xs font-black uppercase tracking-widest border-transparent bg-transparent group-hover:bg-background group-hover:border-input transition-all"
                                       />
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                       <Input 
                                          value={term.value} 
                                          onChange={(e) => updateTerm(term.id, 'value', e.target.value)}
                                          placeholder="e.g. Ex-Works Jebel Ali"
                                          className="h-9 text-xs border-transparent bg-transparent group-hover:bg-background group-hover:border-input transition-all"
                                       />
                                    </TableCell>
                                    <TableCell className="px-8 py-4 text-right">
                                       <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 text-muted-foreground/30 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                                          onClick={() => removeTerm(term.id)}
                                       >
                                          <Trash2 size={14} />
                                       </Button>
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </CardContent>
                  </Card>
               </section>
            </div>

            {/* Floating Summary Command Bar */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl z-50 px-4">
               <div className="bg-background/90 backdrop-blur-xl border border-primary/20 shadow-[0_20px_50px_rgba(var(--primary),0.15)] rounded-3xl p-4 flex items-center justify-between gap-8 transition-all hover:scale-[1.01] hover:shadow-[0_20px_60px_rgba(var(--primary),0.2)]">
                  <div className="flex items-center gap-10 px-6 overflow-hidden">
                     <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Project</span>
                        <h4 className={cn(
                           "text-sm font-bold truncate transition-colors",
                           !manualRfq.title ? "text-muted-foreground/40 italic" : "text-foreground"
                        )}>
                           {manualRfq.title || 'Untitled Project Document'}
                        </h4>
                     </div>
                     <div className="hidden md:flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Target client</span>
                        <h4 className={cn(
                           "text-sm font-bold truncate transition-colors",
                           !manualRfq.client ? "text-muted-foreground/40 italic" : "text-foreground"
                        )}>
                           {manualRfq.client || 'Awaiting Client Entity'}
                        </h4>
                     </div>
                     <div className="flex items-center gap-8">
                        <div className="flex flex-col items-center">
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Items</span>
                           <span className="text-sm font-black text-primary">{manualRfq.items.length}</span>
                        </div>
                        <div className="flex flex-col items-center">
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</span>
                           <span className="flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                              <CircleDot size={10} className="fill-amber-700" /> Draft
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <Separator orientation="vertical" className="h-8 bg-border/50" />
                     <Button 
                        size="lg"
                        className="h-14 px-10 rounded-2xl shadow-xl shadow-primary/25 font-black text-xs uppercase tracking-widest active:scale-95 transition-all group"
                        disabled={!manualRfq.title || !manualRfq.client || !manualRfq.clientEmail}
                        onClick={handleManualSubmit}
                     >
                        Commit & Sourcing
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
}
