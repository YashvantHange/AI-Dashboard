import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { ApiIntegration } from "@shared/schema";

export default function ApiIntegrations() {
  const { data: integrations, isLoading } = useQuery<ApiIntegration[]>({
    queryKey: ["/api/integrations"],
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Platform Integrations</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Connected marketing platforms</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Manage
        </Button>
      </div>
      
      <div className="space-y-3">
        {integrations?.map((integration) => (
          <div 
            key={integration.id} 
            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
            data-testid={`integration-${integration.id}`}
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(integration.status)}
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">{integration.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{integration.type}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(integration.status)}>
                {integration.status}
              </Badge>
              {integration.lastSync && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Last sync: {new Date(integration.lastSync).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}