import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function Example({
	name,
	username,
	avatar,
	userId1,
	userId2,
}: {
	name: string;
	username: string;
	avatar: string;
	userId1: string | undefined;
	userId2: string;
}) {
	let chatContent;
	if (userId1) {
		chatContent = (
			<Link
				className="inline-flex text-lg font-bold items-center justify-center text-purple-800 dark:text-white"
				href={{
					pathname: "/user/userId1/chat",
					query: { userId2 },
				}}
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
	} else {
		chatContent = <p>Sign in to chat</p>;
	}

	return (
		<>
			<div className="overflow-scroll bg-background flex mt-20 sm:mt-4 justify-between pr-[20vw] px-[15vw]">
				<div className="py-5">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						{name}
					</h3>
					<p className="mt-1 max-w-2xl text-sm text-gray-500">
						{username}
					</p>
				</div>
				<Image
					src={avatar}
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
