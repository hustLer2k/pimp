"use client";
import "client-only";

import { FaSun, FaMoon } from "react-icons/fa";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/store/supa-provider";

function setDarkmode(darkmode: boolean) {
	if (darkmode) document.documentElement.classList.add("dark");
	else document.documentElement.classList.remove("dark");
}

const THEME_MODES = {
	0: "Change to dark theme (current: sync with os)",
	1: "Change to light theme (current: dark)",
	2: "Change to sync with os (current: light)",
};
const ICON_OPTIONS = {
	size: "24",
	className: "top-navigation-icon",
};
let timer: ReturnType<typeof setTimeout> | null = null;

const ThemeIcon = ({
	darkMode,
	userId,
}: {
	darkMode: number | undefined | null;
	userId: string | undefined;
}) => {
	const { supabase } = useSupabase();

	const [themeMode, setTheme] = useState<0 | 1 | 2>((darkMode as 1 | 2) || 0);

	const handleMode = () => {
		const newTheme: 0 | 1 | 2 = ((themeMode + 1) % 3) as 0 | 1 | 2;

		setTheme(newTheme);

		if (userId) {
			if (timer) clearTimeout(timer);

			timer = setTimeout(
				() =>
					supabase
						.from("profiles")
						.update({ darkmode: newTheme })
						.eq("id", userId)
						.then(() => {}),
				5000
			);
		}
	};

	useEffect(() => {
		const darkOn =
			(themeMode !== 0 ? themeMode === 1 : null) ??
			window.matchMedia("(prefers-color-scheme: dark)").matches;

		if (themeMode === 0) {
			window
				.matchMedia("(prefers-color-scheme: dark)")
				.addEventListener("change", ({ matches }) => {
					setDarkmode(matches);
				});
		}

		setDarkmode(darkOn);
	}, [themeMode]);

	let Icon =
		themeMode === 0
			? FaMoon
			: themeMode === 1
			? FaSun
			: HiOutlineDesktopComputer;

	return (
		<span onClick={handleMode}>
			{<Icon title={THEME_MODES[themeMode]} {...ICON_OPTIONS} />}
		</span>
	);
};

export default ThemeIcon;
