import Link from "next/link";

const SideBarIcon = ({
	icon,
	text = "tooltip 💡",
	href = "/",
}: {
	icon: JSX.Element;
	text?: string;
	href?: string;
}) => (
	<Link className="sidebar-icon group" href={href}>
		{icon}
		<span className="sidebar-tooltip group-hover:scale-100">{text}</span>
	</Link>
);

export default SideBarIcon;
