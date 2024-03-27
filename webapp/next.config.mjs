/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		domains: ['lh3.googleusercontent.com', 'phfccmyglvvheufxqdko.supabase.co'],
		formats: ['image/webp'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
	webpack: (config) => {
		config.resolve.fallback = { fs: false, net: false, tls: false };
		config.externals.push(
			'pino-pretty',
			'lokijs',
			'encoding',
			'bufferutil',
			'utf-8-validate'
		);
		return config;
	},
};

export default nextConfig;
