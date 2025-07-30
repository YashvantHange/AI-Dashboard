import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface RevenueChartProps {
  data?: number[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const chartData = data ? data.map((value, index) => ({
    month: months[index],
    revenue: value,
  })) : [];

  return (
    <Card data-testid="card-revenue-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              Revenue Trends
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Monthly revenue performance
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              className="px-3 py-1 text-sm bg-primary text-white"
              data-testid="button-chart-12m"
            >
              12M
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              data-testid="button-chart-6m"
            >
              6M
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              data-testid="button-chart-3m"
            >
              3M
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis 
                dataKey="month" 
                className="text-slate-600 dark:text-slate-400"
                fontSize={12}
              />
              <YAxis 
                className="text-slate-600 dark:text-slate-400"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(221.2, 83.2%, 53.3%)"
                strokeWidth={3}
                dot={{ fill: "hsl(221.2, 83.2%, 53.3%)", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: "hsl(221.2, 83.2%, 53.3%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
