import "server-only";

import { notFound } from "next/navigation";
import { createClient } from "@/utils/supa-server";

import MessagesProvider from "./components/MessagesProvider";
import getUserId from "@/utils/get-user-id";

import { Database } from "@/lib/database";
type User = Database["public"]["Tables"]["profiles"]["Row"];
type Nullable<T> = T | undefined | null;

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
		conversation_id: Nullable<string> = null,
		recipientId: Nullable<string> = null,
		chatName: Nullable<string> = null;

	({ data } = await supabase
		.from("conversations")
		.select("id, name, participants_ids")
		.eq("id", params.username)
		.single());

	if (data?.id) {
		conversation_id = data.id;

		if (data.name) {
			chatName = data.name;
		} else {
			({ data } = await supabase
				.from("profiles")
				.select("name")
				.eq(
					"id",
					data.participants_ids.filter((id) => id !== curUserID)
				)
				.single());

			chatName = data?.name;
		}
	} else {
		({ data } = await supabase
			.from("profiles")
			.select("id, name")
			.eq("username", params.username)
			.single());

		recipientId = data?.id;
		if (!recipientId || curUserID === recipientId) return notFound();

		chatName = data?.name;
		({ data, error } = await supabase
			.from("conversations")
			.select("id")
			.eq("group", false)
			.contains("participants_ids", [curUserID, recipientId]));

		error && console.error(error);

		if (error) throw new Error(error.message);
		conversation_id = data?.[0]?.id;
	}

	const userIds = new Set<string>();
	const users: { [id: string]: User | null } = {};

	if (conversation_id) {
		({ data, error } = await supabase
			.from("messages")
			.select()
			.eq("conversation_id", conversation_id)
			.order("created_at", { ascending: false }));

		if (error) throw new Error(error.message);

		data!.forEach((message) => userIds.add(message.sender));
	} else {
		userIds.add(curUserID).add(recipientId!);
		data = [];
	}

	for (let userId of userIds) {
		const { data: userData, error: userError } = await supabase
			.from("profiles")
			.select()
			.eq("id", userId)
			.single();

		if (userError) console.error(userError);

		users[userId] = userData;
	}

	return (
		<MessagesProvider
			curUserId={curUserID}
			recipientId={recipientId!}
			serverMessages={data!}
			usersInfo={users}
			conversationId={conversation_id}
			chatName={chatName}
		/>
	);
}
