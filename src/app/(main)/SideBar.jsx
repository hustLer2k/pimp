import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaPoo } from "react-icons/fa";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supa-server";
import botImage from "@public/bot.svg";
import { text } from "node:stream/consumers";

export const revalidate = 100;

const SideBar = async () => {
	const supabase = createClient();

	let { data, error } = await supabase.auth.getUser();
	let curUserId;
	if (error || !data.user) {
		throw error && new Error("User is not logged in");
	} else {
		curUserId = data.user.id;
	}

	({ data, error } = await supabase
		.from("messages")
		.select("recipient, sender")
		.or(`sender.eq.${curUserId},recipient.eq.${curUserId}`));
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
									width={32}
									height={32}
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
			<SideBarIcon icon={<FaFire size="28" />} text="Home" href="/" />
			<Divider />
			{SidebarIcons}
			<Divider />
			<SideBarIcon icon={<BsGearFill size="22" />} text="Settings" />
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
