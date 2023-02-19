import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaPoo } from "react-icons/fa";

import Link from "next/link";
import { createClient } from "@/utils/supa-server";

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

	if (data) {
		for (let { recipient, sender } of data) {
		}
	}

	return (
		<div
			className="fixed top-0 left-0 h-screen w-16 flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg"
		>
			<SideBarIcon icon={<FaFire size="28" />} text="Home" href="/" />
			<Divider />
			<SideBarIcon icon={<BsPlus size="32" />} />
			<SideBarIcon icon={<BsFillLightningFill size="20" />} />
			<SideBarIcon icon={<FaPoo size="20" />} />
			<Divider />
			<SideBarIcon icon={<BsGearFill size="22" />} />
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
