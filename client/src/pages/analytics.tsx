import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import type { Metric } from "@shared/schema";

export default function Analytics() {
  const { data: metrics, isLoading } = useQuery<Metric>({
    queryKey: ["/api/metrics"],
  });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/clients');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analytics-report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Mock data for detailed analytics
  const performanceData = [
    { month: 'Jan', revenue: 65000, clients: 45, conversions: 12 },
    { month: 'Feb', revenue: 70000, clients: 52, conversions: 15 },
    { month: 'Mar', revenue: 68000, clients: 48, conversions: 11 },
    { month: 'Apr', revenue: 75000, clients: 58, conversions: 18 },
    { month: 'May', revenue: 82000, clients: 65, conversions: 22 },
    { month: 'Jun', revenue: 78000, clients: 60, conversions: 19 },
    { month: 'Jul', revenue: 85000, clients: 70, conversions: 25 },
    { month: 'Aug', revenue: 88000, clients: 75, conversions: 28 },
    { month: 'Sep', revenue: 92000, clients: 80, conversions: 32 },
    { month: 'Oct', revenue: 85000, clients: 72, conversions: 26 },
    { month: 'Nov', revenue: 90000, clients: 78, conversions: 30 },
    { month: 'Dec', revenue: 95000, clients: 85, conversions: 35 },
  ];

  const investmentTypeData = [
    { name: 'Retirement Plans', value: 45, amount: 2500000, color: '#3B82F6' },
    { name: 'Investment Portfolios', value: 30, amount: 1800000, color: '#10B981' },
    { name: 'Insurance Products', value: 25, amount: 1200000, color: '#8B5CF6' },
  ];

  const quarterlyGrowth = [
    { quarter: 'Q1 2023', growth: 12.5, portfolioValue: 4200000 },
    { quarter: 'Q2 2023', growth: 15.2, portfolioValue: 4800000 },
    { quarter: 'Q3 2023', growth: 18.7, portfolioValue: 5700000 },
    { quarter: 'Q4 2023', growth: 22.1, portfolioValue: 6900000 },
  ];

  const clientAcquisition = [
    { month: 'Jul', newClients: 12, lostClients: 2 },
    { month: 'Aug', newClients: 15, lostClients: 3 },
    { month: 'Sep', newClients: 18, lostClients: 1 },
    { month: 'Oct', newClients: 14, lostClients: 4 },
    { month: 'Nov', newClients: 20, lostClients: 2 },
    { month: 'Dec', newClients: 25, lostClients: 3 },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Detailed insights and performance analysis
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2">
              <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Last 12 months</span>
            </div>
            <ThemeToggle />
            <Button 
              onClick={handleExport}
              className="flex items-center space-x-2 bg-primary text-white hover:bg-blue-600"
              data-testid="button-export-analytics"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow duration-200" data-testid="card-total-aum">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total AUM</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">$6.9M</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500 text-sm font-medium ml-1">+22.1%</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">YTD</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200" data-testid="card-client-retention">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Client Retention</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">94.2%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500 text-sm font-medium ml-1">+1.8%</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">vs last year</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Users className="text-emerald-600 dark:text-emerald-400 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200" data-testid="card-avg-portfolio">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Portfolio Size</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">$285K</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500 text-sm font-medium ml-1">+15.3%</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">vs last year</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-purple-600 dark:text-purple-400 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200" data-testid="card-referral-rate">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Referral Rate</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">38%</p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-red-500 text-sm font-medium ml-1">-2.1%</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">vs last quarter</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Users className="text-orange-600 dark:text-orange-400 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card data-testid="card-revenue-performance">
            <CardHeader>
              <CardTitle>Revenue Performance</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">Monthly revenue and client growth</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="month" className="text-slate-600 dark:text-slate-400" fontSize={12} />
                    <YAxis className="text-slate-600 dark:text-slate-400" fontSize={12} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(221.2, 83.2%, 53.3%)"
                      strokeWidth={3}
                      dot={{ fill: "hsl(221.2, 83.2%, 53.3%)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-quarterly-growth">
            <CardHeader>
              <CardTitle>Quarterly Portfolio Growth</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">Assets under management growth</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={quarterlyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="quarter" className="text-slate-600 dark:text-slate-400" fontSize={12} />
                    <YAxis className="text-slate-600 dark:text-slate-400" fontSize={12} />
                    <Area 
                      type="monotone" 
                      dataKey="portfolioValue" 
                      stroke="hsl(142.1, 76.2%, 36.3%)"
                      fill="hsl(142.1, 76.2%, 36.3%)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Distribution and Client Acquisition */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card data-testid="card-investment-breakdown">
            <CardHeader>
              <CardTitle>Investment Type Breakdown</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">Assets by category</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={investmentTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="amount"
                    >
                      {investmentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {investmentTypeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      ${(item.amount / 1000000).toFixed(1)}M
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card data-testid="card-client-acquisition">
              <CardHeader>
                <CardTitle>Client Acquisition Trends</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">New vs lost clients by month</p>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clientAcquisition}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                      <XAxis dataKey="month" className="text-slate-600 dark:text-slate-400" fontSize={12} />
                      <YAxis className="text-slate-600 dark:text-slate-400" fontSize={12} />
                      <Bar dataKey="newClients" fill="hsl(142.1, 76.2%, 36.3%)" name="New Clients" />
                      <Bar dataKey="lostClients" fill="hsl(0, 84.2%, 60.2%)" name="Lost Clients" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
