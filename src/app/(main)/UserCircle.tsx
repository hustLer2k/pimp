import "server-only";
import { createClient } from "@/utils/supa-server";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

const UserCircle = async () => {
	const supabase = createClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	let avatar: string | null | undefined;
	if (session) {
		const { data } = await supabase
			.from("profiles")
			.select("avatar")
			.eq("id", session.user.id)
			.single();

		avatar = data?.avatar;
	}

	if (avatar)
		return (
			<Image
				src={avatar}
				alt="Your avatar"
				width={24}
				height={24}
				className="top-navigation-icon"
			/>
		);

	return <FaUserCircle size="24" className="top-navigation-icon" />;
};

export default UserCircle;
