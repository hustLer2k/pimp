import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "../lib/database";

export const createClient = () =>
	createServerComponentSupabaseClient<Database>({
		headers,
		cookies,
	});
