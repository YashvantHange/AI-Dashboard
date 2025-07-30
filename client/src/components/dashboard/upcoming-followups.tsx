import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, CheckCircle, Phone, Video } from "lucide-react";
import type { FollowUp, Client } from "@shared/schema";
import { format, isToday, isTomorrow, formatDistanceToNow } from "date-fns";

export default function UpcomingFollowUps() {
  const { data: followUps, isLoading: followUpsLoading } = useQuery<FollowUp[]>({
    queryKey: ["/api/follow-ups/upcoming"],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

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
        return Calendar;
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

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (followUpsLoading) {
    return (
      <Card data-testid="card-upcoming-followups">
        <CardHeader>
          <CardTitle>Upcoming Follow-ups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4 p-3 border rounded-lg">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const upcomingFollowUps = followUps?.slice(0, 3) || [];

  return (
    <Card data-testid="card-upcoming-followups">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              Upcoming Follow-ups
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Scheduled client meetings
            </p>
          </div>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-blue-600 text-sm font-medium"
            data-testid="button-view-calendar"
          >
            View Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingFollowUps.map((followUp) => {
            const TypeIcon = getTypeIcon(followUp.type);
            const scheduledDate = new Date(followUp.scheduledDate);
            
            return (
              <div 
                key={followUp.id} 
                className="flex items-start space-x-4 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                data-testid={`row-followup-${followUp.id}`}
              >
                <div className={`w-12 h-12 ${getTypeColor(followUp.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <TypeIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {getClientName(followUp.clientId)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {followUp.title}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{format(scheduledDate, 'h:mm a')}</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(scheduledDate)}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 p-1"
                  data-testid={`button-complete-followup-${followUp.id}`}
                >
                  <CheckCircle className="h-5 w-5" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
