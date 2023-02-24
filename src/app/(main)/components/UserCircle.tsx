import "server-only";

import { createClient } from "@/utils/supa-server";
import Avatar from "@/components/ui/Avatar";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

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

	if (avatar)
		return (
			<Link href={username ? `/user/${username}` : "/login"}>
				<Avatar
					avatar={avatar}
					username={null}
					size={40}
					classes="top-navigation-icon"
				/>
			</Link>
		);

	return <FaUserCircle size="24" className="top-navigation-icon" />;
};

export default UserCircle;
