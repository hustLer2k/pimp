/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	mode: "jit",
	content: [
		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				purple: {
					50: "#f5f3ff",
					100: "#ede9fe",
					200: "#ddd6fe",
					300: "#c4b5fd",
					400: "#9553C6",
					500: "#642D8F",
					600: "#5E1F8F",
					700: "#58118F",
					800: "#27005C",
				},
				cyan: {
					50: "#ecfeff",
					100: "#cffafe",
					200: "#a5f3fc",
					300: "#67e8f9",
					400: "#22d3ee",
					500: "#06b6d4",
					600: "#0891b2",
					700: "#0e7490",
					800: "#155e75",
					900: "#164e63",
				},
				gray: {
					900: "#202225",
					800: "#2f3136",
					700: "#36393f",
					600: "#4f545c",
					400: "#d4d7dc",
					300: "#e3e5e8",
					200: "#ebedef",
					100: "#f2f3f5",
				},
			},
			spacing: {
				88: "22rem",
			},

			keyframes: {
				fadein: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},

				slideshow: {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(-100%)" },
				},
			},
			animation: {
				fadein: "fadein 300ms ease-in-out",
				slideshow: "slideshow 5s linear infinite alternate",
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("tailwind-scrollbar-hide"),
	],
};
