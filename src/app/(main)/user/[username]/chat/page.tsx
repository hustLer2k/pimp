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

	let data;
	({ data } = await supabase
		.from("profiles")
		.select("id")
		.eq("username", params.username)
		.single());

	const recipientId = data?.id;
	if (!recipientId || curUserID === recipientId) return notFound();

	let conversation_id: string | null | undefined = null;
	let { data: data228, error } = await supabase
		.from("participants")
		.select("conversation_id")
		.contains("participant_ids", [curUserID, recipientId])
		.single();

	console.log("data228");
	console.log(data228);
	error && console.error(error);

	if (!data228) {
		let { data, error } = await supabase
			.from("conversations")
			.insert({
				name: "Top-g chat",
			})
			.select("id")
			.single();

		console.log("data conversations");

		error && console.error(error);
		conversation_id = data?.id;

		if (!conversation_id) {
			throw new Error("Conversation id is null");
		}

		({ data, error } = await supabase.from("participants").insert({
			conversation_id: conversation_id!,
			participant_ids: [curUserID, recipientId],
			creator_id: curUserID,
		}));
	} else {
		conversation_id = data228.conversation_id;
	}

	if (!conversation_id) {
		throw new Error("Conversation id is null");
	}

	// messsenges info
	const messagesPromise = supabase
		.from("messages")
		.select()
		.eq(conversation_id, conversation_id)
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
