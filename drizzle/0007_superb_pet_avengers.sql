CREATE TABLE IF NOT EXISTS "RAG-genAI_embeddings" (
	"id" serial PRIMARY KEY NOT NULL,
	"vectors" vector(768) NOT NULL,
	"metadata" text NOT NULL,
	"playground_id" varchar(255) NOT NULL,
	"file_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RAG-genAI_embeddings" ADD CONSTRAINT "RAG-genAI_embeddings_playground_id_RAG-genAI_playground_id_fk" FOREIGN KEY ("playground_id") REFERENCES "public"."RAG-genAI_playground"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RAG-genAI_embeddings" ADD CONSTRAINT "RAG-genAI_embeddings_file_id_RAG-genAI_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."RAG-genAI_file"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddings_playground_id_idx" ON "RAG-genAI_embeddings" USING hnsw ("vectors" vector_cosine_ops);