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

			{
				protocol: "https",
				hostname: "tenor.com",
			},
		],
		dangerouslyAllowSVG: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

module.exports = nextConfig;
