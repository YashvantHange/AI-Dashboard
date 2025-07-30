import type { Client, FollowUp, Metric, ApiIntegration } from "@shared/schema";

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0123",
    status: "active",
    investmentType: "retirement",
    portfolioValue: "250000.00",
    lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000),
    notes: "Interested in expanding retirement portfolio",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1-555-0124",
    status: "pending",
    investmentType: "investment",
    portfolioValue: "450000.00",
    lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000),
    notes: "Reviewing investment proposal",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1-555-0125",
    status: "active",
    investmentType: "insurance",
    portfolioValue: "180000.00",
    lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000),
    notes: "Updated life insurance policy",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockFollowUps: FollowUp[] = [
  {
    id: "1",
    clientId: "1",
    title: "Quarterly portfolio review",
    description: "Review Q4 performance and discuss 2024 strategy",
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    type: "meeting",
    status: "pending",
    priority: "high",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    clientId: "2",
    title: "Investment strategy call",
    description: "Discuss new investment opportunities",
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    type: "call",
    status: "pending",
    priority: "medium",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockMetrics: Metric = {
  id: "1",
  date: new Date(),
  totalRevenue: "847239.00",
  activeClients: 1247,
  conversionRate: "24.3",
  portfolioGrowth: "18.7",
  monthlyData: {
    revenue: [65000, 70000, 68000, 75000, 82000, 78000, 85000, 88000, 92000, 85000, 90000, 95000],
    clients: [980, 1020, 1050, 1120, 1180, 1200, 1210, 1230, 1240, 1245, 1246, 1247]
  }
};

export const mockApiIntegrations: ApiIntegration[] = [
  {
    id: "1",
    name: "Salesforce CRM",
    type: "crm",
    status: "connected",
    description: "Sync client data with Salesforce CRM system",
    configuration: { endpoint: "https://api.salesforce.com", apiKey: "***" },
    lastSync: new Date(),
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Bloomberg Market Data",
    type: "market_data",
    status: "connected",
    description: "Real-time market data and financial information",
    configuration: { endpoint: "https://api.bloomberg.com", apiKey: "***" },
    lastSync: new Date(),
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Mailchimp Email Automation",
    type: "email",
    status: "disconnected",
    description: "Automated email campaigns and follow-ups",
    configuration: { provider: "mailchimp", apiKey: "" },
    lastSync: null,
    createdAt: new Date(),
  },
];

export const generateRevenueData = (months: number = 12) => {
  const data = [];
  const baseRevenue = 50000;
  
  for (let i = 0; i < months; i++) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const growth = Math.random() * 0.3 + 0.9; // 0.9 to 1.2 multiplier
    const revenue = Math.floor(baseRevenue * growth * (1 + i * 0.05)); // 5% base growth per month
    
    data.push({
      month: monthNames[i % 12],
      revenue,
      clients: Math.floor(revenue / 700), // Approximate clients based on revenue
      conversions: Math.floor(Math.random() * 15) + 10, // 10-25 conversions
    });
  }
  
  return data;
};

export const generatePortfolioData = () => {
  return [
    { name: 'Retirement Plans', value: 45, amount: 2500000, color: '#3B82F6' },
    { name: 'Investment Portfolios', value: 30, amount: 1800000, color: '#10B981' },
    { name: 'Insurance Products', value: 25, amount: 1200000, color: '#8B5CF6' },
  ];
};

export const generateClientAcquisitionData = () => {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    newClients: Math.floor(Math.random() * 15) + 10, // 10-25 new clients
    lostClients: Math.floor(Math.random() * 5) + 1,  // 1-6 lost clients
  }));
};
