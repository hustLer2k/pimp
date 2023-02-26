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
		.select("participants_ids, id")
		.contains("participants_ids", [curUserId]);

	const SidebarIcons: { avatar: string[]; username: string[]; id: string }[] =
		[];
	const chatIds = new Set<string>();

	if (data) {
		for (let { participants_ids, id } of data) {
			if (chatIds.has(id)) continue;

			let currentIdIndex = participants_ids.indexOf(curUserId);
			let otherIds = participants_ids.filter(
				(_, i) => i != currentIdIndex
			);

			let avatars: string[] = [];
			let usernames: string[] = [];

			for (let otherId of otherIds) {
				const { data } = await supabase
					.from("profiles")
					.select("avatar, username")
					.eq("id", otherId)
					.single();

				if (data) {
					const { avatar, username } = data;

					if (username && avatar) {
						avatars.push(avatar);
						usernames.push(username);
					}
				}
			}

			SidebarIcons.push({ avatar: avatars, username: usernames, id });
			chatIds.add(id);
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
						chatIds={Array.from(chatIds)}
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
