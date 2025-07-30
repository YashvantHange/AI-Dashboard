import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, PieChart, ArrowUp } from "lucide-react";
import type { Metric } from "@shared/schema";

interface MetricsCardsProps {
  metrics?: Metric;
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  if (!metrics) return null;

  const cards = [
    {
      title: "Total Revenue",
      value: `$${parseFloat(metrics.totalRevenue).toLocaleString()}`,
      change: "+12.5%",
      icon: DollarSign,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Active Users",
      value: metrics.activeClients.toLocaleString(),
      change: "+8.2%",
      icon: Users,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Conversions",
      value: `${metrics.conversionRate}%`,
      change: "+3.1%",
      icon: TrendingUp,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Growth %",
      value: `${metrics.portfolioGrowth}%`,
      change: "+2.4%",
      icon: PieChart,
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card 
          key={index} 
          className="hover:shadow-md transition-shadow duration-200"
          data-testid={`card-metric-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {card.value}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500 text-sm font-medium ml-1">
                    {card.change}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`${card.iconColor} text-xl`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
