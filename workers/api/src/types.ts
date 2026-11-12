import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
  STORAGE?: R2Bucket;
  GROQ_API_KEY?: string;
  GROQ_MODEL?: string;
  GROQ_FALLBACK_MODEL?: string;
  ENVIRONMENT?: string;
}
