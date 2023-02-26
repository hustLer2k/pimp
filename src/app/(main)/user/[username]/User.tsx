import "server-only";

import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import ProfileDescription from "./ProfileDescription";

export default function Example({
	curUsername,
	name,
	username,
	avatar,
	bio,
}: {
	curUsername: string;
	name: string | null;
	username: string | null;
	avatar: string | null;
	bio: string | null;
}) {
	let chatContent;

	let viewingThemselves = curUsername === username;
	chatContent = (
		<Link
			className="inline-flex text-lg font-bold items-center justify-center text-purple-800 dark:text-white"
			href={`/user/${username}/chat`}
		>
			{!viewingThemselves && (
				<>
					Chat
					<span className="ml-1">
						<ChatBubbleOvalLeftEllipsisIcon
							className="w-6 h-6"
							aria-hidden="true"
						/>{" "}
					</span>
				</>
			)}
		</Link>
	);

	return (
		<div className="h-full overflow-auto">
			<div className="flex flex-col md:flex-row mt-20 sm:mt-4 justify-between pr-[20vw] px-[15vw] items-center lg:mt-[10vh]">
				<div className="py-5">
					<h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
						{name}
					</h3>
					<p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
						{username}
					</p>
				</div>
				<Avatar
					username={username}
					avatar={avatar}
					size={100}
					priority
				/>
			</div>
			<div className="ml-[15vw] mt-10 md:my-2">{chatContent}</div>

			{bio !== null && (
				<ProfileDescription
					bio={bio}
					viewingThemselves={viewingThemselves}
					username={curUsername}
				/>
			)}
		</div>
	);
}
