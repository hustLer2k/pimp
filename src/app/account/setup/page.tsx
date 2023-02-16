"use client";

import Previewer from "./Previewer";
import { useCallback, useState, useRef } from "react";
import Input, { InputRef } from "@/components/ui/Input";
import { useSupabase } from "@/components/store/supa-provider";
import getUserId from "@/utils/get-user-id";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

export type Avatar = {
	payload: File | Uint8Array;
	extension: string;
};

const usernameValidator = (value: string) => {
	if (value.length < 6) {
		return [
			false,
			"Please use a username that is at least 6 characters long",
		] as const;
	}
	return [
		/^[\w$+=.-]{6,}$/.test(value),
		"Only letters, digits and $, +, =, -, _, . characters are allowed",
	] as const;
};

const nameValidator = (value: string) => {
	if (value.length < 4) {
		return [
			false,
			"Please use a name that is at least 4 characters long",
		] as const;
	}
	return [
		/^[\p{L}\s]{4,}$/u.test(value),
		"Only letters are allowed",
	] as const;
};

export default function AccountSetup() {
	let { supabase } = useSupabase();
	const router = useRouter();

	const usernameRef = useRef<InputRef>(null);
	const nameRef = useRef<InputRef>(null);

	const [name, setName] = useState("");
	const [avatar, setAvatar] = useState<null | Avatar>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleAvatarChange = useCallback((avatar: Avatar) => {
		setAvatar(avatar);
	}, []);

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(usernameRef.current!.isValid);
		console.log(nameRef.current!.isValid);

		if (!(usernameRef.current!.isValid && nameRef.current!.isValid)) {
			return;
		}

		let userID = await getUserId(supabase);
		const { payload, extension } = avatar as Avatar;

		const bucketPath = `${userID}/avatar.${extension}`;

		const avatarUploadPromise = supabase.storage
			.from("avatars")
			.upload(bucketPath, payload, {
				upsert: true,
				contentType:
					extension === "svg" ? "image/svg+xml" : payload.type,
			});
		const infoUploadPromise = supabase.from("profiles").upsert({
			id: userID,
			name: name.trim(),
			username: usernameRef.current!.value,
			avatar: `https://tynmutxkvlatvpubyvrx.supabase.co/storage/v1/object/public/avatars/${bucketPath}`,
		});

		setIsLoading(true);
		const [
			{ data: dataAvatar, error: errorAvatar },
			{ data: dataInfo, error: errorInfo },
		] = await Promise.all([avatarUploadPromise, infoUploadPromise]);

		let error = errorAvatar || errorInfo;
		if (error) {
			if (error.message.indexOf("duplicate") !== -1)
				setError("Username already exists");
			else setError(error.message);

			setIsLoading(false);
			return;
		}

		router.replace("/");
	};

	return (
		<form
			className="flex flex-col min-h-full items-center py-10 lg:py-40"
			onSubmit={submitHandler}
		>
			<div className="w-full max-w-md space-y-9">
				<h2 className="text-gray-900 text-center text-3xl font-bold tracking-tight">
					Account setup
				</h2>

				<Input
					label="Username (unique identifier). $ + = - _ . characters are allowed"
					predicate={usernameValidator}
					labelVisible={true}
					inputOptions={{
						placeholder: "Not less than 6 characters",
						minLength: 6,
						className: "rounded-",
					}}
					ref={usernameRef}
				/>

				<Input
					label="Name. Only letters are allowed"
					predicate={nameValidator}
					labelVisible={true}
					inputOptions={{
						placeholder: "Not less than 4 characters",
						minLength: 4,
						onChange: (event) => setName(event.target.value),
					}}
					ref={nameRef}
				/>
				{error && (
					<p className="text-sm text-rose-600 font-mono tracking-tight font-semibold text-center">
						{error}
					</p>
				)}
			</div>

			<Previewer seed={name.trim()} onAvatarChange={handleAvatarChange} />
			<p className="text-center text-small text-purple-700 font-mono font-semibold mb-2 tracking-tight">
				Accepted filetypes: svg, jpg, jpeg, png, gif
			</p>

			{isLoading ? (
				<LoadingSpinner />
			) : (
				<button
					type="submit"
					className="bg-purple-600 border-transparent text-white rounded-md border py-2 px-4 text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
				>
					Proceed
				</button>
			)}
		</form>
	);
}
