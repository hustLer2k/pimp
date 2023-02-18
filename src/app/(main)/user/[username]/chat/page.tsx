import "server-only";

import { createClient } from "@/utils/supa-server";

export const revalidate = 0;

export default async function Chat() {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("chats");
		.select("id")
		

	return (
		<>
			<div></div>
			<div></div>
			<div>
				<input type="text" placeholder=""></input>
			</div>
		</>
	);
}
