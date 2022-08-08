/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const nextConfig = {
  assetPrefix: isProd ? '/your-github-repo-name/' : '',
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  images: {
    domains: [
      "upload.wikimedia.org",
      "cdn.discordapp.com",
      "i.imgur.com",
      "better-default-discord.netlify.app",
    ],
  },
}

module.exports = nextConfig
