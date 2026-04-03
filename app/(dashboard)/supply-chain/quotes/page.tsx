'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { useQuotes } from '@/modules/supply-chain/quotes/hooks/use-quotes';
import { QuoteStatus } from '@/modules/supply-chain/quotes/types/quotes.types';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { Search, Plus, Filter, ArrowUpDown, MoreHorizontal, FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuotesPage() {
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const { quotes, isLoading, setFilters } = useQuotes();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: 'Quotes' },
    ]);
  }, [setActivePortal, setBreadcrumbs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleStatusChange = (value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      status: !value || value === 'all' ? undefined : (value as QuoteStatus),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Quotes" 
          description="Manage and compare vendor quotations." 
        />
        <Link href="/supply-chain/quotes/new">
          <Button size="sm">
            <Plus size={16} className="mr-2" /> New Quote
          </Button>
        </Link>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search by vendor, quote #, or RFQ..."
                className="pl-9 bg-background/50"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full md:w-[150px] bg-background/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={QuoteStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={QuoteStatus.UNDER_REVIEW}>Under Review</SelectItem>
                  <SelectItem value={QuoteStatus.ACCEPTED}>Accepted</SelectItem>
                  <SelectItem value={QuoteStatus.REJECTED}>Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="px-6 py-4 font-medium text-muted-foreground w-32">Quote #</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Vendor</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">RFQ Ref</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Submitted</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-right w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {quotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No quotes found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4">
                        <Link 
                          href={`/supply-chain/quotes/${quote.id}`}
                          className="font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          {quote.quoteNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-medium">{quote.vendor}</td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/supply-chain/rfq/${quote.rfqId}`}
                          className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                        >
                          <FileText size={14} />
                          {quote.rfqNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ${quote.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={quote.status} />
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(quote.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/supply-chain/quotes/${quote.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink size={14} />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
