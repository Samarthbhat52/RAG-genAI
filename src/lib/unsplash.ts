import { env } from "@/env";
import { createApi } from "unsplash-js";

export const unsplash = createApi({
  accessKey: env.UNSPLASH_API_KEY,
  fetch: fetch,
});
