DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "RAG-genAI_playground" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "RAG-genAI_playground_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RAG-genAI_playground" ADD CONSTRAINT "RAG-genAI_playground_user_id_RAG-genAI_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."RAG-genAI_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
