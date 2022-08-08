/** @type {import('next').NextConfig} */
const nextConfig = {
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
