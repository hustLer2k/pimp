import "server-only";

import { createClient } from "@/utils/supa-server";
import { redirect } from "next/navigation";
import User from "./User";

export default async function UserPage({
	params,
}: {
	params: { username: string };
}) {
	const supabase = createClient();

	if (params.username === "favicon.ico") return redirect("/");

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) redirect("/login");

	const { data, error } = await supabase
		.from("profiles")
		.select()
		.eq("username", params.username);

	if (error || !data)
		throw new Error(error?.message! || "Something went wrong.");

	return <User curId={session.user.id} {...data[0]} />;
}
