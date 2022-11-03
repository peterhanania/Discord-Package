/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
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
  }
};

module.exports = nextConfig;
