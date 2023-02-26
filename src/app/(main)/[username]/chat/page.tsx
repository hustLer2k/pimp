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
	if (!curUserID) return notFound();

	let data,
		error,
		conversation_id: string | null | undefined = null,
		recipientId: string | null | undefined = null;
	({ data } = await supabase
		.from("conversations")
		.select("id")
		.eq("id", params.username)
		.single());

	if (data?.id) {
		conversation_id = data.id;
	} else {
		({ data } = await supabase
			.from("profiles")
			.select("id")
			.eq("username", params.username)
			.single());

		recipientId = data?.id;
		if (!recipientId || curUserID === recipientId) return notFound();

		({ data, error } = await supabase
			.from("conversations")
			.select("id")
			.contains("participants_ids", [curUserID, recipientId]));

		error && console.error(error);

		if (error) throw new Error(error.message);
		conversation_id = data?.[0]?.id;
	}

	// messsenges info
	const messagesPromise = conversation_id
		? supabase
				.from("messages")
				.select()
				.eq("conversation_id", conversation_id)
				.order("created_at", { ascending: false })
		: Promise.resolve({ data: null, error: null });

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
			recipientId={recipientId!}
			messagesInfo={messagesInfo}
			conversationId={conversation_id}
		/>
	);
}
