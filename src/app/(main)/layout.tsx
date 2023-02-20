import SideBar from "./SideBar";
import TopNavigation from "./TopNavigation";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<nav>
				<SideBar />
				<TopNavigation />
			</nav>
			<section className="absolute top-16 left-16 w-[calc(100%-4rem)] h-[calc(100%-4rem)] overflow-hidden">
				{children}
			</section>
		</>
	);
}
