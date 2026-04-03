'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Package, BarChart3, Shield, Zap,
  ChevronRight, Globe, Layers
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isHydrated, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              IN
            </div>
            <span className="text-lg font-semibold tracking-tight">INBI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#modules" className="text-muted-foreground hover:text-foreground transition-colors">Modules</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
          </div>
          <Link href="/login">
            <Button size="sm" className="shadow-sm">
              Sign In <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6 shadow-sm">
            <Zap size={14} className="text-primary" />
            Enterprise-ready ERP Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Streamline your
            <span className="text-primary"> supply chain</span> operations
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            INBI ERP brings procurement, inventory, logistics, and finance into one unified platform.
            Built for modern businesses that demand speed and precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                Get Started <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Learn More
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-xl mx-auto">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '50%', label: 'Faster Processing' },
              { value: '24/7', label: 'Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-border/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-2">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to operate</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Comprehensive tools designed for each department in your organization.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Package,
                title: 'Supply Chain',
                description: 'Manage RFQs, quotes, purchase orders, and inventory from a single dashboard.',
              },
              {
                icon: BarChart3,
                title: 'Real-time Analytics',
                description: 'Track KPIs, revenue trends, and order pipelines with live data visualizations.',
              },
              {
                icon: Shield,
                title: 'Role-Based Access',
                description: 'Granular permissions ensure the right people see the right data at the right time.',
              },
              {
                icon: Layers,
                title: 'Multi-Portal System',
                description: 'Separate portals for Supply Chain, CRM, HR, and Finance — all under one roof.',
              },
              {
                icon: Globe,
                title: 'Built for Scale',
                description: 'Architecture designed to grow with your business. Add modules without friction.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Optimized for speed with instant navigation, smart caching, and skeleton loading.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/50 bg-card p-6 hover:border-border hover:shadow-md transition-all duration-300"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/15 transition-colors">
                  <feature.icon size={22} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-24 bg-muted/30 border-t border-border/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-2">Modules</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Modular by design</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Start with what you need. Expand when you&apos;re ready.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Supply Chain', status: 'Active', description: 'RFQ, Quotes, Purchase Orders, Inventory', available: true },
              { name: 'CRM', status: 'Coming Soon', description: 'Leads, Contacts, Deals, Pipeline', available: false },
              { name: 'Human Resources', status: 'Coming Soon', description: 'Employees, Payroll, Leave, Attendance', available: false },
              { name: 'Finance', status: 'Coming Soon', description: 'Invoicing, Accounting, Reports', available: false },
            ].map((mod) => (
              <div
                key={mod.name}
                className={`flex items-center justify-between rounded-xl border p-5 transition-all ${
                  mod.available
                    ? 'border-primary/20 bg-card shadow-sm hover:shadow-md'
                    : 'border-border/50 bg-card/50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{mod.name}</h3>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      mod.available
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {mod.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{mod.description}</p>
                </div>
                <ChevronRight size={18} className="text-muted-foreground/40" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-24 border-t border-border/30">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to get started?</h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Experience the future of enterprise resource planning.
          </p>
          <Link href="/login">
            <Button size="lg" className="mt-8 h-12 px-8 text-base shadow-lg shadow-primary/20">
              Launch Dashboard <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-[10px]">
              IN
            </div>
            <span className="text-sm font-medium">INBI ERP</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} INBI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
