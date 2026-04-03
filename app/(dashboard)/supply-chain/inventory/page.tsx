'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { useInventory } from '@/modules/supply-chain/inventory/hooks/use-inventory';
import { InventoryStatus } from '@/modules/supply-chain/inventory/types/inventory.types';
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
import { Search, Plus, Filter, Package, AlertTriangle, TrendingUp, Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InventoryPage() {
  const { setActivePortal, setBreadcrumbs } = useAppStore();
  const { items, isLoading, setFilters } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setActivePortal(Portal.SUPPLY_CHAIN);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Supply Chain', href: '/supply-chain' },
      { label: 'Inventory' },
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
      status: !value || value === 'all' ? undefined : (value as InventoryStatus),
    }));
  };

  const handleCategoryChange = (value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      category: !value || value === 'all' ? undefined : value,
    }));
  };

  const stats = [
    { label: 'Total Items', value: items.length, icon: Boxes, color: 'text-blue-600' },
    { label: 'Low Stock', value: items.filter(i => i.status === InventoryStatus.LOW_STOCK).length, icon: AlertTriangle, color: 'text-amber-600' },
    { label: 'Out of Stock', value: items.filter(i => i.status === InventoryStatus.OUT_OF_STOCK).length, icon: Package, color: 'text-rose-600' },
    { 
      label: 'Inventory Value', 
      value: `$${items.reduce((sum, i) => sum + i.totalValuation, 0).toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'text-emerald-600' 
    },
  ];

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Inventory" 
          description="Manage warehouse stock and material movements." 
        />
        <Button size="sm">
          <Plus size={16} className="mr-2" /> Add Material
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className={cn("text-xl font-bold mt-1", stat.color)}>{stat.value}</p>
              </div>
              <div className={cn("p-2 rounded-lg bg-background", stat.color)}>
                <stat.icon size={18} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search by name, SKU, or category..."
                className="pl-9 bg-background/50"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-[150px] bg-background/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-[150px] bg-background/50">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={InventoryStatus.IN_STOCK}>In Stock</SelectItem>
                  <SelectItem value={InventoryStatus.LOW_STOCK}>Low Stock</SelectItem>
                  <SelectItem value={InventoryStatus.OUT_OF_STOCK}>Out of Stock</SelectItem>
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
                  <th className="px-6 py-4 font-medium text-muted-foreground">Item & SKU</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground w-40">Category</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-right w-32">On Hand</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-right w-32">Available</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No inventory items found.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors group cursor-pointer" onClick={() => window.location.href=`/supply-chain/inventory/${item.id}`}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-primary group-hover:underline">
                          {item.name}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{item.sku}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold">{item.quantityOnHand.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{item.unit}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-primary">{item.availableQuantity.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Ready</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        ${item.totalValuation.toLocaleString()}
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
