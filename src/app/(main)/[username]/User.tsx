import "server-only";

import Chat from "./Chat";
import Avatar from "@/components/ui/Avatar";
import ProfileDescription from "./ProfileDescription";

export default function Example({
	curId,
	name,
	username,
	avatar,
	bio,
	id: userId,
}: {
	curId: string;
	name: string | null;
	username: string | null;
	avatar: string | null;
	bio: string | null;
	id: string;
}) {
	if (!username) throw new Error("Couldn't fetch username.");

	let viewingThemselves = curId === userId;

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

			{!viewingThemselves && (
				// @ts-ignore
				<Chat username={username} curId={curId} userId={userId} />
			)}

			{bio !== null && (
				<ProfileDescription
					bio={bio}
					viewingThemselves={viewingThemselves}
					userId={userId}
				/>
			)}
		</div>
	);
}
