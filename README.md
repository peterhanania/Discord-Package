<h1 align="center">
  <br>
  <a href="https://github.com/peterhanania"><img src="https://i.imgur.com/JXomrnb.png" alt="Discord Package Logo" width="700"></a>
  <br>
  Discord Package Explorer
  <br>
</h1>

<h4 align="center">A beautiful visualization tool for your Discord data package 🚀</h4>

<p align="center">
  <a href="https://github.com/peterhanania/Discord-Package/actions/workflows/nextjs.yml">
    <img src="https://github.com/peterhanania/Discord-Package/actions/workflows/nextjs.yml/badge.svg" alt="Build Status">
  </a>
  <a href="https://github.com/peterhanania/discord-package/blob/main/LICENSE.md">
    <img src="https://img.shields.io/badge/license-GPL-blue" alt="License">
  </a>
  <a href="https://discord.com/invite/W2zPcgG9F5">
    <img src="https://img.shields.io/discord/1000775219868352663?color=7289da&label=Discord&logo=discord&logoColor=white" alt="Discord">
  </a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#installation">Installation</a> •
  <a href="#contributors">Contributors</a>
</p>

## About

✨ Ever wondered what data Discord collects? Discord Package is an elegant tool that lets you visualize your Discord data package in a beautiful and interactive way. Share selected insights with friends and discover fascinating patterns in your Discord usage!

## Demo

<div align="center">
  <img src="https://i.imgur.com/MKWRWQo.png" alt="Screenshot 1" width="400">
  <img src="https://i.imgur.com/gkz1cZc.png" alt="Screenshot 2" width="400">
</div>

## Key Features

- 🎨 **Beautiful Visualization** - View your data in an intuitive and aesthetically pleasing interface
- 🔒 **Privacy Focused** - No data storage, pure client-side processing
- 📊 **Comprehensive Analytics** including:
  - User information and settings
  - Device preferences and server details
  - Platform connections
  - Discord spending and Nitro gifts
  - Messaging patterns and statistics
  - Guild membership details
  - Bot interactions
  - Language analysis (favorite words, links, etc.)

<details>
<summary>🔍 View Detailed Statistics</summary>

- Message Analytics
  - Top DMs and channels
  - Character count
  - Time spent analysis
  - Word frequency
  - Link sharing patterns
  
- Platform Usage
  - Login patterns
  - Device usage
  - Feature interaction
  
- Social Interactions
  - Friend requests
  - Guild participation
  - Voice channel activity
  
- And many more detailed metrics!
</details>

## Installation
When hosting locally or externally, make sure you change the `NEXT_PUBLIC_DOMAIN` environment variable in the `.env.local` file to your domain or it will use the default domain `https://discordpackage.com`.

- Local: Just edit it manually
- External: You need to customize it via the provider dashboard settings.
#### Using Docker

- Run `docker build -t discord-package-explorer .` to build the image.
- Run `docker run -p 3000:3000 discord-package-explorer` to start the app.

and you're good to go!

### Credits

Huge credits to [Andros2091](https://github.com/Androz2091) for the original [source](https://github.com/Androz2091/discord-data-package-explorer).

### Contributors

![image](https://contrib.rocks/image?repo=peterhanania/Discord-Package)
