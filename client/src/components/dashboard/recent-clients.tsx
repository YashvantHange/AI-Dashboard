import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";
import type { Client } from "@shared/schema";

export default function RecentClients() {
  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
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

  const recentClients = clients?.slice(0, 5) || [];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Campaigns</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Latest marketing campaigns</p>
        </div>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {recentClients.map((client) => (
          <div 
            key={client.id} 
            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            data-testid={`campaign-${client.id}`}
          >
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">{client.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{client.email}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge 
                variant={client.status === 'active' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {client.status}
              </Badge>
              <div className="text-right">
                <p className="font-semibold text-slate-900 dark:text-white">
                  ${parseFloat(client.portfolioValue || '0').toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Budget</p>
              </div>
              <Button size="sm" variant="ghost">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}