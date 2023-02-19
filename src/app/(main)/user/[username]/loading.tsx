import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { roboto_mono } from "@/components/ui/fonts";

export default function LoadingPage() {
	return (
		<div className="flex flex-col items-center mt-[30vh]">
			<h2
				className={`text-grey-600 mt-6 text-center text-3xl tracking-tight ${roboto_mono.className} font-bold`}
			>
				Loading...
			</h2>
			<LoadingSpinner size={228} stroke={"#5E1F8F"} />
		</div>
	);
}
