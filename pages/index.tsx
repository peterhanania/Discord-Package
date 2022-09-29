import Upload from "../components/Upload";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import GoogleAds from "components/ga";
import Tippy from "@tippyjs/react";
export default function Home() {
  return (
    <>
      <Head>
        <title>📦 Discord Package Explorer ✨</title>
      </Head>
      <div className="h-screen">
        <SnackbarProvider>
          <Upload />
        </SnackbarProvider>
      </div>
      <div className="h-screen mt-10 relative">
        <h1
          className="text-2xl text-black dark:text-white flex items-center justify-center uppercase"
          style={{
            fontFamily:
              "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
          }}
        >
          So, how does it work?
        </h1>

        <div className="mb-4">
          <div className="flex flex-col items-center justify-center ">
            <p className="text-black dark:text-white font-mono max-w-2xl">
              Discord Package allows you to view your data package just by
              uploading it. Once you upload your data package, our algorythm
              will work hard on calculating and rendering your statistics.
            </p>
          </div>
        </div>
        {process.env.NEXT_PUBLIC_SLOT_1 ? (
          <GoogleAds
            format="auto"
            slot={process.env.NEXT_PUBLIC_SLOT_1}
            responsive="true"
          />
        ) : (
          ""
        )}
        <h1
          className="mt-4 text-2xl text-black dark:text-white flex items-center justify-center uppercase"
          style={{
            fontFamily:
              "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
          }}
        >
          Feeling Stuck?
        </h1>
        <div className="flex flex-col items-center justify-center ">
          <p className="text-black dark:text-white font-mono max-w-2xl mb-2">
            Watch this video to get started
          </p>
          <div>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube-nocookie.com/embed/ByNY60Nty4A"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <span className="mb-1 flex justify-center text-slate-900 dark:text-gray-200 pointer-events-none select-none">
            -- or --
          </span>
          <div className="mb-2 lg:text-xl md:text-xl text-sm mt-1  flex justify-center items-center text-slate-900 dark:text-gray-200 font-bold">
            <a
              className="button-green text-gray-200 my-2 flex items-center "
              href="/discord"
              target={"_blank"}
            >
              Join the Discord
            </a>
          </div>
        </div>
        {process.env.NEXT_PUBLIC_SLOT_2 ? (
          <GoogleAds
            format="autorelaxed"
            slot={process.env.NEXT_PUBLIC_SLOT_2}
            responsive="false"
          />
        ) : (
          ""
        )}
        <div
          id="made_by"
          className="flex items-center justify-center mb-4 mt-[2%]"
        >
          <div className="px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] text-slate-800 dark:text-white font-bold flex items-center rounded-md">
            <a
              href="/discord"
              target="_blank"
              rel="noreferrer"
              className="mr-1"
            >
              <Tippy
                content={"Join our Discord Server"}
                animation="scale"
                className="shadow-xl"
              >
                <svg
                  className="w-6 h-6 dark:filter dark:grayscale dark:invert cursor-pointer"
                  width="71"
                  height="55"
                  viewBox="0 0 71 55"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                >
                  <g>
                    <path
                      d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                      fill="#000"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="71" height="55" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Tippy>
            </a>
            |{" "}
            <u className="mx-2">
              <a
                className="hover:transition-all duration-200 text-blue-400 hover:text-blue-600 font-bold"
                href="/privacy"
                target="_blank"
                rel="noreferrer"
              >
                PRIVACY
              </a>
            </u>{" "}
            | Made by{" "}
            <a
              className="hover:transition-all duration-200 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 font-bold px-1"
              href="https://github.com/peterhanania"
              target="_blank"
              rel="noreferrer"
            >
              Peter
            </a>
            using
            <Tippy content={"Next.js"} animation="scale" className="shadow-xl">
              <svg
                className="h-6 w-6 rounded-lg ml-2 mr-1 dark:filter dark:grayscale dark:invert"
                viewBox="0 0 256 256"
                version="1.1"
                preserveAspectRatio="xMidYMid"
              >
                <g>
                  <path
                    d="M119.616813,0.0688905149 C119.066276,0.118932037 117.314565,0.294077364 115.738025,0.419181169 C79.3775171,3.69690087 45.3192571,23.3131775 23.7481916,53.4631946 C11.7364614,70.2271045 4.05395894,89.2428829 1.15112414,109.384595 C0.12512219,116.415429 0,118.492153 0,128.025062 C0,137.557972 0.12512219,139.634696 1.15112414,146.665529 C8.10791789,194.730411 42.3163245,235.11392 88.7116325,250.076335 C97.0197458,252.753556 105.778299,254.580072 115.738025,255.680985 C119.616813,256.106338 136.383187,256.106338 140.261975,255.680985 C157.453763,253.779407 172.017986,249.525878 186.382014,242.194795 C188.584164,241.068861 189.00958,240.768612 188.709286,240.518404 C188.509091,240.36828 179.124927,227.782837 167.86393,212.570214 L147.393939,184.922273 L121.743891,146.965779 C107.630108,126.098464 96.0187683,109.034305 95.9186706,109.034305 C95.8185728,109.009284 95.7184751,125.873277 95.6684262,146.465363 C95.5933529,182.52028 95.5683284,183.971484 95.1178886,184.82219 C94.4672532,186.048207 93.9667644,186.548623 92.915738,187.099079 C92.114956,187.499411 91.4142717,187.574474 87.6355816,187.574474 L83.3063539,187.574474 L82.1552297,186.848872 C81.4044966,186.373477 80.8539589,185.747958 80.4785924,185.022356 L79.9530792,183.896422 L80.0031281,133.729796 L80.0782014,83.5381493 L80.8539589,82.5623397 C81.25435,82.0369037 82.1051808,81.3613431 82.7057674,81.0360732 C83.7317693,80.535658 84.1321603,80.4856165 88.4613881,80.4856165 C93.5663734,80.4856165 94.4172043,80.6857826 95.7434995,82.1369867 C96.1188661,82.5373189 110.007429,103.454675 126.623656,128.650581 C143.239883,153.846488 165.962072,188.250034 177.122972,205.139048 L197.392766,235.839522 L198.418768,235.163961 C207.502639,229.259062 217.112023,220.852086 224.719453,212.09482 C240.910264,193.504394 251.345455,170.835585 254.848876,146.665529 C255.874878,139.634696 256,137.557972 256,128.025062 C256,118.492153 255.874878,116.415429 254.848876,109.384595 C247.892082,61.3197135 213.683675,20.9362052 167.288368,5.97379012 C159.105376,3.32158945 150.396872,1.49507389 140.637341,0.394160408 C138.234995,0.143952798 121.693842,-0.131275573 119.616813,0.0688905149 L119.616813,0.0688905149 Z M172.017986,77.4831252 C173.219159,78.0836234 174.195112,79.2345784 174.545455,80.435575 C174.74565,81.0861148 174.795699,94.9976579 174.74565,126.348671 L174.670577,171.336 L166.73783,159.17591 L158.780059,147.01582 L158.780059,114.313685 C158.780059,93.1711423 158.880156,81.2862808 159.030303,80.7108033 C159.430694,79.3096407 160.306549,78.2087272 161.507722,77.5581875 C162.533724,77.0327515 162.909091,76.98271 166.837928,76.98271 C170.541544,76.98271 171.19218,77.0327515 172.017986,77.4831252 Z"
                    fill="#000000"
                  ></path>
                </g>
              </svg>
            </Tippy>
            <Tippy
              content={"Tailwind CSS"}
              animation="scale"
              className="shadow-xl"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 rounded-lg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.333 9.933C7.088 6.911 8.978 5.4 12 5.4c4.533 0 5.1 3.4 7.367 3.967 1.511.377 2.833-.189 3.966-1.7-.755 3.022-2.644 4.533-5.666 4.533-4.534 0-5.1-3.4-7.367-3.967-1.511-.378-2.833.189-3.967 1.7zm-5.666 6.8C1.422 13.711 3.31 12.2 6.333 12.2c4.534 0 5.1 3.4 7.367 3.967 1.51.377 2.833-.19 3.967-1.7C16.91 17.489 15.022 19 12 19c-4.533 0-5.1-3.4-7.367-3.967-1.511-.378-2.833.189-3.966 1.7z"
                  fill="url(#prefix__paint0_linear)"
                ></path>
                <defs>
                  <linearGradient
                    id="prefix__paint0_linear"
                    x1=".667"
                    y1="-6.689"
                    x2="23.333"
                    y2="31.089"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#2383AE"></stop>
                    <stop offset="1" stopColor="#6DD7B9"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </Tippy>
          </div>
        </div>
      </div>
    </>
  );
}
