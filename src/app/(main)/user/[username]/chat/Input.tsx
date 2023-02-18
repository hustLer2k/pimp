"use client";

import { useSupabase } from "@/components/store/supa-provider";

export default function Input({
	curUserID,
	recipientId,
}: {
	curUserID: string;
	recipientId: string;
}) {
	const { supabase } = useSupabase();

	async function sendMessage(payload: string) {
		let { error } = await supabase
			.from("messages")
			.insert({ sender: curUserID, recipient: recipientId, payload });

		console.error(error);
	}

	function keyUpHandler(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key !== "Enter") return;

		// @ts-ignore
		sendMessage(e.target.value.trim());
	}
	return (
		<div>
			<input onKeyUp={keyUpHandler} />
		</div>
	);
}
