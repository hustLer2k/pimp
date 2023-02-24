import "server-only";

import { createClient } from "@/utils/supa-server";
import { FaHashtag, FaRegBell } from "react-icons/fa";
import Search from "./Search";
import UserCircle from "./UserCircle";
import ThemeIcon from "./ThemeIcon";

const TopNavigation = async () => {
	const supabase = createClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();
	const userId = session?.user.id;

	let darkMode: number | null | undefined = 0;
	if (userId) {
		const { data } = await supabase
			.from("profiles")
			.select("darkmode")
			.eq("id", userId)
			.single();
		darkMode = data?.darkmode;
	}

	return (
		<div className="top-navigation">
			<HashtagIcon />
			<Title />
			<ThemeIcon darkMode={darkMode} userId={userId} />
			<Search />
			{/* <BellIcon /> */}
			{/* @ts-expect-error Server Component */}
			<UserCircle userId={userId} />
		</div>
	);
};

const BellIcon = () => <FaRegBell size="24" className="top-navigation-icon" />;
const HashtagIcon = () => <FaHashtag size="20" className="title-hashtag" />;
const Title = () => <h5 className="title-text">Pimp</h5>;

export default TopNavigation;
