'use client';

import { useEffect, use } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { useQuoteDetail } from '@/modules/supply-chain/quotes/hooks/use-quote-detail';
import { QuoteStatus } from '@/modules/supply-chain/quotes/types/quotes.types';
import { StatusBadge } from '@/components/shared/status-badge';
import { DetailSkeleton } from '@/components/shared/loading-skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, User, Mail, AlertTriangle, 
  CheckCircle, X, FileText, Download, TrendingUp, TrendingDown,
  Building2, Clock, ShieldCheck, Info, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const { quote, isLoading, error, updateStatus } = useQuoteDetail(id);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    if (quote) {
      setBreadcrumbs([
        { label: 'Overview', href: '/dashboard' },
        { label: 'Supply Chain', href: '/supply-chain' },
        { label: 'Quotes', href: '/supply-chain/quotes' },
        { label: quote.quoteNumber },
      ]);
    }
  }, [setActivePortal, setBreadcrumbs, quote]);

  const handleStatusUpdate = async (status: QuoteStatus) => {
    await updateStatus(status);
    toast.success(`Quote status updated to ${status.replace(/_/g, ' ')}`);
  };

  if (isLoading) return <div className="space-y-6"><DetailSkeleton /></div>;
  if (error || !quote) return <div className="py-20 text-center">Quote not found</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/supply-chain/quotes">
            <Button variant="ghost" size="icon" className="h-9 w-9 mt-0.5">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{quote.quoteNumber}</h1>
              <StatusBadge status={quote.status} />
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Link href={`/supply-chain/rfq/${quote.rfqId}`} className="hover:text-primary flex items-center gap-1.5 transition-colors">
                <FileText size={14} />
                {quote.rfqNumber}
              </Link>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Building2 size={14} /> {quote.vendor}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download size={14} className="mr-1" /> PDF
          </Button>
          {quote.status === QuoteStatus.PENDING || quote.status === QuoteStatus.UNDER_REVIEW ? (
            <>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive border-destructive/30 hover:bg-destructive/5"
                onClick={() => handleStatusUpdate(QuoteStatus.REJECTED)}
              >
                <X size={14} className="mr-1" /> Reject
              </Button>
              <Button size="sm" onClick={() => handleStatusUpdate(QuoteStatus.ACCEPTED)}>
                <CheckCircle size={14} className="mr-1" /> Accept Quote
              </Button>
            </>
          ) : quote.status === QuoteStatus.ACCEPTED && (
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
               Convert to Purchase Order
            </Button>
          )}
        </div>
      </div>

      {/* Horizontal Timeline */}
      <Card className="border-border/50 bg-muted/20">
        <CardContent className="py-6 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] px-8">
            {[
              { label: 'Submitted', date: quote.submittedAt, done: true },
              { 
                label: 'Under Review', 
                date: quote.status === QuoteStatus.UNDER_REVIEW ? quote.updatedAt : undefined, 
                done: [QuoteStatus.UNDER_REVIEW, QuoteStatus.ACCEPTED, QuoteStatus.REJECTED].includes(quote.status) 
              },
              { 
                label: 'Decision', 
                date: [QuoteStatus.ACCEPTED, QuoteStatus.REJECTED].includes(quote.status) ? quote.updatedAt : undefined, 
                done: [QuoteStatus.ACCEPTED, QuoteStatus.REJECTED].includes(quote.status) 
              },
              { 
                label: 'PO Created', 
                done: false // Implementation for PO module 
              },
            ].map((step, i, arr) => (
              <div key={i} className="flex-1 flex items-center relative gap-4 last:flex-none">
                <div className="flex flex-col items-center z-10">
                  <div className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 shadow-sm',
                    step.done
                      ? 'border-primary bg-primary text-primary-foreground scale-110'
                      : 'border-border bg-background text-muted-foreground'
                  )}>
                    {step.done ? <CheckCircle size={18} /> : i + 1}
                  </div>
                  <div className="absolute top-12 text-center whitespace-nowrap min-w-[80px]">
                    <p className={cn('text-xs font-bold uppercase tracking-wider', step.done ? 'text-foreground' : 'text-muted-foreground')}>
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(step.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex-1 h-[2px] bg-border mx-2 relative top-[-10px]">
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

      {/* Main Content */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 size={16} className="text-muted-foreground" />
                Vendor Info
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <DetailItem label="Vendor" value={quote.vendor} />
              <DetailItem label="Email" value={quote.vendorEmail} />
              <DetailItem label="Representative" value="John Smith" />
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                Timeline & Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <DetailItem label="Valid Until" value={quote.validUntil} />
              <DetailItem label="Estimated Delivery" value={quote.deliveryTime || 'TBD'} />
              <DetailItem label="Submitted At" value={new Date(quote.submittedAt).toLocaleDateString()} />
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck size={16} className="text-muted-foreground" />
                Quotation Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-balance leading-relaxed">
                {quote.terms}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Strategy & Margin Calculation */}
        <Card className="border-primary/20 bg-primary/[0.01] shadow-sm">
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                Pricing Strategy
              </CardTitle>
              <CardDescription>Calculate final client price by adding a profit margin to the supplier cost.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Base Cost (Supplier)</p>
                <p className="text-2xl font-black">${quote.totalAmount.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Profit Margin (%)</p>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number" 
                    defaultValue={10} 
                    className="w-24 h-10 font-bold text-lg"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      // Mock update logic
                      const margin = parseFloat(e.target.value) || 0;
                      const profit = (quote.totalAmount * margin) / 100;
                      const total = quote.totalAmount + profit;
                      document.getElementById('client-profit')!.innerText = `$${profit.toLocaleString()}`;
                      document.getElementById('client-total')!.innerText = `$${total.toLocaleString()}`;
                    }}
                  />
                  <span className="text-lg font-bold text-muted-foreground">%</span>
                </div>
              </div>

              <div className="space-y-1.5 border-l border-border/50 pl-8">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Calculated Profit</p>
                <p id="client-profit" className="text-2xl font-black text-emerald-600">${(quote.totalAmount * 0.1).toLocaleString()}</p>
              </div>

              <div className="space-y-1.5 border-l border-border/50 pl-8">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Final Client Price</p>
                <p id="client-total" className="text-2xl font-black text-primary">${(quote.totalAmount * 1.1).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t flex items-center justify-between">
               <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                  <Info className="w-4 h-4" />
                  Prices are exclusive of VAT. Shipping is included.
               </div>
               <Button className="h-11 px-8 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                  Generate Client Quotation <ArrowRight size={16} className="ml-2" />
               </Button>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card className="border-border/50">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Quoted Items ({quote.items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left font-medium text-muted-foreground px-6 py-3">Description</th>
                    <th className="text-right font-medium text-muted-foreground px-6 py-3">Qty</th>
                    <th className="text-right font-medium text-muted-foreground px-6 py-3">Unit</th>
                    <th className="text-right font-medium text-muted-foreground px-6 py-3">Quoted Price</th>
                    <th className="text-right font-medium text-muted-foreground px-6 py-3">Est. Price</th>
                    <th className="text-right font-medium text-muted-foreground px-6 py-3">Variance</th>
                    <th className="text-right font-medium text-muted-foreground px-6 py-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {quote.items.map((item, i) => {
                    const variance = item.rfqEstimatedPrice 
                      ? ((item.quotedPrice - item.rfqEstimatedPrice) / item.rfqEstimatedPrice) * 100 
                      : 0;
                    const isOver = variance > 0;
                    
                    return (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-3 font-medium">{item.description}</td>
                        <td className="px-6 py-3 text-right">{item.quantity.toLocaleString()}</td>
                        <td className="px-6 py-3 text-right text-muted-foreground uppercase text-[10px] font-bold">{item.unit}</td>
                        <td className="px-6 py-3 text-right font-bold">${item.quotedPrice.toFixed(2)}</td>
                        <td className="px-6 py-3 text-right text-muted-foreground">${item.rfqEstimatedPrice?.toFixed(2) || '-'}</td>
                        <td className="px-6 py-3 text-right">
                          <div className={cn(
                            "flex items-center justify-end gap-1 font-medium",
                            isOver ? "text-red-600" : variance < 0 ? "text-emerald-600" : "text-muted-foreground"
                          )}>
                            {isOver ? <TrendingUp size={12} /> : variance < 0 ? <TrendingDown size={12} /> : null}
                            {Math.abs(variance).toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right font-bold text-primary">
                          ${(item.quotedPrice * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-tight font-medium">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}
