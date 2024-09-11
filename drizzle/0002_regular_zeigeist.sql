CREATE TABLE IF NOT EXISTS "RAG-genAI_file" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"playground_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"upload_status" "status" DEFAULT 'PENDING',
	"url" varchar,
	"key" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RAG-genAI_file" ADD CONSTRAINT "RAG-genAI_file_user_id_RAG-genAI_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."RAG-genAI_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RAG-genAI_file" ADD CONSTRAINT "RAG-genAI_file_playground_id_RAG-genAI_playground_id_fk" FOREIGN KEY ("playground_id") REFERENCES "public"."RAG-genAI_playground"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
