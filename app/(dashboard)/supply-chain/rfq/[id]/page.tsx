'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { useRFQDetail } from '@/modules/supply-chain/rfq/hooks/use-rfq-detail';
import { RFQStatus } from '@/modules/supply-chain/rfq/types/rfq.types';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { DetailSkeleton } from '@/components/shared/loading-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Mail, AlertTriangle, CheckCircle, X, FileText, Download, Send, Copy } from 'lucide-react';
import { use } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  urgent: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function RFQDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const { rfq, isLoading, error, updateStatus } = useRFQDetail(id);

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: 'RFQ', href: '/supply-chain/rfq' },
      { label: rfq?.rfqNumber || '...' },
    ]);
  }, [setActivePortal, setBreadcrumbs, rfq?.rfqNumber]);

  const handleStatusUpdate = async (status: RFQStatus) => {
    await updateStatus(status);
    toast.success(`RFQ status updated to ${status.replace(/_/g, ' ')}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !rfq) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle size={48} className="text-destructive/30 mb-4" />
        <h2 className="text-lg font-semibold">RFQ not found</h2>
        <p className="text-sm text-muted-foreground mt-1">The requested RFQ could not be found.</p>
        <Link href="/supply-chain/rfq">
          <Button variant="outline" className="mt-4" size="sm">
            <ArrowLeft size={14} className="mr-1" /> Back to list
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full px-4 md:px-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/supply-chain/rfq">
            <Button variant="ghost" size="icon" className="h-9 w-9 mt-0.5">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{rfq.rfqNumber}</h1>
              <StatusBadge status={rfq.status} />
              <span className={cn(
                'text-[11px] font-medium px-2 py-0.5 rounded-md capitalize',
                PRIORITY_COLORS[rfq.priority]
              )}>
                {rfq.priority}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{rfq.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText size={14} className="mr-1" /> Download PDF
          </Button>
          {rfq.status === RFQStatus.SUBMITTED && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive border-destructive/30 hover:bg-destructive/5"
                onClick={() => handleStatusUpdate(RFQStatus.REJECTED)}
              >
                <X size={14} className="mr-1" /> Reject
              </Button>
              <Button size="sm" onClick={() => handleStatusUpdate(RFQStatus.APPROVED)}>
                <CheckCircle size={14} className="mr-1" /> Approve
              </Button>
            </>
          )}
          {rfq.status === RFQStatus.DRAFT && (
            <Button size="sm" onClick={() => handleStatusUpdate(RFQStatus.SUBMITTED)}>
              Submit RFQ
            </Button>
          )}
        </div>
      </div>

      {/* Horizontal Timeline */}
      <Card className="border-border/50 bg-muted/20">
        <CardContent className="py-6 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] px-8">
            {[
              { label: 'Created', date: rfq.createdAt, done: true },
              { label: 'Submitted', date: rfq.submittedDate, done: rfq.status !== RFQStatus.DRAFT },
              {
                label: 'Under Review',
                date: rfq.status === RFQStatus.UNDER_REVIEW ? rfq.updatedAt : undefined,
                done: [RFQStatus.UNDER_REVIEW, RFQStatus.QUOTED, RFQStatus.APPROVED].includes(rfq.status),
              },
              {
                label: 'Decision',
                date: [RFQStatus.APPROVED, RFQStatus.REJECTED].includes(rfq.status) ? rfq.updatedAt : undefined,
                done: [RFQStatus.APPROVED, RFQStatus.REJECTED].includes(rfq.status),
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
                      arr[i+1].done ? 'w-full' : 'w-0'
                    )} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="space-y-6">
        {/* Details Card */}
        <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={<User size={14} />} label="Client" value={rfq.client} />
                <InfoRow icon={<Mail size={14} />} label="Email" value={rfq.clientEmail} />
                <InfoRow icon={<Calendar size={14} />} label="Submitted" value={rfq.submittedDate} />
                <InfoRow icon={<Calendar size={14} />} label="Due Date" value={rfq.dueDate} />
                <InfoRow icon={<User size={14} />} label="Submitted By" value={rfq.submittedBy} />
                <InfoRow
                  icon={<AlertTriangle size={14} />}
                  label="Total Estimate"
                  value={`$${rfq.totalEstimate.toLocaleString()}`}
                  highlight
                />
              </div>
              {rfq.notes && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{rfq.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Line Items ({rfq.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left font-medium text-muted-foreground px-6 py-3">#</th>
                      <th className="text-left font-medium text-muted-foreground px-6 py-3">Description</th>
                      <th className="text-right font-medium text-muted-foreground px-6 py-3">Qty</th>
                      <th className="text-left font-medium text-muted-foreground px-6 py-3">Unit</th>
                      <th className="text-right font-medium text-muted-foreground px-6 py-3">Est. Price</th>
                      <th className="text-right font-medium text-muted-foreground px-6 py-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {rfq.items.map((item, i) => (
                      <tr key={item.id || i} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-3 text-muted-foreground">{i + 1}</td>
                        <td className="px-6 py-3 font-medium">{item.description}</td>
                        <td className="px-6 py-3 text-right">{item.quantity.toLocaleString()}</td>
                        <td className="px-6 py-3 text-muted-foreground">{item.unit}</td>
                        <td className="px-6 py-3 text-right">${item.estimatedPrice?.toFixed(2) || '-'}</td>
                        <td className="px-6 py-3 text-right font-medium">
                          ${((item.estimatedPrice || 0) * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border">
                      <td colSpan={5} className="px-6 py-3 text-right font-semibold">Total</td>
                      <td className="px-6 py-3 text-right font-bold text-primary">
                        ${rfq.totalEstimate.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          {rfq.termsAndConditions && rfq.termsAndConditions.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                  {rfq.termsAndConditions.map((term, i) => (
                    <div key={term.id || i} className="flex flex-col sm:flex-row sm:items-center py-3 px-6 gap-2 sm:gap-6 hover:bg-muted/30 transition-colors">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/4 shrink-0">
                        {term.label}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {term.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex h-5 w-5 items-center justify-center text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn('text-sm', highlight && 'font-semibold text-primary')}>{value}</p>
      </div>
    </div>
  );
}
