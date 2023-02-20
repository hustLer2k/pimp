/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		appDir: true,
	},

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "tynmutxkvlatvpubyvrx.supabase.co",
			},
		],
		dangerouslyAllowSVG: true,
	},
};

module.exports = nextConfig;
