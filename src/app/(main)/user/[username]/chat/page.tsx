import "server-only";

import { createClient } from "@/utils/supa-server";

export const revalidate = 0;

export default async function Chat({ params }: { params: { chatId: string } }) {
	const supabase = createClient();
	const chatId = params.chatId;

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
