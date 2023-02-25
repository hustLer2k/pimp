import Image from "next/image";
import topG from "@public/andrew-tate-top-g.gif";

function App() {
	return (
		<div className="flex justify-center items-center h-full p-10">
			<Image
				src={topG}
				alt="TOP-G"
				className="w-full h-full dark:brightness-90"
			/>
		</div>
	);
}

export default App;
