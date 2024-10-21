/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.module.rules.push({
          test: /\.(mp3)$/,
          type: 'asset/resource',
        });
        return config;
      },
    images: {
        remotePatterns: [
            {
                hostname: 'localhost',
                port: '8000',
                protocol: 'http',
                pathname: '/storage/**',
            },
        ],
    },
};

export default nextConfig;
