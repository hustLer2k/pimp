"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import getExtension from "@/utils/get-extension";
import { Database } from "@/lib/database.types";
import { roboto_mono } from "@/components/ui/fonts";
import { useSupabase } from "@/components/store/supa-provider";
import { FolderArrowDownIcon } from "@heroicons/react/24/outline";
import Avatar from "@/components/ui/Avatar";

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
	const [attachments, setAttachments] = useState<JSX.Element[]>([]);
	const [attachmentIds] = useState(new Set<string>());
	const [userInfo, setUserInfo] = useState<User | null>(null);

	const { supabase } = useSupabase();

	useEffect(() => {
		supabase
			.from("profiles")
			.select()
			.eq("id", message.sender)
			.single()
			.then(({ data, error }) => {
				if (error) console.error(error);
				if (data) setUserInfo(data);
			});

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
							className="w-auto h-auto"
							alt="Attached image"
							placeholder="empty"
							loading="eager"
						/>
					);
				} else {
					content = (
						<div key={attachment}>
							<FolderArrowDownIcon className="w-10 h-10 inline-block mr-2" />
							{attachment}
						</div>
					);
				}

				setAttachments((prevAttachments) =>
					prevAttachments.concat(
						<Link
							key={attachment}
							href={dataURL}
							download={attachment}
							className="my-4 block"
							target="_blank"
						>
							{content}
						</Link>
					)
				);
			});
		}
	}, [message.attachments, message.sender]);

	const date = DateFormat(new Date(message.created_at));
	const dateJsx = (
		<p className="text-sm text-gray-700 dark:text-gray-400">{date}</p>
	);

	let showDate = true;
	if (lastMessageDate) {
		let lastDate = DateFormat(new Date(lastMessageDate));
		if (lastDate === date) showDate = false;
	}

	return (
		<div key={message.id} className="mb-6 w-4/5 lg:w-3/5 mx-auto">
			{showProfile && (
				<div className="flex items-center mb-2">
					<Avatar
						username={userInfo?.username}
						avatar={userInfo?.avatar}
						size={50}
						classes="mr-3"
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
