"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import getExtension from "@/utils/get-extension";
import botAvatar from "@public/bot.svg";
import { Database } from "@/lib/database.types";
import { roboto_mono } from "@/components/ui/fonts";
import { useSupabase } from "@/components/store/supa-provider";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type User = Database["public"]["Tables"]["profiles"]["Row"];

const DateFormat = new Intl.DateTimeFormat(undefined, {
	hour12: false,
	month: "short",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
}).format;
const IMAGE_EXTENSIONS = new Set([
	".png",
	".svg",
	".webp",
	".jpg",
	".jpeg",
	".gif",
]);

export default function Message({
	message,
	curUser,
	recipientUser,
	showProfile = true,
	lastMessageDate,
}: {
	message: Message;
	curUser: User | null;
	recipientUser: User | null;
	showProfile: boolean;
	lastMessageDate: string | null;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [attachments, setAttachments] = useState<JSX.Element[]>([]);
	const [attachmentIds] = useState(new Set<string>());
	const { supabase } = useSupabase();

	const curUserID = curUser?.id;
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
		if (message.attachments) {
			message.attachments.forEach(async (attachment) => {
				if (attachmentIds.has(attachment)) return;

				attachmentIds.add(attachment);
				let content: JSX.Element;

				const { data, error } = await supabase.storage
					.from("attachments")
					.download(attachment);
				error && console.error(error);
				if (!data) return;

				const dataURL = window.URL.createObjectURL(data);

				if (IMAGE_EXTENSIONS.has(getExtension(attachment))) {
					content = (
						<Image
							src={dataURL}
							width={228}
							height={228}
							alt="Attached image"
							priority={true}
							placeholder="empty"
							loading="eager"
						/>
					);
				} else {
					content = <div key={attachment}>{attachment}</div>;
				}

				setAttachments((prevAttachments) =>
					prevAttachments.concat(
						<Link
							key={attachment}
							href={dataURL}
							download={attachment + getExtension(attachment)}
							className="my-3 block"
						>
							{content}
						</Link>
					)
				);
			});
		}
	}, [message.attachments]);

	return (
		<div
			key={message.id}
			className={`${
				message.sender === curUserID ? "self-start" : "self-start"
			} mb-6 w-4/5 lg:w-3/5 mx-auto`}
		>
			{showProfile && (
				<div className="flex items-center mb-2">
					<Image
						src={userInfo?.avatar ? userInfo.avatar : botAvatar}
						alt={`${userInfo ? userInfo.username : ""} avatar`}
						width={50}
						height={50}
						className="rounded-full dark:brightness-90 mr-3"
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
			<div className="text-gray-800 font-medium break-words overflow-hidden dark:text-gray-100 pl-16">
				{showDate && !showProfile && dateJsx}
				{message.payload}
				{attachments}
			</div>
		</div>
	);
}
