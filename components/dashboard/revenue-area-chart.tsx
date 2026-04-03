'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { useState, useEffect } from 'react';

interface RevenueAreaChartProps {
  data: any[];
}

export default function RevenueAreaChart({ data }: RevenueAreaChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="h-[280px] w-full bg-muted/5 animate-pulse rounded-xl" />;

  return (
    <div className="h-[280px] w-full min-w-0 relative">
      <ResponsiveContainer 
        key={isClient ? 'active' : 'loading'}
        width="100%" 
        height="100%" 
        minWidth={0} 
        debounce={50}
      >
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.62 0.09 55)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.62 0.09 55)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.01 75)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.52 0.02 60)" />
          <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.52 0.02 60)" tickFormatter={(v) => `$${v / 1000}k`} />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: 'oklch(0.995 0.002 80)',
              border: '1px solid oklch(0.90 0.01 75)',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            formatter={(value: any) => [`$${(Number(value) / 1000).toFixed(0)}k`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="oklch(0.62 0.09 55)"
            strokeWidth={2}
            fill="url(#colorRevenue)"
            name="Revenue"
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke="oklch(0.75 0.01 60)"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            fill="transparent"
            name="Target"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
