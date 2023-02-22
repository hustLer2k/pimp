import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";

export default function Example({
	curUsername,
	name,
	username,
	avatar,
}: {
	curUsername: string;
	name: string | null;
	username: string | null;
	avatar: string | null;
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
				<Avatar
					username={username}
					avatar={avatar}
					size={100}
					priority
				/>
			</div>
			<div className="ml-[15vw]">{chatContent}</div>
		</>
	);
}
