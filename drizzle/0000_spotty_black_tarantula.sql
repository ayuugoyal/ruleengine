CREATE TABLE IF NOT EXISTS "rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"rule_string" text NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL
);
