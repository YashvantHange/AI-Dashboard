import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, campaigns: 24 },
  { name: 'Feb', revenue: 3000, campaigns: 13 },
  { name: 'Mar', revenue: 2000, campaigns: 18 },
  { name: 'Apr', revenue: 2780, campaigns: 39 },
  { name: 'May', revenue: 1890, campaigns: 48 },
  { name: 'Jun', revenue: 2390, campaigns: 38 },
  { name: 'Jul', revenue: 3490, campaigns: 43 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Trends</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Monthly revenue and campaign performance</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis 
              dataKey="name" 
              className="text-slate-600 dark:text-slate-400" 
              fontSize={12}
            />
            <YAxis 
              className="text-slate-600 dark:text-slate-400" 
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
            />
            <Line 
              type="monotone" 
              dataKey="campaigns" 
              stroke="hsl(142.1, 76.2%, 36.3%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(142.1, 76.2%, 36.3%)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}