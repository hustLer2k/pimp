"use client";

import { UserPlusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useSupabase } from "@/components/store/supa-provider";

import { Database } from "@/lib/database.types";
type Conversation = Database["public"]["Tables"]["conversations"]["Row"];

export default function Groups({
	conversations,
	userId,
	curId,
	username,
	curUsername,
}: {
	conversations: Conversation[];
	userId: string;
	curId: string;
	username: string;
	curUsername: string;
}) {
	const [showConversations, setShowConversations] = useState(false);
	const [error, setError] = useState("");

	const { supabase } = useSupabase();

	const toggleShow = () => setShowConversations((prevShow) => !prevShow);

	async function createConversation() {
		const { data: existing, error: errExisting } = await supabase
			.from("conversations")
			.select("name")
			.eq("group", true)
			.or(
				`participants_ids.eq.{"${curId}","${userId}"},participants_ids.eq.{"${userId}","${curId}"}`
			);

		if (errExisting) {
			console.error(errExisting);
			setError(errExisting.message);
			return;
		}
		console.log("existing", existing);

		if (existing?.length) {
			setError(
				`The same conversation ${existing[0].name} already exists.`
			);
			return;
		}

		const { data, error } = await supabase.from("conversations").insert({
			participants_ids: [curId, userId],
			creator_id: curId,
			group: true,
			name: `${curUsername}, ${username}`,
		});

		if (error) {
			console.error(error);
			setError(error.message);
			return;
		}
		console.log(data);
	}

	async function addToConversation(
		conversationId: string,
		participants: string[]
	) {
		const { error } = await supabase
			.from("conversations")
			.update({ participants_ids: [...participants, userId] })
			.eq("id", conversationId);

		if (error) {
			console.error(error);
			setError(error.message);
		}
	}

	return (
		<div>
			<button onClick={toggleShow}>
				Add to a group chat
				<span className="mx-1 inline-block">
					<UserGroupIcon className="w-6 h-6 translate-y-1" />
				</span>
			</button>

			{error && <p className="text-rose-500 text-sm">{error}</p>}

			{showConversations && (
				<div className="my-2 shadow rounded border border-slate-300 divide-purple-300 divide-y-2 w-5/6 md:w-1/3 overflow-auto">
					{conversations.map((conversation, index) => (
						<div
							key={conversation.id}
							className="flex justify-between cursor-pointer p-2 hover:bg-purple-200"
							role="button"
							aria-pressed="false"
							tabIndex={index + 1}
							onClick={() =>
								addToConversation(
									conversation.id,
									conversation.participants_ids
								)
							}
						>
							{conversation.name}{" "}
							<UserPlusIcon className="w-6 h-6 inline-block" />
						</div>
					))}

					<div
						className="flex justify-between cursor-pointer p-2 hover:bg-purple-200"
						onClick={createConversation}
						role="button"
						aria-pressed="false"
						tabIndex={0}
					>
						New <PlusIcon className="h-6 w-6 inline-block" />
					</div>
				</div>
			)}
		</div>
	);
}
