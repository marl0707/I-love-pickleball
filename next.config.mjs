/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/pickleball',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },

};

export default nextConfig;
