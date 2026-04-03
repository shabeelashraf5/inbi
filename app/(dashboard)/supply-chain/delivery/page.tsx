'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { WorkflowTimeline, WorkflowStage } from '@/components/shared/workflow-timeline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Truck, 
  MapPin, 
  Package, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  ClipboardCheck,
  Send,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export default function DeliveryTrackingPage() {
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const [isDispatching, setIsDispatching] = useState(false);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: 'Delivery' },
    ]);
  }, [setActivePortal, setBreadcrumbs]);

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col gap-4">
        <PageHeader 
          title="Delivery & Fulfillment" 
          description="Prepare the shipment and generate the official delivery note for the client." 
          actions={
            <Button size="lg" className="shadow-lg shadow-primary/20" onClick={handleDispatch} disabled={isDispatching}>
              <Send size={16} className="mr-2" /> 
              {isDispatching ? 'Generating DN...' : 'Dispatch Shipment'}
            </Button>
          }
        />
        <WorkflowTimeline currentStage={WorkflowStage.DELIVERY} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Consignment Details</CardTitle>
                <CardDescription>Items ready for delivery to client.</CardDescription>
              </div>
              <div className="bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20 flex items-center gap-2">
                 <Zap size={14} className="text-primary fill-primary" />
                 <span className="text-[10px] font-black uppercase text-primary">Priority Shipment</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="p-6 space-y-4">
                  {[
                    { name: 'Industrial Steel Beam - H Section', qty: 50, weight: '450 kg' },
                    { name: 'High-Tensile Bolts & Nuts', qty: 500, weight: '24 kg' },
                    { name: 'Welding Electrodes - E7018', qty: 100, weight: '12 kg' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted/20 border border-border/30 rounded-xl">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-background border flex items-center justify-center rounded-lg shadow-sm">
                             <Package size={20} className="text-muted-foreground" />
                          </div>
                          <div>
                             <p className="font-bold text-sm">{item.name}</p>
                             <p className="text-[10px] text-muted-foreground font-mono">Lot #LT-2026-X1 • Weight: {item.weight}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black tracking-tight text-primary">{item.qty}</p>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Pcs</p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-6 bg-muted/10 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                     <ClipboardCheck size={16} className="text-emerald-500" />
                     All items physically verified and graded.
                  </div>
                  <div className="text-right flex items-center gap-6">
                     <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-0.5">Total Weight</p>
                        <p className="text-sm font-black">486.0 KG</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-0.5">Shipment Volume</p>
                        <p className="text-sm font-black">2.4 m³</p>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card>
                <CardHeader className="pb-3 border-b">
                   <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Truck size={16} className="text-muted-foreground" />
                      Logistics Provider
                   </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                   <div className="space-y-2">
                      <Label htmlFor="provider">Third Party Logistics (3PL)</Label>
                      <Input id="provider" defaultValue="Aramex Industrial" />
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="tracking">Tracking Number</Label>
                      <Input id="tracking" placeholder="e.g. AX-2026-55921" />
                   </div>
                </CardContent>
             </Card>

             <Card>
                <CardHeader className="pb-3 border-b">
                   <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <MapPin size={16} className="text-muted-foreground" />
                      Delivery Destination
                   </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                   <div className="space-y-1">
                      <p className="text-xs font-bold uppercase text-muted-foreground">Client Facility</p>
                      <p className="text-sm font-black">Al Ghurair, Area 4, Dubailand</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">Plot 22, Industrial Zone, Dubai, UAE</p>
                   </div>
                   <Button variant="outline" size="sm" className="w-full h-9 text-xs">Edit Destination</Button>
                </CardContent>
             </Card>
          </div>
        </div>

        <div className="space-y-6">
           <Card className="border-primary/20 bg-primary/[0.01]">
              <CardHeader>
                 <CardTitle className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Fulfillment Progress</CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-8">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold">Preparation</span>
                       <span className="text-xs font-black text-emerald-600">100%</span>
                    </div>
                    <Progress value={100} className="h-1.5" />
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold">Doc Generation</span>
                       <span className="text-xs font-black text-amber-600">60%</span>
                    </div>
                    <Progress value={60} className="h-1.5" />
                 </div>
                 <div className="space-y-4 opacity-40">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold">In-Transit</span>
                       <span className="text-xs font-black">0%</span>
                    </div>
                    <Progress value={0} className="h-1.5" />
                 </div>

                 <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1.5">Action Plan</p>
                    <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                       Upon clicking &quot;Dispatch Shipment&quot;, the system will generate an official Delivery Note (DN-1024) and notify the finance team for final invoicing.
                    </p>
                 </div>
              </CardContent>
           </Card>

           <Button variant="outline" className="w-full h-11 border-dashed border-2 hover:bg-muted/30">
              <Plus size={16} className="mr-2" /> Add Partial Delivery
           </Button>
        </div>
      </div>
    </div>
  );
}

function Plus({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
