"use client";

import Image from "next/image";
import { Database } from "@/lib/database.types";
import type { PostgrestError } from "@supabase/postgrest-js/dist/main/types";
import { useSupabase } from "@/components/store/supa-provider";
import { useEffect, useState } from "react";

type User = Database["public"]["Tables"]["profiles"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];

export default function Messages({
	curUserID,
	messagesInfo,
}: {
	curUserID: string;
	messagesInfo: [
		{ data: Message[] | null; error: PostgrestError | null },
		{ data: User[] | null; error: PostgrestError | null },
		{ data: User[] | null; error: PostgrestError | null }
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
					setMessages((prevMessages) => {
						console.log(payload);
						return [...prevMessages, payload.new as Message];
					})
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
		messagesJSX = (
			<div className="flex flex-col justify-center px-[15vw] h-[80vh] overflow-auto">
				{messages?.map((message) => {
					const sentByCurrentUser = message.sender === curUserID;
					const userInfo = sentByCurrentUser
						? (curUser as unknown as User)
						: (recipientUser as unknown as User);

					return (
						<div
							key={message.id}
							className={`${
								message.sender === curUserID
									? "self-end"
									: "self-start"
							} mb-5`}
						>
							<div>
								<Image
									src={
										userInfo?.avatar
											? userInfo.avatar
											: "@/public/bot.svg"
									}
									alt={`${
										userInfo ? userInfo.username : ""
									} avatar`}
									width={100}
									height={100}
									className="rounded-full dark:brightness-75"
								/>
								<p>
									{userInfo?.username}{" "}
									<span>
										{new Date(
											message.created_at
										).toLocaleString()}
									</span>
								</p>
							</div>
							<div>{message.payload}</div>
						</div>
					);
				})}
			</div>
		);
	}

	return messagesJSX;
}
