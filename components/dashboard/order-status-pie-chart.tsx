'use client';

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import { useState, useEffect } from 'react';

interface OrderStatusPieChartProps {
  data: any[];
}

export default function OrderStatusPieChart({ data }: OrderStatusPieChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="h-[200px] w-full bg-muted/5 animate-pulse rounded-xl" />;

  return (
    <div className="h-[200px] w-full min-w-0 relative">
      <ResponsiveContainer 
        key={isClient ? 'active' : 'loading'}
        width="100%" 
        height="100%" 
        minWidth={0} 
        debounce={50}
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip
            contentStyle={{
              backgroundColor: 'oklch(0.995 0.002 80)',
              border: '1px solid oklch(0.90 0.01 75)',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
