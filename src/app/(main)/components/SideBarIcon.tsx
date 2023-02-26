import Link from "next/link";
import Slideshow from "./Slideshow";

const SideBarIcon = ({
	icon,
	text = "tooltip 💡",
	href = "/",
}: {
	icon: JSX.Element[] | JSX.Element;
	text?: string;
	href?: string;
}) => (
	<Link className="sidebar-icon group animate-fadein" href={href}>
		{Array.isArray(icon) ? <Slideshow icons={icon} /> : icon}
		<span className="sidebar-tooltip group-hover:scale-100">{text}</span>
	</Link>
);

export default SideBarIcon;
