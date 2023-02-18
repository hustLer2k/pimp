import { createClient } from "@/utils/supa-server";
import { notFound } from "next/navigation";
import User from "./User";

export default async function UserPage({
	params,
}: {
	params: { username: string };
}) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data, error } = await supabase
		.from("profiles")
		.select("name, avatar, id")
		.eq("username", params.username)
		.single();

	if (!data) notFound();

	return (
		<User
			username={params.username}
			userId1={user?.id}
			userId2={data.id}
			{...data}
		/>
	);
}

// export async function generateStaticParams() {
// 	const supa_key = process.env.SUPABASE_KEY;
// 	if (!supa_key) {
// 		throw new Error("Specify the supabase key");
// 	}

// 	const supabase = createClient(
// 		"https://tynmutxkvlatvpubyvrx.supabase.co",
// 		supa_key
// 	);

// 	const { data, error } = await supabase.from("profiles").select("username");
// 	console.error(error ?? error);
// 	console.log(data);

// 	return data;
// }
