"use client";
import { useState, useEffect } from "react";
import { useSupabase } from "@/components/store/supa-provider";
import SideBarIcon from "./SideBarIcon";
import Avatar from "@/components/ui/Avatar";

import { Database } from "@/lib/database";
type Conversation = Database["public"]["Tables"]["conversations"]["Row"];

export default function SideChats({
	serverChats,
	chatIds: serverChatIds,
	curUserId,
}: {
	serverChats: { avatar: string[]; username: string[]; id: string }[];
	chatIds: Array<string>;
	curUserId: string;
}) {
	const [chats, setChats] = useState(serverChats);
	const [chatIds] = useState(new Set(serverChatIds));
	const { supabase } = useSupabase();

	const SidebarIcons: JSX.Element[] = [];
	chats.map(({ username, avatar, id }, i) =>
		SidebarIcons.push(
			<SideBarIcon
				key={i}
				text={username.join(", ")}
				href={`/${id}/chat`}
				icon={username.map((user, i) => (
					<Avatar key={i} avatar={avatar[i]} username={user} />
				))}
			/>
		)
	);

	useEffect(() => {
		const channel = supabase
			.channel("*")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "conversations",
					filter: "group=eq.false",
				},
				async (payload: { new: Conversation }) => {
					let conversation = payload.new;

					if (
						!conversation.participants_ids.includes(curUserId) ||
						chatIds.has(conversation.id)
					)
						return;

					let currentIdIndex =
						conversation.participants_ids.indexOf(curUserId);
					let otherIds = conversation.participants_ids.filter(
						(_, i) => i != currentIdIndex
					);

					let avatars: string[] = [];
					let usernames: string[] = [];

					for (let otherId of otherIds) {
						const { data } = await supabase
							.from("profiles")
							.select("avatar, username")
							.eq("id", otherId)
							.single();

						if (!data || !data.username || !data.avatar) return;
						avatars.push(data.avatar);
						usernames.push(data.username);
					}

					setChats((chats) => [
						...chats,
						{
							avatar: avatars,
							username: usernames,
							id: conversation.id,
						},
					]);

					chatIds.add(conversation.id);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [curUserId, supabase]);

	return SidebarIcons;
}
