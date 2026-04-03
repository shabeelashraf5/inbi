'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { useState, useEffect } from 'react';

interface VolumeBarChartProps {
  data: any[];
}

export default function VolumeBarChart({ data }: VolumeBarChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="h-[320px] w-full bg-muted/5 animate-pulse rounded-xl mt-4" />;

  return (
    <div className="h-[320px] mt-4 w-full min-w-0 relative">
      <ResponsiveContainer 
        key={isClient ? 'active' : 'loading'}
        width="100%" 
        height="100%" 
        minWidth={0} 
        debounce={50}
      >
        <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.01 75)" vertical={false} />
          <XAxis dataKey="stage" tick={{ fontSize: 11, fontWeight: 'bold' }} stroke="oklch(0.52 0.02 60)" axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.52 0.02 60)" axisLine={false} tickLine={false} />
          <RechartsTooltip
            cursor={{ fill: 'oklch(0.95 0.01 75)', opacity: 0.4 }}
            contentStyle={{
              backgroundColor: 'oklch(0.995 0.002 80)',
              border: '1px solid oklch(0.90 0.01 75)',
              borderRadius: '12px',
              fontSize: '13px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index % 2 === 0 ? 'oklch(0.62 0.09 55)' : 'oklch(0.58 0.12 160)'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
