import "server-only";

import { sans } from "@/components/ui/fonts";
import "./globals.css";

import SupabaseListener from "../components/store/supa-listener";
import SupabaseProvider from "../components/store/supa-provider";
import { createClient } from "../utils/supa-server";

export const revalidate = 0;

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return (
		<html lang="en" className={sans.className + " h-full"}>
			<head></head>
			<body className="h-full">
				<SupabaseProvider>
					<SupabaseListener
						serverAccessToken={session?.access_token}
					/>
					{children}
				</SupabaseProvider>
			</body>
		</html>
	);
}
