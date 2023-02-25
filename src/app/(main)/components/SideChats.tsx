"use client";
import { useState, useEffect } from "react";
import { useSupabase } from "@/components/store/supa-provider";
import SideBarIcon from "./SideBarIcon";
import Avatar from "@/components/ui/Avatar";

type ChatInfo = { avatar: string | null; username: string };
import { Database } from "@/lib/database.types";
type Conversation = Database["public"]["Tables"]["conversations"]["Row"];

export default function SideChats({
	serverChats,
	otherUsers: serverOtherUsers,
	curUserId,
}: {
	serverChats: ChatInfo[];
	otherUsers: Array<string>;
	curUserId: string;
}) {
	const [chats, setChats] = useState(serverChats);
	const [otherUsers] = useState(new Set(serverOtherUsers));
	const { supabase } = useSupabase();

	const SidebarIcons: JSX.Element[] = [];
	chats.map(({ username, avatar }) =>
		SidebarIcons.push(
			<SideBarIcon
				key={username}
				text={username}
				href={`/user/${username}/chat`}
				icon={<Avatar username={username} avatar={avatar} />}
			/>
		)
	);

	useEffect(() => {
		console.log(228);

		const channel = supabase
			.channel("*")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "conversations",
				},
				async (payload: { new: Conversation }) => {
					let conversation = payload.new;
					console.log(conversation);

					if (!conversation.participants_ids.includes(curUserId))
						return;

					let otherId = conversation.participants_ids.find(
						(participantId) => participantId != curUserId
					)!;

					if (!otherUsers.has(otherId)) {
						const { data } = await supabase
							.from("profiles")
							.select("avatar, username")
							.eq("id", otherId)
							.single();

						if (!data || !data.username) return;

						setChats((chats) => [
							...chats,
							{
								avatar: data.avatar,
								username: data.username!,
							},
						]);
						otherUsers.add(otherId);
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	return SidebarIcons;
}
