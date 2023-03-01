"use client";
import { Database } from "@/lib/database.types";
import { useEffect, useRef } from "react";
import Message from "./Message";

type User = Database["public"]["Tables"]["profiles"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];

export default function Messages({
	messages,
	usersInfo,
}: {
	messages: Message[] | null;
	usersInfo: {
		[id: string]: User | null;
	};
}) {
	let messagesJSX;
	const messagesBottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesBottomRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}, [messages]);

	if (!messages?.length) {
		messagesJSX = (
			<h1 className="text-center text-3xl text-gray-600 tracking-tight h-[calc(100%-4rem)] pt-[40vh]">
				No messages yet
			</h1>
		);
	} else {
		let lastMessageAuthor: string | null = null;

		messagesJSX = (
			<div className="flex flex-col overflow-y-auto justify-center items-center overflow-x-hidden h-[calc(100%-4rem)] w-full">
				<div className="flex flex-col-reverse min-h py-6 scroll-smooth overflow-y-auto overflow-x-hidden h-full pl-4 w-full items-center">
					<div ref={messagesBottomRef}></div>
					{messages?.map((message, index, allMessages) => {
						lastMessageAuthor = allMessages[index + 1]?.sender;

						return (
							<Message
								usersInfo={usersInfo}
								key={message.id}
								message={message}
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
