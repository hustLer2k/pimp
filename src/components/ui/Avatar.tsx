import Image from "next/image";
import botAvatar from "@public/bot.svg";

export default function Avatar({
	avatar,
	username,
	size = 48,
	classes = "",
	priority = false,
}: {
	avatar: string | null | undefined;
	username: string | null | undefined;
	size?: number;
	classes?: string;
	priority?: boolean;
}) {
	return (
		<Image
			src={avatar || botAvatar}
			alt={username ? `${username}'s avatar` : "Avatar"}
			width={size}
			height={size}
			className={"rounded-full dark:brightness-90 " + classes}
			priority={priority}
		/>
	);
}
