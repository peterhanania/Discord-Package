import React from "react";
import Tippy from "@tippyjs/react";
import Utils from "../components/utils";
import { Unzip, AsyncUnzipInflate } from "fflate";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment, useContext } from "react";
import Features from "./json/features.json";
import EventsJSON from "./json/events.json";
import { ToastContainer, toast } from "react-toastify";
import { DataContext } from "./utils/context";
import Header from "./Header";
import Data from "./Data";
import BitField from "./utils/Bitfield";
import Privacy from "./privacy";

export default function Upload() {
  const { dataExtracted, setDataExtracted } = useContext(DataContext);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState("Loading...|||");

  const classifyOBJ = (obj) => {
    let newObj = {};
    for (let key in obj) {
      if (key.includes(".")) {
        let newKey = key.split(".")[0];
        if (!newObj[newKey]) newObj[newKey] = {};
        newObj[newKey][key.split(".")[1]] = obj[key];
      } else {
        newObj[key] = obj[key];
      }
    }

    return newObj;
  };

  const defaultOptions = classifyOBJ({
    bots: true,
    "user.premium_until": true,
    "user.badges": true,
    "settings.appearance": true,
    "settings.folderCount": true,
    "settings.recentEmojis": true,
    connections: true,
    "payments.total": true,
    "payments.transactions": true,
    "payments.giftedNitro": true,
    "messages.channelCount": true,
    "messages.dmChannelCount": true,
    "messages.topChannels": true,
    "messages.topDMs": true,
    "messages.characterCount": true,
    "messages.hoursValues": true,
    "messages.oldestMessages": true,
    guilds: true,
    "other.showCurseWords": true,
    "other.showDiscordLinks": true,
    "other.showLinks": true,
    "other.favoriteWords": true,
    statistics: EventsJSON.defaultEvents,
  });

  const [oldSelected, setOldSelected] = React.useState(null);
  const [selectedFeatures, setSelectedFeatures] =
    React.useState(defaultOptions);

  const [demo, setDemo] = React.useState(false);

  React.useEffect(() => {
    if (window.location.href.includes("demo=true") && dataExtracted) {
      setDemo(true);
    } else setLoading(false);
  }, [dataExtracted]);

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

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleDragEnter = (e) => {
    setError(null);
    e.preventDefault();
    e.stopPropagation();

    setDragging(true);
  };

  const handleDragLeave = (e) => {
    setError(null);
    e.preventDefault();
    e.stopPropagation();

    setDragging(false);
  };
  const handleDragOver = (e) => {
    setError(null);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    setError(null);
    e.preventDefault();
    e.stopPropagation();

    const files = [e.dataTransfer.files];

    if (files && files.length) {
      onUpload(files);
    }
  };

  const [cancel, setCancel] = React.useState(false);
  const [showLargeModal, setShowLargeModal] = React.useState(false);

  const onUpload = (files) => {
    if (loading) {
      function hasClass(el, cl) {
        return el.classList
          ? el.classList.contains(cl)
          : !!el.className &&
              !!el.className.match(new RegExp("(?: |^)" + cl + "(?: |$)"));
      }

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
      async function startUpload() {
        setLoading("Loading Package|||");

        const reader = new Unzip();

        setLoading("Loading Package|||Registering Package");
        reader.register(AsyncUnzipInflate);

        const files = [];

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

        await delay(50);
        setLoading("Loading Package|||Initializing file reader");
        const fileReader = fileUploaded.stream().getReader();
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
        await delay(50);
        setLoading("Loading Package|||Checking for Valid Package");
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
          setError("This package is not a valid package. Please try again. ");
          return;
        }

        async function extractData(files, options) {
          let data = {
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
              folderCount: null,
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
              channelCount: null,
              dmChannelCount: null,
              topChannels: null,
              topDMs: null,
              characterCount: null,
              messageCount: null,
              hoursValues: [],
              oldestMessages: null,
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

          setLoading("Loading User Information|||");
          await delay(1000);

          const userInformationData = JSON.parse(
            await Utils.readFile("account/user.json", files)
          );

          setLoading("Loading User Information|||Loading Main Information");

          if (userInformationData.id) {
            data.user.id = userInformationData.id;
          } else throw new Error("User ID not found");

          const userId = data.user.id;

          if (userInformationData.username)
            data.user.username = userInformationData.username;
          if (userInformationData.discriminator)
            data.user.discriminator = userInformationData.discriminator;
          if (userInformationData.avatar_hash)
            data.user.avatar = userInformationData.avatar_hash;

          if (options.user.premium_until) {
            if (userInformationData.premium_until)
              data.user.premium_until = userInformationData.premium_until;
          }

          await delay(400);
          setLoading("Loading User Information|||Loading Setting Information");
          if (
            userInformationData.settings &&
            userInformationData.settings.settings
          ) {
            if (options.settings.appearance) {
              if (userInformationData.settings.settings.appearance)
                data.settings.appearance =
                  userInformationData.settings.settings.appearance;
            }

            if (options.settings.folderCount) {
              if (
                userInformationData.settings.settings.guildFolders &&
                userInformationData.settings.settings.guildFolders.folders
              )
                data.settings.folderCount =
                  userInformationData.settings.settings.guildFolders.folders.filter(
                    (s) => {
                      return (
                        s.guildIds &&
                        s.guildIds.length > 0 &&
                        s.guildIds.length !== 1 &&
                        s.guildIds.length <= 4
                      );
                    }
                  ).length;
            }
          }

          await delay(700);
          setLoading("Loading User Information|||Loading Setting Frecency");
          if (
            userInformationData.settings &&
            userInformationData.settings.frecency
          ) {
            if (options.settings.recentEmojis) {
              if (
                userInformationData.settings.frecency.emojiFrecency &&
                userInformationData.settings.frecency.emojiFrecency.emojis
              ) {
                const emojis = [];
                Object.keys(
                  userInformationData.settings.frecency.emojiFrecency.emojis
                ).forEach((key) => {
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
              }
            }
          }

          await delay(600);
          if (options.connections) {
            setLoading("Loading User Information|||Loading User Connections");
            if (
              userInformationData.connections &&
              userInformationData.connections.length
            ) {
              if (
                Object.values(userInformationData.connections).filter(
                  (s) => s.type !== "contacts"
                ).length
              ) {
                data.connections = Object.values(
                  userInformationData.connections
                )
                  .filter((s) => s.type !== "contacts")
                  .map((e) => {
                    return {
                      type: e.type,
                      name: e.name,
                    };
                  });
              }
            }
          }

          await delay(700);
          setLoading("Loading User Information|||Loading User Payments");
          if (
            userInformationData.entitlements &&
            options.payments.giftedNitro
          ) {
            const gifted = Object.values(userInformationData.entitlements);
            if (gifted.length) {
              const types = {};
              gifted.forEach((e) => {
                if (e.subscription_plan && e.subscription_plan.name) {
                  if (e.subscription_plan.name in types) {
                    types[e.subscription_plan.name] += 1;
                  } else {
                    types[e.subscription_plan.name] = 1;
                  }
                }
              });

              data.payments.giftedNitro = types;
            }
          }

          const confirmedPayments = userInformationData?.payments.filter(
            (p) => p.status === 1
          );
          if (confirmedPayments.length) {
            if (options.payments.total) {
              data.payments.total += confirmedPayments
                .map((p) => p.amount / 100)
                .reduce((p, c) => p + c);
            }

            if (options.payments.transactions) {
              data.payments.transactions = confirmedPayments
                .sort(
                  (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
                )
                .map((p) => {
                  return {
                    information: p.description,
                    amount: p.amount / 100,
                    currency: p.currency,
                    date: p.created_at,
                  };
                });
            }
          }

          await delay(2000);
          setLoading("Loading User Information|||Loaded User Information");
          await delay(1000);
          setLoading("Loading Messages");

          const userMessages = JSON.parse(
            await Utils.readFile("messages/index.json", files)
          );
          const messagesREGEX = /messages\/c?([0-9]{16,32})\/$/;
          const channelsIDFILE = files.filter((file) =>
            messagesREGEX.test(file.name)
          );

          const isOldPackage =
            channelsIDFILE[0].name.match(
              /messages\/(c)?([0-9]{16,32})\/$/
            )[1] === undefined;

          const channelsIDs = channelsIDFILE.map(
            (file) => file.name.match(messagesREGEX)[1]
          );

          const channels = [];
          let messagesRead = 0;

          await delay(600);
          setLoading("Loading Messages|||Scanning Messages");
          await Promise.all(
            channelsIDs.map((channelID) => {
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
                    return resolve();
                  } else messagesRead++;

                  const data_ = JSON.parse(rawData);
                  const messages = Utils.parseCSV(rawMessages);
                  const name = userMessages[data_.id];
                  const isDM =
                    data_.recipients && data_.recipients.length === 2;
                  const dmUserID = isDM
                    ? data_.recipients.find((userID) => userID !== userId)
                    : undefined;
                  channels.push({
                    data_,
                    messages,
                    name,
                    isDM,
                    dmUserID,
                  });

                  resolve();
                });
              });
            })
          );

          await delay(600);
          setLoading("Loading Messages|||Finished Message Scan");

          if (messagesRead === 0)
            throw new Error("invalid_package_missing_messages");

          await delay(700);

          if (options.messages.channelCount) {
            setLoading("Loading Messages|||Calculating Channel Count");
            data.messages.channelCount = channels.filter((c) => !c.isDM).length;
          }

          if (options.messages.dmChannelCount) {
            data.messages.dmChannelCount =
              channels.length - data.messages.channelCount;
          }

          if (options.messages.topChannels) {
            data.messages.topChannels = channels
              .filter((c) => c.data_ && c.data_.guild)
              .sort((a, b) => b.messages.length - a.messages.length)

              .map((channel) => {
                const words = channel.messages
                  .map((message) => message.words)
                  .flat()
                  .filter((w) => {
                    const mentionRegex = /^<@!?(\d+)>$/;
                    const mention_ = mentionRegex.test(w)
                      ? w.match(mentionRegex)[1]
                      : null;

                    return w.length > 5 && !mention_;
                  });

                const favoriteWords = Utils.getFavoriteWords(words);
                const curseWords = Utils.getCursedWords(words);
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
                };
              });
          }

          if (options.messages.topDMs) {
            await delay(600);
            setLoading("Loading Messages|||Calculating top DMs");

            data.messages.topDMs = channels
              .filter(
                (channel) =>
                  channel?.isDM &&
                  channel?.name?.includes("Direct Message with")
              )
              .sort((a, b) => b.messages.length - a.messages.length)

              .map((channel) => {
                const words = channel.messages
                  .map((message) => message.words)
                  .flat()
                  .filter((w) => {
                    const mentionRegex = /^<@!?(\d+)>$/;
                    const mention_ = mentionRegex.test(w)
                      ? w.match(mentionRegex)[1]
                      : null;

                    return w.length > 5 && !mention_;
                  });

                const favoriteWords = Utils.getFavoriteWords(words);

                const curseWords = Utils.getCursedWords(words);
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
                };
              });
          }

          if (options.messages.characterCount) {
            await delay(700);
            setLoading("Loading Messages|||Getting your character Count");

            data.messages.characterCount = channels
              .map((channel) => channel.messages)
              .flat()
              .map((message) => message.length)
              .reduce((p, c) => p + c);

            data.messages.messageCount = channels
              .map((channel) => channel.messages)
              .flat().length;
          }

          if (options.messages.oldestMessages) {
            await delay(700);
            setLoading("Loading Messages|||Getting your oldest message");

            const oldestInChannel = channels
              .filter((c) => c.data_ && c.data_.guild)
              .map((channel) => {
                const words = channel.messages
                  .map((message) => {
                    return {
                      sentence: message.words.join(" "),
                      timestamp: message.timestamp,
                      author: `channel: ${channel.name} (guild: ${channel.data_.guild.name})`,
                    };
                  })
                  .flat();

                return words;
              });

            const oldestInChannelFlat = oldestInChannel.flat();
            const oldestInChannelFlatSorted = oldestInChannelFlat.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );

            const oldestInDMs = channels
              .filter(
                (channel) =>
                  channel?.isDM &&
                  channel?.name?.includes("Direct Message with")
              )

              .map((channel) => {
                const words = channel.messages
                  .map((message) => {
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
              });

            const oldestInDMsFlat = oldestInDMs.flat();
            const oldestInDMsFlatSorted = oldestInDMsFlat.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );

            const oldestInChannelAndDMs = oldestInChannelFlatSorted
              .concat(oldestInDMsFlatSorted)
              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            data.messages.oldestMessages = oldestInChannelAndDMs.slice(0, 1000);
          }

          if (options.messages.hoursValues) {
            for (let i = 0; i < 24; i++) {
              data.messages.hoursValues.push(
                channels
                  .map((c) => c.messages)
                  .flat()
                  .filter((m) => new Date(m.timestamp).getHours() === i).length
              );
            }
          }

          const words = channels
            .map((channel) => channel.messages)
            .flat()
            .map((message) => message.words)
            .flat()
            .filter((w) => {
              const mentionRegex = /^<@!?(\d+)>$/;
              const mention_ = mentionRegex.test(w)
                ? w.match(mentionRegex)[1]
                : null;

              return w.length > 5 && !mention_;
            });

          if (options.other.favoriteWords) {
            await delay(600);
            setLoading("Loading Messages|||Calculating your favorite words");
            data.messages.favoriteWords = Utils.getFavoriteWords(words);
          }

          if (options.other.showCurseWords) {
            await delay(700);
            setLoading("Loading Messages|||Calculating your curse words");
            const curseWords = Utils.getCursedWords(words);
            data.messages.topCursed = curseWords;
          }

          if (options.other.showLinks) {
            await delay(600);
            setLoading("Loading Messages|||Calculating your general links");
            const links = Utils.getTopLinks(words);
            data.messages.topLinks = links;
          }

          if (options.other.showDiscordLinks) {
            await delay(700);
            setLoading("Loading Messages|||Calculating your discord links");
            const discordLink = Utils.getDiscordLinks(words);
            data.messages.topDiscordLinks = discordLink;
          }

          if (options.guilds) {
            await delay(2000);
            setLoading("Loading Guilds|||");

            await delay(600);
            setLoading("Loading Guilds|||Scanning Guilds");
            const guilds = JSON.parse(
              await Utils.readFile("servers/index.json", files)
            );
            data.guilds = Object.keys(guilds).length;
            await delay(700);
            setLoading("Loading Guilds|||Loaded Guilds");
          }

          if (options.bots) {
            await delay(2000);
            setLoading("Loading User Bots|||");

            await delay(600);
            setLoading("Loading User Bots|||Scanning Bots");
            const bots = files.filter(
              (file) =>
                file.name.startsWith("account/applications/") &&
                file.name.endsWith(".json")
            );
            if (bots.length) {
              await delay(1000);
              setLoading("Loading User Bots|||Bots Found");
              await delay(700);
              const botsArr = [];
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
              await delay(700);
              setLoading("Loading User Bots|||Loaded Bots");
              data.bots = botsArr;
            } else {
              await delay(700);
              setLoading("Loading User Bots|||Bots not Found");
            }
          }

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
              data?.bots?.filter((bot) => bot.verified)?.length > 0 &&
              !badges.includes("VERIFIED_BOT_DEVELOPER")
            ) {
              badges.push("VERIFIED_TRUE");
            }

            data.user.badges = badges;
          }

          if (options.statistics.length) {
            await delay(1000);
            setLoading("Loading Analytics|||Initializing Files");
            await delay(2000);
            const statistics = await Utils.readAnalyticsFile(
              files.find((file) =>
                /activity\/analytics\/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json/.test(
                  file.name
                )
              ),
              loading,
              setLoading,
              options.statistics
            );

            data.statistics = statistics.all;
            if (data.statistics.appOpened) {
              data.statistics.averageOpenCount = {
                day:
                  data.statistics.appOpened &&
                  parseInt(
                    data.statistics.appOpened /
                      ((Date.now() - (userId / 4194304 + 1420070400000)) /
                        24 /
                        60 /
                        60 /
                        1000)
                  ),

                week:
                  data.statistics.appOpened &&
                  parseInt(
                    data.statistics.appOpened /
                      ((Date.now() - (userId / 4194304 + 1420070400000)) /
                        7 /
                        24 /
                        60 /
                        60 /
                        1000)
                  ),
                month:
                  data.statistics.appOpened &&
                  parseInt(
                    data.statistics.appOpened /
                      ((Date.now() - (userId / 4194304 + 1420070400000)) /
                        30 /
                        24 /
                        60 /
                        60 /
                        1000)
                  ),
                year:
                  data.statistics.appOpened &&
                  parseInt(
                    data.statistics.appOpened /
                      ((Date.now() - (userId / 4194304 + 1420070400000)) /
                        365 /
                        24 /
                        60 /
                        60 /
                        1000)
                  ),
              };
            }

            if (data.statistics.sendMessage) {
              data.statistics.averageMessages = {
                day:
                  data.statistics.sendMessage &&
                  parseInt(
                    data.statistics.sendMessage /
                      ((Date.now() - (userId / 4194304 + 1420070400000)) /
                        24 /
                        60 /
                        60 /
                        1000)
                  ),
                week:
                  data.statistics.sendMessage &&
                  parseInt(
                    data.statistics.sendMessage /
                      ((Date.now() - (userId / 4194304 + 1420070400000)) /
                        7 /
                        24 /
                        60 /
                        60 /
                        1000)
                  ),
                month:
                  data.statistics.sendMessage &&
                  parseInt(
                    data.statistics.sendMessage /
                      ((Date.now() - (userId / 4194304 + 1420070400000)) /
                        30 /
                        24 /
                        60 /
                        60 /
                        1000)
                  ),
                year:
                  data.statistics.sendMessage &&
                  parseInt(
                    data.statistics.sendMessage /
                      ((Date.now() - (userId / 4194304 + 1420070400000)) /
                        365 /
                        24 /
                        60 /
                        60 /
                        1000)
                  ),
              };
            }
          }

          return data;
        }

        extractData(files, selectedFeatures)
          .then((data) => {
            setLoading(null);
            setError(null);
            data.demo = true;
            data.fakeInfo = false;
            setDataExtracted(data);

            toast.success("Data extracted Successfully", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          })
          .catch((err) => {
            console.log(err);
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
        setLoading("Loading JSON|||reading files");
        var readFile_ = new FileReader();
        readFile_.onload = function (e) {
          var content = e.target.result;
          var data = JSON.parse(content);

          if (data) {
            if (data.dataFile) {
              setLoading(null);
              setError(null);
              data.demo = true;
              setDataExtracted(data);
            } else setError("JSON file is not valid");
          } else setError("JSON file is corrupted");
        };
        readFile_.readAsText(fileUploaded);
      } else setError("Only zip and json files are supported");
    }
  };

  return demo || (dataExtracted && dataExtracted.demo) ? (
    <Data data={dataExtracted} />
  ) : (
    <>
      <Privacy />
      <Header />{" "}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
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
          className="fixed z-10 inset-0 overflow-y-auto"
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
                    {oldSelected ? (
                      <span
                        onClick={() => {
                          setOldSelected(null);
                          setShowLargeModal(false);
                          setSelectedFeatures(defaultOptions);

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

                              {typeof classifyOBJ(Features)[item] ===
                              "string" ? (
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
                                      id={classifyOBJ(Features)
                                        [item].split(" ")
                                        .join("")}
                                      type="checkbox"
                                      defaultValue
                                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded  border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                      htmlFor={classifyOBJ(Features)
                                        [item].split(" ")
                                        .join("")}
                                      className="ml-4 text-sm font-medium text-gray-200"
                                    >
                                      {classifyOBJ(Features)[item]}
                                    </label>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {Object.values(
                                    classifyOBJ(Features)[item]
                                  ).map((item_, i) => {
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
                                          }
                                          onChange={(e) => {
                                            const key = Object.keys(
                                              classifyOBJ(Features)[item]
                                            ).find(
                                              (key) =>
                                                classifyOBJ(Features)[item][
                                                  key
                                                ] === item_
                                            );

                                            setSelectedFeatures({
                                              ...selectedFeatures,
                                              [item]: {
                                                ...selectedFeatures[item],
                                                [key]: e.target.checked
                                                  ? true
                                                  : null,
                                              },
                                            });
                                          }}
                                          id={item_.split(" ").join("")}
                                          type="checkbox"
                                          defaultValue
                                          className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                          htmlFor={item_.split(" ").join("")}
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
                        {selectedFeatures.statistics.length ===
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
                        {selectedFeatures.statistics !==
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
                            default
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
                                checked={selectedFeatures.statistics.includes(
                                  Object.keys(EventsJSON.events).find(
                                    (key) => EventsJSON.events[key] === item
                                  )
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFeatures({
                                      ...selectedFeatures,
                                      statistics: [
                                        ...selectedFeatures.statistics,
                                        Object.keys(EventsJSON.events).find(
                                          (key) =>
                                            EventsJSON.events[key] === item
                                        ),
                                      ],
                                    });
                                  } else {
                                    setSelectedFeatures({
                                      ...selectedFeatures,
                                      statistics:
                                        selectedFeatures.statistics.filter(
                                          (item_) =>
                                            item_ !==
                                            Object.keys(EventsJSON.events).find(
                                              (key) =>
                                                EventsJSON.events[key] === item
                                            )
                                        ),
                                    });
                                  }
                                }}
                                id={item.split(" ").join("")}
                                type="checkbox"
                                defaultValue
                                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                htmlFor={item.split(" ").join("")}
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

                <div className="flex items-center p-6 space-x-2 rounded-b bg-[#2b2d31]">
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
                      toast.success("Successfully saved options", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
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
                      Upload your discord package or JSON here
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
                        <p className="max-w-lg mb-2 text-sm text-gray-500 dark:text-gray-400">
                          {error}
                        </p>
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
                              function hasClass(el, cl) {
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
                                {loading.split("|||")[0]}
                              </p>{" "}
                              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                                {loading.split("|||")[1]}
                              </p>
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
                                  <div className="w-full flex align-center text-gray-200">
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
      <div className="lg:landscape:flex md:landscape:flex landscape:hidden lg:text-xl md:text-xl text-sm mt-1 animate__delay-1s animate__animated animate__fadeIn flex justify-center items-center text-slate-900 dark:text-gray-200 font-bold">
        Want to view a Demo?{" "}
        <a
          className="hover:transition-all duration-200 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 font-bold px-1"
          href="/?demo=true"
          target="_blank"
          rel="noreferrer"
        >
          Click here
        </a>
      </div>
      <div className="lg:landscape:flex md:landscape:flex landscape:hidden animate__animated animate__fadeIn animate__delay-1s flex justify-center items-center absolute bottom-8 right-0 left-0">
        <div className="px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] text-slate-800 dark:text-white font-bold flex items-center rounded-md">
          Made by{" "}
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
              fill="white"
              style={{}}
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
        </div>
      </div>
    </>
  );
}
