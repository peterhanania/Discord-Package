import Tippy from "@tippyjs/react";
import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import Image from "next/image";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import Link from "next/link";

export default function Header() {
  const [help, setHelp] = useState(false);
  const [settings, setSettings] = useState(false);
  const [info, setInfo] = useState(false);
  const [tutorial, setTutorial] = useState(false);

  function classNames(...classes: any): any {
    return classes.filter(Boolean).join(" ");
  }

  const countries = [
    {
      id: 1,
      name: "English",
      avatar:
        "https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Us_flag_large_38_stars.png/1200px-Us_flag_large_38_stars.png",
    },
  ];
  const [selected, setSelected] = useState(countries[0]);
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    setTheme(localStorage.theme);
  }, []);

  return (
    <>
      <Transition
        show={tutorial}
        enter="transition-opacity delay-200 duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        as={Fragment}
      >
        <Dialog
          onClose={() => {
            setTutorial(false);
          }}
          className="fixed z-[999999] inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Overlay className="fixed inset-0  bg-black/30" />
            <div className="relative p-4 w-full max-w-4xl md:h-auto h-full">
              <div className="relative shadow-lg bg-[#36393f] ">
                <div className="flex justify-between items-center p-5 rounded-t bg-[#2b2d31]">
                  <h3
                    className="text-xl font-medium text-white uppercase"
                    style={{
                      fontFamily:
                        "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
                    }}
                  >
                    tutorials
                  </h3>
                  <button
                    onClick={() => {
                      setTutorial(false);
                    }}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-[#2f3136] hover:text-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto h-[560px] px-5 py-2">
                  <code className="dark:text-white text-black font-bold">
                    🎇 If you made a video about DP, make sure to join the
                    discord and let us know! 🎊
                  </code>
                  <div className="mt-2">
                    <span className="dark:text-white text-black font-bold text-xl">
                      1. Tutorial by{" "}
                      <a
                        href="https://youtube.com/c/laaw_tutorials"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:transition-all duration-200 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 font-bold px-1 "
                      >
                        <b>Law Tutorials</b>
                      </a>
                    </span>
                    <div className="py-3">
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
                  </div>
                  <div>
                    <span className="dark:text-white text-black font-bold text-xl">
                      2. Tutorial by{" "}
                      <a
                        href="https://www.youtube.com/c/MrMothDevs"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:transition-all duration-200 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 font-bold px-1 "
                      >
                        <b>Mr Moth Devs</b>
                      </a>
                    </span>
                    <div className="py-3">
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube-nocookie.com/embed/m5BSKDi-4gk"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                  <div>
                    <span className="dark:text-white text-black font-bold text-xl">
                      3. Tutorial by{" "}
                      <a
                        href="https://www.youtube.com/c/Spaceonyoutube"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:transition-all duration-200 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 font-bold px-1 "
                      >
                        <b>Space</b>
                      </a>
                    </span>
                    <div className="py-3">
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube-nocookie.com/embed/hYHMaieRPGI"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-6 space-x-2 rounded-b bg-[#2b2d31]">
                  <button
                    onClick={() => {
                      setTutorial(false);
                    }}
                    type="button"
                    className="button-green text-gray-200"
                  >
                    Got It
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition
        show={help}
        enter="transition-opacity delay-200 duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        as={Fragment}
      >
        <Dialog
          onClose={() => {
            setHelp(false);
          }}
          className="fixed z-[999999] inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Overlay className="fixed inset-0  bg-black/30" />
            <div className="relative p-4 w-full max-w-4xl md:h-auto h-full">
              <div className="relative shadow-lg bg-[#36393f] ">
                <div className="flex justify-between items-center p-5 rounded-t bg-[#2b2d31]">
                  <h3
                    className="text-xl font-medium text-white uppercase"
                    style={{
                      fontFamily:
                        "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
                    }}
                  >
                    How to Retrieve your Package
                  </h3>

                  <button
                    onClick={() => {
                      setHelp(false);
                    }}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-[#2f3136] hover:text-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-white text-lg py-2 px-8">
                  If you need help, kindly join our
                  <a
                    href="/discord"
                    className="hover:transition-all duration-200 text-blue-400 hover:text-blue-600 font-bold mx-1"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Discord Server
                  </a>
                </p>
                <div className="overflow-y-auto h-[560px] ">
                  <div className="py-6 px-8">
                    <h3 className="text-xl font-medium text-white mb-2">
                      1- Click on the &quot;User Settings&quot; icon.
                    </h3>
                    <Image
                      unoptimized={true}
                      src="/help/1.png"
                      alt="1"
                      width={500}
                      height={300}
                    />{" "}
                    <h3 className="text-xl font-medium text-white mb-2 mt-4">
                      2- Click on &quot;Privacy & Safety&quot;.
                    </h3>
                    <Image
                      unoptimized={true}
                      src="/help/2.png"
                      alt="2"
                      width={500}
                      height={300}
                    />{" "}
                    <h3 className="text-xl font-medium text-white mb-2 mt-4">
                      3- Scroll down to the end then click on &quot;Request Data
                      &quot; to request your data.
                    </h3>
                    <Image
                      unoptimized={true}
                      src="/help/3.png"
                      alt="3"
                      width={500}
                      height={300}
                    />
                    <h3 className="text-xl font-medium text-white mb-2 mt-4">
                      4- Keep checking your email and download your data once
                      reached. The data will be sent to the email associated
                      with your Discord account and usually takes up to 24 hours
                      to reach.
                    </h3>
                    <Image
                      unoptimized={true}
                      src="/help/4.png"
                      alt="4"
                      width={500}
                      height={30}
                    />{" "}
                    <Image
                      unoptimized={true}
                      src="/help/5.png"
                      alt="5"
                      width={500}
                      height={300}
                    />
                    <h3 className="text-xl font-medium text-white mb-2 mt-4">
                      5- Upload the downloaded package by dragging or clicking
                      on the box.
                    </h3>
                    <video controls>
                      <source src="/help/1.mp4" type="video/webm" />
                      Your browser does not support embedded videos
                    </video>{" "}
                    <h3 className="text-xl font-medium text-white mb-2 mt-4">
                      You could cancel by pressing on the box while its
                      uploading.
                    </h3>
                    <video controls>
                      <source src="/help/2.mp4" type="video/webm" />
                      Your browser does not support embedded videos.
                    </video>
                    <h3 className="text-xl font-medium text-white mb-2 mt-4">
                      You could press &quot;More Options&quot; to customize what
                      data you want to display
                    </h3>
                    <video controls>
                      <source src="/help/3.mp4" type="video/webm" />
                      Your browser does not support embedded videos
                    </video>
                  </div>
                </div>

                <div className="flex items-center p-6 space-x-2 rounded-b bg-[#2b2d31]">
                  <button
                    onClick={() => {
                      setHelp(false);
                    }}
                    type="button"
                    className="button-green text-gray-200"
                  >
                    Got It
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition
        show={info}
        enter="transition-opacity delay-200 duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        as={Fragment}
      >
        <Dialog
          onClose={() => {
            setInfo(false);
          }}
          className="fixed z-[999999] inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Overlay className="fixed inset-0  bg-black/30" />
            <div className="relative p-4 w-full max-w-4xl md:h-auto h-full">
              <div className="relative shadow-lg bg-[#36393f] ">
                <div className="flex justify-between items-center p-5 rounded-t bg-[#2b2d31]">
                  <h3
                    className="text-xl font-medium text-white uppercase"
                    style={{
                      fontFamily:
                        "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
                    }}
                  >
                    About
                  </h3>
                  <button
                    onClick={() => {
                      setInfo(false);
                    }}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-[#2f3136] hover:text-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div className="overflow-y-auto h-[340px]">
                  <div className="py-4 px-2 lg:py-6 lg:px-8 md:py-6 md:px-8 sm:py-6 sm:px-8 text-white font-bold text-lg">
                    <u className="mr-1">
                      <a
                        className="hover:transition-all duration-200 text-blue-400 hover:text-blue-600 font-bold"
                        href="/privacy"
                        target="_blank"
                        rel="noreferrer"
                      >
                        PRIVACY
                      </a>
                    </u>
                    |
                    <u className="ml-1">
                      <a
                        className="hover:transition-all duration-200 text-blue-400 hover:text-blue-600 font-bold"
                        href="/discord"
                        target="_blank"
                        rel="noreferrer"
                      >
                        DISCORD
                      </a>
                    </u>
                    <br />
                    Discord Package Explorer and Viewer is a new tool made by{" "}
                    <a
                      className="hover:transition-all duration-200 text-blue-400 hover:text-blue-600 font-bold"
                      href="https://github.com/peterhanania"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Peter
                    </a>{" "}
                    with the help of{" "}
                    <a
                      className="hover:transition-all duration-200 text-blue-400 hover:text-blue-600 font-bold"
                      href="https://github.com/Androz2091"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Androz2091
                    </a>
                    &apos;s{" "}
                    <a
                      className="hover:transition-all duration-200 text-blue-400 hover:text-blue-600 font-bold"
                      href="https://ddpe.androz2091.fr"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Package Explorer
                    </a>
                    . I got inspired by the idea and decided to work on a more
                    customizable one as a side project. This project is 100%
                    free and will always remain free. My main goal is to
                    visualize the data used by Discord in a more user friendly
                    way.
                    <br />
                    <br />
                    This project does not store any information, and does not
                    have any third party services other than google analytics.
                    <br />
                    <br />
                    This website is also deployed on{" "}
                    <a
                      className="hover:transition-all duration-200 text-blue-400 hover:text-blue-600 font-bold"
                      href="https://Netlify.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Netlify
                    </a>{" "}
                    from the{" "}
                    <a
                      className="hover:transition-all duration-200 text-blue-400 hover:text-blue-600 font-bold"
                      href="https://github.com/peterhanania/discord-package"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Original Repository
                    </a>
                    <br />
                    <br />
                    Feel free to Contribute to this project!
                    <div className="mt-4 mb-2">Our Contributors!</div>
                    <a href="https://github.com/peterhanania/discord-package/graphs/contributors">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://contrib.rocks/image?repo=peterhanania/discord-package"
                        alt="Contributors"
                      />
                    </a>
                  </div>
                </div>

                <div className="flex items-center p-6 space-x-2 rounded-b bg-[#2b2d31]">
                  <button
                    onClick={() => {
                      setInfo(false);
                    }}
                    type="button"
                    className="button-green text-gray-200"
                  >
                    Got It
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition
        show={settings}
        enter="transition-opacity delay-200 duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        as={Fragment}
      >
        <Dialog
          onClose={() => {
            setSettings(false);
          }}
          className="fixed z-[999999] inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Overlay className="fixed inset-0  bg-black/30" />
            <div className="relative p-4 w-full max-w-4xl md:h-auto h-full">
              <div className="relative shadow-lg bg-[#36393f] ">
                <div className="flex justify-between items-center p-5 rounded-t bg-[#2b2d31]">
                  <h3
                    className="text-xl font-medium text-white uppercase"
                    style={{
                      fontFamily:
                        "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
                    }}
                  >
                    Settings
                  </h3>
                  <button
                    onClick={() => {
                      setSettings(false);
                    }}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-[#2f3136] hover:text-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div className="overflow-y-auto h-[280px]">
                  <div className="py-4 px-2 lg:py-6 lg:px-8 md:py-6 md:px-8 sm:py-6 sm:px-8 text-white font-bold text-lg">
                    THEME
                    <br />
                    <div
                      className="toggle"
                      onClick={() => {
                        document.documentElement.classList.add("dark");
                        setTheme("dark");
                        localStorage.setItem("theme", "dark");
                      }}
                    >
                      <input
                        type="radio"
                        name="theme"
                        id="dark"
                        value="dark"
                        onChange={() => {}}
                        checked={theme === "dark"}
                      />
                      <label htmlFor="dark">Dark</label>
                    </div>
                    <div
                      className="toggle"
                      onClick={() => {
                        document.documentElement.classList.remove("dark");
                        setTheme("light");
                        localStorage.setItem("theme", "light");
                      }}
                    >
                      <input
                        type="radio"
                        name="theme"
                        id="light"
                        value="light"
                        onChange={() => {}}
                        checked={theme === "light"}
                      />
                      <label htmlFor="light">Light</label>
                    </div>
                    <br />
                    Language
                    <div>
                      <span className="flex justify-between align-middle text-sm text-gray-700 dark:text-gray-200">
                        <Listbox value={selected} onChange={setSelected}>
                          {({ open }) => (
                            <>
                              <div className="mt-1 relative">
                                <Listbox.Button className="relative w-full cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-left sm:text-sm">
                                  <span className="flex items-center">
                                    <Image
                                      unoptimized={true}
                                      height={20}
                                      width={20}
                                      src={selected.avatar}
                                      alt=""
                                      className="flex-shrink-0 h-6 w-6 rounded-full"
                                    />
                                    <span className="ml-3 block truncate text-slate-900 dark:text-white">
                                      {selected.name}
                                    </span>
                                  </span>
                                  <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <SelectorIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Listbox.Button>

                                <Transition
                                  show={open}
                                  as={Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options className="bg-white dark:bg-gray-800 z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
                                    {countries.map((country) => (
                                      <Listbox.Option
                                        key={country.id}
                                        className={({ active }) =>
                                          classNames(
                                            active
                                              ? "text-gray-900 bg-indigo-600"
                                              : "text-gray-900",
                                            "cursor-pointer select-none relative py-2 pl-3 pr-9"
                                          )
                                        }
                                        value={country}
                                      >
                                        {({ selected, active }) => (
                                          <>
                                            <div className="flex items-center">
                                              <Image
                                                unoptimized={true}
                                                height={20}
                                                width={20}
                                                src={country.avatar}
                                                alt=""
                                                className="flex-shrink-0 h-6 w-6 rounded-full"
                                              />
                                              <span
                                                className={classNames(
                                                  selected
                                                    ? "font-semibold"
                                                    : "font-normal",
                                                  "ml-3 block truncate",
                                                  "text-slate-900 dark:text-white"
                                                )}
                                              >
                                                {country.name}
                                              </span>
                                            </div>

                                            {selected ? (
                                              <span
                                                className={classNames(
                                                  active
                                                    ? "text-white"
                                                    : "text-indigo-600",
                                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                                )}
                                              >
                                                <CheckIcon
                                                  className="h-5 w-5"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </>
                          )}
                        </Listbox>
                      </span>
                    </div>
                    <br />
                    <div>
                      <div className="flex items-center cursor-pointer">
                        <input
                          defaultChecked={
                            localStorage.getItem("debug") === "true"
                          }
                          onChange={() => {
                            if (localStorage.getItem("debug") === "true") {
                              localStorage.setItem("debug", "false");
                            } else {
                              localStorage.setItem("debug", "true");
                            }
                          }}
                          id={"debug"}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 rounded  border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor={"debug"}
                          className="pl-2 font-medium text-white font-mono"
                          style={{
                            fontSize: "18px",
                          }}
                        >
                          Turn debug mode on (recommended)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-6 space-x-2 rounded-b bg-[#2b2d31]">
                  <button
                    onClick={() => {
                      setSettings(false);
                    }}
                    type="button"
                    className="button-green text-gray-200"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
      <header className="flex flex-col items-center lg:pt-20 md:pt-16 pt-4">
        <div className="flex justify-center">
          <h1
            style={{
              fontFamily:
                "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
            }}
            className="animate__animated animate__zoomIn animate__delay-0s dark:text-white text-gray-900 font-bold lg:text-5xl md:text-3xl sm:text-2xl text-xl uppercase dark:drop-shadow-[0_0_25px_#000] drop-shadow-[0_0_25px_#fff]"
          >
            Discord Package
          </h1>
        </div>
        <p className="animate__animated animate__fadeIn animate__delay-1s dark:text-white text-gray-900 lg:text-xl md:text-xl text-sm max-w-md text-center font-mono">
          An{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="hover:transition-all duration-200 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 font-bold"
            href="https://github.com/peterhanania/discord-package"
          >
            Open Sourced
          </a>{" "}
          Discord Package Explorer and Viewer; Read your data with ease!
        </p>
        <div className="portrait:hidden lg:hidden landscape:flex md:landscape:hidden lg:text-xl md:text-xl text-sm mt-1 animate__delay-1s animate__animated animate__fadeIn flex justify-center items-center text-slate-900 dark:text-gray-200 font-bold">
          <Link href="/demo" target="_blank" rel="noreferrer" type="button">
            <a className="button-green text-gray-200  my-2 flex items-center">
              Click to View Demo
            </a>
          </Link>
        </div>
        <div className="flex justify-center items-center mt-2">
          <Tippy
            zIndex={999999999999999}
            content={"Help"}
            animation="scale"
            className="shadow-xl "
          >
            <svg
              onClick={() => setHelp(true)}
              xmlns="http://www.w3.org/2000/svg"
              height="40"
              width="40"
              className="opacity-90 hover:opacity-100 dark:fill-white cursor-pointer animate__animated animate__fadeIn animate__delay-1s"
            >
              <path d="M20.125 29.625q.667 0 1.167-.479t.5-1.188q0-.708-.48-1.187-.479-.479-1.187-.479-.708 0-1.187.479-.48.479-.48 1.187 0 .667.48 1.167.479.5 1.187.5Zm-1.458-6.083h2.541q0-1.125.292-1.98.292-.854 1.708-2.062 1.209-1.042 1.75-2.062.542-1.021.542-2.271 0-2.209-1.479-3.5-1.479-1.292-3.771-1.292-2.125 0-3.625 1.063-1.5 1.062-2.167 2.812l2.292.875q.375-1.042 1.229-1.729.854-.688 2.146-.688 1.417 0 2.208.75.792.75.792 1.834 0 .916-.521 1.687t-1.437 1.563q-1.417 1.208-1.959 2.208-.541 1-.541 2.792ZM20 36.375q-3.375 0-6.375-1.292-3-1.291-5.208-3.521-2.209-2.229-3.5-5.208Q3.625 23.375 3.625 20q0-3.417 1.292-6.396 1.291-2.979 3.521-5.208 2.229-2.229 5.208-3.5T20 3.625q3.417 0 6.396 1.292 2.979 1.291 5.208 3.5 2.229 2.208 3.5 5.187T36.375 20q0 3.375-1.292 6.375-1.291 3-3.5 5.208-2.208 2.209-5.187 3.5-2.979 1.292-6.396 1.292Z" />
            </svg>
          </Tippy>
          <Tippy
            zIndex={999999999999999}
            content={"Settings"}
            animation="scale"
            className="shadow-xl"
          >
            <svg
              onClick={() => setSettings(true)}
              xmlns="http://www.w3.org/2000/svg"
              height="40"
              width="40"
              className="opacity-90 hover:opacity-100 dark:fill-white ml-2 cursor-pointer animate__animated animate__fadeIn animate__delay-1s"
            >
              <path d="m16.083 36.375-.791-5.167q-.375-.125-1.167-.583-.792-.458-1.708-1.042l-4.834 2.125-4-6.958L8 21.5q-.083-.333-.104-.708-.021-.375-.021-.792 0-.333.021-.75T8 18.417l-4.417-3.209 4-6.916 4.875 2.166Q13 10 13.771 9.542q.771-.459 1.521-.709l.791-5.25h7.834l.791 5.209q.709.25 1.48.687.77.438 1.354.979l4.916-2.166 3.959 6.916-4.459 3.209q.042.375.063.771.021.395.021.812 0 .417-.021.812-.021.396-.063.73l4.417 3.208-3.958 6.958-4.875-2.166q-.542.458-1.271.896-.729.437-1.563.77l-.791 5.167Zm3.875-10.958q2.25 0 3.834-1.584Q25.375 22.25 25.375 20t-1.583-3.833q-1.584-1.584-3.834-1.584t-3.833 1.584Q14.542 17.75 14.542 20t1.583 3.833q1.583 1.584 3.833 1.584Z" />
            </svg>
          </Tippy>
          <Tippy
            zIndex={999999999999999}
            content={"About"}
            animation="scale"
            className="shadow-xl"
          >
            <svg
              onClick={() => setInfo(true)}
              xmlns="http://www.w3.org/2000/svg"
              height="40"
              width="40"
              className="dark:fill-white ml-2 cursor-pointer animate__animated animate__fadeIn animate__delay-1s opacity-90 hover:opacity-100"
            >
              <path d="M18.792 28.208h2.625v-9.833h-2.625ZM20 15.292q.583 0 1-.396.417-.396.417-1.021 0-.625-.396-1.021-.396-.396-1.021-.396-.625 0-1.021.396-.396.396-.396 1.021 0 .583.417 1 .417.417 1 .417Zm0 21.083q-3.375 0-6.375-1.292-3-1.291-5.208-3.521-2.209-2.229-3.5-5.208Q3.625 23.375 3.625 20q0-3.417 1.292-6.396 1.291-2.979 3.521-5.208 2.229-2.229 5.208-3.5T20 3.625q3.417 0 6.396 1.292 2.979 1.291 5.208 3.5 2.229 2.208 3.5 5.187T36.375 20q0 3.375-1.292 6.375-1.291 3-3.5 5.208-2.208 2.209-5.187 3.5-2.979 1.292-6.396 1.292Z" />
            </svg>
          </Tippy>
          <Tippy
            zIndex={999999999999999}
            content={"Tutorials"}
            animation="scale"
            className="shadow-xl"
          >
            <svg
              onClick={() => setTutorial(true)}
              xmlns="http://www.w3.org/2000/svg"
              height="40"
              width="40"
              className="dark:fill-white ml-2 cursor-pointer animate__animated animate__fadeIn animate__delay-1s opacity-90 hover:opacity-100"
            >
              <path d="m16.167 27.125 11.125-7.167-11.125-7.208ZM6.125 33.333q-1.125 0-1.958-.833-.834-.833-.834-1.958V9.458q0-1.125.834-1.958.833-.833 1.958-.833h27.75q1.125 0 1.958.833.834.833.834 1.958v21.084q0 1.125-.834 1.958-.833.833-1.958.833Z" />
            </svg>
          </Tippy>
        </div>
      </header>
    </>
  );
}
