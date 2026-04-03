'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/types/auth.types';
import { MOCK_USERS } from '@/lib/mock/users';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Crown, Wrench, BarChart3, ShoppingBag, Truck, Calculator, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLE_CARDS = [
  { role: Role.CEO, icon: Crown, label: 'CEO', description: 'Full system access', color: '#c4956a' },
  { role: Role.SALES_ENGINEER, icon: Wrench, label: 'Sales Engineer', description: 'RFQ & technical specs', color: '#6aa8c4' },
  { role: Role.SALES_MANAGER, icon: BarChart3, label: 'Sales Manager', description: 'Approvals & reporting', color: '#8bc46a' },
  { role: Role.PROCUREMENT_OFFICER, icon: ShoppingBag, label: 'Procurement Officer', description: 'Purchase management', color: '#c4b86a' },
  { role: Role.LOGISTICS_OFFICER, icon: Truck, label: 'Logistics Officer', description: 'Inventory & shipping', color: '#c46a8b' },
  { role: Role.ACCOUNTS, icon: Calculator, label: 'Accounts', description: 'Finance & invoicing', color: '#8b6ac4' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleLogin = async () => {
    if (!selectedRole) return;
    setIsLoading(true);

    const user = MOCK_USERS.find((u) => u.role === selectedRole);
    if (!user) return;

    // Simulate login delay
    await new Promise((r) => setTimeout(r, 600));
    login(user);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
              IN
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to INBI</h1>
          <p className="text-muted-foreground mt-2">Select your role to access the ERP system</p>
        </div>

        {/* Role Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {ROLE_CARDS.map(({ role, icon: Icon, label, description, color }) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={cn(
                'group relative flex flex-col items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200',
                selectedRole === role
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                  : 'border-border/50 bg-card hover:border-border hover:shadow-sm'
              )}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                style={{
                  backgroundColor: color + '15',
                  color: color,
                }}
              >
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
              {selectedRole === role && (
                <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={!selectedRole || isLoading}
          className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Signing in...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Continue as {selectedRole || '...'}
              <ArrowRight size={16} />
            </div>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          This is a demo environment. Select any role to explore the system.
        </p>
      </div>
    </div>
  );
}
