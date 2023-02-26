import Image from "next/image";
import topG from "@public/andrew-tate-top-g.gif";
import { createClient } from "@/utils/supa-server";
import getUserId from "@/utils/get-user-id";

async function App() {
	const supabase = createClient();

	const userId = await getUserId(supabase);

	const { data, error } = await supabase
		.from("conversations")
		.select()
		.eq("group", true)
		.contains("participants_ids", [userId]);

	error && console.error(error);

	return (
		<div className="flex flex-col justify-around items-center h-full p-10">
			<Image
				src={topG}
				alt="TOP-G"
				className="dark:brightness-90 w-[80vw] h-[80vh]"
			/>
		</div>
	);
}

export default App;
