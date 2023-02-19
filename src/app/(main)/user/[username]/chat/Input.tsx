"use client";
import { useRef, useEffect } from "react";
import { useSupabase } from "@/components/store/supa-provider";

export default function Input({
	curUserID,
	recipientId,
}: {
	curUserID: string;
	recipientId: string;
}) {
	const { supabase } = useSupabase();
	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		supabase
			.from("profiles")
			.select("name")
			.eq("id", recipientId)
			.single()
			.then(({ data, error }) => {
				if (error) {
					console.error(error);
				} else {
					inputRef?.current &&
						(inputRef.current.placeholder = `Message ${data.name}`);
				}
			});

		document.addEventListener("keyup", (e: KeyboardEvent) => {
			if (e.key !== "Enter") return;

			inputRef.current?.focus();
		});
	}, []);

	async function sendMessage(payload: string) {
		let { error } = await supabase
			.from("messages")
			.insert({ sender: curUserID, recipient: recipientId, payload });

		error && console.error(error);
	}

	function keyUpHandler(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key !== "Enter") return;

		let input = inputRef?.current;
		if (!input || !input.value) return;

		sendMessage(input.value.trim());
		input.value = "";
		input.style.height = "42px";
	}

	function changeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
		const textElement = event.target;

		textElement.value = textElement.value.replace("\n", " ");

		if (textElement.value == "") textElement.style.height = "42px";
		else
			textElement.style.height =
				(textElement.scrollHeight === 40
					? 42
					: textElement.scrollHeight) + "px";
	}

	return (
		<div className="fixed bottom-0 bg-gray-50 w-[calc(100%-4rem)] flex items-center justify-center min-h-[4rem] max-h-60 overflow-hidden">
			<textarea
				className="m-0 max-h-60 w-[70vw] bg-gray-300 rounded-lg outline-transparent px-10 block border-transparent focus:border-gray-200 focus:bg-gray-200 focus:ring-0 resize-none overflow-auto"
				onKeyUp={keyUpHandler}
				onChange={changeHandler}
				ref={inputRef}
				maxLength={993}
				style={{ height: "42px" }}
			/>
		</div>
	);
}
