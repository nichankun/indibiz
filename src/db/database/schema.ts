import {
  pgTable,
  pgEnum,
  serial,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Enums ----------

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "admin",
  "sales",
  "viewer",
]);

export const packageCategoryEnum = pgEnum("package_category", [
  "basic",
  "bisnis",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "lead_baru",
  "sudah_dihubungi",
  "menunggu_survey",
  "survey_dijadwalkan",
  "area_tercover",
  "tidak_tercover",
  "menunggu_pembayaran",
  "pemasangan_dijadwalkan",
  "berhasil_dipasang",
  "selesai",
  "ditolak",
]);

export const activityTypeEnum = pgEnum("activity_type", [
  "catatan",
  "perubahan_status",
  "telepon",
  "whatsapp",
  "survey",
]);

// ---------- Tables ----------

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("sales"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  category: packageCategoryEnum("category").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  speedMbps: integer("speed_mbps").notNull(),
  normalPrice: numeric("normal_price", { precision: 12, scale: 2 }).notNull(),
  promoPrice: numeric("promo_price", { precision: 12, scale: 2 }),
  promoStartDate: timestamp("promo_start_date", { withTimezone: true }),
  promoEndDate: timestamp("promo_end_date", { withTimezone: true }),
  description: text("description"),
  // Array of short benefit strings, e.g. ["Gratis instalasi", "IP Publik", "SLA 24 jam"]
  benefits: jsonb("benefits").$type<string[]>().default([]),
  badge: varchar("badge", { length: 40 }), // e.g. "Paling Populer", "Promo"
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  leadCode: varchar("lead_code", { length: 20 }).notNull().unique(), // e.g. LEAD-000123

  // Data pelanggan
  name: varchar("name", { length: 120 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }).notNull(),
  email: varchar("email", { length: 160 }),
  city: varchar("city", { length: 100 }),
  district: varchar("district", { length: 100 }), // kecamatan
  postalCode: varchar("postal_code", { length: 10 }),
  address: text("address"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),

  // Paket yang diminati
  packageId: integer("package_id").references(() => packages.id),

  // Pipeline
  status: leadStatusEnum("status").notNull().default("lead_baru"),
  rejectionReason: text("rejection_reason"),
  assignedSalesId: integer("assigned_sales_id").references(() => users.id),
  nextFollowUpDate: timestamp("next_follow_up_date", { withTimezone: true }),

  // Marketing / tracking
  source: varchar("source", { length: 60 }), // e.g. "landing_page", "whatsapp", "referral"
  utmSource: varchar("utm_source", { length: 100 }),
  utmMedium: varchar("utm_medium", { length: 100 }),
  utmCampaign: varchar("utm_campaign", { length: 100 }),
  landingPageSource: text("landing_page_source"),
  referral: varchar("referral", { length: 120 }),

  // Consent
  consentPrivacy: boolean("consent_privacy").notNull().default(false),
  consentContact: boolean("consent_contact").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leadActivities = pgTable("lead_activities", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id),
  type: activityTypeEnum("type").notNull().default("catatan"),
  content: text("content"),
  previousStatus: leadStatusEnum("previous_status"),
  newStatus: leadStatusEnum("new_status"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: varchar("action", { length: 60 }).notNull(), // create, update, delete, status_change, login
  entityType: varchar("entity_type", { length: 60 }).notNull(), // lead, package, user
  entityId: integer("entity_id"),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- Relations ----------

export const leadsRelations = relations(leads, ({ one, many }) => ({
  package: one(packages, { fields: [leads.packageId], references: [packages.id] }),
  assignedSales: one(users, { fields: [leads.assignedSalesId], references: [users.id] }),
  activities: many(leadActivities),
}));

export const leadActivitiesRelations = relations(leadActivities, ({ one }) => ({
  lead: one(leads, { fields: [leadActivities.leadId], references: [leads.id] }),
  user: one(users, { fields: [leadActivities.userId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  assignedLeads: many(leads),
}));

export type User = typeof users.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type LeadActivity = typeof leadActivities.$inferSelect;
