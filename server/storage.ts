import { type Client, type InsertClient, type FollowUp, type InsertFollowUp, type Metric, type InsertMetric, type ApiIntegration, type InsertApiIntegration } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Client operations
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;
  
  // Follow-up operations
  getFollowUps(): Promise<FollowUp[]>;
  getFollowUpsByClient(clientId: string): Promise<FollowUp[]>;
  getUpcomingFollowUps(): Promise<FollowUp[]>;
  createFollowUp(followUp: InsertFollowUp): Promise<FollowUp>;
  updateFollowUp(id: string, followUp: Partial<InsertFollowUp>): Promise<FollowUp | undefined>;
  deleteFollowUp(id: string): Promise<boolean>;
  
  // Metrics operations
  getLatestMetrics(): Promise<Metric | undefined>;
  getMetricsByDateRange(startDate: Date, endDate: Date): Promise<Metric[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;
  
  // API Integration operations
  getApiIntegrations(): Promise<ApiIntegration[]>;
  createApiIntegration(integration: InsertApiIntegration): Promise<ApiIntegration>;
  updateApiIntegration(id: string, integration: Partial<InsertApiIntegration>): Promise<ApiIntegration | undefined>;
}

export class MemStorage implements IStorage {
  private clients: Map<string, Client>;
  private followUps: Map<string, FollowUp>;
  private metrics: Map<string, Metric>;
  private apiIntegrations: Map<string, ApiIntegration>;

  constructor() {
    this.clients = new Map();
    this.followUps = new Map();
    this.metrics = new Map();
    this.apiIntegrations = new Map();
    
    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample clients
    const sampleClients: Client[] = [
      {
        id: randomUUID(),
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1-555-0123",
        status: "active",
        investmentType: "retirement",
        portfolioValue: "250000.00",
        lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        notes: "Interested in expanding retirement portfolio",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Michael Chen",
        email: "michael.chen@email.com",
        phone: "+1-555-0124",
        status: "pending",
        investmentType: "investment",
        portfolioValue: "450000.00",
        lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        notes: "Reviewing investment proposal",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Emily Rodriguez",
        email: "emily.rodriguez@email.com",
        phone: "+1-555-0125",
        status: "active",
        investmentType: "insurance",
        portfolioValue: "180000.00",
        lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        notes: "Updated life insurance policy",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    sampleClients.forEach(client => this.clients.set(client.id, client));

    // Sample follow-ups
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);

    const friday = new Date();
    friday.setDate(friday.getDate() + 5);
    friday.setHours(10, 30, 0, 0);

    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + 8);
    nextMonday.setHours(15, 0, 0, 0);

    const sampleFollowUps: FollowUp[] = [
      {
        id: randomUUID(),
        clientId: Array.from(this.clients.keys())[0],
        title: "Quarterly portfolio review",
        description: "Review Q4 performance and discuss 2024 strategy",
        scheduledDate: tomorrow,
        type: "meeting",
        status: "pending",
        priority: "high",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        clientId: Array.from(this.clients.keys())[1],
        title: "Investment strategy call",
        description: "Discuss new investment opportunities",
        scheduledDate: friday,
        type: "call",
        status: "pending",
        priority: "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        clientId: Array.from(this.clients.keys())[2],
        title: "New client onboarding",
        description: "Complete onboarding process and documentation",
        scheduledDate: nextMonday,
        type: "meeting",
        status: "pending",
        priority: "high",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    sampleFollowUps.forEach(followUp => this.followUps.set(followUp.id, followUp));

    // Sample metrics
    const currentMetric: Metric = {
      id: randomUUID(),
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

    this.metrics.set(currentMetric.id, currentMetric);

    // Sample API integrations
    const sampleIntegrations: ApiIntegration[] = [
      {
        id: randomUUID(),
        name: "CRM Sync",
        type: "crm",
        status: "connected",
        description: "Syncing client data with Salesforce",
        configuration: { endpoint: "https://api.salesforce.com", apiKey: "***" },
        lastSync: new Date(),
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Market Data",
        type: "market_data",
        status: "connected",
        description: "Real-time market data feed",
        configuration: { endpoint: "https://api.marketdata.com", apiKey: "***" },
        lastSync: new Date(),
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Email Automation",
        type: "email",
        status: "disconnected",
        description: "Automated follow-up emails",
        configuration: { provider: "mailchimp", apiKey: "" },
        lastSync: null,
        createdAt: new Date(),
      }
    ];

    sampleIntegrations.forEach(integration => this.apiIntegrations.set(integration.id, integration));
  }

  // Client operations
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = {
      ...insertClient,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, updateData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;

    const updatedClient: Client = {
      ...client,
      ...updateData,
      updatedAt: new Date(),
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }

  // Follow-up operations
  async getFollowUps(): Promise<FollowUp[]> {
    return Array.from(this.followUps.values());
  }

  async getFollowUpsByClient(clientId: string): Promise<FollowUp[]> {
    return Array.from(this.followUps.values()).filter(
      followUp => followUp.clientId === clientId
    );
  }

  async getUpcomingFollowUps(): Promise<FollowUp[]> {
    const now = new Date();
    return Array.from(this.followUps.values())
      .filter(followUp => followUp.scheduledDate > now && followUp.status === "pending")
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }

  async createFollowUp(insertFollowUp: InsertFollowUp): Promise<FollowUp> {
    const id = randomUUID();
    const followUp: FollowUp = {
      ...insertFollowUp,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.followUps.set(id, followUp);
    return followUp;
  }

  async updateFollowUp(id: string, updateData: Partial<InsertFollowUp>): Promise<FollowUp | undefined> {
    const followUp = this.followUps.get(id);
    if (!followUp) return undefined;

    const updatedFollowUp: FollowUp = {
      ...followUp,
      ...updateData,
      updatedAt: new Date(),
    };
    this.followUps.set(id, updatedFollowUp);
    return updatedFollowUp;
  }

  async deleteFollowUp(id: string): Promise<boolean> {
    return this.followUps.delete(id);
  }

  // Metrics operations
  async getLatestMetrics(): Promise<Metric | undefined> {
    const allMetrics = Array.from(this.metrics.values());
    return allMetrics.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
  }

  async getMetricsByDateRange(startDate: Date, endDate: Date): Promise<Metric[]> {
    return Array.from(this.metrics.values()).filter(
      metric => metric.date >= startDate && metric.date <= endDate
    );
  }

  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const id = randomUUID();
    const metric: Metric = {
      ...insertMetric,
      id,
    };
    this.metrics.set(id, metric);
    return metric;
  }

  // API Integration operations
  async getApiIntegrations(): Promise<ApiIntegration[]> {
    return Array.from(this.apiIntegrations.values());
  }

  async createApiIntegration(insertIntegration: InsertApiIntegration): Promise<ApiIntegration> {
    const id = randomUUID();
    const integration: ApiIntegration = {
      ...insertIntegration,
      id,
      createdAt: new Date(),
    };
    this.apiIntegrations.set(id, integration);
    return integration;
  }

  async updateApiIntegration(id: string, updateData: Partial<InsertApiIntegration>): Promise<ApiIntegration | undefined> {
    const integration = this.apiIntegrations.get(id);
    if (!integration) return undefined;

    const updatedIntegration: ApiIntegration = {
      ...integration,
      ...updateData,
    };
    this.apiIntegrations.set(id, updatedIntegration);
    return updatedIntegration;
  }
}

export const storage = new MemStorage();
