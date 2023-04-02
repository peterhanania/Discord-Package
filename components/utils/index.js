/* eslint-disable no-mixed-spaces-and-tabs */
import Papa from "papaparse";
import { DecodeUTF8 } from "fflate";
import { snakeCase } from "snake-case";
import names from "../json/demo/names.json";
import avatars from "../json/demo/avatars.json";
import emojis from "../json/demo/emojis.json";
import randomWords from "random-words";
import curseWords from "../json/demo/curse.json";
import Events from "../json/events.json";
import currencies from "../json/other/currencies.json";
import connectionsJSON from "../json/Connections.json";

class Utils {
  static getMostUsedCurrency(transactions, amount) {
    if (transactions == null) {
      return;
    }

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

    const currency = currencies?.find(
      (a) => a?.abbreviation.toLowerCase() === mostUsedCurrency
    );

    // {amount}{symbol}
    if (currency.right) return `${amount}${currency.symbol}`;

    // {symbol}{amount}
    else return `${currency.symbol}${amount}`;
  }

  static readFile(name, files) {
    return new Promise((resolve) => {
      const file = files.find((file) => {
        if (file && file?.name) {
          return file.name === name;
        }
      });
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
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const ind = str.indexOf(eventName);
            if (ind == -1) break;
            str = str.slice(ind + eventName.length);
            eventsOccurrences[event]++;
          }
          prevChkEnd = str.slice(-eventName.length);
        }
        if (final) {
          setLoading("Rendering Data|||✨ Rendering your Data");
          resolve({
            all: eventsOccurrences ? eventsOccurrences : [],
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

      // ignore words with less or equal than 3 characters
      if (item.length <= 3) continue;

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
      /(\b(https?|ftp|file|http):\/\/[-A-Z0-9+&@#%?=~_|!:,.;]*[-A-Z0-9+&@#%=~_|])/gi;

    let links = [];
    for (let i = 0; i < array.length; i++) {
      if (regex.test(array[i].word)) {
        links.push(array[i]);
      }
    }

    array = links;

    const cleanedArr = array.map((w) => {
      const mtch = regex.test(w.word) ? w.word.match(regex)[0] : null;

      if (mtch && mtch.length > 3)
        return {
          word: mtch,
          count: w.count,
        };
    });

    return cleanedArr.filter((s) => s);
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
    const regex =
      /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
    for (let i = 0; i < array.length; i++) {
      if (array[i].word.match(regex)) {
        links.push(array[i]);
      }
    }

    array = links;

    const cleanedArr = array.map((w) => {
      const mtch = regex.test(w.word) ? w.word.match(regex)[0] : null;

      if (mtch && mtch.length > 15)
        return {
          word: mtch,
          count: w.count,
        };
    });

    return cleanedArr.filter((s) => s);
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
        "ACTIVE_DEVELOPER",
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
        "ACTIVE_DEVELOPER",
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
        "ACTIVE_DEVELOPER",
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
        "ACTIVE_DEVELOPER",
      ],
    ];

    const badges =
      randomBadges[Math.floor(Math.random() * randomBadges.length)];
    if (!isNitroUser && badges.includes("PREMIUM_DISCRIMINATOR"))
      badges.splice(badges.indexOf("PREMIUM_DISCRIMINATOR"), 1);

    if (isNitroUser) badges.push("nitro_until");

    const recentEmojis = Object.entries(emojis)
      .map(([key]) => ({
        name: key,
        count: Math.floor(Math.random() * 20) + 1,
      }))
      .sort(() => Math.random() - 0.5)
      .filter((s) => isNaN(s.name));

    const topEmojis = Object.entries(emojis)
      .sort(() => Math.random() - 0.5)
      .slice(
        Math.floor(Math.random() * 40) + 40,
        Math.floor(Math.random() * 40) + 200
      )
      // eslint-disable-next-line no-unused-vars
      .map(([key, value]) => ({
        emoji: value,
        count: Math.floor(Math.random() * 200) + 1,
      }))
      .sort((a, b) => b.count - a.count);

    const topCustomEmojis =
      "<:KEKW:890722659283910696> <:PepeHands:785757397440397313> <a:ablobwave:607305059482468400> <a:Doingthesexydance:393572602570080277> <:PepeYikes:785757359749595156> <:elonLOL:618824563693715487> <a:excuseme:458967685401935872> <a:dogdance:581559691721834554> <a:zoopthedoop:494260256239517716> <a🦜393572600619597824> <a:yeet:581560888910151680> <a:someone_is_wrong_on_the_internet:468835376312745985> <:angryeyes:586288876734382080> <:drake_dope:581333915923513344> <:drake_nope:581333905412718593> <a:gravydance:782759371468832799> <:hypebeast:642125649842012160> <a:nou:609507306740252675> <a:gj:581561843043270666> <a:peeporain:593080847775825942> <a:rick:813876036088365136> <a:hyperkappa:393578024794062848> <a:gangnamstyle:879802244499910676> <a:madlad:538976368273260545> <a:h2ocasper:471117492614332426><a:lmaoception:459848100857774132> <:dankfingers:581630874462978059> <:ffs:581332266374922280> <a:igneous:582319796922875907>  <:itsgravy:773579468283183104> <:no:892324133055131698> <a:sus:768523962899890177> <a:tobysmells:719990406552617020> <a:i_hate_php:562866393796706304> <:ight:618073210319011870>"
        .split(" ")
        .map((s) => ({
          emoji: s,
          count: Math.floor(Math.random() * 200) + 1,
        }))
        .sort((a, b) => b.count - a.count);

    const connectionsPossible = Object.keys(connectionsJSON);
    const connectionsRand =
      Math.floor(Math.random() * connectionsPossible.length) + 1;
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
      visible: Math.random() < 0.2,
      id: null,
    }));

    let guildCount = Math.floor(Math.random() * 40) + 10;
    if (isNitroUser) guildCount = Math.floor(Math.random() * 100) + 1;

    const guilds_ = {};
    for (let i = 0; i < guildCount; i++) {
      const rndID = // eslint-disable-next-line no-loss-of-precision
        (
          Math.floor(
            // eslint-disable-next-line no-loss-of-precision
            Math.random() *
              // eslint-disable-next-line no-loss-of-precision
              (9999999999999999 - 100000000000000 + 1)
          ) + 100000000000000
        ).toString();
      const rndName_ = randomWords(Math.floor(Math.random() * 2) + 1).join(" ");
      guilds_[rndID] = rndName_;
    }

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

    const hoursValues = {
      hourly: new Array(24).fill(0).map(() => {
        return Math.floor(Math.random() * 20000);
      }),
      daily: new Array(7).fill(0).map(() => {
        return Math.floor(Math.random() * 20000);
      }),
      monthly: new Array(12).fill(0).map(() => {
        return Math.floor(Math.random() * 20000);
      }),
      yearly: new Array(Math.floor(Math.random() * (5 - 3 + 1)) + 3)
        .fill(0)
        .map(() => {
          return Math.floor(Math.random() * 20000);
        }),
    };

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
        // eslint-disable-next-line no-loss-of-precision
        user_id: (
          Math.floor(
            Math.random() *
              // eslint-disable-next-line no-loss-of-precision
              (9999999999999999 - 100000000000000 + 1)
          ) + 100000000000000
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
        oldestMessages: [
          {
            sentence: "This Feature is only available when uploading a package",
            date: new Date(Date.now()),
            author: "SYSTEM",
          },
        ],
        topEmojis: Object.entries(emojis)
          .sort(() => Math.random() - 0.5)
          .slice(
            Math.floor(Math.random() * 40) + 40,
            Math.floor(Math.random() * 40) + 200
          )
          // eslint-disable-next-line no-unused-vars
          .map(([key, value]) => ({
            emoji: value,
            count: Math.floor(Math.random() * 200) + 1,
          }))
          .sort((a, b) => b.count - a.count),

        topCustomEmojis:
          "<:KEKW:890722659283910696> <:PepeHands:785757397440397313> <a:ablobwave:607305059482468400> <a:Doingthesexydance:393572602570080277> <:PepeYikes:785757359749595156> <:elonLOL:618824563693715487> <a:excuseme:458967685401935872> <a:dogdance:581559691721834554> <a:zoopthedoop:494260256239517716> <a🦜393572600619597824> <a:yeet:581560888910151680> <a:someone_is_wrong_on_the_internet:468835376312745985> <:angryeyes:586288876734382080> <:drake_dope:581333915923513344> <:drake_nope:581333905412718593> <a:gravydance:782759371468832799> <:hypebeast:642125649842012160> <a:nou:609507306740252675> <a:gj:581561843043270666> <a:peeporain:593080847775825942> <a:rick:813876036088365136> <a:hyperkappa:393578024794062848> <a:gangnamstyle:879802244499910676> <a:madlad:538976368273260545> <a:h2ocasper:471117492614332426><a:lmaoception:459848100857774132> <:dankfingers:581630874462978059> <:ffs:581332266374922280> <a:igneous:582319796922875907>  <:itsgravy:773579468283183104> <:no:892324133055131698> <a:sus:768523962899890177> <a:tobysmells:719990406552617020> <a:i_hate_php:562866393796706304> <:ight:618073210319011870>"
            .split(" ")
            .map((s) => ({
              emoji: s,
              count: Math.floor(Math.random() * 200) + 1,
            }))
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
          Object.values(emojis)[
            Math.floor(Math.random() * Object.values(emojis).length)
          ] +
          " | " +
          names[Math.floor(Math.random() * names.length)],
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
        oldestMessages: [
          {
            sentence: "This Feature is only available when uploading a package",
            date: new Date(Date.now()),
            author: "SYSTEM",
          },
        ],
        topEmojis: Object.entries(emojis)
          .sort(() => Math.random() - 0.5)
          .slice(
            Math.floor(Math.random() * 40) + 40,
            Math.floor(Math.random() * 40) + 200
          )
          // eslint-disable-next-line no-unused-vars
          .map(([key, value]) => ({
            emoji: value,
            count: Math.floor(Math.random() * 200) + 1,
          }))
          .sort((a, b) => b.count - a.count),

        topCustomEmojis:
          "<:KEKW:890722659283910696> <:PepeHands:785757397440397313> <a:ablobwave:607305059482468400> <a:Doingthesexydance:393572602570080277> <:PepeYikes:785757359749595156> <:elonLOL:618824563693715487> <a:excuseme:458967685401935872> <a:dogdance:581559691721834554> <a:zoopthedoop:494260256239517716> <a🦜393572600619597824> <a:yeet:581560888910151680> <a:someone_is_wrong_on_the_internet:468835376312745985> <:angryeyes:586288876734382080> <:drake_dope:581333915923513344> <:drake_nope:581333905412718593> <a:gravydance:782759371468832799> <:hypebeast:642125649842012160> <a:nou:609507306740252675> <a:gj:581561843043270666> <a:peeporain:593080847775825942> <a:rick:813876036088365136> <a:hyperkappa:393578024794062848> <a:gangnamstyle:879802244499910676> <a:madlad:538976368273260545> <a:h2ocasper:471117492614332426><a:lmaoception:459848100857774132> <:dankfingers:581630874462978059> <:ffs:581332266374922280> <a:igneous:582319796922875907>  <:itsgravy:773579468283183104> <:no:892324133055131698> <a:sus:768523962899890177> <a:tobysmells:719990406552617020> <a:i_hate_php:562866393796706304> <:ight:618073210319011870>"
            .split(" ")
            .map((s) => ({
              emoji: s,
              count: Math.floor(Math.random() * 200) + 1,
            }))
            .sort((a, b) => b.count - a.count),
      });
    }

    const topGroupDMs = [];
    for (let i = 0; i < Math.floor(Math.random() * (10 - 20 + 1)) + 20; i++) {
      const randomG =
        Math.random() > 0.5
          ? randomWords(2).join(" ")
          : randomWords(1)[0] + " group";
      topGroupDMs.push({
        name: randomG,
        recipients: Math.floor(Math.random() * (10 - 2 + 1)) + 2,
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
        oldestMessages: [
          {
            sentence: "This Feature is only available when uploading a package",
            date: new Date(Date.now()),
            author: "SYSTEM",
          },
        ],
        topEmojis: Object.entries(emojis)
          .sort(() => Math.random() - 0.5)
          .slice(
            Math.floor(Math.random() * 40) + 40,
            Math.floor(Math.random() * 40) + 200
          )
          // eslint-disable-next-line no-unused-vars
          .map(([key, value]) => ({
            emoji: value,
            count: Math.floor(Math.random() * 200) + 1,
          }))
          .sort((a, b) => b.count - a.count),

        topCustomEmojis:
          "<:KEKW:890722659283910696> <:PepeHands:785757397440397313> <a:ablobwave:607305059482468400> <a:Doingthesexydance:393572602570080277> <:PepeYikes:785757359749595156> <:elonLOL:618824563693715487> <a:excuseme:458967685401935872> <a:dogdance:581559691721834554> <a:zoopthedoop:494260256239517716> <a🦜393572600619597824> <a:yeet:581560888910151680> <a:someone_is_wrong_on_the_internet:468835376312745985> <:angryeyes:586288876734382080> <:drake_dope:581333915923513344> <:drake_nope:581333905412718593> <a:gravydance:782759371468832799> <:hypebeast:642125649842012160> <a:nou:609507306740252675> <a:gj:581561843043270666> <a:peeporain:593080847775825942> <a:rick:813876036088365136> <a:hyperkappa:393578024794062848> <a:gangnamstyle:879802244499910676> <a:madlad:538976368273260545> <a:h2ocasper:471117492614332426><a:lmaoception:459848100857774132> <:dankfingers:581630874462978059> <:ffs:581332266374922280> <a:igneous:582319796922875907>  <:itsgravy:773579468283183104> <:no:892324133055131698> <a:sus:768523962899890177> <a:tobysmells:719990406552617020> <a:i_hate_php:562866393796706304> <:ight:618073210319011870>"
            .split(" ")
            .map((s) => ({
              emoji: s,
              count: Math.floor(Math.random() * 200) + 1,
            }))
            .sort((a, b) => b.count - a.count),
      });
    }

    const guilds = [];
    function merge(a, b) {
      return a.concat(b);
    }

    topChannels.forEach((ch) => {
      if (!guilds.find((x) => x.guildName === ch.guildName)) {
        ch.name = [ch.name];
        guilds.push(ch);
      } else {
        const index = guilds.findIndex((x) => x.guildName === ch.guildName);
        guilds[index].name.push(ch.name);
        guilds[index].messageCount += ch.messageCount;
        guilds[index].favoriteWords = merge(
          guilds[index].favoriteWords,
          ch.favoriteWords
        );
        guilds[index].topCursed = merge(guilds[index].topCursed, ch.topCursed);
        guilds[index].topLinks = merge(guilds[index].topLinks, ch.topLinks);
        guilds[index].topDiscordLinks = merge(
          guilds[index].topDiscordLinks,
          ch.topDiscordLinks
        );
        guilds[index].oldestMessages = merge(
          guilds[index].oldestMessages,
          ch.oldestMessages
        );
        guilds[index].topEmojis = merge(guilds[index].topEmojis, ch.topEmojis);
        guilds[index].topCustomEmojis = merge(
          guilds[index].topCustomEmojis,
          ch.topCustomEmojis
        );
      }
    });

    const possibleStats = Object.keys(Events.events);
    const statistics = {};
    possibleStats.forEach((stat) => {
      statistics[stat] = Math.floor(Math.random() * (2000 - 0 + 1)) + 0;
    });

    const characterCount =
      Math.floor(Math.random() * (300000 - 1000 + 1)) + 1000;

    function createSentence(s) {
      const sentences = new Array(s ? s : 1000).fill(0).map(() => {
        const sentence = randomWords({ min: 3, max: 10 }).join(" ");
        return {
          sentence,
          timestamp: new Date(
            2019 +
              Math.floor(Math.random() * (new Date().getFullYear() - 2019 + 1)),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28),
            Math.floor(Math.random() * 24),
            Math.floor(Math.random() * 60),
            Math.floor(Math.random() * 60)
          ).toISOString(),
          author:
            Math.random() > 0.5
              ? "channel:" +
                Object.values(emojis)[
                  Math.floor(Math.random() * Object.values(emojis).length)
                ] +
                " | " +
                names[Math.floor(Math.random() * names.length)] +
                "(guild: " +
                randomWords(1)[0] +
                " Land" +
                ")"
              : "user:" +
                names[Math.floor(Math.random() * names.length)] +
                "#" +
                Math.floor(Math.random() * (9999 - 1000 + 1)) +
                "(ID: " +
                // eslint-disable-next-line no-loss-of-precision
                (
                  Math.floor(
                    Math.random() *
                      // eslint-disable-next-line no-loss-of-precision
                      (9999999999999999 - 100000000000000 + 1)
                  ) + 100000000000000
                ).toString() +
                ")",
        };
      });
      return sentences.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
    }

    const attachmentCount = [];
    for (let i = 0; i < Math.floor(Math.random() * (100 - 10 + 1)) + 10; i++) {
      attachmentCount.push(
        "https://media.discordapp.net/attachments/" +
          Math.random().toString(36).substring(7) +
          "/" +
          Math.random().toString(36).substring(7) +
          "/attachment.jpg"
      );
    }

    return {
      fakeInfo: true,
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
        topChannels: topChannels.sort(
          (a, b) => b.messageCount - a.messageCount
        ),
        topDMs: topDMs.sort((a, b) => b.messageCount - a.messageCount),
        topGuilds: guilds.sort((a, b) => b.messageCount - a.messageCount),
        topGroupDMs,
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
        oldestMessages: createSentence(),
        topEmojis,
        topCustomEmojis,
        attachmentCount,
        mentionCount: {
          everyone: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
          here: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
          role: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
          user: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
          channel: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
        },
      },
      guilds: guilds_,
      statistics,
    };
  }
  static getEmojiCount(text) {
    const emojiChars = text
      .join(" ")
      .match(
        /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g
      );

    const emojiCount = [];
    if (emojiChars) {
      emojiChars.forEach((emoji) => {
        if (!emojiCount.find((e) => e.emoji === emoji)) {
          emojiCount.push({
            emoji,
            count: 1,
          });
        } else {
          emojiCount.forEach((e) => {
            if (e.emoji === emoji) {
              e.count++;
            }
          });
        }
      });
    }
    return emojiCount;
  }

  static getCustomEmojiCount(text) {
    const emojis = text
      .join(" ")
      .toLowerCase()
      .match(/<a?:[a-zA-Z0-9_]+:(\d+)>/g);

    const emojiCount = [];
    if (emojis) {
      emojis.forEach((emoji) => {
        if (!emojiCount.find((e) => e.emoji === emoji)) {
          emojiCount.push({
            emoji,
            count: 1,
          });
        } else {
          emojiCount.forEach((e) => {
            if (e.emoji === emoji) {
              e.count++;
            }
          });
        }
      });
    }

    return emojiCount;
  }

  static getTopCount(obj) {
    let totalCount = 0;
    for (let i = 0; i < obj.length; i++) {
      totalCount += obj[i].count;
    }
    return totalCount;
  }

  static getAVGCount(statistics, userId) {
    return {
      day:
        statistics &&
        parseInt(
          statistics /
            ((Date.now() - (userId / 4194304 + 1420070400000)) /
              24 /
              60 /
              60 /
              1000)
        ),

      week:
        statistics &&
        parseInt(
          statistics /
            ((Date.now() - (userId / 4194304 + 1420070400000)) /
              7 /
              24 /
              60 /
              60 /
              1000)
        ),
      month:
        statistics &&
        parseInt(
          statistics /
            ((Date.now() - (userId / 4194304 + 1420070400000)) /
              30 /
              24 /
              60 /
              60 /
              1000)
        ),
      year:
        statistics &&
        parseInt(
          statistics /
            ((Date.now() - (userId / 4194304 + 1420070400000)) /
              365 /
              24 /
              60 /
              60 /
              1000)
        ),
    };
  }

  static isCheckedStats(selectedFeatures, item) {
    return selectedFeatures?.statistics?.includes(
      Object.keys(Events.events).find((key) => Events.events[key] === item)
    );
  }

  static findSelectedStats(item) {
    return Object.keys(Events.events).find(
      (key) => Events.events[key] === item
    );
  }

  static filterStatistics(item, selectedFeatures) {
    return selectedFeatures?.statistics.filter(
      (item_) =>
        item_ !==
        Object.keys(Events.events).find((key) => Events.events[key] === item)
    );
  }

  static createEmoji(emoji) {
    return (
      "https://cdn.discordapp.com/emojis/" +
      /<:.*?:(\d+)>/g.exec(emoji)[1] +
      ".png"
    );
  }

  static createCustomEmoji(emoji) {
    return (
      "https://cdn.discordapp.com/emojis/" +
      /<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(emoji)[2] +
      ".gif"
    );
  }

  static async validateOptions(obj, data_d) {
    try {
      const categories = Object.keys(obj);
      if (JSON.stringify(categories) !== JSON.stringify(Object.keys(data_d)))
        return false;

      let val = true;
      Object.keys(obj)
        .filter((category) => category !== "statistics")
        .forEach((category) => {
          if (data_d[category]) {
            if (
              JSON.stringify(Object.keys(data_d[category])) !==
              JSON.stringify(Object.keys(obj[category]))
            ) {
              val = false;
            }
          }
        });

      if (!val) return false;
      const validStatistics = Object.keys(Events.events);
      let val2 = false;
      data_d.statistics.forEach((stat) => {
        if (!validStatistics.includes(stat)) val2 = true;
      });

      if (val2) return false;
      return true;
    } catch (err) {
      return false;
    }
  }

  static getTenor(link) {
    try {
      const last = link.split("/")[link.split("/").length - 1];
      const id = last.match(/\d+/)[0];
      return id;
    } catch (err) {
      return null;
    }
  }

  static classifyOBJ(obj) {
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
  }
}

export default Utils;
