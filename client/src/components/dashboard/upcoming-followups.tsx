import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import type { FollowUp } from "@shared/schema";

export default function UpcomingFollowups() {
  const { data: followUps, isLoading } = useQuery<FollowUp[]>({
    queryKey: ["/api/follow-ups/upcoming"],
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const upcomingTasks = followUps?.slice(0, 4) || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Tasks</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Campaign optimization tasks</p>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="w-4 h-4 mr-2" />
          View Calendar
        </Button>
      </div>
      
      <div className="space-y-4">
        {upcomingTasks.map((task) => (
          <div 
            key={task.id} 
            className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            data-testid={`task-${task.id}`}
          >
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">{task.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{task.description}</p>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {format(new Date(task.scheduledDate), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}