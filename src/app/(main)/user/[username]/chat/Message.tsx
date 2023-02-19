"use client";

import Image from "next/image";
import { Database } from "@/lib/database.types";
import botAvatar from "@public/bot.svg";
type Message = Database["public"]["Tables"]["messages"]["Row"];
type User = Database["public"]["Tables"]["profiles"]["Row"];
import { roboto_mono } from "@/components/ui/fonts";
import { useRef, useEffect } from "react";

const DateFormat = new Intl.DateTimeFormat("en-us", {
	dateStyle: "medium",
	timeStyle: "short",
}).format;

export default function Message({
	message,
	curUserID,
	curUser,
	recipientUser,
	showProfile = true,
	lastMessageDate,
}: {
	message: Message;
	curUserID: string;
	curUser: User | null;
	recipientUser: User | null;
	showProfile: boolean;
	lastMessageDate: string | null;
}) {
	const ref = useRef<HTMLDivElement>(null);

	const sentByCurrentUser = message.sender === curUserID;
	const userInfo = sentByCurrentUser
		? (curUser as unknown as User)
		: (recipientUser as unknown as User);

	const date = DateFormat(new Date(message.created_at));
	const dateJsx = (
		<p className="text-sm text-gray-700 dark:text-gray-400">{date}</p>
	);

	let showDate = true;
	if (lastMessageDate) {
		let lastDate = DateFormat(new Date(lastMessageDate));
		if (lastDate === date) showDate = false;
	}

	useEffect(() => {
		if (curUserID === message.sender)
			ref.current!.scrollIntoView({ block: "start", behavior: "smooth" });
	}, []);

	return (
		<div
			key={message.id}
			ref={ref}
			className={`${
				message.sender === curUserID ? "self-start" : "self-start"
			} mb-5`}
		>
			{showProfile && (
				<div className="flex items-center mb-2">
					<Image
						src={userInfo?.avatar ? userInfo.avatar : botAvatar}
						alt={`${userInfo ? userInfo.username : ""} avatar`}
						width={50}
						height={50}
						className="rounded-full dark:brightness-75 mr-3"
					/>
					<div className="flex flex-col justify-center">
						<p
							className={`${roboto_mono.className} font-bold text-base text-purple-800 dark:text-purple-300`}
						>
							{userInfo?.username}
						</p>
						{dateJsx}
					</div>
				</div>
			)}
			<div className="px-16 text-gray-800 font-medium break-words w-[70vw] overflow-hidden dark:text-gray-100">
				{showDate && !showProfile && dateJsx}
				{message.payload}
			</div>
		</div>
	);
}
