import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ApplicationVolumeChart = () => {
  const data = [
    { month: 'Jan', submitted: 245, approved: 189, rejected: 34, pending: 22 },
    { month: 'Feb', submitted: 312, approved: 256, rejected: 41, pending: 15 },
    { month: 'Mar', submitted: 289, approved: 234, rejected: 38, pending: 17 },
    { month: 'Apr', submitted: 356, approved: 298, rejected: 42, pending: 16 },
    { month: 'May', submitted: 401, approved: 345, rejected: 39, pending: 17 },
    { month: 'Jun', submitted: 378, approved: 321, rejected: 41, pending: 16 },
    { month: 'Jul', submitted: 423, approved: 367, rejected: 38, pending: 18 },
    { month: 'Aug', submitted: 445, approved: 389, rejected: 40, pending: 16 },
    { month: 'Sep', submitted: 412, approved: 356, rejected: 42, pending: 14 },
    { month: 'Oct', submitted: 467, approved: 401, rejected: 45, pending: 21 },
    { month: 'Nov', submitted: 489, approved: 423, rejected: 48, pending: 18 },
    { month: 'Dec', submitted: 512, approved: 445, rejected: 51, pending: 16 }
  ];

  return (
    <div className="w-full h-80" aria-label="Application Volume Bar Chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="month" 
            stroke="var(--color-muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
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
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Bar dataKey="submitted" fill="var(--color-customer-primary)" name="Submitted" />
          <Bar dataKey="approved" fill="var(--color-conversion)" name="Approved" />
          <Bar dataKey="rejected" fill="var(--color-destructive)" name="Rejected" />
          <Bar dataKey="pending" fill="var(--color-warning)" name="Pending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplicationVolumeChart;