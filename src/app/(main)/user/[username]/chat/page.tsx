import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supa-server";

import Messages from "./Messages";
import Input from "./Input";

export const revalidate = 0;

export default async function Chat({
	searchParams,
}: {
	searchParams: { recipientId: string };
}) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const curUserID = user.id;
	const recipientId = searchParams.recipientId;

	// messsenges info
	const messagesPromise = supabase
		.from("messages")
		.select()
		.or(
			`and(sender.eq.${curUserID},recipient.eq.${recipientId}),and(sender.eq.${recipientId},recipient.eq.${curUserID})`
		)
		.order("created_at");
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
		<div className="flex flex-col">
			<Messages curUserID={curUserID} messagesInfo={messagesInfo} />
			<Input curUserID={curUserID} recipientId={recipientId} />
		</div>
	);
}
