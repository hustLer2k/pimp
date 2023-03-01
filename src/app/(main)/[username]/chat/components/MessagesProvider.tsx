"use client";

import { useEffect, useState } from "react";
import { Database } from "@/lib/database";
import Messages from "./Messages";
import Input from "./Input";
import { useSupabase } from "@/components/store/supa-provider";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type User = Database["public"]["Tables"]["profiles"]["Row"];

export default function MessagesProvider({
	curUserId,
	recipientId,
	serverMessages,
	usersInfo,
	conversationId,
	chatName,
}: {
	curUserId: string;
	recipientId: string;
	serverMessages: Message[];
	usersInfo: {
		[id: string]: User | null;
	};
	conversationId: string | null | undefined;
	chatName: string | null | undefined;
}) {
	const { supabase } = useSupabase();

	const [messages, setMessages] = useState(serverMessages || []);

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
	}, [supabase, curUserId, conversationId]);

	const sendMessageHandler = async (message: Message) => {
		setMessages((prevMessages) => [message, ...prevMessages!]);
	};

	return (
		<>
			<div className="h-full w-full overflow-hidden">
				<Messages messages={messages} usersInfo={usersInfo} />
				<Input
					curUserID={curUserId}
					recipientId={recipientId}
					onSendMessage={sendMessageHandler}
					conversationId={conversationId}
					chatName={chatName}
				/>
			</div>
		</>
	);
}
