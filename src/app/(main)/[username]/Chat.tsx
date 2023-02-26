import "server-only";

import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { roboto_mono } from "@/components/ui/fonts";
import Groups from "./Groups";
import { createClient } from "@/utils/supa-server";

export default async function Chat({
	username,
	curId,
	userId,
}: {
	username: string;
	curId: string;
	userId: string;
}) {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("conversations")
		.select()
		.eq("creator_id", curId)
		.eq("group", true)
		.not("participants_ids", "cs", `{"${userId}"}`);

	error && console.error(error);

	const { data: curUserData } = await supabase
		.from("profiles")
		.select("username")
		.eq("id", curId)
		.single();

	if (!data || !curUserData) throw new Error("Something went wrong.");

	return (
		<div
			className={`${roboto_mono.className} font-semibold tracking-tight ml-[15vw] text-purple-800 dark:text-white`}
		>
			<Link href={`/${username}/chat`}>
				Chat
				<span className="mx-1 inline-block">
					<ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 translate-y-1" />
				</span>
			</Link>

			{data && (
				<Groups
					conversations={data}
					userId={userId}
					curId={curId}
					username={username}
					curUsername={curUserData.username!}
				/>
			)}
		</div>
	);
}
