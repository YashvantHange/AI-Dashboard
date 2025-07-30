import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertFollowUpSchema, insertApiIntegrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Client routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.patch("/api/clients/:id", async (req, res) => {
    try {
      const updateData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(req.params.id, updateData);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteClient(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Follow-up routes
  app.get("/api/follow-ups", async (req, res) => {
    try {
      const followUps = await storage.getFollowUps();
      res.json(followUps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch follow-ups" });
    }
  });

  app.get("/api/follow-ups/upcoming", async (req, res) => {
    try {
      const followUps = await storage.getUpcomingFollowUps();
      res.json(followUps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming follow-ups" });
    }
  });

  app.get("/api/follow-ups/client/:clientId", async (req, res) => {
    try {
      const followUps = await storage.getFollowUpsByClient(req.params.clientId);
      res.json(followUps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client follow-ups" });
    }
  });

  app.post("/api/follow-ups", async (req, res) => {
    try {
      const followUpData = insertFollowUpSchema.parse({
        ...req.body,
        scheduledDate: new Date(req.body.scheduledDate),
      });
      const followUp = await storage.createFollowUp(followUpData);
      res.status(201).json(followUp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid follow-up data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create follow-up" });
    }
  });

  app.patch("/api/follow-ups/:id", async (req, res) => {
    try {
      const updateData = insertFollowUpSchema.partial().parse({
        ...req.body,
        ...(req.body.scheduledDate && { scheduledDate: new Date(req.body.scheduledDate) }),
      });
      const followUp = await storage.updateFollowUp(req.params.id, updateData);
      if (!followUp) {
        return res.status(404).json({ message: "Follow-up not found" });
      }
      res.json(followUp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid follow-up data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update follow-up" });
    }
  });

  app.delete("/api/follow-ups/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFollowUp(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Follow-up not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete follow-up" });
    }
  });

  // Metrics routes
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getLatestMetrics();
      if (!metrics) {
        return res.status(404).json({ message: "No metrics found" });
      }
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  app.get("/api/metrics/range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const metrics = await storage.getMetricsByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // API Integration routes
  app.get("/api/integrations", async (req, res) => {
    try {
      const integrations = await storage.getApiIntegrations();
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.post("/api/integrations", async (req, res) => {
    try {
      const integrationData = insertApiIntegrationSchema.parse(req.body);
      const integration = await storage.createApiIntegration(integrationData);
      res.status(201).json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid integration data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create integration" });
    }
  });

  app.patch("/api/integrations/:id", async (req, res) => {
    try {
      const updateData = insertApiIntegrationSchema.partial().parse(req.body);
      const integration = await storage.updateApiIntegration(req.params.id, updateData);
      if (!integration) {
        return res.status(404).json({ message: "Integration not found" });
      }
      res.json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid integration data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update integration" });
    }
  });

  // Export functionality
  app.get("/api/export/:type", async (req, res) => {
    try {
      const { type } = req.params;
      
      if (type === "clients") {
        const clients = await storage.getClients();
        const csv = generateCSV(clients);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=clients.csv');
        res.send(csv);
      } else if (type === "follow-ups") {
        const followUps = await storage.getFollowUps();
        const csv = generateCSV(followUps);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=follow-ups.csv');
        res.send(csv);
      } else {
        res.status(400).json({ message: "Invalid export type" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
}
