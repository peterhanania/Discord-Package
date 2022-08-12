/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function fof() {
  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <div className="flex items-center flex-col justify-center lg:flex-row py-28 px-6 md:px-24 lg:px-24 md:py-20 lg:py-32 gap-16 lg:gap-28">
          <div className="w-full lg:w-1/4">
            <img
              className="hidden lg:block"
              src="/discord-package.png"
              alt=""
            />
            <img
              className="hidden md:block lg:hidden"
              src="/discord-package.png"
              alt=""
            />
            <img className="md:hidden" src="/discord-package.png" alt="" />
          </div>
          <div className="w-full lg:w-1/2">
            <h1 className="py-4 text-2xl lg:text-5xl md:text-4xl font-extrabold dark:text-white text-gray-800">
              An Error Occured
            </h1>
            <p className="pb-8 text-2xl dark:text-white text-gray-800 max-w-lg">
              An error has just occured, please consider reporting this issue to
              the discord server!
            </p>

            <a
              onClick={() => {
                window.location.reload();
              }}
              className="cursor-pointer button-green"
              style={{
                padding: "10px 40px",
              }}
            >
              Refresh
            </a>

            <Link href="/discord">
              <a
                className="cursor-pointer button-green ml-3"
                style={{
                  padding: "10px 40px",
                }}
              >
                Join the Discord Server
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
