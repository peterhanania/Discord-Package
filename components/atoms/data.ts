import Utils from "../utils";
import { atom } from "jotai";
import EventsJSON from "../json/events.json";

export const dataExtractedAtom = atom<any>(null);

export const oldSelectedAtom = atom<any>(null);

export const defaultOptionAtom = atom<any>(
  Utils.classifyOBJ({
    bots: true,
    "user.premium_until": true,
    "user.badges": true,
    "settings.appearance": true,
    "settings.recentEmojis": true,
    connections: true,
    "payments.total": true,
    "payments.transactions": true,
    "payments.giftedNitro": true,
    "messages.topChannels": true,
    "messages.topDMs": true,
    "messages.topGuilds": true,
    "messages.topGroupDMs": true,
    "messages.characterCount": true,
    "messages.topCustomEmojis": true,
    "messages.topEmojis": true,
    "messages.hoursValues": true,
    "messages.oldestMessages": true,
    "messages.attachmentCount": true,
    "messages.mentionCount": true,
    guilds: true,
    "other.showCurseWords": true,
    "other.showDiscordLinks": true,
    "other.showLinks": true,
    "other.favoriteWords": true,
    "other.oldestMessages": true,
    "other.topEmojis": true,
    "other.topCustomEmojis": true,
    statistics: EventsJSON.defaultEvents,
  })
);

export const selectedFeaturesAtom = atom<any>(
  Utils.classifyOBJ({
    bots: true,
    "user.premium_until": true,
    "user.badges": true,
    "settings.appearance": true,
    "settings.recentEmojis": true,
    connections: true,
    "payments.total": true,
    "payments.transactions": true,
    "payments.giftedNitro": true,
    "messages.topChannels": true,
    "messages.topDMs": true,
    "messages.topGuilds": true,
    "messages.topGroupDMs": true,
    "messages.characterCount": true,
    "messages.topCustomEmojis": true,
    "messages.topEmojis": true,
    "messages.hoursValues": true,
    "messages.oldestMessages": true,
    "messages.attachmentCount": true,
    "messages.mentionCount": true,
    guilds: true,
    "other.showCurseWords": true,
    "other.showDiscordLinks": true,
    "other.showLinks": true,
    "other.favoriteWords": true,
    "other.oldestMessages": true,
    "other.topEmojis": true,
    "other.topCustomEmojis": true,
    statistics: Object.keys(EventsJSON.events),
  })
);


export const topDMsAtom = atom<any>([]);
export const topChannelsAtom = atom<any>([]);
export const topGuildsAtom = atom<any>([]);
export const topGroupDMsAtom = atom<any>([]);
export const dataAtom = atom<any>(null);