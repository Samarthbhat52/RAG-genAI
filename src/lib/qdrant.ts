import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrantClient = new QdrantClient({
  host: "192.168.29.113",
  port: 6333,
});
