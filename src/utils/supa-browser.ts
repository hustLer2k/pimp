import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "../lib/database";

export const createClient = () => createBrowserSupabaseClient<Database>();
