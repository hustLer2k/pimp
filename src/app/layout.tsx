import "server-only";
import { Inter } from "@next/font/google";
import "./globals.css";

import SupabaseListener from "../components/store/supa-listener";
import SupabaseProvider from "../components/store/supa-provider";
import { createClient } from "../utils/supa-server";

export const revalidate = 0;

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

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
		<html lang="en" className={inter.className + "h-full bg-gray-50"}>
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
