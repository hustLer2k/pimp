import "server-only";

import { createClient } from "@/utils/supa-server";
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
			<Title />
			<ThemeIcon darkMode={darkMode} userId={userId} />
			<Search />
			{/* @ts-expect-error Server Component */}
			<UserCircle userId={userId} />
		</div>
	);
};

const Title = () => <h5 className="title-text">Pimp</h5>;

export default TopNavigation;
