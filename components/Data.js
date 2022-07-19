import Image from "next/image";
import Badges from "./json/badges/index.json";
import Tippy from "@tippyjs/react";
import moment from "moment";
import emojis from "./json/demo/emojis.json";
import CountUp from "react-countup";
import currencies from "./json/other/currencies.json";
import Utils from "./utils";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import EventsJSON from "./json/events.json";
import Settings from "./settings";
import HighchartsExporting from "highcharts/modules/exporting";
if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
}

function hasClass(el, cl) {
  return el.classList
    ? el.classList.contains(cl)
    : !!el.className &&
        !!el.className.match(new RegExp("(?: |^)" + cl + "(?: |$)"));
}

const days_ = new Array(24)
  .fill(0)
  .map((v, i) =>
    i == 0 ? "12am" : i < 12 ? `${i}am` : i == 12 ? "12pm" : `${i - 12}pm`
  );
const icons = {
  DISCORD_EMPLOYEE: (
    <Image
      src="https://i.imgur.com/6eIBtYR.png"
      width={42}
      height={42}
      alt="DISCORD_EMPLOYEE"
      draggable="false"
    />
  ),
  DISCORD_PARTNER: (
    <Image
      src="https://i.imgur.com/hpTiFXi.png"
      width={42}
      height={42}
      alt="DISCORD_PARTNER"
      draggable="false"
    />
  ),
  HYPESQUAD_EVENTS: (
    <Image
      src="https://i.imgur.com/RzA4bXZ.png"
      width={42}
      height={42}
      alt="HYPESQUAD_EVENTS"
      draggable="false"
    />
  ),
  BUG_HUNTER_LEVEL_1: (
    <Image
      src="https://i.imgur.com/2NLZJXk.png"
      width={42}
      height={42}
      alt="BUG_HUNTER_LEVEL_1"
      draggable="false"
    />
  ),
  MFA_SMS: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="M15.3 21.85q.85 0 1.425-.575.575-.575.575-1.425 0-.85-.575-1.425-.575-.575-1.425-.575-.85 0-1.425.575Q13.3 19 13.3 19.85q0 .85.575 1.425.575.575 1.425.575Zm8.85 0q.85 0 1.425-.575.575-.575.575-1.425 0-.85-.575-1.425-.575-.575-1.425-.575-.85 0-1.425.575-.575.575-.575 1.425 0 .85.575 1.425.575.575 1.425.575Zm8.5 0q.85 0 1.425-.575.575-.575.575-1.425 0-.85-.575-1.425-.575-.575-1.425-.575-.85 0-1.425.575-.575.575-.575 1.425 0 .85.575 1.425.575.575 1.425.575ZM4 44V7q0-1.15.9-2.075Q5.8 4 7 4h34q1.15 0 2.075.925Q44 5.85 44 7v26q0 1.15-.925 2.075Q42.15 36 41 36H12Z" />
    </svg>
  ),
  PREMIUM_PROMO_DISMISSED: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-red-600"
    >
      <path d="M21.55 31.5q.05-3.6.825-5.25.775-1.65 2.925-3.6 2.1-1.9 3.225-3.525t1.125-3.475q0-2.25-1.5-3.75t-4.2-1.5q-2.6 0-4 1.475T17.9 14.95l-4.2-1.85q1.1-2.95 3.725-5.025T23.95 6q5 0 7.7 2.775t2.7 6.675q0 2.4-1.025 4.35-1.025 1.95-3.275 4.1-2.45 2.35-2.95 3.6t-.55 4Zm2.4 12.5q-1.45 0-2.475-1.025Q20.45 41.95 20.45 40.5q0-1.45 1.025-2.475Q22.5 37 23.95 37q1.45 0 2.475 1.025Q27.45 39.05 27.45 40.5q0 1.45-1.025 2.475Q25.4 44 23.95 44Z" />
    </svg>
  ),
  HOUSE_BRAVERY: (
    <Image
      src="https://i.imgur.com/mwFPsVv.png"
      width={42}
      height={42}
      alt="HOUSE_BRAVERY"
      draggable="false"
    />
  ),
  HOUSE_BRILLIANCE: (
    <Image
      src="https://i.imgur.com/UNpQI3M.png"
      width={42}
      height={42}
      alt="HOUSE_BRILLIANCE"
      draggable="false"
    />
  ),
  HOUSE_BALANCE: (
    <Image
      src="https://i.imgur.com/Jw2Xyx6.png"
      width={42}
      height={42}
      alt="HOUSE_BALANCE"
      draggable="false"
    />
  ),
  EARLY_SUPPORTER: (
    <Image
      src="https://i.imgur.com/xUtDJFl.png"
      width={42}
      height={42}
      alt="EARLY_SUPPORTER"
      draggable="false"
    />
  ),
  TEAM_PSEUDO_USER: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="M1.9 40v-4.7q0-1.75.9-3.175Q3.7 30.7 5.3 30q3.65-1.6 6.575-2.3Q14.8 27 17.9 27q3.1 0 6 .7t6.55 2.3q1.6.7 2.525 2.125.925 1.425.925 3.175V40Zm35 0v-4.7q0-3.15-1.6-5.175t-4.2-3.275q3.45.4 6.5 1.175t4.95 1.775q1.65.95 2.6 2.35.95 1.4.95 3.15V40Zm-19-16.05q-3.3 0-5.4-2.1-2.1-2.1-2.1-5.4 0-3.3 2.1-5.4 2.1-2.1 5.4-2.1 3.3 0 5.4 2.1 2.1 2.1 2.1 5.4 0 3.3-2.1 5.4-2.1 2.1-5.4 2.1Zm10.5 0q-.55 0-1.225-.075T25.95 23.6q1.2-1.25 1.825-3.075.625-1.825.625-4.075t-.625-3.975Q27.15 10.75 25.95 9.3q.55-.15 1.225-.25t1.225-.1q3.3 0 5.4 2.1 2.1 2.1 2.1 5.4 0 3.3-2.1 5.4-2.1 2.1-5.4 2.1ZM4.9 37h26v-1.7q0-.8-.475-1.55T29.25 32.7q-3.6-1.6-6.05-2.15-2.45-.55-5.3-.55-2.85 0-5.325.55T6.5 32.7q-.7.3-1.15 1.05-.45.75-.45 1.55Zm13-16.05q1.95 0 3.225-1.275Q22.4 18.4 22.4 16.45q0-1.95-1.275-3.225Q19.85 11.95 17.9 11.95q-1.95 0-3.225 1.275Q13.4 14.5 13.4 16.45q0 1.95 1.275 3.225Q15.95 20.95 17.9 20.95Zm0 16.05Zm0-20.55Z" />
    </svg>
  ),
  INTERNAL_APPLICATION: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-red-600"
    >
      <path d="M21.55 31.5q.05-3.6.825-5.25.775-1.65 2.925-3.6 2.1-1.9 3.225-3.525t1.125-3.475q0-2.25-1.5-3.75t-4.2-1.5q-2.6 0-4 1.475T17.9 14.95l-4.2-1.85q1.1-2.95 3.725-5.025T23.95 6q5 0 7.7 2.775t2.7 6.675q0 2.4-1.025 4.35-1.025 1.95-3.275 4.1-2.45 2.35-2.95 3.6t-.55 4Zm2.4 12.5q-1.45 0-2.475-1.025Q20.45 41.95 20.45 40.5q0-1.45 1.025-2.475Q22.5 37 23.95 37q1.45 0 2.475 1.025Q27.45 39.05 27.45 40.5q0 1.45-1.025 2.475Q25.4 44 23.95 44Z" />
    </svg>
  ),
  SYSTEM: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="m37.65 17.8-2.2-4.7-4.7-2.2 4.7-2.2 2.2-4.7 2.2 4.7 4.7 2.2-4.7 2.2Zm4.2 14.45-1.5-3.15-3.15-1.5 3.15-1.5 1.5-3.15 1.5 3.15 3.15 1.5-3.15 1.5ZM15.7 44l-.5-4.6q-.7-.1-1.45-.45t-1.3-.85l-3.9 1.65-4.4-7.2 3.8-2.5q-.25-.85-.25-1.5t.25-1.5l-3.8-2.5 4.4-7.2 3.9 1.65q.55-.5 1.3-.85t1.45-.45l.5-4.6h8.4l.5 4.6q.7.1 1.45.45t1.3.85l3.9-1.65 4.4 7.2-3.8 2.5q.25.85.25 1.5t-.25 1.5l3.8 2.5-4.4 7.2-3.9-1.65q-.55.5-1.3.85t-1.45.45l-.5 4.6Zm4.2-9.7q2.5 0 4.125-1.625t1.625-4.125q0-2.5-1.625-4.125T19.9 22.8q-2.5 0-4.125 1.625T14.15 28.55q0 2.5 1.625 4.125T19.9 34.3Zm0-3q-1.2 0-1.975-.775-.775-.775-.775-1.975 0-1.2.775-1.975.775-.775 1.975-.775 1.2 0 1.975.775.775.775.775 1.975 0 1.2-.775 1.975-.775.775-1.975.775ZM18.2 41h3.4l.4-3.8q1.45-.35 2.65-1t2.2-1.7l3.25 1.45 1.65-2.6-3.1-2.2q.55-1.25.55-2.6t-.55-2.6l3.1-2.2-1.65-2.6-3.25 1.45q-1-1.05-2.2-1.7-1.2-.65-2.65-1l-.4-3.8h-3.4l-.4 3.8q-1.45.35-2.65 1t-2.2 1.7L9.7 21.15l-1.65 2.6 3.1 2.2q-.55 1.25-.55 2.6t.55 2.6l-3.1 2.2 1.65 2.6 3.25-1.45q1 1.05 2.2 1.7 1.2.65 2.65 1Zm1.7-12.45Z" />
    </svg>
  ),
  HAS_UNREAD_URGENT_MESSAGES: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="M38 12.05q-2.3 0-3.9-1.6t-1.6-3.9q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6t1.6 3.9q0 2.3-1.6 3.9t-3.9 1.6ZM4 44V7q0-1.15.9-2.075Q5.8 4 7 4h21.85q-.2.7-.3 1.475-.1.775-.05 1.525.1 1.4.525 2.675.425 1.275 1.225 2.375H12v3h21.75q1 .5 2.05.75 1.05.25 2.2.25 1.65 0 3.175-.55T44 13.9V33q0 1.15-.925 2.075Q42.15 36 41 36H12Zm8-22.45h24v-3H12Zm0 6.5h15.65v-3H12Z" />
    </svg>
  ),
  BUG_HUNTER_LEVEL_2: (
    <Image
      src="https://i.imgur.com/iBK3a1Z.png"
      width={42}
      height={42}
      alt="BUG_HUNTER_LEVEL_2"
      draggable="false"
    />
  ),
  UNDERAGE_DELETED: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="M29.2 22.9q.95 0 1.6-.65.65-.65.65-1.6 0-.95-.65-1.6-.65-.65-1.6-.65-.95 0-1.6.65-.65.65-.65 1.6 0 .95.65 1.6.65.65 1.6.65Zm-10.45 0q.95 0 1.6-.65.65-.65.65-1.6 0-.95-.65-1.6-.65-.65-1.6-.65-.95 0-1.6.65-.65.65-.65 1.6 0 .95.65 1.6.65.65 1.6.65ZM24 33.7q2.7 0 5.05-1.45 2.35-1.45 3.65-4H15.3q1.3 2.55 3.65 4Q21.3 33.7 24 33.7Zm0 8.3q-3.7 0-6.975-1.425Q13.75 39.15 11.3 36.7q-2.45-2.45-3.875-5.725Q6 27.7 6 24q0-3.7 1.425-6.975Q8.85 13.75 11.3 11.3q2.45-2.45 5.725-3.875Q20.3 6 24 6q3.7 0 6.975 1.425Q34.25 8.85 36.7 11.3q2.45 2.45 3.875 5.725Q42 20.3 42 24q0 3.7-1.425 6.975Q39.15 34.25 36.7 36.7q-2.45 2.45-5.725 3.875Q27.7 42 24 42Zm.75-25.9q1.45 0 2.2-.425.75-.425.75-1.225 0-.45-.325-.725-.325-.275-.875-.275-.35 0-.75.075t-1 .075q-1.25 0-2.075-.825-.825-.825-.825-2.075 0-.5.075-1.025Q22 9.15 22.1 8.8q-.7.1-1.3.225-.6.125-1.3.375-.1.25-.125.625-.025.375-.025.675 0 2.3 1.55 3.85 1.55 1.55 3.85 1.55Z" />
    </svg>
  ),
  VERIFIED_BOT: (
    <Image
      src="https://i.imgur.com/Gs2JVkP.png"
      width={42}
      height={42}
      alt="VERIFIED_BOT"
      draggable="false"
    />
  ),
  VERIFIED_TRUE: (
    <Image
      src="https://i.imgur.com/XieNzv4.png"
      width={42}
      height={42}
      alt="VERIFIED_BOT_DEVELOPER"
      draggable="false"
    />
  ),
  VERIFIED_BOT_DEVELOPER: (
    <Image
      src="https://i.imgur.com/XieNzv4.png"
      width={42}
      height={42}
      alt="VERIFIED_BOT_DEVELOPER"
      draggable="false"
    />
  ),
  CERTIFIED_MODERATOR: (
    <Image
      src="https://i.imgur.com/E9hSIGm.png"
      width={42}
      height={42}
      alt="CERTIFIED_MODERATOR"
      draggable="false"
    />
  ),
  BOT_HTTP_INTERACTIONS: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-red-600"
    >
      <path d="M21.55 31.5q.05-3.6.825-5.25.775-1.65 2.925-3.6 2.1-1.9 3.225-3.525t1.125-3.475q0-2.25-1.5-3.75t-4.2-1.5q-2.6 0-4 1.475T17.9 14.95l-4.2-1.85q1.1-2.95 3.725-5.025T23.95 6q5 0 7.7 2.775t2.7 6.675q0 2.4-1.025 4.35-1.025 1.95-3.275 4.1-2.45 2.35-2.95 3.6t-.55 4Zm2.4 12.5q-1.45 0-2.475-1.025Q20.45 41.95 20.45 40.5q0-1.45 1.025-2.475Q22.5 37 23.95 37q1.45 0 2.475 1.025Q27.45 39.05 27.45 40.5q0 1.45-1.025 2.475Q25.4 44 23.95 44Z" />
    </svg>
  ),
  SPAMMER: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="M22.5 22.55h3V10h-3Zm1.5 7.1q.7 0 1.175-.475.475-.475.475-1.175 0-.7-.475-1.175Q24.7 26.35 24 26.35q-.7 0-1.175.475-.475.475-.475 1.175 0 .7.475 1.175.475.475 1.175.475ZM4 44V7q0-1.15.9-2.075Q5.8 4 7 4h34q1.15 0 2.075.925Q44 5.85 44 7v26q0 1.15-.925 2.075Q42.15 36 41 36H12Z" />
    </svg>
  ),
  DISABLE_PREMIUM: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="M24 24.85 41 14v-3L24 21.65 7 11v3ZM38.65 46q-3.9 0-6.625-2.7T29.3 36.7q0-3.9 2.725-6.65 2.725-2.75 6.625-2.75t6.625 2.75Q48 32.8 48 36.7q0 3.9-2.725 6.6Q42.55 46 38.65 46ZM33 37.5h11.3v-2H33ZM7 40q-1.2 0-2.1-.925Q4 38.15 4 37V11q0-1.15.9-2.075Q5.8 8 7 8h34q1.15 0 2.075.925Q44 9.85 44 11v14.55q-1.1-.55-2.6-.9t-2.75-.35q-2.6 0-4.85.975-2.25.975-3.925 2.675-1.675 1.7-2.625 4.025T26.3 37q0 .7.125 1.525T26.75 40Z" />
    </svg>
  ),
  PREMIUM_DISCRIMINATOR: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="m24 46-6.05-6.05H9q-1.2 0-2.1-.9-.9-.9-.9-2.1v-30q0-1.25.9-2.125T9 3.95h30q1.2 0 2.1.875.9.875.9 2.125v30q0 1.2-.9 2.1-.9.9-2.1.9h-8.95Zm.1-21.1q2.9 0 4.9-2 2-2 2-4.9 0-2.9-2-4.9-2-2-4.9-2-2.9 0-4.9 2-2 2-2 4.9 0 2.9 2 4.9 2 2 4.9 2ZM24 41.55l4.6-4.6H39v-1.9q-3-2.75-6.8-4.475-3.8-1.725-8.2-1.725-4.4 0-8.2 1.725Q12 32.3 9 35.05v1.9h10.4Z" />
    </svg>
  ),
  USED_DESKTOP_CLIENT: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="M16.75 44v-3h4.3v-5h-14q-1.2 0-2.1-.9-.9-.9-.9-2.1V9q0-1.2.9-2.1.9-.9 2.1-.9h34q1.2 0 2.1.9.9.9.9 2.1v24q0 1.2-.9 2.1-.9.9-2.1.9h-14v5h4.3v3Z" />
    </svg>
  ),
  USED_WEB_CLIENT: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="M7 40q-1.2 0-2.1-.9Q4 38.2 4 37V11q0-1.2.9-2.1Q5.8 8 7 8h34q1.2 0 2.1.9.9.9.9 2.1v26q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h34V15.2H7V37Z" />
    </svg>
  ),
  USED_MOBILE_CLIENT: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="M24 42.25q.65 0 1.075-.425.425-.425.425-1.075 0-.65-.425-1.075-.425-.425-1.075-.425-.65 0-1.075.425-.425.425-.425 1.075 0 .65.425 1.075.425.425 1.075.425ZM13 35.5h22v-26H13ZM13 46q-1.2 0-2.1-.9-.9-.9-.9-2.1V5q0-1.2.9-2.1.9-.9 2.1-.9h22q1.2 0 2.1.9.9.9.9 2.1v38q0 1.2-.9 2.1-.9.9-2.1.9Z" />
    </svg>
  ),
  DISABLED: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="m29.4 22.9-9.75-9.75q.85-.55 1.975-.95 1.125-.4 2.375-.4 2.9 0 4.875 1.975t1.975 4.875q0 1.25-.375 2.475T29.4 22.9ZM11.2 35.35q3.15-1.95 6.125-3.05Q20.3 31.2 24 31.2q1.85 0 3.525.275 1.675.275 2.825.675l-6.7-6.7q-2.8-.1-4.5-1.8-1.7-1.7-1.85-4.3l-6.4-6.4q-1.85 2.25-2.875 4.975Q7 20.65 7 24q0 3.05 1 5.85t3.2 5.5Zm26-.35q1.75-2.1 2.775-4.9Q41 27.3 41 24q0-7.6-4.7-12.3Q31.6 7 24 7q-3.5 0-6.2 1.05T13 10.8ZM24 44q-4.2 0-7.85-1.55Q12.5 40.9 9.8 38.2q-2.7-2.7-4.25-6.35Q4 28.2 4 24q0-4.2 1.55-7.85Q7.1 12.5 9.8 9.8q2.7-2.7 6.35-4.25Q19.8 4 24 4q4.2 0 7.85 1.55Q35.5 7.1 38.2 9.8q2.7 2.7 4.25 6.35Q44 19.8 44 24q0 4.2-1.55 7.85-1.55 3.65-4.25 6.35-2.7 2.7-6.35 4.25Q28.2 44 24 44Z" />
    </svg>
  ),
  VERIFIED_EMAIL: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="m21.8 30.2 11.4-11.4-2.1-2.05-9.15 9.15-5.05-5.05-2.2 2.2ZM24 43.95q-7-1.75-11.5-8.125T8 21.85V9.95l16-6 16 6v11.9q0 7.6-4.5 13.975T24 43.95Z" />
    </svg>
  ),
  QUARANTINED: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-blue-600"
    >
      <path d="M24 44q-6.9-1.6-11.45-7.825Q8 29.95 8 21.9V9.95l16-6 16 6v13.5q-1.25-.6-2.6-.925-1.35-.325-2.75-.325-5.15 0-8.775 3.65t-3.625 8.8q0 2.4.975 4.7.975 2.3 2.675 4-.45.25-.95.375-.5.125-.95.275Zm10.65 0q-3.9 0-6.65-2.775-2.75-2.775-2.75-6.575 0-3.9 2.75-6.675t6.65-2.775q3.85 0 6.625 2.775t2.775 6.675q0 3.8-2.775 6.575Q38.5 44 34.65 44Zm-.15-3.25q1.65 0 3-.7t2.3-2q-1.3-.7-2.6-1.05-1.3-.35-2.7-.35-1.4 0-2.725.35-1.325.35-2.575 1.05.95 1.3 2.275 2t3.025.7Zm.05-6.25q1.3 0 2.2-.95.9-.95.9-2.25t-.9-2.2q-.9-.9-2.2-.9-1.3 0-2.25.9t-.95 2.2q0 1.3.95 2.25t2.25.95Z" />
    </svg>
  ),
  nitro: (
    <Image
      src="https://i.imgur.com/LcyKRvv.png["
      width={42}
      height={42}
      alt="nitro"
      draggable="false"
    />
  ),
  nitro_until: (
    <Image
      src="https://i.imgur.com/LcyKRvv.png["
      width={42}
      height={42}
      alt="nitro"
      draggable="false"
    />
  ),
};

function makeData(data) {
  const day = new Array(24).fill(0).map((v, i) => v + i);
  const data_day = data.map((v, i) => [day[i], v]);
  return data_day;
}
export default function Data(props) {
  const [topDMs, setTopDMs] = useState([]);
  const [topChannels, setTopChannels] = useState([]);
  const [generate_, setGenerate_] = useState(false);
  const [data, setData] = useState(props.data);

  return data ? (
    <div className="h-screen">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex items-center mx-10 mt-4">
        {!data.dataFile ? (
          <Tippy
            content={
              <>
                <div className="text-white text-lg font-bold">Why Export?</div>
                <p className="text-white text-lg ">
                  Exporting is used to share your data with others, select the
                  options you want to show, click the button to download the
                  JSON file, and share the file with your friend. When reached,
                  your friend can visit our website and directly upload the file
                  they downloaded to view your data!
                </p>
                <div className="flex items-center">
                  <svg
                    className="fill-red-400 mr-2 basis-[30%]"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    width="24"
                  >
                    <path d="M.275 21.425 12 1.15l11.725 20.275ZM12 17.925q.45 0 .788-.338.337-.337.337-.787t-.337-.775Q12.45 15.7 12 15.7t-.787.325q-.338.325-.338.775t.338.787q.337.338.787.338ZM11 15h2v-4.725h-2Z" />
                  </svg>
                  <b className="text-red-400 text-lg pt-1 ">
                    Do not share your data with people you don&apos;t trust. We
                    are not responsible for any data you share.
                  </b>
                </div>
              </>
            }
            animation="scale"
            className="shadow-xl"
          >
            <div
              onClick={() => {
                const data_d = data;
                data_d.dataFile = true;
                data_d.fakeInfo = false;
                const blob = new Blob([JSON.stringify(data_d)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "data.json";
                link.click();
                setTimeout(() => {
                  URL.revokeObjectURL(url);
                }, 100);
              }}
              className="button-green text-gray-200 flex items-center gap-1 h-[90px] mr-2"
            >
              <svg
                className="fill-white cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
              >
                <path d="M5.5 21.6q-1.325 0-2.237-.912-.913-.913-.913-2.238v-4.525H5.5v4.525h12.95v-4.525h3.15v4.525q0 1.325-.912 2.238-.913.912-2.238.912Zm6.5-6.3L5.8 9.125 8.025 6.9l2.4 2.425V1.65h3.15v7.675l2.4-2.425L18.2 9.125Z" />
              </svg>
              <p> Export Data</p>
            </div>
          </Tippy>
        ) : (
          <span className="dark:text-white text-gray-900">
            You are viewing <b>{data?.user?.username}</b>&apos;s data
          </span>
        )}
        {data?.fakeInfo ? (
          <>
            {generate_ ? (
              <Tippy
                content={"Generating..."}
                animation="scale"
                className="shadow-xl"
              >
                <div className="opacity-60 cursor-not-allowed button-green text-gray-200 flex items-center gap-1 h-[90px] ml-2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    width="24"
                    className="fill-white cursor-pointer"
                  >
                    <path d="M11.9 20.85q-3.675 0-6.262-2.588Q3.05 15.675 3.05 12q0-3.675 2.588-6.263Q8.225 3.15 11.9 3.15q1.95 0 3.688.787 1.737.788 2.962 2.288V3.15h2.4v8.225H12.7V9h4.05q-.8-1.25-2.075-1.975Q13.4 6.3 11.9 6.3q-2.375 0-4.037 1.663Q6.2 9.625 6.2 12t1.663 4.038Q9.525 17.7 11.9 17.7q1.775 0 3.238-1.025Q16.6 15.65 17.25 14h3.275q-.725 3-3.125 4.925-2.4 1.925-5.5 1.925Z" />
                  </svg>

                  <p> Regenerate Data</p>
                </div>
              </Tippy>
            ) : (
              <Tippy
                content={
                  <>
                    <div className="text-white text-lg font-bold">
                      Regenerate Data
                    </div>
                    <p className="text-white text-lg ">
                      Regenerating your data will generate a new set of data,
                      allowing you to see a demonstration without using your
                      data but fake data.
                    </p>
                    <div className="flex items-center">
                      <svg
                        className="fill-red-400 mr-2 basis-[20%]"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                      >
                        <path d="M.275 21.425 12 1.15l11.725 20.275ZM12 17.925q.45 0 .788-.338.337-.337.337-.787t-.337-.775Q12.45 15.7 12 15.7t-.787.325q-.338.325-.338.775t.338.787q.337.338.787.338ZM11 15h2v-4.725h-2Z" />
                      </svg>
                      <b className="text-red-400 text-lg pt-1 ">
                        The data you see is totally fake and generated using our
                        algorythm, not stolen by anyone.
                      </b>
                    </div>
                  </>
                }
                animation="scale"
                className="shadow-xl"
              >
                <div
                  onClick={() => {
                    setGenerate_(true);
                    const data___ = Utils.generateRandomData();
                    setData(data___);
                    setGenerate_(false);
                  }}
                  className="button-green text-gray-200 flex items-center gap-1 h-[90px] ml-2 "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    width="24"
                    className="fill-white cursor-pointer"
                  >
                    <path d="M11.9 20.85q-3.675 0-6.262-2.588Q3.05 15.675 3.05 12q0-3.675 2.588-6.263Q8.225 3.15 11.9 3.15q1.95 0 3.688.787 1.737.788 2.962 2.288V3.15h2.4v8.225H12.7V9h4.05q-.8-1.25-2.075-1.975Q13.4 6.3 11.9 6.3q-2.375 0-4.037 1.663Q6.2 9.625 6.2 12t1.663 4.038Q9.525 17.7 11.9 17.7q1.775 0 3.238-1.025Q16.6 15.65 17.25 14h3.275q-.725 3-3.125 4.925-2.4 1.925-5.5 1.925Z" />
                  </svg>

                  <p> Regenerate Data</p>
                </div>
              </Tippy>
            )}
          </>
        ) : (
          ""
        )}
        <Settings />
      </div>
      <div className="mx-10 mt-4 px-4 py-2 bg-gray-300 dark:bg-[#2b2d31]  animate__delay-1s rounded-lg">
        <div className="flex items-center space-x-4 ">
          <div
            onClick={(element) => {
              const check = hasClass(element.target, "animate__animated");

              if (check) {
                element.target.classList.remove(
                  "animate__animated",
                  "animate__flash",
                  "animate__headShake"
                );

                setTimeout(() => {
                  element.target.classList.add(
                    "animate__animated",
                    "animate__flash",
                    "animate__headShake"
                  );
                }, 100);
              } else {
                element.target.classList.add(
                  "animate__animated",
                  "animate__flash",
                  "animate__headShake"
                );
              }
            }}
          >
            <div className="p-1 rounded-full flex items-center justify-center ring-2  dark:ring-gray-500 ring-gray-800 hover:dark:ring-gray-600 hover:ring-gray-900 cursor-pointer">
              <Image
                className="w-10 h-10 rounded-full opacity-90 hover:opacity-100"
                src={
                  data?.user?.avatar
                    ? !data?.user?.avatar.includes(
                        "https://better-default-discord.netlify.app/Icons"
                      )
                      ? "https://cdn.discordapp.com/avatars/" +
                        data.user.id +
                        "/" +
                        data.user.avatar +
                        ".webp?size=1024"
                      : data.user.avatar
                    : "https://cdn.discordapp.com/embed/avatars/" +
                      Math.floor(Math.random() * 5) +
                      ".png"
                }
                alt="avatar"
                height={100}
                width={100}
                draggable={false}
              />
            </div>
          </div>
          <div
            className="space-y-1 font-medium text-gray-900 dark:text-white text-3xl uppercase  w-full"
            style={{
              fontFamily:
                "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",

              letterSpacing: "0.06em",
            }}
          >
            <div>
              <div className="flex items-center text-gray-900 dark:text-white">
                {data?.user?.username}#{data?.user?.discriminator}
                {data?.messages?.characterCount &&
                data?.messages?.messageCount ? (
                  <Tippy
                    content={
                      data.messages.characterCount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                      " Characters & " +
                      data.messages.messageCount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                      " Messages"
                    }
                    animation="scale"
                    className="shadow-xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                      width="24"
                    >
                      <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                    </svg>
                  </Tippy>
                ) : (
                  ""
                )}
                {data?.messages?.favoriteWords &&
                data?.messages?.favoriteWords.length > 0 ? (
                  <Tippy
                    content={`${
                      data.messages.favoriteWords.length
                    } Favorite Word${
                      data.messages.favoriteWords.length > 1 ? "s" : ""
                    }`}
                    animation="scale"
                    className="shadow-xl"
                  >
                    <svg
                      onClick={() => {
                        toast(
                          <div className="Toastify__toast-body_">
                            <span className="font-bold text-lg text-black dark:text-white">
                              {data?.dataFile ? "Their" : "Your"}{" "}
                              {data.messages.favoriteWords.length < 10
                                ? "Top 10"
                                : `${data.messages.favoriteWords.length}`}{" "}
                              Favorite Word
                              {data.messages.favoriteWords.length === 1
                                ? " is"
                                : "s are"}
                              :
                            </span>
                            <br />
                            <ul className="list-disc ml-4">
                              {data.messages.favoriteWords.map((f, i) => {
                                return (
                                  <li key={i}>
                                    {f.word}: {f.count} times
                                  </li>
                                );
                              })}
                            </ul>
                          </div>,
                          {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          }
                        );
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                    >
                      <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                    </svg>
                  </Tippy>
                ) : (
                  ""
                )}
                {data?.messages?.topCursed &&
                data?.messages?.topCursed?.length > 0 ? (
                  <Tippy
                    content={
                      data.messages.topCursed.length
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                      " Curse Word" +
                      (data.messages.topCursed.length > 1 ? "s" : "")
                    }
                    animation="scale"
                    className="shadow-xl"
                  >
                    <svg
                      onClick={() => {
                        toast(
                          <div className="Toastify__toast-body_">
                            <span className="font-bold text-lg text-black dark:text-white">
                              {data?.dataFile ? "Their" : "Your"}{" "}
                              {data.messages.topCursed.length < 10
                                ? "Top 10"
                                : `${data.messages.topCursed.length}`}{" "}
                              Curse Word
                              {data.messages.topCursed.length === 1
                                ? " is"
                                : "s are"}
                              :
                            </span>
                            <br />
                            <ul className="list-disc ml-4">
                              {data.messages.topCursed.map((f, i) => {
                                return (
                                  <li key={i}>
                                    {f.word}: {f.count} times
                                  </li>
                                );
                              })}
                            </ul>
                          </div>,
                          {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          }
                        );
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                    >
                      <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                    </svg>
                  </Tippy>
                ) : (
                  ""
                )}
                {data?.messages?.topLinks &&
                data?.messages?.topLinks?.length > 0 ? (
                  <Tippy
                    content={data.messages.topLinks.length + " Links"}
                    animation="scale"
                    className="shadow-xl"
                  >
                    <svg
                      onClick={() => {
                        toast(
                          <div className="Toastify__toast-body_">
                            <span className="font-bold text-lg text-black dark:text-white">
                              {data?.dataFile ? "Their" : "Your"}{" "}
                              {data.messages.topLinks.length < 10
                                ? "Top 10"
                                : `${data.messages.topLinks.length}`}{" "}
                              Favorite Link
                              {data.messages.topLinks.length === 1
                                ? " is"
                                : "s are"}
                              :
                            </span>
                            <br />
                            <ul className="list-disc ml-4">
                              {data.messages.topLinks.map((f, i) => {
                                return (
                                  <li key={i}>
                                    {f.word}: {f.count} times
                                  </li>
                                );
                              })}
                            </ul>
                          </div>,
                          {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          }
                        );
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                    >
                      <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                    </svg>
                  </Tippy>
                ) : (
                  ""
                )}
                {data?.messages?.topDiscordLinks &&
                data?.messages?.topDiscordLinks?.length > 0 ? (
                  <Tippy
                    content={
                      data.messages.topDiscordLinks.length + " Discord Links"
                    }
                    animation="scale"
                    className="shadow-xl"
                  >
                    <svg
                      onClick={() => {
                        toast(
                          <div className="Toastify__toast-body_">
                            <span className="font-bold text-lg text-black dark:text-white">
                              {data?.dataFile ? "Their" : "Your"}{" "}
                              {data.messages.topDiscordLinks.length < 10
                                ? "Top 10"
                                : `${data.messages.topDiscordLinks.length}`}{" "}
                              Discord Link
                              {data.messages.topDiscordLinks.length === 1
                                ? " is"
                                : "s are"}
                              :
                            </span>
                            <br />
                            <ul className="list-disc ml-4">
                              {data.messages.topDiscordLinks.map((f, i) => {
                                return (
                                  <li key={i}>
                                    {f.word}: {f.count} times
                                  </li>
                                );
                              })}
                            </ul>
                          </div>,
                          {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          }
                        );
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                    >
                      <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                    </svg>
                  </Tippy>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {data?.user?.badges?.map((m, id) => {
                return (
                  <Tippy
                    key={id}
                    content={Badges[m].description
                      .replace(
                        /{until}/g,
                        moment(data?.user?.premium_until).format("MMMM Do YYYY")
                      )
                      .replace(/{p_2}/g, data?.dataFile ? "Their" : "Your")
                      .replace(/{p_1}/g, data?.dataFile ? "They" : "You")}
                    animation="scale"
                    className="shadow-xl"
                  >
                    <div className="flex cursor-pointer opacity-90 hover:opacity-100">
                      {icons[m]}
                    </div>
                  </Tippy>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:grid grid-rows-2 grid-flow-col gap-4 mx-10 mt-4">
        <div className="px-4 py-2 mb-2 lg:mb-0 bg-gray-300 dark:bg-[#2b2d31]  animate__delay-1s rounded-lg row-span-3 flex items-center justify-center ">
          <div className="mr-14">
            <div className="text-gray-900 dark:text-white max-w-sm font-bold text-5xl">
              {data?.dataFile ? "Their" : "Your"}
              <br />
              Favorite
              <br />
              Emojis
            </div>
          </div>{" "}
          {!data?.settings?.recentEmojis ? (
            <span className="text-gray-900 dark:text-white text-lg font-bold w-full">
              No Emojis Found or {data?.dataFile ? "they " : "you "}disabled
              that option
            </span>
          ) : (
            ""
          )}
          <div className="grid grid-cols-10 justify-items-center ">
            {data?.settings?.recentEmojis
              .slice(0, 30)
              .sort((a, b) => {
                if (!a?.count || !b?.count) return;
                return b.count - a.count;
              })
              .map((m, id) => {
                if (!m.name) return;
                if (!m.count) return;
                const isCustomEmoji = !isNaN(m.name) && m.name.length > 7;

                if (isCustomEmoji) {
                  return (
                    <Tippy
                      key={id}
                      content={`used ${m.count} time${
                        m.count === 1 ? "" : "s"
                      }`}
                      animation="scale"
                      className="shadow-xl"
                    >
                      <div className="cursor-pointer text-5xl opacity-90 hover:opacity-100">
                        <Image
                          key={id}
                          src={
                            "https://cdn.discordapp.com/emojis/" +
                            m.name +
                            ".png"
                          }
                          alt="emoji"
                          height="50px"
                          width="50px"
                          draggable={false}
                        />
                      </div>
                    </Tippy>
                  );
                } else {
                  return (
                    <Tippy
                      key={id}
                      content={`:${m.name}: used ${m.count} time${
                        m.count === 1 ? "" : "s"
                      }`}
                      animation="scale"
                      className="shadow-xl"
                    >
                      <div className="cursor-pointer text-5xl opacity-90 hover:opacity-100">
                        {emojis[m.name] ? emojis[m.name] : m.name}
                      </div>
                    </Tippy>
                  );
                }
              })}
          </div>
        </div>
        <div className="px-4 lg:mt-0 mt-4 py-2 bg-gray-300 dark:bg-[#2b2d31]  animate__delay-1s rounded-lg col-span-2">
          {data?.settings?.appearance?.theme ||
          data?.settings?.appearance?.developerMode ||
          data?.settings?.folderCount ||
          data?.guilds ? (
            <ul className="text-gray-900 dark:text-white text-xl font-bold list-disc mt-2 ml-6">
              {data?.settings?.appearance?.theme ? (
                <li>
                  {data?.dataFile ? "They " : "You "}prefer discord{" "}
                  {data.settings.appearance.theme.toLowerCase()} mode
                </li>
              ) : (
                ""
              )}
              {data?.settings?.appearance?.developerMode ? (
                <li>
                  {data?.dataFile ? "They " : "You "}are using Discord developer
                  mode
                </li>
              ) : (
                ""
              )}

              {data?.settings?.folderCount && data?.guilds ? (
                <li>
                  <div className="inline-flex">
                    {data?.dataFile ? "They " : "You "}are in
                    <p className="mx-1 font-extrabold text-blue-500">
                      <CountUp
                        start={0}
                        delay={2}
                        end={data.guilds}
                        separator=","
                        useGrouping={true}
                      />
                    </p>
                    guilds with{" "}
                    <p className="mx-1 font-extrabold text-blue-500">
                      <CountUp
                        start={0}
                        delay={2}
                        end={data.settings.folderCount}
                        separator=","
                        useGrouping={true}
                      />
                    </p>{" "}
                    folders
                  </div>
                </li>
              ) : (
                <>
                  {data?.settings?.folderCount && !data?.guilds ? (
                    <li>
                      <div className="inline-flex">
                        {data?.dataFile ? "They " : "You "}have
                        <p className="mx-1 font-extrabold text-blue-500">
                          <CountUp
                            end={data.settings.folderCount}
                            separator=","
                            useGrouping={true}
                            start={0}
                            delay={2}
                          />
                        </p>
                        folders
                      </div>
                    </li>
                  ) : (
                    <>
                      {!data?.settings?.folderCount && data?.guilds ? (
                        <li>
                          <div className="inline-flex">
                            {data?.dataFile ? "They " : "You "}are in{" "}
                            <p className="mx-1 font-extrabold text-blue-500">
                              <CountUp
                                end={data.guilds}
                                separator=","
                                useGrouping={true}
                                start={0}
                                delay={2}
                              />
                            </p>{" "}
                            guilds
                          </div>
                        </li>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </>
              )}
            </ul>
          ) : (
            <div className="justify-items-center">
              <div className="text-gray-900 dark:text-white text-xl font-bold ">
                {data?.dataFile ? "They " : "You "}disabled these Options
              </div>
            </div>
          )}
        </div>{" "}
        <div className="lg:mt-0 mt-4 px-4 py-2 bg-gray-300 dark:bg-[#2b2d31]  animate__delay-1s rounded-lg row-span-2 col-span-2 ">
          <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2 flex items-center">
            {data?.dataFile ? "Their" : "Your"} Connections{" "}
            <Tippy
              content={
                <>
                  <div className="text-white text-xl font-bold">
                    What are connections?
                  </div>
                  <p className="text-white text-lg ">
                    Connections are the accounts{" "}
                    {data?.dataFile ? "they " : "you "}have connected to{" "}
                    {data?.dataFile ? "their" : "your"}
                    Discord Account.
                  </p>
                </>
              }
              animation="scale"
              className="shadow-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                className="cursor-pointer fill-black dark:fill-white ml-2 opacity-90 hover:opacity-100"
              >
                <path d="M10.625 17.375h2.75V11h-2.75ZM12 9.5q.65 0 1.075-.438Q13.5 8.625 13.5 8q0-.65-.425-1.075Q12.65 6.5 12 6.5q-.625 0-1.062.425Q10.5 7.35 10.5 8q0 .625.438 1.062.437.438 1.062.438Zm0 13.35q-2.275 0-4.25-.85t-3.438-2.312Q2.85 18.225 2 16.25q-.85-1.975-.85-4.25T2 7.75q.85-1.975 2.312-3.438Q5.775 2.85 7.75 2q1.975-.85 4.25-.85t4.25.85q1.975.85 3.438 2.312Q21.15 5.775 22 7.75q.85 1.975.85 4.25T22 16.25q-.85 1.975-2.312 3.438Q18.225 21.15 16.25 22q-1.975.85-4.25.85Z" />
              </svg>
            </Tippy>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-900 dark:text-white font-bold">
              {!data?.connections
                ? `${data?.dataFile ? "They " : "You "} have no connections`
                : ""}
            </span>
            {data?.connections?.map((m, i) => {
              const obj = {
                youtube: (
                  <svg
                    className="w-10 h-10"
                    version="1.1"
                    id="Layer_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 461.001 461.001"
                    style={{
                      enableBackground: "new 0 0 461.001 461.001",
                    }}
                  >
                    <g>
                      <path
                        style={{
                          fill: "#F61C0D",
                        }}
                        d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728
		c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137
		C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607
		c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"
                      />
                    </g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                  </svg>
                ),
                xbox: (
                  <svg
                    className="w-10 h-10 fill-black dark:fill-white"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m24 12c0-.001 0-.001 0-.002 0-3.618-1.606-6.861-4.144-9.054l-.015-.013c-1.91 1.023-3.548 2.261-4.967 3.713l-.004.004c.044.046.087.085.131.132 3.719 4.012 7.106 9.73 6.546 12.471 1.53-1.985 2.452-4.508 2.452-7.246 0-.002 0-.004 0-.006z" />
                    <path d="m12.591 3.955c1.68-1.104 3.699-1.833 5.872-2.022l.048-.003c-1.837-1.21-4.09-1.929-6.511-1.929-2.171 0-4.207.579-5.962 1.591l.058-.031c.658.567 2.837.781 5.484 2.4.143.089.316.142.502.142.189 0 .365-.055.513-.149l-.004.002z" />
                    <path d="m9.166 6.778c.046-.049.093-.09.138-.138-1.17-1.134-2.446-2.174-3.806-3.1l-.099-.064c-.302-.221-.681-.354-1.091-.354-.146 0-.288.017-.425.049l.013-.002c-2.398 2.198-3.896 5.344-3.896 8.84 0 2.909 1.037 5.576 2.762 7.651l-.016-.02c-1.031-2.547 2.477-8.672 6.419-12.862z" />
                    <path d="m12.084 9.198c-3.962 3.503-9.477 8.73-8.632 11.218 2.174 2.213 5.198 3.584 8.542 3.584 3.493 0 6.637-1.496 8.826-3.883l.008-.009c.486-2.618-4.755-7.337-8.744-10.91z" />
                  </svg>
                ),
                twitter: (
                  <svg
                    className="w-10 h-10"
                    version="1.1"
                    id="Layer_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 512.002 512.002"
                    style={{
                      enableBackground: "new 0 0 512.002 512.002",
                    }}
                  >
                    <path
                      style={{
                        fill: "#73A1FB",
                      }}
                      d="M500.398,94.784c-8.043,3.567-16.313,6.578-24.763,9.023c10.004-11.314,17.631-24.626,22.287-39.193
	c1.044-3.265-0.038-6.839-2.722-8.975c-2.681-2.137-6.405-2.393-9.356-0.644c-17.945,10.643-37.305,18.292-57.605,22.764
	c-20.449-19.981-48.222-31.353-76.934-31.353c-60.606,0-109.913,49.306-109.913,109.91c0,4.773,0.302,9.52,0.9,14.201
	c-75.206-6.603-145.124-43.568-193.136-102.463c-1.711-2.099-4.347-3.231-7.046-3.014c-2.7,0.211-5.127,1.734-6.491,4.075
	c-9.738,16.709-14.886,35.82-14.886,55.265c0,26.484,9.455,51.611,26.158,71.246c-5.079-1.759-10.007-3.957-14.711-6.568
	c-2.525-1.406-5.607-1.384-8.116,0.054c-2.51,1.439-4.084,4.084-4.151,6.976c-0.012,0.487-0.012,0.974-0.012,1.468
	c0,39.531,21.276,75.122,53.805,94.52c-2.795-0.279-5.587-0.684-8.362-1.214c-2.861-0.547-5.802,0.456-7.731,2.638
	c-1.932,2.18-2.572,5.219-1.681,7.994c12.04,37.591,43.039,65.24,80.514,73.67c-31.082,19.468-66.626,29.665-103.939,29.665
	c-7.786,0-15.616-0.457-23.279-1.364c-3.807-0.453-7.447,1.795-8.744,5.416c-1.297,3.622,0.078,7.66,3.316,9.736
	c47.935,30.735,103.361,46.98,160.284,46.98c111.903,0,181.907-52.769,220.926-97.037c48.657-55.199,76.562-128.261,76.562-200.451
	c0-3.016-0.046-6.061-0.139-9.097c19.197-14.463,35.724-31.967,49.173-52.085c2.043-3.055,1.822-7.094-0.545-9.906
	C507.7,94.204,503.76,93.294,500.398,94.784z"
                    />
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                  </svg>
                ),
                twitch: (
                  <svg
                    className="w-10 h-10 fill-blue-700"
                    width="32px"
                    height="32px"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.787 0l-2.089 5.568v22.255h7.652v4.177h4.177l4.167-4.177h6.26l8.349-8.344v-19.479zM5.568 2.781h22.953v15.301l-4.871 4.871h-7.651l-4.172 4.172v-4.172h-6.26zM13.219 16.697h2.781v-8.348h-2.781zM20.864 16.697h2.781v-8.348h-2.781z" />
                  </svg>
                ),
                steam: (
                  <svg
                    className="w-10 h-10 fill-black dark:fill-white"
                    width="32px"
                    height="32px"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15.974 0c-8.401 0-15.292 6.479-15.943 14.714l8.573 3.547c0.729-0.495 1.604-0.786 2.552-0.786 0.083 0 0.167 0.005 0.25 0.005l3.813-5.521v-0.078c0-3.328 2.703-6.031 6.031-6.031s6.036 2.708 6.036 6.036c0 3.328-2.708 6.031-6.036 6.031h-0.135l-5.438 3.88c0 0.073 0.005 0.141 0.005 0.214 0 2.5-2.021 4.526-4.521 4.526-2.177 0-4.021-1.563-4.443-3.635l-6.135-2.542c1.901 6.719 8.063 11.641 15.391 11.641 8.833 0 15.995-7.161 15.995-16s-7.161-16-15.995-16zM10.052 24.281l-1.964-0.813c0.349 0.724 0.953 1.328 1.755 1.667 1.729 0.719 3.724-0.104 4.443-1.833 0.349-0.844 0.349-1.76 0.005-2.599-0.344-0.844-1-1.495-1.839-1.844-0.828-0.349-1.719-0.333-2.5-0.042l2.026 0.839c1.276 0.536 1.88 2 1.349 3.276s-2 1.88-3.276 1.349zM25.271 11.875c0-2.214-1.802-4.021-4.016-4.021-2.224 0-4.021 1.807-4.021 4.021 0 2.219 1.797 4.021 4.021 4.021 2.214 0 4.016-1.802 4.016-4.021zM18.245 11.87c0-1.672 1.349-3.021 3.016-3.021s3.026 1.349 3.026 3.021c0 1.667-1.359 3.021-3.026 3.021s-3.016-1.354-3.016-3.021z" />
                  </svg>
                ),
                spotify: (
                  <svg
                    className="w-10 h-10"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#1ED760"
                      fillRule="evenodd"
                      d="M19.0983701,10.6382791 C15.230178,8.34118115 8.85003755,8.12986439 5.15729493,9.25058527 C4.56433588,9.43062856 3.93727638,9.09580812 3.75758647,8.50284907 C3.57789655,7.90953664 3.91236362,7.28283051 4.50585273,7.10261054 C8.74455585,5.81598127 15.7909802,6.06440214 20.2440037,8.70780512 C20.7774195,9.02442687 20.9525156,9.71332656 20.6362472,10.2456822 C20.3198021,10.779098 19.6305491,10.9549008 19.0983701,10.6382791 M18.971686,14.0407262 C18.7004726,14.4810283 18.1246521,14.6190203 17.6848801,14.3486903 C14.4600027,12.3664473 9.54264764,11.792217 5.72728477,12.9503953 C5.23256328,13.0998719 4.70992535,12.8208843 4.55974204,12.3270462 C4.41061884,11.8323247 4.68978312,11.3107469 5.18362118,11.1602103 C9.5419409,9.83771368 14.9600247,10.4782013 18.6638986,12.7544503 C19.1036707,13.0253103 19.242016,13.6013075 18.971686,14.0407262 M17.5034233,17.308185 C17.2876894,17.6617342 16.827245,17.7725165 16.4749326,17.5571359 C13.6571403,15.8347984 10.1101639,15.4459119 5.93312425,16.4000177 C5.53063298,16.4922479 5.12937851,16.2399399 5.03767834,15.8376253 C4.94544812,15.4351341 5.19669597,15.0338796 5.60024736,14.9420027 C10.1712973,13.8970803 14.0923186,14.3467468 17.2551791,16.2796943 C17.6078449,16.4948982 17.7189805,16.9556959 17.5034233,17.308185 M12,0 C5.37267547,0 0,5.37249879 0,11.9998233 C0,18.6278546 5.37267547,24 12,24 C18.6275012,24 24,18.6278546 24,11.9998233 C24,5.37249879 18.6275012,0 12,0"
                    />
                  </svg>
                ),
                reddit: (
                  <svg
                    className="w-10 h-10"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Reddit"
                    role="img"
                    viewBox="0 0 512 512"
                  >
                    <rect width="512" height="512" rx="15%" fill="#f40" />
                    <g fill="#fff">
                      <ellipse cx="256" cy="307" rx="166" ry="117" />
                      <circle cx="106" cy="256" r="42" />
                      <circle cx="407" cy="256" r="42" />
                      <circle cx="375" cy="114" r="32" />
                    </g>
                    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
                      <path
                        d="m256 196 23-101 73 15"
                        stroke="#fff"
                        strokeWidth="16"
                      />
                      <path
                        d="m191 359c33 25 97 26 130 0"
                        stroke="#f40"
                        strokeWidth="13"
                      />
                    </g>
                    <g fill="#f40">
                      <circle cx="191" cy="287" r="31" />
                      <circle cx="321" cy="287" r="31" />
                    </g>
                  </svg>
                ),
                playstation: (
                  <svg
                    className="w-10 h-10 fill-black dark:fill-white"
                    version="1.1"
                    fill="#fff"
                    id="Capa_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 106.726 106.726"
                  >
                    <g>
                      <g>
                        <path
                          d="M11.703,67.563l-3.6,1.4c-5.4,2.3-8.2,4.7-8.1,6.8c0.3,3.1,3.8,5.4,10.2,7.1
			c8.3,2.2,16.7,2.7,25.4,1.4v-8.7l0,0l-6.9,2.6c-7.2,2.5-10.9,0.4-10.9,0.4c-1.1-0.7-1.6-2.4,1.4-3.5l3.8-1.4l12.6-4.5v-10.1
			l-3.2,1.1L11.703,67.563z"
                        />
                        <path
                          d="M64.303,32.463v25.9c5.4,2.6,10.2,2.8,13.8,0.1c3.7-2.6,5.7-7.1,5.7-13.9c0-7.1-1.4-12.5-4.5-16.1
			c-2.8-3.8-7.8-7-15.2-9.5c-9.2-3-17-5.6-23.2-6.9v77.5l16.7,5.1v-64.4C57.503,26.363,64.303,26.663,64.303,32.463z"
                        />
                        <path
                          d="M106.703,72.463c-0.1-2.7-3.3-4.8-9-6.7c-6.4-2.1-11.9-3.1-17.9-2.9c-5.5,0.1-12.1,1.9-18,3.8v9.9
			l16.2-5.7c0,0,4.9-1.8,9.1-0.7c3.2,0.8,3,2.6-0.2,3.7l-3.7,1.5l-21.4,7.7v10.1l10-3.6l24-8.5l2.8-1.3
			C104.403,77.663,107.003,75.363,106.703,72.463z"
                        />
                      </g>
                    </g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                  </svg>
                ),
                github: (
                  <svg
                    className="w-10 h-10 fill-black dark:fill-white"
                    width="32px"
                    height="32px"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z" />
                  </svg>
                ),
                facebook: (
                  <svg
                    className="w-10 h-10"
                    version="1.1"
                    id="Capa_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 455.73 455.73"
                    style={{
                      enableBackground: "new 0 0 455.73 455.73",
                    }}
                  >
                    <path
                      style={{
                        fill: "#3A559F",
                      }}
                      d="M0,0v455.73h242.704V279.691h-59.33v-71.864h59.33v-60.353c0-43.893,35.582-79.475,79.475-79.475
	h62.025v64.622h-44.382c-13.947,0-25.254,11.307-25.254,25.254v49.953h68.521l-9.47,71.864h-59.051V455.73H455.73V0H0z"
                    />
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                  </svg>
                ),
                epicgames: (
                  <svg
                    className="w-10 h-10 fill-black dark:fill-white"
                    width="32px"
                    height="32px"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4.719 0c-1.833 0-2.505 0.677-2.505 2.505v22.083c0 0.209 0.011 0.401 0.027 0.579 0.047 0.401 0.047 0.792 0.421 1.229 0.036 0.052 0.412 0.328 0.412 0.328 0.203 0.099 0.343 0.172 0.572 0.265l11.115 4.656c0.573 0.261 0.819 0.371 1.235 0.355h0.005c0.421 0.016 0.667-0.093 1.24-0.355l11.109-4.656c0.235-0.093 0.369-0.167 0.577-0.265 0 0 0.376-0.287 0.412-0.328 0.375-0.437 0.375-0.828 0.421-1.229 0.016-0.177 0.027-0.369 0.027-0.573v-22.088c0-1.828-0.677-2.505-2.505-2.505zM22.527 4.145h0.905c1.511 0 2.251 0.735 2.251 2.267v2.505h-1.833v-2.407c0-0.489-0.224-0.713-0.699-0.713h-0.312c-0.489 0-0.713 0.224-0.713 0.713v7.749c0 0.489 0.224 0.713 0.713 0.713h0.349c0.468 0 0.692-0.224 0.692-0.713v-2.771h1.833v2.86c0 1.525-0.749 2.276-2.265 2.276h-0.921c-1.521 0-2.267-0.756-2.267-2.276v-7.923c0-1.525 0.745-2.281 2.267-2.281zM6.276 4.251h4.151v1.703h-2.287v3.468h2.204v1.699h-2.204v3.697h2.319v1.704h-4.183zM11.364 4.251h2.928c1.515 0 2.265 0.755 2.265 2.28v3.261c0 1.525-0.751 2.276-2.265 2.276h-1.057v4.453h-1.871zM17.401 4.251h1.864v12.271h-1.864zM13.229 5.901v4.52h0.771c0.469 0 0.693-0.228 0.693-0.719v-3.083c0-0.489-0.224-0.719-0.693-0.719zM8.088 19.437h0.276l0.063 0.011h0.1l0.052 0.016h0.052l0.047 0.015 0.052 0.011 0.041 0.011 0.093 0.021 0.053 0.015 0.036 0.011 0.041 0.016 0.052 0.016 0.036 0.015 0.053 0.021 0.047 0.021 0.041 0.025 0.047 0.021 0.036 0.025 0.053 0.027 0.041 0.025 0.041 0.021 0.041 0.031 0.043 0.027 0.036 0.031 0.125 0.095-0.032 0.041-0.036 0.036-0.032 0.037-0.036 0.041-0.025 0.036-0.032 0.037-0.036 0.036-0.032 0.041-0.025 0.036-0.037 0.043-0.031 0.036-0.036 0.041-0.032 0.037-0.025 0.041-0.037 0.036-0.031 0.043-0.036 0.036-0.032 0.036-0.036-0.025-0.041-0.037-0.043-0.025-0.077-0.052-0.047-0.027-0.043-0.025-0.047-0.027-0.036-0.021-0.041-0.020-0.084-0.032-0.052-0.009-0.041-0.011-0.047-0.011-0.053-0.011-0.052-0.005h-0.052l-0.061-0.011h-0.1l-0.052 0.005h-0.052l-0.052 0.016-0.041 0.011-0.047 0.016-0.047 0.009-0.043 0.021-0.052 0.021-0.072 0.052-0.043 0.025-0.036 0.032-0.036 0.025-0.037 0.032-0.025 0.036-0.043 0.036-0.052 0.073-0.025 0.041-0.021 0.047-0.025 0.037-0.027 0.047-0.016 0.047-0.020 0.041-0.016 0.052-0.005 0.052-0.015 0.048-0.011 0.052v0.052l-0.005 0.052v0.12l0.005 0.052v0.041l0.005 0.052 0.009 0.047 0.016 0.041 0.005 0.053 0.016 0.041 0.015 0.036 0.021 0.052 0.027 0.052 0.020 0.037 0.052 0.083 0.032 0.041 0.025 0.037 0.043 0.031 0.025 0.036 0.036 0.032 0.084 0.063 0.036 0.020 0.041 0.027 0.048 0.021 0.052 0.020 0.036 0.021 0.104 0.031 0.047 0.005 0.052 0.016 0.052 0.005h0.224l0.063-0.005h0.047l0.053-0.021 0.052-0.005 0.052-0.015 0.041-0.011 0.047-0.021 0.041-0.020 0.047-0.021 0.032-0.021 0.041-0.025v-0.464h-0.735v-0.744h1.661v1.667l-0.036 0.025-0.036 0.031-0.037 0.027-0.041 0.031-0.041 0.021-0.036 0.032-0.084 0.052-0.052 0.025-0.083 0.052-0.053 0.021-0.041 0.020-0.047 0.021-0.104 0.041-0.041 0.021-0.095 0.031-0.047 0.011-0.047 0.016-0.052 0.016-0.041 0.009-0.156 0.032-0.048 0.005-0.104 0.011-0.057 0.005-0.052 0.004-0.057 0.005h-0.26l-0.052-0.009h-0.052l-0.052-0.011h-0.047l-0.052-0.016-0.152-0.031-0.041-0.016-0.047-0.005-0.052-0.021-0.095-0.031-0.093-0.041-0.052-0.021-0.036-0.021-0.052-0.020-0.037-0.032-0.052-0.020-0.031-0.027-0.041-0.025-0.084-0.063-0.041-0.027-0.032-0.031-0.041-0.032-0.068-0.067-0.036-0.032-0.031-0.036-0.037-0.037-0.025-0.041-0.032-0.031-0.025-0.043-0.032-0.041-0.025-0.036-0.027-0.041-0.025-0.048-0.021-0.041-0.021-0.047-0.020-0.041-0.041-0.095-0.016-0.036-0.021-0.047-0.011-0.047-0.009-0.041-0.011-0.052-0.016-0.048-0.011-0.052-0.005-0.041-0.009-0.052-0.011-0.093-0.011-0.104v-0.276l0.011-0.053v-0.052l0.016-0.052v-0.052l0.015-0.047 0.016-0.052 0.021-0.093 0.015-0.052 0.016-0.047 0.063-0.141 0.020-0.041 0.021-0.047 0.027-0.048 0.020-0.041 0.027-0.036 0.052-0.084 0.031-0.041 0.032-0.036 0.025-0.041 0.068-0.068 0.031-0.037 0.037-0.036 0.031-0.036 0.043-0.032 0.072-0.063 0.041-0.031 0.043-0.027 0.036-0.031 0.041-0.027 0.043-0.020 0.047-0.027 0.052-0.025 0.036-0.027 0.052-0.020 0.047-0.021 0.047-0.025 0.043-0.011 0.052-0.016 0.041-0.021 0.047-0.009 0.047-0.016 0.052-0.011 0.043-0.016 0.052-0.011h0.052l0.047-0.015h0.052l0.052-0.011h0.047zM24.073 19.448h0.276l0.063 0.011h0.099l0.052 0.015h0.057l0.052 0.016 0.093 0.021 0.052 0.011 0.047 0.009 0.053 0.016 0.047 0.016 0.041 0.011 0.047 0.015 0.052 0.016 0.041 0.021 0.052 0.020 0.048 0.021 0.047 0.027 0.036 0.020 0.047 0.027 0.047 0.020 0.043 0.027 0.047 0.031 0.036 0.027 0.084 0.063 0.041 0.025-0.032 0.041-0.025 0.043-0.031 0.036-0.032 0.041-0.025 0.047-0.027 0.043-0.031 0.036-0.032 0.041-0.025 0.043-0.032 0.041-0.025 0.036-0.032 0.041-0.025 0.048-0.032 0.041-0.031 0.036-0.032 0.041-0.025 0.043-0.041-0.032-0.048-0.025-0.036-0.027-0.041-0.025-0.047-0.021-0.043-0.027-0.047-0.020-0.036-0.021-0.052-0.020-0.037-0.021-0.041-0.016-0.093-0.031-0.104-0.032-0.156-0.031-0.052-0.005-0.095-0.011h-0.109l-0.057 0.011-0.052 0.011-0.047 0.011-0.041 0.020-0.037 0.021-0.041 0.036-0.031 0.047-0.021 0.048v0.124l0.027 0.057 0.020 0.032 0.032 0.031 0.052 0.027 0.041 0.025 0.047 0.021 0.052 0.020 0.068 0.016 0.036 0.016 0.043 0.011 0.052 0.011 0.041 0.015 0.047 0.011 0.057 0.016 0.052 0.016 0.057 0.015 0.057 0.011 0.047 0.016 0.057 0.015 0.052 0.011 0.047 0.011 0.157 0.047 0.041 0.016 0.052 0.016 0.047 0.020 0.052 0.027 0.104 0.041 0.047 0.027 0.084 0.052 0.077 0.057 0.048 0.031 0.036 0.036 0.036 0.043 0.037 0.036 0.025 0.036 0.037 0.052 0.025 0.037 0.021 0.052 0.020 0.031 0.016 0.052 0.016 0.043 0.011 0.047 0.020 0.104 0.005 0.052 0.005 0.047v0.125l-0.005 0.057-0.011 0.104-0.011 0.052-0.015 0.047-0.011 0.052-0.016 0.052-0.015 0.047-0.021 0.037-0.021 0.047-0.025 0.041-0.032 0.037-0.052 0.083-0.063 0.073-0.036 0.025-0.041 0.037-0.032 0.031-0.041 0.031-0.041 0.021-0.041 0.032-0.048 0.025-0.093 0.047-0.052 0.021-0.047 0.020-0.052 0.016-0.047 0.016-0.043 0.011-0.104 0.020-0.036 0.011-0.052 0.011h-0.052l-0.047 0.011h-0.052l-0.052 0.011h-0.371l-0.156-0.016-0.052-0.011-0.047-0.005-0.104-0.020-0.057-0.011-0.047-0.011-0.052-0.016-0.053-0.011-0.047-0.015-0.052-0.016-0.052-0.021-0.041-0.015-0.052-0.016-0.052-0.021-0.037-0.020-0.052-0.016-0.041-0.027-0.052-0.020-0.041-0.027-0.037-0.025-0.052-0.027-0.036-0.020-0.041-0.032-0.041-0.025-0.043-0.032-0.036-0.031-0.041-0.032-0.037-0.025-0.041-0.037 0.032-0.041 0.036-0.036 0.031-0.037 0.037-0.041 0.025-0.036 0.032-0.041 0.036-0.037 0.031-0.036 0.037-0.041 0.025-0.037 0.037-0.036 0.031-0.041 0.032-0.037 0.036-0.041 0.025-0.036 0.037-0.037 0.036-0.041 0.036 0.032 0.048 0.031 0.036 0.031 0.052 0.027 0.036 0.027 0.047 0.031 0.043 0.027 0.047 0.020 0.036 0.027 0.047 0.015 0.052 0.021 0.043 0.021 0.047 0.015 0.041 0.021 0.052 0.016 0.047 0.015 0.052 0.016 0.052 0.005 0.048 0.016 0.052 0.005h0.057l0.047 0.015h0.281l0.047-0.009 0.052-0.011 0.036-0.005 0.043-0.016 0.036-0.020 0.047-0.032 0.027-0.036 0.020-0.041 0.016-0.048v-0.12l-0.021-0.047-0.025-0.041-0.032-0.031-0.047-0.032-0.036-0.015-0.047-0.021-0.052-0.021-0.057-0.025-0.037-0.011-0.041-0.011-0.052-0.016-0.036-0.009-0.052-0.016-0.052-0.005-0.053-0.021-0.052-0.005-0.057-0.015-0.047-0.011-0.052-0.016-0.052-0.011-0.052-0.015-0.047-0.016-0.052-0.011-0.041-0.016-0.095-0.031-0.052-0.021-0.052-0.015-0.104-0.043-0.047-0.025-0.052-0.027-0.036-0.025-0.048-0.027-0.036-0.025-0.047-0.027-0.068-0.068-0.036-0.031-0.063-0.073-0.027-0.036-0.020-0.036-0.032-0.048-0.015-0.036-0.048-0.125-0.009-0.052-0.011-0.047v-0.047l-0.011-0.052v-0.213l0.011-0.104 0.011-0.043 0.009-0.047 0.016-0.041 0.011-0.052 0.021-0.036 0.020-0.053 0.021-0.041 0.020-0.052 0.027-0.036 0.036-0.041 0.027-0.043 0.041-0.036 0.031-0.036 0.032-0.043 0.047-0.036 0.032-0.027 0.041-0.031 0.083-0.052 0.047-0.027 0.095-0.047 0.041-0.015 0.047-0.016 0.052-0.021 0.052-0.015 0.037-0.011 0.047-0.011 0.041-0.011 0.047-0.011 0.052-0.011 0.104-0.009 0.048-0.005zM11.755 19.484h0.943l0.043 0.095 0.020 0.041 0.016 0.052 0.021 0.047 0.015 0.041 0.027 0.047 0.031 0.095 0.027 0.047 0.041 0.093 0.011 0.041 0.083 0.188 0.016 0.047 0.021 0.043 0.025 0.047 0.011 0.047 0.027 0.052 0.009 0.047 0.048 0.093 0.020 0.037 0.021 0.052 0.016 0.052 0.015 0.036 0.027 0.052 0.016 0.043 0.020 0.052 0.016 0.036 0.021 0.052 0.047 0.093 0.015 0.047 0.011 0.048 0.021 0.047 0.025 0.041 0.021 0.052 0.021 0.047 0.015 0.041 0.043 0.095 0.015 0.047 0.021 0.047 0.016 0.047 0.020 0.041 0.027 0.048 0.020 0.047 0.021 0.041 0.011 0.052 0.041 0.093 0.021 0.043 0.015 0.047 0.043 0.093 0.025 0.052 0.011 0.041 0.027 0.053 0.009 0.036 0.021 0.052 0.027 0.052 0.020 0.036 0.016 0.052 0.021 0.043 0.015 0.052 0.027 0.036 0.031 0.104 0.021 0.037 0.020 0.052 0.027 0.041 0.021 0.052 0.009 0.047 0.016 0.041 0.021 0.047 0.025 0.043h-1.041l-0.025-0.043-0.016-0.047-0.021-0.047-0.020-0.052-0.011-0.041-0.043-0.093-0.015-0.043-0.041-0.093-0.016-0.041-0.021-0.052-0.031-0.095-0.021-0.041h-1.448l-0.020 0.047-0.016 0.043-0.021 0.052-0.020 0.047-0.011 0.041-0.021 0.052-0.020 0.041-0.016 0.047-0.021 0.043-0.020 0.052-0.016 0.036-0.021 0.052-0.015 0.052-0.021 0.037-0.016 0.052h-1.031l0.015-0.048 0.043-0.093 0.015-0.052 0.016-0.041 0.027-0.047 0.020-0.047 0.021-0.043 0.011-0.047 0.020-0.052 0.027-0.041 0.020-0.047 0.032-0.095 0.047-0.093 0.016-0.047 0.020-0.041 0.016-0.048 0.063-0.14 0.021-0.052 0.015-0.041 0.016-0.047 0.027-0.043 0.020-0.052 0.016-0.047 0.016-0.041 0.020-0.052 0.027-0.037 0.016-0.052 0.020-0.041 0.016-0.047 0.021-0.052 0.025-0.041 0.016-0.052 0.020-0.037 0.016-0.052 0.021-0.052 0.020-0.036 0.021-0.052 0.016-0.043 0.020-0.052 0.016-0.036 0.027-0.052 0.020-0.052 0.021-0.041 0.011-0.047 0.020-0.048 0.027-0.047 0.020-0.041 0.011-0.052 0.021-0.047 0.021-0.043 0.041-0.093 0.015-0.041 0.043-0.104 0.020-0.037 0.021-0.052 0.016-0.041 0.015-0.052 0.021-0.047 0.027-0.041 0.020-0.052 0.016-0.037 0.016-0.052 0.020-0.041 0.027-0.047 0.016-0.052 0.015-0.043 0.021-0.052 0.020-0.036 0.027-0.052 0.016-0.052 0.015-0.036 0.021-0.052zM14.683 19.511h1.031l0.032 0.041 0.052 0.084 0.025 0.047 0.027 0.036 0.025 0.047 0.027 0.041 0.025 0.048 0.027 0.041 0.025 0.036 0.027 0.047 0.025 0.043 0.037 0.041 0.015 0.041 0.032 0.047 0.025 0.043 0.032 0.036 0.021 0.047 0.025 0.041 0.032 0.043 0.015 0.041 0.037 0.047 0.077 0.125 0.021 0.041 0.031 0.041 0.027 0.041 0.025 0.048 0.079 0.124 0.025 0.048 0.027 0.041 0.031-0.041 0.021-0.053 0.031-0.036 0.027-0.047 0.025-0.036 0.021-0.052 0.036-0.037 0.027-0.047 0.021-0.036 0.025-0.043 0.032-0.047 0.025-0.036 0.027-0.052 0.025-0.036 0.032-0.048 0.020-0.036 0.027-0.052 0.025-0.031 0.027-0.043 0.031-0.052 0.027-0.036 0.020-0.047 0.032-0.037 0.025-0.052 0.027-0.031 0.031-0.041 0.027-0.052 0.025-0.037 0.027-0.047 0.025-0.036 0.027-0.052 0.031-0.037 0.021-0.047 0.027-0.036h1.047v3.719h-0.98v-2.188l-0.025 0.037-0.032 0.052-0.025 0.031-0.032 0.041-0.020 0.052-0.032 0.037-0.025 0.036-0.032 0.052-0.052 0.073-0.031 0.041-0.027 0.052-0.031 0.037-0.027 0.036-0.020 0.052-0.032 0.036-0.025 0.037-0.032 0.052-0.025 0.036-0.032 0.041-0.025 0.047-0.021 0.037-0.031 0.041-0.027 0.047-0.031 0.036-0.032 0.043-0.020 0.041-0.027 0.047-0.031 0.037-0.032 0.041-0.020 0.052-0.037 0.031-0.020 0.041-0.032 0.053-0.025 0.036h-0.021l-0.031-0.047-0.027-0.043-0.025-0.047-0.027-0.036-0.031-0.047-0.027-0.041-0.031-0.043-0.027-0.041-0.025-0.047-0.027-0.036-0.036-0.048-0.021-0.041-0.031-0.047-0.027-0.036-0.025-0.047-0.032-0.043-0.025-0.052-0.032-0.036-0.025-0.047-0.027-0.043-0.025-0.047-0.032-0.036-0.025-0.047-0.032-0.041-0.020-0.043-0.032-0.041-0.025-0.047-0.032-0.036-0.025-0.048-0.032-0.041-0.020-0.047-0.037-0.036-0.020-0.048-0.032-0.041v2.193h-0.963v-3.683zM19.307 19.511h2.933v0.839h-1.959v0.599h1.76v0.792h-1.76v0.635h1.984v0.844h-2.953v-3.677zM12.213 20.651l-0.016 0.047-0.015 0.043-0.021 0.052-0.021 0.047-0.015 0.047-0.043 0.093-0.020 0.052-0.016 0.043-0.016 0.052-0.020 0.036-0.016 0.052-0.021 0.052-0.020 0.037-0.016 0.052-0.020 0.041-0.016 0.052-0.027 0.047-0.011 0.041-0.020 0.052-0.021 0.048-0.016 0.041-0.020 0.052h0.859l-0.020-0.052-0.016-0.047-0.041-0.095-0.016-0.047-0.021-0.041-0.015-0.052-0.021-0.047-0.016-0.047-0.020-0.043-0.016-0.047-0.021-0.052-0.015-0.041-0.043-0.093-0.009-0.048-0.021-0.047-0.021-0.052-0.015-0.036-0.043-0.104-0.015-0.047zM10.683 27.615h10.681l-5.452 1.797z" />
                  </svg>
                ),
                battlenet: (
                  <svg
                    className="w-10 h-10 fill-black dark:fill-white"
                    width="32px"
                    height="32px"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M 26.578125 14.339844 C 26.578125 14.339844 28.882813 14.457031 28.882813 13.101563 C 28.882813 11.332031 25.8125 9.738281 25.8125 9.738281 C 25.8125 9.738281 26.292969 8.71875 26.59375 8.148438 C 26.894531 7.578125 27.738281 5.359375 27.8125 4.851563 C 27.90625 4.210938 27.761719 4.011719 27.761719 4.011719 C 27.554688 5.378906 25.328125 9.316406 25.148438 9.449219 C 22.976563 8.433594 19.992188 8.148438 19.992188 8.148438 C 19.992188 8.148438 17.070313 2 14.320313 2 C 11.59375 2 11.609375 7.265625 11.609375 7.265625 C 11.609375 7.265625 10.839844 5.773438 9.871094 5.773438 C 8.457031 5.773438 7.992188 7.90625 7.992188 10.222656 C 5.203125 10.222656 2.855469 10.847656 2.644531 10.90625 C 2.4375 10.964844 1.777344 11.445313 2.074219 11.386719 C 2.6875 11.191406 5.554688 10.746094 8.0625 10.964844 C 8.203125 13.164063 9.488281 16.03125 9.488281 16.03125 C 9.488281 16.03125 6.730469 20.023438 6.730469 22.871094 C 6.730469 23.621094 7.058594 24.992188 9.035156 24.992188 C 10.695313 24.992188 12.558594 23.996094 12.90625 23.796875 C 12.601563 24.230469 12.375 25.0625 12.375 25.445313 C 12.375 25.757813 12.5625 26.644531 13.839844 26.644531 C 15.480469 26.644531 17.316406 25.386719 17.316406 25.386719 C 17.316406 25.386719 19.050781 28.261719 20.53125 29.578125 C 20.929688 29.933594 21.3125 30 21.3125 30 C 21.3125 30 19.839844 28.585938 17.902344 24.9375 C 19.703125 23.828125 21.578125 21.203125 21.578125 21.203125 C 21.578125 21.203125 21.800781 21.210938 23.511719 21.210938 C 26.191406 21.210938 29.996094 20.648438 29.996094 18.519531 C 30 16.324219 26.578125 14.339844 26.578125 14.339844 Z M 26.875 13.015625 C 26.875 13.792969 26.136719 13.785156 26.136719 13.785156 L 25.574219 13.820313 C 25.574219 13.820313 24.507813 13.261719 23.859375 12.996094 C 23.859375 12.996094 24.863281 11.453125 25.097656 11.023438 C 25.273438 11.128906 26.875 12.128906 26.875 13.015625 Z M 15.660156 5.097656 C 16.921875 5.097656 18.71875 8.066406 18.71875 8.066406 C 18.71875 8.066406 15.914063 7.816406 13.605469 9.171875 C 13.667969 7.035156 14.386719 5.097656 15.660156 5.097656 Z M 10.671875 7.503906 C 11.070313 7.503906 11.460938 7.992188 11.625 8.402344 C 11.625 8.675781 11.765625 10.269531 11.765625 10.269531 L 9.453125 10.179688 C 9.453125 8.097656 10.269531 7.503906 10.671875 7.503906 Z M 10.429688 21.976563 C 9.164063 21.976563 8.90625 21.273438 8.90625 20.640625 C 8.90625 19.207031 10.050781 17.199219 10.050781 17.199219 C 10.050781 17.199219 11.335938 19.898438 13.574219 21.035156 C 12.464844 21.6875 11.546875 21.976563 10.429688 21.976563 Z M 14.535156 24.800781 C 13.648438 24.800781 13.539063 24.226563 13.539063 24.09375 C 13.539063 23.683594 13.863281 23.195313 13.863281 23.195313 C 13.863281 23.195313 15.351563 22.191406 15.445313 22.082031 L 16.546875 24.136719 C 16.546875 24.136719 15.421875 24.800781 14.535156 24.800781 Z M 17.300781 23.683594 C 16.761719 22.742188 16.363281 21.757813 16.363281 21.757813 C 16.363281 21.757813 18.578125 21.898438 19.769531 20.671875 C 19.027344 21.003906 17.84375 21.425781 16.46875 21.296875 C 19.34375 18.765625 21.023438 16.929688 22.441406 15.035156 C 22.320313 14.886719 21.671875 14.433594 21.511719 14.359375 C 20.65625 15.390625 17.324219 18.949219 14.238281 20.710938 C 10.332031 18.582031 9.511719 12.320313 9.429688 11.019531 L 11.5625 11.222656 C 11.5625 11.222656 10.761719 12.644531 10.761719 13.691406 C 10.761719 14.734375 10.886719 14.789063 10.886719 14.789063 C 10.886719 14.789063 10.859375 12.96875 11.984375 11.5625 C 12.84375 16.125 13.738281 18.460938 14.433594 19.855469 C 14.789063 19.707031 15.449219 19.414063 15.449219 19.414063 C 15.449219 19.414063 13.480469 13.738281 13.589844 9.898438 C 14.484375 9.421875 15.808594 8.929688 17.300781 8.929688 C 21.230469 8.929688 24.390625 10.617188 24.390625 10.617188 L 23.15625 12.34375 C 23.15625 12.34375 22.054688 10.351563 20.496094 9.996094 C 21.316406 10.605469 22.238281 11.414063 22.714844 12.574219 C 19.457031 11.304688 15.527344 10.632813 14.265625 10.484375 C 14.15625 10.949219 14.171875 11.613281 14.171875 11.613281 C 14.171875 11.613281 19.441406 12.585938 23.277344 14.777344 C 23.25 19.574219 18.023438 23.257813 17.300781 23.683594 Z M 22.292969 20.097656 C 22.292969 20.097656 23.929688 17.953125 23.902344 15.109375 C 23.902344 15.109375 26.546875 16.746094 26.546875 18.34375 C 26.546875 20.125 22.292969 20.097656 22.292969 20.097656 Z" />
                  </svg>
                ),
              };
              return (
                <div className="cursor-pointer" key={i}>
                  <Tippy
                    content={`${m.type}: ${m.name}`}
                    animation="scale"
                    className="shadow-xl"
                  >
                    <div className="opacity-90 hover:opacity-100 ">
                      {obj[m.type]}
                    </div>
                  </Tippy>
                </div>
              );
            })}
          </div>
        </div>
      </div>{" "}
      <div className="gap-4 mx-10 mt-4">
        <div className="px-4 py-2 bg-gray-300 dark:bg-[#2b2d31]  animate__delay-1s rounded-lg text-center w-full">
          {" "}
          <span className="text-gray-900 dark:text-white text-4xl font-bold flex items-center justify-center">
            Active Hours{" "}
            <Tippy
              content={
                <>
                  <div className="text-white text-xl font-bold">
                    What are Active Hours?
                  </div>
                  <p className="text-white text-lg ">
                    Active Hours are the hours in which{" "}
                    {data?.dataFile ? "they " : "you "} are most active on
                    discord sending messages.
                  </p>{" "}
                  <div className="flex items-center">
                    <svg
                      className="fill-red-400 mr-2 basis-[20%]"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                    >
                      <path d="M.275 21.425 12 1.15l11.725 20.275ZM12 17.925q.45 0 .788-.338.337-.337.337-.787t-.337-.775Q12.45 15.7 12 15.7t-.787.325q-.338.325-.338.775t.338.787q.337.338.787.338ZM11 15h2v-4.725h-2Z" />
                    </svg>
                    <b className="text-red-400 text-lg pt-1 ">
                      We are working on making this graph more accurate as it is
                      not really accurate.
                    </b>
                  </div>
                </>
              }
              animation="scale"
              className="shadow-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                className="cursor-pointer fill-black dark:fill-white ml-2 opacity-90 hover:opacity-100"
              >
                <path d="M10.625 17.375h2.75V11h-2.75ZM12 9.5q.65 0 1.075-.438Q13.5 8.625 13.5 8q0-.65-.425-1.075Q12.65 6.5 12 6.5q-.625 0-1.062.425Q10.5 7.35 10.5 8q0 .625.438 1.062.437.438 1.062.438Zm0 13.35q-2.275 0-4.25-.85t-3.438-2.312Q2.85 18.225 2 16.25q-.85-1.975-.85-4.25T2 7.75q.85-1.975 2.312-3.438Q5.775 2.85 7.75 2q1.975-.85 4.25-.85t4.25.85q1.975.85 3.438 2.312Q21.15 5.775 22 7.75q.85 1.975.85 4.25T22 16.25q-.85 1.975-2.312 3.438Q18.225 21.15 16.25 22q-1.975.85-4.25.85Z" />
              </svg>
            </Tippy>
          </span>
          <div className="row-span-3 ">
            <div className="mx-10">
              <HighchartsReact
                className="dark:fill-slate-900 fill-gray-300"
                highcharts={Highcharts}
                options={{
                  title: {
                    text: "",
                  },
                  xAxis: {
                    title: {
                      text: "Hours",
                      style: {
                        fontSize: "14px",
                        color: "#fff",
                        fontFamily: "Inter",
                        fontWeight: "bold",
                      },
                    },
                    labels: {
                      formatter: function () {
                        return days_[this.value];
                      },
                      style: {
                        fontSize: "9px",
                        color: "#fff",
                        fontFamily: "Inter",
                      },
                    },
                  },
                  yAxis: {
                    gridLineColor: "grey",
                    gridLineWidth: 1,
                    title: {
                      text: "Messages",
                      style: {
                        fontSize: "14px",
                        color: "#fff",
                        fontFamily: "Inter",
                        fontWeight: "bold",
                      },
                    },
                    labels: {
                      style: {
                        fontSize: "9px",
                        color: "#fff",
                        fontFamily: "Inter",
                      },
                    },
                  },
                  series: [
                    {
                      name: "Messages",
                      data: data?.messages?.hoursValues
                        ? makeData(data.messages.hoursValues)
                        : new Array(24).fill(0),
                      pointStart: data?.messages?.hoursValues
                        ? makeData(data.messages.hoursValues)[0]
                        : 0,
                      pointInterval: 86400000,
                    },
                  ],
                  plotOptions: { series: { marker: { enabled: false } } },
                  tooltip: {
                    backgroundColor: "#212529",
                    borderWith: 5,
                    className: "tooltip-hov",
                    formatter: function () {
                      return `<p style="font-weight: 200; font-family: Inter; color: white"></span><b style="font-weight: 600; font-family: Inter; color: white" ><span>${
                        this.y
                      }</b> messages ${
                        this.x && days_[this.x] ? `at ${days_[this.x]}` : ""
                      }</p>`;
                    },
                  },
                  legend: {
                    enabled: false,
                  },
                  lang: {
                    noData: "No Data Recorded",
                  },
                  noData: {
                    style: {
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "grey",
                    },
                  },
                  credits: { enabled: false },
                  chart: {
                    type: "areaspline",
                    backgroundColor: "transparent",
                    width: window.innerWidth - 200,
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="lg:grid grid-cols-2 grid-flow-col gap-4 mx-10 mt-4">
        <div className="px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg row-span-3 ">
          <span className="text-gray-900 dark:text-white text-2xl font-bold pt-4 px-6 flex items-center mb-2">
            Top Users
            {data?.messages?.topDMs && data?.messages?.topDMs?.length > 0 ? (
              <form className="ml-4">
                <label
                  htmlFor="user-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
                >
                  Search
                </label>
                <div className="relative ">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-900 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="user-search"
                    className="block p-2 pl-10 w-full text-sm bg-transparent rounded-lg border-gray-300 text-gray-900 dark:text-white border-none focus:border-current focus:ring-0 bg-gray-400 dark:bg-[#23272A]"
                    placeholder="Filter Users"
                    onChange={(e) => {
                      setTimeout(() => {
                        const possibilities = data?.messages?.topDMs;
                        if (!possibilities) return;

                        const search = e.target.value.toLowerCase().trim();

                        if (search === "") {
                          setTopDMs([]);
                          return;
                        }
                        const filtered = possibilities.filter(
                          (p) =>
                            p.user_tag.toLowerCase().includes(search) ||
                            p.user_id.toLowerCase().includes(search)
                        );

                        if (filtered && filtered.length) {
                          setTopDMs(filtered);
                        }
                      }, 100);
                    }}
                  />
                </div>
              </form>
            ) : (
              ""
            )}
          </span>
          {data?.messages?.topDMs && data?.messages?.topDMs?.length > 0 ? (
            <span className="text-gray-300 px-4">
              Showing{" "}
              {!topDMs.length ? data.messages.topDMs.length : topDMs.length}/
              {data.messages.topDMs.length}
            </span>
          ) : (
            ""
          )}

          <div className="flex grow rounded-sm overflow-y-auto overflow-x-hidden h-[700px]">
            <div className="flex flex-col w-full px-3 pb-4 ">
              {" "}
              {!data?.messages?.topDMs ? (
                <div className="px-10 text-gray-900 dark:text-white text-3xl font-bold flex flex-col justify-center content-center align-center w-full h-full">
                  No Data was found or this feature is disabled
                </div>
              ) : (
                ""
              )}
              {data?.messages?.topDMs && data?.messages?.topDMs?.length > 0
                ? !topDMs.length > 0
                  ? data?.messages?.topDMs.map((m, i) => {
                      return (
                        <div key={i}>
                          <div className="flex items-center py-10 sm:flex-row h-1 hover:bg-gray-400 dark:hover:bg-[#23272A] px-2 rounded-lg ">
                            <div className="flex items-center max-w-full sm:max-w-4/6">
                              <div
                                className="text-gray-200 dark:text-white font-bold flex h-8 w-8 rounded-full items-center justify-center bg-gray-400 dark:bg-gray-600 "
                                style={{
                                  backgroundColor:
                                    i === 0
                                      ? "#DA9E3B"
                                      : i === 1
                                      ? "#989898"
                                      : i === 2
                                      ? "#AE7458"
                                      : "#4E5258",
                                }}
                              >
                                {i + 1}
                              </div>

                              <div className="text-gray-900 dark:text-white font-bold  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                                <div className="flex items-center text-lg">
                                  {m?.user_tag}
                                </div>
                                <span className="text-gray-400 text-sm -mt-2">
                                  {m?.user_id}
                                </span>
                              </div>
                            </div>
                            <div className="hidden sm:flex items-center self-center ml-auto">
                              {m?.messageCount ? (
                                <Tippy
                                  content={
                                    m.messageCount
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                    " Messages"
                                  }
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    width="24"
                                  >
                                    <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                  </svg>
                                </Tippy>
                              ) : (
                                ""
                              )}
                              {m?.favoriteWords &&
                              m?.favoriteWords?.length > 0 ? (
                                <Tippy
                                  content={`${
                                    m.favoriteWords.length
                                  } Favorite Word${
                                    m.favoriteWords.length > 1 ? "s" : ""
                                  }`}
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <svg
                                    onClick={() => {
                                      toast(
                                        <div className="Toastify__toast-body_">
                                          <span className="font-bold text-lg text-black dark:text-white">
                                            {data?.dataFile ? "Their" : "Your"}{" "}
                                            {m.favoriteWords.length < 10
                                              ? "Top 10"
                                              : `${m.favoriteWords.length}`}{" "}
                                            Favorite Word
                                            {m.favoriteWords.length === 1
                                              ? " is"
                                              : "s are"}
                                            :
                                          </span>
                                          <br />
                                          <ul className="list-disc ml-4">
                                            {m.favoriteWords.map((f, i) => {
                                              return (
                                                <li key={i}>
                                                  {f.word}: {f.count} times
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>,
                                        {
                                          position: "top-right",
                                          autoClose: 5000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          draggable: true,
                                          progress: undefined,
                                        }
                                      );
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    width="24"
                                    className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                  >
                                    <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                                  </svg>
                                </Tippy>
                              ) : (
                                ""
                              )}
                              {m?.topCursed && m?.topCursed?.length > 0 ? (
                                <Tippy
                                  content={
                                    m.topCursed.length
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                    " Curse Word" +
                                    (m.topCursed.length > 1 ? "s" : "")
                                  }
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <svg
                                    onClick={() => {
                                      toast(
                                        <div className="Toastify__toast-body_">
                                          <span className="font-bold text-lg text-black dark:text-white">
                                            {data?.dataFile ? "Their" : "Your"}{" "}
                                            {m.topCursed.length < 10
                                              ? "Top 10"
                                              : `${m.topCursed.length}`}{" "}
                                            Curse Word
                                            {m.topCursed.length === 1
                                              ? " is"
                                              : "s are"}
                                            :
                                          </span>
                                          <br />
                                          <ul className="list-disc ml-4">
                                            {m.topCursed.map((f, i) => {
                                              return (
                                                <li key={i}>
                                                  {f.word}: {f.count} times
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>,
                                        {
                                          position: "top-right",
                                          autoClose: 5000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          draggable: true,
                                          progress: undefined,
                                        }
                                      );
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    width="24"
                                    className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                  >
                                    <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                  </svg>
                                </Tippy>
                              ) : (
                                ""
                              )}
                              {m?.topLinks && m?.topLinks?.length > 0 ? (
                                <Tippy
                                  content={m.topLinks.length + " Links"}
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <svg
                                    onClick={() => {
                                      toast(
                                        <div className="Toastify__toast-body_">
                                          <span className="font-bold text-lg text-black dark:text-white">
                                            {data?.dataFile ? "Their" : "Your"}{" "}
                                            {m.topLinks.length < 10
                                              ? "Top 10"
                                              : `${m.topLinks.length}`}{" "}
                                            Favorite Link
                                            {m.topLinks.length === 1
                                              ? " is"
                                              : "s are"}
                                            :
                                          </span>
                                          <br />
                                          <ul className="list-disc ml-4">
                                            {m.topLinks.map((f, i) => {
                                              return (
                                                <li key={i}>
                                                  {f.word}: {f.count} times
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>,
                                        {
                                          position: "top-right",
                                          autoClose: 5000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          draggable: true,
                                          progress: undefined,
                                        }
                                      );
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    width="24"
                                    className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                  >
                                    <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                                  </svg>
                                </Tippy>
                              ) : (
                                ""
                              )}
                              {m?.topDiscordLinks &&
                              m?.topDiscordLinks?.length > 0 ? (
                                <Tippy
                                  content={
                                    m.topDiscordLinks.length + " Discord Links"
                                  }
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <svg
                                    onClick={() => {
                                      toast(
                                        <div className="Toastify__toast-body_">
                                          <span className="font-bold text-lg text-black dark:text-white">
                                            {data?.dataFile ? "Their" : "Your"}{" "}
                                            {m.topDiscordLinks.length < 10
                                              ? "Top 10"
                                              : `${m.topDiscordLinks.length}`}{" "}
                                            Discord Link
                                            {m.topDiscordLinks.length === 1
                                              ? " is"
                                              : "s are"}
                                            :
                                          </span>
                                          <br />
                                          <ul className="list-disc ml-4">
                                            {m.topDiscordLinks.map((f, i) => {
                                              return (
                                                <li key={i}>
                                                  {f.word}: {f.count} times
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>,
                                        {
                                          position: "top-right",
                                          autoClose: 5000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          draggable: true,
                                          progress: undefined,
                                        }
                                      );
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    width="24"
                                    className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                  >
                                    <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                                  </svg>
                                </Tippy>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : topDMs?.map((m, i) => {
                      return (
                        <div key={i}>
                          <div className="flex items-center py-10 sm:flex-row h-1 hover:bg-gray-400 dark:hover:bg-[#23272A] px-2 rounded-lg ">
                            <div className="flex items-center max-w-full sm:max-w-4/6">
                              <div className="text-gray-900 dark:text-white font-bold  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                                <div className="flex items-center text-lg">
                                  {m?.user_tag}
                                </div>
                                <span className="text-gray-400 text-sm -mt-2">
                                  {m?.user_id}
                                </span>
                              </div>
                            </div>
                            <div className="hidden sm:flex items-center self-center ml-auto">
                              {m?.messageCount ? (
                                <Tippy
                                  content={
                                    m.messageCount
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                    " Messages"
                                  }
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    width="24"
                                  >
                                    <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                  </svg>
                                </Tippy>
                              ) : (
                                ""
                              )}
                              {m?.favoriteWords &&
                              m?.favoriteWords.length > 0 ? (
                                <Tippy
                                  content={`${
                                    m.favoriteWords.length
                                  } Favorite Word${
                                    m.favoriteWords.length > 1 ? "s" : ""
                                  }`}
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <svg
                                    onClick={() => {
                                      toast(
                                        <div className="Toastify__toast-body_">
                                          <span className="font-bold text-lg text-black dark:text-white">
                                            {data?.dataFile ? "Their" : "Your"}{" "}
                                            {m.favoriteWords.length < 10
                                              ? "Top 10"
                                              : `${m.favoriteWords.length}`}{" "}
                                            Favorite Word
                                            {m.favoriteWords.length === 1
                                              ? " is"
                                              : "s are"}
                                            :
                                          </span>
                                          <br />
                                          <ul className="list-disc ml-4">
                                            {m.favoriteWords.map((f, i) => {
                                              return (
                                                <li key={i}>
                                                  {f.word}: {f.count} times
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>,
                                        {
                                          position: "top-right",
                                          autoClose: 5000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          draggable: true,
                                          progress: undefined,
                                        }
                                      );
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    width="24"
                                    className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                  >
                                    <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                                  </svg>
                                </Tippy>
                              ) : (
                                ""
                              )}
                              {m?.topCursed && m?.topCursed.length > 0 ? (
                                <Tippy
                                  content={
                                    m.topCursed.length
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                    " Curse Word" +
                                    (m.topCursed.length > 1 ? "s" : "")
                                  }
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <svg
                                    onClick={() => {
                                      toast(
                                        <div className="Toastify__toast-body_">
                                          <span className="font-bold text-lg text-black dark:text-white">
                                            {data?.dataFile ? "Their" : "Your"}{" "}
                                            {m.topCursed.length < 10
                                              ? "Top 10"
                                              : `${m.topCursed.length}`}{" "}
                                            Curse Word
                                            {m.topCursed.length === 1
                                              ? " is"
                                              : "s are"}
                                            :
                                          </span>
                                          <br />
                                          <ul className="list-disc ml-4">
                                            {m.topCursed.map((f, i) => {
                                              return (
                                                <li key={i}>
                                                  {f.word}: {f.count} times
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>,
                                        {
                                          position: "top-right",
                                          autoClose: 5000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          draggable: true,
                                          progress: undefined,
                                        }
                                      );
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    width="24"
                                    className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                  >
                                    <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                  </svg>
                                </Tippy>
                              ) : (
                                ""
                              )}
                              {m?.topLinks && m?.topLinks?.length > 0 ? (
                                <Tippy
                                  content={m.topLinks.length + " Links"}
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <svg
                                    onClick={() => {
                                      toast(
                                        <div className="Toastify__toast-body_">
                                          <span className="font-bold text-lg text-black dark:text-white">
                                            {data?.dataFile ? "Their" : "Your"}{" "}
                                            {m.topLinks.length < 10
                                              ? "Top 10"
                                              : `${m.topLinks.length}`}{" "}
                                            Favorite Link
                                            {m.topLinks.length === 1
                                              ? " is"
                                              : "s are"}
                                            :
                                          </span>
                                          <br />
                                          <ul className="list-disc ml-4">
                                            {m.topLinks.map((f, i) => {
                                              return (
                                                <li key={i}>
                                                  {f.word}: {f.count} times
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>,
                                        {
                                          position: "top-right",
                                          autoClose: 5000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          draggable: true,
                                          progress: undefined,
                                        }
                                      );
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    width="24"
                                    className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                  >
                                    <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                                  </svg>
                                </Tippy>
                              ) : (
                                ""
                              )}
                              {m?.topDiscordLinks &&
                              m?.topDiscordLinks.length > 0 ? (
                                <Tippy
                                  content={
                                    m.topDiscordLinks.length + " Discord Links"
                                  }
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <svg
                                    onClick={() => {
                                      toast(
                                        <div className="Toastify__toast-body_">
                                          <span className="font-bold text-lg text-black dark:text-white">
                                            {data?.dataFile ? "Their" : "Your"}{" "}
                                            {m.topDiscordLinks.length < 10
                                              ? "Top 10"
                                              : `${m.topDiscordLinks.length}`}{" "}
                                            Discord Link
                                            {m.topDiscordLinks.length === 1
                                              ? " is"
                                              : "s are"}
                                            :
                                          </span>
                                          <br />
                                          <ul className="list-disc ml-4">
                                            {m.topDiscordLinks.map((f, i) => {
                                              return (
                                                <li key={i}>
                                                  {f.word}: {f.count} times
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>,
                                        {
                                          position: "top-right",
                                          autoClose: 5000,
                                          hideProgressBar: false,
                                          closeOnClick: true,
                                          pauseOnHover: true,
                                          draggable: true,
                                          progress: undefined,
                                        }
                                      );
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    width="24"
                                    className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                  >
                                    <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                                  </svg>
                                </Tippy>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                : ""}
            </div>
          </div>
        </div>
        <div className="px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg row-span-3 ">
          {" "}
          <span className="text-gray-900 dark:text-white text-2xl font-bold pt-4 px-6 flex items-center mb-2">
            Top Channels
            {data?.messages?.topChannels &&
            data?.messages?.topChannels?.length > 0 ? (
              <form className="ml-4">
                <label
                  htmlFor="topChannels-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
                >
                  Search
                </label>
                <div className="relative ">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-900 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="topChannels-search"
                    className="block p-2 pl-10 w-full text-sm bg-transparent rounded-lg border-gray-300  text-gray-900 dark:text-white border-none focus:border-current focus:ring-0 bg-gray-400 dark:bg-[#23272A]"
                    placeholder="Filter Channels"
                    onChange={(e) => {
                      setTimeout(() => {
                        const possibilities = data?.messages?.topChannels;
                        if (!possibilities) return;
                        const search = e.target.value.toLowerCase().trim();

                        if (search === "") {
                          setTopChannels([]);
                          return;
                        }
                        const filtered = possibilities.filter(
                          (p) =>
                            p.name.toLowerCase().includes(search) ||
                            p.guildName.toLowerCase().includes(search)
                        );

                        if (filtered && filtered.length) {
                          setTopChannels(filtered);
                        }
                      }, 100);
                    }}
                  />
                </div>
              </form>
            ) : (
              ""
            )}
          </span>
          {data?.messages?.topChannels &&
          data?.messages?.topChannels?.length > 0 ? (
            <span className="text-gray-300 px-4">
              Showing{" "}
              {!topChannels.length
                ? data.messages.topChannels.length
                : topChannels.length}
              /{data.messages.topChannels.length}
            </span>
          ) : (
            ""
          )}
          <div className="flex grow rounded-sm overflow-y-auto overflow-x-hidden h-[700px]">
            <div className="flex flex-col w-full px-3 pb-4 ">
              {" "}
              {!data?.messages?.topChannels ? (
                <div className="px-10 text-gray-900 dark:text-white text-3xl font-bold flex flex-col justify-center content-center align-center w-full h-full">
                  No Data was found or this feature is disabled
                </div>
              ) : (
                ""
              )}
              {data?.messages?.topChannels &&
              data?.messages?.topChannels?.length > 0
                ? !topChannels.length > 0
                  ? data?.messages?.topChannels.map((m, i) => {
                      return (
                        <>
                          <div key={i}>
                            <div className="flex items-center py-10 sm:flex-row h-1 hover:bg-gray-400 dark:hover:bg-[#23272A] px-2 rounded-lg ">
                              <div className="flex items-center max-w-full sm:max-w-4/6">
                                <div
                                  className="text-gray-200 font-bold flex h-8 w-8 rounded-full items-center justify-center bg-gray-400 dark:bg-gray-600 "
                                  style={{
                                    backgroundColor:
                                      i === 0
                                        ? "#DA9E3B"
                                        : i === 1
                                        ? "#989898"
                                        : i === 2
                                        ? "#AE7458"
                                        : "#4E5258",
                                  }}
                                >
                                  {i + 1}
                                </div>

                                <div className="text-gray-900 dark:text-white font-bold  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                                  <div className="flex items-center text-lg">
                                    {m?.name}
                                  </div>
                                  <span className="text-gray-400 text-sm -mt-2">
                                    {m?.guildName}
                                  </span>
                                </div>
                              </div>
                              <div className="hidden sm:flex items-center self-center ml-auto">
                                {m?.messageCount ? (
                                  <Tippy
                                    content={
                                      m.messageCount
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                      " Messages"
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                      width="24"
                                    >
                                      <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  ""
                                )}
                                {m?.favoriteWords &&
                                m?.favoriteWords?.length > 0 ? (
                                  <Tippy
                                    content={`${
                                      m.favoriteWords.length
                                    } Favorite Word${
                                      m.favoriteWords.length > 1 ? "s" : ""
                                    }`}
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      onClick={() => {
                                        toast(
                                          <div className="Toastify__toast-body_">
                                            <span className="font-bold text-lg text-black dark:text-white">
                                              {data?.dataFile
                                                ? "Their"
                                                : "your"}{" "}
                                              {m.favoriteWords.length < 10
                                                ? "Top 10"
                                                : `${m.favoriteWords.length}`}{" "}
                                              Favorite Word
                                              {m.favoriteWords.length === 1
                                                ? " is"
                                                : "s are"}
                                              :
                                            </span>
                                            <br />
                                            <ul className="list-disc ml-4">
                                              {m.favoriteWords.map((f, i) => {
                                                return (
                                                  <li key={i}>
                                                    {f.word}: {f.count} times
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>,
                                          {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                          }
                                        );
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    >
                                      <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  ""
                                )}
                                {m?.topCursed && m?.topCursed?.length > 0 ? (
                                  <Tippy
                                    content={
                                      m.topCursed.length
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                      " Curse Word" +
                                      (m.topCursed.length > 1 ? "s" : "")
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      onClick={() => {
                                        toast(
                                          <div className="Toastify__toast-body_">
                                            <span className="font-bold text-lg text-black dark:text-white">
                                              {data?.dataFile
                                                ? "Their"
                                                : "your"}{" "}
                                              {m.topCursed.length < 10
                                                ? "Top 10"
                                                : `${m.topCursed.length}`}{" "}
                                              Curse Word
                                              {m.topCursed.length === 1
                                                ? " is"
                                                : "s are"}
                                              :
                                            </span>
                                            <br />
                                            <ul className="list-disc ml-4">
                                              {m.topCursed.map((f, i) => {
                                                return (
                                                  <li key={i}>
                                                    {f.word}: {f.count} times
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>,
                                          {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                          }
                                        );
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    >
                                      <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  ""
                                )}
                                {m?.topLinks && m?.topLinks?.length > 0 ? (
                                  <Tippy
                                    content={m.topLinks.length + " Links"}
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      onClick={() => {
                                        toast(
                                          <div className="Toastify__toast-body_">
                                            <span className="font-bold text-lg text-black dark:text-white">
                                              {data?.dataFile
                                                ? "Their"
                                                : "your"}{" "}
                                              {m.topLinks.length < 10
                                                ? "Top 10"
                                                : `${m.topLinks.length}`}{" "}
                                              Favorite Link
                                              {m.topLinks.length === 1
                                                ? " is"
                                                : "s are"}
                                              :
                                            </span>
                                            <br />
                                            <ul className="list-disc ml-4">
                                              {m.topLinks.map((f, i) => {
                                                return (
                                                  <li key={i}>
                                                    {f.word}: {f.count} times
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>,
                                          {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                          }
                                        );
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    >
                                      <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  ""
                                )}
                                {m?.topDiscordLinks &&
                                m?.topDiscordLinks?.length > 0 ? (
                                  <Tippy
                                    content={
                                      m.topDiscordLinks.length +
                                      " Discord Links"
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      onClick={() => {
                                        toast(
                                          <div className="Toastify__toast-body_">
                                            <span className="font-bold text-lg text-black dark:text-white">
                                              {data?.dataFile
                                                ? "Their"
                                                : "your"}{" "}
                                              {m.topDiscordLinks.length < 10
                                                ? "Top 10"
                                                : `${m.topDiscordLinks.length}`}{" "}
                                              Discord Link
                                              {m.topDiscordLinks.length === 1
                                                ? " is"
                                                : "s are"}
                                              :
                                            </span>
                                            <br />
                                            <ul className="list-disc ml-4">
                                              {m.topDiscordLinks.map((f, i) => {
                                                return (
                                                  <li key={i}>
                                                    {f.word}: {f.count} times
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>,
                                          {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                          }
                                        );
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    >
                                      <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })
                  : topChannels?.map((m, i) => {
                      return (
                        <>
                          <div key={i}>
                            <div className="flex items-center py-10 sm:flex-row h-1 hover:bg-gray-400 dark:hover:bg-[#23272A] px-2 rounded-lg ">
                              <div className="flex items-center max-w-full sm:max-w-4/6">
                                <div className="text-gray-900 dark:text-white font-bold  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                                  <div className="flex items-center text-lg">
                                    {m?.name}
                                  </div>
                                  <span className="text-gray-400 text-sm -mt-2">
                                    {m?.guildName}
                                  </span>
                                </div>
                              </div>
                              <div className="hidden sm:flex items-center self-center ml-auto">
                                {m?.messageCount ? (
                                  <Tippy
                                    content={
                                      m.messageCount
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                      " Messages"
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                      width="24"
                                    >
                                      <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  ""
                                )}
                                {m?.favoriteWords &&
                                m?.favoriteWords.length > 0 ? (
                                  <Tippy
                                    content={`${
                                      m.favoriteWords.length
                                    } Favorite Word${
                                      m.favoriteWords.length > 1 ? "s" : ""
                                    }`}
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      onClick={() => {
                                        toast(
                                          <div className="Toastify__toast-body_">
                                            <span className="font-bold text-lg text-black dark:text-white">
                                              {data?.dataFile
                                                ? "Their"
                                                : "your"}{" "}
                                              {m.favoriteWords.length < 10
                                                ? "Top 10"
                                                : `${m.favoriteWords.length}`}{" "}
                                              Favorite Word
                                              {m.favoriteWords.length === 1
                                                ? " is"
                                                : "s are"}
                                              :
                                            </span>
                                            <br />
                                            <ul className="list-disc ml-4">
                                              {m.favoriteWords.map((f, i) => {
                                                return (
                                                  <li key={i}>
                                                    {f.word}: {f.count} times
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>,
                                          {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                          }
                                        );
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    >
                                      <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  ""
                                )}
                                {m?.topCursed && m?.topCursed?.length > 0 ? (
                                  <Tippy
                                    content={
                                      m.topCursed.length
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                      " Curse Word" +
                                      (m.topCursed.length > 1 ? "s" : "")
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      onClick={() => {
                                        toast(
                                          <div className="Toastify__toast-body_">
                                            <span className="font-bold text-lg text-black dark:text-white">
                                              {data?.dataFile
                                                ? "Their"
                                                : "your"}{" "}
                                              {m.topCursed.length < 10
                                                ? "Top 10"
                                                : `${m.topCursed.length}`}{" "}
                                              Curse Word
                                              {m.topCursed.length === 1
                                                ? " is"
                                                : "s are"}
                                              :
                                            </span>
                                            <br />
                                            <ul className="list-disc ml-4">
                                              {m.topCursed.map((f, i) => {
                                                return (
                                                  <li key={i}>
                                                    {f.word}: {f.count} times
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>,
                                          {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                          }
                                        );
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    >
                                      <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  ""
                                )}
                                {m?.topLinks && m?.topLinks?.length > 0 ? (
                                  <Tippy
                                    content={m.topLinks.length + " Links"}
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      onClick={() => {
                                        toast(
                                          <div className="Toastify__toast-body_">
                                            <span className="font-bold text-lg text-black dark:text-white">
                                              {data?.dataFile
                                                ? "Their"
                                                : "your"}{" "}
                                              {m.topLinks.length < 10
                                                ? "Top 10"
                                                : `${m.topLinks.length}`}{" "}
                                              Favorite Link
                                              {m.topLinks.length === 1
                                                ? " is"
                                                : "s are"}
                                              :
                                            </span>
                                            <br />
                                            <ul className="list-disc ml-4">
                                              {m.topLinks.map((f, i) => {
                                                return (
                                                  <li key={i}>
                                                    {f.word}: {f.count} times
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>,
                                          {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                          }
                                        );
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    >
                                      <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  ""
                                )}
                                {m?.topDiscordLinks &&
                                m?.topDiscordLinks?.length > 0 ? (
                                  <Tippy
                                    content={
                                      m.topDiscordLinks.length +
                                      " Discord Links"
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      onClick={() => {
                                        toast(
                                          <div className="Toastify__toast-body_">
                                            <span className="font-bold text-lg text-black dark:text-white">
                                              {data?.dataFile
                                                ? "Their"
                                                : "your"}{" "}
                                              {m.topDiscordLinks.length < 10
                                                ? "Top 10"
                                                : `${m.topDiscordLinks.length}`}{" "}
                                              Discord Link
                                              {m.topDiscordLinks.length === 1
                                                ? " is"
                                                : "s are"}
                                              :
                                            </span>
                                            <br />
                                            <ul className="list-disc ml-4">
                                              {m.topDiscordLinks.map((f, i) => {
                                                return (
                                                  <li key={i}>
                                                    {f.word}: {f.count} times
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>,
                                          {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                          }
                                        );
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    >
                                      <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })
                : ""}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:grid my-4 grid-rows-2 grid-flow-col gap-4 mx-10 mt-4">
        <div className="px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg row-span-3 flex items-center justify-center">
          <div className="mr-14 ml-8">
            <span className="text-gray-900 dark:text-white font-bold text-5xl">
              {data?.dataFile ? "Their" : "Your"} <br /> Discord <br /> Bots
            </span>
          </div>
          <div className="grid grid-cols-10 justify-items-center gap-3">
            {data?.bots && data?.bots?.length > 0
              ? data.bots
                  .sort((a, b) => {
                    if (a.verified && !b.verified) {
                      return -1;
                    }
                    if (!a.verified && b.verified) {
                      return 1;
                    }
                    return 0;
                  })
                  .map((b, i) => {
                    return (
                      <div className="cursor-pointer " key={i} id={"bot_" + i}>
                        <Tippy
                          content={`${b?.verified ? "[🗸 VERIFIED]" : ""} ${
                            b.name
                          }`}
                          animation="scale"
                          className="shadow-xl"
                        >
                          <div className="text-5xl p-1 rounded-full flex items-center justify-center ring-2 ring-gray-300 dark:ring-gray-500 opacity-90 hover:opacity-100">
                            <Image
                              src={
                                !b?.avatar?.endsWith("null.png")
                                  ? b?.avatar
                                  : "https://cdn.discordapp.com/embed/avatars/" +
                                    Math.floor(Math.random() * 5) +
                                    ".png"
                              }
                              alt={b.name}
                              width={62}
                              height={62}
                              className="rounded-full"
                              onError={() => {
                                const bot__ = document.getElementById(
                                  "bot_" + i
                                );
                                if (bot__) bot__.style.display = "none";
                              }}
                            />
                          </div>
                        </Tippy>
                      </div>
                    );
                  })
              : ""}
          </div>{" "}
          {!data?.bots ? (
            <div className="text-center text-gray-900 dark:text-white font-bold text-xl">
              No Bots were found or this option is disabled
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="px-4 py-2 lg:my-0 my-4 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg row-span-3 col-span-2 ">
          <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2 mt-2">
            {data?.dataFile ? "Their" : "Your"} Payments
          </h3>
          {!data?.payments ? (
            <div className="flex items-center gap-2">
              {" "}
              <span className="text-gray-900 dark:text-white font-bold">
                {data?.dataFile ? "They " : "You "}have no payments or this
                option is disabled
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white text-xl flex items-center">
                  <Tippy
                    content="How much did I spend?"
                    animation="scale"
                    className="shadow-xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="40"
                      width="40"
                      className="mr-2 fill-black dark:fill-white cursor-pointer opacity-90 hover:opacity-100"
                    >
                      <path d="M4.458 33.333q-1.166 0-1.979-.812-.812-.813-.812-1.979V11.667h2.791v18.875h28.875v2.791ZM10 27.792q-1.167 0-1.979-.813-.813-.812-.813-1.979V9.458q0-1.166.813-1.979.812-.812 1.979-.812h25.542q1.166 0 1.979.812.812.813.812 1.979V25q0 1.167-.812 1.979-.813.813-1.979.813ZM10 25h3.875q0-1.625-1.125-2.75T10 21.125V25Zm21.667 0h3.875v-3.875q-1.625 0-2.75 1.125T31.667 25Zm-8.875-2.792q2.083 0 3.541-1.458 1.459-1.458 1.459-3.542 0-2.083-1.459-3.541-1.458-1.459-3.541-1.459-2.084 0-3.542 1.459-1.458 1.458-1.458 3.541 0 2.084 1.458 3.542 1.458 1.458 3.542 1.458ZM10 13.333q1.625 0 2.75-1.125t1.125-2.75H10Zm25.542 0V9.458h-3.875q0 1.625 1.125 2.75t2.75 1.125Z" />
                    </svg>
                  </Tippy>
                  {data?.dataFile ? "They " : "You "}spent{" "}
                  <p className="mx-1 font-extrabold text-blue-500 inline-flex">
                    <CountUp
                      end={data?.payments?.total || 0}
                      separator=","
                      useGrouping={true}
                      start={0}
                      delay={2}
                    />
                    {data?.payments?.transactions?.length > 0 ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currencies.find(
                            (a) =>
                              a.abbreviation.toLowerCase() ===
                              Utils.getMostUsedCurrency(
                                data.payments.transactions
                              )
                          )?.symbol,
                        }}
                      ></div>
                    ) : (
                      "$"
                    )}
                  </p>{" "}
                  on Discord
                </span>
              </div>
              <h3 className="text-gray-900 dark:text-white font-bold text-xl mt-2">
                {data?.dataFile ? "Their" : "Your"} Transactions
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white font-bold">
                  {!data?.payments?.transactions
                    ? `${
                        data?.dataFile ? "They " : "You "
                      } have no transactions`
                    : ""}
                </span>
                <ul className="text-gray-900 dark:text-white text-xl font-bold list-disc mt-2 ml-6">
                  {data?.payments?.transactions?.map((t, i) => {
                    return (
                      <li key={i}>
                        <div className="inline-flex">
                          <p className="mx-1 font-extrabold text-blue-500 inline-flex">
                            <CountUp
                              end={t?.amount ? t.amount : 0}
                              separator=","
                              useGrouping={true}
                              start={0}
                              delay={2}
                            />
                            <div
                              dangerouslySetInnerHTML={{
                                __html: currencies?.find(
                                  (a) =>
                                    a?.abbreviation.toLowerCase() ===
                                    t?.currency
                                )?.symbol,
                              }}
                            ></div>
                          </p>
                          at
                          <Tippy
                            content={`${moment(t?.date).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )} (${moment(t?.date).fromNow()})`}
                          >
                            <p className="mx-1 font-extrabold text-blue-500 cursor-pointer">
                              {" "}
                              {moment(t?.date).format("MMMM Do")}
                            </p>
                          </Tippy>
                          for {t?.information}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <h3 className="text-gray-900 dark:text-white font-bold text-xl mt-2 flex items-center">
                Gifted Nitro{" "}
                <Tippy
                  content={
                    <>
                      <div className="text-white text-xl font-bold">
                        What is Gifted Nitro?
                      </div>
                      <p className="text-white text-lg ">
                        Gifted Nitro is the Nitro Gifted to{" "}
                        {data?.dataFile ? "them " : "you "} by others.
                      </p>
                    </>
                  }
                  animation="scale"
                  className="shadow-xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    width="24"
                    className="cursor-pointer fill-black dark:fill-white ml-2 opacity-90 hover:opacity-100"
                  >
                    <path d="M10.625 17.375h2.75V11h-2.75ZM12 9.5q.65 0 1.075-.438Q13.5 8.625 13.5 8q0-.65-.425-1.075Q12.65 6.5 12 6.5q-.625 0-1.062.425Q10.5 7.35 10.5 8q0 .625.438 1.062.437.438 1.062.438Zm0 13.35q-2.275 0-4.25-.85t-3.438-2.312Q2.85 18.225 2 16.25q-.85-1.975-.85-4.25T2 7.75q.85-1.975 2.312-3.438Q5.775 2.85 7.75 2q1.975-.85 4.25-.85t4.25.85q1.975.85 3.438 2.312Q21.15 5.775 22 7.75q.85 1.975.85 4.25T22 16.25q-.85 1.975-2.312 3.438Q18.225 21.15 16.25 22q-1.975.85-4.25.85Z" />
                  </svg>
                </Tippy>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white font-bold">
                  {!data?.payments?.giftedNitro
                    ? `${
                        data?.dataFile ? "They " : "You "
                      } have no gifted nitro`
                    : ""}
                </span>
                <ul className="text-gray-900 dark:text-white text-xl font-bold list-disc mt-2 ml-6">
                  {data?.payments?.giftedNitro
                    ? Object.keys(data?.payments?.giftedNitro)?.map((t, i) => {
                        return (
                          <li key={i}>
                            <div className="inline-flex">
                              {t}:
                              <p className="mx-1 font-extrabold text-blue-500">
                                <CountUp
                                  end={data?.payments?.giftedNitro[t]}
                                  separator=","
                                  useGrouping={true}
                                  start={0}
                                  delay={2}
                                />
                              </p>
                            </div>
                          </li>
                        );
                      })
                    : ""}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="gap-4 mx-10 mt-4 pb-10">
        <div className="px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg text-left w-full">
          <span className="text-gray-900 dark:text-white text-4xl font-bold flex items-center">
            Statistics{" "}
            <Tippy
              content={
                <>
                  <div className="text-white text-xl font-bold">
                    What are Statistics?
                  </div>
                  <p className="text-white text-lg ">
                    Statistics are analytic data used by Discord for a better
                    user experience.
                  </p>
                  <b className="text-red-400 text-lg pt-1 flex items-center">
                    <svg
                      className="fill-red-400 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                    >
                      <path d="M.275 21.425 12 1.15l11.725 20.275ZM12 17.925q.45 0 .788-.338.337-.337.337-.787t-.337-.775Q12.45 15.7 12 15.7t-.787.325q-.338.325-.338.775t.338.787q.337.338.787.338ZM11 15h2v-4.725h-2Z" />
                    </svg>{" "}
                    Some Analytics may be inacurrate
                  </b>
                </>
              }
              animation="scale"
              className="shadow-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                className="cursor-pointer fill-black dark:fill-white ml-2 opacity-90 hover:opacity-100"
              >
                <path d="M10.625 17.375h2.75V11h-2.75ZM12 9.5q.65 0 1.075-.438Q13.5 8.625 13.5 8q0-.65-.425-1.075Q12.65 6.5 12 6.5q-.625 0-1.062.425Q10.5 7.35 10.5 8q0 .625.438 1.062.437.438 1.062.438Zm0 13.35q-2.275 0-4.25-.85t-3.438-2.312Q2.85 18.225 2 16.25q-.85-1.975-.85-4.25T2 7.75q.85-1.975 2.312-3.438Q5.775 2.85 7.75 2q1.975-.85 4.25-.85t4.25.85q1.975.85 3.438 2.312Q21.15 5.775 22 7.75q.85 1.975.85 4.25T22 16.25q-.85 1.975-2.312 3.438Q18.225 21.15 16.25 22q-1.975.85-4.25.85Z" />
              </svg>
            </Tippy>
          </span>
          <ul className="text-gray-900 dark:text-white text-xl font-bold list-disc mt-2 ml-6">
            {data?.statistics
              ? Object.keys(data?.statistics)?.map((t, i) => {
                  if (!t) return;
                  if (EventsJSON?.events[t]) {
                    return (
                      <li key={i}>
                        <div className="inline-flex">
                          <p className="mx-1 font-extrabold text-blue-500">
                            <CountUp
                              end={data?.statistics[t]}
                              separator=","
                              useGrouping={true}
                              start={0}
                              delay={2}
                            />
                          </p>{" "}
                          {EventsJSON?.events[t]}
                        </div>
                      </li>
                    );
                  } else if (t === "averageMessages") {
                    return (
                      <li key={i}>
                        <div className="inline-flex">
                          You send ~{" "}
                          <p className="mx-1 font-extrabold text-blue-500">
                            <CountUp
                              end={data?.statistics[t].day}
                              separator=","
                              useGrouping={true}
                              start={0}
                              delay={2}
                            />
                          </p>
                          Average Messages messages per day,{" "}
                          <p className="mx-1 font-extrabold text-blue-500">
                            <CountUp
                              end={data?.statistics[t].week}
                              separator=","
                              useGrouping={true}
                              start={0}
                              delay={2}
                            />
                          </p>{" "}
                          messages per week,{" "}
                          <p className="mx-1 font-extrabold text-blue-500">
                            <CountUp
                              end={data?.statistics[t].month}
                              separator=","
                              useGrouping={true}
                              start={0}
                              delay={2}
                            />
                          </p>{" "}
                          messages per month, and{" "}
                          <p className="mx-1 font-extrabold text-blue-500">
                            <CountUp
                              end={data?.statistics[t].year}
                              separator=","
                              useGrouping={true}
                              start={0}
                              delay={2}
                            />
                          </p>{" "}
                          messages per year.
                        </div>
                      </li>
                    );
                  } else if (t === "averageOpenCount") {
                    return (
                      <li key={i}>
                        <div className="inline-flex">
                          You open Discord ~{" "}
                          <p className="mx-1 font-extrabold text-blue-500">
                            <CountUp
                              end={data?.statistics[t].day}
                              separator=","
                              useGrouping={true}
                              start={0}
                              delay={2}
                            />
                          </p>
                          times per day,{" "}
                          <p className="mx-1 font-extrabold text-blue-500">
                            <CountUp
                              end={data?.statistics[t].week}
                              separator=","
                              useGrouping={true}
                              start={0}
                              delay={2}
                            />
                          </p>{" "}
                          times per week,{" "}
                          <p className="mx-1 font-extrabold text-blue-500">
                            <CountUp
                              end={data?.statistics[t].month}
                              separator=","
                              useGrouping={true}
                              start={0}
                              delay={2}
                            />
                          </p>{" "}
                          times per month, and{" "}
                          <p className="mx-1 font-extrabold text-blue-500">
                            <CountUp
                              end={data?.statistics[t].year}
                              separator=","
                              useGrouping={true}
                              start={0}
                              delay={2}
                            />
                          </p>{" "}
                          times per year.
                        </div>
                      </li>
                    );
                  }
                })
              : "This option was disabled"}
          </ul>
        </div>
      </div>
      <a
        href="https://github.com/peterhanania/discord-package"
        target="_blank"
        rel="noreferrer"
      >
        <div className="fixed bottom-5 right-5 hidden lg:block opacity-70 hover:opacity-100 cursor-pointer">
          <div className="bg-gray-300 dark:bg-[#232323] px-6 py-2">
            <div className="flex justify-start items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                className="fill-yellow-300 mr-2"
              >
                <path d="m4.975 23.275 2.65-8.65L.55 9.575h8.675L12 .475l2.775 9.1h8.675l-7.075 5.05 2.675 8.65-7.025-5.35Z" />
              </svg>
              <span className="text-gray-900 dark:text-white font-bold">
                Star this Repository
              </span>
            </div>
            <p className="text-gray-900 dark:text-white text-sm max-w-[200px] text-left">
              Enjoying this Repository? Star it on Github! It means a lot.
            </p>
          </div>
        </div>
      </a>
    </div>
  ) : (
    ""
  );
}
