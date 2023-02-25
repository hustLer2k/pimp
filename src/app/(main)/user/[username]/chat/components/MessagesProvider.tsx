"use client";

import { useEffect, useState } from "react";
import { Database } from "@/lib/database.types";
import Messages from "./Messages";
import Input from "./Input";
import { useSupabase } from "@/components/store/supa-provider";

type Message = Database["public"]["Tables"]["messages"]["Row"];
import type { PostgrestSingleResponse } from "@supabase/postgrest-js/dist/main/types";
type User = Database["public"]["Tables"]["profiles"]["Row"];

export default function MessagesProvider({
	curUserId,
	recipientId,
	messagesInfo,
	conversationId,
}: {
	curUserId: string;
	recipientId: string;
	messagesInfo: [
		PostgrestSingleResponse<Message[]> | { data: null; error: null },
		PostgrestSingleResponse<User>,
		PostgrestSingleResponse<User>
	];
	conversationId: string | null | undefined;
}) {
	const { supabase } = useSupabase();

	const [
		{ data: serverMessages, error: messagesError },
		{ data: curUser, error: curUserError },
		{ data: recipientUser, error: recipientUserError },
	] = messagesInfo;
	const [messages, setMessages] = useState(serverMessages || []);

	if (messagesError) {
		console.error(messagesError);
		throw new Error("An error occured");
	}

	useEffect(() => {
		const channel = supabase
			.channel("*")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `conversation_id=eq.${conversationId}`,
				},
				(payload) => {
					const newMessage = payload.new as Message;

					if (newMessage.sender !== curUserId)
						setMessages((prevMessages) => [
							newMessage,
							...prevMessages!,
						]);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	const sendMessageHandler = async (message: Message) => {
		setMessages((prevMessages) => [message, ...prevMessages!]);
	};

	return (
		<>
			<div className="h-full w-full overflow-hidden">
				<Messages
					curUser={curUser}
					recipientUser={recipientUser}
					messages={messages}
				/>
				<Input
					curUserID={curUserId}
					recipientId={recipientId}
					onSendMessage={sendMessageHandler}
					conversationId={conversationId}
				/>
			</div>
		</>
	);
}
