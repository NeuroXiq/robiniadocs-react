/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/',
                destination: '/home'
            }
        ]
    },
    serverRuntimeConfig: {

    },
    publicRuntimeConfig: {
        apiUrl: 'https://www.localhost:7111/'
    },
    output: 'standalone',
    env: {
        NEXTJS_ROBINIADOCS_ENV: process.env.NEXTJS_ROBINIADOCS_ENV
    }
}

module.exports = nextConfig
