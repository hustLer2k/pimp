"use client";

import { useRef, useEffect, useState } from "react";
import { useSupabase } from "@/components/store/supa-provider";
import { FolderArrowDownIcon } from "@heroicons/react/24/outline";
import { v4 } from "uuid";
import getExtension from "@/utils/get-extension";
import { roboto_mono } from "@/components/ui/fonts";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Database } from "@/lib/database.types";
type Message = Database["public"]["Tables"]["messages"]["Row"];

const DEFAULT_HEIGHT = "42px";

export default function Input({
	curUserID,
	recipientId,
	onSendMessage,
	conversationId: conversationIdNullable,
	chatName,
}: {
	curUserID: string;
	recipientId: string;
	onSendMessage: (message: Message) => void;
	conversationId: string | null | undefined;
	chatName: string | null | undefined;
}) {
	const { supabase } = useSupabase();

	const inputRef = useRef<HTMLTextAreaElement>(null);

	const [dragOver, setDragOver] = useState(false);
	const [attachments, setAttachments] = useState<File[]>([]);
	const [attachmentsNames, setAttachmentNames] = useState<string[]>([]);
	const [sending, setSending] = useState(false);
	let [conversationId, setConversationId] = useState(conversationIdNullable);

	useEffect(() => {
		// supabase
		// 	.from("profiles")
		// 	.select("name")
		// 	.eq("id", recipientId)
		// 	.single()
		// 	.then(({ data, error }) => {
		// 		if (error) {
		// 			console.error(error);
		// 		} else {
		// 			inputRef?.current &&
		// 				(inputRef.current.placeholder = `Message ${data.name}`);
		// 		}
		// 	});

		document.addEventListener("keyup", (e: KeyboardEvent) => {
			if (e.key !== "Enter") return;

			inputRef.current?.focus();
		});
	}, [recipientId, supabase]);

	async function sendMessage(payload: string) {
		if (!payload || sending) return;

		setSending(true);
		try {
			const attachmentsPaths: string[] = [];
			for (let file of attachments) {
				const filename = v4() + getExtension(file.name);
				const { data } = await supabase.storage
					.from("attachments")
					.upload(filename, file, {
						cacheControl: "31536000", // 1 year
					});

				if (data) attachmentsPaths.push(data.path);
			}

			if (!conversationId) {
				let { data, error } = await supabase
					.from("conversations")
					.insert({
						participants_ids: [curUserID, recipientId],
						creator_id: curUserID,
						group: false,
					})
					.select("id")
					.single();

				error && console.error(error);

				conversationId = data!.id;
				setConversationId(conversationId);
			}

			let message = {
				sender: curUserID,
				conversation_id: conversationId,
				payload,
				attachments: attachmentsPaths.length ? attachmentsPaths : null,
			};
			let { error } = await supabase.from("messages").insert(message);

			error && console.error(error);
			if (!error) {
				setAttachmentNames([]);
				setAttachments([]);
				onSendMessage({
					...message,
					created_at: new Date().toISOString(),
					id: v4(),
				});
			}
		} finally {
			setSending(false);
		}
	}

	function keyUpHandler(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key !== "Enter") return;

		let input = inputRef?.current;
		if (!input || !input.value) return;

		sendMessage(input.value.trim());
		input.value = "";
		input.style.height = DEFAULT_HEIGHT;
	}

	function changeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
		const textElement = event.target;

		textElement.value = textElement.value.replace("\n", " ");

		if (textElement.value == "") textElement.style.height = DEFAULT_HEIGHT;
		else
			textElement.style.height =
				(textElement.scrollHeight === 40
					? 42
					: textElement.scrollHeight) + "px";
	}

	// drag & drop
	function dropHandler(ev: React.DragEvent<HTMLDivElement>) {
		ev.preventDefault();

		if (ev.dataTransfer.items) {
			[...ev.dataTransfer.items].forEach(async (item, i) => {
				if (item.kind === "file") {
					const file = item.getAsFile();
					if (!file) return;

					setAttachments((prev) => [...prev, file]);
					setAttachmentNames((prev) => [...prev, file.name]);
				}
			});
		}

		setDragOver(false);
	}

	function dragoverHandler(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setDragOver(true);
	}

	function dragLeaveHandler(e: React.DragEvent<HTMLDivElement>) {
		setDragOver(false);
	}

	function removeAttachment(i: number) {
		setAttachments((prev) => prev.filter((_, index) => index !== i));
		setAttachmentNames((prev) => prev.filter((_, index) => index !== i));
	}

	return (
		<div
			onDrop={dropHandler}
			onDragOver={dragoverHandler}
			onDragLeave={dragLeaveHandler}
			className="bg-gray-50 dark:bg-gray-700 flex justify-center items-center min-h-[4rem] max-h-60 overflow-hidden"
		>
			<div className="overflow-auto mx-8 h-12 max-w-[30%]">
				{attachmentsNames.map((v, i) => (
					<div
						key={i}
						className={
							roboto_mono.className +
							" dark:text-gray-200 text-sm w-full flex items-center justify-between mb-1"
						}
					>
						<p className="w-10/12 break-all">{v}</p>
						<XMarkIcon
							className="w-6 h-6 dark:text-white"
							onClick={() => removeAttachment(i)}
						/>
					</div>
				))}
			</div>

			{dragOver && (
				<FolderArrowDownIcon
					className="w-16 h-16 dark:text-gray-50"
					title="Drag n drop"
				/>
			)}

			<textarea
				className={`m-0 max-h-60 w-[69%] bg-gray-300 dark:bg-gray-600 rounded-lg outline-transparent px-10 block border-transparent
			  	focus:bg-gray-200 dark:focus:bg-gray-800 focus:ring-0 resize-none overflow-auto
				  dark:text-white focus:border-transparent disabled:opacity-50 ${
						dragOver && "hidden"
					}`}
				onKeyUp={keyUpHandler}
				onChange={changeHandler}
				ref={inputRef}
				maxLength={993}
				style={{ height: DEFAULT_HEIGHT }}
				disabled={sending}
				placeholder={`Message ${chatName}`}
			/>
		</div>
	);
}
