"use client";
import { useState, useEffect } from "react";
import { useSupabase } from "@/components/store/supa-provider";

let first = true;

export default function ProfileDescription({
	bio,
	viewingThemselves,
	userId,
}: {
	bio: string;
	viewingThemselves: boolean;
	userId: string;
}) {
	const shown = bio || viewingThemselves;
	const { supabase } = useSupabase();

	const [description, setDescription] = useState(bio);

	useEffect(() => {
		if (!viewingThemselves || !description) return;

		let timer = setTimeout(async () => {
			const { error } = await supabase
				.from("profiles")
				.update({ bio: description.trim() })
				.eq("id", userId);
		}, 3333);

		return () => clearTimeout(timer);
	}, [description, supabase, userId, viewingThemselves]);

	const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(e.target.value);
	};

	if (shown)
		return (
			<textarea
				disabled={!viewingThemselves}
				onChange={changeHandler}
				value={description}
				placeholder="Edit your profile description..."
				rows={5}
				className="mt-10 block w-4/5 md:w-2/5 dark:text-slate-300 text-slate-800 my-5 mx-auto shadow dark:bg-gray-600/60 bg-gray-200 p-4 rounded break-words focus:outline-none focus:ring-0 ring-0 outline-none resize-none border-0"
			></textarea>
		);
	else return null;
}
