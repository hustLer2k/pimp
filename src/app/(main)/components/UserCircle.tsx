import "server-only";

import { createClient } from "@/utils/supa-server";
import Avatar from "@/components/ui/Avatar";
import Link from "next/link";

export const revalidate = 0;

const UserCircle = async ({ userId }: { userId: string | undefined }) => {
	const supabase = createClient();

	let avatar: string | null | undefined;
	let username: string | null | undefined;
	if (userId) {
		const { data } = await supabase
			.from("profiles")
			.select("avatar, username")
			.eq("id", userId)
			.single();

		avatar = data?.avatar;
		username = data?.username;
	}

	return (
		<Link
			className="md:mx-4 mx-2"
			href={username ? `/${username}` : "/login"}
		>
			<Avatar avatar={avatar} username={username} size={40} />
		</Link>
	);
};

export default UserCircle;
