import Head from "next/head";
import { useEffect } from "react";

/* eslint-disable @next/next/no-img-element */
export default function DiscordRedirect() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "https://discord.gg/W2zPcgG9F5";
    }, 2000);
  }, []);

  return (
    <>
      <Head>
        <title>📦 Discord Package Discord 📦</title>
      </Head>
      <div className="h-screen flex justify-center items-center">
        <div className="flex items-center flex-col justify-center lg:flex-row py-28 px-6 md:px-24 lg:px-24 md:py-20 lg:py-32 gap-16 lg:gap-28">
          <div className="w-full lg:w-1/4">
            <img
              className="hidden lg:block"
              src={process.env.NEXT_PUBLIC_DOMAIN + "/discord-package.png"}
              alt=""
            />
            <img
              className="hidden md:block lg:hidden"
              src={process.env.NEXT_PUBLIC_DOMAIN + "/discord-package.png"}
              alt=""
            />
            <img
              className="md:hidden"
              src={process.env.NEXT_PUBLIC_DOMAIN + "/discord-package.png"}
              alt=""
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h1 className="py-4 text-4xl lg:text-6xl md:text-6xl font-extrabold dark:text-white text-gray-800">
              Redirecting...
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
