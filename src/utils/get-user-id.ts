import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database";

export default async function getUserId(supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase.auth.getSession();

	if (error || !data.session) {
		console.log(error?.message || "User is not logged in.");
		redirect("/login");
		return null;
	}

	return data.session.user.id;
}
