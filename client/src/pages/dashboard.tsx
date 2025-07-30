import { useQuery } from "@tanstack/react-query";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import MetricsCards from "@/components/dashboard/metrics-cards";
import RevenueChart from "@/components/dashboard/revenue-chart";
import ClientDistributionChart from "@/components/dashboard/client-distribution-chart";
import RecentClients from "@/components/dashboard/recent-clients";
import UpcomingFollowUps from "@/components/dashboard/upcoming-followups";
import ApiIntegrations from "@/components/dashboard/api-integrations";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/metrics"],
  });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/clients');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clients.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Welcome back! Here's what's happening with your clients today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Date Range Picker */}
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2">
              <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Last 30 days</span>
            </div>

            <ThemeToggle />

            {/* Export Button */}
            <Button 
              onClick={handleExport}
              className="flex items-center space-x-2 bg-primary text-white hover:bg-blue-600"
              data-testid="button-export"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Metrics Cards */}
        {metricsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <MetricsCards metrics={metrics} />
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart data={metrics?.monthlyData?.revenue} />
          </div>
          <ClientDistributionChart />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentClients />
          <UpcomingFollowUps />
        </div>

        {/* API Integrations */}
        <ApiIntegrations />
      </div>
    </div>
  );
}
