import { SupabaseClient } from "@supabase/supabase-js";

export default async function getUserId(supabase: SupabaseClient) {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error) {
		console.log(error.message);
		return null;
	}

	return user?.id;
}
