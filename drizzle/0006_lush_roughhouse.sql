CREATE TABLE IF NOT EXISTS "RAG-genAI_message" (
	"id" varchar PRIMARY KEY NOT NULL,
	"playground_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"message" varchar DEFAULT '' NOT NULL,
	"is_user_message" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RAG-genAI_message" ADD CONSTRAINT "RAG-genAI_message_playground_id_RAG-genAI_playground_id_fk" FOREIGN KEY ("playground_id") REFERENCES "public"."RAG-genAI_playground"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RAG-genAI_message" ADD CONSTRAINT "RAG-genAI_message_user_id_RAG-genAI_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."RAG-genAI_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
