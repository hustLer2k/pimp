"use client";
import { Database } from "@/lib/database.types";
import { useEffect, useRef } from "react";
import Message from "./Message";

type User = Database["public"]["Tables"]["profiles"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];

export default function Messages({
	curUser,
	messages,
	recipientUser,
}: {
	curUser: User | null;
	messages: Message[] | null;
	recipientUser: User | null;
}) {
	let messagesJSX;
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesContainerRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	}, [messages]);

	if (messages?.length == 0) {
		messagesJSX = (
			<h1 className="text-center text-3xl text-gray-600 tracking-tight h-[calc(100%-4rem)] pt-[40vh]">
				No messages yet
			</h1>
		);
	} else {
		let lastMessageAuthor: string | null = null;

		messagesJSX = (
			<div className="flex flex-col overflow-y-auto justify-center items-center overflow-x-hidden h-[calc(100%-4rem)] w-full">
				<div
					className="flex flex-col-reverse min-h py-6 scroll-smooth overflow-y-auto overflow-x-hidden h-full pl-4 w-full"
					ref={messagesContainerRef}
				>
					{messages?.map((message, index, allMessages) => {
						lastMessageAuthor = allMessages[index + 1]?.sender;

						return (
							<Message
								key={message.id}
								message={message}
								curUser={curUser}
								recipientUser={recipientUser}
								showProfile={
									lastMessageAuthor === message.sender
										? false
										: true
								}
								lastMessageDate={
									allMessages[index + 1]?.created_at
								}
							/>
						);
					})}
				</div>
			</div>
		);
	}

	return messagesJSX;
}
