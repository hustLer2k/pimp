import "server-only";

import { BsGearFill } from "react-icons/bs";
import { HomeIcon } from "@heroicons/react/24/solid";
import { createClient } from "@/utils/supa-server";
import getUserId from "@/utils/get-user-id";
import SideChats from "./SideChats";
import SideBarIcon from "./SideBarIcon";

export const revalidate = 0;

const SideBar = async () => {
	const supabase = createClient();

	const curUserId = await getUserId(supabase);
	if (!curUserId) throw new Error("User is not logged in");

	// TODO: add group chats
	let { data } = await supabase
		.from("conversations")
		.select("participants_ids")
		.contains("participants_ids", [curUserId])
		.eq("group", false);

	const SidebarIcons: { avatar: string | null; username: string }[] = [];
	const otherUsers = new Set<string>();

	if (data) {
		for (let { participants_ids } of data) {
			let otherId = participants_ids.find(
				(participantId) => participantId != curUserId
			);

			const { data } = await supabase
				.from("profiles")
				.select("avatar, username")
				.eq("id", otherId)
				.single();

			if (data) {
				const { avatar, username } = data;

				if (username && !otherUsers.has(username)) {
					SidebarIcons.push({ avatar, username });
					otherUsers.add(username);
				}
			}
		}
	}

	return (
		<div
			className="fixed top-0 left-0 h-screen w-16 flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg"
		>
			<SideBarIcon
				icon={<HomeIcon className="w-8 h-8" />}
				text="Home"
				href="/"
			/>
			<Divider />

			<div className="overflow-y-auto w-full flex flex-col items-center overflow-x-hidden scrollbar-hide">
				{
					// @ts-ignore
					<SideChats
						serverChats={SidebarIcons}
						otherUsers={Array.from(otherUsers)}
						curUserId={curUserId}
					/>
				}
			</div>

			<Divider />
			<SideBarIcon icon={<BsGearFill size="32" />} text="Settings" />
		</div>
	);
};

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
