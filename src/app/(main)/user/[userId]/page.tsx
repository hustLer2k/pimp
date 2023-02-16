import { createClient } from "@/utils/supa-server";

export default function User({ params }: { params: { userId: string } }) {
	console.log(params);
	return (
		<h2 className="my-10 text-center text-cyan-600 text-3xl">
			{params.userId}
		</h2>
	);
}

export async function generateStaticParams() {
	const supabase = createClient();

	const { data, error } = await supabase.from("profiles").select("username");
	console.log(error);
	console.log(data);

	return [{ userId: "fokyou" }];
}
