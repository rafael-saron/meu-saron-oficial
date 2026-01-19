var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import session from "express-session";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { z as z2 } from "zod";
import bcrypt2 from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";

// server/storage.ts
import bcrypt from "bcryptjs";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  accountsPayable: () => accountsPayable,
  accountsReceivable: () => accountsReceivable,
  announcements: () => announcements,
  announcementsRelations: () => announcementsRelations,
  anonymousMessages: () => anonymousMessages,
  anonymousMessagesRelations: () => anonymousMessagesRelations,
  cashierGoals: () => cashierGoals,
  cashierGoalsRelations: () => cashierGoalsRelations,
  chatMessages: () => chatMessages,
  chatMessagesRelations: () => chatMessagesRelations,
  insertAccountPayableSchema: () => insertAccountPayableSchema,
  insertAccountReceivableSchema: () => insertAccountReceivableSchema,
  insertAnnouncementSchema: () => insertAnnouncementSchema,
  insertAnonymousMessageSchema: () => insertAnonymousMessageSchema,
  insertCashierGoalSchema: () => insertCashierGoalSchema,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertSaleItemSchema: () => insertSaleItemSchema,
  insertSaleReceiptSchema: () => insertSaleReceiptSchema,
  insertSaleSchema: () => insertSaleSchema,
  insertSalesGoalSchema: () => insertSalesGoalSchema,
  insertScheduleEventSchema: () => insertScheduleEventSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserStoreSchema: () => insertUserStoreSchema,
  saleItems: () => saleItems,
  saleItemsRelations: () => saleItemsRelations,
  saleReceipts: () => saleReceipts,
  saleReceiptsRelations: () => saleReceiptsRelations,
  sales: () => sales,
  salesGoals: () => salesGoals,
  salesGoalsRelations: () => salesGoalsRelations,
  salesRelations: () => salesRelations,
  scheduleEvents: () => scheduleEvents,
  scheduleEventsRelations: () => scheduleEventsRelations,
  userStores: () => userStores,
  userStoresRelations: () => userStoresRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("vendedor"),
  storeId: text("store_id"),
  avatar: text("avatar"),
  bonusPercentageAchieved: decimal("bonus_percentage_achieved", { precision: 5, scale: 2 }),
  bonusPercentageNotAchieved: decimal("bonus_percentage_not_achieved", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var scheduleEvents = pgTable("schedule_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  storeId: text("store_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  description: text("description"),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: text("priority").notNull().default("normal"),
  authorId: varchar("author_id").notNull().references(() => users.id),
  isPinned: boolean("is_pinned").notNull().default(false),
  storeIds: text("store_ids").array().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var anonymousMessages = pgTable("anonymous_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var salesGoals = pgTable("sales_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  period: text("period").notNull().default("weekly"),
  storeId: text("store_id").notNull(),
  sellerId: varchar("seller_id").references(() => users.id),
  weekStart: date("week_start").notNull(),
  weekEnd: date("week_end").notNull(),
  targetValue: decimal("target_value", { precision: 12, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var userStores = pgTable("user_stores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  storeId: text("store_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var sales = pgTable("sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleCode: text("sale_code").notNull(),
  saleDate: date("sale_date").notNull(),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }).notNull(),
  sellerName: text("seller_name").notNull(),
  clientName: text("client_name"),
  storeId: text("store_id").notNull(),
  status: text("status").notNull(),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var saleItems = pgTable("sale_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleId: varchar("sale_id").notNull().references(() => sales.id, { onDelete: "cascade" }),
  productCode: text("product_code").notNull(),
  productDescription: text("product_description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 3 }).notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var saleReceipts = pgTable("sale_receipts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleId: varchar("sale_id").notNull().references(() => sales.id, { onDelete: "cascade" }),
  paymentMethod: text("payment_method").notNull(),
  // pix, dinheiro, debito, credito, crediario
  grossValue: decimal("gross_value", { precision: 12, scale: 2 }).notNull(),
  // ValorBruto
  netValue: decimal("net_value", { precision: 12, scale: 2 }).notNull(),
  // Valor (líquido)
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var cashierGoals = pgTable("cashier_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cashierId: varchar("cashier_id").notNull().references(() => users.id),
  storeId: text("store_id").notNull(),
  periodType: text("period_type").notNull().default("weekly"),
  // weekly ou monthly
  weekStart: date("week_start").notNull(),
  weekEnd: date("week_end").notNull(),
  paymentMethods: text("payment_methods").array().notNull(),
  // Meios de pagamento: PIX, Débito, Dinheiro
  targetPercentage: decimal("target_percentage", { precision: 5, scale: 2 }).notNull(),
  // Meta de % das vendas nesses meios
  bonusPercentageAchieved: decimal("bonus_percentage_achieved", { precision: 5, scale: 2 }).notNull(),
  bonusPercentageNotAchieved: decimal("bonus_percentage_not_achieved", { precision: 5, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var accountsPayable = pgTable("accounts_payable", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dapicId: integer("dapic_id").notNull(),
  storeId: text("store_id").notNull(),
  document: text("document"),
  supplier: text("supplier"),
  description: text("description"),
  issueDate: date("issue_date"),
  dueDate: date("due_date"),
  competenceDate: text("competence_date"),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  openValue: decimal("open_value", { precision: 12, scale: 2 }),
  paymentMethod: text("payment_method"),
  status: text("status").notNull(),
  accountPlan: text("account_plan"),
  paymentDate: date("payment_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var accountsReceivable = pgTable("accounts_receivable", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dapicId: integer("dapic_id").notNull(),
  storeId: text("store_id").notNull(),
  document: text("document"),
  client: text("client"),
  description: text("description"),
  issueDate: date("issue_date"),
  dueDate: date("due_date"),
  competenceDate: text("competence_date"),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  openValue: decimal("open_value", { precision: 12, scale: 2 }),
  paymentMethod: text("payment_method"),
  status: text("status").notNull(),
  accountPlan: text("account_plan"),
  receivedDate: date("received_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  sentMessages: many(chatMessages, { relationName: "sentMessages" }),
  receivedMessages: many(chatMessages, { relationName: "receivedMessages" }),
  scheduleEvents: many(scheduleEvents, { relationName: "userSchedule" }),
  createdEvents: many(scheduleEvents, { relationName: "createdEvents" }),
  announcements: many(announcements),
  anonymousMessages: many(anonymousMessages),
  salesGoals: many(salesGoals, { relationName: "sellerGoals" }),
  createdGoals: many(salesGoals, { relationName: "createdGoals" }),
  userStores: many(userStores),
  cashierGoals: many(cashierGoals, { relationName: "cashierGoals" }),
  createdCashierGoals: many(cashierGoals, { relationName: "createdCashierGoals" })
}));
var userStoresRelations = relations(userStores, ({ one }) => ({
  user: one(users, {
    fields: [userStores.userId],
    references: [users.id]
  })
}));
var chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  sender: one(users, {
    fields: [chatMessages.senderId],
    references: [users.id],
    relationName: "sentMessages"
  }),
  receiver: one(users, {
    fields: [chatMessages.receiverId],
    references: [users.id],
    relationName: "receivedMessages"
  })
}));
var scheduleEventsRelations = relations(scheduleEvents, ({ one }) => ({
  user: one(users, {
    fields: [scheduleEvents.userId],
    references: [users.id],
    relationName: "userSchedule"
  }),
  createdBy: one(users, {
    fields: [scheduleEvents.createdById],
    references: [users.id],
    relationName: "createdEvents"
  })
}));
var announcementsRelations = relations(announcements, ({ one }) => ({
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id]
  })
}));
var anonymousMessagesRelations = relations(anonymousMessages, ({ one }) => ({
  sender: one(users, {
    fields: [anonymousMessages.senderId],
    references: [users.id]
  })
}));
var salesGoalsRelations = relations(salesGoals, ({ one }) => ({
  seller: one(users, {
    fields: [salesGoals.sellerId],
    references: [users.id],
    relationName: "sellerGoals"
  }),
  createdBy: one(users, {
    fields: [salesGoals.createdById],
    references: [users.id],
    relationName: "createdGoals"
  })
}));
var salesRelations = relations(sales, ({ many }) => ({
  items: many(saleItems),
  receipts: many(saleReceipts)
}));
var saleItemsRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, {
    fields: [saleItems.saleId],
    references: [sales.id]
  })
}));
var saleReceiptsRelations = relations(saleReceipts, ({ one }) => ({
  sale: one(sales, {
    fields: [saleReceipts.saleId],
    references: [sales.id]
  })
}));
var cashierGoalsRelations = relations(cashierGoals, ({ one }) => ({
  cashier: one(users, {
    fields: [cashierGoals.cashierId],
    references: [users.id],
    relationName: "cashierGoals"
  }),
  createdBy: one(users, {
    fields: [cashierGoals.createdById],
    references: [users.id],
    relationName: "createdCashierGoals"
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
}).extend({
  password: z.string().min(6),
  storeId: z.enum(["saron1", "saron2", "saron3"]).nullable().optional()
});
var insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
  isRead: true
});
var insertScheduleEventSchema = createInsertSchema(scheduleEvents, {
  startTime: z.string().or(z.date()).transform((val) => typeof val === "string" ? new Date(val) : val),
  endTime: z.string().or(z.date()).transform((val) => typeof val === "string" ? new Date(val) : val)
}).omit({
  id: true,
  createdAt: true
});
var insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  storeIds: z.array(z.enum(["saron1", "saron2", "saron3"])).optional().default([])
});
var insertAnonymousMessageSchema = createInsertSchema(anonymousMessages).omit({
  id: true,
  createdAt: true,
  isRead: true
});
var insertSalesGoalSchema = createInsertSchema(salesGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  type: z.enum(["individual", "team"]),
  period: z.enum(["weekly", "monthly"]).default("weekly"),
  storeId: z.enum(["saron1", "saron2", "saron3"]),
  targetValue: z.string().or(z.number()).transform((val) => String(val))
});
var insertUserStoreSchema = createInsertSchema(userStores).omit({
  id: true,
  createdAt: true
});
var insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  storeId: z.enum(["saron1", "saron2", "saron3"]),
  totalValue: z.string().or(z.number()).transform((val) => String(val))
});
var insertSaleItemSchema = createInsertSchema(saleItems).omit({
  id: true,
  createdAt: true
}).extend({
  quantity: z.string().or(z.number()).transform((val) => String(val)),
  unitPrice: z.string().or(z.number()).transform((val) => String(val)),
  totalPrice: z.string().or(z.number()).transform((val) => String(val))
});
var insertSaleReceiptSchema = createInsertSchema(saleReceipts).omit({
  id: true,
  createdAt: true
}).extend({
  grossValue: z.string().or(z.number()).transform((val) => String(val)),
  netValue: z.string().or(z.number()).transform((val) => String(val))
});
var insertCashierGoalSchema = createInsertSchema(cashierGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  periodType: z.enum(["weekly", "monthly"]).default("weekly"),
  storeId: z.enum(["saron1", "saron2", "saron3"]),
  paymentMethods: z.array(z.string()).min(1, "Selecione pelo menos um meio de pagamento"),
  targetPercentage: z.string().or(z.number()).transform((val) => String(val)),
  bonusPercentageAchieved: z.string().or(z.number()).transform((val) => String(val)),
  bonusPercentageNotAchieved: z.string().or(z.number()).transform((val) => String(val))
});
var insertAccountPayableSchema = createInsertSchema(accountsPayable).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  storeId: z.enum(["saron1", "saron2", "saron3"]),
  value: z.string().or(z.number()).transform((val) => String(val)),
  openValue: z.string().or(z.number()).transform((val) => String(val)).nullable().optional()
});
var insertAccountReceivableSchema = createInsertSchema(accountsReceivable).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  storeId: z.enum(["saron1", "saron2", "saron3"]),
  value: z.string().or(z.number()).transform((val) => String(val)),
  openValue: z.string().or(z.number()).transform((val) => String(val)).nullable().optional()
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, or, desc, count, gte, lte, sql as sql2, isNull } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword
    }).returning();
    return user;
  }
  async updateUser(id, userData) {
    const updateData = { ...userData };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user;
  }
  async deleteUser(id) {
    await db.update(users).set({ isActive: false }).where(eq(users.id, id));
  }
  async getAllUsers() {
    return await db.select().from(users).where(eq(users.isActive, true));
  }
  async getChatMessages(userId1, userId2) {
    return await db.select().from(chatMessages).where(
      or(
        and(eq(chatMessages.senderId, userId1), eq(chatMessages.receiverId, userId2)),
        and(eq(chatMessages.senderId, userId2), eq(chatMessages.receiverId, userId1))
      )
    ).orderBy(chatMessages.createdAt);
  }
  async createChatMessage(insertMessage) {
    const [message] = await db.insert(chatMessages).values(insertMessage).returning();
    return message;
  }
  async markMessagesAsRead(senderId, receiverId) {
    await db.update(chatMessages).set({ isRead: true }).where(and(eq(chatMessages.senderId, senderId), eq(chatMessages.receiverId, receiverId)));
  }
  async getUnreadCount(userId) {
    const result = await db.select({ count: count() }).from(chatMessages).where(and(eq(chatMessages.receiverId, userId), eq(chatMessages.isRead, false)));
    return Number(result[0]?.count) || 0;
  }
  async getConversations(userId) {
    const allMessages = await db.select().from(chatMessages).where(
      or(
        eq(chatMessages.senderId, userId),
        eq(chatMessages.receiverId, userId)
      )
    ).orderBy(desc(chatMessages.createdAt));
    const conversationMap = /* @__PURE__ */ new Map();
    for (const msg of allMessages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          lastMessageAt: msg.createdAt,
          unreadCount: 0,
          lastMessage: msg.content
        });
      }
      if (msg.receiverId === userId && !msg.isRead) {
        const conv = conversationMap.get(partnerId);
        conv.unreadCount++;
      }
    }
    return Array.from(conversationMap.entries()).map(([partnerId, data]) => ({ partnerId, ...data })).sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  }
  async getScheduleEvents(storeId, startDate, endDate) {
    const conditions = [];
    if (storeId) {
      conditions.push(eq(scheduleEvents.storeId, storeId));
    }
    if (startDate) {
      conditions.push(gte(scheduleEvents.startTime, startDate));
    }
    if (endDate) {
      conditions.push(lte(scheduleEvents.endTime, endDate));
    }
    if (conditions.length > 0) {
      return await db.select().from(scheduleEvents).where(and(...conditions)).orderBy(scheduleEvents.startTime);
    }
    return await db.select().from(scheduleEvents).orderBy(scheduleEvents.startTime);
  }
  async getScheduleEvent(id) {
    const [event] = await db.select().from(scheduleEvents).where(eq(scheduleEvents.id, id));
    return event || void 0;
  }
  async createScheduleEvent(insertEvent) {
    const [event] = await db.insert(scheduleEvents).values(insertEvent).returning();
    return event;
  }
  async updateScheduleEvent(id, updateData) {
    const [event] = await db.update(scheduleEvents).set(updateData).where(eq(scheduleEvents.id, id)).returning();
    return event || void 0;
  }
  async deleteScheduleEvent(id) {
    await db.delete(scheduleEvents).where(eq(scheduleEvents.id, id));
  }
  async getAnnouncements() {
    return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }
  async createAnnouncement(insertAnnouncement) {
    const [announcement] = await db.insert(announcements).values(insertAnnouncement).returning();
    return announcement;
  }
  async updateAnnouncement(id, updateData) {
    const [announcement] = await db.update(announcements).set({ ...updateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(announcements.id, id)).returning();
    return announcement || void 0;
  }
  async deleteAnnouncement(id) {
    await db.delete(announcements).where(eq(announcements.id, id));
  }
  async getAnonymousMessages() {
    return await db.select().from(anonymousMessages).orderBy(desc(anonymousMessages.createdAt));
  }
  async createAnonymousMessage(insertMessage) {
    const [message] = await db.insert(anonymousMessages).values(insertMessage).returning();
    return message;
  }
  async markAnonymousMessageAsRead(id) {
    await db.update(anonymousMessages).set({ isRead: true }).where(eq(anonymousMessages.id, id));
  }
  async getSalesGoals(filters) {
    let query = db.select().from(salesGoals);
    const conditions = [];
    if (filters?.id) {
      conditions.push(eq(salesGoals.id, filters.id));
    }
    if (filters?.storeId) {
      conditions.push(eq(salesGoals.storeId, filters.storeId));
    }
    if (filters?.sellerId) {
      conditions.push(eq(salesGoals.sellerId, filters.sellerId));
    }
    if (filters?.weekStart) {
      conditions.push(gte(salesGoals.weekStart, filters.weekStart));
    }
    if (filters?.weekEnd) {
      conditions.push(lte(salesGoals.weekEnd, filters.weekEnd));
    }
    if (filters?.type) {
      conditions.push(eq(salesGoals.type, filters.type));
    }
    if (filters?.isActive !== void 0) {
      conditions.push(eq(salesGoals.isActive, filters.isActive));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    return await query.orderBy(desc(salesGoals.createdAt));
  }
  async createSalesGoal(insertGoal) {
    const [goal] = await db.insert(salesGoals).values(insertGoal).returning();
    return goal;
  }
  async updateSalesGoal(id, updateData) {
    const [goal] = await db.update(salesGoals).set({ ...updateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(salesGoals.id, id)).returning();
    return goal || void 0;
  }
  async deleteSalesGoal(id) {
    await db.delete(salesGoals).where(eq(salesGoals.id, id));
  }
  async checkOverlappingGoals(params) {
    const conditions = [
      eq(salesGoals.storeId, params.storeId),
      eq(salesGoals.type, params.type),
      eq(salesGoals.period, params.period),
      eq(salesGoals.isActive, true),
      or(
        and(
          lte(salesGoals.weekStart, params.weekStart),
          gte(salesGoals.weekEnd, params.weekStart)
        ),
        and(
          lte(salesGoals.weekStart, params.weekEnd),
          gte(salesGoals.weekEnd, params.weekEnd)
        ),
        and(
          gte(salesGoals.weekStart, params.weekStart),
          lte(salesGoals.weekEnd, params.weekEnd)
        )
      )
    ];
    if (params.type === "individual" && params.sellerId) {
      conditions.push(eq(salesGoals.sellerId, params.sellerId));
    } else if (params.type === "team") {
      conditions.push(isNull(salesGoals.sellerId));
    }
    if (params.excludeId) {
      conditions.push(sql2`${salesGoals.id} != ${params.excludeId}`);
    }
    return await db.select().from(salesGoals).where(and(...conditions));
  }
  async getUserStores(userId) {
    return await db.select().from(userStores).where(eq(userStores.userId, userId));
  }
  async setUserStores(userId, storeIds) {
    await db.delete(userStores).where(eq(userStores.userId, userId));
    if (storeIds.length > 0) {
      const values = storeIds.map((storeId) => ({
        userId,
        storeId
      }));
      await db.insert(userStores).values(values);
    }
  }
  async saleExists(saleCode, storeId) {
    const [existing] = await db.select({ id: sales.id }).from(sales).where(and(eq(sales.saleCode, saleCode), eq(sales.storeId, storeId))).limit(1);
    return !!existing;
  }
  async createSale(insertSale) {
    const [sale] = await db.insert(sales).values(insertSale).returning();
    return sale;
  }
  async createSaleItem(insertItem) {
    const [item] = await db.insert(saleItems).values(insertItem).returning();
    return item;
  }
  async createSaleReceipt(insertReceipt) {
    const [receipt] = await db.insert(saleReceipts).values(insertReceipt).returning();
    return receipt;
  }
  async createSaleWithItemsAndReceipts(insertSale, insertItems, insertReceipts) {
    return await db.transaction(async (tx) => {
      const [sale] = await tx.insert(sales).values(insertSale).returning();
      if (insertItems.length > 0) {
        const itemsWithSaleId = insertItems.map((item) => ({
          ...item,
          saleId: sale.id
        }));
        await tx.insert(saleItems).values(itemsWithSaleId);
      }
      if (insertReceipts.length > 0) {
        const receiptsWithSaleId = insertReceipts.map((receipt) => ({
          ...receipt,
          saleId: sale.id
        }));
        await tx.insert(saleReceipts).values(receiptsWithSaleId);
      }
      return sale;
    });
  }
  async createSaleWithItems(insertSale, insertItems) {
    return await db.transaction(async (tx) => {
      const [sale] = await tx.insert(sales).values(insertSale).returning();
      if (insertItems.length > 0) {
        const itemsWithSaleId = insertItems.map((item) => ({
          ...item,
          saleId: sale.id
        }));
        await tx.insert(saleItems).values(itemsWithSaleId);
      }
      return sale;
    });
  }
  async getReceiptsByPaymentMethod(storeId, startDate, endDate, paymentMethods) {
    const receipts = await db.select({
      paymentMethod: saleReceipts.paymentMethod,
      grossValue: saleReceipts.grossValue,
      netValue: saleReceipts.netValue
    }).from(saleReceipts).innerJoin(sales, eq(saleReceipts.saleId, sales.id)).where(
      and(
        eq(sales.storeId, storeId),
        gte(sales.saleDate, startDate),
        lte(sales.saleDate, endDate)
      )
    );
    const methodTotals = {};
    for (const receipt of receipts) {
      const method = receipt.paymentMethod.toLowerCase();
      for (const targetMethod of paymentMethods) {
        if (method.includes(targetMethod.toLowerCase())) {
          if (!methodTotals[targetMethod]) {
            methodTotals[targetMethod] = { totalGross: 0, totalNet: 0 };
          }
          methodTotals[targetMethod].totalGross += parseFloat(receipt.grossValue);
          methodTotals[targetMethod].totalNet += parseFloat(receipt.netValue);
          break;
        }
      }
    }
    return Object.entries(methodTotals).map(([paymentMethod, totals]) => ({
      paymentMethod,
      ...totals
    }));
  }
  async getSales(filters) {
    let query = db.select().from(sales);
    const conditions = [];
    if (filters?.storeId && filters.storeId !== "todas") {
      conditions.push(eq(sales.storeId, filters.storeId));
    }
    if (filters?.sellerName) {
      const normalizedName = filters.sellerName.toLowerCase().trim();
      conditions.push(sql2`LOWER(TRIM(${sales.sellerName})) = ${normalizedName}`);
    }
    if (filters?.startDate) {
      conditions.push(gte(sales.saleDate, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(sales.saleDate, filters.endDate));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    return await query.orderBy(desc(sales.saleDate));
  }
  async getSalesWithItems(filters) {
    const salesList = await this.getSales(filters);
    const salesWithItems = await Promise.all(
      salesList.map(async (sale) => {
        const items = await db.select().from(saleItems).where(eq(saleItems.saleId, sale.id));
        return { ...sale, items };
      })
    );
    return salesWithItems;
  }
  async deleteSalesByPeriod(storeId, startDate, endDate) {
    await db.delete(sales).where(
      and(
        eq(sales.storeId, storeId),
        gte(sales.saleDate, startDate),
        lte(sales.saleDate, endDate)
      )
    );
  }
  async getCashierGoals(filters) {
    let query = db.select().from(cashierGoals);
    const conditions = [];
    if (filters?.id) {
      conditions.push(eq(cashierGoals.id, filters.id));
    }
    if (filters?.cashierId) {
      conditions.push(eq(cashierGoals.cashierId, filters.cashierId));
    }
    if (filters?.storeId) {
      conditions.push(eq(cashierGoals.storeId, filters.storeId));
    }
    if (filters?.isActive !== void 0) {
      conditions.push(eq(cashierGoals.isActive, filters.isActive));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    return await query.orderBy(desc(cashierGoals.createdAt));
  }
  async createCashierGoal(goal) {
    const [created] = await db.insert(cashierGoals).values(goal).returning();
    return created;
  }
  async updateCashierGoal(id, goal) {
    const [updated] = await db.update(cashierGoals).set({ ...goal, updatedAt: /* @__PURE__ */ new Date() }).where(eq(cashierGoals.id, id)).returning();
    return updated;
  }
  async deleteCashierGoal(id) {
    await db.delete(cashierGoals).where(eq(cashierGoals.id, id));
  }
  async getDailyRevenueComparison(filters) {
    const { storeId, month, year, compareYears = [] } = filters;
    const yearsToQuery = [year, ...compareYears].sort((a, b) => b - a);
    const results = [];
    for (const queryYear of yearsToQuery) {
      const startDate = `${queryYear}-${String(month).padStart(2, "0")}-01`;
      const lastDay = new Date(queryYear, month, 0).getDate();
      const endDate = `${queryYear}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      const conditions = [
        gte(sales.saleDate, startDate),
        lte(sales.saleDate, endDate)
      ];
      if (storeId && storeId !== "todas") {
        conditions.push(eq(sales.storeId, storeId));
      }
      const dailySales = await db.select({
        date: sales.saleDate,
        totalValue: sql2`SUM(CAST(${sales.totalValue} AS NUMERIC))`
      }).from(sales).where(and(...conditions)).groupBy(sales.saleDate).orderBy(sales.saleDate);
      const dailyData = dailySales.map((row) => ({
        date: row.date,
        day: parseInt(row.date.split("-")[2]),
        totalValue: parseFloat(row.totalValue) || 0
      }));
      const total = dailyData.reduce((sum, d) => sum + d.totalValue, 0);
      results.push({
        year: queryYear,
        daily: dailyData,
        total
      });
    }
    return results;
  }
};
var storage = new DatabaseStorage();

// server/dapic.ts
import axios from "axios";
var DAPIC_API_BASE_URL = "https://api.dapic.com.br";
var STORES = {
  "saron1": {
    empresa: process.env.DAPIC_EMPRESA || "",
    token: process.env.DAPIC_TOKEN_INTEGRACAO || ""
  },
  "saron2": {
    empresa: process.env.DAPIC_EMPRESA_SARON2 || "",
    token: process.env.DAPIC_TOKEN_INTEGRACAO_SARON2 || ""
  },
  "saron3": {
    empresa: process.env.DAPIC_EMPRESA_SARON3 || "",
    token: process.env.DAPIC_TOKEN_INTEGRACAO_SARON3 || ""
  }
};
var DapicService = class {
  accessTokens = /* @__PURE__ */ new Map();
  tokenExpirations = /* @__PURE__ */ new Map();
  cache = /* @__PURE__ */ new Map();
  CACHE_TTL = 5 * 60 * 1e3;
  constructor() {
    const missingStores = [];
    Object.entries(STORES).forEach(([storeId, creds]) => {
      if (!creds.empresa || !creds.token) {
        missingStores.push(storeId);
      }
    });
    if (missingStores.length > 0) {
      console.warn(`Dapic credentials not configured for stores: ${missingStores.join(", ")}`);
    }
  }
  getCachedData(cacheKey) {
    const entry = this.cache.get(cacheKey);
    if (!entry) return null;
    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_TTL) {
      this.cache.delete(cacheKey);
      return null;
    }
    console.log(`Cache hit for ${cacheKey}`);
    return entry.data;
  }
  setCachedData(cacheKey, data) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    console.log(`Cached data for ${cacheKey}`);
  }
  clearCache() {
    this.cache.clear();
    console.log("Cache cleared");
  }
  async getAccessToken(storeId) {
    const credentials = STORES[storeId];
    if (!credentials || !credentials.empresa || !credentials.token) {
      throw new Error(`Dapic credentials not configured for store: ${storeId}`);
    }
    const now = Date.now();
    const cachedToken = this.accessTokens.get(storeId);
    const expiration = this.tokenExpirations.get(storeId) || 0;
    if (cachedToken && expiration > now) {
      return cachedToken;
    }
    try {
      const response = await axios.post(
        `${DAPIC_API_BASE_URL}/autenticacao/v1/login`,
        {
          Empresa: credentials.empresa,
          TokenIntegracao: credentials.token
        }
      );
      const accessToken = response.data.access_token;
      const expiresInSeconds = parseInt(response.data.expires_in);
      const tokenExpiresAt = now + (expiresInSeconds - 300) * 1e3;
      this.accessTokens.set(storeId, accessToken);
      this.tokenExpirations.set(storeId, tokenExpiresAt);
      return accessToken;
    } catch (error) {
      console.error(`Error authenticating with Dapic for store ${storeId}:`, error);
      throw new Error(`Failed to authenticate with Dapic API for store ${storeId}`);
    }
  }
  async makeRequest(storeId, endpoint, params) {
    const token = await this.getAccessToken(storeId);
    try {
      const response = await axios.get(`${DAPIC_API_BASE_URL}${endpoint}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        params
      });
      return response.data;
    } catch (error) {
      console.error(`Error calling Dapic endpoint ${endpoint} for store ${storeId}:`, error);
      throw error;
    }
  }
  async makeRequestAllStores(endpoint, params) {
    const data = {};
    const errors = {};
    const storeIds = Object.keys(STORES).filter((id) => STORES[id].empresa && STORES[id].token);
    await Promise.all(
      storeIds.map(async (storeId) => {
        try {
          data[storeId] = await this.makeRequest(storeId, endpoint, params);
        } catch (error) {
          const errorMsg = error.message || "Unknown error";
          console.error(`Error fetching data from store ${storeId}:`, errorMsg);
          errors[storeId] = errorMsg;
        }
      })
    );
    return { data, errors };
  }
  async getClientes(storeId, params) {
    if (storeId === "todas") {
      const cacheKey = `clientes:todas`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }
      const availableStores = this.getAvailableStores();
      if (availableStores.length === 0) {
        return { data: {}, errors: { todas: "Nenhuma loja configurada" } };
      }
      let canonicalData = null;
      const errors = {};
      const paramsWithoutPagina = params ? { ...params } : {};
      delete paramsWithoutPagina.Pagina;
      for (const store of availableStores) {
        try {
          canonicalData = await this.getClientes(store, paramsWithoutPagina);
          break;
        } catch (error) {
          errors[store] = error.message || "Erro ao buscar clientes";
        }
      }
      if (!canonicalData) {
        return { data: {}, errors };
      }
      const data = {};
      for (const store of availableStores) {
        data[store] = JSON.parse(JSON.stringify(canonicalData));
      }
      const result = { data, errors };
      this.setCachedData(cacheKey, result);
      return result;
    }
    if (params?.Pagina) {
      return this.makeRequest(storeId, "/v1/clientes", params);
    }
    const requestParams = {
      ...params,
      RegistrosPorPagina: params?.RegistrosPorPagina || 200
    };
    const registrosPorPagina = requestParams.RegistrosPorPagina;
    let paginaAtual = 1;
    let todosResultados = [];
    let ultimoResultado = null;
    let continuar = true;
    while (continuar) {
      const resultado = await this.makeRequest(storeId, "/v1/clientes", {
        ...requestParams,
        Pagina: paginaAtual
      });
      ultimoResultado = resultado;
      const dados = resultado?.Dados || [];
      todosResultados = todosResultados.concat(dados);
      if (dados.length < registrosPorPagina) {
        continuar = false;
      } else {
        paginaAtual++;
      }
      if (paginaAtual > 20) {
        console.log(`Aviso: Limite de pagina\xE7\xE3o atingido (20 p\xE1ginas = 4.000 registros) para clientes`);
        continuar = false;
      }
    }
    return {
      ...ultimoResultado,
      Dados: todosResultados
    };
  }
  async getCliente(storeId, id) {
    return this.makeRequest(storeId, `/v1/clientes/${id}`);
  }
  async getOrcamentos(storeId, params) {
    if (storeId === "todas") {
      return this.makeRequestAllStores("/v1/orcamentos", params);
    }
    return this.makeRequest(storeId, "/v1/orcamentos", params);
  }
  async getOrcamento(storeId, id) {
    return this.makeRequest(storeId, `/v1/orcamentos/${id}`);
  }
  async getVendasPDV(storeId, params) {
    const requestParams = {
      ...params,
      FiltrarPor: params?.FiltrarPor || "0",
      Status: params?.Status || "1",
      RegistrosPorPagina: params?.RegistrosPorPagina || 200
    };
    const maxPagesLimit = params?.maxPages || 10;
    if (storeId === "todas") {
      const data = {};
      const errors = {};
      const availableStores = this.getAvailableStores();
      await Promise.all(
        availableStores.map(async (store) => {
          try {
            data[store] = await this.getVendasPDV(store, params);
          } catch (error) {
            const errorMsg = error.message || "Unknown error";
            console.error(`Erro ao buscar vendas PDV da loja ${store}:`, errorMsg);
            errors[store] = errorMsg;
          }
        })
      );
      return { data, errors };
    }
    if (params?.Pagina !== void 0) {
      const resultado = await this.makeRequest(storeId, "/v1/vendaspdv", requestParams);
      return resultado;
    }
    const registrosPorPagina = requestParams.RegistrosPorPagina;
    let paginaAtual = 1;
    let todosResultados = [];
    let continuar = true;
    let ultimoResultado = null;
    while (continuar) {
      const resultado = await this.makeRequest(storeId, "/v1/vendaspdv", {
        ...requestParams,
        Pagina: paginaAtual
      });
      ultimoResultado = resultado;
      const dados = resultado?.Dados || [];
      todosResultados = todosResultados.concat(dados);
      if (dados.length < registrosPorPagina) {
        continuar = false;
      } else {
        paginaAtual++;
      }
      if (paginaAtual > maxPagesLimit) {
        console.log(`Aviso: Limite de pagina\xE7\xE3o atingido (${maxPagesLimit} p\xE1ginas = ${maxPagesLimit * 200} registros) para vendas PDV da loja ${storeId}`);
        continuar = false;
      }
    }
    return {
      ...ultimoResultado,
      Dados: todosResultados
    };
  }
  async getProdutos(storeId, params) {
    if (storeId === "todas") {
      const cacheKey = `produtos:todas`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }
      const availableStores = this.getAvailableStores();
      if (availableStores.length === 0) {
        return { data: {}, errors: { todas: "Nenhuma loja configurada" } };
      }
      let canonicalData = null;
      const errors = {};
      const paramsWithoutPagina = params ? { ...params } : {};
      delete paramsWithoutPagina.Pagina;
      for (const store of availableStores) {
        try {
          canonicalData = await this.getProdutos(store, paramsWithoutPagina);
          break;
        } catch (error) {
          errors[store] = error.message || "Erro ao buscar produtos";
        }
      }
      if (!canonicalData) {
        return { data: {}, errors };
      }
      const data = {};
      for (const store of availableStores) {
        data[store] = JSON.parse(JSON.stringify(canonicalData));
      }
      const result = { data, errors };
      this.setCachedData(cacheKey, result);
      return result;
    }
    if (params?.Pagina) {
      return this.makeRequest(storeId, "/v1/produtos", params);
    }
    const requestParams = {
      ...params,
      RegistrosPorPagina: params?.RegistrosPorPagina || 200
    };
    const registrosPorPagina = requestParams.RegistrosPorPagina;
    let paginaAtual = 1;
    let todosResultados = [];
    let ultimoResultado = null;
    let continuar = true;
    while (continuar) {
      const resultado = await this.makeRequest(storeId, "/v1/produtos", {
        ...requestParams,
        Pagina: paginaAtual
      });
      ultimoResultado = resultado;
      const dados = resultado?.Dados || [];
      todosResultados = todosResultados.concat(dados);
      if (dados.length < registrosPorPagina) {
        continuar = false;
      } else {
        paginaAtual++;
      }
      if (paginaAtual > 5) {
        console.log(`Aviso: Limite de pagina\xE7\xE3o atingido (5 p\xE1ginas = 1.000 registros) para produtos`);
        continuar = false;
      }
    }
    return {
      ...ultimoResultado,
      Dados: todosResultados
    };
  }
  async getProduto(storeId, id) {
    return this.makeRequest(storeId, `/v1/produtos/${id}`);
  }
  async getContasPagar(storeId, params) {
    const requestParams = {
      ...params,
      RegistrosPorPagina: params?.RegistrosPorPagina || 100
    };
    if (storeId === "todas") {
      return this.makeRequestAllStores("/v1/contaspagar", requestParams);
    }
    return this.makeRequest(storeId, "/v1/contaspagar", requestParams);
  }
  async getContasReceber(storeId, params) {
    const requestParams = {
      ...params,
      RegistrosPorPagina: params?.RegistrosPorPagina || 100
    };
    if (storeId === "todas") {
      return this.makeRequestAllStores("/v1/contasreceber", requestParams);
    }
    return this.makeRequest(storeId, "/v1/contasreceber", requestParams);
  }
  getAvailableStores() {
    return Object.keys(STORES).filter((id) => STORES[id].empresa && STORES[id].token);
  }
};
var dapicService = new DapicService();

// server/salesSync.ts
function parseDapicDate(dateStr) {
  if (!dateStr) {
    return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  }
  const str = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.split("T")[0].split(" ")[0];
  }
  const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }
  try {
    const date2 = new Date(str);
    if (!isNaN(date2.getTime())) {
      return date2.toISOString().split("T")[0];
    }
  } catch {
  }
  console.warn(`[SalesSync] Could not parse date: "${dateStr}", using current date`);
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function parseCurrencyValue(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const str = String(value).trim();
  if (str.includes(",") && str.includes(".")) {
    return parseFloat(str.replace(/\./g, "").replace(",", ".")) || 0;
  }
  if (str.includes(",") && !str.includes(".")) {
    return parseFloat(str.replace(",", ".")) || 0;
  }
  return parseFloat(str) || 0;
}
var SalesSyncService = class {
  syncInProgress = /* @__PURE__ */ new Map();
  // Normalize payment method names to standard format for easier matching
  normalizePaymentMethod(rawMethod) {
    if (!rawMethod) return "";
    const method = rawMethod.toLowerCase().trim();
    if (method.includes("pix")) {
      return "pix";
    }
    if (method.includes("dinheiro") || method.includes("especie") || method.includes("esp\xE9cie")) {
      return "dinheiro";
    }
    if (method.includes("d\xE9bito") || method.includes("debito") || method.includes("tef d\xE9bito") || method.includes("tef debito")) {
      return "debito";
    }
    if (method.includes("cr\xE9dito") || method.includes("credito") || method.includes("tef cr\xE9dito") || method.includes("tef credito")) {
      return "credito";
    }
    if (method.includes("boleto")) {
      return "boleto";
    }
    if (method.includes("credi\xE1rio") || method.includes("crediario") || method.includes("carn\xEA") || method.includes("carne")) {
      return "crediario";
    }
    if (method.includes("transfer\xEAncia") || method.includes("transferencia") || method.includes("ted") || method.includes("doc")) {
      return "transferencia";
    }
    return method.replace(/^\d+\s*-\s*/, "").trim() || rawMethod;
  }
  async syncStore(storeId, startDate, endDate) {
    const syncKey = `${storeId}-${startDate}-${endDate}`;
    if (this.syncInProgress.get(syncKey)?.status === "in_progress") {
      return {
        success: false,
        store: storeId,
        salesCount: 0,
        error: "Sincroniza\xE7\xE3o j\xE1 em andamento para este per\xEDodo"
      };
    }
    this.syncInProgress.set(syncKey, {
      store: storeId,
      status: "in_progress",
      salesCount: 0
    });
    try {
      console.log(`[SalesSync] Iniciando sincroniza\xE7\xE3o: ${storeId} (${startDate} a ${endDate})`);
      await storage.deleteSalesByPeriod(storeId, startDate, endDate);
      console.log(`[SalesSync] Vendas antigas deletadas para ${storeId}`);
      let salesCount = 0;
      let duplicatesSkipped = 0;
      let page = 1;
      let hasMore = true;
      const maxPages = 100;
      const processedSaleCodes = /* @__PURE__ */ new Set();
      while (hasMore && page <= maxPages) {
        console.log(`[SalesSync] Buscando p\xE1gina ${page} de vendas do Dapic...`);
        const response = await dapicService.getVendasPDV(storeId, {
          DataInicial: startDate,
          DataFinal: endDate,
          Pagina: page
        });
        const salesData = response?.Resultado || response?.Dados || [];
        if (!salesData || salesData.length === 0) {
          console.log(`[SalesSync] Nenhuma venda encontrada na p\xE1gina ${page}`);
          hasMore = false;
          break;
        }
        for (const dapicSale of salesData) {
          try {
            const saleCode = String(dapicSale.Codigo || dapicSale.CodigoVenda || "");
            if (processedSaleCodes.has(saleCode)) {
              duplicatesSkipped++;
              continue;
            }
            processedSaleCodes.add(saleCode);
            let paymentMethod = null;
            if (dapicSale.Recebimentos && Array.isArray(dapicSale.Recebimentos) && dapicSale.Recebimentos.length > 0) {
              const rawPaymentMethod = dapicSale.Recebimentos[0].FormaPagamento || "";
              paymentMethod = this.normalizePaymentMethod(rawPaymentMethod);
              if (dapicSale.Recebimentos.length > 1) {
                const allMethods = dapicSale.Recebimentos.map(
                  (r) => this.normalizePaymentMethod(r.FormaPagamento || "")
                ).filter((m) => m);
                const uniqueMethods = Array.from(new Set(allMethods));
                if (uniqueMethods.length > 1) {
                  paymentMethod = uniqueMethods.join(", ");
                }
              }
            }
            const rawDate = dapicSale.DataFechamento || dapicSale.DataEmissao || dapicSale.Data;
            const parsedDate = parseDapicDate(rawDate);
            const totalValue = parseCurrencyValue(dapicSale.ValorLiquido || dapicSale.ValorTotal || 0);
            const sale = {
              saleCode,
              saleDate: parsedDate,
              totalValue: String(totalValue),
              sellerName: dapicSale.NomeVendedor || dapicSale.Vendedor || "Sem Vendedor",
              clientName: dapicSale.NomeCliente || dapicSale.Cliente || null,
              storeId,
              status: dapicSale.Status || "Finalizado",
              paymentMethod
            };
            const items = [];
            if (dapicSale.Itens && Array.isArray(dapicSale.Itens)) {
              for (const dapicItem of dapicSale.Itens) {
                items.push({
                  saleId: "",
                  productCode: String(dapicItem.CodigoProduto || dapicItem.Codigo || ""),
                  productDescription: dapicItem.Descricao || dapicItem.NomeProduto || "Sem Descri\xE7\xE3o",
                  quantity: String(parseCurrencyValue(dapicItem.Quantidade) || 1),
                  unitPrice: String(parseCurrencyValue(dapicItem.ValorUnitario || dapicItem.PrecoUnitario || 0)),
                  totalPrice: String(parseCurrencyValue(dapicItem.ValorTotal || dapicItem.Total || 0))
                });
              }
            }
            const receipts = [];
            if (dapicSale.Recebimentos && Array.isArray(dapicSale.Recebimentos)) {
              for (const recebimento of dapicSale.Recebimentos) {
                const rawMethod = recebimento.FormaPagamento || "";
                const normalizedMethod = this.normalizePaymentMethod(rawMethod);
                const grossValue = parseFloat(recebimento.ValorBruto || recebimento.Valor || 0);
                const netValue = parseFloat(recebimento.Valor || recebimento.ValorBruto || 0);
                if (normalizedMethod && grossValue > 0) {
                  receipts.push({
                    saleId: "",
                    paymentMethod: normalizedMethod,
                    grossValue: String(grossValue),
                    netValue: String(netValue)
                  });
                }
              }
            }
            await storage.createSaleWithItemsAndReceipts(sale, items, receipts);
            salesCount++;
          } catch (itemError) {
            console.error(`[SalesSync] Erro ao processar venda ${dapicSale.Codigo}:`, itemError.message);
          }
        }
        if (salesData.length < 200) {
          hasMore = false;
        } else {
          page++;
        }
      }
      if (duplicatesSkipped > 0) {
        console.log(`[SalesSync] ${duplicatesSkipped} duplicatas ignoradas`);
      }
      console.log(`[SalesSync] Sincroniza\xE7\xE3o conclu\xEDda: ${storeId} - ${salesCount} vendas`);
      this.syncInProgress.set(syncKey, {
        store: storeId,
        status: "completed",
        salesCount
      });
      return {
        success: true,
        store: storeId,
        salesCount
      };
    } catch (error) {
      console.error(`[SalesSync] Erro na sincroniza\xE7\xE3o ${storeId}:`, error);
      this.syncInProgress.set(syncKey, {
        store: storeId,
        status: "failed",
        salesCount: 0,
        error: error.message
      });
      return {
        success: false,
        store: storeId,
        salesCount: 0,
        error: error.message
      };
    }
  }
  async syncAllStores(startDate, endDate) {
    const stores = ["saron1", "saron2", "saron3"];
    const results = [];
    for (const store of stores) {
      const result = await this.syncStore(store, startDate, endDate);
      results.push(result);
    }
    return results;
  }
  // Additive sync - doesn't delete existing data, only adds new sales
  async syncStoreAdditive(storeId, startDate, endDate) {
    const syncKey = `additive-${storeId}-${startDate}-${endDate}`;
    if (this.syncInProgress.get(syncKey)?.status === "in_progress") {
      return {
        success: false,
        store: storeId,
        salesCount: 0,
        error: "Sincroniza\xE7\xE3o j\xE1 em andamento para este per\xEDodo"
      };
    }
    this.syncInProgress.set(syncKey, {
      store: storeId,
      status: "in_progress",
      salesCount: 0
    });
    try {
      console.log(`[SalesSync-Additive] Iniciando: ${storeId} (${startDate} a ${endDate})`);
      let salesCount = 0;
      let skippedExisting = 0;
      let page = 1;
      let hasMore = true;
      const maxPages = 100;
      const processedSaleCodes = /* @__PURE__ */ new Set();
      while (hasMore && page <= maxPages) {
        console.log(`[SalesSync-Additive] ${storeId} - P\xE1gina ${page}...`);
        const response = await dapicService.getVendasPDV(storeId, {
          DataInicial: startDate,
          DataFinal: endDate,
          Pagina: page
        });
        const salesData = response?.Resultado || response?.Dados || [];
        if (!salesData || salesData.length === 0) {
          console.log(`[SalesSync-Additive] ${storeId} - Sem vendas na p\xE1gina ${page}`);
          hasMore = false;
          break;
        }
        for (const dapicSale of salesData) {
          try {
            const saleCode = String(dapicSale.Codigo || dapicSale.CodigoVenda || "");
            if (processedSaleCodes.has(saleCode)) {
              continue;
            }
            processedSaleCodes.add(saleCode);
            const exists = await storage.saleExists(saleCode, storeId);
            if (exists) {
              skippedExisting++;
              continue;
            }
            let paymentMethod = null;
            if (dapicSale.Recebimentos && Array.isArray(dapicSale.Recebimentos) && dapicSale.Recebimentos.length > 0) {
              const rawPaymentMethod = dapicSale.Recebimentos[0].FormaPagamento || "";
              paymentMethod = this.normalizePaymentMethod(rawPaymentMethod);
              if (dapicSale.Recebimentos.length > 1) {
                const allMethods = dapicSale.Recebimentos.map(
                  (r) => this.normalizePaymentMethod(r.FormaPagamento || "")
                ).filter((m) => m);
                const uniqueMethods = Array.from(new Set(allMethods));
                if (uniqueMethods.length > 1) {
                  paymentMethod = uniqueMethods.join(", ");
                }
              }
            }
            const rawDate = dapicSale.DataFechamento || dapicSale.DataEmissao || dapicSale.Data;
            const parsedDate = parseDapicDate(rawDate);
            const totalValue = parseCurrencyValue(dapicSale.ValorLiquido || dapicSale.ValorTotal || 0);
            const sale = {
              saleCode,
              saleDate: parsedDate,
              totalValue: String(totalValue),
              sellerName: dapicSale.NomeVendedor || dapicSale.Vendedor || "Sem Vendedor",
              clientName: dapicSale.NomeCliente || dapicSale.Cliente || null,
              storeId,
              status: dapicSale.Status || "Finalizado",
              paymentMethod
            };
            const items = [];
            if (dapicSale.Itens && Array.isArray(dapicSale.Itens)) {
              for (const dapicItem of dapicSale.Itens) {
                items.push({
                  saleId: "",
                  productCode: String(dapicItem.CodigoProduto || dapicItem.Codigo || ""),
                  productDescription: dapicItem.Descricao || dapicItem.NomeProduto || "Sem Descri\xE7\xE3o",
                  quantity: String(parseCurrencyValue(dapicItem.Quantidade) || 1),
                  unitPrice: String(parseCurrencyValue(dapicItem.ValorUnitario || dapicItem.PrecoUnitario || 0)),
                  totalPrice: String(parseCurrencyValue(dapicItem.ValorTotal || dapicItem.Total || 0))
                });
              }
            }
            const receipts = [];
            if (dapicSale.Recebimentos && Array.isArray(dapicSale.Recebimentos)) {
              for (const recebimento of dapicSale.Recebimentos) {
                const rawMethod = recebimento.FormaPagamento || "";
                const normalizedMethod = this.normalizePaymentMethod(rawMethod);
                const grossValue = parseFloat(recebimento.ValorBruto || recebimento.Valor || 0);
                const netValue = parseFloat(recebimento.Valor || recebimento.ValorBruto || 0);
                if (normalizedMethod && grossValue > 0) {
                  receipts.push({
                    saleId: "",
                    paymentMethod: normalizedMethod,
                    grossValue: String(grossValue),
                    netValue: String(netValue)
                  });
                }
              }
            }
            await storage.createSaleWithItemsAndReceipts(sale, items, receipts);
            salesCount++;
          } catch (itemError) {
            console.error(`[SalesSync-Additive] Erro venda ${dapicSale.Codigo}:`, itemError.message);
          }
        }
        if (salesData.length < 200) {
          hasMore = false;
        } else {
          page++;
        }
      }
      console.log(`[SalesSync-Additive] ${storeId}: ${salesCount} novas, ${skippedExisting} existentes`);
      this.syncInProgress.set(syncKey, {
        store: storeId,
        status: "completed",
        salesCount
      });
      return {
        success: true,
        store: storeId,
        salesCount
      };
    } catch (error) {
      console.error(`[SalesSync-Additive] Erro ${storeId}:`, error);
      this.syncInProgress.set(syncKey, {
        store: storeId,
        status: "failed",
        salesCount: 0,
        error: error.message
      });
      return {
        success: false,
        store: storeId,
        salesCount: 0,
        error: error.message
      };
    }
  }
  // Get current date in Brazil timezone (UTC-3)
  getBrazilDate() {
    const now = /* @__PURE__ */ new Date();
    const brazilOffset = -3 * 60;
    const utcOffset = now.getTimezoneOffset();
    return new Date(now.getTime() + (utcOffset + brazilOffset) * 60 * 1e3);
  }
  async syncFullHistory() {
    const startDate = "2024-01-01";
    const endDate = this.getBrazilDate().toISOString().split("T")[0];
    console.log(`[SalesSync] Iniciando sincroniza\xE7\xE3o completa desde ${startDate}`);
    return await this.syncAllStores(startDate, endDate);
  }
  async syncCurrentMonth() {
    const now = this.getBrazilDate();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const startDate = `${year}-${month}-01`;
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
    console.log(`[SalesSync] Sincronizando m\xEAs atual: ${startDate} a ${endDate}`);
    return await this.syncAllStores(startDate, endDate);
  }
  getSyncStatus(storeId, startDate, endDate) {
    const syncKey = `${storeId}-${startDate}-${endDate}`;
    return this.syncInProgress.get(syncKey) || null;
  }
};
var salesSyncService = new SalesSyncService();

// server/salesPatternService.ts
import { sql as sql3 } from "drizzle-orm";
var SalesPatternService = class {
  patternCache = /* @__PURE__ */ new Map();
  CACHE_TTL = 60 * 60 * 1e3;
  // 1 hour
  async getMonthPattern(month, storeId) {
    const cacheKey = `${month}-${storeId || "all"}`;
    const cached = this.patternCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    const pattern = await this.calculateMonthPattern(month, storeId);
    this.patternCache.set(cacheKey, { data: pattern, timestamp: Date.now() });
    return pattern;
  }
  async calculateMonthPattern(month, storeId) {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const yearsToAnalyze = [currentYear - 1, currentYear - 2];
    const dayData = /* @__PURE__ */ new Map();
    for (let day = 1; day <= 31; day++) {
      dayData.set(day, { total: 0, count: 0 });
    }
    for (const year of yearsToAnalyze) {
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      try {
        let query;
        if (storeId && storeId !== "todas") {
          query = sql3`
            SELECT 
              EXTRACT(DAY FROM sale_date) as day,
              SUM(total_value) as total_sales
            FROM sales
            WHERE sale_date >= ${startDate}
              AND sale_date <= ${endDate}
              AND store_id = ${storeId}
            GROUP BY EXTRACT(DAY FROM sale_date)
          `;
        } else {
          query = sql3`
            SELECT 
              EXTRACT(DAY FROM sale_date) as day,
              SUM(total_value) as total_sales
            FROM sales
            WHERE sale_date >= ${startDate}
              AND sale_date <= ${endDate}
            GROUP BY EXTRACT(DAY FROM sale_date)
          `;
        }
        const result = await db.execute(query);
        const rows = result.rows;
        for (const row of rows) {
          const day = parseInt(row.day);
          const sales2 = parseFloat(row.total_sales) || 0;
          const existing = dayData.get(day) || { total: 0, count: 0 };
          dayData.set(day, {
            total: existing.total + sales2,
            count: existing.count + 1
          });
        }
      } catch (error) {
        console.error(`[SalesPattern] Error fetching data for ${year}-${month}:`, error);
      }
    }
    const days = [];
    let totalAvgSales = 0;
    for (let day = 1; day <= 31; day++) {
      const data = dayData.get(day) || { total: 0, count: 0 };
      const avgSales = data.count > 0 ? data.total / data.count : 0;
      totalAvgSales += avgSales;
      days.push({
        day,
        weight: 0,
        // Will be calculated after
        avgSales,
        sampleCount: data.count
      });
    }
    if (totalAvgSales > 0) {
      for (const dayWeight of days) {
        dayWeight.weight = dayWeight.avgSales / totalAvgSales;
      }
    } else {
      const daysInMonth = new Date(currentYear, month, 0).getDate();
      for (const dayWeight of days) {
        if (dayWeight.day <= daysInMonth) {
          dayWeight.weight = 1 / daysInMonth;
        }
      }
    }
    return {
      month,
      days,
      totalAvgSales
    };
  }
  async calculateExpectedProgress(startDate, endDate, currentDate, storeId) {
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    if (startMonth !== endMonth) {
      const totalDays = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1e3)) + 1);
      const elapsedDays = Math.max(0, Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1e3)) + 1);
      const linearPercentage = Math.min(100, elapsedDays / totalDays * 100);
      return {
        expectedPercentage: linearPercentage,
        linearPercentage,
        patternBased: false,
        confidence: "low",
        explanation: "Per\xEDodo cruza meses - usando c\xE1lculo linear"
      };
    }
    try {
      const pattern = await this.getMonthPattern(startMonth, storeId);
      const startDay = startDate.getDate();
      const endDay = endDate.getDate();
      const currentDay = Math.min(currentDate.getDate(), endDay);
      let totalPeriodWeight = 0;
      let elapsedWeight = 0;
      for (let day = startDay; day <= endDay; day++) {
        const dayWeight = pattern.days.find((d) => d.day === day);
        if (dayWeight) {
          totalPeriodWeight += dayWeight.weight;
          if (day <= currentDay) {
            elapsedWeight += dayWeight.weight;
          }
        }
      }
      let expectedPercentage = 0;
      if (totalPeriodWeight > 0) {
        expectedPercentage = elapsedWeight / totalPeriodWeight * 100;
      }
      const totalDays = endDay - startDay + 1;
      const elapsedDays = Math.max(0, currentDay - startDay + 1);
      const linearPercentage = elapsedDays / totalDays * 100;
      const avgSampleCount = pattern.days.filter((d) => d.day >= startDay && d.day <= endDay).reduce((sum, d) => sum + d.sampleCount, 0) / totalDays;
      let confidence = "low";
      if (avgSampleCount >= 2) confidence = "high";
      else if (avgSampleCount >= 1) confidence = "medium";
      let explanation = "";
      const diff = expectedPercentage - linearPercentage;
      if (Math.abs(diff) < 2) {
        explanation = "Padr\xE3o similar ao linear";
      } else if (diff > 0) {
        explanation = `Per\xEDodo mais forte (+${diff.toFixed(0)}% do linear)`;
      } else {
        explanation = `Per\xEDodo mais fraco (${diff.toFixed(0)}% do linear)`;
      }
      return {
        expectedPercentage: Math.round(expectedPercentage * 100) / 100,
        linearPercentage: Math.round(linearPercentage * 100) / 100,
        patternBased: true,
        confidence,
        explanation
      };
    } catch (error) {
      console.error("[SalesPattern] Error calculating expected progress:", error);
      const totalDays = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1e3)) + 1);
      const elapsedDays = Math.max(0, Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1e3)) + 1);
      const linearPercentage = Math.min(100, elapsedDays / totalDays * 100);
      return {
        expectedPercentage: linearPercentage,
        linearPercentage,
        patternBased: false,
        confidence: "low",
        explanation: "Erro ao calcular padr\xE3o - usando linear"
      };
    }
  }
  async getWeeklyPattern(storeId) {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const startDate = `${currentYear - 1}-01-01`;
    const endDate = `${currentYear}-12-31`;
    try {
      let query;
      if (storeId && storeId !== "todas") {
        query = sql3`
          SELECT 
            EXTRACT(DOW FROM sale_date) as day_of_week,
            SUM(total_value) as total_sales,
            COUNT(DISTINCT sale_date) as days_count
          FROM sales
          WHERE sale_date >= ${startDate}
            AND sale_date <= ${endDate}
            AND store_id = ${storeId}
          GROUP BY EXTRACT(DOW FROM sale_date)
        `;
      } else {
        query = sql3`
          SELECT 
            EXTRACT(DOW FROM sale_date) as day_of_week,
            SUM(total_value) as total_sales,
            COUNT(DISTINCT sale_date) as days_count
          FROM sales
          WHERE sale_date >= ${startDate}
            AND sale_date <= ${endDate}
          GROUP BY EXTRACT(DOW FROM sale_date)
        `;
      }
      const result = await db.execute(query);
      const rows = result.rows;
      const weekData = {};
      let totalSales = 0;
      for (const row of rows) {
        const dow = parseInt(row.day_of_week);
        const sales2 = parseFloat(row.total_sales) || 0;
        weekData[dow] = { total: sales2, count: parseInt(row.days_count) };
        totalSales += sales2;
      }
      const weeklyPattern = [];
      for (let dow = 0; dow <= 6; dow++) {
        const data = weekData[dow] || { total: 0, count: 0 };
        weeklyPattern.push({
          dayOfWeek: dow,
          weight: totalSales > 0 ? data.total / totalSales : 1 / 7
        });
      }
      return weeklyPattern;
    } catch (error) {
      console.error("[SalesPattern] Error calculating weekly pattern:", error);
      return [0, 1, 2, 3, 4, 5, 6].map((dow) => ({ dayOfWeek: dow, weight: 1 / 7 }));
    }
  }
  clearCache() {
    this.patternCache.clear();
  }
};
var salesPatternService = new SalesPatternService();

// server/routes.ts
async function registerRoutes(app2) {
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const clients = /* @__PURE__ */ new Map();
  wss.on("connection", (ws2, req) => {
    const userId = new URL(req.url || "", `http://${req.headers.host}`).searchParams.get("userId");
    if (userId) {
      clients.set(userId, ws2);
    }
    ws2.on("message", async (rawMessage) => {
      try {
        const message = JSON.parse(rawMessage.toString());
        if (message.type === "chat" && message.data.receiverId) {
          const receiverWs = clients.get(message.data.receiverId);
          if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
            receiverWs.send(JSON.stringify(message));
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });
    ws2.on("close", () => {
      if (userId) {
        clients.delete(userId);
      }
    });
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const loginSchema = z2.object({
        username: z2.string().min(1),
        password: z2.string().min(1)
      });
      const { username, password } = loginSchema.parse(req.body);
      let user = await storage.getUserByUsername(username);
      if (!user) {
        user = await storage.getUserByEmail(username);
      }
      if (!user || !user.isActive) {
        return res.status(401).json({ error: "Usu\xE1rio ou senha incorretos" });
      }
      const isValidPassword = await bcrypt2.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Usu\xE1rio ou senha incorretos" });
      }
      const userWithoutPassword = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        storeId: user.storeId,
        avatar: user.avatar,
        isActive: user.isActive
      };
      req.session.userId = user.id;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({
        error: "Erro ao fazer login",
        message: error.message
      });
    }
  });
  app2.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Erro ao fazer logout" });
      }
      res.json({ success: true });
    });
  });
  app2.get("/api/auth/me", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const userWithoutPassword = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        storeId: user.storeId,
        avatar: user.avatar,
        isActive: user.isActive
      };
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ error: "Erro ao buscar usu\xE1rio" });
    }
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const sortedUsers = allUsers.sort(
        (a, b) => (a.fullName || "").localeCompare(b.fullName || "", "pt-BR")
      );
      res.json(sortedUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const createSchema = insertUserSchema.extend({
        storeId: z2.enum(["saron1", "saron2", "saron3"]).nullable().optional(),
        bonusPercentageAchieved: z2.coerce.number().min(0).max(100).nullable().optional(),
        bonusPercentageNotAchieved: z2.coerce.number().min(0).max(100).nullable().optional()
      });
      const parsedData = createSchema.parse(req.body);
      const dataForStorage = { ...parsedData };
      if (parsedData.bonusPercentageAchieved !== null && parsedData.bonusPercentageAchieved !== void 0) {
        dataForStorage.bonusPercentageAchieved = parsedData.bonusPercentageAchieved.toFixed(2);
      }
      if (parsedData.bonusPercentageNotAchieved !== null && parsedData.bonusPercentageNotAchieved !== void 0) {
        dataForStorage.bonusPercentageNotAchieved = parsedData.bonusPercentageNotAchieved.toFixed(2);
      }
      const newUser = await storage.createUser(dataForStorage);
      res.json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({
        error: "Invalid user data",
        message: error.message
      });
    }
  });
  app2.patch("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateSchema = z2.object({
        fullName: z2.string().min(3).optional(),
        email: z2.string().email().optional(),
        role: z2.enum(["administrador", "gerente", "vendedor", "financeiro"]).optional(),
        storeId: z2.enum(["saron1", "saron2", "saron3"]).nullable().optional(),
        password: z2.string().min(6).optional(),
        avatar: z2.string().nullable().optional(),
        bonusPercentageAchieved: z2.coerce.number().min(0).max(100).nullable().optional(),
        bonusPercentageNotAchieved: z2.coerce.number().min(0).max(100).nullable().optional()
      });
      const parsedData = updateSchema.parse(req.body);
      if (Object.keys(parsedData).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }
      const dataForStorage = { ...parsedData };
      if (parsedData.bonusPercentageAchieved !== null && parsedData.bonusPercentageAchieved !== void 0) {
        dataForStorage.bonusPercentageAchieved = parsedData.bonusPercentageAchieved.toFixed(2);
      }
      if (parsedData.bonusPercentageNotAchieved !== null && parsedData.bonusPercentageNotAchieved !== void 0) {
        dataForStorage.bonusPercentageNotAchieved = parsedData.bonusPercentageNotAchieved.toFixed(2);
      }
      const updatedUser = await storage.updateUser(id, dataForStorage);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({
        error: "Failed to update user",
        message: error.message
      });
    }
  });
  app2.delete("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUser(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(400).json({
        error: "Failed to delete user",
        message: error.message
      });
    }
  });
  app2.get("/api/users/:id/stores", async (req, res) => {
    try {
      const { id } = req.params;
      const stores = await storage.getUserStores(id);
      res.json(stores);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user stores", message: error.message });
    }
  });
  app2.put("/api/users/:id/stores", async (req, res) => {
    try {
      const { id } = req.params;
      const { storeIds } = req.body;
      if (!Array.isArray(storeIds)) {
        return res.status(400).json({ error: "storeIds must be an array" });
      }
      await storage.setUserStores(id, storeIds);
      const updatedStores = await storage.getUserStores(id);
      res.json(updatedStores);
    } catch (error) {
      res.status(500).json({ error: "Failed to set user stores", message: error.message });
    }
  });
  app2.patch("/api/users/:id/password", async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      if (!req.session?.userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      if (req.session.userId !== id) {
        return res.status(403).json({ error: "N\xE3o autorizado" });
      }
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Senha atual e nova senha s\xE3o obrigat\xF3rias" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Nova senha deve ter pelo menos 6 caracteres" });
      }
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const isValid = await bcrypt2.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ error: "Senha atual incorreta" });
      }
      const hashedPassword = await bcrypt2.hash(newPassword, 10);
      await storage.updateUser(id, { password: hashedPassword });
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ error: "Erro ao atualizar senha" });
    }
  });
  const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const userId = req.params.id;
      const userDir = path.join(uploadDir, userId);
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }
      cb(null, userDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
    }
  });
  const uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error("Only image files are allowed!"));
      }
    }
  });
  app2.post("/api/users/:id/avatar", uploadAvatar.single("avatar"), async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.session?.userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      if (req.session.userId !== id) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(403).json({ error: "N\xE3o autorizado" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }
      const avatarUrl = `/uploads/avatars/${id}/${req.file.filename}`;
      const updatedUser = await storage.updateUser(id, { avatar: avatarUrl });
      if (!updatedUser) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      res.json({ avatar: avatarUrl });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: "Erro ao fazer upload do avatar" });
    }
  });
  app2.get("/api/chat/conversations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const allUsers = await storage.getAllUsers();
      const conversations = await storage.getConversations(userId);
      const totalUnread = await storage.getUnreadCount(userId);
      const conversationMap = new Map(conversations.map((c) => [c.partnerId, c]));
      const activeUserMap = new Map(allUsers.map((u) => [u.id, u]));
      const usersWithConversations = allUsers.filter((u) => u.id !== userId).map((user) => ({
        ...user,
        lastMessageAt: conversationMap.get(user.id)?.lastMessageAt || null,
        unreadCount: conversationMap.get(user.id)?.unreadCount || 0,
        lastMessage: conversationMap.get(user.id)?.lastMessage || null
      }));
      for (const conv of conversations) {
        if (!activeUserMap.has(conv.partnerId) && conv.partnerId !== userId) {
          const inactiveUser = await storage.getUser(conv.partnerId);
          if (inactiveUser) {
            usersWithConversations.push({
              ...inactiveUser,
              lastMessageAt: conv.lastMessageAt,
              unreadCount: conv.unreadCount,
              lastMessage: conv.lastMessage
            });
          }
        }
      }
      usersWithConversations.sort((a, b) => {
        if (a.lastMessageAt && b.lastMessageAt) {
          return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
        }
        if (a.lastMessageAt) return -1;
        if (b.lastMessageAt) return 1;
        return a.fullName.localeCompare(b.fullName);
      });
      res.json({ users: usersWithConversations, unreadCount: totalUnread });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });
  app2.get("/api/chat/messages/:userId1/:userId2", async (req, res) => {
    try {
      const { userId1, userId2 } = req.params;
      const messages = await storage.getChatMessages(userId1, userId2);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  app2.get("/api/chat/unread-count/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const count2 = await storage.getUnreadCount(userId);
      res.json({ count: count2 });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unread count" });
    }
  });
  app2.post("/api/chat/mark-as-read", async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
      if (!senderId || !receiverId) {
        return res.status(400).json({ error: "senderId and receiverId are required" });
      }
      await storage.markMessagesAsRead(senderId, receiverId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  });
  const sendChatMessageHandler = async (req, res) => {
    try {
      const validatedData = insertChatMessageSchema.parse(req.body);
      const newMessage = await storage.createChatMessage(validatedData);
      const receiverWs = clients.get(validatedData.receiverId);
      if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
        receiverWs.send(JSON.stringify({
          type: "chat",
          data: newMessage
        }));
      }
      const senderWs = clients.get(validatedData.senderId);
      if (senderWs && senderWs.readyState === WebSocket.OPEN) {
        senderWs.send(JSON.stringify({
          type: "chat",
          data: newMessage
        }));
      }
      res.json(newMessage);
    } catch (error) {
      console.error("Error creating chat message:", error);
      res.status(400).json({
        error: "Invalid message data",
        message: error.message
      });
    }
  };
  app2.post("/api/chat/messages", sendChatMessageHandler);
  app2.post("/api/chat/send", sendChatMessageHandler);
  app2.get("/api/schedule", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      const { startDate, endDate, storeId } = req.query;
      let effectiveStoreId;
      if (user.role === "administrador" && storeId) {
        effectiveStoreId = storeId;
      } else {
        effectiveStoreId = user.storeId || void 0;
      }
      const events = await storage.getScheduleEvents(
        effectiveStoreId,
        startDate ? new Date(startDate) : void 0,
        endDate ? new Date(endDate) : void 0
      );
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedule events" });
    }
  });
  app2.post("/api/schedule", async (req, res) => {
    try {
      const sessionUserId = req.session.userId;
      if (!sessionUserId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const currentUser = await storage.getUser(sessionUserId);
      if (!currentUser) {
        return res.status(401).json({ error: "User not found" });
      }
      console.log("[Schedule] Creating event with data:", JSON.stringify(req.body, null, 2));
      const requestedStoreId = req.body.storeId;
      let effectiveStoreId;
      if (currentUser.role === "administrador" && requestedStoreId) {
        effectiveStoreId = requestedStoreId;
      } else if (currentUser.role === "gerente" && requestedStoreId === currentUser.storeId && currentUser.storeId) {
        effectiveStoreId = currentUser.storeId;
      } else if (currentUser.storeId) {
        effectiveStoreId = currentUser.storeId;
      } else {
        return res.status(400).json({ error: "User has no store assigned" });
      }
      const eventData = { ...req.body, storeId: effectiveStoreId };
      const validatedData = insertScheduleEventSchema.parse(eventData);
      const newEvent = await storage.createScheduleEvent(validatedData);
      clients.forEach((ws2) => {
        if (ws2.readyState === WebSocket.OPEN) {
          ws2.send(JSON.stringify({
            type: "schedule",
            data: newEvent
          }));
        }
      });
      res.json(newEvent);
    } catch (error) {
      console.error("[Schedule] Error creating event:", error);
      res.status(400).json({ error: "Invalid event data", details: error.message || String(error) });
    }
  });
  app2.get("/api/schedule/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const event = await storage.getScheduleEvent(id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });
  app2.patch("/api/schedule/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const sessionUserId = req.session.userId;
      if (!sessionUserId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const currentUser = await storage.getUser(sessionUserId);
      if (!currentUser || currentUser.role !== "administrador" && currentUser.role !== "gerente") {
        return res.status(403).json({ error: "Permission denied" });
      }
      const { date: date2, startTime: startTimeStr, endTime: endTimeStr, ...rest } = req.body;
      const updateData = { ...rest };
      if (date2 && startTimeStr) {
        updateData.startTime = /* @__PURE__ */ new Date(`${date2}T${startTimeStr}:00`);
      }
      if (date2 && endTimeStr) {
        updateData.endTime = /* @__PURE__ */ new Date(`${date2}T${endTimeStr}:00`);
      }
      if (req.body.startTime && typeof req.body.startTime === "string" && req.body.startTime.includes("T")) {
        updateData.startTime = new Date(req.body.startTime);
      }
      if (req.body.endTime && typeof req.body.endTime === "string" && req.body.endTime.includes("T")) {
        updateData.endTime = new Date(req.body.endTime);
      }
      const updated = await storage.updateScheduleEvent(id, updateData);
      if (!updated) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("[Schedule] Error updating event:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  });
  app2.delete("/api/schedule/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteScheduleEvent(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });
  app2.get("/api/announcements", async (req, res) => {
    try {
      const allAnnouncements = await storage.getAnnouncements();
      res.json(allAnnouncements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });
  app2.post("/api/announcements", async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const newAnnouncement = await storage.createAnnouncement(validatedData);
      clients.forEach((ws2) => {
        if (ws2.readyState === WebSocket.OPEN) {
          ws2.send(JSON.stringify({
            type: "announcement",
            data: newAnnouncement
          }));
        }
      });
      res.json(newAnnouncement);
    } catch (error) {
      res.status(400).json({ error: "Invalid announcement data" });
    }
  });
  app2.patch("/api/announcements/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateAnnouncement(id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update announcement" });
    }
  });
  app2.delete("/api/announcements/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAnnouncement(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });
  app2.get("/api/anonymous-messages", async (req, res) => {
    try {
      const allMessages = await storage.getAnonymousMessages();
      res.json(allMessages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch anonymous messages" });
    }
  });
  app2.post("/api/anonymous-messages", async (req, res) => {
    try {
      const validatedData = insertAnonymousMessageSchema.parse(req.body);
      const newMessage = await storage.createAnonymousMessage(validatedData);
      clients.forEach((ws2) => {
        if (ws2.readyState === WebSocket.OPEN) {
          ws2.send(JSON.stringify({
            type: "anonymous",
            data: newMessage
          }));
        }
      });
      res.json(newMessage);
    } catch (error) {
      console.error("Error creating anonymous message:", error);
      res.status(400).json({
        error: "Invalid anonymous message data",
        message: error.message
      });
    }
  });
  app2.patch("/api/anonymous-messages/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.markAnonymousMessageAsRead(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });
  app2.get("/api/goals", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const { storeId, sellerId, weekStart, weekEnd, type, isActive } = req.query;
      let effectiveStoreId = storeId;
      if (user.role === "gerente") {
        const userStoresList = await storage.getUserStores(user.id);
        const managerStoreIds = userStoresList.length > 0 ? userStoresList.map((us) => us.storeId) : user.storeId ? [user.storeId] : [];
        if (storeId && storeId !== "all") {
          if (!managerStoreIds.includes(storeId)) {
            return res.status(403).json({ error: "Sem permiss\xE3o para ver metas desta loja" });
          }
          effectiveStoreId = storeId;
        } else {
          const allGoals = await storage.getSalesGoals({
            sellerId,
            weekStart,
            weekEnd,
            type,
            isActive: isActive === "true" ? true : isActive === "false" ? false : void 0
          });
          const filteredGoals = allGoals.filter((goal) => managerStoreIds.includes(goal.storeId));
          return res.json(filteredGoals);
        }
      }
      const goals = await storage.getSalesGoals({
        storeId: effectiveStoreId,
        sellerId,
        weekStart,
        weekEnd,
        type,
        isActive: isActive === "true" ? true : isActive === "false" ? false : void 0
      });
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({
        error: "Erro ao buscar metas",
        message: error.message
      });
    }
  });
  app2.post("/api/goals", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador" && user.role !== "gerente") {
        return res.status(403).json({ error: "Sem permiss\xE3o para criar metas" });
      }
      const validatedData = insertSalesGoalSchema.parse({
        ...req.body,
        createdById: userId
      });
      const overlappingGoals = await storage.checkOverlappingGoals({
        storeId: validatedData.storeId,
        sellerId: validatedData.sellerId || null,
        type: validatedData.type,
        period: validatedData.period || "weekly",
        weekStart: validatedData.weekStart,
        weekEnd: validatedData.weekEnd
      });
      if (overlappingGoals.length > 0) {
        const periodLabel = validatedData.period === "monthly" ? "mensal" : "semanal";
        const typeLabel = validatedData.type === "individual" ? "individual" : "conjunta";
        return res.status(409).json({
          error: `J\xE1 existe uma meta ${typeLabel} ${periodLabel} para este per\xEDodo que sobrep\xF5e as datas selecionadas.`,
          overlappingGoals: overlappingGoals.map((g) => ({
            id: g.id,
            weekStart: g.weekStart,
            weekEnd: g.weekEnd
          }))
        });
      }
      const newGoal = await storage.createSalesGoal(validatedData);
      res.json(newGoal);
    } catch (error) {
      console.error("Error creating goal:", error);
      res.status(400).json({
        error: "Erro ao criar meta",
        message: error.message
      });
    }
  });
  app2.patch("/api/goals/:id", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador" && user.role !== "gerente") {
        return res.status(403).json({ error: "Sem permiss\xE3o para atualizar metas" });
      }
      const { id } = req.params;
      const existingGoal = await storage.getSalesGoals({ id });
      if (existingGoal.length === 0) {
        return res.status(404).json({ error: "Meta n\xE3o encontrada" });
      }
      const currentGoal = existingGoal[0];
      const updateData = req.body;
      const storeId = updateData.storeId || currentGoal.storeId;
      const sellerId = updateData.sellerId !== void 0 ? updateData.sellerId : currentGoal.sellerId;
      const type = updateData.type || currentGoal.type;
      const period = updateData.period || currentGoal.period;
      const weekStart = updateData.weekStart || currentGoal.weekStart;
      const weekEnd = updateData.weekEnd || currentGoal.weekEnd;
      if (updateData.weekStart || updateData.weekEnd || updateData.storeId || updateData.sellerId !== void 0 || updateData.type || updateData.period) {
        const overlappingGoals = await storage.checkOverlappingGoals({
          storeId,
          sellerId,
          type,
          period,
          weekStart,
          weekEnd,
          excludeId: id
        });
        if (overlappingGoals.length > 0) {
          const periodLabel = period === "monthly" ? "mensal" : "semanal";
          const typeLabel = type === "individual" ? "individual" : "conjunta";
          return res.status(409).json({
            error: `J\xE1 existe uma meta ${typeLabel} ${periodLabel} para este per\xEDodo que sobrep\xF5e as datas selecionadas.`,
            overlappingGoals: overlappingGoals.map((g) => ({
              id: g.id,
              weekStart: g.weekStart,
              weekEnd: g.weekEnd
            }))
          });
        }
      }
      const updatedGoal = await storage.updateSalesGoal(id, updateData);
      res.json(updatedGoal);
    } catch (error) {
      console.error("Error updating goal:", error);
      res.status(400).json({
        error: "Erro ao atualizar meta",
        message: error.message
      });
    }
  });
  app2.delete("/api/goals/:id", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador" && user.role !== "gerente") {
        return res.status(403).json({ error: "Sem permiss\xE3o para deletar metas" });
      }
      const { id } = req.params;
      await storage.deleteSalesGoal(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting goal:", error);
      res.status(500).json({
        error: "Erro ao deletar meta",
        message: error.message
      });
    }
  });
  app2.get("/api/goals/progress", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const { goalId, storeId, weekStart, weekEnd } = req.query;
      if (!goalId && (!storeId || !weekStart || !weekEnd)) {
        return res.status(400).json({
          error: "goalId ou (storeId + weekStart + weekEnd) s\xE3o obrigat\xF3rios"
        });
      }
      let goal;
      if (goalId) {
        const goals = await storage.getSalesGoals({ id: goalId });
        goal = goals[0];
        if (!goal) {
          return res.status(404).json({ error: "Meta n\xE3o encontrada" });
        }
      }
      const targetStoreId = goalId && goal ? goal.storeId : storeId;
      const targetWeekStart = goalId && goal ? goal.weekStart : weekStart;
      const targetWeekEnd = goalId && goal ? goal.weekEnd : weekEnd;
      let totalSales = 0;
      if (goal && goal.type === "individual" && goal.sellerId) {
        const sellerUser = await storage.getUser(goal.sellerId);
        const sellerName = sellerUser?.fullName;
        const sales2 = await storage.getSales({
          storeId: targetStoreId,
          sellerName,
          startDate: targetWeekStart,
          endDate: targetWeekEnd
        });
        totalSales = sales2.reduce((sum, sale) => {
          const value = parseFloat(sale.totalValue);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
      } else {
        const sales2 = await storage.getSales({
          storeId: targetStoreId,
          startDate: targetWeekStart,
          endDate: targetWeekEnd
        });
        totalSales = sales2.reduce((sum, sale) => {
          const value = parseFloat(sale.totalValue);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
      }
      const progress = {
        goalId: goalId || null,
        storeId: targetStoreId,
        weekStart: targetWeekStart,
        weekEnd: targetWeekEnd,
        targetValue: goal ? parseFloat(goal.targetValue) : null,
        currentValue: totalSales,
        percentage: goal ? totalSales / parseFloat(goal.targetValue) * 100 : null
      };
      res.json(progress);
    } catch (error) {
      console.error("Error calculating goal progress:", error);
      res.status(500).json({
        error: "Erro ao calcular progresso da meta",
        message: error.message
      });
    }
  });
  app2.get("/api/goals/dashboard", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const { storeId } = req.query;
      const getBrazilDate2 = () => {
        const now2 = /* @__PURE__ */ new Date();
        const brazilOffset = -3 * 60;
        const utcOffset = now2.getTimezoneOffset();
        return new Date(now2.getTime() + (utcOffset + brazilOffset) * 60 * 1e3);
      };
      const now = getBrazilDate2();
      const todayStr = now.toISOString().split("T")[0];
      const dayMs = 1e3 * 60 * 60 * 24;
      const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      console.log("[GoalsDashboard] todayStr:", todayStr, "storeId:", storeId, "userRole:", user.role);
      const allActiveGoals = await storage.getSalesGoals({ isActive: true });
      let managerStoreIds = [];
      if (user.role === "gerente") {
        const userStoresList = await storage.getUserStores(user.id);
        managerStoreIds = userStoresList.map((us) => us.storeId);
        if (managerStoreIds.length === 0 && user.storeId) {
          managerStoreIds = [user.storeId];
        }
      }
      const currentGoals = allActiveGoals.filter((goal) => {
        const isWithinRange = todayStr >= goal.weekStart && todayStr <= goal.weekEnd;
        if (goal.storeId === "saron2") {
          console.log("[GoalsDashboard] Saron2 goal:", goal.id, "period:", goal.period, "weekStart:", goal.weekStart, "weekEnd:", goal.weekEnd, "isActive:", goal.isActive, "isWithinRange:", isWithinRange);
        }
        return isWithinRange;
      });
      console.log("[GoalsDashboard] currentGoals count:", currentGoals.length, "allActiveGoals count:", allActiveGoals.length);
      const calculateGoalProgress = async (goal, sellerName, sellerUser) => {
        const sales2 = await storage.getSales({
          storeId: goal.storeId,
          sellerName: goal.type === "individual" ? sellerName : void 0,
          startDate: goal.weekStart,
          endDate: goal.weekEnd
        });
        const totalSales = sales2.reduce((sum, sale) => {
          const value = parseFloat(sale.totalValue);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
        const targetValue = parseFloat(goal.targetValue);
        const percentage = targetValue > 0 ? totalSales / targetValue * 100 : 0;
        const [startYear, startMonth, startDay] = goal.weekStart.split("-").map(Number);
        const [endYear, endMonth, endDay] = goal.weekEnd.split("-").map(Number);
        const startDateUtc = Date.UTC(startYear, startMonth - 1, startDay);
        const endDateUtc = Date.UTC(endYear, endMonth - 1, endDay);
        const totalDays = Math.max(1, Math.floor((endDateUtc - startDateUtc) / dayMs) + 1);
        const elapsedDays = Math.floor((nowUtc - startDateUtc) / dayMs) + 1;
        const patternResult = await salesPatternService.calculateExpectedProgress(
          new Date(startYear, startMonth - 1, startDay),
          new Date(endYear, endMonth - 1, endDay),
          /* @__PURE__ */ new Date(),
          goal.storeId
        );
        const expectedPercentage = patternResult.expectedPercentage;
        const isOnTrack = percentage >= expectedPercentage;
        let bonusPercentageAchieved = null;
        let bonusPercentageNotAchieved = null;
        let estimatedBonus = null;
        if (goal.type === "individual" && sellerUser) {
          bonusPercentageAchieved = sellerUser.bonusPercentageAchieved ? parseFloat(sellerUser.bonusPercentageAchieved) : null;
          bonusPercentageNotAchieved = sellerUser.bonusPercentageNotAchieved ? parseFloat(sellerUser.bonusPercentageNotAchieved) : null;
          if (bonusPercentageAchieved !== null || bonusPercentageNotAchieved !== null) {
            const bonusPercentage = percentage >= 100 ? bonusPercentageAchieved || 0 : bonusPercentageNotAchieved || 0;
            estimatedBonus = totalSales * (bonusPercentage / 100);
          }
        }
        return {
          id: goal.id,
          storeId: goal.storeId,
          type: goal.type,
          period: goal.period,
          sellerId: goal.sellerId,
          sellerName: sellerName || null,
          weekStart: goal.weekStart,
          weekEnd: goal.weekEnd,
          targetValue,
          currentValue: totalSales,
          percentage,
          expectedPercentage,
          isOnTrack,
          elapsedDays,
          totalDays,
          bonusPercentageAchieved,
          bonusPercentageNotAchieved,
          estimatedBonus
        };
      };
      if (user.role === "vendedor") {
        const isSaron2Seller = user.storeId === "saron2";
        let vendorGoals;
        if (isSaron2Seller) {
          vendorGoals = currentGoals.filter(
            (goal) => goal.storeId === "saron2" && goal.type === "team"
          );
        } else {
          vendorGoals = currentGoals.filter(
            (goal) => goal.type === "individual" && goal.sellerId === user.id
          );
        }
        const goalsWithProgress = await Promise.all(vendorGoals.map(
          (goal) => calculateGoalProgress(goal, isSaron2Seller ? void 0 : user.fullName, user)
        ));
        return res.json(goalsWithProgress);
      }
      if (user.role === "gerente") {
        const managerStoreGoals = currentGoals.filter(
          (goal) => managerStoreIds.includes(goal.storeId)
        );
        if (managerStoreGoals.length === 0) {
          return res.json([]);
        }
        const weeklyGoals2 = managerStoreGoals.filter((g) => g.period === "weekly");
        const monthlyGoals2 = managerStoreGoals.filter((g) => g.period === "monthly");
        const calculateManagerAggregatedProgress = async (goals, periodLabel) => {
          if (goals.length === 0) return null;
          let totalTarget = 0;
          let totalCurrent = 0;
          let earliestStart = goals[0].weekStart;
          let latestEnd = goals[0].weekEnd;
          for (const goal of goals) {
            totalTarget += parseFloat(goal.targetValue);
            if (goal.weekStart < earliestStart) earliestStart = goal.weekStart;
            if (goal.weekEnd > latestEnd) latestEnd = goal.weekEnd;
            if (goal.type === "individual" && goal.sellerId) {
              const sellerUser = await storage.getUser(goal.sellerId);
              const sales2 = await storage.getSales({
                storeId: goal.storeId,
                sellerName: sellerUser?.fullName,
                startDate: goal.weekStart,
                endDate: goal.weekEnd
              });
              totalCurrent += sales2.reduce((sum, sale) => {
                const value = parseFloat(sale.totalValue);
                return sum + (isNaN(value) ? 0 : value);
              }, 0);
            } else {
              const sales2 = await storage.getSales({
                storeId: goal.storeId,
                startDate: goal.weekStart,
                endDate: goal.weekEnd
              });
              totalCurrent += sales2.reduce((sum, sale) => {
                const value = parseFloat(sale.totalValue);
                return sum + (isNaN(value) ? 0 : value);
              }, 0);
            }
          }
          const percentage = totalTarget > 0 ? totalCurrent / totalTarget * 100 : 0;
          const [startYear, startMonth, startDay] = earliestStart.split("-").map(Number);
          const [endYear, endMonth, endDay] = latestEnd.split("-").map(Number);
          const startDateUtc = Date.UTC(startYear, startMonth - 1, startDay);
          const endDateUtc = Date.UTC(endYear, endMonth - 1, endDay);
          const totalDays = Math.max(1, Math.floor((endDateUtc - startDateUtc) / dayMs) + 1);
          let elapsedDays;
          let expectedPercentage;
          if (nowUtc < startDateUtc) {
            elapsedDays = 0;
            expectedPercentage = 0;
          } else if (nowUtc > endDateUtc) {
            elapsedDays = totalDays;
            expectedPercentage = 100;
          } else {
            elapsedDays = Math.floor((nowUtc - startDateUtc) / dayMs) + 1;
            const patternResult = await salesPatternService.calculateExpectedProgress(
              new Date(startYear, startMonth - 1, startDay),
              new Date(endYear, endMonth - 1, endDay),
              /* @__PURE__ */ new Date(),
              managerStoreIds.length === 1 ? managerStoreIds[0] : void 0
            );
            expectedPercentage = patternResult.expectedPercentage;
          }
          const isOnTrack = percentage >= expectedPercentage;
          const storeLabel = managerStoreIds.length > 1 ? "Suas Lojas" : managerStoreIds[0] || user.storeId;
          return {
            id: `aggregated-${periodLabel}`,
            storeId: storeLabel,
            type: "aggregated",
            period: periodLabel,
            sellerId: null,
            sellerName: null,
            weekStart: earliestStart,
            weekEnd: latestEnd,
            targetValue: totalTarget,
            currentValue: totalCurrent,
            percentage,
            expectedPercentage,
            isOnTrack,
            elapsedDays,
            totalDays,
            goalsCount: goals.length,
            bonusPercentageAchieved: null,
            bonusPercentageNotAchieved: null,
            estimatedBonus: null
          };
        };
        const results2 = [];
        const weeklyAggregated2 = await calculateManagerAggregatedProgress(weeklyGoals2, "weekly");
        if (weeklyAggregated2) results2.push(weeklyAggregated2);
        const monthlyAggregated2 = await calculateManagerAggregatedProgress(monthlyGoals2, "monthly");
        if (monthlyAggregated2) results2.push(monthlyAggregated2);
        return res.json(results2);
      }
      let relevantGoals = currentGoals;
      if (storeId && storeId !== "todas") {
        relevantGoals = currentGoals.filter((goal) => goal.storeId === storeId);
      }
      const weeklyGoals = relevantGoals.filter((g) => g.period === "weekly");
      const monthlyGoals = relevantGoals.filter((g) => g.period === "monthly");
      const calculateAggregatedProgress = async (goals, periodLabel) => {
        if (goals.length === 0) return null;
        let totalTarget = 0;
        let totalCurrent = 0;
        let earliestStart = goals[0].weekStart;
        let latestEnd = goals[0].weekEnd;
        for (const goal of goals) {
          totalTarget += parseFloat(goal.targetValue);
          if (goal.weekStart < earliestStart) earliestStart = goal.weekStart;
          if (goal.weekEnd > latestEnd) latestEnd = goal.weekEnd;
          if (goal.type === "individual" && goal.sellerId) {
            const sellerUser = await storage.getUser(goal.sellerId);
            const sales2 = await storage.getSales({
              storeId: goal.storeId,
              sellerName: sellerUser?.fullName,
              startDate: goal.weekStart,
              endDate: goal.weekEnd
            });
            totalCurrent += sales2.reduce((sum, sale) => {
              const value = parseFloat(sale.totalValue);
              return sum + (isNaN(value) ? 0 : value);
            }, 0);
          } else {
            const sales2 = await storage.getSales({
              storeId: goal.storeId,
              startDate: goal.weekStart,
              endDate: goal.weekEnd
            });
            totalCurrent += sales2.reduce((sum, sale) => {
              const value = parseFloat(sale.totalValue);
              return sum + (isNaN(value) ? 0 : value);
            }, 0);
          }
        }
        const percentage = totalTarget > 0 ? totalCurrent / totalTarget * 100 : 0;
        const [startYear, startMonth, startDay] = earliestStart.split("-").map(Number);
        const [endYear, endMonth, endDay] = latestEnd.split("-").map(Number);
        const startDateUtc = Date.UTC(startYear, startMonth - 1, startDay);
        const endDateUtc = Date.UTC(endYear, endMonth - 1, endDay);
        const totalDays = Math.max(1, Math.floor((endDateUtc - startDateUtc) / dayMs) + 1);
        let elapsedDays;
        let expectedPercentage;
        if (nowUtc < startDateUtc) {
          elapsedDays = 0;
          expectedPercentage = 0;
        } else if (nowUtc > endDateUtc) {
          elapsedDays = totalDays;
          expectedPercentage = 100;
        } else {
          elapsedDays = Math.floor((nowUtc - startDateUtc) / dayMs) + 1;
          const patternResult = await salesPatternService.calculateExpectedProgress(
            new Date(startYear, startMonth - 1, startDay),
            new Date(endYear, endMonth - 1, endDay),
            /* @__PURE__ */ new Date(),
            typeof storeId === "string" ? storeId : void 0
          );
          expectedPercentage = patternResult.expectedPercentage;
        }
        const isOnTrack = percentage >= expectedPercentage;
        const storeLabel = user.role === "administrador" ? storeId && storeId !== "todas" ? storeId : "Todas as Lojas" : managerStoreIds.length > 1 ? "Suas Lojas" : managerStoreIds[0] || user.storeId;
        return {
          id: `aggregated-${periodLabel}`,
          storeId: storeLabel,
          type: "aggregated",
          period: periodLabel,
          sellerId: null,
          sellerName: null,
          weekStart: earliestStart,
          weekEnd: latestEnd,
          targetValue: totalTarget,
          currentValue: totalCurrent,
          percentage,
          expectedPercentage,
          isOnTrack,
          elapsedDays,
          totalDays,
          goalsCount: goals.length
        };
      };
      const results = [];
      const weeklyAggregated = await calculateAggregatedProgress(weeklyGoals, "weekly");
      if (weeklyAggregated) results.push(weeklyAggregated);
      const monthlyAggregated = await calculateAggregatedProgress(monthlyGoals, "monthly");
      if (monthlyAggregated) results.push(monthlyAggregated);
      res.json(results);
    } catch (error) {
      console.error("Error fetching dashboard goals:", error);
      res.status(500).json({
        error: "Erro ao buscar metas do dashboard",
        message: error.message
      });
    }
  });
  app2.get("/api/cashier/dashboard", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "caixa") {
        return res.status(403).json({ error: "Acesso restrito a caixas" });
      }
      const now = /* @__PURE__ */ new Date();
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      const weekStart = monday.toISOString().split("T")[0];
      const weekEnd = sunday.toISOString().split("T")[0];
      const cashierGoals2 = await storage.getCashierGoals({
        cashierId: user.id,
        isActive: true
      });
      const todayStr = now.toISOString().split("T")[0];
      const currentGoal = cashierGoals2.find(
        (g) => g.periodType === "weekly" && todayStr >= g.weekStart && todayStr <= g.weekEnd
      );
      if (!currentGoal) {
        return res.json({
          hasGoal: false,
          message: "Nenhuma meta semanal encontrada para esta semana",
          weekStart: todayStr,
          weekEnd: todayStr
        });
      }
      const goalWeekStart = currentGoal.weekStart;
      const goalWeekEnd = currentGoal.weekEnd;
      const storeSales = await storage.getSales({
        storeId: currentGoal.storeId,
        startDate: goalWeekStart,
        endDate: goalWeekEnd
      });
      const totalStoreSales = storeSales.reduce((sum, s) => sum + parseFloat(s.totalValue), 0);
      const paymentMethods = currentGoal.paymentMethods || [];
      const receiptTotals = await storage.getReceiptsByPaymentMethod(
        currentGoal.storeId,
        goalWeekStart,
        goalWeekEnd,
        paymentMethods
      );
      let targetMethodSales = 0;
      for (const receipt of receiptTotals) {
        targetMethodSales += receipt.totalGross;
      }
      const percentageAchieved = totalStoreSales > 0 ? targetMethodSales / totalStoreSales * 100 : 0;
      const targetPercentage = parseFloat(currentGoal.targetPercentage);
      const isGoalMet = percentageAchieved >= targetPercentage;
      const startDate = /* @__PURE__ */ new Date(goalWeekStart + "T00:00:00");
      const endDate = /* @__PURE__ */ new Date(goalWeekEnd + "T23:59:59");
      const totalDays = 7;
      let elapsedDays = 0;
      if (now >= startDate && now <= endDate) {
        elapsedDays = Math.floor((now.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24)) + 1;
      } else if (now > endDate) {
        elapsedDays = 7;
      }
      const expectedPercentage = elapsedDays / totalDays * targetPercentage;
      const isOnTrack = percentageAchieved >= expectedPercentage;
      res.json({
        hasGoal: true,
        goal: {
          id: currentGoal.id,
          storeId: currentGoal.storeId,
          weekStart: goalWeekStart,
          weekEnd: goalWeekEnd,
          paymentMethods,
          targetPercentage,
          currentPercentage: Math.round(percentageAchieved * 100) / 100,
          isGoalMet,
          isOnTrack,
          elapsedDays,
          totalDays,
          expectedPercentage: Math.round(expectedPercentage * 100) / 100,
          totalStoreSales: Math.round(totalStoreSales * 100) / 100,
          targetMethodSales: Math.round(targetMethodSales * 100) / 100,
          bonusPercentageAchieved: parseFloat(currentGoal.bonusPercentageAchieved),
          bonusPercentageNotAchieved: parseFloat(currentGoal.bonusPercentageNotAchieved)
        },
        salesByMethod: receiptTotals.map((r) => ({
          method: r.paymentMethod,
          total: Math.round(r.totalGross * 100) / 100
        }))
      });
    } catch (error) {
      console.error("Error fetching cashier dashboard:", error);
      res.status(500).json({
        error: "Erro ao buscar dados do dashboard",
        message: error.message
      });
    }
  });
  app2.get("/api/goals/personal", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      if (user.role !== "vendedor" && user.role !== "gerente" && user.role !== "caixa") {
        return res.status(403).json({ error: "Sem permiss\xE3o para acessar metas pessoais" });
      }
      const now = /* @__PURE__ */ new Date();
      const fourWeeksAgo = new Date(now);
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      const fourWeeksAgoStr = fourWeeksAgo.toISOString().split("T")[0];
      const todayStr = now.toISOString().split("T")[0];
      if (user.role === "caixa") {
        const allCashierGoals = await storage.getCashierGoals({
          cashierId: user.id
        });
        const recentGoals2 = allCashierGoals.filter((goal) => {
          return goal.weekEnd >= fourWeeksAgoStr && goal.weekStart <= todayStr;
        });
        const goalsWithProgress2 = await Promise.all(recentGoals2.map(async (goal) => {
          const storeSales = await storage.getSales({
            storeId: goal.storeId,
            startDate: goal.weekStart,
            endDate: goal.weekEnd
          });
          const totalStoreSales = storeSales.reduce((sum, sale) => {
            const value = parseFloat(sale.totalValue);
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
          const paymentMethods = goal.paymentMethods || [];
          const receiptTotals = await storage.getReceiptsByPaymentMethod(
            goal.storeId,
            goal.weekStart,
            goal.weekEnd,
            paymentMethods
          );
          let targetMethodSales = 0;
          for (const receipt of receiptTotals) {
            targetMethodSales += receipt.totalGross;
          }
          const percentageAchieved = totalStoreSales > 0 ? targetMethodSales / totalStoreSales * 100 : 0;
          const targetPercentage = parseFloat(goal.targetPercentage);
          const achieved = percentageAchieved >= targetPercentage;
          const isFinished = goal.weekEnd < todayStr;
          const bonusPercentageAchieved = parseFloat(goal.bonusPercentageAchieved);
          const bonusPercentageNotAchieved = parseFloat(goal.bonusPercentageNotAchieved);
          const appliedBonusPercentage = achieved ? bonusPercentageAchieved : bonusPercentageNotAchieved;
          const bonusValue = appliedBonusPercentage / 100 * targetMethodSales;
          return {
            id: goal.id,
            storeId: goal.storeId,
            period: goal.periodType,
            weekStart: goal.weekStart,
            weekEnd: goal.weekEnd,
            targetValue: targetPercentage,
            // For caixa, target is a percentage
            currentValue: percentageAchieved,
            // Current achieved percentage
            percentage: percentageAchieved / targetPercentage * 100,
            // Progress towards goal
            achieved,
            isFinished,
            bonusPercentageAchieved,
            bonusPercentageNotAchieved,
            appliedBonusPercentage,
            bonusValue,
            paymentMethods,
            totalStoreSales,
            targetMethodSales,
            isCashierGoal: true
          };
        }));
        goalsWithProgress2.sort((a, b) => {
          return new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime();
        });
        const finishedGoals = goalsWithProgress2.filter((g) => g.isFinished);
        const totalBonus = finishedGoals.reduce((sum, g) => sum + g.bonusValue, 0);
        const totalTargetMethodSales = goalsWithProgress2.reduce((sum, g) => sum + g.targetMethodSales, 0);
        return res.json({
          user: {
            id: user.id,
            fullName: user.fullName,
            role: user.role,
            storeId: user.storeId,
            bonusPercentageAchieved: null,
            bonusPercentageNotAchieved: null
          },
          goals: goalsWithProgress2,
          summary: {
            totalGoals: goalsWithProgress2.length,
            achievedGoals: finishedGoals.filter((g) => g.achieved).length,
            totalBonus,
            totalSales: totalTargetMethodSales
            // For caixa, this is total sales in target payment methods
          },
          isCashierData: true
        });
      }
      const isSaron2Seller = user.role === "vendedor" && user.storeId === "saron2";
      let allGoals;
      if (isSaron2Seller) {
        allGoals = await storage.getSalesGoals({
          storeId: "saron2",
          type: "team"
        });
      } else {
        allGoals = await storage.getSalesGoals({
          sellerId: user.id,
          type: "individual"
        });
      }
      const recentGoals = allGoals.filter((goal) => {
        return goal.weekEnd >= fourWeeksAgoStr && goal.weekStart <= todayStr;
      });
      const goalsWithProgress = await Promise.all(recentGoals.map(async (goal) => {
        const isTeamGoal = goal.type === "team";
        const sales2 = await storage.getSales({
          storeId: goal.storeId,
          sellerName: isTeamGoal ? void 0 : user.fullName,
          startDate: goal.weekStart,
          endDate: goal.weekEnd
        });
        const totalSales = sales2.reduce((sum, sale) => {
          const value = parseFloat(sale.totalValue);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
        const targetValue = parseFloat(goal.targetValue);
        const percentage = targetValue > 0 ? totalSales / targetValue * 100 : 0;
        const achieved = percentage >= 100;
        const bonusPercentageAchieved = user.bonusPercentageAchieved ? parseFloat(user.bonusPercentageAchieved) : null;
        const bonusPercentageNotAchieved = user.bonusPercentageNotAchieved ? parseFloat(user.bonusPercentageNotAchieved) : null;
        let bonusValue = 0;
        let appliedBonusPercentage = 0;
        if (achieved && bonusPercentageAchieved !== null) {
          appliedBonusPercentage = bonusPercentageAchieved;
          bonusValue = totalSales * (bonusPercentageAchieved / 100);
        } else if (!achieved && bonusPercentageNotAchieved !== null) {
          appliedBonusPercentage = bonusPercentageNotAchieved;
          bonusValue = totalSales * (bonusPercentageNotAchieved / 100);
        }
        const isFinished = goal.weekEnd < todayStr;
        return {
          id: goal.id,
          storeId: goal.storeId,
          period: goal.period,
          weekStart: goal.weekStart,
          weekEnd: goal.weekEnd,
          targetValue,
          currentValue: totalSales,
          percentage,
          achieved,
          isFinished,
          bonusPercentageAchieved,
          bonusPercentageNotAchieved,
          appliedBonusPercentage,
          bonusValue,
          isTeamGoal
        };
      }));
      goalsWithProgress.sort((a, b) => {
        return new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime();
      });
      res.json({
        user: {
          id: user.id,
          fullName: user.fullName,
          role: user.role,
          storeId: user.storeId,
          bonusPercentageAchieved: user.bonusPercentageAchieved ? parseFloat(user.bonusPercentageAchieved) : null,
          bonusPercentageNotAchieved: user.bonusPercentageNotAchieved ? parseFloat(user.bonusPercentageNotAchieved) : null
        },
        goals: goalsWithProgress,
        summary: {
          totalGoals: goalsWithProgress.length,
          achievedGoals: goalsWithProgress.filter((g) => g.achieved && g.isFinished).length,
          totalBonus: goalsWithProgress.filter((g) => g.isFinished).reduce((sum, g) => sum + g.bonusValue, 0),
          totalSales: goalsWithProgress.reduce((sum, g) => sum + g.currentValue, 0)
        }
      });
    } catch (error) {
      console.error("Error fetching personal goals:", error);
      res.status(500).json({
        error: "Erro ao buscar metas pessoais",
        message: error.message
      });
    }
  });
  app2.get("/api/cashier-goals", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const { storeId, cashierId, isActive } = req.query;
      let effectiveStoreId = storeId;
      if (user.role === "gerente") {
        const userStoresList = await storage.getUserStores(user.id);
        const managerStoreIds = userStoresList.length > 0 ? userStoresList.map((us) => us.storeId) : user.storeId ? [user.storeId] : [];
        if (storeId && storeId !== "all") {
          if (!managerStoreIds.includes(storeId)) {
            return res.status(403).json({ error: "Sem permiss\xE3o para ver metas de caixa desta loja" });
          }
          effectiveStoreId = storeId;
        } else {
          const allGoals = await storage.getCashierGoals({
            cashierId,
            isActive: isActive === "true" ? true : isActive === "false" ? false : void 0
          });
          const filteredGoals = allGoals.filter((goal) => managerStoreIds.includes(goal.storeId));
          return res.json(filteredGoals);
        }
      }
      const goals = await storage.getCashierGoals({
        storeId: effectiveStoreId,
        cashierId,
        isActive: isActive === "true" ? true : isActive === "false" ? false : void 0
      });
      res.json(goals);
    } catch (error) {
      console.error("Error fetching cashier goals:", error);
      res.status(500).json({
        error: "Erro ao buscar metas de caixa",
        message: error.message
      });
    }
  });
  app2.post("/api/cashier-goals", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador" && user.role !== "gerente") {
        return res.status(403).json({ error: "Sem permiss\xE3o para criar metas de caixa" });
      }
      const validatedData = insertCashierGoalSchema.parse({
        ...req.body,
        createdById: userId
      });
      const newGoal = await storage.createCashierGoal(validatedData);
      res.json(newGoal);
    } catch (error) {
      console.error("Error creating cashier goal:", error);
      res.status(400).json({
        error: "Erro ao criar meta de caixa",
        message: error.message
      });
    }
  });
  app2.patch("/api/cashier-goals/:id", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador" && user.role !== "gerente") {
        return res.status(403).json({ error: "Sem permiss\xE3o para atualizar metas de caixa" });
      }
      const { id } = req.params;
      const updatedGoal = await storage.updateCashierGoal(id, req.body);
      res.json(updatedGoal);
    } catch (error) {
      console.error("Error updating cashier goal:", error);
      res.status(400).json({
        error: "Erro ao atualizar meta de caixa",
        message: error.message
      });
    }
  });
  app2.delete("/api/cashier-goals/:id", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador" && user.role !== "gerente") {
        return res.status(403).json({ error: "Sem permiss\xE3o para deletar metas de caixa" });
      }
      const { id } = req.params;
      await storage.deleteCashierGoal(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting cashier goal:", error);
      res.status(500).json({
        error: "Erro ao deletar meta de caixa",
        message: error.message
      });
    }
  });
  app2.get("/api/cashier-goals/progress", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const { goalId, storeId, weekStart, weekEnd } = req.query;
      const goals = await storage.getCashierGoals({
        id: goalId,
        storeId,
        isActive: true
      });
      if (goals.length === 0) {
        return res.json([]);
      }
      const results = [];
      for (const goal of goals) {
        const storeSales = await storage.getSales({
          storeId: goal.storeId,
          startDate: goal.weekStart,
          endDate: goal.weekEnd
        });
        const totalStoreSales = storeSales.reduce((sum, sale) => sum + parseFloat(sale.totalValue), 0);
        const paymentMethods = goal.paymentMethods || [];
        const receiptTotals = await storage.getReceiptsByPaymentMethod(
          goal.storeId,
          goal.weekStart,
          goal.weekEnd,
          paymentMethods
        );
        let targetMethodSales = 0;
        for (const receipt of receiptTotals) {
          targetMethodSales += receipt.totalGross;
        }
        const percentageAchieved = totalStoreSales > 0 ? targetMethodSales / totalStoreSales * 100 : 0;
        const targetPercentage = parseFloat(goal.targetPercentage);
        const isGoalMet = percentageAchieved >= targetPercentage;
        const bonusPercentage = isGoalMet ? parseFloat(goal.bonusPercentageAchieved) : parseFloat(goal.bonusPercentageNotAchieved);
        const bonusValue = bonusPercentage / 100 * targetMethodSales;
        const roundedBonus = (() => {
          const factor = 100;
          const shifted = bonusValue * factor;
          const floored = Math.floor(shifted);
          const decimal2 = shifted - floored;
          if (decimal2 > 0.5) {
            return (floored + 1) / factor;
          }
          return floored / factor;
        })();
        results.push({
          goalId: goal.id,
          cashierId: goal.cashierId,
          storeId: goal.storeId,
          periodType: goal.periodType,
          weekStart: goal.weekStart,
          weekEnd: goal.weekEnd,
          paymentMethods: goal.paymentMethods,
          targetPercentage,
          percentageAchieved: Math.round(percentageAchieved * 100) / 100,
          isGoalMet,
          totalStoreSales,
          targetMethodSales,
          bonusPercentage,
          bonusValue: roundedBonus
        });
      }
      res.json(results);
    } catch (error) {
      console.error("Error calculating cashier goal progress:", error);
      res.status(500).json({
        error: "Erro ao calcular progresso da meta de caixa",
        message: error.message
      });
    }
  });
  app2.get("/api/bonus/summary", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador" && user.role !== "gerente") {
        return res.status(403).json({ error: "Sem permiss\xE3o" });
      }
      const { periodType, storeId } = req.query;
      const now = /* @__PURE__ */ new Date();
      const saoPauloOffset = -3 * 60;
      const localNow = new Date(now.getTime() + (saoPauloOffset + now.getTimezoneOffset()) * 6e4);
      const getWeekStart = (date2) => {
        const d = new Date(date2);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
      };
      const getWeekEnd = (date2) => {
        const start = getWeekStart(date2);
        return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1e3);
      };
      const getMonthStart = (date2) => new Date(date2.getFullYear(), date2.getMonth(), 1);
      const getMonthEnd = (date2) => new Date(date2.getFullYear(), date2.getMonth() + 1, 0);
      const formatDate = (d) => d.toISOString().split("T")[0];
      const weekStart = formatDate(getWeekStart(localNow));
      const weekEnd = formatDate(getWeekEnd(localNow));
      const monthStart = formatDate(getMonthStart(localNow));
      const monthEnd = formatDate(getMonthEnd(localNow));
      const customRound = (value) => {
        const factor = 100;
        const shifted = value * factor;
        const floored = Math.floor(shifted);
        const decimal2 = shifted - floored;
        if (decimal2 > 0.5) {
          return (floored + 1) / factor;
        }
        return floored / factor;
      };
      const allGoals = await storage.getSalesGoals({ isActive: true });
      const allUsers = await storage.getAllUsers();
      const activeUsers = allUsers.filter((u) => u.isActive);
      const calculateUserBonus = async (goal, periodStart, periodEnd) => {
        console.log("[BonusSummary] calculateUserBonus called:", { goalId: goal.id, sellerId: goal.sellerId });
        if (!goal.sellerId) {
          console.log("[BonusSummary] No sellerId, returning 0");
          return 0;
        }
        const seller = activeUsers.find((u) => u.id === goal.sellerId);
        if (!seller) {
          console.log("[BonusSummary] Seller not found for id:", goal.sellerId);
          return 0;
        }
        console.log("[BonusSummary] Fetching sales:", { storeId: goal.storeId, sellerName: seller.fullName, startDate: goal.weekStart, endDate: goal.weekEnd });
        const sales2 = await storage.getSales({
          storeId: goal.storeId,
          sellerName: seller.fullName,
          startDate: goal.weekStart,
          endDate: goal.weekEnd
        });
        console.log("[BonusSummary] Sales found:", sales2.length);
        const totalSales = sales2.reduce((sum, s) => sum + parseFloat(s.totalValue), 0);
        const targetValue = parseFloat(goal.targetValue);
        const percentage = targetValue > 0 ? totalSales / targetValue * 100 : 0;
        const isGoalMet = percentage >= 100;
        const bonusPercentageAchieved = parseFloat(seller.bonusPercentageAchieved || "0");
        const bonusPercentageNotAchieved = parseFloat(seller.bonusPercentageNotAchieved || "0");
        const bonusPercentage = isGoalMet ? bonusPercentageAchieved : bonusPercentageNotAchieved;
        console.log("[BonusSummary] Bonus calc:", { totalSales, targetValue, percentage, isGoalMet, bonusPercentage });
        if (seller.role === "vendedor" || seller.role === "caixa") {
          return customRound(bonusPercentage / 100 * totalSales);
        }
        if (seller.role === "gerente") {
          let managerBonus = customRound(bonusPercentage / 100 * totalSales);
          const teamGoals = allGoals.filter(
            (g) => g.storeId === goal.storeId && g.sellerId !== seller.id && g.type === "individual" && g.weekStart === goal.weekStart && g.weekEnd === goal.weekEnd
          );
          for (const teamGoal of teamGoals) {
            const teamMember = activeUsers.find((u) => u.id === teamGoal.sellerId);
            if (!teamMember || teamMember.role !== "vendedor") continue;
            const teamSales = await storage.getSales({
              storeId: teamGoal.storeId,
              sellerName: teamMember.fullName,
              startDate: teamGoal.weekStart,
              endDate: teamGoal.weekEnd
            });
            const teamTotalSales = teamSales.reduce((sum, s) => sum + parseFloat(s.totalValue), 0);
            const teamTarget = parseFloat(teamGoal.targetValue);
            const teamPercentage = teamTarget > 0 ? teamTotalSales / teamTarget * 100 : 0;
            if (teamPercentage >= 100) {
              managerBonus += customRound(bonusPercentage / 100 * teamTotalSales);
            }
          }
          return managerBonus;
        }
        return 0;
      };
      console.log("[BonusSummary] Current periods:", { weekStart, weekEnd, monthStart, monthEnd });
      console.log("[BonusSummary] All goals count:", allGoals.length);
      console.log("[BonusSummary] Goals sample:", allGoals.slice(0, 3).map((g) => ({
        id: g.id,
        period: g.period,
        weekStart: g.weekStart,
        weekEnd: g.weekEnd,
        sellerId: g.sellerId,
        type: g.type
      })));
      const isAllStores = !storeId || storeId === "all" || storeId === "todas";
      console.log("[BonusSummary] storeId filter:", { storeId, isAllStores });
      const weeklyGoals = allGoals.filter((g) => {
        if (g.period !== "weekly") return false;
        if (!isAllStores && g.storeId !== storeId) return false;
        const goalStart = g.weekStart;
        const goalEnd = g.weekEnd;
        return goalStart <= weekEnd && goalEnd >= weekStart;
      });
      const monthlyGoals = allGoals.filter((g) => {
        if (g.period !== "monthly") return false;
        if (!isAllStores && g.storeId !== storeId) return false;
        const goalStart = g.weekStart;
        const goalEnd = g.weekEnd;
        return goalStart <= monthEnd && goalEnd >= monthStart;
      });
      console.log("[BonusSummary] Filtered weekly goals:", weeklyGoals.length);
      console.log("[BonusSummary] Filtered monthly goals:", monthlyGoals.length);
      let weeklyVendorBonus = 0;
      let weeklyManagerBonus = 0;
      console.log("[BonusSummary] Processing weekly goals...");
      for (const goal of weeklyGoals) {
        console.log("[BonusSummary] Weekly goal:", {
          id: goal.id,
          sellerId: goal.sellerId,
          type: goal.type,
          weekStart: goal.weekStart,
          weekEnd: goal.weekEnd
        });
        if (goal.sellerId) {
          const seller = activeUsers.find((u) => u.id === goal.sellerId);
          console.log("[BonusSummary] Found seller:", seller ? { id: seller.id, name: seller.fullName, role: seller.role } : null);
          if (seller) {
            const bonus = await calculateUserBonus(goal, weekStart, weekEnd);
            console.log("[BonusSummary] Calculated bonus:", { sellerId: goal.sellerId, bonus });
            if (seller.role === "vendedor") {
              weeklyVendorBonus += bonus;
            } else if (seller.role === "gerente") {
              weeklyManagerBonus += bonus;
            }
          }
        }
      }
      console.log("[BonusSummary] Weekly totals:", { weeklyVendorBonus, weeklyManagerBonus });
      let monthlyVendorBonus = 0;
      let monthlyManagerBonus = 0;
      for (const goal of monthlyGoals) {
        if (goal.sellerId) {
          const seller = activeUsers.find((u) => u.id === goal.sellerId);
          if (seller) {
            const bonus = await calculateUserBonus(goal, monthStart, monthEnd);
            if (seller.role === "vendedor") {
              monthlyVendorBonus += bonus;
            } else if (seller.role === "gerente") {
              monthlyManagerBonus += bonus;
            }
          }
        }
      }
      const cashierGoals2 = await storage.getCashierGoals({ isActive: true });
      const weeklyCashierGoals = cashierGoals2.filter((g) => {
        if (g.periodType !== "weekly") return false;
        if (!isAllStores && g.storeId !== storeId) return false;
        const goalStart = g.weekStart;
        const goalEnd = g.weekEnd;
        return goalStart <= weekEnd && goalEnd >= weekStart;
      });
      const monthlyCashierGoals = cashierGoals2.filter((g) => {
        if (g.periodType !== "monthly") return false;
        if (!isAllStores && g.storeId !== storeId) return false;
        const goalStart = g.weekStart;
        const goalEnd = g.weekEnd;
        return goalStart <= monthEnd && goalEnd >= monthStart;
      });
      let weeklyCashierBonus = 0;
      for (const goal of weeklyCashierGoals) {
        const storeSales = await storage.getSales({
          storeId: goal.storeId,
          startDate: goal.weekStart,
          endDate: goal.weekEnd
        });
        const totalStoreSales = storeSales.reduce((sum, s) => sum + parseFloat(s.totalValue), 0);
        const paymentMethods = goal.paymentMethods || [];
        let targetMethodSales = 0;
        for (const sale of storeSales) {
          const paymentMethod = (sale.paymentMethod || "").toLowerCase().trim();
          for (const method of paymentMethods) {
            const targetMethod = method.toLowerCase().trim();
            if (paymentMethod.includes(targetMethod) || targetMethod === "pix" && paymentMethod.includes("pix") || targetMethod === "debito" && (paymentMethod.includes("debito") || paymentMethod.includes("d\xE9bito")) || targetMethod === "dinheiro" && paymentMethod.includes("dinheiro")) {
              targetMethodSales += parseFloat(sale.totalValue);
              break;
            }
          }
        }
        const percentageAchieved = totalStoreSales > 0 ? targetMethodSales / totalStoreSales * 100 : 0;
        const targetPercentage = parseFloat(goal.targetPercentage);
        const isGoalMet = percentageAchieved >= targetPercentage;
        const bonusPercentage = isGoalMet ? parseFloat(goal.bonusPercentageAchieved) : parseFloat(goal.bonusPercentageNotAchieved);
        weeklyCashierBonus += customRound(bonusPercentage / 100 * targetMethodSales);
      }
      let monthlyCashierBonus = 0;
      for (const goal of monthlyCashierGoals) {
        const storeSales = await storage.getSales({
          storeId: goal.storeId,
          startDate: goal.weekStart,
          endDate: goal.weekEnd
        });
        const totalStoreSales = storeSales.reduce((sum, s) => sum + parseFloat(s.totalValue), 0);
        const paymentMethods = goal.paymentMethods || [];
        let targetMethodSales = 0;
        for (const sale of storeSales) {
          const paymentMethod = (sale.paymentMethod || "").toLowerCase().trim();
          for (const method of paymentMethods) {
            const targetMethod = method.toLowerCase().trim();
            if (paymentMethod.includes(targetMethod) || targetMethod === "pix" && paymentMethod.includes("pix") || targetMethod === "debito" && (paymentMethod.includes("debito") || paymentMethod.includes("d\xE9bito")) || targetMethod === "dinheiro" && paymentMethod.includes("dinheiro")) {
              targetMethodSales += parseFloat(sale.totalValue);
              break;
            }
          }
        }
        const percentageAchieved = totalStoreSales > 0 ? targetMethodSales / totalStoreSales * 100 : 0;
        const targetPercentage = parseFloat(goal.targetPercentage);
        const isGoalMet = percentageAchieved >= targetPercentage;
        const bonusPercentage = isGoalMet ? parseFloat(goal.bonusPercentageAchieved) : parseFloat(goal.bonusPercentageNotAchieved);
        monthlyCashierBonus += customRound(bonusPercentage / 100 * targetMethodSales);
      }
      res.json({
        weekly: {
          vendorBonus: customRound(weeklyVendorBonus),
          managerBonus: customRound(weeklyManagerBonus),
          cashierBonus: customRound(weeklyCashierBonus),
          total: customRound(weeklyVendorBonus + weeklyManagerBonus + weeklyCashierBonus),
          period: { start: weekStart, end: weekEnd }
        },
        monthly: {
          vendorBonus: customRound(monthlyVendorBonus),
          managerBonus: customRound(monthlyManagerBonus),
          cashierBonus: customRound(monthlyCashierBonus),
          total: customRound(monthlyVendorBonus + monthlyManagerBonus + monthlyCashierBonus),
          period: { start: monthStart, end: monthEnd }
        }
      });
    } catch (error) {
      console.error("Error calculating bonus summary:", error);
      res.status(500).json({
        error: "Erro ao calcular resumo de b\xF4nus",
        message: error.message
      });
    }
  });
  app2.get("/api/bonus/payment-summary", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador" && user.role !== "financeiro") {
        return res.status(403).json({ error: "Sem permiss\xE3o - apenas administrador e financeiro" });
      }
      const { storeId } = req.query;
      const now = /* @__PURE__ */ new Date();
      const saoPauloOffset = -3 * 60;
      const localNow = new Date(now.getTime() + (saoPauloOffset + now.getTimezoneOffset()) * 6e4);
      const getWeekStartSunday = (date2) => {
        const d = new Date(date2);
        const day = d.getDay();
        d.setDate(d.getDate() - day);
        return d;
      };
      const getPreviousWeekStart = (date2) => {
        const currentWeekStart = getWeekStartSunday(date2);
        return new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1e3);
      };
      const getPreviousWeekEnd = (date2) => {
        const prevWeekStart2 = getPreviousWeekStart(date2);
        return new Date(prevWeekStart2.getTime() + 6 * 24 * 60 * 60 * 1e3);
      };
      const getCurrentMonday = (date2) => {
        const d = new Date(date2);
        const day = d.getDay();
        const diff = day === 0 ? 1 : (1 - day + 7) % 7 || 7;
        if (day === 0) {
          d.setDate(d.getDate() + 1);
        } else if (day === 1) {
        } else {
          d.setDate(d.getDate() - (day - 1));
        }
        return d;
      };
      const formatDate = (d) => d.toISOString().split("T")[0];
      const prevWeekStart = formatDate(getPreviousWeekStart(localNow));
      const prevWeekEnd = formatDate(getPreviousWeekEnd(localNow));
      const customRound = (value) => {
        const factor = 100;
        const shifted = value * factor;
        const floored = Math.floor(shifted);
        const decimal2 = shifted - floored;
        if (decimal2 > 0.5) {
          return (floored + 1) / factor;
        }
        return floored / factor;
      };
      const allGoals = await storage.getSalesGoals({ isActive: true });
      const allUsers = await storage.getAllUsers();
      const activeUsers = allUsers.filter((u) => u.isActive);
      const isAllStores = !storeId || storeId === "all" || storeId === "todas";
      const weeklyGoals = allGoals.filter((g) => {
        if (g.period !== "weekly") return false;
        if (!isAllStores && g.storeId !== storeId) return false;
        return g.weekStart === prevWeekStart && g.weekEnd === prevWeekEnd;
      });
      const storeNames = {
        "saron1": "Saron 1",
        "saron2": "Saron 2",
        "saron3": "Saron 3"
      };
      const bonusDetails = [];
      const individualGoals = weeklyGoals.filter((g) => g.type === "individual" && g.sellerId);
      const teamGoals = weeklyGoals.filter((g) => g.type === "team" && !g.sellerId);
      const vendorsMeetingGoals = /* @__PURE__ */ new Map();
      for (const goal of individualGoals) {
        const seller = activeUsers.find((u) => u.id === goal.sellerId);
        if (!seller) continue;
        const sales2 = await storage.getSales({
          storeId: goal.storeId,
          sellerName: seller.fullName,
          startDate: goal.weekStart,
          endDate: goal.weekEnd
        });
        const totalSales = sales2.reduce((sum, s) => sum + parseFloat(s.totalValue), 0);
        const targetValue = parseFloat(goal.targetValue);
        const percentage = targetValue > 0 ? totalSales / targetValue * 100 : 0;
        const isGoalMet = percentage >= 100;
        const bonusPercentageAchieved = parseFloat(seller.bonusPercentageAchieved || "0");
        const bonusPercentageNotAchieved = parseFloat(seller.bonusPercentageNotAchieved || "0");
        const bonusPercentage = isGoalMet ? bonusPercentageAchieved : bonusPercentageNotAchieved;
        let bonusValue = 0;
        let managerTeamBonus = 0;
        if (seller.role === "vendedor") {
          bonusValue = customRound(bonusPercentage / 100 * totalSales);
          if (isGoalMet) {
            vendorsMeetingGoals.set(seller.id, { sellerId: seller.id, sales: totalSales, storeId: goal.storeId });
          }
        } else if (seller.role === "gerente") {
          bonusValue = customRound(bonusPercentage / 100 * totalSales);
        }
        bonusDetails.push({
          id: seller.id,
          name: seller.fullName,
          role: seller.role,
          storeId: goal.storeId,
          storeName: storeNames[goal.storeId] || goal.storeId,
          targetValue,
          actualSales: customRound(totalSales),
          percentage: customRound(percentage),
          isGoalMet,
          bonusPercentage,
          bonusValue,
          goalType: goal.type,
          managerTeamBonus: 0
        });
      }
      for (const detail of bonusDetails) {
        if (detail.role === "gerente") {
          let teamBonusValue = 0;
          const vendorEntries = Array.from(vendorsMeetingGoals.entries());
          for (const [vendorId, vendorData] of vendorEntries) {
            if (vendorData.storeId === detail.storeId) {
              teamBonusValue += customRound(0.2 / 100 * vendorData.sales);
            }
          }
          detail.managerTeamBonus = teamBonusValue;
          detail.bonusValue = customRound(detail.bonusValue + teamBonusValue);
        }
      }
      for (const teamGoal of teamGoals) {
        const storeSales = await storage.getSales({
          storeId: teamGoal.storeId,
          startDate: teamGoal.weekStart,
          endDate: teamGoal.weekEnd
        });
        const totalStoreSales = storeSales.reduce((sum, s) => sum + parseFloat(s.totalValue), 0);
        const targetValue = parseFloat(teamGoal.targetValue);
        const percentage = targetValue > 0 ? totalStoreSales / targetValue * 100 : 0;
        const isGoalMet = percentage >= 100;
        const storeUsers = activeUsers.filter(
          (u) => u.storeId === teamGoal.storeId && (u.role === "vendedor" || u.role === "gerente")
        );
        for (const storeUser of storeUsers) {
          const hasIndividualGoal = bonusDetails.some(
            (d) => d.id === storeUser.id && d.storeId === teamGoal.storeId
          );
          if (hasIndividualGoal) continue;
          const bonusPercentageAchieved = parseFloat(storeUser.bonusPercentageAchieved || "0");
          const bonusPercentageNotAchieved = parseFloat(storeUser.bonusPercentageNotAchieved || "0");
          const bonusPercentage = isGoalMet ? bonusPercentageAchieved : bonusPercentageNotAchieved;
          const bonusValue = customRound(bonusPercentage / 100 * totalStoreSales);
          bonusDetails.push({
            id: storeUser.id,
            name: storeUser.fullName,
            role: storeUser.role,
            storeId: teamGoal.storeId,
            storeName: storeNames[teamGoal.storeId] || teamGoal.storeId,
            targetValue,
            actualSales: customRound(totalStoreSales),
            percentage: customRound(percentage),
            isGoalMet,
            bonusPercentage,
            bonusValue,
            goalType: "team",
            managerTeamBonus: 0
          });
        }
      }
      const cashierGoals2 = await storage.getCashierGoals({ isActive: true });
      const weeklyCashierGoals = cashierGoals2.filter((g) => {
        if (g.periodType !== "weekly") return false;
        if (!isAllStores && g.storeId !== storeId) return false;
        return g.weekStart === prevWeekStart && g.weekEnd === prevWeekEnd;
      });
      const cashierBonusDetails = [];
      for (const goal of weeklyCashierGoals) {
        const cashier = activeUsers.find((u) => u.id === goal.cashierId);
        if (!cashier) continue;
        const storeSales = await storage.getSales({
          storeId: goal.storeId,
          startDate: goal.weekStart,
          endDate: goal.weekEnd
        });
        const totalStoreSales = storeSales.reduce((sum, s) => sum + parseFloat(s.totalValue), 0);
        const paymentMethods = goal.paymentMethods || [];
        const receiptTotals = await storage.getReceiptsByPaymentMethod(
          goal.storeId,
          goal.weekStart,
          goal.weekEnd,
          paymentMethods
        );
        let targetMethodSales = 0;
        for (const receipt of receiptTotals) {
          targetMethodSales += receipt.totalGross;
        }
        const percentageAchieved = totalStoreSales > 0 ? targetMethodSales / totalStoreSales * 100 : 0;
        const targetPercentage = parseFloat(goal.targetPercentage);
        const isGoalMet = percentageAchieved >= targetPercentage;
        const bonusPercentage = isGoalMet ? parseFloat(goal.bonusPercentageAchieved) : parseFloat(goal.bonusPercentageNotAchieved);
        const bonusValue = customRound(bonusPercentage / 100 * targetMethodSales);
        cashierBonusDetails.push({
          id: cashier.id,
          name: cashier.fullName,
          role: "caixa",
          storeId: goal.storeId,
          storeName: storeNames[goal.storeId] || goal.storeId,
          paymentMethods,
          targetPercentage,
          actualPercentage: customRound(percentageAchieved),
          isGoalMet,
          totalStoreSales: customRound(totalStoreSales),
          targetMethodSales: customRound(targetMethodSales),
          bonusPercentage,
          bonusValue
        });
      }
      const vendorTotal = bonusDetails.filter((b) => b.role === "vendedor").reduce((sum, b) => sum + b.bonusValue, 0);
      const managerTotal = bonusDetails.filter((b) => b.role === "gerente").reduce((sum, b) => sum + b.bonusValue, 0);
      const cashierTotal = cashierBonusDetails.reduce((sum, b) => sum + b.bonusValue, 0);
      const grandTotal = vendorTotal + managerTotal + cashierTotal;
      const storeIds = ["saron1", "saron2", "saron3"];
      const byStore = storeIds.map((sid) => {
        const storeBonuses = bonusDetails.filter((b) => b.storeId === sid);
        const storeCashierBonuses = cashierBonusDetails.filter((b) => b.storeId === sid);
        return {
          storeId: sid,
          storeName: storeNames[sid],
          vendorTotal: customRound(storeBonuses.filter((b) => b.role === "vendedor").reduce((sum, b) => sum + b.bonusValue, 0)),
          managerTotal: customRound(storeBonuses.filter((b) => b.role === "gerente").reduce((sum, b) => sum + b.bonusValue, 0)),
          cashierTotal: customRound(storeCashierBonuses.reduce((sum, b) => sum + b.bonusValue, 0)),
          total: customRound(
            storeBonuses.reduce((sum, b) => sum + b.bonusValue, 0) + storeCashierBonuses.reduce((sum, b) => sum + b.bonusValue, 0)
          )
        };
      });
      res.json({
        period: {
          start: prevWeekStart,
          end: prevWeekEnd,
          paymentDate: formatDate(getCurrentMonday(localNow))
          // This Monday
        },
        salesGoals: bonusDetails,
        cashierGoals: cashierBonusDetails,
        totals: {
          vendorTotal: customRound(vendorTotal),
          managerTotal: customRound(managerTotal),
          cashierTotal: customRound(cashierTotal),
          grandTotal: customRound(grandTotal)
        },
        byStore
      });
    } catch (error) {
      console.error("Error calculating payment summary:", error);
      res.status(500).json({
        error: "Erro ao calcular resumo de pagamento",
        message: error.message
      });
    }
  });
  app2.get("/api/financial/daily-revenue", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador" && user.role !== "financeiro") {
        return res.status(403).json({ error: "Sem permiss\xE3o - apenas administrador e financeiro" });
      }
      const { storeId, month, year, compareYears } = req.query;
      const now = /* @__PURE__ */ new Date();
      const currentMonth = month ? parseInt(month) : now.getMonth() + 1;
      const currentYear = year ? parseInt(year) : now.getFullYear();
      let yearsToCompare = [];
      if (compareYears) {
        if (typeof compareYears === "string") {
          yearsToCompare = compareYears.split(",").map((y) => parseInt(y.trim())).filter((y) => !isNaN(y));
        }
      }
      const results = await storage.getDailyRevenueComparison({
        storeId: storeId || "todas",
        month: currentMonth,
        year: currentYear,
        compareYears: yearsToCompare
      });
      const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Mar\xE7o",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
      ];
      res.json({
        period: {
          month: currentMonth,
          monthName: monthNames[currentMonth - 1],
          year: currentYear,
          compareYears: yearsToCompare
        },
        storeId: storeId || "todas",
        series: results
      });
    } catch (error) {
      console.error("Error fetching daily revenue:", error);
      res.status(500).json({
        error: "Erro ao buscar receita di\xE1ria",
        message: error.message
      });
    }
  });
  app2.get("/api/dapic/stores", async (req, res) => {
    try {
      const stores = dapicService.getAvailableStores();
      res.json(stores);
    } catch (error) {
      console.error("Error fetching available stores:", error);
      res.status(500).json({
        error: "Failed to fetch available stores",
        message: error.message
      });
    }
  });
  app2.get("/api/dapic/:storeId/clientes", async (req, res) => {
    try {
      const { storeId } = req.params;
      const { DataInicial, DataFinal, Pagina, RegistrosPorPagina } = req.query;
      const today = /* @__PURE__ */ new Date();
      const formatDate = (date2) => date2.toISOString().split("T")[0];
      const result = await dapicService.getClientes(storeId, {
        DataInicial: DataInicial || "2020-01-01",
        DataFinal: DataFinal || formatDate(today),
        Pagina: Pagina ? parseInt(Pagina) : void 0,
        RegistrosPorPagina: RegistrosPorPagina ? parseInt(RegistrosPorPagina) : void 0
      });
      if (storeId === "todas") {
        res.json({
          stores: result.data,
          errors: result.errors
        });
      } else {
        res.json(result);
      }
    } catch (error) {
      console.error("Error fetching clients from Dapic:", error);
      res.status(500).json({
        error: "Failed to fetch clients from Dapic",
        message: error.message
      });
    }
  });
  app2.get("/api/dapic/:storeId/clientes/:id", async (req, res) => {
    try {
      const { storeId, id } = req.params;
      const cliente = await dapicService.getCliente(storeId, parseInt(id));
      res.json(cliente);
    } catch (error) {
      console.error("Error fetching client from Dapic:", error);
      res.status(500).json({
        error: "Failed to fetch client from Dapic",
        message: error.message
      });
    }
  });
  app2.get("/api/dapic/:storeId/orcamentos", async (req, res) => {
    try {
      const { storeId } = req.params;
      const { DataInicial, DataFinal, Pagina, RegistrosPorPagina } = req.query;
      const today = /* @__PURE__ */ new Date();
      const formatDate = (date2) => date2.toISOString().split("T")[0];
      const result = await dapicService.getOrcamentos(storeId, {
        DataInicial: DataInicial || "2020-01-01",
        DataFinal: DataFinal || formatDate(today),
        Pagina: Pagina ? parseInt(Pagina) : void 0,
        RegistrosPorPagina: RegistrosPorPagina ? parseInt(RegistrosPorPagina) : void 0
      });
      if (storeId === "todas") {
        res.json({
          stores: result.data,
          errors: result.errors
        });
      } else {
        res.json(result);
      }
    } catch (error) {
      console.error("Error fetching orders from Dapic:", error);
      res.status(500).json({
        error: "Failed to fetch orders from Dapic",
        message: error.message
      });
    }
  });
  app2.get("/api/dapic/:storeId/orcamentos/:id", async (req, res) => {
    try {
      const { storeId, id } = req.params;
      const orcamento = await dapicService.getOrcamento(storeId, parseInt(id));
      res.json(orcamento);
    } catch (error) {
      console.error("Error fetching order from Dapic:", error);
      res.status(500).json({
        error: "Failed to fetch order from Dapic",
        message: error.message
      });
    }
  });
  app2.get("/api/dapic/:storeId/vendaspdv", async (req, res) => {
    try {
      const { storeId } = req.params;
      const { DataInicial, DataFinal, FiltrarPor, Status, Pagina, RegistrosPorPagina } = req.query;
      const today = /* @__PURE__ */ new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      const formatDate = (date2) => date2.toISOString().split("T")[0];
      const validateISODate = (dateStr) => {
        if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dateStr)) {
          throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD.`);
        }
        return dateStr;
      };
      const dataInicial = DataInicial ? validateISODate(DataInicial) : formatDate(thirtyDaysAgo);
      const dataFinal = DataFinal ? validateISODate(DataFinal) : formatDate(today);
      const result = await dapicService.getVendasPDV(storeId, {
        DataInicial: dataInicial,
        DataFinal: dataFinal,
        FiltrarPor: FiltrarPor || "0",
        Status: Status || "1",
        Pagina: Pagina ? parseInt(Pagina) : 1,
        RegistrosPorPagina: RegistrosPorPagina ? parseInt(RegistrosPorPagina) : 200
      });
      if (storeId === "todas") {
        res.json({
          stores: result.data,
          errors: result.errors
        });
      } else {
        res.json(result);
      }
    } catch (error) {
      console.error("Error fetching PDV sales from Dapic:", error);
      res.status(500).json({
        error: "Failed to fetch PDV sales from Dapic",
        message: error.message
      });
    }
  });
  app2.get("/api/dapic/:storeId/produtos", async (req, res) => {
    try {
      const { storeId } = req.params;
      const { DataInicial, DataFinal, Pagina, RegistrosPorPagina } = req.query;
      const today = /* @__PURE__ */ new Date();
      const formatDate = (date2) => date2.toISOString().split("T")[0];
      const result = await dapicService.getProdutos(storeId, {
        DataInicial: DataInicial || "2020-01-01",
        DataFinal: DataFinal || formatDate(today),
        Pagina: Pagina ? parseInt(Pagina) : void 0,
        RegistrosPorPagina: RegistrosPorPagina ? parseInt(RegistrosPorPagina) : void 0
      });
      if (storeId === "todas") {
        res.json({
          stores: result.data,
          errors: result.errors
        });
      } else {
        res.json(result);
      }
    } catch (error) {
      console.error("Error fetching products from Dapic:", error);
      res.status(500).json({
        error: "Failed to fetch products from Dapic",
        message: error.message
      });
    }
  });
  app2.get("/api/dapic/:storeId/produtos/:id", async (req, res) => {
    try {
      const { storeId, id } = req.params;
      const produto = await dapicService.getProduto(storeId, parseInt(id));
      res.json(produto);
    } catch (error) {
      console.error("Error fetching product from Dapic:", error);
      res.status(500).json({
        error: "Failed to fetch product from Dapic",
        message: error.message
      });
    }
  });
  app2.get("/api/dapic/:storeId/contas-pagar", async (req, res) => {
    try {
      const { storeId } = req.params;
      const { DataInicial, DataFinal, Pagina, RegistrosPorPagina } = req.query;
      const today = /* @__PURE__ */ new Date();
      const formatDate = (date2) => date2.toISOString().split("T")[0];
      const result = await dapicService.getContasPagar(storeId, {
        DataInicial: DataInicial || "2020-01-01",
        DataFinal: DataFinal || formatDate(today),
        Pagina: Pagina ? parseInt(Pagina) : void 0,
        RegistrosPorPagina: RegistrosPorPagina ? parseInt(RegistrosPorPagina) : void 0
      });
      if (storeId === "todas") {
        res.json({
          stores: result.data,
          errors: result.errors
        });
      } else {
        res.json(result);
      }
    } catch (error) {
      console.error("Error fetching bills from Dapic:", error);
      res.status(500).json({
        error: "Failed to fetch bills from Dapic",
        message: error.message
      });
    }
  });
  app2.get("/api/dapic/:storeId/contas-receber", async (req, res) => {
    try {
      const { storeId } = req.params;
      const { DataInicial, DataFinal, Pagina, RegistrosPorPagina } = req.query;
      const today = /* @__PURE__ */ new Date();
      const formatDate = (date2) => date2.toISOString().split("T")[0];
      const result = await dapicService.getContasReceber(storeId, {
        DataInicial: DataInicial || "2020-01-01",
        DataFinal: DataFinal || formatDate(today),
        Pagina: Pagina ? parseInt(Pagina) : void 0,
        RegistrosPorPagina: RegistrosPorPagina ? parseInt(RegistrosPorPagina) : void 0
      });
      if (storeId === "todas") {
        res.json({
          stores: result.data,
          errors: result.errors
        });
      } else {
        res.json(result);
      }
    } catch (error) {
      console.error("Error fetching receivables from Dapic:", error);
      res.status(500).json({
        error: "Failed to fetch receivables from Dapic",
        message: error.message
      });
    }
  });
  app2.post("/api/sales/sync", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador" && user.role !== "gerente") {
        return res.status(403).json({ error: "Sem permiss\xE3o para sincronizar vendas" });
      }
      const syncSchema = z2.object({
        storeId: z2.enum(["saron1", "saron2", "saron3", "todas"]).optional(),
        startDate: z2.string(),
        endDate: z2.string()
      });
      const { storeId, startDate, endDate } = syncSchema.parse(req.body);
      let results;
      if (storeId === "todas" || !storeId) {
        results = await salesSyncService.syncAllStores(startDate, endDate);
      } else {
        const result = await salesSyncService.syncStore(storeId, startDate, endDate);
        results = [result];
      }
      const allSuccess = results.every((r) => r.success);
      const totalSales = results.reduce((sum, r) => sum + r.salesCount, 0);
      res.json({
        success: allSuccess,
        results,
        totalSales,
        message: `Sincroniza\xE7\xE3o conclu\xEDda: ${totalSales} vendas processadas`
      });
    } catch (error) {
      console.error("Error syncing sales:", error);
      res.status(500).json({
        error: "Erro ao sincronizar vendas",
        message: error.message
      });
    }
  });
  app2.post("/api/sales/sync/2024-fix", async (req, res) => {
    try {
      console.log("[API] Iniciando sincroniza\xE7\xE3o ADITIVA de 2024...");
      const startDate = "2024-01-01";
      const endDate = "2024-12-31";
      res.json({
        message: "Sincroniza\xE7\xE3o ADITIVA de 2024 iniciada. N\xE3o perde dados existentes.",
        startDate,
        endDate
      });
      (async () => {
        const stores = ["saron1", "saron2", "saron3"];
        for (const store of stores) {
          console.log(`[2024-FIX-ADDITIVE] Sincronizando ${store}...`);
          try {
            const result = await salesSyncService.syncStoreAdditive(store, startDate, endDate);
            console.log(`[2024-FIX-ADDITIVE] ${store}: ${result.success ? "OK" : "ERRO"} - ${result.salesCount} novas vendas`);
          } catch (error) {
            console.error(`[2024-FIX-ADDITIVE] ${store}: ERRO - ${error.message}`);
          }
        }
        console.log("[2024-FIX-ADDITIVE] Sincroniza\xE7\xE3o de 2024 conclu\xEDda!");
      })();
    } catch (error) {
      console.error("Error syncing 2024:", error);
      res.status(500).json({
        error: "Erro ao iniciar sincroniza\xE7\xE3o de 2024",
        message: error.message
      });
    }
  });
  app2.post("/api/sales/sync/historical", async (req, res) => {
    try {
      const { year, secret } = req.body;
      const SYNC_SECRET = process.env.SYNC_SECRET || "saron-sync-2023-secure";
      if (secret !== SYNC_SECRET) {
        return res.status(401).json({ error: "Token inv\xE1lido" });
      }
      if (!year || year < 2020 || year > 2025) {
        return res.status(400).json({ error: "Ano inv\xE1lido (2020-2025)" });
      }
      console.log(`[API] Iniciando sincroniza\xE7\xE3o ADITIVA de ${year}...`);
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      res.json({
        message: `Sincroniza\xE7\xE3o ADITIVA de ${year} iniciada. N\xE3o perde dados existentes.`,
        startDate,
        endDate
      });
      (async () => {
        const stores = ["saron1", "saron2", "saron3"];
        for (const store of stores) {
          console.log(`[${year}-FIX-ADDITIVE] Sincronizando ${store}...`);
          try {
            const result = await salesSyncService.syncStoreAdditive(store, startDate, endDate);
            console.log(`[${year}-FIX-ADDITIVE] ${store}: ${result.success ? "OK" : "ERRO"} - ${result.salesCount} novas vendas`);
          } catch (error) {
            console.error(`[${year}-FIX-ADDITIVE] ${store}: ERRO - ${error.message}`);
          }
        }
        console.log(`[${year}-FIX-ADDITIVE] Sincroniza\xE7\xE3o de ${year} conclu\xEDda!`);
      })();
    } catch (error) {
      console.error("Error syncing historical data:", error);
      res.status(500).json({
        error: "Erro ao iniciar sincroniza\xE7\xE3o hist\xF3rica",
        message: error.message
      });
    }
  });
  app2.post("/api/sales/sync/today", async (req, res) => {
    try {
      const { secret } = req.body;
      const SYNC_SECRET = process.env.SYNC_SECRET || "saron-sync-2023-secure";
      if (secret !== SYNC_SECRET) {
        return res.status(401).json({ error: "Token inv\xE1lido" });
      }
      const now = /* @__PURE__ */ new Date();
      const spOffset = -3 * 60;
      const localOffset = now.getTimezoneOffset();
      const spTime = new Date(now.getTime() + (localOffset + spOffset) * 60 * 1e3);
      const today = spTime.toISOString().split("T")[0];
      console.log(`[SYNC-TODAY] Iniciando sincroniza\xE7\xE3o for\xE7ada de ${today}...`);
      const stores = ["saron1", "saron2", "saron3"];
      const results = [];
      for (const store of stores) {
        try {
          const result = await salesSyncService.syncStore(store, today, today);
          results.push({
            store,
            success: result.success,
            salesCount: result.salesCount,
            error: result.error
          });
          console.log(`[SYNC-TODAY] ${store}: ${result.success ? "OK" : "ERRO"} - ${result.salesCount} vendas`);
        } catch (error) {
          results.push({
            store,
            success: false,
            salesCount: 0,
            error: error.message
          });
          console.error(`[SYNC-TODAY] ${store}: ERRO - ${error.message}`);
        }
      }
      const totalSynced = results.reduce((sum, r) => sum + r.salesCount, 0);
      const allSuccess = results.every((r) => r.success);
      console.log(`[SYNC-TODAY] Conclu\xEDdo: ${totalSynced} vendas processadas`);
      res.json({
        success: allSuccess,
        date: today,
        totalSynced,
        results,
        message: `Sincroniza\xE7\xE3o de ${today} conclu\xEDda: ${totalSynced} vendas`
      });
    } catch (error) {
      console.error("Error syncing today:", error);
      res.status(500).json({
        error: "Erro ao sincronizar vendas de hoje",
        message: error.message
      });
    }
  });
  app2.post("/api/sales/sync/month", async (req, res) => {
    try {
      const { storeId, year, month } = req.body;
      if (!storeId || !year || !month) {
        return res.status(400).json({ error: "storeId, year e month s\xE3o obrigat\xF3rios" });
      }
      const validStores = ["saron1", "saron2", "saron3"];
      if (!validStores.includes(storeId)) {
        return res.status(400).json({ error: "storeId inv\xE1lido" });
      }
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2025) {
        return res.status(400).json({ error: "Ano inv\xE1lido" });
      }
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({ error: "M\xEAs inv\xE1lido (1-12)" });
      }
      const monthStr = String(monthNum).padStart(2, "0");
      const lastDay = new Date(yearNum, monthNum, 0).getDate();
      const startDate = `${yearNum}-${monthStr}-01`;
      const endDate = `${yearNum}-${monthStr}-${String(lastDay).padStart(2, "0")}`;
      console.log(`[MONTH-SYNC] Iniciando: ${storeId} ${monthStr}/${yearNum} (${startDate} a ${endDate})`);
      const result = await salesSyncService.syncStoreAdditive(storeId, startDate, endDate);
      console.log(`[MONTH-SYNC] Conclu\xEDdo: ${storeId} ${monthStr}/${yearNum} - ${result.salesCount} novas vendas`);
      res.json({
        success: result.success,
        storeId,
        month: monthNum,
        year: yearNum,
        startDate,
        endDate,
        newSalesCount: result.salesCount,
        error: result.error
      });
    } catch (error) {
      console.error("[MONTH-SYNC] Erro:", error);
      res.status(500).json({
        error: "Erro ao sincronizar m\xEAs",
        message: error.message
      });
    }
  });
  app2.post("/api/sales/sync/full", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador") {
        return res.status(403).json({ error: "Apenas administradores podem fazer sincroniza\xE7\xE3o completa" });
      }
      console.log("[API] Iniciando sincroniza\xE7\xE3o completa do hist\xF3rico...");
      const results = await salesSyncService.syncFullHistory();
      const allSuccess = results.every((r) => r.success);
      const totalSales = results.reduce((sum, r) => sum + r.salesCount, 0);
      res.json({
        success: allSuccess,
        results,
        totalSales,
        message: `Sincroniza\xE7\xE3o completa conclu\xEDda: ${totalSales} vendas desde janeiro/2024`
      });
    } catch (error) {
      console.error("Error syncing full history:", error);
      res.status(500).json({
        error: "Erro ao sincronizar hist\xF3rico completo",
        message: error.message
      });
    }
  });
  app2.get("/api/sales/sync/status", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const { storeId, startDate, endDate } = req.query;
      if (!storeId || !startDate || !endDate) {
        return res.status(400).json({ error: "storeId, startDate e endDate s\xE3o obrigat\xF3rios" });
      }
      const status = salesSyncService.getSyncStatus(
        storeId,
        startDate,
        endDate
      );
      res.json(status || { status: "not_started" });
    } catch (error) {
      console.error("Error getting sync status:", error);
      res.status(500).json({
        error: "Erro ao buscar status da sincroniza\xE7\xE3o",
        message: error.message
      });
    }
  });
  app2.get("/api/sales/sync/check", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador") {
        return res.status(403).json({ error: "Acesso restrito a administradores" });
      }
      const days = parseInt(req.query.days) || 10;
      const stores = ["saron1", "saron2", "saron3"];
      const dates = [];
      for (let i = 0; i < days; i++) {
        const date2 = /* @__PURE__ */ new Date();
        date2.setDate(date2.getDate() - i);
        const brazilOffset = -3 * 60;
        const utcOffset = date2.getTimezoneOffset();
        const brazilTime = new Date(date2.getTime() + (utcOffset + brazilOffset) * 60 * 1e3);
        dates.push(brazilTime.toISOString().split("T")[0]);
      }
      const discrepancies = [];
      for (const store of stores) {
        for (const date2 of dates) {
          try {
            const localSales = await storage.getSales({ storeId: store, startDate: date2, endDate: date2 });
            const localCount = localSales.length;
            const localTotal = localSales.reduce((sum, s) => sum + (Number(s.totalValue) || 0), 0);
            const dapicResponse = await dapicService.getVendasPDV(store, {
              DataInicial: date2,
              DataFinal: date2,
              Pagina: 1,
              RegistrosPorPagina: 1
            });
            const dapicCount = dapicResponse?.TotalRegistros || 0;
            const countDiff = dapicCount - localCount;
            if (countDiff !== 0) {
              discrepancies.push({
                date: date2,
                store,
                localCount,
                localTotal: Math.round(localTotal * 100) / 100,
                dapicCount,
                dapicTotal: 0,
                // Would require full fetch
                countDiff,
                totalDiff: 0
              });
            }
          } catch (error) {
            console.error(`Error checking ${store} for ${date2}:`, error.message);
          }
        }
      }
      discrepancies.sort((a, b) => {
        const dateDiff = b.date.localeCompare(a.date);
        if (dateDiff !== 0) return dateDiff;
        return Math.abs(b.countDiff) - Math.abs(a.countDiff);
      });
      res.json({
        daysChecked: days,
        totalDiscrepancies: discrepancies.length,
        discrepancies,
        checkedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Error checking sync discrepancies:", error);
      res.status(500).json({
        error: "Erro ao verificar discrep\xE2ncias",
        message: error.message
      });
    }
  });
  app2.post("/api/sales/sync/resync", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador") {
        return res.status(403).json({ error: "Acesso restrito a administradores" });
      }
      const { dates, stores } = req.body;
      if (!dates || !Array.isArray(dates) || dates.length === 0) {
        return res.status(400).json({ error: "dates \xE9 obrigat\xF3rio (array de datas)" });
      }
      const targetStores = stores && Array.isArray(stores) && stores.length > 0 ? stores : ["saron1", "saron2", "saron3"];
      const results = [];
      for (const date2 of dates) {
        for (const store of targetStores) {
          try {
            const result = await salesSyncService.syncStore(store, date2, date2);
            results.push({
              date: date2,
              store,
              success: result.success,
              salesCount: result.salesCount,
              error: result.error
            });
          } catch (error) {
            results.push({
              date: date2,
              store,
              success: false,
              salesCount: 0,
              error: error.message
            });
          }
        }
      }
      const totalSynced = results.reduce((sum, r) => sum + r.salesCount, 0);
      const allSuccess = results.every((r) => r.success);
      res.json({
        success: allSuccess,
        totalSynced,
        results,
        message: `Resincroniza\xE7\xE3o conclu\xEDda: ${totalSynced} vendas processadas`
      });
    } catch (error) {
      console.error("Error resyncing:", error);
      res.status(500).json({
        error: "Erro ao resincronizar",
        message: error.message
      });
    }
  });
  app2.get("/api/debug/dapic-sale-structure", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user || user.role !== "administrador") {
        return res.status(403).json({ error: "Acesso restrito a administradores" });
      }
      const { storeId, date: date2 } = req.query;
      const targetStoreId = storeId || "saron1";
      const targetDate = date2 || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const response = await dapicService.getVendasPDV(targetStoreId, {
        DataInicial: targetDate,
        DataFinal: targetDate,
        Pagina: 1,
        RegistrosPorPagina: 5
      });
      const salesData = response?.Dados || [];
      res.json({
        message: `Estrutura de ${salesData.length} vendas do Dapic`,
        sampleSales: salesData.slice(0, 3).map((sale) => ({
          allKeys: Object.keys(sale),
          sampleData: sale
        }))
      });
    } catch (error) {
      console.error("Error debugging Dapic structure:", error);
      res.status(500).json({
        error: "Erro ao buscar estrutura do Dapic",
        message: error.message
      });
    }
  });
  app2.get("/api/sales", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const { storeId, sellerName, startDate, endDate } = req.query;
      const sales2 = await storage.getSales({
        storeId,
        sellerName,
        startDate,
        endDate
      });
      res.json(sales2);
    } catch (error) {
      console.error("Error fetching sales:", error);
      res.status(500).json({
        error: "Erro ao buscar vendas",
        message: error.message
      });
    }
  });
  app2.get("/api/sales/summary", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrado" });
      }
      const { storeId } = req.query;
      const getBrazilDate2 = () => {
        const now2 = /* @__PURE__ */ new Date();
        const brazilOffset = -3 * 60;
        const utcOffset = now2.getTimezoneOffset();
        return new Date(now2.getTime() + (utcOffset + brazilOffset) * 60 * 1e3);
      };
      const now = getBrazilDate2();
      const todayStr = now.toISOString().split("T")[0];
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekStartStr = weekStart.toISOString().split("T")[0];
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const weekEndStr = weekEnd.toISOString().split("T")[0];
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthStartStr = monthStart.toISOString().split("T")[0];
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const monthEndStr = monthEnd.toISOString().split("T")[0];
      const isSaron2Seller = user.role === "vendedor" && user.storeId === "saron2";
      const sellerFilter = user.role === "vendedor" && !isSaron2Seller ? user.fullName : void 0;
      const storeFilter = storeId && storeId !== "todas" && storeId !== "" ? storeId : void 0;
      console.log("[SalesSummary] Filters:", {
        storeId,
        storeFilter,
        sellerFilter,
        todayStr,
        weekStartStr,
        weekEndStr,
        userRole: user.role,
        isSaron2Seller
      });
      const [todaySales, weekSales, monthSales] = await Promise.all([
        storage.getSales({
          storeId: storeFilter,
          sellerName: sellerFilter,
          startDate: todayStr,
          endDate: todayStr
        }),
        storage.getSales({
          storeId: storeFilter,
          sellerName: sellerFilter,
          startDate: weekStartStr,
          endDate: weekEndStr
        }),
        storage.getSales({
          storeId: storeFilter,
          sellerName: sellerFilter,
          startDate: monthStartStr,
          endDate: monthEndStr
        })
      ]);
      const sumSales = (salesList) => salesList.reduce((sum, sale) => {
        const value = parseFloat(sale.totalValue);
        return sum + (isNaN(value) ? 0 : value);
      }, 0);
      res.json({
        today: sumSales(todaySales),
        week: sumSales(weekSales),
        month: sumSales(monthSales),
        todayCount: todaySales.length,
        weekCount: weekSales.length,
        monthCount: monthSales.length,
        periods: {
          today: todayStr,
          weekStart: weekStartStr,
          weekEnd: weekEndStr,
          monthStart: monthStartStr,
          monthEnd: monthEndStr
        }
      });
    } catch (error) {
      console.error("Error fetching sales summary:", error);
      res.status(500).json({
        error: "Erro ao buscar resumo de vendas",
        message: error.message
      });
    }
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/cronJobs.ts
import cron from "node-cron";
var cronInitialized = false;
function getBrazilDate() {
  const now = /* @__PURE__ */ new Date();
  const brazilOffset = -3 * 60;
  const utcOffset = now.getTimezoneOffset();
  const brazilTime = new Date(now.getTime() + (utcOffset + brazilOffset) * 60 * 1e3);
  return brazilTime.toISOString().split("T")[0];
}
async function syncTodaySales(triggerSource) {
  const today = getBrazilDate();
  console.log(`[CRON] ${triggerSource} - Sincronizando vendas de hoje (${today})...`);
  try {
    const results = await salesSyncService.syncAllStores(today, today);
    const totalSales = results.reduce((sum, r) => sum + r.salesCount, 0);
    const successCount = results.filter((r) => r.success).length;
    console.log(`[CRON] ${triggerSource} - Sincroniza\xE7\xE3o conclu\xEDda:`);
    console.log(`  - Total de vendas sincronizadas: ${totalSales}`);
    console.log(`  - Lojas sincronizadas: ${successCount}/3`);
    results.forEach((result) => {
      if (result.success) {
        console.log(`  \u2713 ${result.store}: ${result.salesCount} vendas`);
      } else {
        console.log(`  \u2717 ${result.store}: ERRO - ${result.error}`);
      }
    });
  } catch (error) {
    console.error(`[CRON] ${triggerSource} - Erro:`, error.message);
  }
}
function initializeCronJobs() {
  if (cronInitialized) {
    console.log("[CRON] Cron jobs already initialized, skipping...");
    return;
  }
  cronInitialized = true;
  cron.schedule("5,35 8-22 * * 1-6", async () => {
    await syncTodaySales("Sync hor\xE1ria");
  }, {
    timezone: "America/Sao_Paulo"
  });
  console.log("[CRON] Sincroniza\xE7\xE3o hor\xE1ria configurada: 08:05-22:35 (Seg-S\xE1b)");
  cron.schedule("5 0 1 * *", async () => {
    console.log("[CRON] Iniciando sincroniza\xE7\xE3o mensal autom\xE1tica de vendas...");
    console.log(`[CRON] Data/Hora: ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}`);
    try {
      const results = await salesSyncService.syncCurrentMonth();
      const totalSales = results.reduce((sum, r) => sum + r.salesCount, 0);
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;
      console.log("[CRON] Sincroniza\xE7\xE3o mensal conclu\xEDda:");
      console.log(`  - Total de vendas sincronizadas: ${totalSales}`);
      console.log(`  - Lojas sincronizadas com sucesso: ${successCount}/3`);
      console.log(`  - Lojas com erro: ${failCount}/3`);
      results.forEach((result) => {
        if (result.success) {
          console.log(`  \u2713 ${result.store}: ${result.salesCount} vendas`);
        } else {
          console.log(`  \u2717 ${result.store}: ERRO - ${result.error}`);
        }
      });
    } catch (error) {
      console.error("[CRON] Erro cr\xEDtico na sincroniza\xE7\xE3o mensal:", error.message);
    }
  }, {
    timezone: "America/Sao_Paulo"
  });
  console.log("[CRON] Sincroniza\xE7\xE3o mensal configurada: todo dia 1 \xE0s 00:05");
  const isProduction2 = process.env.NODE_ENV === "production";
  const skipInitialSync = process.env.SKIP_INITIAL_SYNC === "true";
  if (isProduction2 || skipInitialSync) {
    console.log("[CRON] Sincroniza\xE7\xE3o inicial pulada (ambiente de produ\xE7\xE3o ou SKIP_INITIAL_SYNC=true)");
    console.log("[CRON] Dados ser\xE3o sincronizados pelo pr\xF3ximo job agendado");
  } else {
    console.log("[CRON] Sincroniza\xE7\xE3o inicial agendada para 30 segundos ap\xF3s o in\xEDcio");
    setTimeout(() => {
      syncTodaySales("Sync inicial");
    }, 3e4);
  }
}

// server/index.ts
var app = express2();
app.set("trust proxy", 1);
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/_health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
var isProduction = process.env.NODE_ENV === "production";
app.use(
  session({
    secret: process.env.SESSION_SECRET || "saron-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      maxAge: 1e3 * 60 * 60 * 24 * 7,
      // 7 days
      sameSite: isProduction ? "none" : "lax"
    }
  })
);
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
async function ensureAdminUser() {
  try {
    const storage2 = new DatabaseStorage();
    const existingAdmin = await storage2.getUserByUsername("admin");
    if (!existingAdmin || !existingAdmin.isActive) {
      if (existingAdmin && !existingAdmin.isActive) {
        await storage2.updateUser(existingAdmin.id, { isActive: true });
        log("\u2705 Admin user reactivated");
      } else {
        await storage2.createUser({
          username: "admin",
          email: "admin@saron.com.br",
          password: "admin123",
          fullName: "Administrador",
          role: "administrador",
          isActive: true
        });
        log("\u2705 Admin user created with default credentials");
      }
    }
  } catch (error) {
    console.error("Error ensuring admin user:", error);
  }
}
(async () => {
  try {
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });
    app.use("/uploads", express2.static("public/uploads"));
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`serving on port ${port}`);
      setImmediate(async () => {
        try {
          await ensureAdminUser();
          log("\u2713 Admin user initialization complete");
        } catch (error) {
          console.error("\u2717 Failed to initialize admin user:", error);
        }
        try {
          initializeCronJobs();
          log("\u2713 Cron jobs initialization complete");
        } catch (error) {
          console.error("\u2717 Failed to initialize cron jobs:", error);
        }
      });
    });
  } catch (error) {
    console.error("Fatal error during server initialization:", error);
    process.exit(1);
  }
})();
