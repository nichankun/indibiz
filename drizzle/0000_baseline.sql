CREATE TYPE "public"."activity_type" AS ENUM('catatan', 'perubahan_status', 'telepon', 'whatsapp', 'survey');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('lead_baru', 'sudah_dihubungi', 'menunggu_survey', 'survey_dijadwalkan', 'area_tercover', 'tidak_tercover', 'menunggu_pembayaran', 'pemasangan_dijadwalkan', 'berhasil_dipasang', 'selesai', 'ditolak');--> statement-breakpoint
CREATE TYPE "public"."package_category" AS ENUM('basic', 'bisnis');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'admin', 'sales', 'viewer');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" varchar(60) NOT NULL,
	"entity_type" varchar(60) NOT NULL,
	"entity_id" integer,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer NOT NULL,
	"user_id" integer,
	"type" "activity_type" DEFAULT 'catatan' NOT NULL,
	"content" text,
	"previous_status" "lead_status",
	"new_status" "lead_status",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_code" varchar(20) NOT NULL,
	"name" varchar(120) NOT NULL,
	"whatsapp" varchar(20) NOT NULL,
	"email" varchar(160),
	"city" varchar(100),
	"district" varchar(100),
	"postal_code" varchar(10),
	"address" text,
	"latitude" double precision,
	"longitude" double precision,
	"package_id" integer,
	"status" "lead_status" DEFAULT 'lead_baru' NOT NULL,
	"rejection_reason" text,
	"assigned_sales_id" integer,
	"next_follow_up_date" timestamp with time zone,
	"source" varchar(60),
	"utm_source" varchar(100),
	"utm_medium" varchar(100),
	"utm_campaign" varchar(100),
	"landing_page_source" text,
	"referral" varchar(120),
	"consent_privacy" boolean DEFAULT false NOT NULL,
	"consent_contact" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leads_lead_code_unique" UNIQUE("lead_code")
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" "package_category" NOT NULL,
	"name" varchar(120) NOT NULL,
	"speed_mbps" integer NOT NULL,
	"normal_price" numeric(12, 2) NOT NULL,
	"promo_price" numeric(12, 2),
	"promo_start_date" timestamp with time zone,
	"promo_end_date" timestamp with time zone,
	"description" text,
	"benefits" jsonb DEFAULT '[]'::jsonb,
	"badge" varchar(40),
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "packages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(160) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'sales' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"two_factor_secret" text,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_sales_id_users_id_fk" FOREIGN KEY ("assigned_sales_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_created_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_user_created_idx" ON "audit_logs" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "lead_activities_lead_created_idx" ON "lead_activities" USING btree ("lead_id","created_at");--> statement-breakpoint
CREATE INDEX "leads_status_created_idx" ON "leads" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "leads_assigned_created_idx" ON "leads" USING btree ("assigned_sales_id","created_at");--> statement-breakpoint
CREATE INDEX "leads_follow_up_idx" ON "leads" USING btree ("next_follow_up_date");--> statement-breakpoint
CREATE INDEX "leads_created_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "packages_active_category_sort_idx" ON "packages" USING btree ("is_active","category","sort_order");--> statement-breakpoint
CREATE INDEX "users_role_active_idx" ON "users" USING btree ("role","is_active");