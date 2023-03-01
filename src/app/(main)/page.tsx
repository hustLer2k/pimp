import { createClient } from "@/utils/supa-server";
import Avatar from "@/components/ui/Avatar";
import getUserId from "@/utils/get-user-id";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { roboto_mono } from "@/components/ui/fonts";
import Link from "next/link";

async function App() {
	const supabase = createClient();

	const userId = await getUserId(supabase);

	const { data, error } = await supabase
		.from("conversations")
		.select()
		.contains("participants_ids", [userId]);

	if (error) throw new Error(error.message);

	const usersInfo: {
		[id: string]: { username: string | null; avatar: string | null };
	} = {};

	for (let conversation of data) {
		for (let participantId of conversation.participants_ids) {
			if (!(participantId in usersInfo)) {
				const { data, error } = await supabase
					.from("profiles")
					.select("username, avatar")
					.eq("id", participantId)
					.single();

				if (error) throw new Error(error.message);

				usersInfo[participantId] = data;
			}
		}
	}

	return (
		<div className="h-full p-10">
			{data.map((conversation, i) => {
				const otherParticipantsIds =
					conversation.participants_ids.filter((id) => id != userId);

				const otherParticipantsInfo = otherParticipantsIds.map(
					(id) => usersInfo[id]
				);

				let conversationName = conversation.name;
				if (!conversationName) {
					conversationName = otherParticipantsInfo
						.map((info) => info.username)
						.join(", ");
				}

				return (
					<div
						key={conversation.id}
						className="flex justify-between items-center w-full min-h-[5rem] border border-gray-300 dark:border-gray-500 rounded-md p-5 mb-5"
					>
						<div className="flex flex-col md:flex-row justify-between items-center w-[85%]">
							<p
								className={
									roboto_mono.className +
									" font-semibold dark:text-gray-200"
								}
							>
								{conversationName}
							</p>

							<div className="flex items-center overflow-auto mt-2 md:mt-0">
								{otherParticipantsInfo.map((info, j) => (
									<Avatar
										key={j}
										avatar={info.avatar}
										username={info.username}
										classes="ml-1"
									/>
								))}
							</div>
						</div>

						<Link href={`/${conversation.id}/chat`}>
							<ChatBubbleLeftIcon className="h-8 w-8 text-gray-700 dark:text-white" />
						</Link>
					</div>
				);
			})}
		</div>
	);
}

export default App;
