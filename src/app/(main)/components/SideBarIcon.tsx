import Link from "next/link";

const SideBarIcon = ({
	icon,
	text = "tooltip 💡",
	href = "/",
}: {
	icon: JSX.Element[];
	text?: string;
	href?: string;
}) => (
	<Link className="sidebar-icon group animate-fadein" href={href}>
		{icon.length > 1 ? (
			<div className="h-12 overflow-hidden relative">
				<div className="h-full flex items-center animate-slideshow">
					{icon}
				</div>
			</div>
		) : (
			icon
		)}
		<span className="sidebar-tooltip group-hover:scale-100">{text}</span>
	</Link>
);

export default SideBarIcon;
