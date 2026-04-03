'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app.store';
import { Portal } from '@/types/common.types';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';

export default function PaymentsPage() {
  const { setActivePortal, setBreadcrumbs } = useAppStore();

  useEffect(() => {
    setActivePortal(Portal.FINANCE);
    setBreadcrumbs([
      { label: 'Overview', href: '/dashboard' },
      { label: 'Finance', href: '/finance' },
      { label: 'Payments' },
    ]);
  }, [setActivePortal, setBreadcrumbs]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Payments" 
        description="Track all outgoing and incoming payment transactions." 
      />
      <EmptyState
        title="Payments tracking coming soon"
        description="We are currently integrating with payment gateways. This module will be available shortly."
      />
    </div>
  );
}
