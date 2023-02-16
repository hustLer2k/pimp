"use client";
import { createAvatar } from "@dicebear/core";
import * as avatars from "@dicebear/collection";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import botImage from "@public/bot.svg";

import { Avatar } from "./page";

const ACCEPTED_FILETYPES = new Set(["svg", "png", "jpg", "jpeg", "gif"]);
const ARROW_CLASSES =
	"w-8 h-8 text-gray-500 my-auto mx-8 cursor-pointer hover:text-purple-700";

const AVATAR_STYLES = Object.keys(avatars);
AVATAR_STYLES[0] = "botttsNeutral";
AVATAR_STYLES[8] = "adventurer";
const STYLES_LENGTH = AVATAR_STYLES.length;
const encoder = new TextEncoder();

export default function Previewer({
	seed,
	onAvatarChange,
}: {
	seed: string;
	onAvatarChange: (avatar: Avatar) => void;
}) {
	let [avatarIndex, setAvatarIndex] = useState(0);
	let [avatar, setAvatar] = useState(botImage as string);
	let [error, setError] = useState("");

	let inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const avatar = createAvatar(avatars.botttsNeutral, {
			seed: "Angel",
			backgroundColor: ["1e88e5", "fdd835"],
			backgroundType: ["gradientLinear"],
			backgroundRotation: [-270],
			mouth: ["smile02"],
		});

		setAvatar(avatar.toDataUriSync());
		onAvatarChange({
			payload: encoder.encode(avatar.toString()),
			extension: "svg",
		});
	}, [onAvatarChange]);

	useEffect(() => {
		if (seed.length < 4) {
			return;
		}

		const avatarStyleName = AVATAR_STYLES[avatarIndex];
		let ava = createAvatar(avatars[avatarStyleName], {
			seed: seed,
			size: 128,
			radius: 50,
		});

		setAvatar(ava.toDataUriSync());
		onAvatarChange({
			payload: encoder.encode(ava.toString()),
			extension: "svg",
		});
	}, [seed, avatarIndex, onAvatarChange]);

	const fileChangeHandler = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		console.log(file.name);
		const extension = file.name.split(".").slice(-1)[0];
		console.log(extension);
		if (!ACCEPTED_FILETYPES.has(extension)) {
			setError(`Filetype not supported: ${extension}`);
			return;
		} else {
			setError("");
		}

		let avatarURI = URL.createObjectURL(file);
		setAvatar(avatarURI);

		onAvatarChange({ payload: file, extension });
	};

	return (
		<>
			<div className="text-center flex flex-row mt-8">
				<ArrowLeftIcon
					className={ARROW_CLASSES}
					onClick={() =>
						setAvatarIndex((prevState) =>
							--prevState % STYLES_LENGTH < 0
								? STYLES_LENGTH - 1
								: prevState % STYLES_LENGTH
						)
					}
				/>
				<div>
					<Image
						src={avatar}
						alt="Avatar"
						width={128}
						height={128}
						className="rounded-full"
					/>
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						className="relative -left-7 -top-5 bg-slate-800 text-white rounded-md opacity-75 text-sm px-1"
					>
						<PhotoIcon className="w-6 h-6 inline mr-1" />
						Upload
					</button>
					<input
						type="file"
						hidden
						onChange={fileChangeHandler}
						ref={inputRef}
						accept="image/*"
					/>
				</div>
				<ArrowRightIcon
					className={ARROW_CLASSES}
					onClick={() =>
						setAvatarIndex(
							(prevState) => ++prevState % STYLES_LENGTH
						)
					}
				/>
			</div>
			{error && (
				<p className="text-rose-500 text-sm font-mono tracking-tight">
					{error}
				</p>
			)}
		</>
	);
}
