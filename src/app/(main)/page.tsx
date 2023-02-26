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
	console.log(data);

	return (
		<div className="flex flex-col justify-around items-center h-full p-10">
			<h2>Group chats</h2>
			<div>
				{data?.map((conversation) => (
					<div key={conversation.id}>
						{conversation.participants_ids.map((id) => (
							<p key={id}>{id}</p>
						))}

						{conversation.group && <p>Group</p>}

						{conversation.group && <p>{conversation.name}</p>}
					</div>
				))}
			</div>

			<Image src={topG} alt="TOP-G" className="dark:brightness-90" />
		</div>
	);
}

export default App;
