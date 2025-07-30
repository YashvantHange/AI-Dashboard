import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, TrendingUp, Mail, Settings, Plus } from "lucide-react";
import type { ApiIntegration } from "@shared/schema";

export default function ApiIntegrations() {
  const { data: integrations, isLoading } = useQuery<ApiIntegration[]>({
    queryKey: ["/api/integrations"],
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'crm':
        return Database;
      case 'market_data':
        return TrendingUp;
      case 'email':
        return Mail;
      default:
        return Database;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'crm':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'market_data':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'email':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      connected: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      disconnected: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[status as keyof typeof styles] || styles.disconnected;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Setup Required';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <Card data-testid="card-api-integrations">
        <CardHeader>
          <CardTitle>API Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-api-integrations">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              API Integrations
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage your custom integrations and data connections
            </p>
          </div>
          <Button 
            className="flex items-center space-x-2 bg-primary text-white hover:bg-blue-600"
            data-testid="button-new-integration"
          >
            <Plus className="h-4 w-4" />
            <span>New Integration</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {integrations?.map((integration) => {
            const Icon = getIcon(integration.type);
            
            return (
              <div 
                key={integration.id} 
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                data-testid={`card-integration-${integration.id}`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 ${getIconColor(integration.type)} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {integration.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                      {integration.status}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {integration.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge className={getStatusBadge(integration.status)}>
                    {getStatusText(integration.status)}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                    data-testid={`button-settings-${integration.id}`}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
