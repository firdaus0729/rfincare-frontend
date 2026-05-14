import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AgentPerformanceChart = () => {
  const data = [
    { week: 'Week 1', conversions: 45, revenue: 125000, customers: 67 },
    { week: 'Week 2', conversions: 52, revenue: 145000, customers: 78 },
    { week: 'Week 3', conversions: 48, revenue: 132000, customers: 71 },
    { week: 'Week 4', conversions: 61, revenue: 167000, customers: 89 },
    { week: 'Week 5', conversions: 58, revenue: 159000, customers: 84 },
    { week: 'Week 6', conversions: 67, revenue: 182000, customers: 95 },
    { week: 'Week 7', conversions: 72, revenue: 198000, customers: 103 },
    { week: 'Week 8', conversions: 69, revenue: 189000, customers: 98 }
  ];

  return (
    <div className="w-full h-80" aria-label="Agent Performance Line Chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="week" 
            stroke="var(--color-muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            yAxisId="left"
            stroke="var(--color-muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="var(--color-muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="conversions" 
            stroke="var(--color-agent-primary)" 
            strokeWidth={2}
            name="Conversions"
            dot={{ fill: 'var(--color-agent-primary)' }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="customers" 
            stroke="var(--color-customer-primary)" 
            strokeWidth={2}
            name="Customers"
            dot={{ fill: 'var(--color-customer-primary)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgentPerformanceChart;