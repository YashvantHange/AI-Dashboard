import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Client } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

const clientImages = [
  "https://images.unsplash.com/photo-1494790108755-2616b612b2c5?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
];

export default function RecentClients() {
  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const recentClients = clients?.slice(0, 3) || [];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return styles[status as keyof typeof styles] || styles.inactive;
  };

  const getLastAction = (client: Client) => {
    switch (client.investmentType) {
      case 'retirement':
        return 'Portfolio review scheduled';
      case 'investment':
        return 'Investment proposal sent';
      case 'insurance':
        return 'Insurance policy updated';
      default:
        return 'Recent contact';
    }
  };

  if (isLoading) {
    return (
      <Card data-testid="card-recent-clients">
        <CardHeader>
          <CardTitle>Recent Clients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-recent-clients">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Clients
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Latest client interactions
            </p>
          </div>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-blue-600 text-sm font-medium"
            data-testid="button-view-all-clients"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentClients.map((client, index) => (
            <div 
              key={client.id} 
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
              data-testid={`row-client-${client.id}`}
            >
              <img 
                src={clientImages[index] || clientImages[0]}
                alt={`${client.name} photo`} 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white">
                  {client.name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {getLastAction(client)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {client.lastContact ? formatDistanceToNow(new Date(client.lastContact), { addSuffix: true }) : 'No recent contact'}
                </p>
              </div>
              <div className="text-right">
                <Badge className={getStatusBadge(client.status)}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
