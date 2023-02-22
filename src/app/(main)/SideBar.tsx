import "server-only";

import Image from "next/image";
import { BsGearFill } from "react-icons/bs";
import { HomeIcon } from "@heroicons/react/24/solid";
import botImage from "@public/bot.svg";
import { createClient } from "@/utils/supa-server";
import getUserId from "@/utils/get-user-id";
import SideChats from "./SideChats";
import SideBarIcon from "./SideBarIcon";

export const revalidate = 0;

const SideBar = async () => {
	const supabase = createClient();

	const curUserId = await getUserId(supabase);
	if (!curUserId) throw new Error("User is not logged in");

	let { data } = await supabase
		.from("messages")
		.select("recipient, sender")
		.or(`sender.eq.${curUserId},recipient.eq.${curUserId}`);

	const SidebarIcons: { avatar: string | null; username: string }[] = [];
	const otherUsers = new Set<string>();

	if (data) {
		let otherId;
		for (let { recipient, sender } of data) {
			otherId = recipient === curUserId ? sender : recipient;

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

	// if (data) {
	// 	let otherId;
	// 	for (let { recipient, sender } of data) {
	// 		otherId = recipient === curUserId ? sender : recipient;

	// 		const {
	// 			data: { name, avatar, username },
	// 			error,
	// 		} = await supabase
	// 			.from("profiles")
	// 			.select("avatar, username")
	// 			.eq("id", otherId)
	// 			.single();

	// 		if (error) {
	// 			console.error(error);
	// 			continue;
	// 		} else {
	// 			if (!otherUsers.has(username)) {
	// 				SidebarIcons.push(
	// 					<SideBarIcon
	// 						key={username}
	// 						text={username}
	// 						href={`/user/${username}/chat`}
	// 						icon={
	// 							<Image
	// 								src={avatar || botImage}
	// 								alt={`${name}'s avatar`}
	// 								width={69}
	// 								height={69}
	// 								className="rounded-full dark:brightness-90"
	// 							/>
	// 						}
	// 					/>
	// 				);
	// 				otherUsers.add(username);
	// 			}
	// 		}
	// 	}
	// }

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
