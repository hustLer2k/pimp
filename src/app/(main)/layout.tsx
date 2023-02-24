import SideBar from "./components/SideBar";
import TopNavigation from "./components/TopNavigation";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<nav>
				<SideBar />
				<TopNavigation />
			</nav>
			<section className="absolute top-16 left-16 w-[calc(100%-4rem)] h-[calc(100%-4rem)] overflow-hidden bg-gray-50 dark:bg-gray-700 transition-[background-color] duration-300 ease-in-out">
				{children}
			</section>
		</>
	);
}
