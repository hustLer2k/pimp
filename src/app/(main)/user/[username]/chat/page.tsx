import "server-only";

import { notFound } from "next/navigation";
import { createClient } from "@/utils/supa-server";

import MessagesProvider from "./components/MessagesProvider";
import getUserId from "@/utils/get-user-id";

export const revalidate = 0;

export default async function Chat({
	params,
}: {
	params: { username: string };
}) {
	const supabase = createClient();

	const curUserID = await getUserId(supabase);
	if (!curUserID) return;

	let data, error;
	({ data } = await supabase
		.from("profiles")
		.select("id")
		.eq("username", params.username)
		.single());

	const recipientId = data?.id;
	if (!recipientId || curUserID === recipientId) return notFound();

	let conversation_id: string | null | undefined = null;
	({ data, error } = await supabase
		.from("conversations")
		.select("id")
		.contains("participants_ids", [curUserID, recipientId]));

	error && console.error(error);

	if (error) throw new Error(error.message);

	if (!data?.[0]) {
		({ data, error } = await supabase
			.from("conversations")
			.insert({
				participants_ids: [curUserID, recipientId],
				creator_id: curUserID,
			})
			.select("id")
			.single());

		error && console.error(error);

		conversation_id = data?.id;
	} else {
		conversation_id = data[0]?.id;
	}

	if (!conversation_id) {
		throw new Error("Conversation id is null");
	}

	// messsenges info
	const messagesPromise = supabase
		.from("messages")
		.select()
		.eq("conversation_id", conversation_id)
		.order("created_at", { ascending: false });

	const curUserPromise = supabase
		.from("profiles")
		.select()
		.eq("id", curUserID)
		.single();
	const recipientPromise = supabase
		.from("profiles")
		.select()
		.eq("id", recipientId)
		.single();

	const messagesInfo = await Promise.all([
		messagesPromise,
		curUserPromise,
		recipientPromise,
	]);

	return (
		<MessagesProvider
			curUserId={curUserID}
			recipientId={recipientId}
			messagesInfo={messagesInfo}
			conversationId={conversation_id}
		/>
	);
}
