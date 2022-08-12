/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  sassOptions: {
    includePaths: [path.join(__dirname, "pages/styles")],
  },
  images: {
    domains: [
      "upload.wikimedia.org",
      "cdn.discordapp.com",
      "i.imgur.com",
      "better-default-discord.netlify.app",
    ],
  },
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/W2zPcgG9F5",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
