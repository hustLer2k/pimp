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

	const {
		data: { session },
	} = await supabase.auth.getSession();
	if (!session) redirect("/login");

	const { data: curUserData } = await supabase
		.from("profiles")
		.select("username")
		.eq("id", session.user.id)
		.single();

	const curUsername = curUserData?.username;

	const { data, error } = await supabase
		.from("profiles")
		.select()
		.eq("username", params.username)
		.single();

	if (error || !data || !curUsername)
		throw new Error(error! && "Something went wrong.");

	return <User curUsername={curUsername} {...data} />;
}
