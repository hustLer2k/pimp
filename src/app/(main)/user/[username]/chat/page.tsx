import "server-only";

import { notFound } from "next/navigation";
import { createClient } from "@/utils/supa-server";

import Messages from "./Messages";
import Input from "./Input";
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

	const { data } = await supabase
		.from("profiles")
		.select("id")
		.eq("username", params.username)
		.single();

	const recipientId = data?.id;
	if (!recipientId) return notFound();

	// messsenges info
	const messagesPromise = supabase
		.from("messages")
		.select()
		.or(
			`and(sender.eq.${curUserID},recipient.eq.${recipientId}),and(sender.eq.${recipientId},recipient.eq.${curUserID})`
		)
		.order("created_at", { ascending: true });
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
		<div className="flex flex-col h-full">
			<Messages curUserID={curUserID} messagesInfo={messagesInfo} />
			<Input curUserID={curUserID} recipientId={recipientId} />
		</div>
	);
}
