/* eslint-disable no-unexpected-multiline */
/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import Tippy from "@tippyjs/react";
import Utils from "./utils";
import { Unzip, AsyncUnzipInflate } from "fflate";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment, ReactElement } from "react";
import Features from "./json/features.json";
import EventsJSON from "./json/events.json";
import { ToastContainer, toast } from "react-toastify";
import Header from "./Header";
import BitField from "./utils/Bitfield";
import Privacy from "./privacy";
import Alerts from "./Alerts";
import moment from "moment";
import chalk from "chalk";
import { Line } from "rc-progress";
import { SnackbarProvider } from "notistack";
import {
  dataExtractedAtom,
  defaultOptionAtom,
  selectedFeaturesAtom,
  oldSelectedAtom,
} from "./atoms/data";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import Loading from "./Loading";
import { useSnackbar } from "notistack";

interface IObjectKeys {
  [key: string]: any;
}

interface objectInterface extends IObjectKeys {
  bots?: any;
  user?: any;
  settings?: any;
  connections?: any;
  payments?: any;
  messages?: any;
  guilds?: any;
  other?: any;
}

export default function Upload(): ReactElement {
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<String | boolean | null>(null);
  const [loading, setLoading] = React.useState<String | boolean | null>(null);
  const [saveToDevice, setSaveToDevice] = React.useState<boolean>(false);
  const [percent, setPercent] = React.useState<number>(0);
  const [dataExtracted, setDataExtracted] = useAtom(dataExtractedAtom);
  const [defaultOptions] = useAtom(defaultOptionAtom);
  const [oldSelected, setOldSelected] = useAtom(oldSelectedAtom);
  const [selectedFeatures, setSelectedFeatures] = useAtom(selectedFeaturesAtom);
  const { enqueueSnackbar } = useSnackbar();

  function hasClass(el: Element, cl: string): boolean {
    return el.classList
      ? el.classList.contains(cl)
      : !!el.className &&
          !!el.className.match(new RegExp("(?: |^)" + cl + "(?: |$)"));
  }

  React.useEffect(() => {
    async function validateData_(obj: any, data_d: any) {
      const validateOptions = await Utils.validateOptions(obj, data_d);
      if (!validateOptions) return;
      setSelectedFeatures(data_d);
    }

    const itm = localStorage.getItem("defaultOptions_enabled");
    if (itm === "true") {
      setSaveToDevice(true);

      if (itm) {
        try {
          const data_d = JSON.parse(
            localStorage.getItem("defaultOptions") as any
          );
          if (!data_d) return;
          const obj: objectInterface = {
            bots: true,
            user: { premium_until: true, badges: true },
            settings: { appearance: true, recentEmojis: true },
            connections: true,
            payments: {
              total: true,
              transactions: true,
              giftedNitro: true,
            },
            messages: {
              topChannels: true,
              topDMs: true,
              topGuilds: true,
              topGroupDMs: true,
              characterCount: true,
              topCustomEmojis: true,
              topEmojis: true,
              hoursValues: true,
              oldestMessages: true,
              attachmentCount: true,
              mentionCount: true,
            },
            guilds: true,
            other: {
              showCurseWords: true,
              showDiscordLinks: true,
              showLinks: true,
              favoriteWords: true,
              oldestMessages: true,
              topEmojis: true,
              topCustomEmojis: true,
            },
            statistics: [],
          };

          validateData_(obj, data_d);
        } catch (e) {
          return;
        }
      }
    }
  }, [dataExtracted, setSelectedFeatures]);

  React.useEffect(() => {
    const file = document.getElementById("file");
    if (file) {
      file.addEventListener("dragover", handleDragOver);
      file.addEventListener("drop", handleDrop);
      file.addEventListener("dragenter", handleDragEnter);
      file.addEventListener("dragleave", handleDragLeave);
    }

    return () => {
      if (file) {
        file.removeEventListener("dragover", handleDragOver);
        file.removeEventListener("drop", handleDrop);
        file.removeEventListener("dragenter", handleDragEnter);
        file.removeEventListener("dragleave", handleDragLeave);
      }
    };
  });

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleDragEnter = (e: any) => {
    setError(null);
    e.preventDefault();
    e.stopPropagation();

    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    setError(null);
    e.preventDefault();
    e.stopPropagation();

    setDragging(false);
  };
  const handleDragOver = (e: any) => {
    setError(null);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: any) => {
    setError(null);
    e.preventDefault();
    e.stopPropagation();

    const files = [e.dataTransfer.files];

    if (files && files.length) {
      onUpload(files);
    }
  };

  const [cancel, setCancel] = React.useState<boolean>(false);
  const [showLargeModal, setShowLargeModal] = React.useState<boolean>(false);

  const onUpload = (files: any) => {
    if (loading) {
      const element = document.getElementById("dropzone-label");
      if (element) {
        const check = hasClass(element, "animate__animated");

        if (check) {
          element.classList.remove(
            "animate__animated",
            "animate__flash",
            "animate__headShake"
          );

          setTimeout(() => {
            element.classList.add(
              "animate__animated",
              "animate__flash",
              "animate__headShake"
            );
          }, 100);
        } else {
          element.classList.add(
            "animate__animated",
            "animate__flash",
            "animate__headShake"
          );
        }
        if (!cancel) setCancel(true);
      }

      return;
    }
    setCancel(false);
    setError(null);
    setDragging(false);

    let fileUploaded = files[0];
    if (!fileUploaded) setError("Please Upload a File");
    if (!fileUploaded.type) {
      if (fileUploaded[0] && fileUploaded[0].type) {
        fileUploaded = fileUploaded[0];
      } else {
        setError(null);
        setDragging(false);
        return;
      }
    }
    if (
      fileUploaded.type === "application/zip" ||
      fileUploaded.type === "application/x-zip-compressed"
    ) {
      // eslint-disable-next-line
      async function startUpload() {
        const isDebug = localStorage.getItem("debug") === "true";
        const startTime = Date.now();

        if (isDebug) {
          setLoading(
            `Loading Package|||${isDebug ? "debug mode enabled" : ""}`
          );
          console.log(
            chalk.bold.blue(`[DEBUG] `) +
              chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
              `  ${chalk.yellow(`Loading in Debug Mode`)}`
          );
          await delay(2000);
        } else {
          setLoading("Loading Your Package");
          await delay(2000);
        }
        const reader = new Unzip();
        if (isDebug)
          console.log(
            chalk.bold.blue(`[DEBUG] `) +
              chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
              `  ${chalk.yellow(`Loading your package`)}`
          );
        if (isDebug) setLoading("Loading Package|||Registering Package");

        reader.register(AsyncUnzipInflate);
        if (isDebug)
          console.log(
            chalk.bold.blue(`[DEBUG] `) +
              chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
              `  ${chalk.yellow(`Package registered`)}`
          );

        const files: Array<any> = [];

        reader.onfile = (f) => {
          return files.push(f);
        };

        if (!fileUploaded.stream) {
          setLoading(null);
          setError(
            "This browser is not supported. Try using Google Chrome instead."
          );
          return;
        }

        if (isDebug) {
          console.log(
            chalk.bold.blue(`[DEBUG] `) +
              chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
              `  ${chalk.yellow(`Initializing file reader`)}`
          );
          await delay(50);
          setLoading("Loading Package|||Initializing file reader");
        }

        const fileReader = fileUploaded.stream().getReader();
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await fileReader.read();
          if (done) {
            reader.push(new Uint8Array(0), true);
            break;
          }
          for (let i = 0; i < value.length; i += 65536) {
            reader.push(value.subarray(i, i + 65536));
          }
        }

        if (isDebug) {
          console.log(
            chalk.bold.blue(`[DEBUG] `) +
              chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
              `  ${chalk.yellow(`Checking package validity`)}`
          );
          await delay(50);
          setLoading("Loading Package|||Checking for Valid Package");
        } else await delay(100);

        let validPackage = true;

        const requiredFiles = [
          "README.txt",
          "account/user.json",
          "messages/index.json",
          "servers/index.json",
        ];

        for (const requiredFile of requiredFiles) {
          if (!files.some((file) => file.name === requiredFile))
            validPackage = false;
        }

        if (!validPackage) {
          setLoading(null);
          setError("This package is not a valid package. Please try again.");
          return;
        }

        async function extractData(files: any, options: any) {
          if (isDebug)
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Preparing to extract Data`)}`
            );
          let data: objectInterface = {
            user: {
              id: null,
              username: null,
              discriminator: null,
              avatar: null,
              premium_until: null,
              flags: null,
              badges: [],
            },
            settings: {
              appearance: null,
              recentEmojis: null,
            },
            connections: null,
            bots: null,
            payments: {
              total: null,
              transactions: null,
              giftedNitro: null,
            },
            messages: {
              topChannels: null,
              topDMs: null,
              characterCount: null,
              messageCount: null,
              hoursValues: [],
              oldestMessages: null,
              topCustomEmojis: null,
              topEmojis: null,
            },
            guilds: null,
            statistics: {
              openCount: null,
              averageOpenCount: {
                day: null,
                week: null,
                month: null,
                year: null,
              },
              notificationCount: null,
              joinedVoiceChannelsCount: null,
              joinedCallsCount: null,
              reactionsAddedCount: null,
              messageEditCount: null,
              sendMessage: null,
              averageMessages: {
                day: null,
                week: null,
                month: null,
                year: null,
              },
            },
          };

          setPercent(2);
          if (isDebug)
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Loading user information`)}`
            );

          setPercent(5);
          setLoading("Loading User Information|||");

          if (isDebug) {
            await delay(1000);
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Parsing account/user.json`)}`
            );
          } else await delay(100);

          const userInformationData = JSON.parse(
            await Utils.readFile("account/user.json", files)
          );

          if (isDebug) {
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Loading main information`)}`
            );

            setLoading("Loading User Information|||Loading Main Information");
          } else await delay(100);

          setPercent(6);
          if (userInformationData.id) {
            data.user.id = userInformationData.id;
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded user ID ${userInformationData.id}`
                  )}`
              );
          } else throw new Error("User ID not found");

          const userId: any = data.user.id;

          if (userInformationData.username)
            data.user.username = userInformationData.username;
          if (userInformationData.discriminator) {
            let discriminator = userInformationData.discriminator;
            if (discriminator > 0 && discriminator < 10) {
              discriminator = "000" + discriminator;
            }
            data.user.discriminator = discriminator;
          }

          setPercent(8);
          if (isDebug)
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(
                  `Loaded user ${userInformationData?.username}#${userInformationData?.discriminator}`
                )}`
            );

          if (userInformationData.avatar_hash)
            data.user.avatar = userInformationData.avatar_hash;

          if (isDebug)
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(
                  `Loaded user avatar hash ${userInformationData?.avatar_hash}`
                )}`
            );

          setPercent(10);
          if (options.user.premium_until) {
            if (userInformationData.premium_until)
              data.user.premium_until = userInformationData.premium_until;
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Loaded user premium until`)}`
              );
          }

          if (isDebug) {
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Preparing to load settings`)}`
            );
            await delay(400);
            setLoading(
              "Loading User Information|||Loading Setting Information"
            );
          } else await delay(100);
          setPercent(11);

          if (!isDebug) setLoading("Loading User Settings|||");
          if (
            userInformationData.settings &&
            userInformationData.settings.settings
          ) {
            if (options.settings.appearance) {
              if (isDebug)
                console.log(
                  chalk.bold.blue(`[DEBUG] `) +
                    chalk.bold.cyan(
                      `[${moment(Date.now()).format("h:mm:ss a")}]`
                    ) +
                    `  ${chalk.yellow(`Loaded settings appearance`)}`
                );
              if (userInformationData.settings.settings.appearance)
                data.settings.appearance =
                  userInformationData.settings.settings.appearance;
            }

            // if (options.settings.folderCount) {
            //   if (
            //     userInformationData.settings.settings.guildFolders &&
            //     userInformationData.settings.settings.guildFolders.folders
            //   )
            //     data.settings.folderCount =
            //       userInformationData.settings.settings.guildFolders.folders.filter(
            //         (s) => {
            //           return (
            //             s.guildIds &&
            //             s.guildIds.length > 0 &&
            //             s.guildIds.length !== 1 &&
            //             s.guildIds.length <= 4
            //           );
            //         }
            //       ).length;
            // }
          }

          if (isDebug) {
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Loading setting Frecency`)}`
            );
            await delay(700);
            setLoading("Loading User Information|||Loading Setting Frecency");
          } else await delay(100);
          setPercent(13);

          if (
            userInformationData.settings &&
            userInformationData.settings.frecency
          ) {
            if (options.settings.recentEmojis) {
              if (
                userInformationData.settings.frecency.emojiFrecency &&
                userInformationData.settings.frecency.emojiFrecency.emojis
              ) {
                const emojis: Array<any> = [];
                Object.keys(
                  userInformationData.settings.frecency.emojiFrecency.emojis
                ).forEach((key: any) => {
                  const key_e =
                    userInformationData.settings.frecency.emojiFrecency.emojis[
                      key
                    ];
                  emojis.push({
                    name: key,
                    count: key_e.totalUses,
                  });
                });

                data.settings.recentEmojis = emojis;
                if (isDebug)
                  console.log(
                    chalk.bold.blue(`[DEBUG] `) +
                      chalk.bold.cyan(
                        `[${moment(Date.now()).format("h:mm:ss a")}]`
                      ) +
                      `  ${chalk.yellow(
                        `Loaded ${emojis.length} recent emojis`
                      )}`
                  );
              }
            }
          }

          setPercent(15);

          if (options.connections) {
            if (isDebug) {
              setLoading("Loading User Information|||Loading User Connections");
              await delay(600);
            } else {
              setLoading("Loading User Connections|||");
              await delay(100);
            }

            if (
              userInformationData.connections &&
              userInformationData.connections.length
            ) {
              if (
                Object.values(userInformationData.connections).filter(
                  (s: any): boolean => s.type !== "contacts"
                ).length
              ) {
                const cncs = Object.values(userInformationData.connections)
                  .filter((s: any): any => s.type !== "contacts")
                  .map((e: any): any => {
                    return {
                      type: e.type,
                      name: e.name,
                      visible: e.visibility === 0 ? false : true,
                      id: e.id,
                    };
                  });
                data.connections = cncs;
                if (isDebug)
                  console.log(
                    chalk.bold.blue(`[DEBUG] `) +
                      chalk.bold.cyan(
                        `[${moment(Date.now()).format("h:mm:ss a")}]`
                      ) +
                      `  ${chalk.yellow(`Loaded ${cncs.length} connections`)}`
                  );
              }
            }
          }

          if (isDebug)
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Loading payments`)}`
            );
          setPercent(20);
          if (isDebug) {
            setLoading("Loading User Information|||Loading User Payments");
            await delay(700);
          } else {
            setLoading("Loading User Payments|||");
            await delay(100);
          }

          if (
            userInformationData.entitlements &&
            options.payments.giftedNitro
          ) {
            const gifted = Object.values(userInformationData.entitlements);
            if (gifted.length) {
              const types: any = {};
              gifted.forEach((e: any): any => {
                if (e.subscription_plan && e.subscription_plan.name) {
                  if (e.subscription_plan.name in types) {
                    types[e.subscription_plan.name] += 1;
                  } else {
                    types[e.subscription_plan.name] = 1;
                  }
                }
              });
              if (isDebug)
                console.log(
                  chalk.bold.blue(`[DEBUG] `) +
                    chalk.bold.cyan(
                      `[${moment(Date.now()).format("h:mm:ss a")}]`
                    ) +
                    `  ${chalk.yellow(
                      `Loaded ${Object.keys(types).length} payments`
                    )}`
                );
              data.payments.giftedNitro = types;
            }
          }

          const confirmedPayments = userInformationData?.payments.filter(
            (p: any): boolean => p.status === 1
          );
          if (confirmedPayments.length) {
            if (options.payments.total) {
              data.payments.total += confirmedPayments
                .map((p: any): number => p.amount / 100)
                .reduce((p: number, c: number): number => p + c);
            }

            if (options.payments.transactions) {
              const trns = confirmedPayments
                .sort(
                  (a: any, b: any): number =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
                )
                .map((p: any): object => {
                  return {
                    information: p.description,
                    amount: p.amount / 100,
                    currency: p.currency,
                    date: p.created_at,
                  };
                });
              data.payments.transactions = trns;
              if (isDebug)
                console.log(
                  chalk.bold.blue(`[DEBUG] `) +
                    chalk.bold.cyan(
                      `[${moment(Date.now()).format("h:mm:ss a")}]`
                    ) +
                    `  ${chalk.yellow(`Loaded ${trns.length} transactions`)}`
                );
            }
          }

          setPercent(22);
          if (isDebug) {
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Loaded user information`)}`
            );
            setLoading("Loading User Information|||Loaded User Information");
            await delay(2000);
          } else await delay(100);
          setPercent(25);
          setLoading("Loading Messages");
          if (isDebug) {
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(
                  `Preparing to load messages [messages/index.json]`
                )}`
            );
          } else await delay(100);

          setPercent(27);
          const userMessages = JSON.parse(
            await Utils.readFile("messages/index.json", files)
          );
          const messagesREGEX = /messages\/c?([0-9]{16,32})\/$/;
          const channelsIDFILE = files.filter((file: any) => {
            if (file && file?.name) {
              return messagesREGEX.test(file.name);
            }
          });

          if (!channelsIDFILE[0]?.name) {
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Error: channelsIDFILE[0].name. Check array below:`
                  )}`
              );
            if (isDebug) console.log(channelsIDFILE);
            throw new Error("invalid_package_missing_messages");
          }

          const isOldPackage =
            channelsIDFILE[0].name.match(
              /messages\/(c)?([0-9]{16,32})\/$/
            )[1] === undefined;

          const channelsIDs = channelsIDFILE.map((file: any) => {
            if (file && file?.name) {
              return file.name.match(messagesREGEX)[1];
            }
          });

          const channels: Array<any> = [];
          let messagesRead = 0;

          if (isDebug) {
            setLoading("Loading Messages|||Scanning Messages");
            await delay(600);
          } else await delay(100);

          setPercent(32);

          if (isDebug)
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Started message scan`)}`
            );

          await Promise.all(
            channelsIDs.map((channelID: any): any => {
              return new Promise((resolve) => {
                const channelDataPath = `messages/${
                  isOldPackage ? "" : "c"
                }${channelID}/channel.json`;
                const channelMessagesPath = `messages/${
                  isOldPackage ? "" : "c"
                }${channelID}/messages.csv`;

                Promise.all([
                  Utils.readFile(channelDataPath, files),
                  Utils.readFile(channelMessagesPath, files),
                ]).then(([rawData, rawMessages]) => {
                  if (!rawData || !rawMessages) {
                    return resolve([rawData, rawMessages]);
                  } else messagesRead++;

                  const data_ = JSON.parse(rawData);
                  const messages = Utils.parseCSV(rawMessages);
                  const name = userMessages[data_.id];
                  const isDM =
                    data_.recipients && data_.recipients.length === 2;
                  const dmUserID = isDM
                    ? data_.recipients.find(
                        (userID: any): boolean => userID !== userId
                      )
                    : undefined;
                  channels.push({
                    data_,
                    messages,
                    name,
                    isDM,
                    dmUserID,
                  });

                  resolve([rawData, rawMessages]);
                });
              });
            })
          );

          if (isDebug) {
            setLoading("Loading Messages|||Finished Message Scan");
            await delay(600);
          } else await delay(100);

          setPercent(34);
          if (messagesRead === 0)
            throw new Error("invalid_package_missing_messages");

          if (isDebug)
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Loaded ${messagesRead} message files`)}`
            );

          setPercent(35);
          if (isDebug) {
            await delay(700);
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(
                  `Preparing to load Channels (Channels, DMs, Groups)`
                )}`
            );
          } else await delay(100);

          if (options.messages.topChannels) {
            setPercent(38);
            if (isDebug) {
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Calculating top channels`)}`
              );
              setLoading("Loading Messages|||Calculating top Channels");
            } else await delay(100);

            data.messages.topChannels = channels
              .filter((c) => c.data_ && c.data_.guild)
              .sort((a, b) => b.messages.length - a.messages.length)

              .map((channel) => {
                const words = channel.messages
                  .map((message: any): any => message.words)
                  .flat()
                  .filter((w: any): any => {
                    const mentionRegex = /^<@!?(\d+)>$/;
                    const mention_ = mentionRegex.test(w)
                      ? w.match(mentionRegex)[1]
                      : null;

                    return !mention_;
                  });

                const oldestMessages = channel.messages
                  .map((message: any): any => {
                    return {
                      sentence: message.words.join(" "),
                      timestamp: message.timestamp,
                      author: `channel: ${channel.name} (guild: ${channel.data_.guild.name})`,
                    };
                  })
                  .flat()
                  .sort((a: any, b: any): any => {
                    const date1: any = new Date(a.timestamp);
                    const date2: any = new Date(b.timestamp);

                    return date1 - date2;
                  })
                  .slice(0, 100);

                const topEmojisANDcustom = channel.messages
                  .map((message: any): any => {
                    const emojis = Utils.getEmojiCount(message.words);
                    const customEmojis = Utils.getCustomEmojiCount(
                      message.words
                    );

                    return {
                      emojis:
                        emojis && Object.keys(emojis).length ? emojis : null,
                      customEmojis:
                        customEmojis && customEmojis.length
                          ? customEmojis
                          : null,
                    };
                  })
                  .flat();

                const topEmojis_ = topEmojisANDcustom
                  .flat()
                  .filter((w: any) => w.emojis)
                  .map((w: any) => w.emojis)
                  .flat();

                const topEmojis: Array<any> = [];
                topEmojis_.forEach((key: any) => {
                  if (!topEmojis.find((x) => x.emoji === key.emoji)) {
                    topEmojis.push({
                      emoji: key.emoji,
                      count: 1,
                    });
                  } else {
                    const index = topEmojis.findIndex(
                      (x) => x.emoji === key.emoji
                    );
                    topEmojis[index].count += 1;
                  }
                });

                const topCustomEmojis_ = topEmojisANDcustom
                  .flat()
                  .filter((w: any) => w.customEmojis)
                  .map((w: any) => w.customEmojis)
                  .flat();

                const topCustomEmojis: Array<any> = [];
                topCustomEmojis_.forEach((key: any) => {
                  if (!topCustomEmojis.find((x) => x.emoji === key.emoji)) {
                    topCustomEmojis.push({
                      emoji: key.emoji,
                      count: 1,
                    });
                  } else {
                    const index = topCustomEmojis.findIndex(
                      (x) => x.emoji === key.emoji
                    );
                    topCustomEmojis[index].count += 1;
                  }
                });

                const favoriteWords = Utils.getFavoriteWords(words);
                const curseWords = Utils.getCursedWords(
                  words.filter((w: any) => w.length < 10 && !/[^\w\s]/g.test(w))
                );
                const topCursed = curseWords;
                const links = Utils.getTopLinks(words);
                const topLinks = links;
                const discordLink = Utils.getDiscordLinks(words);
                const topDiscordLinks = discordLink;

                return {
                  name: channel.name,
                  messageCount: channel.messages.length,
                  guildName: channel.data_.guild.name,
                  favoriteWords: options.other.favoriteWords
                    ? favoriteWords
                    : null,
                  topCursed: options.other.showCurseWords ? topCursed : null,
                  topLinks: options.other.showLinks ? topLinks : null,
                  topDiscordLinks: options.other.showDiscordLinks
                    ? topDiscordLinks
                    : null,
                  oldestMessages: options.other.oldestMessages
                    ? oldestMessages
                    : null,
                  topEmojis: options.other.topEmojis
                    ? topEmojis.sort((a, b) => b.count - a.count)
                    : null,
                  topCustomEmojis: options.other.topCustomEmojis
                    ? topCustomEmojis.sort((a, b) => b.count - a.count)
                    : null,
                };
              });

            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${data?.messages?.topChannels?.length} channels`
                  )}`
              );
          }

          if (options.messages.topDMs) {
            setPercent(42);
            if (isDebug) {
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Loading top DMs`)}`
              );
              setLoading("Loading Messages|||Calculating top DMs");
            } else await delay(100);

            data.messages.topDMs = channels
              .filter(
                (channel) =>
                  channel?.isDM &&
                  channel?.name?.includes("Direct Message with")
              )
              .sort((a, b) => b.messages.length - a.messages.length)

              .map((channel) => {
                const words = channel.messages
                  .map((message: any) => message.words)
                  .flat()
                  .filter((w: any) => {
                    const mentionRegex = /^<@!?(\d+)>$/;
                    const mention_ = mentionRegex.test(w)
                      ? w.match(mentionRegex)[1]
                      : null;

                    return !mention_;
                  });

                const oldestMessages = channel.messages
                  .map((message: any) => {
                    return {
                      sentence: message.words.join(" "),
                      timestamp: message.timestamp,
                      author: `user: ${channel.name
                        .split("Direct Message with")[1]
                        .trim()} (id: ${channel.dmUserID})`,
                    };
                  })
                  .flat()
                  .sort((a: any, b: any): any => {
                    const date1: any = new Date(a.timestamp);
                    const date2: any = new Date(b.timestamp);

                    return date1 - date2;
                  })
                  .slice(0, 100);

                const topEmojisANDcustom = channel.messages
                  .map((message: any) => {
                    const emojis = Utils.getEmojiCount(message.words);
                    const customEmojis = Utils.getCustomEmojiCount(
                      message.words
                    );

                    return {
                      emojis:
                        emojis && Object.keys(emojis).length ? emojis : null,
                      customEmojis:
                        customEmojis && customEmojis.length
                          ? customEmojis
                          : null,
                    };
                  })
                  .flat();

                const topEmojis_ = topEmojisANDcustom
                  .flat()
                  .filter((w: any) => w.emojis)
                  .map((w: any) => w.emojis)
                  .flat();

                const topEmojis: Array<any> = [];
                topEmojis_.forEach((key: any) => {
                  if (!topEmojis.find((x) => x.emoji === key.emoji)) {
                    topEmojis.push({
                      emoji: key.emoji,
                      count: 1,
                    });
                  } else {
                    const index = topEmojis.findIndex(
                      (x) => x.emoji === key.emoji
                    );
                    topEmojis[index].count += 1;
                  }
                });

                const topCustomEmojis_ = topEmojisANDcustom
                  .flat()
                  .filter((w: any) => w.customEmojis)
                  .map((w: any) => w.customEmojis)
                  .flat();

                const topCustomEmojis: Array<any> = [];
                topCustomEmojis_.forEach((key: any) => {
                  if (!topCustomEmojis.find((x) => x.emoji === key.emoji)) {
                    topCustomEmojis.push({
                      emoji: key.emoji,
                      count: 1,
                    });
                  } else {
                    const index = topCustomEmojis.findIndex(
                      (x) => x.emoji === key.emoji
                    );
                    topCustomEmojis[index].count += 1;
                  }
                });
                const favoriteWords = Utils.getFavoriteWords(words);
                const curseWords = Utils.getCursedWords(
                  words.filter((w: any) => w.length < 10 && !/[^\w\s]/g.test(w))
                );
                const topCursed = curseWords;
                const links = Utils.getTopLinks(words);
                const topLinks = links;
                const discordLink = Utils.getDiscordLinks(words);
                const topDiscordLinks = discordLink;

                return {
                  channel_id: channel.data_.id,
                  user_id: channel.dmUserID,
                  user_tag: channel.name.split("Direct Message with")[1].trim(),
                  messageCount: channel.messages.length,
                  favoriteWords: options.other.favoriteWords
                    ? favoriteWords
                    : null,
                  topCursed: options.other.showCurseWords ? topCursed : null,
                  topLinks: options.other.showLinks ? topLinks : null,
                  topDiscordLinks: options.other.showDiscordLinks
                    ? topDiscordLinks
                    : null,
                  oldestMessages,
                  topEmojis: options.other.topEmojis
                    ? topEmojis.sort((a, b) => b.count - a.count)
                    : null,
                  topCustomEmojis: options.other.topCustomEmojis
                    ? topCustomEmojis.sort((a, b) => b.count - a.count)
                    : null,
                };
              });

            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${data?.messages?.topDMs?.length} DMs`
                  )}`
              );
          }

          if (options.messages.topGuilds) {
            setPercent(45);
            if (isDebug) {
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Loading top Guilds`)}`
              );
              setLoading("Loading Messages|||Calculating top Guilds");
            } else await delay(100);

            const topGuilds = channels
              .filter((c) => c.data_ && c.data_.guild)
              .sort((a, b) => b.messages.length - a.messages.length)

              .map((channel) => {
                const words = channel.messages
                  .map((message: any) => message.words)
                  .flat()
                  .filter((w: any) => {
                    const mentionRegex = /^<@!?(\d+)>$/;
                    const mention_ = mentionRegex.test(w)
                      ? w.match(mentionRegex)[1]
                      : null;

                    return !mention_;
                  });

                const oldestMessages = channel.messages
                  .map((message: any) => {
                    return {
                      sentence: message.words.join(" "),
                      timestamp: message.timestamp,
                      author: `channel: ${channel.name} (guild: ${channel.data_.guild.name})`,
                    };
                  })
                  .flat()
                  .sort((a: any, b: any): any => {
                    const date1: any = new Date(a.timestamp);
                    const date2: any = new Date(b.timestamp);

                    return date1 - date2;
                  })
                  .slice(0, 100);

                const topEmojisANDcustom = channel.messages
                  .map((message: any) => {
                    const emojis = Utils.getEmojiCount(message.words);
                    const customEmojis = Utils.getCustomEmojiCount(
                      message.words
                    );

                    return {
                      emojis:
                        emojis && Object.keys(emojis).length ? emojis : null,
                      customEmojis:
                        customEmojis && customEmojis.length
                          ? customEmojis
                          : null,
                    };
                  })
                  .flat();

                const topEmojis_ = topEmojisANDcustom
                  .flat()
                  .filter((w: any) => w.emojis)
                  .map((w: any) => w.emojis)
                  .flat();

                const topEmojis: Array<any> = [];
                topEmojis_.forEach((key: any) => {
                  if (!topEmojis.find((x) => x.emoji === key.emoji)) {
                    topEmojis.push({
                      emoji: key.emoji,
                      count: 1,
                    });
                  } else {
                    const index = topEmojis.findIndex(
                      (x) => x.emoji === key.emoji
                    );
                    topEmojis[index].count += 1;
                  }
                });

                const topCustomEmojis_ = topEmojisANDcustom
                  .flat()
                  .filter((w: any) => w.customEmojis)
                  .map((w: any) => w.customEmojis)
                  .flat();

                const topCustomEmojis: Array<any> = [];
                topCustomEmojis_.forEach((key: any) => {
                  if (!topCustomEmojis.find((x) => x.emoji === key.emoji)) {
                    topCustomEmojis.push({
                      emoji: key.emoji,
                      count: 1,
                    });
                  } else {
                    const index = topCustomEmojis.findIndex(
                      (x) => x.emoji === key.emoji
                    );
                    topCustomEmojis[index].count += 1;
                  }
                });

                const favoriteWords = Utils.getFavoriteWords(words);
                const curseWords = Utils.getCursedWords(
                  words.filter((w: any) => w.length < 10 && !/[^\w\s]/g.test(w))
                );
                const topCursed = curseWords;
                const links = Utils.getTopLinks(words);
                const topLinks = links;
                const discordLink = Utils.getDiscordLinks(words);
                const topDiscordLinks = discordLink;

                return {
                  name: channel.name,
                  messageCount: channel.messages.length,
                  guildName: channel.data_.guild.name,
                  favoriteWords: options.other.favoriteWords
                    ? favoriteWords
                    : null,
                  topCursed: options.other.showCurseWords ? topCursed : null,
                  topLinks: options.other.showLinks ? topLinks : null,
                  topDiscordLinks: options.other.showDiscordLinks
                    ? topDiscordLinks
                    : null,
                  oldestMessages: options.other.oldestMessages
                    ? oldestMessages
                    : null,
                  topEmojis: options.other.topEmojis
                    ? topEmojis.sort((a, b) => b.count - a.count)
                    : null,
                  topCustomEmojis: options.other.topCustomEmojis
                    ? topCustomEmojis.sort((a, b) => b.count - a.count)
                    : null,
                };
              });

            const guilds: Array<any> = [];

            // eslint-disable-next-line no-inner-declarations
            function merge(a: Array<any>, b: Array<any>) {
              return a.concat(b);
            }

            topGuilds.forEach((ch: any): any => {
              if (!guilds.find((x) => x.guildName === ch.guildName)) {
                ch.name = [ch.name];
                guilds.push(ch);
              } else {
                const index = guilds.findIndex(
                  (x) => x.guildName === ch.guildName
                );

                guilds[index].name.push(ch.name);
                guilds[index].messageCount += ch.messageCount;

                if (options.other.favoriteWords) {
                  guilds[index].favoriteWords = merge(
                    guilds[index].favoriteWords,
                    ch.favoriteWords
                  );
                }

                if (options.other.showCurseWords) {
                  guilds[index].topCursed = merge(
                    guilds[index].topCursed,
                    ch.topCursed
                  );
                }

                if (options.other.showLinks) {
                  guilds[index].topLinks = merge(
                    guilds[index].topLinks,
                    ch.topLinks
                  );
                }

                if (options.other.showDiscordLinks) {
                  guilds[index].topDiscordLinks = merge(
                    guilds[index].topDiscordLinks,
                    ch.topDiscordLinks
                  );
                }

                if (options.other.oldestMessages) {
                  guilds[index].oldestMessages = merge(
                    guilds[index].oldestMessages,
                    ch.oldestMessages
                  );
                }

                if (options.other.topEmojis) {
                  guilds[index].topEmojis = merge(
                    guilds[index].topEmojis,
                    ch.topEmojis
                  );
                }

                if (options.other.topCustomEmojis) {
                  guilds[index].topCustomEmojis = merge(
                    guilds[index].topCustomEmojis,
                    ch.topCustomEmojis
                  );
                }
              }
            });

            data.messages.topGuilds = guilds.sort(
              (a, b) => b.messageCount - a.messageCount
            );

            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${data?.messages?.topGuilds?.length} guilds`
                  )} `
              );
          }

          if (options.messages.topGroupDMs) {
            setPercent(48);
            if (isDebug) {
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Loading top group DMs`)}`
              );
              setLoading("Loading Messages|||Calculating top Group DMs");
            } else await delay(100);

            const channel_ = channels
              .filter(
                (c) =>
                  c?.data_ &&
                  !c?.data_?.guild &&
                  !c?.isDM &&
                  c?.data_?.recipients?.length > 1 &&
                  !c?.dmUserID
              )
              .sort((a, b) => b.messages.length - a.messages.length);

            const channel__ = channel_.map((channel) => {
              const words = channel.messages
                .map((message: any) => message.words)
                .flat()
                .filter((w: any) => {
                  const mentionRegex = /^<@!?(\d+)>$/;
                  const mention_ = mentionRegex.test(w)
                    ? w.match(mentionRegex)[1]
                    : null;

                  return !mention_;
                });

              const oldestMessages = channel.messages
                .map((message: any) => {
                  return {
                    sentence: message.words.join(" "),
                    timestamp: message.timestamp,
                  };
                })
                .flat()
                .sort((a: any, b: any): any => {
                  const date1: any = new Date(a.timestamp);
                  const date2: any = new Date(b.timestamp);

                  return date1 - date2;
                })
                .slice(0, 100);

              const topEmojisANDcustom = channel.messages
                .map((message: any) => {
                  const emojis = Utils.getEmojiCount(message.words);
                  const customEmojis = Utils.getCustomEmojiCount(message.words);

                  return {
                    emojis:
                      emojis && Object.keys(emojis).length ? emojis : null,
                    customEmojis:
                      customEmojis && customEmojis.length ? customEmojis : null,
                  };
                })
                .flat();

              const topEmojis_ = topEmojisANDcustom
                .flat()
                .filter((w: any) => w.emojis)
                .map((w: any) => w.emojis)
                .flat();

              const topEmojis: Array<any> = [];
              topEmojis_.forEach((key: any) => {
                if (!topEmojis.find((x) => x.emoji === key.emoji)) {
                  topEmojis.push({
                    emoji: key.emoji,
                    count: 1,
                  });
                } else {
                  const index = topEmojis.findIndex(
                    (x) => x.emoji === key.emoji
                  );
                  topEmojis[index].count += 1;
                }
              });

              const topCustomEmojis_ = topEmojisANDcustom
                .flat()
                .filter((w: any) => w.customEmojis)
                .map((w: any) => w.customEmojis)
                .flat();

              const topCustomEmojis: Array<any> = [];
              topCustomEmojis_.forEach((key: any) => {
                if (!topCustomEmojis.find((x) => x.emoji === key.emoji)) {
                  topCustomEmojis.push({
                    emoji: key.emoji,
                    count: 1,
                  });
                } else {
                  const index = topCustomEmojis.findIndex(
                    (x) => x.emoji === key.emoji
                  );
                  topCustomEmojis[index].count += 1;
                }
              });

              const favoriteWords = Utils.getFavoriteWords(words);
              const curseWords = Utils.getCursedWords(
                words.filter((w: any) => w.length < 10 && !/[^\w\s]/g.test(w))
              );
              const topCursed = curseWords;
              const links = Utils.getTopLinks(words);
              const topLinks = links;
              const discordLink = Utils.getDiscordLinks(words);
              const topDiscordLinks = discordLink;

              return {
                name: channel.name,
                messageCount: channel.messages.length,
                recipients: channel.data_.recipients.length,
                favoriteWords: options.other.favoriteWords
                  ? favoriteWords
                  : null,
                topCursed: options.other.showCurseWords ? topCursed : null,
                topLinks: options.other.showLinks ? topLinks : null,
                topDiscordLinks: options.other.showDiscordLinks
                  ? topDiscordLinks
                  : null,
                oldestMessages: options.other.oldestMessages
                  ? oldestMessages
                  : null,
                topEmojis: options.other.topEmojis
                  ? topEmojis.sort((a, b) => b.count - a.count)
                  : null,
                topCustomEmojis: options.other.topCustomEmojis
                  ? topCustomEmojis.sort((a, b) => b.count - a.count)
                  : null,
              };
            });

            data.messages.topGroupDMs = channel__.sort(
              (a, b) => b.messageCount - a.messageCount
            );

            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${data?.messages?.topGroupDMs?.length} group DMs`
                  )} `
              );
          }

          if (options.messages.characterCount) {
            setPercent(52);
            if (isDebug) {
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Calculating character count & message count`
                  )}`
              );
              setLoading("Loading Messages|||Getting your character Count");
              await delay(700);
            } else await delay(100);

            data.messages.characterCount = channels
              .map((channel) => channel.messages)
              .flat()
              .map((message: any) => message.length)
              .reduce((p, c) => p + c);

            data.messages.messageCount = channels
              .map((channel) => channel.messages)
              .flat().length;
          }

          if (options.messages.oldestMessages) {
            setPercent(56);
            if (isDebug) {
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Calculating your old messages on discord`
                  )}`
              );
              setLoading("Loading Messages|||Getting your oldest messages");
              await delay(700);
            } else await delay(100);

            const oldestInChannel = channels
              .filter((c) => c.data_ && c.data_.guild)
              .map((channel) => {
                const words = channel.messages
                  .map((message: any) => {
                    return {
                      sentence: message.words.join(" "),
                      timestamp: message.timestamp,
                      author: `channel: ${channel.name} (guild: ${channel.data_.guild.name})`,
                    };
                  })
                  .flat();

                return words;
              })
              .flat()
              .sort((a: any, b: any): any => {
                const date1: any = new Date(a.timestamp);
                const date2: any = new Date(b.timestamp);

                return date1 - date2;
              });

            const oldestInDMs = channels
              .filter(
                (channel) =>
                  channel?.isDM &&
                  channel?.name?.includes("Direct Message with")
              )

              .map((channel) => {
                const words = channel.messages
                  .map((message: any) => {
                    return {
                      sentence: message.words.join(" "),
                      timestamp: message.timestamp,
                      author: `user: ${channel.name
                        .split("Direct Message with")[1]
                        .trim()} (ID: ${channel.dmUserID})`,
                    };
                  })
                  .flat();
                return words;
              })
              .flat()
              .sort((a: any, b: any): any => {
                const date1: any = new Date(a.timestamp);
                const date2: any = new Date(b.timestamp);

                return date1 - date2;
              });

            const oldestInGroupDM = channels
              .filter(
                (c) =>
                  c?.data_ &&
                  !c?.data_?.guild &&
                  !c?.isDM &&
                  c?.data_?.recipients?.length > 1 &&
                  !c?.dmUserID
              )
              .map((channel) => {
                const words = channel.messages
                  .map((message: any) => {
                    return {
                      sentence: message.words.join(" "),
                      timestamp: message.timestamp,
                      author: `Group Name: ${
                        channel.name ? channel.name : "Unknown DM"
                      }`,
                    };
                  })
                  .flat();
                return words;
              })
              .flat()
              .sort((a: any, b: any): any => {
                const date1: any = new Date(a.timestamp);
                const date2: any = new Date(b.timestamp);

                return date1 - date2;
              });

            const oldestInTotal = oldestInChannel
              .concat(oldestInDMs)
              .concat(oldestInGroupDM)
              .sort((a: any, b: any): number => {
                const date1: any = new Date(a.timestamp);
                const date2: any = new Date(b.timestamp);

                return date1 - date2;
              });

            data.messages.oldestMessages = oldestInTotal.slice(0, 1000);
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${data?.messages?.oldestMessages?.length} oldest messages`
                  )}`
              );
          }

          if (options.messages.attachmentCount) {
            if (isDebug) {
              setLoading("Loading Messages|||Getting your attachment Count");
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Loading your attachment Count`)}`
              );
            } else await delay(100);

            setPercent(58);
            const oldestInChannel = channels
              .map((channel) => {
                const words = channel.messages
                  .map((message: any) => {
                    const regex =
                      /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|mp4|pdf|zip|wmv|mp3|nitf|doc|docx))/gi;
                    const tenorGIFregex =
                      /https?:\/\/(c\.tenor\.com\/([^ /\n]+)\/([^ /\n]+)\.gif|tenor\.com\/view\/(?:.*-)?([^ /\n]+))/gi;

                    const attachments = message.words.filter((word: any) => {
                      if (tenorGIFregex.test(word)) return true;
                      return regex.test(word);
                    });

                    // replace everything before and after the regex with ""
                    const attachmentsCleaned = attachments.map(
                      (attachment: any) => {
                        const mtch = regex.test(attachment)
                          ? attachment.match(
                              regex
                              // eslint-disable-next-line no-mixed-spaces-and-tabs
                              // eslint-disable-next-line no-mixed-spaces-and-tabs
                            )[0]
                          : tenorGIFregex.test(attachment)
                          ? attachment.match(
                              tenorGIFregex
                              // eslint-disable-next-line no-mixed-spaces-and-tabs
                              // eslint-disable-next-line no-mixed-spaces-and-tabs
                            )[0]
                          : attachment;

                        if (mtch && mtch.length > 25)
                          return mtch
                            .replace(/`/g, "")
                            .replace(/"/g, "")
                            .replace(/\|/g, "")
                            .replace(/'/g, "")
                            .replace(/{/g, "")
                            .replace(/}/g, "")
                            .replace(/\[/g, "")
                            .replace(/\]/g, "");
                      }
                    );

                    return attachmentsCleaned.filter(
                      (s: Array<any>) => s && s.length > 0
                    );
                  })
                  .flat();

                return words;
              })
              .flat();

            data.messages.attachmentCount = oldestInChannel;
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${data?.messages?.attachmentCount?.length} attachments`
                  )}`
              );
          }

          if (options.messages.mentionCount) {
            if (isDebug) {
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Loading your mention Count`)}`
              );
              setLoading("Loading Messages|||Getting your mention Count");
            } else await delay(100);

            setPercent(62);
            const oldestInChannel = channels
              .map((channel) => {
                const words = channel.messages
                  .map((message: any) => {
                    const discordChannelMentionRegex = /<#[0-9]*>/gi;
                    const discordUserMentionRegex = /<@[0-9]*>/gi;
                    const discordRoleMentionRegex = /<@&[0-9]*>/gi;

                    const mentions = message.words.map(() => {
                      const o = {
                        channel: message.words.filter((word: any) =>
                          discordChannelMentionRegex.test(word)
                        ).length,
                        user: message.words.filter((word: any) =>
                          discordUserMentionRegex.test(word)
                        ).length,
                        role: message.words.filter((word: any) =>
                          discordRoleMentionRegex.test(word)
                        ).length,
                        here: message.words.filter((word: any) =>
                          /@here/g.test(word)
                        ).length,
                        everyone: message.words.filter((word: any) =>
                          /@everyone/g.test(word)
                        ).length,
                      };

                      //if all the keys length are 0 return
                      if (
                        o.channel === 0 &&
                        o.user === 0 &&
                        o.role === 0 &&
                        o.here === 0 &&
                        o.everyone === 0
                      ) {
                        return false;
                      } else {
                        return o;
                      }
                    });

                    return mentions;
                  })
                  .flat();

                return words;
              })
              .flat()
              .filter((x) => x)
              .sort(
                (a, b) =>
                  a.channel +
                  a.user +
                  a.role +
                  a.here +
                  a.everyone -
                  b.channel +
                  b.user +
                  b.role +
                  b.here +
                  b.everyone
              );

            const top: any = {};
            oldestInChannel.forEach((mention) => {
              if (mention.channel > 0) {
                if (top.channel) {
                  top.channel += mention.channel;
                } else {
                  top.channel = mention.channel;
                }
              }
              if (mention.user > 0) {
                if (top.user) {
                  top.user += mention.user;
                } else {
                  top.user = mention.user;
                }
              }
              if (mention.role > 0) {
                if (top.role) {
                  top.role += mention.role;
                } else {
                  top.role = mention.role;
                }
              }

              if (mention.here > 0) {
                if (top.here) {
                  top.here += mention.here;
                } else {
                  top.here = mention.here;
                }
              }

              if (mention.everyone > 0) {
                if (top.everyone) {
                  top.everyone += mention.everyone;
                } else {
                  top.everyone = mention.everyone;
                }
              }
            });

            data.messages.mentionCount = top;
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Loaded mentions`)}`
              );
          }

          if (options.messages.topEmojis) {
            if (isDebug) await delay(700);
            setPercent(68);
            if (isDebug) {
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Calculating your top emojis`)}`
              );
              setLoading("Loading Messages|||Getting your top emojis");
            } else await delay(100);

            const oldestInChannel = channels
              .map((channel) => {
                const words = channel.messages
                  .map((message: any) => {
                    const emojis = Utils.getEmojiCount(message.words);
                    const customEmojis = Utils.getCustomEmojiCount(
                      message.words
                    );

                    return {
                      emojis:
                        emojis && Object.keys(emojis).length ? emojis : null,
                      customEmojis:
                        customEmojis && customEmojis.length
                          ? customEmojis
                          : null,
                    };
                  })
                  .flat();

                return words;
              })
              .flat();

            const mUsedEmojis = oldestInChannel
              .filter((w: any) => w.emojis)
              .map((w: any) => w.emojis)
              .flat();

            const finalEmojiCount: Array<any> = [];
            mUsedEmojis.forEach((key: any) => {
              if (!finalEmojiCount.find((x) => x.emoji === key.emoji)) {
                finalEmojiCount.push({
                  emoji: key.emoji,
                  count: 1,
                });
              } else {
                const index = finalEmojiCount.findIndex(
                  (x) => x.emoji === key.emoji
                );
                finalEmojiCount[index].count += 1;
              }
            });

            data.messages.topEmojis = finalEmojiCount.sort(
              (a, b) => b.count - a.count
            );

            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${data?.messages?.topEmojis?.length} top emojis`
                  )}`
              );
          }

          if (options.messages.topCustomEmojis) {
            if (isDebug) await delay(700);
            setPercent(70);
            if (isDebug) {
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Calculating your top custom emojis`)}`
              );
              setLoading("Loading Messages|||Getting your top custom emojis");
            } else await delay(100);

            const oldestInChannel = channels
              .map((channel) => {
                const words = channel.messages
                  .map((message: any) => {
                    const emojis = Utils.getEmojiCount(message.words);
                    const customEmojis = Utils.getCustomEmojiCount(
                      message.words
                    );

                    return {
                      emojis:
                        emojis && Object.keys(emojis).length ? emojis : null,
                      customEmojis:
                        customEmojis && customEmojis.length
                          ? customEmojis
                          : null,
                    };
                  })
                  .flat();

                return words;
              })
              .flat();

            const mUsedCustom = oldestInChannel
              .filter((w: any) => w.customEmojis)
              .map((w: any) => w.customEmojis)
              .flat();

            const finalCustomCount: Array<any> = [];
            mUsedCustom.forEach((key: any) => {
              if (!finalCustomCount.find((x) => x.emoji === key.emoji)) {
                finalCustomCount.push({
                  emoji: key.emoji,
                  count: 1,
                });
              } else {
                const index = finalCustomCount.findIndex(
                  (x) => x.emoji === key.emoji
                );
                finalCustomCount[index].count += 1;
              }
            });

            data.messages.topCustomEmojis = finalCustomCount.sort(
              (a, b) => b.count - a.count
            );

            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${data?.messages?.topCustomEmojis?.length} top custom emojis`
                  )}`
              );
          }

          if (options.messages.hoursValues) {
            setPercent(72);
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Calculating your top hours on Discord`)}`
              );
            if (isDebug)
              setLoading(
                "Loading Messages|||Calculating your top hours on Discord"
              );

            const hourlyMessages = [];
            for (let i = 0; i < 24; i++) {
              hourlyMessages.push(
                channels
                  .map((c) => c.messages)
                  .flat()
                  .filter((m) => {
                    if (!m.timestamp) return false;
                    const date: any = new Date(m.timestamp).getHours();
                    if (date && date !== "Invalid Date") {
                      return date === i;
                    } else {
                      const date_: any = moment(m.timestamp).format("HH");
                      if (date_) {
                        return date_ == i;
                      } else {
                        return false;
                      }
                    }
                  }).length
              );
            }

            const dailyMessages = [];
            for (let i = 0; i < 7; i++) {
              dailyMessages.push(
                channels
                  .map((c) => c.messages)
                  .flat()
                  .filter((m) => {
                    if (!m.timestamp) return false;
                    const date: any = new Date(m.timestamp).getDay();
                    if (date && date !== "Invalid Date") {
                      return parseInt(date) == i;
                    } else {
                      const date_: any = moment(m.timestamp).format("d");
                      if (date_) {
                        return date_ == i;
                      } else {
                        return false;
                      }
                    }
                  }).length
              );
            }

            const dates2: any = [];
            const monthlyMessages = [];
            for (let i = 0; i < 12; i++) {
              monthlyMessages.push(
                channels
                  .map((c) => c.messages)
                  .flat()
                  .filter((m) => {
                    if (!m.timestamp) return false;
                    const date: any = new Date(m.timestamp).getMonth();
                    if (!dates2.includes(date)) dates2.push(date);

                    if (date && date !== "Invalid Date") {
                      return parseInt(date) == i;
                    } else {
                      const date_: any = parseInt(
                        moment(m.timestamp).format("M")
                      );
                      if (date_) {
                        return date_ == i + 1;
                      } else {
                        return false;
                      }
                    }
                  }).length
              );
            }

            const yearlyMessages: any = [];
            const years: any = [];
            channels
              .map((c) => c.messages)
              .flat()
              .forEach((m) => {
                if (!m.timestamp) return false;
                const date: any = new Date(m.timestamp).getFullYear();
                if (date && date !== "Invalid Date") {
                  if (!years.includes(date)) {
                    years.push(date);
                  }
                } else {
                  const date_: any = moment(m.timestamp).format("YYYY");
                  if (date_) {
                    if (!years.includes(date_)) {
                      years.push(date_);
                    }
                  }
                }
              });

            years.forEach((year: any) => {
              yearlyMessages.push(
                channels
                  .map((c) => c.messages)
                  .flat()
                  .filter((m) => {
                    if (!m.timestamp) return false;
                    const date: any = new Date(m.timestamp).getFullYear();
                    if (date && date !== "Invalid Date") {
                      return date === year;
                    } else {
                      const date_: any = moment(m.timestamp).format("YYYY");
                      if (date_) {
                        return date_ == year;
                      } else {
                        return false;
                      }
                    }
                  }).length
              );
            });

            data.messages.hoursValues = {
              hourly: hourlyMessages,
              daily: dailyMessages,
              monthly: monthlyMessages,
              yearly: yearlyMessages,
            };

            if (isDebug) {
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Calculated your top hours on Discord`)}`
              );
            }
          }

          setPercent(73);

          if (isDebug)
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Loading "other" data `)}`
            );

          const words = channels
            .map((channel) => channel.messages)
            .flat()
            .map((message: any) => message.words)
            .flat()
            .filter((w: any) => {
              const mentionRegex = /^<@!?(\d+)>$/;
              const mention_ = mentionRegex.test(w)
                ? w.match(mentionRegex)[1]
                : null;

              return !mention_;
            });

          if (options.other.favoriteWords) {
            if (isDebug) {
              setLoading("Loading Messages|||Calculating your favorite words");
              await delay(600);
            } else await delay(100);
            setPercent(74);

            data.messages.favoriteWords = Utils.getFavoriteWords(words);
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${data?.messages?.favoriteWords?.length} favorite words`
                  )}`
              );
          }

          if (options.other.showCurseWords) {
            if (isDebug) {
              setLoading("Loading Messages|||Calculating your curse words");
              await delay(700);
            } else await delay(100);
            setPercent(76);

            const curseWords = Utils.getCursedWords(
              words.filter((w: any) => w.length < 10 && !/[^\w\s]/g.test(w))
            );
            data.messages.topCursed = curseWords;
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${data?.messages?.topCursed?.length} curse words`
                  )}`
              );
          }

          if (options.other.showLinks) {
            setPercent(77);
            if (isDebug) {
              setLoading("Loading Messages|||Calculating your general links");
              await delay(600);
            } else await delay(100);

            const links = Utils.getTopLinks(words);
            data.messages.topLinks = links;
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${data?.messages?.topLinks?.length} general links`
                  )}`
              );
          }

          if (options.other.showDiscordLinks) {
            setPercent(79);
            if (isDebug) {
              setLoading("Loading Messages|||Calculating your Discord links");
              await delay(700);
            } else await delay(100);

            const discordLink = Utils.getDiscordLinks(words);
            data.messages.topDiscordLinks = discordLink;
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${data?.messages?.topDiscordLinks?.length} Discord links`
                  )}`
              );
          }

          if (options.guilds) {
            setPercent(82);
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loading your guilds and their respective data`
                  )}`
              );
            if (isDebug) {
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Scanning [servers/index.json]`)}`
              );
              setLoading("Loading Guilds|||");
              await delay(2000);
            } else await delay(100);

            const guilds = JSON.parse(
              await Utils.readFile("servers/index.json", files)
            );
            data.guilds = guilds;
            if (isDebug) {
              setLoading("Loading Guilds|||Loaded Guilds");
              await delay(700);
            } else await delay(100);

            setPercent(84);

            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(
                    `Loaded ${Object.keys(data?.guilds)?.length} guilds`
                  )}`
              );
          }

          if (options.bots) {
            setPercent(86);
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Loading your Discord bots`)}`
              );

            if (isDebug) await delay(2000);
            setLoading("Loading User Bots|||");

            if (isDebug) {
              setLoading("Loading User Bots|||Scanning Bots");
              await delay(600);
            } else {
              setLoading("Loading Your Bots");
              await delay(1000);
            }

            const bots = files.filter(
              (file: any) =>
                file.name.startsWith("account/applications/") &&
                file.name.endsWith(".json")
            );

            if (bots.length) {
              if (isDebug) {
                setLoading("Loading User Bots|||Bots Found");
                await delay(1000);
              } else await delay(100);

              if (isDebug) await delay(700);
              const botsArr: Array<any> = [];
              for (let i = 0; i < bots.length; i++) {
                const bot = JSON.parse(
                  await Utils.readFile(bots[i].name, files)
                );
                if (bot.bot) {
                  botsArr.push({
                    name: bot.bot.username + "#" + bot.bot.discriminator,
                    id: bot.bot.id,
                    avatar:
                      "https://cdn.discordapp.com/avatars/" +
                      bot.bot.id +
                      "/" +
                      bot.bot.avatar +
                      ".png",
                    verified: bot.bot.public_flags === 65536 ? true : false,
                  });
                }
              }
              if (isDebug) {
                setLoading("Loading User Bots|||Loaded Bots");
                await delay(700);
              } else await delay(100);

              data.bots = botsArr;
              if (isDebug)
                console.log(
                  chalk.bold.blue(`[DEBUG] `) +
                    chalk.bold.cyan(
                      `[${moment(Date.now()).format("h:mm:ss a")}]`
                    ) +
                    `  ${chalk.yellow(`Loaded ${botsArr.length} bots`)}`
                );
            } else {
              if (isDebug) {
                setLoading("Loading User Bots|||Bots not Found");
                await delay(700);
              }
            }
          }

          if (isDebug)
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Calculating your badges`)}`
            );

          if (!isDebug) setLoading("Loading Your Flags");
          await delay(1000);

          setPercent(88);
          if (userInformationData.flags && options.user.badges) {
            data.user.flags = userInformationData.flags;
            const badges = BitField.calculate(userInformationData.flags);
            if (data.user.premium_until) {
              badges.push("nitro_until");
            } else if (
              !data.user.premium_until &&
              userInformationData.premium_until
            ) {
              badges.push("nitro");
            }

            if (
              data?.bots?.filter((bot: any) => bot.verified)?.length > 0 &&
              !badges.includes("VERIFIED_BOT_DEVELOPER")
            ) {
              badges.push("VERIFIED_TRUE");
            }

            data.user.badges = badges;
          }

          setPercent(90);
          if (options.statistics.length) {
            setPercent(100);
            if (isDebug) await delay(1000);
            setLoading("Loading Analytics|||Initializing Files");
            if (isDebug)
              console.log(
                chalk.bold.blue(`[DEBUG] `) +
                  chalk.bold.cyan(
                    `[${moment(Date.now()).format("h:mm:ss a")}]`
                  ) +
                  `  ${chalk.yellow(`Calculating your analytics`)}`
              );
            if (isDebug) await delay(2000);
            const statistics: any = await Utils.readAnalyticsFile(
              files.find((file: any) =>
                /activity\/analytics\/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json/.test(
                  file.name
                )
              ),
              loading,
              setLoading,
              options.statistics
            );

            data.statistics = statistics?.all;
            if (data?.statistics?.appOpened) {
              data.statistics.averageOpenCount = Utils.getAVGCount(
                data.statistics.appOpened,
                userId
              );
            }

            if (data?.statistics?.sendMessage) {
              data.statistics.averageMessages = Utils.getAVGCount(
                data.statistics.sendMessage,
                userId
              );
            }
          }

          if (isDebug)
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(
                  `Loaded all data in ${Date.now() - startTime}ms `
                )}`
            );

          if (isDebug)
            console.log(
              chalk.bold.blue(`[DEBUG] `) +
                chalk.bold.cyan(`[${moment(Date.now()).format("h:mm:ss a")}]`) +
                `  ${chalk.yellow(`Preparing to render data`)}`
            );

          if (isDebug && Date.now() - startTime > 60000) {
            data.disabledDebugMode = true;
          }

          return data;
        }

        extractData(files, selectedFeatures)
          .then(async (data) => {
            setLoading(null);
            setError(null);
            data.fakeInfo = false;

            setLoading("Rendering Data|||✨ Spicing up things for you ✨");
            if (data.disabledDebugMode) {
              toast(
                <div
                  style={{
                    width: "450px",
                  }}
                >
                  <span className="font-bold text-lg text-black dark:text-white">
                    Slow device detected
                  </span>
                  <br />
                  <span className="text-black dark:text-white">
                    Heya user, your package took more than 1 minute to load.
                    Therefore you might be experiencing a slow loading of the
                    file using debug mode. Therefore, I have disabled debug mode
                    for you to speed up the loading of your package! To
                    re-enable it, go on the home page, select settings and then
                    check the enable debug mode checkbox.
                  </span>
                </div>
              );

              localStorage.setItem("debug", "false");
              await delay(2000);
            } else {
              toast(
                <div
                  style={{
                    width: "300px",
                  }}
                >
                  <span className="font-bold text-lg text-black dark:text-white">
                    ✨ Data extracted Successfully ✨
                  </span>
                  <br />
                  <span className="text-black dark:text-white">
                    Your data is currently being rendered, you may experience a
                    some lag. If you encounter issues please join our Discord
                    server and let us know.
                  </span>
                </div>
              );
              await delay(1000);
            }

            setDataExtracted(data);
          })
          .catch((err) => {
            if (isDebug) console.log(err);
            if (err.message === "invalid_package_missing_messages") {
              setLoading(null);
              setError(
                "Some important data is missing in your package, try disabling the message category for now or try again later!"
              );
            } else {
              setLoading(null);
              setError(
                "Your package seems corrupted, Click or drop your package file here to retry. If you think this is a mistake please reach out to me"
              );
            }
          });
      }

      startUpload();
    } else {
      if (fileUploaded.type === "application/json") {
        setPercent(100);
        setLoading("Loading JSON|||✨ Rendering Data ✨");

        var readFile_ = new FileReader();
        readFile_.onload = function (e: any) {
          var content = e.target.result;
          var data = JSON.parse(content);

          if (data) {
            if (data.dataFile) {
              setLoading(null);
              setError(null);
              setDataExtracted(data);
            } else {
              setLoading(null);
              setError("The JSON file you have uploaded is not valid");
            }
          } else {
            setLoading(null);
            setError("The JSON file you have uploaded is corrupted");
          }
        };
        readFile_.readAsText(fileUploaded);
      } else setError("Only ZIP and JSON files are supported");
    }
  };

  const DynamicComponent = dynamic(() => import("./Data"), {
    suspense: true,
  });

  return dataExtracted ? (
    <Suspense
      fallback={
        <SnackbarProvider>
          <Loading skeleton={true} />
        </SnackbarProvider>
      }
    >
      <SnackbarProvider>
        <DynamicComponent data={dataExtracted} demo={false} />
      </SnackbarProvider>
    </Suspense>
  ) : (
    <>
      <Alerts />
      <Privacy />
      <Header />{" "}
      <ToastContainer
        position="top-right"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      <Transition
        show={showLargeModal}
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
            setSelectedFeatures(oldSelected ? oldSelected : defaultOptions);
            setShowLargeModal(false);
          }}
          className="fixed z-[999999] inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Overlay className="fixed inset-0  bg-black/30" />
            <div className="relative p-4 w-full max-w-7xl md:h-auto h-full">
              <div className="relative shadow-lg bg-[#36393f] ">
                <div className="flex justify-between items-center p-5 rounded-t bg-[#2b2d31]">
                  <h3
                    className="text-xl font-medium text-white uppercase"
                    style={{
                      fontFamily:
                        "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
                    }}
                  >
                    Customize Options
                    {oldSelected || saveToDevice ? (
                      <span
                        onClick={() => {
                          setOldSelected(null);
                          setShowLargeModal(false);
                          setSelectedFeatures(defaultOptions);
                          localStorage.removeItem("defaultOptions");

                          toast.success("Successfully set options to default", {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          });
                        }}
                        className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-sans ml-2 font-bold"
                      >
                        Reset to default
                      </span>
                    ) : (
                      ""
                    )}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedFeatures(
                        oldSelected ? oldSelected : defaultOptions
                      );
                      setShowLargeModal(false);
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

                <div className="overflow-y-auto h-[560px]">
                  <div className="space-y-6 md:p-5 sm:p-3 lg:p-6 p-1">
                    {[
                      [
                        "user",
                        "settings",
                        "connections",
                        "payments",
                        "messages",
                        "guilds",
                        "bots",
                        "other",
                      ].map((item, i) => {
                        return (
                          <div key={i}>
                            <details className="cursor-pointer">
                              <summary className="font-bold uppercase text-gray-200">
                                {item}

                                <svg
                                  className="control-icon control-icon-expand"
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24"
                                  width="24"
                                >
                                  <path d="m12 15.375-6-6 1.4-1.4 4.6 4.6 4.6-4.6 1.4 1.4Z" />
                                </svg>

                                <svg
                                  className="control-icon control-icon-close"
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24"
                                  width="24"
                                >
                                  <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
                                </svg>
                              </summary>

                              {typeof (Utils.classifyOBJ(Features) as any)[
                                item
                              ] === "string" ? (
                                <>
                                  {" "}
                                  <div
                                    className="flex items-center cursor-pointer"
                                    key={i}
                                  >
                                    <input
                                      defaultChecked={selectedFeatures[item]}
                                      onChange={(e) => {
                                        setSelectedFeatures({
                                          ...selectedFeatures,
                                          [item]: e.target.checked
                                            ? true
                                            : null,
                                        });
                                      }}
                                      id={(Utils.classifyOBJ(Features) as any)[
                                        item
                                      ]
                                        .split(" ")
                                        .join("")
                                        .toLowerCase()}
                                      type="checkbox"
                                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded  border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                      onClick={(e: any) => {
                                        e.preventDefault();
                                        e.target.previousElementSibling.click();
                                      }}
                                      htmlFor={(
                                        Utils.classifyOBJ(Features) as any
                                      )[item]
                                        .split(" ")
                                        .join("")
                                        .toLowerCase()}
                                      className="ml-4 text-sm font-medium text-gray-200"
                                    >
                                      {
                                        (Utils.classifyOBJ(Features) as any)[
                                          item
                                        ]
                                      }
                                    </label>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {Object.values(
                                    (Utils.classifyOBJ(Features) as any)[item]
                                  ).map((item_: any, i: number): any => {
                                    return (
                                      <div
                                        className="flex items-center cursor-pointer pb-1"
                                        key={i}
                                      >
                                        <input
                                          checked={
                                            Object.values(
                                              selectedFeatures[item]
                                            )[i]
                                              ? true
                                              : false
                                          }
                                          onChange={(e) => {
                                            const key = Object.keys(
                                              (
                                                Utils.classifyOBJ(
                                                  Features
                                                ) as any
                                              )[item]
                                            ).find(
                                              (key) =>
                                                (
                                                  Utils.classifyOBJ(
                                                    Features
                                                  ) as any
                                                )[item][key] === item_
                                            );

                                            setSelectedFeatures({
                                              ...selectedFeatures,
                                              [item]: {
                                                ...selectedFeatures[item],
                                                [key as string]: e.target
                                                  .checked
                                                  ? true
                                                  : null,
                                              },
                                            });
                                          }}
                                          id={item_
                                            .split(" ")
                                            .join("")
                                            .toLowerCase()}
                                          type="checkbox"
                                          className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                          htmlFor={item_
                                            .split(" ")
                                            .join("")
                                            .toLowerCase()}
                                          className="ml-4 text-sm font-medium text-gray-200"
                                        >
                                          {item_}
                                        </label>
                                      </div>
                                    );
                                  })}
                                </>
                              )}
                            </details>
                          </div>
                        );
                      }),
                    ]}
                    <div>
                      <details className="cursor-pointer">
                        <summary className="font-bold uppercase text-gray-200">
                          Statistics{" "}
                          <svg
                            className="control-icon control-icon-expand"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                          >
                            <path d="m12 15.375-6-6 1.4-1.4 4.6 4.6 4.6-4.6 1.4 1.4Z" />
                          </svg>
                          <svg
                            className="control-icon control-icon-close"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                          >
                            <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
                          </svg>
                        </summary>
                        {selectedFeatures?.statistics?.length ===
                        Object.keys(EventsJSON.events).length ? (
                          <span
                            onClick={() => {
                              setSelectedFeatures({
                                ...selectedFeatures,
                                statistics: [],
                              });
                            }}
                            className="-mt-2 absolute text-sm text-gray-400 hover:text-gray-200 font-bold cursor-pointer"
                          >
                            unselect all
                          </span>
                        ) : (
                          <span
                            onClick={() => {
                              setSelectedFeatures({
                                ...selectedFeatures,
                                statistics: Object.keys(EventsJSON.events),
                              });
                            }}
                            className="-mt-2 absolute text-sm text-gray-400 hover:text-gray-200 font-bold cursor-pointer"
                          >
                            select all
                          </span>
                        )}
                        {selectedFeatures?.statistics !==
                        EventsJSON.defaultEvents ? (
                          <span
                            onClick={() => {
                              setSelectedFeatures({
                                ...selectedFeatures,
                                statistics: EventsJSON.defaultEvents,
                              });
                            }}
                            className="-mt-2 ml-20 absolute text-sm text-gray-400 hover:text-gray-200 font-bold cursor-pointer"
                          >
                            important events
                          </span>
                        ) : (
                          ""
                        )}
                        <div className="mb-5"></div>
                        {Object.values(EventsJSON.events).map((item, i) => {
                          return (
                            <div
                              className="flex items-center cursor-pointer pb-1"
                              key={i}
                            >
                              <input
                                checked={Utils.isCheckedStats(
                                  selectedFeatures,
                                  item
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFeatures({
                                      ...selectedFeatures,
                                      statistics: [
                                        ...selectedFeatures.statistics,
                                        Utils.findSelectedStats(item),
                                      ],
                                    });
                                  } else {
                                    setSelectedFeatures({
                                      ...selectedFeatures,
                                      statistics: Utils.filterStatistics(
                                        item,
                                        selectedFeatures
                                      ),
                                    });
                                  }
                                }}
                                id={item.split(" ").join("").toLowerCase()}
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                onClick={(e: any) => {
                                  e.preventDefault();
                                  e.target.previousElementSibling.click();
                                }}
                                htmlFor={item.split(" ").join("").toLowerCase()}
                                className="ml-4 text-sm font-medium text-gray-200"
                              >
                                {item}
                              </label>
                            </div>
                          );
                        })}
                      </details>{" "}
                    </div>
                  </div>{" "}
                </div>

                <div className="lg:p-6 md:p-6 sm:p-6 p-3 rounded-b bg-[#2b2d31]">
                  <div className="flex items-center cursor-pointer mb-4">
                    <input
                      onChange={() => {
                        if (saveToDevice) {
                          setSaveToDevice(false);
                          localStorage.setItem(
                            "defaultOptions_enabled",
                            "false"
                          );
                        } else {
                          setSaveToDevice(true);
                          localStorage.setItem(
                            "defaultOptions_enabled",
                            "true"
                          );
                        }
                      }}
                      checked={saveToDevice}
                      id={"defaultOptions_enabled"}
                      type="checkbox"
                      className="w-[21px] h-[21px] text-blue-600 bg-gray-100 rounded  border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      onClick={(e: any) => {
                        e.preventDefault();
                        e.target.previousElementSibling.click();
                      }}
                      htmlFor={"defaultOptions_enabled"}
                      className="pl-2 text-white font-mono"
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      Save options to device
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        if (
                          JSON.stringify(selectedFeatures) ===
                          JSON.stringify(defaultOptions)
                        ) {
                          return setShowLargeModal(false);
                        }
                        setOldSelected(selectedFeatures);
                        setShowLargeModal(false);
                        const savetodevice =
                          localStorage.getItem("defaultOptions_enabled") ===
                          "true";
                        if (savetodevice) {
                          localStorage.setItem(
                            "defaultOptions",
                            JSON.stringify(selectedFeatures)
                          );
                        }
                        toast.success(
                          "Successfully saved options" +
                            (savetodevice ? " to device" : ""),
                          {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          }
                        );
                      }}
                      type="button"
                      className="button-green text-gray-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFeatures(
                          oldSelected ? oldSelected : defaultOptions
                        );
                        setShowLargeModal(false);
                      }}
                      type="button"
                      className="button-cancel text-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div
        className="flex items-center lg:justify-center  h-2/5 mt-8"
        id="file"
      >
        <div className="flex justify-center items-center w-full lg:w-1/2 px-6 lg:px-0">
          {dragging && !error && !loading ? (
            <label
              id="dropzone-label"
              htmlFor="dropzone-file"
              className="flex flex-col justify-center items-center w-full lg:h-64 md:h-64 h-52 lg:landscape:h-64 md:landscape:h-64 landscape:h-44 lg:landscape:mt-0 md:landscape:mt-0 landscape:mt-4 rounded-lg border-4 border-dashed cursor-pointer border-gray-400 opacity-75 shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col justify-center items-center pt-5 pb-6">
                <svg
                  className="mb-3 w-10 h-10 text-gray-400 rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Release the mouse to drop the package file
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".zip, .json"
                onChange={(e) => {
                  onUpload(e.target.files);
                }}
              />
            </label>
          ) : (
            <>
              {" "}
              {!dragging && !error && !loading ? (
                <label
                  id="dropzone-label"
                  htmlFor="dropzone-file"
                  className="animate__animated animate__headShake flex flex-col justify-center items-center w-full lg:h-64 md:h-64 h-52 lg:landscape:h-64 md:landscape:h-64 landscape:h-44 lg:landscape:mt-0 md:landscape:mt-0 landscape:mt-4 rounded-lg border-4 border-dashed cursor-pointer dark:border-gray-200 dark:hover:border-gray-400 dark:hover:opacity-75 dark:hover:shadow-lg dark:hover:transition-all duration-200"
                >
                  <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    <svg
                      className="mb-3 w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Upload your Discord package or extracted JSON here
                    </p>

                    <button
                      onClick={() => {
                        setShowLargeModal(true);
                      }}
                      className="mt-4 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-xs font-medium px-3 py-2 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      More Options
                    </button>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".zip, .json"
                    onChange={(e) => {
                      onUpload(e.target.files);
                    }}
                  />
                </label>
              ) : (
                <>
                  {error && !loading ? (
                    <label
                      id="dropzone-label"
                      htmlFor="dropzone-file"
                      className="flex flex-col justify-center items-center w-full lg:h-64 md:h-64 h-52 lg:landscape:h-64 md:landscape:h-64 landscape:h-44 lg:landscape:mt-0 md:landscape:mt-0 landscape:mt-4 rounded-lg border-4 border-dashed cursor-pointer dark:border-gray-200 dark:hover:border-gray-400 dark:hover:opacity-75 dark:hover:shadow-lg dark:hover:transition-all duration-200"
                    >
                      <div className="flex flex-col justify-center items-center pt-5 pb-6">
                        <svg
                          className="mb-3 fill-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          height="48"
                          width="48"
                        >
                          <path d="M24.1 26.5q-.65 0-1.075-.425Q22.6 25.65 22.6 25v-9.45q0-.65.425-1.075.425-.425 1.075-.425.65 0 1.075.425.425.425.425 1.075V25q0 .65-.425 1.075-.425.425-1.075.425Zm-.1 7.4q-.6 0-1.05-.45-.45-.45-.45-1.05 0-.6.45-1.05.45-.45 1.05-.45.6 0 1.05.45.45.45.45 1.05 0 .6-.45 1.05-.45.45-1.05.45Zm8.2 4.9q-.75.4-1.35-.025-.6-.425-.6-1.325 0-.4.275-.825.275-.425.675-.625 3.4-1.65 5.4-4.95 2-3.3 2-7.2 0-2.7-.9-5.025t-2.95-4.175l-1.5-1.35v4.35q0 .65-.425 1.075-.425.425-1.075.425-.65 0-1.075-.425-.425-.425-.425-1.075V9.5q0-.65.425-1.075Q31.1 8 31.75 8h8.15q.65 0 1.075.425.425.425.425 1.075 0 .65-.425 1.075Q40.55 11 39.9 11h-4.7l.75.7q3.3 2.65 4.475 5.9 1.175 3.25 1.175 6.25 0 4.85-2.575 8.875T32.2 38.8ZM8.1 40q-.65 0-1.075-.425Q6.6 39.15 6.6 38.5q0-.65.425-1.075Q7.45 37 8.1 37h4.65l-.7-.7q-3.3-2.6-4.475-5.875Q6.4 27.15 6.4 24.2q0-4.9 2.575-8.9t6.875-6.05q.75-.35 1.325.025t.575 1.275q0 .4-.275.825-.275.425-.675.625-3.4 1.7-5.4 5-2 3.3-2 7.2 0 2.6.875 4.925.875 2.325 2.975 4.225l1.5 1.35v-4.35q0-.65.425-1.075.425-.425 1.075-.425.65 0 1.075.425.425.425.425 1.075v8.15q0 .65-.425 1.075Q16.9 40 16.25 40Z" />
                        </svg>
                        <p className="max-w-md mb-2 text-sm text-gray-500 dark:text-gray-400 p-2">
                          {error}
                        </p>
                        <a
                          href="https://discord.gg/W2zPcgG9F5 "
                          target="_blank"
                          rel="noreferrer"
                          className="lg:text-xl md:text-xl hover:transition-all duration-200 text-blue-400 hover:text-blue-600 font-bold mx-1"
                        >
                          Join the Discord Server for Help
                        </a>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept=".zip, .json"
                        onChange={(e) => onUpload(e.target.files)}
                      />
                    </label>
                  ) : (
                    <>
                      {loading ? (
                        <>
                          <label
                            onClick={(e) => {
                              function hasClass(
                                el: Element,
                                cl: string
                              ): boolean {
                                return el.classList
                                  ? el.classList.contains(cl)
                                  : !!el.className &&
                                      !!el.className.match(
                                        new RegExp("(?: |^)" + cl + "(?: |$)")
                                      );
                              }
                              e.preventDefault();
                              const element =
                                document.getElementById("dropzone-label");
                              if (element) {
                                const check = hasClass(
                                  element,
                                  "animate__animated"
                                );

                                if (check) {
                                  element.classList.remove(
                                    "animate__animated",
                                    "animate__flash",
                                    "animate__headShake"
                                  );

                                  setTimeout(() => {
                                    element.classList.add(
                                      "animate__animated",
                                      "animate__flash",
                                      "animate__headShake"
                                    );
                                  }, 100);
                                } else {
                                  element.classList.add(
                                    "animate__animated",
                                    "animate__flash",
                                    "animate__headShake"
                                  );
                                }
                                if (!cancel) setCancel(true);
                              }
                            }}
                            id="dropzone-label"
                            htmlFor="dropzone-file"
                            className="flex flex-col justify-center items-center w-full lg:h-64 md:h-64 h-52 lg:landscape:h-64 md:landscape:h-64 landscape:h-44 lg:landscape:mt-0 md:landscape:mt-0 landscape:mt-4 rounded-lg border-4 border-dashed cursor-pointer dark:border-gray-200 dark:hover:border-gray-400 dark:hover:opacity-75 dark:hover:shadow-lg dark:hover:transition-all duration-200"
                          >
                            <div className="flex flex-col justify-center items-center pt-5 pb-6">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="48"
                                width="48"
                                className="mb-3 fill-gray-400 animate-spin"
                              >
                                <path d="M24.1 40.55q-6.6 0-11.4-4.625Q7.9 31.3 7.6 24.75v-2.2l-3.7 3.7-2.4-2.45 7.95-7.95 7.95 7.95-2.4 2.45-3.7-3.75v2.2q.2 5 3.9 8.6 3.7 3.6 8.9 3.6 1.5 0 2.85-.275t2.45-.775l2.6 2.6q-1.95 1.1-3.9 1.6t-4 .5Zm14.55-8.45-7.95-7.95 2.4-2.45 3.7 3.65v-2q-.25-4.95-3.95-8.55-3.7-3.6-8.85-3.6-1.55 0-2.9.3-1.35.3-2.4.7l-2.6-2.6q1.9-1.1 3.85-1.575Q21.9 7.55 24 7.55q6.55 0 11.35 4.625t5.1 11.175v2.1l3.7-3.7 2.45 2.4Z" />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                {typeof loading === "string"
                                  ? loading.split("|||")[0]
                                  : ""}
                              </p>{" "}
                              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                                {typeof loading === "string"
                                  ? loading.split("|||")[1]
                                  : ""}
                              </p>
                            </div>
                            <div className="w-[200px] m-1">
                              <Line
                                percent={percent}
                                strokeWidth={4}
                                strokeColor="#D3D3D3"
                              />
                            </div>
                          </label>

                          <div className="py-6 flex flex-col justify-center sm:py-12 fixed z-50">
                            <section>
                              <Transition
                                show={cancel}
                                appear={true}
                                enter="transition-opacity delay-500 duration-1000"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <div className="animate-fadeIn max-w-screen-lg mx-auto fixed bg-[#2b2d31] inset-x-5 p-5 bottom-10 rounded-lg drop-shadow-2xl flex gap-4 flex-wrap md:flex-nowrap text-center md:text-left items-center justify-center md:justify-between">
                                  <div
                                    className="w-full flex align-center text-gray-200"
                                    style={{
                                      fontFamily: "Product Sans",
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      fill="#fff"
                                      className="mr-2"
                                    >
                                      <path d="M12 12.5ZM1 21 12 2l11 19Zm10-6h2v-5h-2Zm1 3q.425 0 .713-.288Q13 17.425 13 17t-.287-.712Q12.425 16 12 16t-.712.288Q11 16.575 11 17t.288.712Q11.575 18 12 18Zm-7.55 1h15.1L12 6Z" />
                                    </svg>
                                    Are you sure you want to cancel your package
                                    upload?
                                  </div>
                                  <div className="flex gap-4 items-center flex-shrink-0">
                                    <button
                                      onClick={() => {
                                        window.location.reload();
                                      }}
                                      className="button-green text-gray-200"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => {
                                        setCancel(false);
                                      }}
                                      className="button-cancel text-gray-200"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </Transition>
                            </section>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="lg:landscape:flex md:landscape:flex landscape:hidden flex flex-col animate__delay-1s animate__animated animate__fadeIn">
        <span className="flex justify-center text-slate-900 dark:text-gray-200 pointer-events-none select-none">
          -- or --
        </span>
        <div className=" lg:text-xl md:text-xl text-sm mt-1  flex justify-center items-center text-slate-900 dark:text-gray-200 font-bold">
          <Link href="/demo">
            <a
              className="button-green text-gray-200  my-2 flex items-center"
              onClick={() => {
                enqueueSnackbar("Loading demo, please wait...", {
                  persist: true,
                  preventDuplicate: true,
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                  },
                });
              }}
            >
              View a Demo
            </a>
          </Link>
        </div>
      </div>
      <div
        id="made_by"
        className="group lg:landscape:flex md:landscape:flex landscape:hidden animate__animated animate__fadeIn animate__delay-1s flex justify-center items-center absolute bottom-8 right-0 left-0"
      >
        <div className="px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] text-slate-800 dark:text-white font-bold flex items-center rounded-md">
          <a href="/discord" target="_blank" rel="noreferrer" className="mr-1">
            <Tippy
              zIndex={999999999999999}
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
          <Tippy
            zIndex={999999999999999}
            content={"View the privacy policy"}
            animation="scale"
            className="shadow-xl"
          >
            <a
              href="/privacy"
              target="_blank"
              rel="noreferrer"
              className="hover:transition-all duration-200 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 font-bold px-1 uppercase"
            >
              privacy
            </a>
          </Tippy>
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
          <Tippy
            zIndex={999999999999999}
            content={"Next.js"}
            animation="scale"
            className="shadow-xl"
          >
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
            zIndex={999999999999999}
            content={"Tailwind CSS"}
            animation="scale"
            className="shadow-xl"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 rounded-lg">
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
          <Tippy
            zIndex={999999999999999}
            content={"Close"}
            animation="scale"
            className="shadow-xl"
          >
            <div className="ml-3 justify-center items-center">
              <div
                className="hover:bg-[#232323] p-1 hover:opacity-100 opacity-60 rounded-lg group-hover:block hidden"
                onClick={() => {
                  const madeBy = document.getElementById("made_by");
                  if (madeBy) {
                    madeBy.remove();
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  width="24"
                  className="fill-white cursor-pointer"
                >
                  <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
                </svg>
              </div>
            </div>
          </Tippy>
        </div>
      </div>
    </>
  );
}
