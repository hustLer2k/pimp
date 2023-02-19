import { BsGearFill } from "react-icons/bs";
import { HomeIcon } from "@heroicons/react/24/solid";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supa-server";
import botImage from "@public/bot.svg";
import getUserId from "@/utils/get-user-id";

export const revalidate = 100;

const SideBar = async () => {
	const supabase = createClient();

	const curUserId = await getUserId(supabase);
	if (!curUserId) throw new Error("User is not logged in");

	let { data } = await supabase
		.from("messages")
		.select("recipient, sender")
		.or(`sender.eq.${curUserId},recipient.eq.${curUserId}`);

	const SidebarIcons = [];
	const otherUsers = new Set();

	if (data) {
		let otherId;
		for (let { recipient, sender } of data) {
			otherId = recipient === curUserId ? sender : recipient;

			const {
				data: { name, avatar, username },
				error,
			} = await supabase
				.from("profiles")
				.select("avatar, username")
				.eq("id", otherId)
				.single();

			if (error) {
				console.error(error);
				continue;
			} else {
				if (!otherUsers.has(username)) {
					SidebarIcons.push(
						<SideBarIcon
							key={username}
							text={username}
							href={`/user/${username}/chat`}
							icon={
								<Image
									src={avatar || botImage}
									alt={`${name}'s avatar`}
									width={38}
									height={38}
									className="rounded-full"
								/>
							}
						/>
					);
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
			{SidebarIcons}
			<Divider />
			<SideBarIcon icon={<BsGearFill size="32" />} text="Settings" />
		</div>
	);
};

const SideBarIcon = ({ icon, text = "tooltip 💡", href = "/" }) => (
	<Link className="sidebar-icon group" href={href}>
		{icon}
		<span className="sidebar-tooltip group-hover:scale-100">{text}</span>
	</Link>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
