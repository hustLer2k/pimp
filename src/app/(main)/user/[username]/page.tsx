import { createClient } from "@/utils/supa-server";
import { notFound, redirect } from "next/navigation";
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
	if (!user) redirect("/login");

	const { data, error } = await supabase
		.from("profiles")
		.select()
		.eq("username", params.username)
		.single();

	if (error || !data) throw new Error(error && "Something went wrong.");

	return <User {...data} />;
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
