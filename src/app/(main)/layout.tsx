import SideBar from "./SideBar";
import TopNavigation from "./TopNavigation";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<nav>
				<SideBar />
				<TopNavigation />
			</nav>
			<section className="fixed top-16 left-16 w-screen h-screen">
				{children}
			</section>
		</>
	);
}
