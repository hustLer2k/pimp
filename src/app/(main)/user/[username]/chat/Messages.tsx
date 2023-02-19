"use client";

import dynamic from "next/dynamic";
import { Database } from "@/lib/database.types";
import { useSupabase } from "@/components/store/supa-provider";
import { useEffect, useState } from "react";

const Message = dynamic(() => import("./Message"), { ssr: false });

import type { PostgrestSingleResponse } from "@supabase/postgrest-js/dist/main/types";
type User = Database["public"]["Tables"]["profiles"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];

export default function Messages({
	curUserID,
	messagesInfo,
}: {
	curUserID: string;
	messagesInfo: [
		PostgrestSingleResponse<Message[]>,
		PostgrestSingleResponse<User>,
		PostgrestSingleResponse<User>
	];
}) {
	const { supabase } = useSupabase();

	const [
		{ data: serverMessages, error: messagesError },
		{ data: curUser, error: curUserError },
		{ data: recipientUser, error: recipientUserError },
	] = messagesInfo;

	const [messages, setMessages] = useState(serverMessages);

	useEffect(() => setMessages(messages), [messages]);

	useEffect(() => {
		const channel = supabase
			.channel("*")
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "messages" },
				(payload) =>
					setMessages((prevMessages) => [
						...prevMessages!,
						payload.new as Message,
					])
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase, messages]);

	if (messagesError) {
		throw new Error("An error occured");
	}

	let messagesJSX;
	if (messages?.length == 0) {
		messagesJSX = <h2>No messages yet</h2>;
	} else {
		let lastMessageAuthor: string | null = null;

		messagesJSX = (
			<div className="flex flex-col justify-center px-[15vw] pt-8 pb-20 scroll-smooth overflow-x-hidden">
				{messages?.map((message, index, allMessages) => (
					<Message
						key={message.id}
						message={message}
						curUserID={curUserID}
						curUser={curUser}
						recipientUser={recipientUser}
						showProfile={
							lastMessageAuthor ===
							(lastMessageAuthor = message.sender)
								? false
								: true
						}
						lastMessageDate={allMessages[index - 1]?.created_at}
					/>
				))}
			</div>
		);
	}

	return messagesJSX;
}
