'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/use-auth';
import { getPortalFromPath } from '@/lib/constants/roles';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProtectedPortalProps {
  children: React.ReactNode;
}

export function ProtectedPortal({ children }: ProtectedPortalProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, canAccess } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // If not logged in, the layout already handles redirection. 
    // Here we just check portal-specific permissions.
    if (!user) return;

    const portal = getPortalFromPath(pathname);
    
    // If it's not a portal-specific path (e.g., just /dashboard), allow it
    if (!portal) {
      setIsAuthorized(true);
      return;
    }

    const hasAccess = canAccess(portal);
    setIsAuthorized(hasAccess);
  }, [pathname, user, canAccess]);

  if (isAuthorized === null) {
    return null; // Or a loading spinner
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-rose-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Access Restricted</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Your current role (<strong>{user?.role}</strong>) does not have permission to access the 
          <strong> {getPortalFromPath(pathname)}</strong> module.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
