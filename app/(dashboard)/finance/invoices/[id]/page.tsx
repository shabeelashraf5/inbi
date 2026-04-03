'use client';

import { useEffect, use } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { useInvoiceDetail } from '@/modules/finance/hooks/use-finance';
import { InvoiceStatus, PaymentMethod } from '@/modules/finance/types/finance.types';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { DetailSkeleton } from '@/components/shared/loading-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, Calendar, Building2, CreditCard, 
  CheckCircle, Receipt, Landmark, ShieldCheck,
  FileText, Download, Printer, ExternalLink,
  History, Wallet, AlertCircle, Clock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const { invoice, isLoading, error, approveInvoice, recordPayment } = useInvoiceDetail(id);

  useEffect(() => {
    setActivePortal(Portal.FINANCE);
    if (invoice) {
      setBreadcrumbs([
        { label: 'Overview', href: '/dashboard' },
        { label: 'Finance', href: '/finance' },
        { label: 'Invoices', href: '/finance/invoices' },
        { label: invoice.invoiceNumber },
      ]);
    }
  }, [setActivePortal, setBreadcrumbs, invoice]);

  const handleApprove = async () => {
    await approveInvoice();
    toast.success('Invoice approved for payment');
  };

  const handlePay = async () => {
    // Simulated partial payment for demonstration if remaining > 0
    const payAmount = Math.min(invoice?.amountRemaining || 0, 10000);
    await recordPayment(payAmount, PaymentMethod.BANK_TRANSFER, `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    toast.success(`Payment of $${payAmount.toLocaleString()} recorded`);
  };

  if (isLoading) return <div className="space-y-6"><DetailSkeleton /></div>;
  if (error || !invoice) return <div className="py-20 text-center">Invoice not found</div>;

  const paymentPercentage = (invoice.amountPaid / invoice.totalAmount) * 100;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/finance/invoices">
            <Button variant="ghost" size="icon" className="h-10 w-10 mt-1">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{invoice.invoiceNumber}</h1>
              <StatusBadge status={invoice.status} />
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground font-medium">
               <span>Originating from</span>
               <Link href={`/supply-chain/purchase-orders/${invoice.poId}`} className="text-primary hover:underline flex items-center gap-1 font-bold">
                 <FileText size={14} /> {invoice.poNumber}
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
          {invoice.status === InvoiceStatus.PENDING_APPROVAL && (
            <Button size="sm" onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={14} className="mr-1" /> Approve
            </Button>
          )}
          {invoice.amountRemaining > 0 && invoice.status !== InvoiceStatus.PENDING_APPROVAL && (
            <Button size="sm" onClick={handlePay} className="bg-primary shadow-lg shadow-primary/20">
              <Wallet size={14} className="mr-1" /> Record Payment
            </Button>
          )}
        </div>
      </div>

      {invoice.status === InvoiceStatus.OVERDUE && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400">
           <AlertCircle size={20} />
           <p className="text-sm font-bold uppercase tracking-tight">This invoice is past its due date. Outstanding balance: ${invoice.amountRemaining.toLocaleString()}</p>
        </div>
      )}

      {/* Payment Pipeline */}
      <Card className="border-border/50 bg-muted/20">
        <CardContent className="py-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] px-8">
            {[
              { label: 'Issued', date: invoice.issueDate, done: true, icon: FileText },
              { label: 'Approved', done: invoice.status !== InvoiceStatus.PENDING_APPROVAL && invoice.status !== InvoiceStatus.DRAFT, icon: ShieldCheck },
              { label: 'Payment Sent', done: invoice.amountPaid > 0, icon: Wallet },
              { label: 'Settled', date: invoice.amountRemaining <= 0 ? invoice.updatedAt : undefined, done: invoice.amountRemaining <= 0, icon: CheckCircle },
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
        {/* Payment & Vendor Summary */}
        <Card className="md:col-span-1 border-border/50">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider">
              <Landmark size={16} className="text-primary" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
             <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground">Payment Coverage</span>
                  <span className="font-bold">{paymentPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={paymentPercentage} className="h-2 bg-muted/50" />
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/30">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase">Paid</p>
                      <p className="text-lg font-bold text-emerald-700 tabular-nums">${invoice.amountPaid.toLocaleString()}</p>
                   </div>
                   <div className={cn(
                     "p-3 rounded-xl border tabular-nums",
                     invoice.amountRemaining > 0 ? "bg-rose-50/50 border-rose-100 dark:bg-rose-950/10 dark:border-rose-900/30" : "bg-muted/50 border-border"
                   )}>
                      <p className={cn("text-[10px] font-bold uppercase", invoice.amountRemaining > 0 ? "text-rose-600" : "text-muted-foreground")}>Remaining</p>
                      <p className={cn("text-lg font-bold", invoice.amountRemaining > 0 ? "text-rose-700" : "text-muted-foreground")}>${invoice.amountRemaining.toLocaleString()}</p>
                   </div>
                </div>
             </div>
             
             <Separator />
             
             <div className="space-y-4">
                <DetailRow icon={<Building2 size={16} />} label="Vendor" value={invoice.vendor} />
                <DetailRow icon={<Calendar size={16} />} label="Due Date" value={new Date(invoice.dueDate).toLocaleDateString()} />
                <DetailRow icon={<Receipt size={16} />} label="Tax ID" value={invoice.vendorTaxId || 'N/A'} />
             </div>
          </CardContent>
        </Card>

        {/* Line Items & History */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between bg-muted/10">
              <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Line Items Breakdown</CardTitle>
              <div className="text-right">
                <p className="text-lg font-bold text-primary tabular-nums">{invoice.currency} {invoice.totalAmount.toLocaleString()}</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="text-left font-medium text-muted-foreground px-6 py-3 text-[10px] uppercase">Description</th>
                        <th className="text-right font-medium text-muted-foreground px-6 py-3 text-[10px] uppercase w-24">Qty</th>
                        <th className="text-right font-medium text-muted-foreground px-6 py-3 text-[10px] uppercase w-32">Unit Price</th>
                        <th className="text-right font-medium text-muted-foreground px-6 py-3 text-[10px] uppercase w-32">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {invoice.items.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4 font-semibold">{item.description}</td>
                          <td className="px-6 py-4 text-right tabular-nums">{item.quantity}</td>
                          <td className="px-6 py-4 text-right tabular-nums text-muted-foreground">${item.unitPrice.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right tabular-nums font-bold text-primary">${item.totalAmount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                       <tr className="bg-muted/5 font-bold uppercase tracking-wider text-[10px]">
                          <td colSpan={3} className="px-6 py-4 text-right text-muted-foreground">Subtotal</td>
                          <td className="px-6 py-4 text-right tabular-nums text-foreground">${invoice.subtotal.toLocaleString()}</td>
                       </tr>
                       <tr className="bg-muted/5 font-bold uppercase tracking-wider text-[10px]">
                          <td colSpan={3} className="px-6 py-4 text-right text-muted-foreground">VAT (5%)</td>
                          <td className="px-6 py-4 text-right tabular-nums text-foreground">${invoice.taxTotal.toLocaleString()}</td>
                       </tr>
                    </tfoot>
                  </table>
               </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                 <History size={16} /> Payment History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               {invoice.paymentHistory.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-xs italic">No payments recorded yet.</div>
               ) : (
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                        <thead>
                           <tr className="bg-muted/10 border-b border-border/50">
                              <th className="px-6 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Date</th>
                              <th className="px-6 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Ref #</th>
                              <th className="px-6 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Method</th>
                              <th className="px-6 py-3 text-right font-medium text-muted-foreground text-[10px] uppercase">Amount</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                           {invoice.paymentHistory.map((p) => (
                              <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                                 <td className="px-6 py-4 tabular-nums font-medium">{new Date(p.date).toLocaleDateString()}</td>
                                 <td className="px-6 py-4 font-mono text-[11px] font-bold text-primary">{p.reference}</td>
                                 <td className="px-6 py-4">
                                    <span className="capitalize text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted border font-bold">
                                       {p.method.replace(/_/g, ' ')}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-right font-bold tabular-nums text-emerald-600">${p.amount.toLocaleString()}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </CardContent>
          </Card>
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
