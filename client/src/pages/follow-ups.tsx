import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Calendar, Clock, Phone, Video, Mail, CheckCircle, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFollowUpSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FollowUp, Client, InsertFollowUp } from "@shared/schema";
import { format, isToday, isTomorrow, isPast, formatDistanceToNow } from "date-fns";

export default function FollowUps() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: followUps, isLoading: followUpsLoading } = useQuery<FollowUp[]>({
    queryKey: ["/api/follow-ups"],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const createFollowUpMutation = useMutation({
    mutationFn: async (data: InsertFollowUp) => {
      const response = await apiRequest("POST", "/api/follow-ups", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/follow-ups"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Follow-up created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create follow-up",
        variant: "destructive",
      });
    },
  });

  const completeFollowUpMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("PATCH", `/api/follow-ups/${id}`, {
        status: "completed"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/follow-ups"] });
      toast({
        title: "Success",
        description: "Follow-up marked as completed",
      });
    },
  });

  const form = useForm<InsertFollowUp>({
    resolver: zodResolver(insertFollowUpSchema),
    defaultValues: {
      clientId: "",
      title: "",
      description: "",
      scheduledDate: "",
      type: "meeting",
      status: "pending",
      priority: "medium",
    },
  });

  const onSubmit = (data: InsertFollowUp) => {
    createFollowUpMutation.mutate(data);
  };

  const getClientName = (clientId: string) => {
    return clients?.find(c => c.id === clientId)?.name || "Unknown Client";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return Phone;
      case 'meeting':
        return Video;
      case 'email':
        return Mail;
      default:
        return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'meeting':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'email':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      default:
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    };
    return styles[priority as keyof typeof styles] || styles.medium;
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return 'Overdue';
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const sortedFollowUps = followUps?.sort((a, b) => {
    const dateA = new Date(a.scheduledDate);
    const dateB = new Date(b.scheduledDate);
    return dateA.getTime() - dateB.getTime();
  }) || [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Follow-ups</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage your scheduled client meetings and calls
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center space-x-2 bg-primary text-white hover:bg-blue-600"
                data-testid="button-add-followup"
              >
                <Plus className="h-4 w-4" />
                <span>Schedule Follow-up</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule Follow-up</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-followup-client">
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients?.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-followup-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} data-testid="textarea-followup-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheduled Date & Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field} 
                            data-testid="input-followup-date"
                          />
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
                              <SelectTrigger data-testid="select-followup-type">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="meeting">Meeting</SelectItem>
                              <SelectItem value="call">Call</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="review">Review</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-followup-priority">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel-followup"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createFollowUpMutation.isPending}
                      data-testid="button-save-followup"
                    >
                      {createFollowUpMutation.isPending ? "Creating..." : "Schedule"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {followUpsLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedFollowUps.map((followUp) => {
              const TypeIcon = getTypeIcon(followUp.type);
              const scheduledDate = new Date(followUp.scheduledDate);
              const isOverdue = isPast(scheduledDate) && followUp.status === "pending";
              
              return (
                <Card 
                  key={followUp.id} 
                  className={`hover:shadow-md transition-shadow duration-200 ${isOverdue ? 'border-red-200 dark:border-red-800' : ''}`}
                  data-testid={`card-followup-${followUp.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${getTypeColor(followUp.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {followUp.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {getClientName(followUp.clientId)}
                            </p>
                            {followUp.description && (
                              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                                {followUp.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusBadge(followUp.status)}>
                              {followUp.status.charAt(0).toUpperCase() + followUp.status.slice(1)}
                            </Badge>
                            <Badge className={getPriorityBadge(followUp.priority)}>
                              {followUp.priority.charAt(0).toUpperCase() + followUp.priority.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-500">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{format(scheduledDate, 'h:mm a')}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                                {formatDate(scheduledDate)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {followUp.status === "pending" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => completeFollowUpMutation.mutate(followUp.id)}
                                disabled={completeFollowUpMutation.isPending}
                                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 p-1"
                                data-testid={`button-complete-${followUp.id}`}
                              >
                                <CheckCircle className="h-5 w-5" />
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-1"
                              data-testid={`button-edit-followup-${followUp.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-1 text-red-600"
                              data-testid={`button-delete-followup-${followUp.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {sortedFollowUps.length === 0 && !followUpsLoading && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No follow-ups scheduled. Create your first follow-up to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
