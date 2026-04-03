'use client';

import { useEffect, use } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { usePODetail } from '@/modules/supply-chain/purchase-orders/hooks/use-purchase-orders';
import { POStatus } from '@/modules/supply-chain/purchase-orders/types/purchase-orders.types';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { DetailSkeleton } from '@/components/shared/loading-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '../../../../../components/ui/progress';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Building2, Mail, MapPin, 
  CheckCircle, Truck, PackageCheck, AlertCircle,
  FileText, Download, Printer, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const { po, isLoading, error, updateStatus } = usePODetail(id);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    if (po) {
      setBreadcrumbs([
        { label: 'Overview', href: '/dashboard' },
        { label: 'Supply Chain', href: '/supply-chain' },
        { label: 'Purchase Orders', href: '/supply-chain/purchase-orders' },
        { label: po.poNumber },
      ]);
    }
  }, [setActivePortal, setBreadcrumbs, po]);

  const handleStatusUpdate = async (status: POStatus) => {
    await updateStatus(status);
    toast.success(`Purchase Order status updated to ${status.replace(/_/g, ' ')}`);
  };

  if (isLoading) return <div className="space-y-6"><DetailSkeleton /></div>;
  if (error || !po) return <div className="py-20 text-center">Purchase Order not found</div>;

  const totalReceived = po.items.reduce((sum, item) => sum + item.receivedQuantity, 0);
  const totalQuantity = po.items.reduce((sum, item) => sum + item.quantity, 0);
  const fulfillmentPercentage = (totalReceived / totalQuantity) * 100;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/supply-chain/purchase-orders">
            <Button variant="ghost" size="icon" className="h-10 w-10 mt-1">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{po.poNumber}</h1>
              <StatusBadge status={po.status} />
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground font-medium">
               <span>Drafted from</span>
               <Link href={`/supply-chain/quotes/${po.quoteId}`} className="text-primary hover:underline flex items-center gap-1">
                 <FileText size={14} /> {po.quoteNumber}
               </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer size={14} className="mr-1" /> Print
          </Button>
          <Button variant="outline" size="sm">
            <Download size={14} className="mr-1" /> Export
          </Button>
          {po.status === POStatus.SHIPPED && (
            <Button size="sm" onClick={() => handleStatusUpdate(POStatus.RECEIVED)} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
              <PackageCheck size={14} className="mr-1" /> Mark As Received
            </Button>
          )}
        </div>
      </div>

      {/* Fulfillment Pipeline */}
      <Card className="border-border/50 bg-muted/20">
        <CardContent className="py-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] px-8">
            {[
              { label: 'Issued', date: po.issueDate, done: true, icon: FileText },
              { label: 'Confirmed', done: [POStatus.CONFIRMED, POStatus.SHIPPED, POStatus.RECEIVED, POStatus.CLOSED].includes(po.status), icon: CheckCircle },
              { label: 'Shipped', done: [POStatus.SHIPPED, POStatus.RECEIVED, POStatus.CLOSED].includes(po.status), icon: Truck },
              { label: 'Received', date: po.actualDeliveryDate, done: [POStatus.RECEIVED, POStatus.CLOSED].includes(po.status), icon: PackageCheck },
              { label: 'Invoice Paid', done: po.status === POStatus.CLOSED, icon: ShieldCheck },
            ].map((step, i, arr) => (
              <div key={i} className="flex-1 flex items-center relative gap-4 last:flex-none">
                <div className="flex flex-col items-center z-10">
                  <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-md',
                    step.done
                      ? 'border-primary bg-primary text-primary-foreground scale-110 shadow-primary/20'
                      : 'border-border bg-background text-muted-foreground opacity-60'
                  )}>
                    {step.done ? <step.icon size={22} /> : i + 1}
                  </div>
                  <div className="absolute top-14 text-center whitespace-nowrap min-w-[100px]">
                    <p className={cn('text-xs font-bold uppercase tracking-wider', step.done ? 'text-primary' : 'text-muted-foreground')}>
                      {step.label}
                    </p>
                    {step.date && <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(step.date).toLocaleDateString()}</p>}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex-1 h-[3px] bg-border mx-2 relative top-[-10px]">
                    <div className={cn(
                      'absolute inset-0 bg-primary transition-all duration-500',
                      arr[i+1]?.done ? 'w-full' : 'w-0'
                    )} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fulfillment Summary */}
        <Card className="md:col-span-1 border-border/50">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider">
              <PackageCheck size={16} className="text-primary" />
              Fulfillment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
             <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Received Items</span>
                  <span>{fulfillmentPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={fulfillmentPercentage} className="h-2 bg-muted/50" />
                <p className="text-[11px] text-muted-foreground text-center">
                  {totalReceived} of {totalQuantity} items processed
                </p>
             </div>
             
             <Separator />
             
             <div className="space-y-4">
                <DetailRow icon={<Building2 size={16} />} label="Vendor" value={po.vendor} />
                <DetailRow icon={<Calendar size={16} />} label="Target Date" value={new Date(po.expectedDeliveryDate).toLocaleDateString()} />
                <DetailRow icon={<MapPin size={16} />} label="Ship To" value={po.shippingAddress} />
             </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card className="md:col-span-2 border-border/50">
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">Items List</CardTitle>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground font-bold">VALUED AT</p>
              <p className="text-xl font-bold text-primary">{po.currency} {po.totalAmount.toLocaleString()}</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="text-left font-medium text-muted-foreground px-6 py-4 italic">Description</th>
                      <th className="text-right font-medium text-muted-foreground px-6 py-4">Expected</th>
                      <th className="text-right font-medium text-muted-foreground px-6 py-4">Received</th>
                      <th className="text-right font-medium text-muted-foreground px-6 py-4">Unit Price</th>
                      <th className="text-right font-medium text-muted-foreground px-6 py-4">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {po.items.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 font-semibold">{item.description}</td>
                        <td className="px-6 py-4 text-right">{item.quantity} <span className="text-[10px] text-muted-foreground uppercase">{item.unit}</span></td>
                        <td className="px-6 py-4 text-right">
                           <span className={cn(
                             "font-bold",
                             item.receivedQuantity === item.quantity ? "text-emerald-600" : "text-orange-600"
                           )}>
                             {item.receivedQuantity}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-primary">
                          ${item.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/20 border border-border/50 rounded-xl p-4 flex items-start gap-3">
         <AlertCircle size={18} className="text-muted-foreground mt-0.5" />
         <div className="space-y-1">
            <p className="text-sm font-semibold">Terms & Notes</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {po.paymentTerms}. {po.notes || 'Standard project delivery terms apply.'}
            </p>
         </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
       <div className="text-muted-foreground mt-0.5">{icon}</div>
       <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-sm font-medium leading-snug mt-0.5">{value}</p>
       </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
