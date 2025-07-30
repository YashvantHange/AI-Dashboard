import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Settings, 
  TrendingUp 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Campaigns", href: "/clients", icon: Users },
  { name: "Audience", href: "/follow-ups", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Integrations", href: "/api-settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 shadow-lg border-r border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center">
            <BarChart3 className="text-white text-lg" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-900 dark:text-white">ADmyBRAND</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Insights</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer",
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  )}
                  data-testid={`link-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" 
              alt="User profile" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-white truncate">Marketing Team</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Agency Manager</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
