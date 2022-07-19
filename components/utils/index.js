import Papa from "papaparse";
import { DecodeUTF8 } from "fflate";
import { snakeCase } from "snake-case";
import names from "../json/demo/names.json";
import avatars from "../json/demo/avatars.json";
import emojis from "../json/demo/emojis.json";
import randomWords from "random-words";
import curseWords from "../json/demo/curse.json";
import Events from "../json/events.json";

class Utils {
  static getMostUsedCurrency(transactions) {
    const currenciesUsed = {};
    transactions.forEach((a) => {
      if (currenciesUsed[a.currency]) {
        currenciesUsed[a.currency]++;
      } else {
        currenciesUsed[a.currency] = 1;
      }
    });
    const mostUsedCurrency = Object.keys(currenciesUsed)
      .sort((a, b) => currenciesUsed[b] - currenciesUsed[a])
      .shift();
    return mostUsedCurrency;
  }
  static readFile(name, files) {
    return new Promise((resolve) => {
      const file = files.find((file) => file.name === name);
      if (!file) return resolve(null);
      const fileContent = [];
      const decoder = new DecodeUTF8();
      file.ondata = (err, data, final) => {
        decoder.push(data, final);
      };
      decoder.ondata = (str, final) => {
        fileContent.push(str);
        if (final) resolve(fileContent.join(""));
      };
      file.start();
    });
  }
  static parseCSV(input) {
    return Papa.parse(input, {
      header: true,
      newline: ",\r",
    })
      .data.filter((m) => m.Contents)
      .map((m) => ({
        id: m.ID,
        timestamp: m.Timestamp,
        length: m.Contents.length,
        words: m.Contents.split(" "),
        // content: m.Contents,
        // attachments: m.Attachments
      }));
  }

  static perDay(value, userID) {
    return parseInt(
      value /
        ((Date.now() - (userID / 4194304 + 1420070400000)) /
          24 /
          60 /
          60 /
          1000)
    );
  }
  static readAnalyticsFile(file, loading, setLoading, selectedFeatures) {
    return new Promise((resolve) => {
      if (!file) resolve({});
      const eventsOccurrences = {};
      for (let eventName of selectedFeatures) eventsOccurrences[eventName] = 0;
      const decoder = new DecodeUTF8();
      let startAt = Date.now();
      let bytesRead = 0;
      file.ondata = (_err, data, final) => {
        bytesRead += data.length;
        const remainingBytes = file.originalSize - bytesRead;
        const timeToReadByte = (Date.now() - startAt) / bytesRead;
        const remainingTime = parseInt(
          (remainingBytes * timeToReadByte) / 1000
        );

        setLoading(
          `Loading Analytics: ${Math.ceil(
            (bytesRead / file.originalSize) * 100
          )}%|||Estimated time: ${remainingTime + 1} second${
            remainingTime + 1 === 1 ? "" : "s"
          }`
        );

        decoder.push(data, final);
      };
      let prevChkEnd = "";
      decoder.ondata = (str, final) => {
        str = prevChkEnd + str;
        for (let event of Object.keys(eventsOccurrences)) {
          const eventName = snakeCase(event);
          while (true) {
            const ind = str.indexOf(eventName);
            if (ind == -1) break;
            str = str.slice(ind + eventName.length);
            eventsOccurrences[event]++;
          }
          prevChkEnd = str.slice(-eventName.length);
        }
        if (final) {
          resolve({
            all: eventsOccurrences,
          });
        }
      };
      file.start();
    });
  }

  static getFavoriteWords(words) {
    words = words.flat(3);

    let item,
      length = words.length,
      array = [],
      object = {};

    for (let index = 0; index < length; index++) {
      item = words[index];
      if (!item) continue;

      if (!object[item]) object[item] = 1;
      else ++object[item];
    }

    for (let p in object) array[array.length] = p;

    return array
      .sort((a, b) => object[b] - object[a])
      .map((word) => ({ word: word, count: object[word] }));
  }

  static getCursedWords(words) {
    words = words.flat(3);

    let item,
      length = words.length,
      array = [],
      object = {};

    for (let index = 0; index < length; index++) {
      item = words[index].toLowerCase();
      if (!item) continue;

      if (!object[item]) object[item] = 1;
      else ++object[item];
    }

    for (let p in object) array[array.length] = p;

    array = array
      .sort((a, b) => object[b] - object[a])
      .map((word) => ({ word: word, count: object[word] }));

    const regex =
      /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;

    const swearWords = [];
    for (let i = 0; i < array.length; i++) {
      if (regex.test(array[i].word)) {
        swearWords.push(array[i]);
      }
    }

    array = swearWords;
    return array;
  }
  static getTopLinks(words) {
    words = words.flat(3);

    let item,
      length = words.length,
      array = [],
      object = {};

    for (let index = 0; index < length; index++) {
      item = words[index];
      if (!item) continue;

      if (!object[item]) object[item] = 1;
      else ++object[item];
    }

    for (let p in object) array[array.length] = p;

    array = array
      .sort((a, b) => object[b] - object[a])
      .map((word) => ({ word: word, count: object[word] }));

    let regex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

    let links = [];
    for (let i = 0; i < array.length; i++) {
      if (regex.test(array[i].word)) {
        links.push(array[i]);
      }
    }

    array = links;
    return array;
  }

  static getDiscordLinks(words) {
    words = words.flat(3);

    let item,
      length = words.length,
      array = [],
      object = {};

    for (let index = 0; index < length; index++) {
      item = words[index];
      if (!item) continue;

      if (!object[item]) object[item] = 1;
      else ++object[item];
    }

    for (let p in object) array[array.length] = p;

    array = array
      .sort((a, b) => object[b] - object[a])
      .map((word) => ({ word: word, count: object[word] }));

    let links = [];
    for (let i = 0; i < array.length; i++) {
      if (
        array[i].word.match(
          /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i
        )
      ) {
        links.push(array[i]);
      }
    }

    array = links;
    return array;
  }

  static generateRandomData() {
    const id = Math.random().toString(36).substring(7);
    const username = names[Math.floor(Math.random() * names.length)];
    const discriminator = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    const isNitroUser = Math.random() > 0.5 ? true : false;
    let avs;
    if (isNitroUser) {
      avs = avatars.nitro;
    } else avs = avatars.default;
    const avatar = avs[Math.floor(Math.random() * avs.length)];

    const randomBadges = [
      [
        "DISCORD_EMPLOYEE",
        "DISCORD_PARTNER",
        "HYPESQUAD_EVENTS",
        "BUG_HUNTER_LEVEL_1",
        "MFA_SMS",
        "HOUSE_BRAVERY",
        "EARLY_SUPPORTER",
        "BUG_HUNTER_LEVEL_2",
        "VERIFIED_BOT_DEVELOPER",
        "CERTIFIED_MODERATOR",
        "PREMIUM_DISCRIMINATOR",
        "USED_DESKTOP_CLIENT",
        "USED_WEB_CLIENT",
        "USED_MOBILE_CLIENT",
        "VERIFIED_EMAIL",
      ],
      [
        "DISCORD_EMPLOYEE",
        "DISCORD_PARTNER",
        "HYPESQUAD_EVENTS",
        "BUG_HUNTER_LEVEL_1",
        "MFA_SMS",
        "HOUSE_BRILLIANCE",
        "EARLY_SUPPORTER",
        "BUG_HUNTER_LEVEL_2",
        "VERIFIED_BOT_DEVELOPER",
        "CERTIFIED_MODERATOR",
        "PREMIUM_DISCRIMINATOR",
        "USED_DESKTOP_CLIENT",
        "USED_WEB_CLIENT",
        "USED_MOBILE_CLIENT",
        "VERIFIED_EMAIL",
      ],
      [
        "DISCORD_EMPLOYEE",
        "DISCORD_PARTNER",
        "HYPESQUAD_EVENTS",
        "BUG_HUNTER_LEVEL_1",
        "MFA_SMS",
        "HOUSE_BALANCE",
        "EARLY_SUPPORTER",
        "BUG_HUNTER_LEVEL_2",
        "VERIFIED_BOT_DEVELOPER",
        "CERTIFIED_MODERATOR",
        "PREMIUM_DISCRIMINATOR",
        "USED_DESKTOP_CLIENT",
        "USED_WEB_CLIENT",
        "USED_MOBILE_CLIENT",
        "VERIFIED_EMAIL",
      ],
      [
        "DISCORD_EMPLOYEE",
        "HYPESQUAD_EVENTS",
        "BUG_HUNTER_LEVEL_1",
        "MFA_SMS",
        "HOUSE_BALANCE",
        "EARLY_SUPPORTER",
        "CERTIFIED_MODERATOR",
        "PREMIUM_DISCRIMINATOR",
        "USED_DESKTOP_CLIENT",
        "USED_WEB_CLIENT",
        "VERIFIED_EMAIL",
        "VERIFIED_TRUE",
      ],
      [
        "HOUSE_BALANCE",
        "HAS_UNREAD_URGENT_MESSAGES",
        "SPAMMER",
        "USED_DESKTOP_CLIENT",
        "USED_WEB_CLIENT",
        "DISABLED",
        "VERIFIED_EMAIL",
        "QUARANTINED",
      ],
      [
        "DISCORD_PARTNER",
        "HYPESQUAD_EVENTS",
        "MFA_SMS",
        "HOUSE_BRILLIANCE",
        "VERIFIED_TRUE",
        "USED_DESKTOP_CLIENT",
        "USED_WEB_CLIENT",
        "USED_MOBILE_CLIENT",
      ],
      [
        "MFA_SMS",
        "PREMIUM_PROMO_DISMISSED",
        "HOUSE_BALANCE",
        "EARLY_SUPPORTER",
        "HAS_UNREAD_URGENT_MESSAGES",
        "PREMIUM_DISCRIMINATOR",
        "USED_MOBILE_CLIENT",
      ],
      [
        "MFA_SMS",
        "PREMIUM_PROMO_DISMISSED",
        "HOUSE_BRAVERY",
        "EARLY_SUPPORTER",
        "USED_MOBILE_CLIENT",
        "USED_WEB_CLIENT",
        "VERIFIED_TRUE",
      ],
    ];

    const badges =
      randomBadges[Math.floor(Math.random() * randomBadges.length)];
    if (!isNitroUser && badges.includes("PREMIUM_DISCRIMINATOR"))
      badges.splice(badges.indexOf("PREMIUM_DISCRIMINATOR"), 1);

    if (isNitroUser) badges.push("nitro_until");

    const recentEmojis = Object.entries(emojis)
      .map(([key, value]) => ({
        name: key,
        count: Math.floor(Math.random() * 20) + 1,
      }))
      .sort((a, b) => Math.random() - 0.5)
      .filter((s) => isNaN(s.name));

    const connectionsPossible = [
      "youtube",
      "xbox",
      "twitter",
      "twitch",
      "steam",
      "spotify",
      "reddit",
      "playstation",
      "github",
      "facebook",
      "epicgames",
      "battlenet",
    ];

    const connectionsRand = Math.floor(Math.random() * 5) + 1;
    const connectionsArray = [];
    for (let i = 0; i < connectionsRand; i++) {
      const connectionsArray_ =
        connectionsPossible[
          Math.floor(Math.random() * connectionsPossible.length)
        ];

      if (!connectionsArray.includes(connectionsArray_))
        connectionsArray.push(connectionsArray_);
    }
    const connections = connectionsArray.map((connection) => ({
      type: connection,
      name: username + Math.floor(Math.random() * 10) + 1,
    }));

    let guilds = Math.floor(Math.random() * 40) + 10;  
    if (isNitroUser) guilds = Math.floor(Math.random() * 100) + 1;

    const folderCount = Math.floor(
      guilds /
        Math.floor(Math.random() * (guilds - Math.floor(Math.random() * 2))) +
        1
    );

    const randomNum10to20 = Math.floor(Math.random() * 10) + 10;
    const randomNum10to20_avatars = avatars.default
      .sort(() => Math.random() - 0.5)
      .slice(0, randomNum10to20);

    const tags = new Array(randomNum10to20).fill(0).map(() => {
      const n_ = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
      return `${n_}`;
    });

    const randomNum10to20_names = names
      .sort(() => Math.random() - 0.5)
      .slice(0, randomNum10to20);
    const randomNum10to20_tags = tags
      .sort(() => Math.random() - 0.5)
      .slice(0, randomNum10to20);

    const bots = new Array(randomNum10to20).fill(0).map(() => {
      return {
        name:
          randomNum10to20_names[
            Math.floor(Math.random() * randomNum10to20_names.length)
          ] +
          "#" +
          randomNum10to20_tags[
            Math.floor(Math.random() * randomNum10to20_tags.length)
          ],
        avatar:
          randomNum10to20_avatars[
            Math.floor(Math.random() * randomNum10to20_avatars.length)
          ],
        verified: Math.random() < 0.3,
      };
    });

    function generateRandomDate() {
      const start = new Date(2021, 0, 1);
      const end = new Date();
      const randomDate = new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
      return randomDate;
    }

    const possibleTransactions = {
      1: {
        information: "GIFT - Nitro",
        amount: 9.99,
        currency: "usd",
        date: generateRandomDate(),
      },
      2: {
        information: "GIFT - Nitro Classic",
        amount: 4.99,
        currency: "usd",
        date: generateRandomDate(),
      },
      3: {
        information: "GIFT - Nitro Yearly",
        amount: 99.99,
        currency: "usd",
        date: generateRandomDate(),
      },
    };

    const transactions = new Array(Math.floor(Math.random() * (7 - 3 + 1)) + 3)
      .fill(0)
      .map(() => {
        const randomNum = Math.floor(Math.random() * 3) + 1;
        return possibleTransactions[randomNum];
      });

    const total = Object.values(transactions)
      .map((transaction) => transaction.amount)
      .reduce((a, b) => a + b, 0);

    const gifted_ = ["Nitro Yearly", "Nitro Classic Monthly", "Nitro"];

    const gifted = new Array(Math.floor(Math.random() * (50 - 0 + 1)) + 0)
      .fill(0)
      .map(() => {
        return gifted_[Math.floor(Math.random() * gifted_.length)];
      });

    const giftedNitro = {};
    gifted.forEach((gift) => {
      if (giftedNitro[gift]) {
        giftedNitro[gift]++;
      } else {
        giftedNitro[gift] = 1;
      }
    });

    const hoursValues = new Array(24).fill(0).map(() => {
      return Math.floor(Math.random() * 20000);
    });

    function generateRandomDiscordLink() {
      const links = [];
      for (let i = 0; i < Math.floor(Math.random() * 300) + 1; i++) {
        links.push(`https://discord.gg/${randomWords(1)[0]}`);
      }
      return links;
    }

    function generateRandomLink() {
      const links = [];
      for (let i = 0; i < Math.floor(Math.random() * 300) + 1; i++) {
        const rnd = randomWords(1);
        const link = `https://${rnd[0]}.${
          ["com", "net", "org", "io", "dev"][Math.floor(Math.random() * 5)]
        }/`;
        const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        links.push(link + randomNum);
      }
      return links;
    }

    const topDMs = [];
    for (
      let i = 0;
      i < Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
      i++
    ) {
      topDMs.push({
        user_tag:
          names[Math.floor(Math.random() * names.length)] +
          "#" +
          Math.floor(Math.random() * (9999 - 1000 + 1)),
        user_id: (
          Math.floor(Math.random() * (9999999999999999 - 100000000000000 + 1)) +
          100000000000000
        ).toString(),
        messageCount: Math.floor(Math.random() * (30000 - 1000 + 1)) + 1000,
        favoriteWords: randomWords({ min: 100, max: 700 })
          .map((s) => {
            return {
              count: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
              word: s,
            };
          })
          .sort((a, b) => b.count - a.count),
        topCursed: curseWords
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * (100 - 10 + 1)) + 10)
          .map((s) => {
            return {
              count: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
              word: s,
            };
          })
          .sort((a, b) => b.count - a.count),
        topLinks: generateRandomLink()
          .map((s) => {
            return {
              count: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
              word: s,
            };
          })
          .sort((a, b) => b.count - a.count),
        topDiscordLinks: generateRandomDiscordLink()
          .map((s) => {
            return {
              count: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
              word: s,
            };
          })
          .sort((a, b) => b.count - a.count),
      });
    }

    const topChannels = [];
    for (
      let i = 0;
      i < Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
      i++
    ) {
      const randomG =
        Math.random() > 0.5
          ? randomWords(2).join(" ")
          : randomWords(1)[0] + " Land";
      topChannels.push({
        name:
          names[Math.floor(Math.random() * names.length)] +
          "#" +
          Math.floor(Math.random() * (9999 - 1000 + 1)),
        guildName: randomG,
        messageCount: Math.floor(Math.random() * (30000 - 1000 + 1)) + 1000,
        favoriteWords: randomWords({ min: 100, max: 700 })
          .map((s) => {
            return {
              count: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
              word: s,
            };
          })
          .sort((a, b) => b.count - a.count),
        topCursed: curseWords
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * (100 - 10 + 1)) + 10)
          .map((s) => {
            return {
              count: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
              word: s,
            };
          })
          .sort((a, b) => b.count - a.count),
        topLinks: generateRandomLink()
          .map((s) => {
            return {
              count: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
              word: s,
            };
          })
          .sort((a, b) => b.count - a.count),
        topDiscordLinks: generateRandomDiscordLink()
          .map((s) => {
            return {
              count: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
              word: s,
            };
          })
          .sort((a, b) => b.count - a.count),
      });
    }

    const possibleStats = Object.keys(Events.events);
    const statistics = {};
    possibleStats.forEach((stat) => {
      statistics[stat] = Math.floor(Math.random() * (2000 - 0 + 1)) + 0;
    });

    const characterCount =
      Math.floor(Math.random() * (300000 - 1000 + 1)) + 1000;

    return {
      fakeInfo:true,
      user: {
        id,
        username,
        discriminator,
        avatar,
        premium_until: isNitroUser
          ? Date.now() +
            (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000
          : null,
        flags: null,
        badges,
      },
      settings: {
        appearance: {
          theme: Math.random() > 0.1 ? "DARK" : null,
          developerMode: Math.random() > 0.1 ? true : false,
        },
        folderCount: folderCount,
        recentEmojis,
      },
      connections,
      bots,
      payments: {
        total,
        transactions,
        giftedNitro,
      },
      messages: {
        channelCount: topChannels.length,
        dmChannelCount: topDMs.length,
        topChannels: topChannels.sort(
          (a, b) => b.messageCount - a.messageCount
        ),
        topDMs: topDMs.sort((a, b) => b.messageCount - a.messageCount),
        characterCount: characterCount,
        messageCount: Math.floor(characterCount / (Math.random() * 3) + 1),
        hoursValues,
        favoriteWords: randomWords({ min: 100, max: 700 })
          .map((s) => {
            return {
              count: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
              word: s,
            };
          })
          .sort((a, b) => b.count - a.count),
        topCursed: curseWords
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * (100 - 10 + 1)) + 10)
          .map((s) => {
            return {
              count: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
              word: s,
            };
          })
          .sort((a, b) => b.count - a.count),
        topLinks: generateRandomLink()
          .map((s) => {
            return {
              count: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
              word: s,
            };
          })
          .sort((a, b) => b.count - a.count),
        topDiscordLinks: generateRandomDiscordLink()
          .map((s) => {
            return {
              count: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
              word: s,
            };
          })
          .sort((a, b) => b.count - a.count),
      },
      guilds,
      statistics,
    };
  }
}

export default Utils;
