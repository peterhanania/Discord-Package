import Tippy from "@tippyjs/react";
import { useState, Fragment, useEffect, ReactElement } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import Image from "next/image";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

export default function Settings(): ReactElement {
  const [settings, setSettings] = useState(false);

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
                                  <Listbox.Options className="bg-white dark:bg-gray-800 absolute mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
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
      <Tippy
        zIndex={99999999999999}
        content={"Settings"}
        animation="scale"
        className="shadow-xl"
      >
        <svg
          onClick={() => setSettings(true)}
          xmlns="http://www.w3.org/2000/svg"
          height="40"
          width="40"
          className="dark:fill-white ml-2 cursor-pointer"
        >
          <path d="m16.083 36.375-.791-5.167q-.375-.125-1.167-.583-.792-.458-1.708-1.042l-4.834 2.125-4-6.958L8 21.5q-.083-.333-.104-.708-.021-.375-.021-.792 0-.333.021-.75T8 18.417l-4.417-3.209 4-6.916 4.875 2.166Q13 10 13.771 9.542q.771-.459 1.521-.709l.791-5.25h7.834l.791 5.209q.709.25 1.48.687.77.438 1.354.979l4.916-2.166 3.959 6.916-4.459 3.209q.042.375.063.771.021.395.021.812 0 .417-.021.812-.021.396-.063.73l4.417 3.208-3.958 6.958-4.875-2.166q-.542.458-1.271.896-.729.437-1.563.77l-.791 5.167Zm3.875-10.958q2.25 0 3.834-1.584Q25.375 22.25 25.375 20t-1.583-3.833q-1.584-1.584-3.834-1.584t-3.833 1.584Q14.542 17.75 14.542 20t1.583 3.833q1.583 1.584 3.833 1.584Z" />
        </svg>
      </Tippy>
    </>
  );
}
