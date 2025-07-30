import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Database, 
  TrendingUp, 
  Mail, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Key,
  Link as LinkIcon,
  Activity,
  RefreshCw
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertApiIntegrationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ApiIntegration, InsertApiIntegration } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function ApiSettings() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<ApiIntegration | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrations, isLoading } = useQuery<ApiIntegration[]>({
    queryKey: ["/api/integrations"],
  });

  const createIntegrationMutation = useMutation({
    mutationFn: async (data: InsertApiIntegration) => {
      const response = await apiRequest("POST", "/api/integrations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Integration created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create integration",
        variant: "destructive",
      });
    },
  });

  const updateIntegrationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertApiIntegration> }) => {
      const response = await apiRequest("PATCH", `/api/integrations/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: "Success", 
        description: "Integration updated successfully",
      });
    },
  });

  const form = useForm<InsertApiIntegration>({
    resolver: zodResolver(insertApiIntegrationSchema),
    defaultValues: {
      name: "",
      type: "crm",
      status: "disconnected",
      description: "",
      configuration: {},
    },
  });

  const onSubmit = (data: InsertApiIntegration) => {
    createIntegrationMutation.mutate(data);
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return CheckCircle;
      case 'error':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
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

  const toggleIntegrationStatus = (integration: ApiIntegration) => {
    const newStatus = integration.status === 'connected' ? 'disconnected' : 'connected';
    updateIntegrationMutation.mutate({
      id: integration.id,
      data: { status: newStatus, lastSync: newStatus === 'connected' ? new Date().toISOString() : null }
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">API Settings</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage your integrations and API connections
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center space-x-2 bg-primary text-white hover:bg-blue-600"
                data-testid="button-add-integration"
              >
                <Plus className="h-4 w-4" />
                <span>Add Integration</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Integration</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Integration Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Salesforce CRM" data-testid="input-integration-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-integration-type">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="crm">CRM System</SelectItem>
                              <SelectItem value="market_data">Market Data</SelectItem>
                              <SelectItem value="email">Email Marketing</SelectItem>
                              <SelectItem value="accounting">Accounting</SelectItem>
                              <SelectItem value="portfolio">Portfolio Management</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-integration-status">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="disconnected">Disconnected</SelectItem>
                              <SelectItem value="connected">Connected</SelectItem>
                              <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Brief description of this integration" data-testid="textarea-integration-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel-integration"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createIntegrationMutation.isPending}
                      data-testid="button-save-integration"
                    >
                      {createIntegrationMutation.isPending ? "Creating..." : "Create Integration"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Integration Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card data-testid="card-total-integrations">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Integrations</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {integrations?.length || 0}
                  </p>
                </div>
                <LinkIcon className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-active-connections">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Connections</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {integrations?.filter(i => i.status === 'connected').length || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-pending-setup">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Setup</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {integrations?.filter(i => i.status === 'disconnected').length || 0}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-error-connections">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Errors</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {integrations?.filter(i => i.status === 'error').length || 0}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrations List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {integrations?.map((integration) => {
              const Icon = getIcon(integration.type);
              const StatusIcon = getStatusIcon(integration.status);
              
              return (
                <Card 
                  key={integration.id} 
                  className="hover:shadow-md transition-shadow duration-200"
                  data-testid={`card-integration-${integration.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                            {integration.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {integration.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <StatusIcon className={`h-4 w-4 ${getStatusColor(integration.status)}`} />
                              <Badge className={getStatusBadge(integration.status)}>
                                {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                              </Badge>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-500 capitalize">
                              {integration.type.replace('_', ' ')}
                            </span>
                            {integration.lastSync && (
                              <span className="text-xs text-slate-500 dark:text-slate-500">
                                Last sync: {formatDistanceToNow(new Date(integration.lastSync), { addSuffix: true })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                          </span>
                          <Switch
                            checked={integration.status === 'connected'}
                            onCheckedChange={() => toggleIntegrationStatus(integration)}
                            disabled={updateIntegrationMutation.isPending}
                            data-testid={`switch-${integration.id}`}
                          />
                        </div>
                        
                        {integration.status === 'connected' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateIntegrationMutation.mutate({
                              id: integration.id,
                              data: { lastSync: new Date().toISOString() }
                            })}
                            disabled={updateIntegrationMutation.isPending}
                            data-testid={`button-sync-${integration.id}`}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Sync
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedIntegration(integration)}
                          data-testid={`button-configure-${integration.id}`}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {integrations?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No integrations yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Connect your first integration to start syncing data with external services.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} data-testid="button-get-started">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Integration
            </Button>
          </div>
        )}

        {/* API Documentation */}
        <Card data-testid="card-api-documentation">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>API Access</span>
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Use our REST API to integrate with your custom applications
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">Base URL</h4>
              <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                https://your-domain.com/api
              </code>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Available Endpoints</h4>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><code>GET /api/clients</code> - List clients</li>
                  <li><code>POST /api/clients</code> - Create client</li>
                  <li><code>GET /api/follow-ups</code> - List follow-ups</li>
                  <li><code>POST /api/follow-ups</code> - Create follow-up</li>
                  <li><code>GET /api/metrics</code> - Get metrics</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Authentication</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  All API requests require authentication using session cookies.
                </p>
                <Button size="sm" variant="outline" data-testid="button-view-docs">
                  View Full Documentation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
