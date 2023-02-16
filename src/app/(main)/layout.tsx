import SideBar from "./SideBar";
import TopNavigation from "./TopNavigation";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<nav>
				<SideBar />
				<TopNavigation />
			</nav>
			<section>{children}</section>
		</>
	);
}
