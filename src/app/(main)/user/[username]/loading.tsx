import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function LoadingPage() {
	return (
		<div className="flex flex-col items-center lg:mt-48">
			<h2 className="text-grey-900 mt-6 text-center text-3xl font-bold tracking-tight">
				Loading user information...
			</h2>
			<LoadingSpinner size={228} stroke="#27005C" />
		</div>
	);
}
