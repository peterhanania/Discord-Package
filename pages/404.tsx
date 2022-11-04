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
              404
            </h1>
            <p className="pb-8 text-2xl dark:text-white text-gray-800 max-w-lg">
              The content you’re looking for doesn’t exist. Either it was
              removed, or you mistyped the link.
            </p>

            <Link href={process.env.NEXT_PUBLIC_DOMAIN!}>
              <a
                className="cursor-pointer button-green"
                style={{
                  padding: "10px 40px",
                }}
              >
                Go back to Homepage
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
