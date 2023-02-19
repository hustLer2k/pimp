import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import botImage from "@public/bot.svg";

export default function Example({
	name,
	username,
	avatar,
}: {
	name: string | null;
	username: string | null;
	avatar: string | null;
}) {
	let chatContent;
	chatContent = (
		<Link
			className="inline-flex text-lg font-bold items-center justify-center text-purple-800 dark:text-white"
			href={`/user/${username}/chat`}
		>
			Chat
			<span className="ml-1">
				<ChatBubbleOvalLeftEllipsisIcon
					className="w-6 h-6"
					aria-hidden="true"
				/>{" "}
			</span>
		</Link>
	);

	return (
		<>
			<div className="bg-background flex mt-20 sm:mt-4 justify-between pr-[20vw] px-[15vw]">
				<div className="py-5">
					<h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
						{name}
					</h3>
					<p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
						{username}
					</p>
				</div>
				<Image
					priority
					src={avatar || botImage}
					alt={`${name}'s avatar`}
					width={100}
					height={100}
					className="rounded-full dark:brightness-75"
				/>
			</div>
			<div className="ml-[15vw]">{chatContent}</div>
		</>
	);
}
