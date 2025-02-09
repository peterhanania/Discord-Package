/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  output: 'export',
  sassOptions: {
    includePaths: [path.join(__dirname, "pages/styles")],
  },
  images: {
    unoptimized: true,
    domains: [
      "cdn.discordapp.com",
      "i.imgur.com",
      "better-default-discord.netlify.app",
    ],
  }
};

module.exports = nextConfig;
