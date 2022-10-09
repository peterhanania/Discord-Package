/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { ReactElement, useEffect } from "react";
import { useSnackbar } from "notistack";

export default function Loading({ skeleton }: any): ReactElement {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (skeleton) {
      enqueueSnackbar("Rendering the Data, stay tight...", {
        persist: true,
        preventDuplicate: true,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    } else {
      enqueueSnackbar("Loading the page, stay tight", {
        persist: true,
        preventDuplicate: true,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    }
  });

  return !skeleton ? (
    <>
      <Head>
        <title>📦 Discord Package Explorer and Viewer ✨</title>
      </Head>
      <div className="sp">
        <div className="sp1"></div>
        <div className="sp2"></div>
      </div>
    </>
  ) : (
    <div
      className="h-screen"
      aria-label="loading"
      title="loading data, stay tight this might take a while"
    >
      <div className="h-screen">
        <div className="lg:flex sm:flex md:flex items-center lg:mx-10 md:mx-8 mx-2 lg:mt-4 md:mt-4 mt-2">
          <div
            className="ssc-square  flex items-center gap-1"
            style={{
              width: "146px",
              height: "36px",
              fontSize: "16px",
              fontWeight: "500",
              whiteSpace: "nowrap",
              padding: "0 14px",
              border: " 2px solid transparent",
              borderImage: "initial",
              borderRadius: "3px",
            }}
          ></div>
          <div
            className="ssc-square  flex items-center gap-1 lg:ml-2 md:ml-2 sm:ml-2 lg:my-0 md:my-0 sm:my-0 my-2"
            style={{
              width: "181px",
              height: "36px",
              fontSize: "16px",
              fontWeight: "500",
              whiteSpace: "nowrap",
              padding: "0 14px",
              border: " 2px solid transparent",
              borderImage: "initial",
              borderRadius: "3px",
            }}
          ></div>
        </div>
        <div className="lg:mx-10 md:mx-8 mx-2 lg:mt-4 mt-2 px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__delay-1s rounded-lg relative group">
          <div
            id="no_1"
            className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-none:block"
          >
            <svg
              id="no_1_show"
              xmlns="http://www.w3.org/2000/svg"
              height={24}
              width={24}
              className="fill-black dark:fill-white  pointer-events-auto hidden"
            >
              <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
            </svg>
            <svg
              className="fill-black dark:fill-white  pointer-events-auto hidden "
              id="no_1_hide"
              xmlns="http://www.w3.org/2000/svg"
              height={24}
              width={24}
            >
              <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
            </svg>
          </div>
          <div className="flex items-center space-x-4" id="no_1_div">
            <div>
              <div className="p-1 rounded-full flex items-center justify-center ring-2 dark:ring-gray-500 ring-gray-800 none:dark:ring-gray-600 none:ring-gray-900 ">
                <div className="ssc-circle lg:w-[90.66px] lg:h-[90.66px] md:w-[90.66px] md:h-[90.66px] w-[40.66px] h-[40.66px] rounded-full"></div>
              </div>
            </div>
            <div className="space-y-1 font-medium w-full">
              <div>
                <div className="lg:flex md:flex items-center">
                  <p className="mb-1 ssc-line lg:w-[250px] md:w-[250px] w-3/4 h-[36px] rounded-lg"></p>
                  <div className="flex items-center ssc">
                    <div className="ssc-square ico rounded-lg lg:ml-2 md:ml-2">
                      {" "}
                    </div>
                    <div className="ssc-square ico rounded-lg lg:ml-2 md:ml-2 ml-1">
                      {" "}
                    </div>
                    <div className="ssc-square ico rounded-lg lg:ml-2 md:ml-2 ml-1">
                      {" "}
                    </div>
                    <div className="ssc-square ico rounded-lg lg:ml-2 md:ml-2 ml-1">
                      {" "}
                    </div>
                    <div className="ssc-square ico rounded-lg lg:ml-2 md:ml-2 ml-1">
                      {" "}
                    </div>
                    <div className="ssc-square ico rounded-lg lg:ml-2 md:ml-2 ml-1">
                      {" "}
                    </div>
                    <div className="ssc-square ico rounded-lg lg:ml-2 md:ml-2 ml-1">
                      {" "}
                    </div>
                    <div className="ssc-square ico rounded-lg lg:ml-2 md:ml-2 ml-1">
                      {" "}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:flex md:flex items-center gap-2 hidden ssc">
                <div className="flex">
                  <div className="ssc-square ico-lg rounded-lg"> </div>
                </div>
                <div className="flex">
                  <div className="ssc-square ico-lg rounded-lg"> </div>
                </div>
                <div className="flex">
                  <div className="ssc-square ico-lg rounded-lg"> </div>
                </div>
                <div className="flex">
                  <div className="ssc-square ico-lg rounded-lg"> </div>
                </div>
                <div className="flex">
                  <div className="ssc-square ico-lg rounded-lg"> </div>
                </div>
                <div className="flex">
                  <div className="ssc-square ico-lg rounded-lg"> </div>
                </div>
                <div className="flex">
                  <div className="ssc-square ico-lg rounded-lg"> </div>
                </div>
                <div className="flex">
                  <div className="ssc-square ico-lg rounded-lg"> </div>
                </div>
                <div className="flex">
                  <div className="ssc-square ico-lg rounded-lg"> </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:grid md:grid grid-rows-2 grid-flow-col gap-4 lg:mx-10 md:mx-8 mx-2 lg:mt-4 mt-2">
          <div className="px-4 py-2 mb-2 lg:mb-0 bg-gray-300 dark:bg-[#2b2d31] animate__delay-1s rounded-lg row-span-3 relative group">
            <div
              id="no_2"
              className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-none:block"
            >
              <svg
                id="no_2_show"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
                className="fill-black dark:fill-white  pointer-events-auto hidden"
              >
                <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
              </svg>
              <svg
                className="fill-black dark:fill-white  pointer-events-auto hidden "
                id="no_2_hide"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
              >
                <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
              </svg>
            </div>
            <div id="no_2_div">
              <ul className="flex items-center rounded-lg mb-1 ssc">
                <li className="flex gap-2">
                  <div className="p-2 rounded-lg">
                    <div className="ssc-square ico-lg rounded-lg"> </div>
                  </div>
                  <div className="p-2 rounded-lg">
                    <div className="ssc-square ico-lg rounded-lg"> </div>
                  </div>
                  <div className="p-2 rounded-lg">
                    <div className="ssc-square ico-lg rounded-lg"> </div>
                  </div>
                </li>
              </ul>
              <div className="lg:flex items-center justify-center">
                <div className="lg:mr-14 lg:mb-0 mb-2">
                  <div className="ssc">
                    <div className="ssc-line mb-3 w-text-1 rounded-lg"></div>{" "}
                    <div className="ssc-line mb-3 w-text-2 rounded-lg"></div>{" "}
                    <div className="ssc-line w-text-3 rounded-lg"></div>{" "}
                  </div>
                </div>
                <div className="grid xl:grid-cols-10 xl:gap-3 gap-2 grid-cols-6 justify-items-center ssc">
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>{" "}
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>{" "}
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                  <div className="ssc-square ico-xl rounded-lg"> </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 lg:mt-0 mt-2 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__delay-1s rounded-lg col-span-2 relative group">
            <div
              id="no_3"
              className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-none:block"
            >
              <svg
                id="no_3_show"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
                className="fill-black dark:fill-white  pointer-events-auto hidden"
              >
                <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
              </svg>
              <svg
                className="fill-black dark:fill-white  pointer-events-auto hidden "
                id="no_3_hide"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
              >
                <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
              </svg>
            </div>
            <div id="no_3_div">
              <ul className="   mt-2 ssc ">
                <li className="flex items-center mb-1">
                  <div className="ssc-square ico rounded-lg mr-2 "> </div>
                  <div className="ssc-line w-sentence rounded-lg"></div>
                </li>
                <li className="flex items-center mb-1">
                  <div className="ssc-square ico rounded-lg mr-2"> </div>
                  <div className="ssc-line w-sentence rounded-lg"></div>
                </li>
                <li className="flex items-center mb-1">
                  <div className="ssc-square ico rounded-lg mr-2"> </div>
                  <div className="ssc-line w-sentence rounded-lg"></div>
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:mt-0 mt-2 md:mt-0 px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__delay-1s rounded-lg lg:row-span-2 md:row-span-1 col-span-2 row-span-2 relative group">
            <div
              id="no_4"
              className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-none:block"
            >
              <svg
                id="no_4_show"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
                className="fill-black dark:fill-white  pointer-events-auto hidden"
              >
                <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
              </svg>
              <svg
                className="fill-black dark:fill-white  pointer-events-auto hidden "
                id="no_4_hide"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
              >
                <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
              </svg>
            </div>
            <div id="no_4_div">
              <h3 className="   mb-2 flex items-center ">
                <div className="ssc">
                  <div className="ssc-line w-title rounded-lg"></div>{" "}
                </div>
                <div className="ml-2 ssc-circle w-[20.66px] h-[20.66px] rounded-full"></div>
              </h3>
              <div className="flex items-center gap-2 ssc">
                <div className="ssc-square ico-lg rounded-lg"></div>
                <div className="ssc-square ico-lg rounded-lg "></div>
                <div className="ssc-square ico-lg rounded-lg "></div>
                <div className="ssc-square ico-lg rounded-lg "></div>
                <div className="ssc-square ico-lg rounded-lg "></div>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-4 lg:mx-10 md:mx-8 mx-2 lg:mt-4 md:mt-4 mt-2 relative group">
          <div
            id="no_5"
            className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-none:block"
          >
            <svg
              id="no_5_show"
              xmlns="http://www.w3.org/2000/svg"
              height={24}
              width={24}
              className="fill-black dark:fill-white  pointer-events-auto hidden"
            >
              <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
            </svg>
            <svg
              className="fill-black dark:fill-white  pointer-events-auto hidden "
              id="no_5_hide"
              xmlns="http://www.w3.org/2000/svg"
              height={24}
              width={24}
            >
              <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
            </svg>
          </div>
          <div className="px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__delay-1s rounded-lg text-center w-full">
            <div id="no_5_div">
              <span className="lg:flex md:flex sm:flex items-center">
                <ul
                  className="items-center lg:mr-6 md:mr-6 sm:mr-6 mr-1 lg:pb-0 md:pb-0 sm:pb-0 pb-1 ssc lg:flex md:lg:flex hidden"
                  style={{ flexGrow: "0.3" }}
                >
                  <li className="flex lg:p-2 md:p-2 sm:p-2 p-1 rounded-lg ">
                    <div className="ssc-square ico-lg w-word rounded-lg"> </div>
                  </li>{" "}
                  <li className="flex lg:p-2 md:p-2 sm:p-2 p-1 rounded-lg ">
                    <div className="ssc-square ico-lg w-word rounded-lg"> </div>
                  </li>{" "}
                  <li className="flex lg:p-2 md:p-2 sm:p-2 p-1 rounded-lg ">
                    <div className="ssc-square ico-lg w-word rounded-lg"> </div>
                  </li>{" "}
                  <li className="flex lg:p-2 md:p-2 sm:p-2 p-1 rounded-lg ">
                    <div className="ssc-square ico-lg w-word rounded-lg"> </div>
                  </li>
                </ul>
                <ul className="items-center grow-0 space-x-6 p-2 rounded-lg lg:mr-4 md:mr-4 sm:mr-4 mr-1 ssc lg:flex md:lg:flex hidden">
                  <li className="flex">
                    <div className="ssc-square ico-lg rounded-lg"> </div>
                  </li>
                </ul>
                <p className="items-center ssc lg:flex md:lg:flex hidden">
                  <div className="ssc-square rounded-lg w-sentence"> </div>
                  <div className="ml-2 ssc-circle w-[25.66px] h-[25.66px] rounded-full"></div>
                </p>
              </span>
              <div className="row-span-3 ssc">
                <div className="mx-2">
                  <div className="ssc-square page rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:grid grid-cols-2 grid-flow-col gap-4 lg:mx-10 md:mx-8 mx-2 lg:mt-4 md:mt-4 mt-2">
          <div className="lg:px-4 md:px-4 px-1 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg row-span-3 relative group">
            <div id="no_6_div">
              <span className="pt-4 lg:px-6 md:px-6 px-1 items-center lg:flex md:lg:flex hidden">
                <div className="ssc">
                  <div className="ssc-line w-title rounded-lg"></div>{" "}
                </div>
                <form className="ml-4">
                  <p className="mb-1 ssc-line w-[160px] h-[36px] rounded-lg"></p>
                </form>
              </span>
              <span className="ssc ">
                <div className="ssc-line  w-text-2 rounded-lg"></div>
              </span>
              <div className="flex grow rounded-sm overflow-y-auto overflow-x-hidden h-[700px]">
                <div className="flex flex-col w-full px-1 pb-4 lg:px-3 md:px-3 lg:pt-0 md:pt-0 pt-2">
                  {" "}
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </div>
            </div>
          </div>
          <div className="lg:px-4 md:px-4 px-1 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg row-span-3 lg:mt-0 mt-4 relative group">
            <div
              id="no_7"
              className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-none:block"
            >
              <svg
                id="no_7_show"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
                className="fill-black dark:fill-white  pointer-events-auto hidden"
              >
                <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
              </svg>
              <svg
                className="fill-black dark:fill-white  pointer-events-auto hidden "
                id="no_7_hide"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
              >
                <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
              </svg>
            </div>
            <div id="no_7_div">
              <div className="lg:flex justify-between md:flex sm:flex items-center">
                <span className=" pt-4 lg:px-6 md:px-6 px-1 lg:flex md:lg:flex hidden items-center">
                  <div className="ssc">
                    <div className="ssc-line w-title rounded-lg"></div>{" "}
                  </div>
                  <form className="ml-4">
                    <p className="mb-1 ssc-line w-[160px] h-[36px] rounded-lg"></p>
                  </form>
                </span>
                <ul className="items-center rounded-lg ml-2 lg:flex md:lg:flex hidden">
                  <li className="flex gap-1 ssc">
                    <div className="rounded-lg">
                      <div className="ssc-square ico-lg rounded-lg "></div>
                    </div>
                    <div className="rounded-lg">
                      <div className="ssc-square ico-lg rounded-lg "></div>
                    </div>
                    <div className="rounded-lg">
                      <div className="ssc-square ico-lg rounded-lg "></div>
                    </div>
                  </li>
                </ul>
              </div>
              <span className="ssc ">
                <div className="ssc-line w-text-2 rounded-lg"></div>
              </span>
              <div className="flex grow rounded-sm overflow-y-auto overflow-x-hidden h-[700px]">
                <div className="flex flex-col w-full px-3 pb-4 lg:px-3 md:px-3 lg:pt-0 md:pt-0 pt-2">
                  {" "}
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 none:bg-gray-400 dark:none:bg-[#23272A] px-2 rounded-lg ">
                      <div className="flex items-center max-w-full sm:max-w-4/6">
                        <div>
                          <div className="ssc-circle w-[32px] h-[32px] rounded-full"></div>
                        </div>
                        <div className="  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <div className="flex items-center  mb-1">
                            <p className="mb-1 ssc-line w-[140px] h-[20px] rounded-lg"></p>
                          </div>
                          <span className="text-gray-400 text-sm -mt-2">
                            <p className="mb-1 ssc-line w-[190px] h-[14px] rounded-lg"></p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1 ssc">
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                        <div className="ssc-square ico rounded-lg"> </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:grid my-4 grid-rows-2 grid-flow-col gap-4 lg:mx-10 md:mx-8 mx-2 lg:mt-4 md:mt-4 mt-2">
          <div className="lg:px-4 md:px-4 px-1 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg row-span-3 lg:flex md:flex items-center justify-center relative group">
            <div
              id="no_8"
              className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-none:block"
            >
              <svg
                id="no_8_show"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
                className="fill-black dark:fill-white  pointer-events-auto hidden"
              >
                <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
              </svg>
              <svg
                className="fill-black dark:fill-white  pointer-events-auto hidden "
                id="no_8_hide"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
              >
                <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
              </svg>
            </div>
            <div
              id="no_8_div"
              className="lg:flex md:flex items-center justify-center"
            >
              <div className="lg:mr-14 lg:ml-8 md:mr-12 md:ml-7 mb-2 lg:mb-0 md:mb-0">
                <div className="ssc">
                  <div className="ssc-line mb-3 w-text-1 rounded-lg"></div>{" "}
                  <div className="ssc-line mb-3 w-text-2 rounded-lg"></div>{" "}
                  <div className="ssc-line w-text-3 rounded-lg"></div>{" "}
                </div>
              </div>
              <div className="grid lg:grid-cols-8 md:grid-cols-6 grid-cols-4 justify-items-center">
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>{" "}
                <div className=" xl:m-1 m-2">
                  <div className=" p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500  ">
                    <div className="ssc-circle w-[56px] h-[56px] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 lg:my-0 my-4 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg row-span-3 col-span-2 relative group">
            <div
              id="no_9"
              className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-none:block"
            >
              <svg
                id="no_9_show"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
                className="fill-black dark:fill-white  pointer-events-auto hidden"
              >
                <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
              </svg>
              <svg
                className="fill-black dark:fill-white  pointer-events-auto hidden "
                id="no_9_hide"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
              >
                <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
              </svg>
            </div>
            <div id="no_9_div">
              <div className="ssc mb-1">
                <div className="ssc-line w-title rounded-lg"></div>{" "}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="  flex items-center ssc">
                  <div className="ssc-square ico rounded-lg mr-2 "> </div>
                  <div className="ssc-line w-title rounded-lg"></div>
                </span>
              </div>
              <div className="ssc mb-1">
                <div className="ssc-line w-title rounded-lg"></div>{" "}
              </div>
              <div className="flex items-center gap-2">
                <span className=" " />
                <ul className="   list-disc mt-2 ml-6 text-xs ssc">
                  <li className="pb-2">
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>
                  <li className="pb-2">
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="pb-3">
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>
                </ul>
              </div>
              <h3 className="  flex items-center ">
                <div className="ssc">
                  <div className="ssc-line w-title rounded-lg"></div>{" "}
                </div>
                <div className="ml-2 ssc-circle w-[20.66px] h-[20.66px] rounded-full"></div>
              </h3>
              <div className="flex items-center gap-2">
                <span className=" " />
                <ul className="   list-disc mt-2 ml-6 text-xs ssc">
                  <li className="pb-2">
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>
                  <li className="pb-2">
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="pb-3">
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-4 lg:mx-10 md:mx-8 mx-2 lg:mt-4 md:mt-4 mt-2 pb-10">
          <div className="lg:px-4 md:px-4 px-1 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg text-left w-full relative group">
            <div
              id="no_10"
              className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-none:block"
            >
              <svg
                id="no_10_show"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
                className="fill-black dark:fill-white  pointer-events-auto hidden"
              >
                <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
              </svg>
              <svg
                className="fill-black dark:fill-white  pointer-events-auto hidden "
                id="no_10_hide"
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
              >
                <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
              </svg>
            </div>
            <div id="no_10_div">
              <span className="flex items-center">
                <p className="mb-1 ssc-line w-[250px] h-[36px] rounded-lg"></p>
                <div className="ml-2 ssc-circle w-[20.66px] h-[20.66px] rounded-full"></div>
              </span>
              <div className="mt-2">
                <ul className="mt-2 ssc ">
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2 "> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>{" "}
                  <li className="flex items-center mb-1">
                    <div className="ssc-square ico rounded-lg mr-2"> </div>
                    <div className="ssc-line w-sentence rounded-lg"></div>
                  </li>
                </ul>
              </div>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
