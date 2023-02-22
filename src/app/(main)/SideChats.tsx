"use client";
import { useState, useEffect } from "react";
import { useSupabase } from "@/components/store/supa-provider";
import SideBarIcon from "./SideBarIcon";

export default function SideChats({
	serverChats,
}: {
	serverChats: JSX.Element[];
}) {
	const [chats, setChats] = useState(serverChats);
	const { supabase } = useSupabase();

	const SidebarIcons = [];
	const otherUsers = new Set();

	// useEffect(() => {
	// 	const channel = supabase
	// 		.channel("*")
	// 		.on(
	// 			"postgres_changes",
	// 			{ event: "INSERT", schema: "public", table: "posts" },
	// 			(payload) =>
	// 				setPosts((posts) => [...posts, payload.new as Post])
	// 		)
	// 		.subscribe();

	// 	return () => {
	// 		supabase.removeChannel(channel);
	// 	};
	// }, []);

	return chats;
}
