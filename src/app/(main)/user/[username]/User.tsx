import { PaperClipIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Example({
	name,
	username,
	avatar,
}: {
	name: string;
	username: string;
	avatar: string;
}) {
	return (
		<div className="overflow-scroll bg-background flex mt-20 sm:mt-4 justify-between pr-[20vw] pl-[10vw]">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					{name}
				</h3>
				<p className="mt-1 max-w-2xl text-sm text-gray-500">
					{username}
				</p>
			</div>
			<Image
				src={avatar}
				alt={`${name}'s avatar`}
				width={100}
				height={100}
				className="rounded-full"
			/>
		</div>
	);
}
