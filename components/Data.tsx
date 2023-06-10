import Image from "next/image";
import Badges from "./json/badges/index.json";
import Tippy from "@tippyjs/react";
import moment from "moment";
import emojis from "./json/demo/emojis.json";
import Utils from "./utils";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast, ToastContainer } from "react-toastify";
import EventsJSON from "./json/events.json";
import Settings from "./settings";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
import Highchartsaccessibility from "highcharts/modules/accessibility";
import { useSnackbar } from "notistack";
import Connections from "./json/Connections.json";
import {
  topChannelsAtom,
  topDMsAtom,
  topGroupDMsAtom,
  topGuildsAtom,
} from "./atoms/data";
import { useAtom } from "jotai";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
// twe-emoji, will remove if it uses so much bandwidth
import Twemoji from "react-twemoji";
import { Dialog, Transition } from "@headlessui/react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
  HighchartsExportData(Highcharts);
  Highchartsaccessibility(Highcharts);
}

function loadTenor() {
  var embedurl = "https://tenor.com/embed/";
  var canonical = document.querySelector("link[rel='canonical']");

  var elts = document.querySelectorAll(
    ".tenor-embed:not([data-processed]), .tenor-gif-embed:not([data-processed])"
  );
  let e;
  for (var i = 0; i < elts.length; ++i) {
    e = elts[i];
    e.setAttribute("data-processed", "true");
    var embedSubPath = e.getAttribute("data-postid");
    if (!embedSubPath) {
      embedSubPath = e.getAttribute("data-type");
    }
    if (!embedSubPath) {
      embedSubPath = e.getAttribute("data-insights-term");
      if (embedSubPath) {
        embedSubPath = "insights/" + embedSubPath.replace(/\s+/g, "-");
        embedSubPath += "?range=" + e.getAttribute("data-range");
        embedSubPath += "&timestamp=" + e.getAttribute("data-timestamp");
      }
    }

    var iframe = document.createElement("iframe");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("scrolling", "no");
    var root;
    if (e.hasAttribute("data-height")) {
      iframe.setAttribute("width", "400px");
      iframe.setAttribute("height", "200px");
      root = iframe;
    } else {
      var framewrapper = document.createElement("div");
      //var aspect = 0.959375
      e.setAttribute(
        "style",
        "width:" + e.getAttribute("data-width") + ";" + "position:relative;"
      );
      framewrapper.setAttribute(
        "style",
        "padding-top: 228px"
        //+ (1 / aspect) * 100 + "%;"
      );
      iframe.setAttribute(
        "style",
        "position:absolute;top:0;left:0;width:400px;height:200px;"
      );
      framewrapper.appendChild(iframe);
      root = framewrapper;
    }

    var url = embedurl + embedSubPath;
    var sharemethod = e.getAttribute("data-share-method") || "tenor";
    if (sharemethod == "host") {
      var hosturl;
      if (canonical) hosturl = (canonical as any).href;
      else hosturl = document.location.href;
      url += "?canonicalurl=" + hosturl;
    }
    iframe.setAttribute("src", url);
    e.innerHTML = "";
    e.appendChild(root);
  }
}

function hasClass(el: Element, cl: string): boolean {
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

const days_daily = new Array(7)
  .fill(0)
  .map((v, i) =>
    i == 0
      ? "Sunday"
      : i == 1
      ? "Monday"
      : i == 2
      ? "Tuesday"
      : i == 3
      ? "Wednesday"
      : i == 4
      ? "Thursday"
      : i == 5
      ? "Friday"
      : "Saturday"
  );

const days_monthly = new Array(12)
  .fill(0)
  .map((v, i) =>
    i == 0
      ? "January"
      : i == 1
      ? "February"
      : i == 2
      ? "March"
      : i == 3
      ? "April"
      : i == 4
      ? "May"
      : i == 5
      ? "June"
      : i == 6
      ? "July"
      : i == 7
      ? "August"
      : i == 8
      ? "September"
      : i == 9
      ? "October"
      : i == 10
      ? "November"
      : "December"
  );

const icons = {
  DISCORD_EMPLOYEE: (
    <Image
      unoptimized={true}
      src="https://i.imgur.com/6eIBtYR.png"
      width={42}
      height={42}
      alt="DISCORD_EMPLOYEE"
      draggable="false"
    />
  ),
  DISCORD_PARTNER: (
    <Image
      unoptimized={true}
      src="https://i.imgur.com/hpTiFXi.png"
      width={42}
      height={42}
      alt="DISCORD_PARTNER"
      draggable="false"
    />
  ),
  HYPESQUAD_EVENTS: (
    <Image
      unoptimized={true}
      src="https://i.imgur.com/RzA4bXZ.png"
      width={42}
      height={42}
      alt="HYPESQUAD_EVENTS"
      draggable="false"
    />
  ),
  BUG_HUNTER_LEVEL_1: (
    <Image
      unoptimized={true}
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
      unoptimized={true}
      src="https://i.imgur.com/mwFPsVv.png"
      width={42}
      height={42}
      alt="HOUSE_BRAVERY"
      draggable="false"
    />
  ),
  HOUSE_BRILLIANCE: (
    <Image
      unoptimized={true}
      src="https://i.imgur.com/UNpQI3M.png"
      width={42}
      height={42}
      alt="HOUSE_BRILLIANCE"
      draggable="false"
    />
  ),
  HOUSE_BALANCE: (
    <Image
      unoptimized={true}
      src="https://i.imgur.com/Jw2Xyx6.png"
      width={42}
      height={42}
      alt="HOUSE_BALANCE"
      draggable="false"
    />
  ),
  EARLY_SUPPORTER: (
    <Image
      unoptimized={true}
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
  SELF_DELETED: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-red-600"
    >
      <path d="M21.55 31.5q.05-3.6.825-5.25.775-1.65 2.925-3.6 2.1-1.9 3.225-3.525t1.125-3.475q0-2.25-1.5-3.75t-4.2-1.5q-2.6 0-4 1.475T17.9 14.95l-4.2-1.85q1.1-2.95 3.725-5.025T23.95 6q5 0 7.7 2.775t2.7 6.675q0 2.4-1.025 4.35-1.025 1.95-3.275 4.1-2.45 2.35-2.95 3.6t-.55 4Zm2.4 12.5q-1.45 0-2.475-1.025Q20.45 41.95 20.45 40.5q0-1.45 1.025-2.475Q22.5 37 23.95 37q1.45 0 2.475 1.025Q27.45 39.05 27.45 40.5q0 1.45-1.025 2.475Q25.4 44 23.95 44Z" />
    </svg>
  ),
  DISABLED_SUSPICIOUS_ACTIVITY: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-red-600"
    >
      <path d="M21.55 31.5q.05-3.6.825-5.25.775-1.65 2.925-3.6 2.1-1.9 3.225-3.525t1.125-3.475q0-2.25-1.5-3.75t-4.2-1.5q-2.6 0-4 1.475T17.9 14.95l-4.2-1.85q1.1-2.95 3.725-5.025T23.95 6q5 0 7.7 2.775t2.7 6.675q0 2.4-1.025 4.35-1.025 1.95-3.275 4.1-2.45 2.35-2.95 3.6t-.55 4Zm2.4 12.5q-1.45 0-2.475-1.025Q20.45 41.95 20.45 40.5q0-1.45 1.025-2.475Q22.5 37 23.95 37q1.45 0 2.475 1.025Q27.45 39.05 27.45 40.5q0 1.45-1.025 2.475Q25.4 44 23.95 44Z" />
    </svg>
  ),
  DELETED: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-red-600"
    >
      <path d="M21.55 31.5q.05-3.6.825-5.25.775-1.65 2.925-3.6 2.1-1.9 3.225-3.525t1.125-3.475q0-2.25-1.5-3.75t-4.2-1.5q-2.6 0-4 1.475T17.9 14.95l-4.2-1.85q1.1-2.95 3.725-5.025T23.95 6q5 0 7.7 2.775t2.7 6.675q0 2.4-1.025 4.35-1.025 1.95-3.275 4.1-2.45 2.35-2.95 3.6t-.55 4Zm2.4 12.5q-1.45 0-2.475-1.025Q20.45 41.95 20.45 40.5q0-1.45 1.025-2.475Q22.5 37 23.95 37q1.45 0 2.475 1.025Q27.45 39.05 27.45 40.5q0 1.45-1.025 2.475Q25.4 44 23.95 44Z" />
    </svg>
  ),
  HIGH_GLOBAL_RATE_LIMIT: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      width="48"
      className="fill-red-600"
    >
      <path d="M21.55 31.5q.05-3.6.825-5.25.775-1.65 2.925-3.6 2.1-1.9 3.225-3.525t1.125-3.475q0-2.25-1.5-3.75t-4.2-1.5q-2.6 0-4 1.475T17.9 14.95l-4.2-1.85q1.1-2.95 3.725-5.025T23.95 6q5 0 7.7 2.775t2.7 6.675q0 2.4-1.025 4.35-1.025 1.95-3.275 4.1-2.45 2.35-2.95 3.6t-.55 4Zm2.4 12.5q-1.45 0-2.475-1.025Q20.45 41.95 20.45 40.5q0-1.45 1.025-2.475Q22.5 37 23.95 37q1.45 0 2.475 1.025Q27.45 39.05 27.45 40.5q0 1.45-1.025 2.475Q25.4 44 23.95 44Z" />
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
      unoptimized={true}
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
      unoptimized={true}
      src="https://i.imgur.com/Gs2JVkP.png"
      width={42}
      height={42}
      alt="VERIFIED_BOT"
      draggable="false"
    />
  ),
  VERIFIED_TRUE: (
    <Image
      unoptimized={true}
      src="https://i.imgur.com/XieNzv4.png"
      width={42}
      height={42}
      alt="VERIFIED_BOT_DEVELOPER"
      draggable="false"
    />
  ),
  VERIFIED_BOT_DEVELOPER: (
    <Image
      unoptimized={true}
      src="https://i.imgur.com/XieNzv4.png"
      width={42}
      height={42}
      alt="VERIFIED_BOT_DEVELOPER"
      draggable="false"
    />
  ),
  CERTIFIED_MODERATOR: (
    <Image
      unoptimized={true}
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
  ACTIVE_DEVELOPER: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.9443 8L8 12.9443V35.0558L12.9443 40H35.0556L40 35.0558V12.9443L35.0558 8H12.9443ZM21.7164 32.851H17.291C17.291 29.1904 14.3134 26.2128 10.6528 26.2128V21.7872C14.3134 21.7872 17.291 18.8097 17.291 15.1491H21.7164C21.7164 18.7808 19.9337 21.9816 17.2226 24C19.9337 26.0186 21.7164 29.2192 21.7164 32.851ZM37.3334 26.2128C33.6728 26.2128 30.6952 29.1904 30.6952 32.851H26.2696C26.2696 29.2192 28.0526 26.0186 30.7636 24C28.0526 21.9816 26.2696 18.7808 26.2696 15.1491H30.6952C30.6952 18.8097 33.6728 21.7872 37.3334 21.7872V26.2128Z"
        fill="#2EA967"
      />
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
      unoptimized={true}
      src="https://i.imgur.com/LcyKRvv.png["
      width={42}
      height={42}
      alt="nitro"
      draggable="false"
    />
  ),
  nitro_until: (
    <Image
      unoptimized={true}
      src="https://i.imgur.com/LcyKRvv.png["
      width={42}
      height={42}
      alt="nitro"
      draggable="false"
    />
  ),
};

function makeData(data: any, days: any): Array<any> {
  const day = new Array(days).fill(0).map((v, i) => v + i);
  const data_day = data.map((v: any, i: number): any => [day[i], v]);
  return data_day;
}

const statIcons = {
  acceptedInstantInvite: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      add_link
    </span>
  ),
  activityUpdated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      detection_and_zone
    </span>
  ),
  addChannelRecipient: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      group_add
    </span>
  ),
  addReaction: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      add_reaction
    </span>
  ),
  appCrashed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      emergency_home
    </span>
  ),
  applicationClosed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      phonelink_lock
    </span>
  ),
  applicationCreated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      phonelink_ring
    </span>
  ),
  applicationDeleted: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      phonelink_erase
    </span>
  ),
  appOpened: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      pinch_zoom_out
    </span>
  ),
  botAbused: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      smart_toy
    </span>
  ),
  botTokenCompromised: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      sentiment_very_dissatisfied
    </span>
  ),
  callReportProblem: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      phone_disabled
    </span>
  ),
  captchaServed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      add_to_home_screen
    </span>
  ),
  captchaSolved: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      security_update_good
    </span>
  ),
  changeLogClosed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      file_open
    </span>
  ),
  changeLogOpened: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      folder_off
    </span>
  ),
  channelDeleted: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      delete
    </span>
  ),
  channelOpened: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      ads_click
    </span>
  ),
  channelPermissionsOverwriteUpdated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      drive_file_rename_outline
    </span>
  ),
  channelUpdated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      task
    </span>
  ),
  closeTutorial: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      close_fullscreen
    </span>
  ),
  copyInstantInvite: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      copy_all
    </span>
  ),
  createChannel: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      create_new_folder
    </span>
  ),
  createEmoji: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      face_retouching_natural
    </span>
  ),
  createGuild: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      group
    </span>
  ),
  createGuildViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      diversity_1
    </span>
  ),
  createInstantInvite: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      draw
    </span>
  ),
  customStatusUpdated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      system_update
    </span>
  ),
  dataRequestCompleted: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      where_to_vote
    </span>
  ),
  deleteEmoji: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      face_retouching_off
    </span>
  ),
  deleteGuild: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      group_off
    </span>
  ),
  devPortalPageViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      document_scanner
    </span>
  ),
  dmListViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      pageview
    </span>
  ),
  emailOpened: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      mark_email_read
    </span>
  ),
  emailSent: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      outgoing_mail
    </span>
  ),
  externalDynamicLinkReceived: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      share
    </span>
  ),
  friendAddViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      streetview
    </span>
  ),
  friendRequestFailed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      person_remove
    </span>
  ),
  friendsListViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      featured_play_list
    </span>
  ),
  giftCodeCopied: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      difference
    </span>
  ),
  giftCodeCreated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      control_point_duplicate
    </span>
  ),
  giftCodeRevoked: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      crisis_alert
    </span>
  ),
  giftCodeSent: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      redeem
    </span>
  ),
  guildBotAdded: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      precision_manufacturing
    </span>
  ),
  guildDiscoveryViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      explore
    </span>
  ),
  guildInsightsSettingsCtaClicked: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      ads_click
    </span>
  ),
  guildJoined: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      groups_2
    </span>
  ),
  guildMemberUpdated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      manage_accounts
    </span>
  ),
  guildRoleUpdated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      settings_accessibility
    </span>
  ),
  guildSettingsDiscoveryViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      settings_applications
    </span>
  ),
  guildSettingsUpdated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      settings_suggest
    </span>
  ),
  guildViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      preview
    </span>
  ),
  inboxChannelClicked: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      archive
    </span>
  ),
  inviteAppOpened: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      door_open
    </span>
  ),
  inviteOpened: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      pinch_zoom_out
    </span>
  ),
  inviteSent: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      outbox
    </span>
  ),
  inviteViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      preview
    </span>
  ),
  joinCall: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      call
    </span>
  ),
  joinGuildViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      preview
    </span>
  ),
  joinVoiceChannel: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      record_voice_over
    </span>
  ),
  keyboardModeToggled: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      keyboard
    </span>
  ),
  keyboardShortcutUsed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      keyboard_hide
    </span>
  ),
  leaveGuild: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      exit_to_app
    </span>
  ),
  leaveVoiceChannel: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      voice_over_off
    </span>
  ),
  loginAttempted: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      fmd_bad
    </span>
  ),
  loginSuccessful: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      login
    </span>
  ),
  memberListViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      preview
    </span>
  ),
  messageAttachmentUpdated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      attach_email
    </span>
  ),
  messageEdited: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      edit
    </span>
  ),
  messageEditUpArrow: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      arrow_drop_up
    </span>
  ),
  modalDismissed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      cancel_presentation
    </span>
  ),
  newLoginLocation: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      add_location_alt
    </span>
  ),
  notificationClicked: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      notification_add
    </span>
  ),
  notificationSettingsUpdated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      edit_notifications
    </span>
  ),
  oauth2AuthorizeAccepted: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      task_alt
    </span>
  ),
  oauth2AuthorizeViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      pageview
    </span>
  ),
  openModal: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      present_to_all
    </span>
  ),
  openPopout: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      open_in_full
    </span>
  ),
  permissionsRequested: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      request_page
    </span>
  ),
  pinMessage: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      push_pin
    </span>
  ),
  promotionViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      shopping_cart_checkout
    </span>
  ),
  removeReaction: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      remove
    </span>
  ),
  replyStarted: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      reply
    </span>
  ),
  ringCall: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      ring_volume
    </span>
  ),
  screenshareFailed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      cast
    </span>
  ),
  searchClosed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      search_off
    </span>
  ),
  searchOpened: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      search
    </span>
  ),
  searchResultExpanded: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      zoom_in
    </span>
  ),
  searchResultSortChanged: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      query_stats
    </span>
  ),
  searchResultViewed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      manage_search
    </span>
  ),
  searchStarted: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      pageview
    </span>
  ),
  sendMessage: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      send
    </span>
  ),
  slashCommandUsed: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      extension
    </span>
  ),
  startCall: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      phone_in_talk
    </span>
  ),
  subscriptionCanceled: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      unsubscribe
    </span>
  ),
  transactionCompleted: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      price_check
    </span>
  ),
  updateNote: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      edit_note
    </span>
  ),
  updateUserSettings: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      manage_accounts
    </span>
  ),
  userAccountUpdated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      admin_panel_settings
    </span>
  ),
  userAvatarUpdated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      account_circle
    </span>
  ),
  userPhoneUpdated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      mobile_friendly
    </span>
  ),
  videoStreamEnded: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      stop_screen_share
    </span>
  ),
  videoStreamStarted: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      connected_tv
    </span>
  ),
  viewAsRolesSelected: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      view_timeline
    </span>
  ),
  voiceDisconnect: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      mic_off
    </span>
  ),
  webhookCreated: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      webhook
    </span>
  ),
  webhookDeleted: (
    <span className="material-symbols-rounded lg:text-[42px] md:text-[42px] text-[20px]">
      webhook
    </span>
  ),
};

function copyToClipboard(value: string) {
  const el: HTMLTextAreaElement = document.createElement("textarea");
  el.value = value;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body?.removeChild(el);
}

export default function Data({ data, demo }: any): ReactElement {
  const [topDMs, setTopDMs] = useAtom(topDMsAtom);
  const [topChannels, setTopChannels] = useAtom(topChannelsAtom);
  const [topGuilds, setTopGuilds] = useAtom(topGuildsAtom);
  const [topGroupDMs, setTopGroupDMs] = useAtom(topGroupDMsAtom);
  const [graphOption, setGraphOption] = useState<String | null>("hourly");
  const [graphType, setGraphType] = useState<String | null>("areaspline");
  const [emojiType, setEmojiType] = useState<String | null>(
    data?.messages?.topEmojis && data?.messages?.topEmojis.length
      ? "topEmojis"
      : data?.messages?.topCustomEmojis &&
        data?.messages?.topCustomEmojis.length
      ? "topCustomEmojis"
      : data?.settings?.recentEmojis && data?.settings?.recentEmojis.length
      ? "recentEmojis"
      : null
  );
  const [messageType, setMessageType] = useState<String | null>("channelMode");
  const { enqueueSnackbar } = useSnackbar();
  const noti = (noti: string) => {
    enqueueSnackbar(noti, {
      variant: "success",
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    });
  };

  const [particles, setParticles] = useState<boolean>(false);
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      await console.log(container);
    },
    []
  );

  const [showWalkthrough, setShowWalkthrough] = useState<boolean>(false);
  useEffect(() => {
    if (!localStorage.getItem("showWalkthrough") && window.innerWidth > 1100) {
      setTimeout(() => {
        setShowWalkthrough(true);
      }, 3000);
    }
  }, []);

  function beginWalkthrough() {
    const driver = new Driver({
      animate: true, // Whether to animate or not
      opacity: 0.75,
      stageBackground: "var(--bg-color)",
      allowClose: false,
    });

    driver.defineSteps([
      {
        element: "#walkthrough-1",
        popover: {
          className: "walkthrough",
          title: "Let's get started! 😊",
          description:
            "This box right here, will help you export your data, or regenerate fake data if you are having a demonstration. You can also click on the settings icon to toggle themes and you can hover each of the buttons to know more information. TIP: You can use your keyboard arrows to toggle between steps",
          position: "bottom",
        },
      },
      {
        element: "#blur_1_div",
        popover: {
          className: "walkthrough",
          title: "Basic user information",
          description:
            "This box right here, will give you an overview of your account. Your badges that can be aquired by achieving Discord goals, and some icons that you can hover and click to know more about them. (Ex. messages, favorite words, links) ",
          position: "bottom",
        },
        onNext: () => {
          setEmojiType("topEmojis");
          driver.preventMove();
          setTimeout(() => {
            driver.moveNext();
          }, 200);
        },
      },
      {
        element: "#blur_2_div",
        popover: {
          className: "walkthrough",
          title: "View emoji data",
          description:
            "In this box, you will be able to view your custom emojis, normal emojis, and recently used emojis from Discord. For this one right here, you can view your most used normal emojis. TIP: click on a emoji to copy it to your clipboard!",
          position: "bottom",
        },
        onNext: () => {
          setEmojiType("topCustomEmojis");
          driver.preventMove();
          setTimeout(() => {
            driver.moveNext();
          }, 1000);
        },
      },
      {
        element: "#blur_2_div_1",
        popover: {
          className: "walkthrough",
          title: "View custom emojis",
          description:
            "In this box, you will be able to view your custom emojis. We all like sending custom emojis :) TIP: click on a emoji to copy it to your clipboard!",
          position: "bottom",
        },
        onNext: () => {
          setEmojiType("recentEmojis");
          driver.preventMove();
          setTimeout(() => {
            driver.moveNext();
          }, 500);
        },
        onPrevious: () => {
          setEmojiType("topEmojis");
        },
      },
      {
        element: "#blur_2_div",
        popover: {
          className: "walkthrough",
          title: "View recent emojis",
          description:
            "Recent emojis are the emojis collected by Discord when you use them recently. You can view them here. TIP: click on a emoji to copy it to your clipboard!",
          position: "bottom",
        },
        onPrevious: () => {
          setEmojiType("topCustomEmojis");
        },
      },
      {
        element: "#blur_3_div",
        popover: {
          className: "walkthrough",
          title: "User Preferences",
          description:
            "View some of your discord preferences. TIP: you can click on the guild count to get more detailed information.",
          position: "bottom",
        },
        onPrevious: () => {
          setEmojiType("recentEmojis");
        },
      },
      {
        element: "#blur_4_div",
        popover: {
          className: "walkthrough",
          title: "User Connections",
          description:
            "View your Discord connections. TIP: you can click on some connections to get redirected to your account or you can hover them to check your username. ",
          position: "bottom",
        },
        onNext: () => {
          document
            .getElementById("blur_1_div")
            ?.scrollIntoView({ behavior: "smooth" });
          setGraphOption("hourly");
        },
      },
      {
        element: "#blur_5_div",
        popover: {
          className: "walkthrough",
          title: "📊 User Activity",
          description:
            "View what hour you are most active on Discord.. Is it during the day or at night? 🤔. TIP: you can hover to view more information and drag click to zoom into the chart, you can even click on the icon next to Active Hours to toggle between line and bar graph.",
          position: "top",
        },
        onNext: () => {
          setGraphOption("daily");
        },
      },
      {
        element: "#blur_5_div_1",
        popover: {
          className: "walkthrough",
          title: "📊 User Activity: Daily",
          description:
            "View what day you are most active on Discord.. Weekends? 🤔. TIP: you can hover to view more information and drag click to zoom into the chart, you can even click on the icon next to Active Days to toggle between line and bar graph.",
          position: "top",
        },
        onNext: () => {
          setGraphOption("monthly");
        },
        onPrevious: () => {
          setGraphOption("hourly");
        },
      },
      {
        element: "#blur_5_div",
        popover: {
          className: "walkthrough",
          title: "📊 User Activity: Monthly",
          description:
            "View what month you are most active on Discord.. December? 🤔. TIP: you can hover to view more information and drag click to zoom into the chart, you can even click on the icon next to Active Months to toggle between line and bar graph.",
          position: "top",
        },
        onNext: () => {
          setGraphOption("yearly");
        },
        onPrevious: () => {
          setGraphOption("daily");
        },
      },
      {
        element: "#blur_5_div_1",
        popover: {
          className: "walkthrough",
          title: "📊 User Activity: Yearly",
          description:
            "View what year you are most active on Discord.. 2022? 🤔. TIP: you can hover to view more information and drag click to zoom into the chart, you can even click on the icon next to Active Years to toggle between line and bar graph.",
          position: "top",
        },
        onPrevious: () => {
          setGraphOption("monthly");
        },
      },
      {
        element: "#blur_6_div",
        popover: {
          className: "walkthrough",
          title: "Users.. Here we are!",
          description:
            "This box will show you all the users discord has recorded you texting with, along with more information. Hover the icons on the right or click them to get to know more! You can also use the filter input to filter by name, or ID",
          position: "right",
        },
        onNext: () => {
          setMessageType("channelMode");
        },
        onPrevious: () => {
          setGraphOption("yearly");
        },
      },
      {
        element: "#blur_7_div",
        popover: {
          className: "walkthrough",
          title: "Top Channels",
          description:
            "This box will show you the recorded messages in Discord Channels. You can hover the icons on the right or click them to get to know more! You can also use the filter input to filter by name, or ID, or guild name",
          position: "left",
        },
        onNext: () => {
          setMessageType("guildMode");
        },
      },
      {
        element: "#blur_7_div_1",
        popover: {
          className: "walkthrough",
          title: "Top Guilds",
          description:
            "This box will show you the recorded messages in your top guilds. You can hover the icons on the right or click them to get to know more! You can also use the filter input to filter by name, or ID, or guild name",
          position: "left",
        },
        onNext: () => {
          setMessageType("dmMode");
        },
        onPrevious: () => {
          setMessageType("channelMode");
        },
      },
      {
        element: "#blur_7_div",
        popover: {
          className: "walkthrough",
          title: "Top Group DMs",
          description:
            "This box will show you the recorded messages in your group DMs aka group chat. You can hover the icons on the right or click them to get to know more! You can also use the filter input to filter by name, or ID, or group dm name",
          position: "left",
        },
        onPrevious: () => {
          setMessageType("guildMode");
        },
      },
      {
        element: "#blur_8_div",
        popover: {
          className: "walkthrough",
          title: "🤖 Your Discord Bots",
          description:
            "This box will show you the recorded bots on your account, you can hover each for more information and you can click the avatar to copy the ID.",
          position: "right",
        },
        onPrevious: () => {
          setMessageType("dmMode");
        },
      },
      {
        element: "#blur_9_div",
        popover: {
          className: "walkthrough",
          title: "💰 Your payments",
          description:
            "View information about your payments on Discord. How much did you spend? 💸",
          position: "left",
        },
      },
      {
        element: "#blur_10_div",
        popover: {
          className: "walkthrough",
          title: "📈 Your Statistics",
          description:
            "This box will show you the recorded analytic data used by discord. Analytic data is used to improve Discord and to help you get the best experience possible.",
          position: "top",
        },
      },
      {
        element: "#walkthrough-1",
        popover: {
          className: "walkthrough",
          title: "🎉 You're all set!",
          description:
            "That's all, thank you for taking the quick guide to get to know more about Discord Package & The data used by Discord!",
          position: "bottom",
        },
        onNext: () => {
          setParticles(true);

          setTimeout(() => {
            setParticles(false);
          }, 5000);
        },
      },
    ]);

    driver.start();
  }

  return data ? (
    <div className="h-screen">
      <div className="md:block lg:block hidden">
        <Transition
          show={showWalkthrough}
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
              localStorage.setItem("showWalkthrough", "true");
              setShowWalkthrough(false);
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
                      get Started with discord package
                    </h3>
                    <button
                      onClick={() => {
                        localStorage.setItem("showWalkthrough", "true");
                        setShowWalkthrough(false);
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
                      🎊 Welcome to Discord Package, we hope you enjoy your
                      visit. Are you interested in a 2 minute walkthrough/guide
                      to help you get most of the features?
                    </code>

                    <div className="mt-2">
                      <Image
                        src={
                          process.env.NEXT_PUBLIC_DOMAIN +
                          "/help/step_by_step.png"
                        }
                        alt="steps"
                        height={550}
                        width={1000}
                        unoptimized={true}
                      ></Image>
                    </div>
                  </div>

                  <div className="flex items-center p-6 space-x-2 rounded-b bg-[#2b2d31]">
                    <button
                      onClick={() => {
                        setShowWalkthrough(false);
                        localStorage.setItem("showWalkthrough", "true");
                        beginWalkthrough();
                      }}
                      type="button"
                      className="button-green text-gray-200 mr-2"
                    >
                      Let&apos;s do it!
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem("showWalkthrough", "true");
                        setShowWalkthrough(false);
                      }}
                      type="button"
                      className="button-cancel text-gray-200"
                    >
                      No Thanks
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>

      {particles ? (
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            fullScreen: {
              zIndex: 9999999,
            },
            particles: {
              color: {
                value: ["#FFFFFF", "#FFd700"],
              },
              move: {
                direction: "bottom",
                enable: true,
                outModes: {
                  default: "out",
                },
                size: true,
                speed: {
                  min: 1,
                  max: 3,
                },
              },
              number: {
                value: 500,
                density: {
                  enable: true,
                  area: 800,
                },
              },
              opacity: {
                value: 1,
                animation: {
                  enable: false,
                  startValue: "max",
                  destroy: "min",
                  speed: 0.3,
                  sync: true,
                },
              },
              rotate: {
                value: {
                  min: 0,
                  max: 360,
                },
                direction: "random",
                move: true,
                animation: {
                  enable: true,
                  speed: 60,
                },
              },
              tilt: {
                direction: "random",
                enable: true,
                move: true,
                value: {
                  min: 0,
                  max: 360,
                },
                animation: {
                  enable: true,
                  speed: 60,
                },
              },
              shape: {
                type: ["circle", "square"],
                options: {},
              },
              size: {
                value: {
                  min: 2,
                  max: 4,
                },
              },
              roll: {
                darken: {
                  enable: true,
                  value: 30,
                },
                enlighten: {
                  enable: true,
                  value: 30,
                },
                enable: true,
                speed: {
                  min: 15,
                  max: 25,
                },
              },
              wobble: {
                distance: 30,
                enable: true,
                move: true,
                speed: {
                  min: -15,
                  max: 15,
                },
              },
            },
          }}
        />
      ) : (
        ""
      )}
      <ToastContainer
        position="top-right"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      <div
        className="lg:flex sm:flex md:flex items-center lg:mx-10 md:mx-8 mx-2 lg:mt-4 md:mt-4 mt-2"
        id="walkthrough-1"
      >
        <Tippy
          zIndex={99999999999999}
          content={
            <>
              <div className="text-white text-lg font-bold">Take a guide</div>
              <p className="text-white text-lg ">
                Get to know all the features within the site in just 2 minutes
                using a simple walkthrough! 😊
              </p>
            </>
          }
          animation="scale"
          className="shadow-xl"
        >
          <div
            onClick={() => {
              beginWalkthrough();
            }}
            className="button-green text-gray-200 hidden md:flex lg:flex items-center gap-1 h-[90px] lg:ml-2 md:ml-2 sm:ml-2 lg:my-0 md:my-0 sm:my-0 my-2 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              className="fill-white cursor-pointer "
            >
              <path d="M11 17h2v-6h-2Zm1-8q.425 0 .713-.288Q13 8.425 13 8t-.287-.713Q12.425 7 12 7t-.712.287Q11 7.575 11 8t.288.712Q11.575 9 12 9Zm0 13q-3.475-.875-5.737-3.988Q4 14.9 4 11.1V5l8-3 8 3v6.1q0 3.8-2.262 6.912Q15.475 21.125 12 22Z" />
            </svg>
            <p>Guide me</p>
          </div>
        </Tippy>
        {!data.dataFile ? (
          <Tippy
            zIndex={99999999999999}
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
              className="button-green text-gray-200 flex items-center gap-1 h-[90px] lg:ml-2 md:ml-2 sm:ml-2 lg:my-0 md:my-0 sm:my-0 my-2 "
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
          <span className="dark:text-white text-gray-900 ml-1">
            You are viewing <b>{data?.user?.username}</b>&apos;s data
          </span>
        )}
        {demo ? (
          <>
            <Tippy
              zIndex={99999999999999}
              content={
                <>
                  <div className="text-white text-lg font-bold">
                    Regenerate Data
                  </div>
                  <p className="text-white text-lg ">
                    Regenerating your data will generate a new set of data,
                    allowing you to see a demonstration without using your data
                    but fake data.
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
                  window.location.reload();
                }}
                className="button-green text-gray-200 flex items-center gap-1 h-[90px] lg:ml-2 md:ml-2 sm:ml-2 lg:my-0 md:my-0 sm:my-0 my-2 "
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
          </>
        ) : (
          ""
        )}
        <Settings />
      </div>
      <div className="lg:mx-10 md:mx-8 mx-2 lg:mt-4 mt-2 px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__delay-1s rounded-lg relative group">
        <div
          id="blur_1"
          className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-hover:block"
          onClick={() => {
            const div = document.getElementById("blur_1_div");
            if (div) {
              div.classList.toggle("blur-xl");
              div.classList.toggle("pointer-events-none");
              div.classList.toggle("select-none");

              const el: any = document.getElementById("blur_1_show");
              if (el) el.classList.toggle("hidden");

              const el2: any = document.getElementById("blur_1_hide");
              if (el) el2.classList.toggle("hidden");
            }
          }}
        >
          <svg
            id="blur_1_show"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            className="fill-black dark:fill-white cursor-pointer pointer-events-auto opacity-80 hover:opacity-100"
          >
            <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
          </svg>
          <svg
            className="fill-black dark:fill-white cursor-pointer pointer-events-auto hidden opacity-80 hover:opacity-100"
            id="blur_1_hide"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
          >
            <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
          </svg>
        </div>
        <div className="flex items-center space-x-4" id="blur_1_div">
          <div
            onClick={(element) => {
              const target = element.target as Element;
              const check = hasClass(target, "animate__animated");
              if (check) {
                target.classList.remove(
                  "animate__animated",
                  "animate__flash",
                  "animate__headShake"
                );

                setTimeout(() => {
                  target.classList.add(
                    "animate__animated",
                    "animate__flash",
                    "animate__headShake"
                  );
                }, 100);
              } else {
                target.classList.add(
                  "animate__animated",
                  "animate__flash",
                  "animate__headShake"
                );
              }
            }}
          >
            <div className="p-1 rounded-full flex items-center justify-center ring-2  dark:ring-gray-500 ring-gray-800 hover:dark:ring-gray-600 hover:ring-gray-900 cursor-pointer">
              <Image
                unoptimized={true}
                id="avatar"
                className="w-10 h-10 rounded-full opacity-90 hover:opacity-100"
                src={
                  data?.user?.avatar
                    ? !data?.user?.avatar.includes(
                        "https://better-default-discord.netlify.app/Icons"
                      )
                      ? `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.webp?size=1024`
                      : data.user.avatar
                    : "https://cdn.discordapp.com/embed/avatars/" +
                      Math.floor(Math.random() * 5) +
                      ".png"
                }
                alt="avatar"
                height={100}
                width={100}
                draggable={false}
                onError={(e) => {
                  (e.target as HTMLImageElement).removeAttribute("srcset");
                  (e.target as HTMLImageElement).src =
                    "https://cdn.discordapp.com/embed/avatars/" +
                    Math.floor(Math.random() * 5) +
                    ".png";
                }}
              />
            </div>
          </div>
          <div
            className="space-y-1 font-medium text-gray-900 dark:text-white uppercase w-full"
            style={{
              fontFamily:
                "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",

              letterSpacing: "0.06em",
            }}
          >
            <div>
              <div className="lg:flex md:flex items-center text-gray-900 dark:text-white">
                <p className="text-xl md:text-2xl lg:text-3xl">
                  {data?.user?.username}
                  {data?.user?.discriminator &&
                    "#" + data?.user?.discriminator.toString().padStart(4, "0")}
                </p>

                <div className="flex items-center">
                  {data?.messages?.characterCount &&
                  data?.messages?.messageCount ? (
                    <Tippy
                      zIndex={99999999999999}
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
                        className="dark:fill-gray-300 dark:hover:fill-white ml-2"
                        width="24"
                      >
                        <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                      </svg>
                    </Tippy>
                  ) : (
                    <Tippy
                      zIndex={99999999999999}
                      content={
                        (data?.dataFile ? "They " : "You ") + "have no messages"
                      }
                      animation="scale"
                      className="shadow-xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        className="dark:fill-gray-300 dark:hover:fill-white cursor-not-allowed ml-2 opacity-60"
                        width="24"
                      >
                        <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                      </svg>
                    </Tippy>
                  )}
                  {data?.messages?.favoriteWords &&
                  data?.messages?.favoriteWords.length > 0 ? (
                    <Tippy
                      zIndex={99999999999999}
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
                                {data.messages.favoriteWords.map(
                                  (f: any, i: number) => {
                                    return (
                                      <li key={i}>
                                        {f.word}: {f.count} time
                                        {f.count > 1 ? "s" : ""}
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
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
                    <Tippy
                      zIndex={99999999999999}
                      content={
                        (data?.dataFile ? "They " : "You ") +
                        "have no favorite words"
                      }
                      animation="scale"
                      className="shadow-xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                      >
                        <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                      </svg>
                    </Tippy>
                  )}
                  {data?.messages?.topCursed &&
                  data?.messages?.topCursed?.length > 0 ? (
                    <Tippy
                      zIndex={99999999999999}
                      content={
                        data.messages.topCursed.length
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                        " Curse Words | Cursed " +
                        Utils.getTopCount(data.messages.topCursed) +
                        " times"
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
                                {data.messages.topCursed.map(
                                  (f: any, i: number) => {
                                    return (
                                      <li key={i}>
                                        {f.word}: {f.count} time
                                        {f.count > 1 ? "s" : ""}
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
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
                    <Tippy
                      zIndex={99999999999999}
                      content={
                        (data?.dataFile ? "They " : "You ") +
                        "have no curse words"
                      }
                      animation="scale"
                      className="shadow-xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                      >
                        <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                      </svg>
                    </Tippy>
                  )}
                  {data?.messages?.topLinks &&
                  data?.messages?.topLinks?.length > 0 ? (
                    <Tippy
                      zIndex={99999999999999}
                      content={
                        data.messages.topLinks.length +
                        " Links | Sent " +
                        Utils.getTopCount(data.messages.topLinks) +
                        " unique total Links"
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
                                {data.messages.topLinks.map(
                                  (f: any, i: number) => {
                                    return (
                                      <li key={i}>
                                        <a
                                          href={f.word}
                                          className="opacity-80 hover:opacity-100"
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          {f.word}
                                        </a>
                                        : {f.count} time
                                        {f.count > 1 ? "s" : ""}
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
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
                    <Tippy
                      zIndex={99999999999999}
                      content={
                        (data?.dataFile ? "They " : "You ") + "have no links"
                      }
                      animation="scale"
                      className="shadow-xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                      >
                        <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                      </svg>
                    </Tippy>
                  )}
                  {data?.messages?.topDiscordLinks &&
                  data?.messages?.topDiscordLinks?.length > 0 ? (
                    <Tippy
                      zIndex={99999999999999}
                      content={
                        data.messages.topDiscordLinks.length +
                        " Discord Links | Sent " +
                        Utils.getTopCount(data.messages.topDiscordLinks) +
                        " unique total Discord links"
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
                                {data.messages.topDiscordLinks.map(
                                  (f: any, i: number) => {
                                    return (
                                      <li key={i}>
                                        <a
                                          href={f.word}
                                          className="opacity-80 hover:opacity-100"
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          {f.word}
                                        </a>
                                        : {f.count} time
                                        {f.count > 1 ? "s" : ""}
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
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
                    <Tippy
                      zIndex={99999999999999}
                      content={
                        (data?.dataFile ? "They " : "You ") +
                        "have no Discord links"
                      }
                      animation="scale"
                      className="shadow-xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                      >
                        <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                      </svg>
                    </Tippy>
                  )}
                  {data?.messages?.oldestMessages &&
                  data?.messages?.oldestMessages?.length > 0 ? (
                    <Tippy
                      zIndex={99999999999999}
                      content={"Your 1000 Oldest Messages"}
                      animation="scale"
                      className="shadow-xl"
                    >
                      <svg
                        onClick={() => {
                          toast(
                            <div className="Toastify__toast-body_">
                              <span className="font-bold text-lg text-black dark:text-white">
                                {data?.dataFile ? "Their" : "Your"} Oldest 1000
                                Message
                                {data.messages.oldestMessages.length === 1
                                  ? " is"
                                  : "s are"}
                                :
                              </span>
                              <br />
                              <ul className="list-disc ml-4">
                                {data.messages.oldestMessages.map(
                                  (f: any, i: number) => {
                                    return (
                                      <li key={i}>
                                        <b>{f.sentence}</b>
                                        <ul>
                                          <li>
                                            - sent at{" "}
                                            {moment(f.timestamp).format(
                                              "MMMM Do YYYY, h:mm:ss a"
                                            )}{" "}
                                            <b>
                                              ({moment(f.timestamp).fromNow()})
                                            </b>
                                          </li>
                                          <li>
                                            - sent to <b>{f.author}</b>
                                          </li>
                                        </ul>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
                          );
                        }}
                        className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                      >
                        <path d="M7.9 20.875q-1.75-1.05-2.825-2.863Q4 16.2 4 14q0-2.625 1.25-4.675T8 5.875q1.5-1.4 2.75-2.138L12 3v3.3q0 .925.625 1.462.625.538 1.4.538.425 0 .813-.175.387-.175.712-.575L16 7q1.8 1.05 2.9 2.912Q20 11.775 20 14q0 2.2-1.075 4.012-1.075 1.813-2.825 2.863.425-.6.663-1.313Q17 18.85 17 18.05q0-1-.375-1.887-.375-.888-1.075-1.588L12 11.1l-3.525 3.475q-.725.725-1.1 1.6Q7 17.05 7 18.05q0 .8.238 1.512.237.713.662 1.313ZM12 21q-1.25 0-2.125-.863Q9 19.275 9 18.05q0-.575.225-1.112.225-.538.65-.963L12 13.9l2.125 2.075q.425.425.65.95.225.525.225 1.125 0 1.225-.875 2.087Q13.25 21 12 21Z" />
                      </svg>
                    </Tippy>
                  ) : (
                    <Tippy
                      zIndex={99999999999999}
                      content={
                        (data?.dataFile ? "They " : "You ") + "have no messages"
                      }
                      animation="scale"
                      className="shadow-xl"
                    >
                      <svg
                        className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                      >
                        <path d="M7.9 20.875q-1.75-1.05-2.825-2.863Q4 16.2 4 14q0-2.625 1.25-4.675T8 5.875q1.5-1.4 2.75-2.138L12 3v3.3q0 .925.625 1.462.625.538 1.4.538.425 0 .813-.175.387-.175.712-.575L16 7q1.8 1.05 2.9 2.912Q20 11.775 20 14q0 2.2-1.075 4.012-1.075 1.813-2.825 2.863.425-.6.663-1.313Q17 18.85 17 18.05q0-1-.375-1.887-.375-.888-1.075-1.588L12 11.1l-3.525 3.475q-.725.725-1.1 1.6Q7 17.05 7 18.05q0 .8.238 1.512.237.713.662 1.313ZM12 21q-1.25 0-2.125-.863Q9 19.275 9 18.05q0-.575.225-1.112.225-.538.65-.963L12 13.9l2.125 2.075q.425.425.65.95.225.525.225 1.125 0 1.225-.875 2.087Q13.25 21 12 21Z" />
                      </svg>
                    </Tippy>
                  )}
                  {data?.messages?.attachmentCount &&
                  data?.messages?.attachmentCount?.length > 0 ? (
                    <Tippy
                      zIndex={99999999999999}
                      content={
                        data.messages.attachmentCount.length + " Attachments"
                      }
                      animation="scale"
                      className="shadow-xl"
                    >
                      <svg
                        onClick={() => {
                          toast(
                            <div className="Toastify__toast-body_">
                              <span className="font-bold text-lg text-black dark:text-white">
                                {data?.dataFile ? "Their " : "Your "}
                                attachment
                                {data.messages.oldestMessages.length === 1
                                  ? ""
                                  : "s"}
                                :
                              </span>
                              <br />
                              <ul className="list-disc ml-4">
                                {data.messages.attachmentCount.map(
                                  (f: any, i: number) => {
                                    return (
                                      <li key={i}>
                                        {f.startsWith("https://tenor.com/") &&
                                        Utils.getTenor(f) ? (
                                          <>
                                            <div
                                              className="tenor-gif-embed"
                                              data-postid={Utils.getTenor(f)}
                                              data-share-method="host"
                                              data-aspect-ratio="0.959375"
                                              data-width="100%"
                                            ></div>
                                          </>
                                        ) : (
                                          <>
                                            <a
                                              target="_blank"
                                              rel="noreferrer"
                                              href={f}
                                              id={f}
                                            >
                                              {/* eslint-disable-next-line @next/next/no-img-element */}
                                              <img
                                                src={f}
                                                alt="attachment"
                                                className="max-h-[200px] max-w-[600px] py-1"
                                                onLoad={() => {
                                                  const img: any =
                                                    document.getElementById(f);
                                                  if (img)
                                                    img.innerHTML = `<p class="text-black dark:text-white font-bold py-1 max-w-[40%]">${f}</p>`;
                                                  img.removeAttribute("href");
                                                }}
                                                onError={() => {
                                                  const img: any =
                                                    document.getElementById(f);
                                                  if (img)
                                                    img.innerHTML = `<p class="text-black dark:text-white font-bold py-1 max-w-[40%]">${f}</p>`;
                                                  img.removeAttribute("href");
                                                }}
                                              />{" "}
                                            </a>
                                          </>
                                        )}
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
                          );

                          setTimeout(() => {
                            loadTenor();
                          }, 1000);
                        }}
                        className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                      >
                        <path d="M7.5 17.5H18V16H7.5q-1.65 0-2.825-1.175Q3.5 13.65 3.5 12q0-1.65 1.175-2.825Q5.85 8 7.5 8H18q1.05 0 1.775.725.725.725.725 1.775 0 1.05-.725 1.775Q19.05 13 18 13H8.5q-.425 0-.712-.288Q7.5 12.425 7.5 12t.288-.713Q8.075 11 8.5 11H18V9.5H8.5q-1.05 0-1.775.725Q6 10.95 6 12q0 1.05.725 1.775.725.725 1.775.725H18q1.65 0 2.825-1.175Q22 12.15 22 10.5q0-1.65-1.175-2.825Q19.65 6.5 18 6.5H7.5q-2.3 0-3.9 1.6T2 12q0 2.3 1.6 3.9t3.9 1.6Z" />
                      </svg>
                    </Tippy>
                  ) : (
                    ""
                  )}
                  {data?.messages?.mentionCount &&
                  Object.keys(data?.messages?.mentionCount)?.length > 0 ? (
                    <Tippy
                      zIndex={99999999999999}
                      content={
                        Object.values(data.messages.mentionCount)?.reduce(
                          (a: any, b: any): number => a + b
                        ) + " Mentions"
                      }
                      animation="scale"
                      className="shadow-xl"
                    >
                      <svg
                        onClick={() => {
                          toast(
                            <div className="Toastify__toast-body_">
                              <span className="font-bold text-lg text-black dark:text-white">
                                {data?.dataFile ? "Their" : "Your"} classified
                                mention
                                {data.messages.oldestMessages.length === 1
                                  ? " is"
                                  : "s are"}
                                :
                              </span>
                              <br />
                              <ul className="list-disc ml-4">
                                <li>
                                  {data.messages.mentionCount.everyone
                                    ? `@everyone: ${data.messages.mentionCount.everyone} times`
                                    : ""}
                                </li>
                                <li>
                                  {data.messages.mentionCount.here
                                    ? `@here: ${data.messages.mentionCount.here} times`
                                    : ""}
                                </li>
                                <li>
                                  {data.messages.mentionCount.user
                                    ? `User: ${data.messages.mentionCount.user} times`
                                    : ""}
                                </li>
                                <li>
                                  {data.messages.mentionCount.channel
                                    ? `Channel: ${data.messages.mentionCount.channel} times`
                                    : ""}
                                </li>
                                <li>
                                  {data.messages.mentionCount.role
                                    ? `Role: ${data.messages.mentionCount.role} times`
                                    : ""}
                                </li>
                              </ul>
                            </div>
                          );
                        }}
                        className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                      >
                        <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.075.788-3.887.787-1.813 2.15-3.175Q6.3 3.575 8.125 2.787 9.95 2 12 2q2.075 0 3.887.787 1.813.788 3.175 2.151 1.363 1.362 2.15 3.175Q22 9.925 22 12v1.45q0 1.475-1.012 2.512Q19.975 17 18.5 17q-.9 0-1.675-.4t-1.275-1.05q-.675.675-1.587 1.063Q13.05 17 12 17q-2.075 0-3.537-1.463Q7 14.075 7 12t1.463-3.538Q9.925 7 12 7t3.538 1.462Q17 9.925 17 12v1.45q0 .725.45 1.137.45.413 1.05.413.6 0 1.05-.413.45-.412.45-1.137V12q0-3.275-2.363-5.638Q15.275 4 12 4 8.725 4 6.362 6.362 4 8.725 4 12t2.362 5.637Q8.725 20 12 20h5v2Zm0-7q1.25 0 2.125-.875T15 12q0-1.25-.875-2.125T12 9q-1.25 0-2.125.875T9 12q0 1.25.875 2.125T12 15Z" />
                      </svg>
                    </Tippy>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <p className="lg:hidden md:hidden text-sm lowercase font-mono">
              badges are only available on larger screens
            </p>
            <div className="lg:flex md:flex items-center gap-1 hidden">
              {data?.user?.badges?.map((m: any, id: number) => {
                if (!(Badges as any)[m]) return null;

                return (
                  <Tippy
                    zIndex={99999999999999}
                    key={id}
                    content={(Badges as any)[m]?.description
                      .replace(
                        /{until}/g,
                        moment(data?.user?.premium_until).format(
                          "MMMM Do YYYY LTS"
                        )
                      )
                      .replace(/{p_2}/g, data?.dataFile ? "Their" : "Your")
                      .replace(/{p_1}/g, data?.dataFile ? "They" : "You")}
                    animation="scale"
                    className="shadow-xl"
                  >
                    <div className="flex cursor-pointer opacity-90 hover:opacity-100">
                      {(icons as any)[m]}
                    </div>
                  </Tippy>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:grid md:grid grid-rows-2 grid-flow-col gap-4 lg:mx-10 md:mx-8 mx-2 lg:mt-4  mt-2">
        <div className="px-4 py-2 mb-2 lg:mb-0 bg-gray-300 dark:bg-[#2b2d31] animate__delay-1s rounded-lg row-span-3 relative group">
          <div
            id="blur_2"
            className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-hover:block"
            onClick={() => {
              const div = document.getElementById("blur_2_div");
              if (div) {
                div.classList.toggle("blur-xl");
                div.classList.toggle("pointer-events-none");
                div.classList.toggle("select-none");

                const el: any = document.getElementById("blur_2_show");
                if (el) el.classList.toggle("hidden");

                const el2: any = document.getElementById("blur_2_hide");
                if (el) el2.classList.toggle("hidden");
              }
            }}
          >
            <svg
              id="blur_2_show"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto opacity-80 hover:opacity-100"
            >
              <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
            </svg>
            <svg
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto hidden opacity-80 hover:opacity-100"
              id="blur_2_hide"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
            >
              <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
            </svg>
          </div>
          <div id="blur_2_div_1">
            {" "}
            <div id="blur_2_div">
              {emojiType ? (
                <ul className="flex items-center rounded-lg mb-1">
                  <li className="flex gap-2">
                    {data?.messages?.topEmojis &&
                    data?.messages?.topEmojis?.length > 0 ? (
                      <div
                        className={
                          "p-2 rounded-lg" +
                          (emojiType !== "topEmojis"
                            ? ""
                            : " bg-gray-400 dark:bg-[#232323]")
                        }
                        onClick={() => {
                          setEmojiType("topEmojis");
                        }}
                      >
                        <Tippy
                          zIndex={99999999999999}
                          content="Your Top Emojis"
                          animation="scale"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                            className="cursor-pointer fill-black dark:fill-white opacity-90 hover:opacity-100"
                          >
                            <path d="M15.7 11.2q.75 0 1.25-.5t.5-1.25q0-.75-.5-1.25t-1.25-.5q-.75 0-1.25.5t-.5 1.25q0 .75.5 1.25t1.25.5Zm-7.4 0q.75 0 1.25-.5t.5-1.25q0-.75-.5-1.25T8.3 7.7q-.75 0-1.25.5t-.5 1.25q0 .75.5 1.25t1.25.5ZM12 18q2.075 0 3.55-1.163 1.475-1.162 2.05-2.787H6.4q.575 1.625 2.05 2.787Q9.925 18 12 18Zm0 4.8q-2.25 0-4.213-.85-1.962-.85-3.424-2.312Q2.9 18.175 2.05 16.212 1.2 14.25 1.2 12t.85-4.225Q2.9 5.8 4.363 4.338q1.462-1.463 3.424-2.301Q9.75 1.2 12 1.2t4.225.837q1.975.838 3.438 2.301 1.462 1.462 2.299 3.437Q22.8 9.75 22.8 12q0 2.25-.838 4.212-.837 1.963-2.299 3.426Q18.2 21.1 16.225 21.95q-1.975.85-4.225.85Z" />
                          </svg>
                        </Tippy>
                      </div>
                    ) : (
                      ""
                    )}
                    {data?.messages?.topCustomEmojis &&
                    data?.messages?.topCustomEmojis?.length > 0 ? (
                      <div
                        className={
                          "p-2 rounded-lg" +
                          (emojiType !== "topCustomEmojis"
                            ? ""
                            : " bg-gray-400 dark:bg-[#232323]")
                        }
                        onClick={() => {
                          setEmojiType("topCustomEmojis");
                        }}
                      >
                        <Tippy
                          zIndex={99999999999999}
                          content="Your Top Custom Emojis"
                          animation="scale"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                            className="cursor-pointer fill-black dark:fill-white opacity-90 hover:opacity-100"
                          >
                            <path d="M12 22.8q-2.225 0-4.2-.85t-3.437-2.312Q2.9 18.175 2.05 16.2 1.2 14.225 1.2 12t.85-4.2q.85-1.975 2.313-3.45Q5.825 2.875 7.8 2.025q1.975-.85 4.2-.825 1.175.025 2.163.212Q15.15 1.6 16.1 2l-4.375 1.9 5.2 3.15 1.325 2.875q-2.2.125-4.438-.675-2.237-.8-4.112-3.05-.85 2-2.338 3.462-1.487 1.463-3.512 2.188 0 3.55 2.375 5.925T12 20.15q3.4 0 5.775-2.375Q20.15 15.4 20.15 12v-.175L21.975 7.9q.425.875.625 1.95t.2 2.15q0 2.225-.85 4.2t-2.312 3.438Q18.175 21.1 16.2 21.95q-1.975.85-4.2.85Zm-3.05-8.5q-.55 0-.925-.375T7.65 13q0-.55.375-.925t.925-.375q.55 0 .925.375t.375.925q0 .55-.375.925t-.925.375Zm6.1 0q-.55 0-.925-.375T13.75 13q0-.55.375-.925t.925-.375q.55 0 .925.375t.375.925q0 .55-.375.925t-.925.375Zm4.5-6.325-1.1-2.425L16 4.425 18.45 3.3l1.1-2.425 1.1 2.425 2.45 1.125-2.45 1.125Z" />
                          </svg>
                        </Tippy>
                      </div>
                    ) : (
                      ""
                    )}
                    {data?.settings?.recentEmojis &&
                    data?.settings?.recentEmojis?.length > 0 ? (
                      <div
                        className={
                          "p-2 rounded-lg" +
                          (emojiType !== "recentEmojis"
                            ? ""
                            : " bg-gray-400 dark:bg-[#232323]")
                        }
                        onClick={() => {
                          setEmojiType("recentEmojis");
                        }}
                      >
                        <Tippy
                          zIndex={99999999999999}
                          content="Your Recent Emojis"
                          animation="scale"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                            className="cursor-pointer fill-black dark:fill-white opacity-90 hover:opacity-100"
                          >
                            <path d="m19 9-1.25-2.75L15 5l2.75-1.25L19 1l1.25 2.75L23 5l-2.75 1.25Zm0 14-1.25-2.75L15 19l2.75-1.25L19 15l1.25 2.75L23 19l-2.75 1.25ZM9 20l-2.5-5.5L1 12l5.5-2.5L9 4l2.5 5.5L17 12l-5.5 2.5Z" />
                          </svg>
                        </Tippy>
                      </div>
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              ) : (
                ""
              )}
              <div className="lg:flex items-center justify-center">
                <div className="lg:mr-14 lg:mb-0 mb-2">
                  <div
                    className="text-gray-900 dark:text-white max-w-sm font-bold xl:text-5xl lg:text-3xl text-xl hidden lg:block uppercase"
                    style={{
                      fontFamily:
                        "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
                    }}
                  >
                    {data?.dataFile ? "Their" : "Your"}
                    <br />
                    {emojiType === "topEmojis"
                      ? "Top"
                      : emojiType === "topCustomEmojis"
                      ? "Top Custom"
                      : emojiType === "recentEmojis"
                      ? "Recent"
                      : "Top"}
                    <br />
                    Emojis
                  </div>
                  <div className="text-gray-900 dark:text-white max-w-sm font-bold lg:hidden text-2xl ">
                    {data?.dataFile ? "Their" : "Your "}
                    {emojiType === "topEmojis"
                      ? " Top  "
                      : emojiType === "topCustomEmojis"
                      ? " Top Custom "
                      : emojiType === "recentEmojis"
                      ? " Recent "
                      : null}{" "}
                    Emojis
                  </div>
                </div>

                {!emojiType ? (
                  <span className="text-gray-900 dark:text-white text-lg font-bold w-full">
                    No Emojis Found or {data?.dataFile ? "they " : "you "}
                    disabled all emoji options
                  </span>
                ) : (
                  ""
                )}
                <div className="grid xl:grid-cols-10 xl:gap-1 gap-2 grid-cols-6 justify-items-center ">
                  {emojiType === "recentEmojis" ? (
                    <>
                      {data?.settings?.recentEmojis
                        ?.slice(0, 30)
                        .sort((a: any, b: any) => {
                          if (!a?.count || !b?.count) return;
                          return b.count - a.count;
                        })
                        .map((m: any, id: number) => {
                          if (!m.name) return;
                          if (!m.count) return;
                          const isCustomEmoji =
                            !isNaN(m.name) && m.name.length > 7;

                          if (isCustomEmoji) {
                            return (
                              <Tippy
                                zIndex={99999999999999}
                                key={id}
                                content={`used ${m.count} time${
                                  m.count === 1 ? "" : "s"
                                }`}
                                animation="scale"
                                className="shadow-xl"
                              >
                                <div
                                  className="cursor-pointer text-4xl opacity-90 hover:opacity-100"
                                  onClick={() => {
                                    copyToClipboard(
                                      m.name + ": " + m.count + " times"
                                    );
                                    noti("Copied emoji to Clipboard");
                                  }}
                                >
                                  <Image
                                    unoptimized={true}
                                    key={id}
                                    src={
                                      "https://cdn.Discordapp.com/emojis/" +
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
                                zIndex={99999999999999}
                                key={id}
                                content={`:${m.name}: used ${m.count} time${
                                  m.count === 1 ? "" : "s"
                                }`}
                                animation="scale"
                                className="shadow-xl"
                              >
                                <div
                                  onClick={() => {
                                    copyToClipboard(
                                      ":" + m.name + ": - " + m.count + " times"
                                    );
                                    noti("Copied emoji to Clipboard");
                                  }}
                                  className="cursor-pointer opacity-90 hover:opacity-100 w-14 h-14"
                                >
                                  <Twemoji>
                                    {(emojis as any)[m.name]
                                      ? (emojis as any)[m.name]
                                      : m.name}
                                  </Twemoji>
                                </div>
                              </Tippy>
                            );
                          }
                        })}
                    </>
                  ) : (
                    ""
                  )}
                  {emojiType === "topEmojis" ? (
                    <>
                      {data?.messages?.topEmojis?.length > 29
                        ? data?.messages?.topEmojis
                            ?.slice(0, 29)
                            .concat({
                              emoji:
                                "+ " +
                                (data?.messages?.topEmojis?.length - 29) +
                                " more",
                              count: "ignore",
                            })
                            .map((m: any, id: number) => {
                              if (!m) return;
                              if (!m.emoji) return;
                              if (!m.count) return;

                              return m.count !== "ignore" ? (
                                <Tippy
                                  zIndex={99999999999999}
                                  key={id}
                                  content={`${m.emoji} used ${m.count} time${
                                    m.count === 1 ? "" : "s"
                                  }`}
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <div
                                    onClick={() => {
                                      copyToClipboard(
                                        m.emoji + ": " + m.count + " times"
                                      );
                                      noti("Copied emoji to Clipboard");
                                    }}
                                    className="cursor-pointer opacity-90 hover:opacity-100 w-14 h-14"
                                  >
                                    <Twemoji>{m.emoji}</Twemoji>
                                  </div>
                                </Tippy>
                              ) : (
                                <Tippy
                                  zIndex={99999999999999}
                                  key={id}
                                  content={`Click to view the rest`}
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <div
                                    onClick={() => {
                                      toast(
                                        <div className="Toastify__toast-body_">
                                          <span className="font-bold text-lg text-black dark:text-white">
                                            {data?.dataFile ? "Their" : "Your"}{" "}
                                            {data?.messages?.topEmojis?.length -
                                              29}{" "}
                                            more Emoji
                                            {data?.messages?.topEmojis?.length -
                                              29 ===
                                            1
                                              ? " is"
                                              : "s are"}
                                            :
                                          </span>
                                          <br />
                                          <ul className="list-disc ml-4">
                                            {data?.messages?.topEmojis
                                              ?.slice(
                                                29,
                                                data?.messages?.topEmojis
                                                  ?.length
                                              )
                                              .map((f: any, i: number) => {
                                                return (
                                                  <li key={i}>
                                                    {f.emoji}: {f.count} time
                                                    {f.count > 1 ? "s" : ""}
                                                  </li>
                                                );
                                              })}
                                          </ul>
                                        </div>
                                      );
                                    }}
                                    className="cursor-pointer flex justify-center items-center text-md p-1 mt-2 py-1 px-2 font-medium text-white bg-gray-700 rounded-full border-2 border-white hover:bg-gray-600 dark:border-gray-800"
                                  >
                                    +{data?.messages?.topEmojis?.length - 29}
                                  </div>
                                </Tippy>
                              );
                            })
                        : data?.messages?.topEmojis
                            ?.slice(0, 30)
                            .map((m: any, id: number) => {
                              if (!m) return;
                              if (!m.emoji) return;
                              if (!m.count) return;

                              return (
                                <Tippy
                                  zIndex={99999999999999}
                                  key={id}
                                  content={`${m.emoji} used ${m.count} time${
                                    m.count === 1 ? "" : "s"
                                  }`}
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <div
                                    onClick={() => {
                                      copyToClipboard(
                                        m.emoji + ": " + m.count + " times"
                                      );
                                      noti("Copied emoji to Clipboard");
                                    }}
                                    className="cursor-pointer lg:text-5xl text-4xl opacity-90 hover:opacity-100"
                                  >
                                    {m.emoji}
                                  </div>
                                </Tippy>
                              );
                            })}
                    </>
                  ) : (
                    ""
                  )}
                  {emojiType === "topCustomEmojis" ? (
                    <>
                      {data?.messages?.topCustomEmojis?.length > 29
                        ? data?.messages?.topCustomEmojis
                            ?.slice(0, 29)
                            .concat({
                              emoji:
                                "+ " +
                                (data?.messages?.topCustomEmojis?.length - 29) +
                                " more",
                              count: "ignore",
                            })
                            .map((m: any, id: number) => {
                              if (!m) return;
                              if (!m.emoji) return;
                              if (!m.count) return;

                              return m.count !== "ignore" ? (
                                <>
                                  {/<:.*?:(\d+)>/g.exec(m.emoji) ? (
                                    <Tippy
                                      zIndex={99999999999999}
                                      key={id}
                                      content={`${m.emoji} used ${
                                        m.count
                                      } time${m.count === 1 ? "" : "s"}`}
                                      animation="scale"
                                      className="shadow-xl"
                                    >
                                      <div
                                        className="cursor-pointer text-4xl opacity-90 hover:opacity-100"
                                        onClick={() => {
                                          copyToClipboard(
                                            m.emoji + ": " + m.count + " times"
                                          );
                                          noti("Copied emoji to Clipboard");
                                        }}
                                      >
                                        <Image
                                          unoptimized={true}
                                          key={id}
                                          src={Utils.createEmoji(m.emoji)}
                                          alt="emoji"
                                          height="50px"
                                          width="50px"
                                          draggable={false}
                                        />
                                      </div>
                                    </Tippy>
                                  ) : (
                                    <>
                                      {/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
                                        m.emoji
                                      ) ? (
                                        <Tippy
                                          zIndex={99999999999999}
                                          key={id}
                                          content={`${m.emoji} used ${
                                            m.count
                                          } time${m.count === 1 ? "" : "s"}`}
                                          animation="scale"
                                          className="shadow-xl"
                                        >
                                          <div
                                            className="cursor-pointer text-4xl opacity-90 hover:opacity-100 m-2"
                                            onClick={() => {
                                              copyToClipboard(
                                                m.emoji +
                                                  ": " +
                                                  m.count +
                                                  " times"
                                              );
                                              noti("Copied emoji to Clipboard");
                                            }}
                                          >
                                            <Image
                                              unoptimized={true}
                                              key={id}
                                              src={Utils.createCustomEmoji(
                                                m.emoji
                                              )}
                                              alt="emoji"
                                              height="50px"
                                              width="50px"
                                              draggable={false}
                                            />
                                          </div>
                                        </Tippy>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  )}
                                </>
                              ) : (
                                <Tippy
                                  zIndex={99999999999999}
                                  key={id}
                                  content={`Click to view the rest`}
                                  animation="scale"
                                  className="shadow-xl"
                                >
                                  <div
                                    onClick={() => {
                                      toast(
                                        <div className="Toastify__toast-body_">
                                          <span className="font-bold text-lg text-black dark:text-white">
                                            {data?.dataFile ? "Their" : "Your"}{" "}
                                            {data?.messages?.topCustomEmojis
                                              ?.length - 29}{" "}
                                            more Custom Emoji
                                            {data?.messages?.topCustomEmojis
                                              ?.length -
                                              29 ===
                                            1
                                              ? " is"
                                              : "s are"}
                                            :
                                          </span>
                                          <br />
                                          <ul className="list-disc ml-4">
                                            {data?.messages?.topCustomEmojis
                                              ?.slice(
                                                29,
                                                data?.messages?.topCustomEmojis
                                                  ?.length
                                              )
                                              .map((f: any, i: number) => {
                                                return (
                                                  <li key={i}>
                                                    {/<:.*?:(\d+)>/g.exec(
                                                      f.emoji
                                                    ) ? (
                                                      <Tippy
                                                        zIndex={99999999999999}
                                                        key={id}
                                                        content={`${
                                                          f.emoji
                                                        } used ${f.count} time${
                                                          f.count === 1
                                                            ? ""
                                                            : "s"
                                                        }`}
                                                        animation="scale"
                                                        className="shadow-xl"
                                                      >
                                                        <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                          <Image
                                                            unoptimized={true}
                                                            key={id}
                                                            src={Utils.createEmoji(
                                                              f.emoji
                                                            )}
                                                            alt="emoji"
                                                            height="50px"
                                                            width="50px"
                                                            draggable={false}
                                                          />
                                                        </div>
                                                      </Tippy>
                                                    ) : (
                                                      <>
                                                        {/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
                                                          f.emoji
                                                        ) ? (
                                                          <Tippy
                                                            zIndex={
                                                              99999999999999
                                                            }
                                                            key={id}
                                                            content={`${
                                                              f.emoji
                                                            } used ${
                                                              f.count
                                                            } time${
                                                              f.count === 1
                                                                ? ""
                                                                : "s"
                                                            }`}
                                                            animation="scale"
                                                            className="shadow-xl"
                                                          >
                                                            <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100 m-2">
                                                              <Image
                                                                unoptimized={
                                                                  true
                                                                }
                                                                key={id}
                                                                src={Utils.createCustomEmoji(
                                                                  f.emoji
                                                                )}
                                                                alt="emoji"
                                                                height="50px"
                                                                width="50px"
                                                                draggable={
                                                                  false
                                                                }
                                                              />
                                                            </div>
                                                          </Tippy>
                                                        ) : (
                                                          ""
                                                        )}
                                                      </>
                                                    )}
                                                    : {f.count} time
                                                    {f.count > 1 ? "s" : ""}
                                                  </li>
                                                );
                                              })}
                                          </ul>
                                        </div>
                                      );
                                    }}
                                    className="cursor-pointer flex justify-center items-center text-md p-1 py-2 px-2 font-medium text-white bg-gray-700 rounded-full border-2 border-white hover:bg-gray-600 dark:border-gray-800"
                                  >
                                    +
                                    {data?.messages?.topCustomEmojis?.length -
                                      29}
                                  </div>
                                </Tippy>
                              );
                            })
                        : data?.messages?.topCustomEmojis
                            ?.slice(0, 30)
                            .map((m: any, id: number) => {
                              if (!m) return;
                              if (!m.emoji) return;
                              if (!m.count) return;

                              return (
                                <>
                                  {/<:.*?:(\d+)>/g.exec(m.emoji) ? (
                                    <Tippy
                                      zIndex={99999999999999}
                                      key={id}
                                      content={`${m.emoji} used ${
                                        m.count
                                      } time${m.count === 1 ? "" : "s"}`}
                                      animation="scale"
                                      className="shadow-xl"
                                    >
                                      <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                        <Image
                                          unoptimized={true}
                                          key={id}
                                          src={Utils.createEmoji(m.emoji)}
                                          alt="emoji"
                                          height="50px"
                                          width="50px"
                                          draggable={false}
                                        />
                                      </div>
                                    </Tippy>
                                  ) : (
                                    <>
                                      {/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
                                        m.emoji
                                      ) ? (
                                        <Tippy
                                          zIndex={99999999999999}
                                          key={id}
                                          content={`${m.emoji} used ${
                                            m.count
                                          } time${m.count === 1 ? "" : "s"}`}
                                          animation="scale"
                                          className="shadow-xl"
                                        >
                                          <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                            <Image
                                              unoptimized={true}
                                              key={id}
                                              src={Utils.createCustomEmoji(
                                                m.emoji
                                              )}
                                              alt="emoji"
                                              height="50px"
                                              width="50px"
                                              draggable={false}
                                            />
                                          </div>
                                        </Tippy>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  )}
                                </>
                              );
                            })}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 lg:mt-0 mt-2 py-2 bg-gray-300 dark:bg-[#2b2d31]  animate__delay-1s rounded-lg col-span-2 relative group">
          <div
            id="blur_3"
            className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-hover:block"
            onClick={() => {
              const div = document.getElementById("blur_3_div");
              if (div) {
                div.classList.toggle("blur-xl");
                div.classList.toggle("pointer-events-none");
                div.classList.toggle("select-none");

                const el: any = document.getElementById("blur_3_show");
                if (el) el.classList.toggle("hidden");

                const el2: any = document.getElementById("blur_3_hide");
                if (el) el2.classList.toggle("hidden");
              }
            }}
          >
            <svg
              id="blur_3_show"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto opacity-80 hover:opacity-100"
            >
              <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
            </svg>
            <svg
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto hidden opacity-80 hover:opacity-100"
              id="blur_3_hide"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
            >
              <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
            </svg>
          </div>
          <div id="blur_3_div">
            {data?.settings?.appearance?.theme ||
            data?.settings?.appearance?.developerMode ||
            data?.guilds ? (
              <ul className="text-gray-900 dark:text-white lg:text-xl md:text-xl font-bold mt-2 ">
                {data?.settings?.appearance?.theme ? (
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                      className="fill-black dark:fill-white opacity-90 hover:opacity-100 mr-2"
                    >
                      <path d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025.337.025.662.075-1.025.725-1.637 1.887Q11.1 6.15 11.1 7.5q0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.375 0 2.525-.613 1.15-.612 1.875-1.637.05.325.075.662Q21 11.65 21 12q0 3.75-2.625 6.375T12 21Z" />
                    </svg>
                    {data?.dataFile ? "They " : "You "}prefer Discord{" "}
                    {data.settings.appearance.theme.toLowerCase()} mode
                  </li>
                ) : (
                  ""
                )}
                {data?.settings?.appearance?.developerMode ? (
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                      className="fill-black dark:fill-white opacity-90 hover:opacity-100 mr-2"
                    >
                      <path d="m8 18-6-6 6-6 1.425 1.425-4.6 4.6L9.4 16.6Zm8 0-1.425-1.425 4.6-4.6L14.6 7.4 16 6l6 6Z" />
                    </svg>
                    {data?.dataFile ? "They " : "You "}are using Discord
                    developer mode
                  </li>
                ) : (
                  ""
                )}

                {data?.guilds ? (
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                      className="fill-black dark:fill-white opacity-90 hover:opacity-100 mr-2"
                    >
                      <path d="M0 18v-1.575q0-1.1 1.1-1.763Q2.2 14 4 14q.325 0 .613.025.287.025.562.075-.35.5-.513 1.075Q4.5 15.75 4.5 16.4V18Zm6 0v-1.6q0-1.625 1.663-2.638Q9.325 12.75 12 12.75q2.7 0 4.35 1.012Q18 14.775 18 16.4V18Zm13.5 0v-1.6q0-.65-.175-1.225-.175-.575-.5-1.075.275-.05.563-.075Q19.675 14 20 14q1.8 0 2.9.662 1.1.663 1.1 1.763V18ZM4 13q-.825 0-1.412-.588Q2 11.825 2 11t.588-1.413Q3.175 9 4 9t1.412.587Q6 10.175 6 11q0 .825-.588 1.412Q4.825 13 4 13Zm16 0q-.825 0-1.413-.588Q18 11.825 18 11t.587-1.413Q19.175 9 20 9q.825 0 1.413.587Q22 10.175 22 11q0 .825-.587 1.412Q20.825 13 20 13Zm-8-1q-1.25 0-2.125-.875T9 9q0-1.25.875-2.125T12 6q1.25 0 2.125.875T15 9q0 1.25-.875 2.125T12 12Z" />
                    </svg>
                    <div className="inline-flex">
                      {data?.dataFile ? "They " : "You "}are in{" "}
                      {typeof data?.guilds === "number" ? (
                        <p className="mx-1 font-extrabold text-blue-500">
                          {data?.guilds}
                        </p>
                      ) : (
                        <Tippy
                          zIndex={99999999999999}
                          placement="bottom"
                          trigger={"click"}
                          content={
                            <div className="h-[400px] overflow-y-auto">
                              <div className="text-gray-900 dark:text-gray-200 font-bold text-xl">
                                {data?.dataFile ? "Their " : "Your "} Counted
                                Guilds
                              </div>
                              <ul className="text-gray-900 dark:text-gray-200 font-bold text-md list-disc ml-4">
                                {typeof data?.guilds === "object"
                                  ? Object.keys(data?.guilds)?.map((g, id) => {
                                      return (
                                        <li key={id}>
                                          {data?.guilds[g]} <b>({g})</b>
                                        </li>
                                      );
                                    })
                                  : ""}
                              </ul>
                            </div>
                          }
                          animation="scale"
                        >
                          <p className="mx-1 font-extrabold text-blue-500 cursor-pointer">
                            {Object.keys(data?.guilds).length}
                          </p>
                        </Tippy>
                      )}
                      guilds
                    </div>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            ) : (
              <div className="justify-items-center">
                <div className="text-gray-900 dark:text-white text-xl font-bold ">
                  {data?.dataFile ? "They " : "You "}disabled these Options
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="lg:mt-0 mt-2 md:mt-0 px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__delay-1s rounded-lg lg:row-span-2 md:row-span-1 col-span-2 row-span-2 relative group">
          <div
            id="blur_4"
            className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-hover:block"
            onClick={() => {
              const div = document.getElementById("blur_4_div");
              if (div) {
                div.classList.toggle("blur-xl");
                div.classList.toggle("pointer-events-none");
                div.classList.toggle("select-none");

                const el: any = document.getElementById("blur_4_show");
                if (el) el.classList.toggle("hidden");

                const el2: any = document.getElementById("blur_4_hide");
                if (el) el2.classList.toggle("hidden");
              }
            }}
          >
            <svg
              id="blur_4_show"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto opacity-80 hover:opacity-100"
            >
              <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
            </svg>
            <svg
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto hidden opacity-80 hover:opacity-100"
              id="blur_4_hide"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
            >
              <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
            </svg>
          </div>
          <div id="blur_4_div">
            <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2 flex items-center uppercase">
              {data?.dataFile ? "Their" : "Your"} Connections
              <Tippy
                zIndex={99999999999999}
                content={
                  <>
                    <div className="text-white text-xl font-bold">
                      What are connections?
                    </div>
                    <p className="text-white text-lg ">
                      Connections are the accounts{" "}
                      {data?.dataFile ? "they " : "you "}have connected to{" "}
                      {data?.dataFile ? "their " : "your "}
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
                  className="cursor-pointer fill-black dark:fill-white opacity-90 hover:opacity-100 ml-2"
                >
                  <path d="M10.625 17.375h2.75V11h-2.75ZM12 9.5q.65 0 1.075-.438Q13.5 8.625 13.5 8q0-.65-.425-1.075Q12.65 6.5 12 6.5q-.625 0-1.062.425Q10.5 7.35 10.5 8q0 .625.438 1.062.437.438 1.062.438Zm0 13.35q-2.275 0-4.25-.85t-3.438-2.312Q2.85 18.225 2 16.25q-.85-1.975-.85-4.25T2 7.75q.85-1.975 2.312-3.438Q5.775 2.85 7.75 2q1.975-.85 4.25-.85t4.25.85q1.975.85 3.438 2.312Q21.15 5.775 22 7.75q.85 1.975.85 4.25T22 16.25q-.85 1.975-2.312 3.438Q18.225 21.15 16.25 22q-1.975.85-4.25.85Z" />
                </svg>
              </Tippy>
            </h3>
            <span className="text-gray-900 dark:text-white font-bold">
              {!data?.connections
                ? `${data?.dataFile ? "They " : "You "} have no connections`
                : ""}
            </span>
            <div
              className="gap-4 items-center w-full"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(32px, 0fr))",
              }}
            >
              {data?.connections?.map((m: any, i: number) => {
                const obj = {
                  youtube: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M21.582 7.20034C21.352 6.3342 20.6744 5.65216 19.8139 5.42068C18.2542 5 12 5 12 5C12 5 5.7458 5 4.18614 5.42068C3.32568 5.65216 2.64795 6.3342 2.41795 7.20034C2 8.77011 2 12.0455 2 12.0455C2 12.0455 2 15.3207 2.41795 16.8907C2.64795 17.7567 3.32568 18.4387 4.18614 18.6703C5.7458 19.0909 12 19.0909 12 19.0909C12 19.0909 18.2542 19.0909 19.8139 18.6703C20.6744 18.4387 21.352 17.7567 21.582 16.8907C22 15.3207 22 12.0455 22 12.0455C22 12.0455 22 8.77011 21.582 7.20034Z"
                        fill="#D9252A"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.95447 15.0192L15.1817 12.0455L9.95447 9.07169V15.0192Z"
                        fill="#FFFFFE"
                      />
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
                      <g
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      >
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
                  ebay: (
                    <svg
                      className="w-12 h-12 text-black dark:text-white"
                      width="255"
                      height="255"
                      viewBox="0 0 255 255"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M229 128C229 72.2192 183.781 27 128 27C72.2192 27 27 72.2192 27 128C27 183.781 72.2192 229 128 229C183.781 229 229 183.781 229 128Z"
                        fill="currentColor"
                      />
                      <path
                        d="M67.9481 109.473C56.5217 109.473 47 114.378 47 129.181C47 140.908 53.4027 148.293 68.2426 148.293C85.7104 148.293 86.8299 136.646 86.8299 136.646H78.3663C78.3663 136.646 76.5518 142.917 67.7266 142.917C60.5387 142.917 55.3691 138.002 55.3691 131.115H87.7156V126.792C87.7156 119.978 83.4414 109.473 67.9481 109.473ZM67.6526 114.997C74.4946 114.997 79.159 119.24 79.159 125.598H55.556C55.556 118.848 61.6449 114.997 67.6526 114.997Z"
                        fill="#E53238"
                      />
                      <path
                        d="M87.7093 95.1385V140.859C87.7093 143.454 87.5261 147.098 87.5261 147.098H95.5985C95.5985 147.098 95.8887 144.481 95.8887 142.089C95.8887 142.089 99.8771 148.405 110.722 148.405C122.142 148.405 129.9 140.379 129.9 128.882C129.9 118.186 122.775 109.584 110.741 109.584C99.4719 109.584 95.9703 115.743 95.9703 115.743V95.1385H87.7093ZM108.657 115.239C116.412 115.239 121.344 121.065 121.344 128.882C121.344 137.266 115.648 142.749 108.713 142.749C100.435 142.749 95.9703 136.208 95.9703 128.957C95.9703 122.201 99.9766 115.239 108.657 115.239Z"
                        fill="#0064D2"
                      />
                      <path
                        d="M149.963 109.473C132.774 109.473 131.671 118.999 131.671 120.521H140.227C140.227 120.521 140.676 114.959 149.373 114.959C155.025 114.959 159.404 117.578 159.404 122.612V124.403H149.373C136.056 124.403 129.016 128.347 129.016 136.348C129.016 144.223 135.521 148.507 144.312 148.507C156.293 148.507 160.152 141.807 160.152 141.807C160.152 144.473 160.354 147.098 160.354 147.098H167.96C167.96 147.098 167.666 143.844 167.666 141.761V123.759C167.666 111.956 158.26 109.473 149.963 109.473ZM159.404 129.779V132.167C159.404 135.283 157.505 143.03 146.321 143.03C140.197 143.03 137.572 139.936 137.572 136.348C137.572 129.821 146.414 129.779 159.404 129.779Z"
                        fill="#F5AF02"
                      />
                      <path
                        d="M163.058 110.967H172.684L186.498 138.978L200.28 110.967H209L183.896 160.836H174.749L181.993 146.935L163.058 110.967Z"
                        fill="#86B817"
                      />
                    </svg>
                  ),
                  instagram: (
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x={0}
                      y={0}
                      viewBox="0 0 1005 1005"
                      xmlSpace="preserve"
                      className="w-10 h-10"
                    >
                      <style
                        dangerouslySetInnerHTML={{
                          __html:
                            ".st0{clip-path:url(#SVGID_00000130622006894310625020000004174188710254592903_)}.st1{clip-path:url(#SVGID_00000051351915170632626820000013518756960088417417_)}.st2{clip-path:url(#SVGID_00000021817509185890717940000001189774779219633321_)}",
                        }}
                      />
                      <switch>
                        <g>
                          <defs>
                            <path
                              id="SVGID_1_"
                              d="M295.423 5.962c-53.2 2.511-89.537 11.033-121.29 23.475-32.87 12.814-60.733 29.986-88.451 57.818-27.75 27.848-44.793 55.761-57.51 88.664C15.86 207.752 7.517 244.106 5.167 297.34 2.835 350.672 2.3 367.682 2.56 503.457c.259 135.758.858 152.8 3.401 206.148 2.543 53.185 11.033 89.506 23.475 121.275 12.83 32.87 29.985 60.718 57.833 88.453 27.832 27.735 55.76 44.761 88.679 57.495 31.8 12.296 68.17 20.672 121.387 23.004 53.33 2.35 70.356 2.868 206.097 2.609 135.805-.26 152.831-.86 206.162-3.387 53.2-2.543 89.504-11.064 121.29-23.473 32.869-12.863 60.733-29.987 88.45-57.835 27.72-27.833 44.762-55.762 57.48-88.68 12.311-31.802 20.686-68.171 23.003-121.356 2.332-53.364 2.884-70.407 2.624-206.165-.259-135.774-.874-152.784-3.401-206.1-2.528-53.233-11.049-89.538-23.475-121.323-12.846-32.87-29.985-60.702-57.817-88.453-27.832-27.719-55.76-44.794-88.679-57.479-31.817-12.312-68.17-20.704-121.388-23.004-53.33-2.366-70.356-2.884-206.145-2.625-135.756.26-152.781.843-206.113 3.402m5.833 903.877c-48.746-2.123-75.217-10.223-92.859-17.01-23.36-9.04-40.03-19.878-57.575-37.293-17.512-17.48-28.382-34.102-37.503-57.414-6.853-17.642-15.098-44.081-17.382-92.828-2.48-52.699-3.046-68.51-3.29-202.017-.258-133.473.227-149.285 2.528-202.033 2.09-48.714 10.239-75.217 17.01-92.843 9.04-23.394 19.844-40.031 37.292-57.576 17.48-17.545 34.101-28.383 57.43-37.503 17.625-6.886 44.064-15.067 92.793-17.383 52.732-2.495 68.526-3.03 201.998-3.289 133.504-.26 149.316.21 202.064 2.527 48.713 2.122 75.216 10.19 92.826 17.01 23.376 9.04 40.046 19.813 57.575 37.293 17.528 17.48 28.398 34.07 37.519 57.446 6.884 17.577 15.066 44.049 17.366 92.763 2.51 52.732 3.078 68.543 3.32 202.017.26 133.506-.226 149.317-2.542 202.033-2.122 48.747-10.206 75.234-17.01 92.892-9.04 23.345-19.846 40.015-37.31 57.56-17.462 17.48-34.083 28.382-57.428 37.503-17.593 6.869-44.064 15.067-92.762 17.383-52.73 2.479-68.526 3.046-202.046 3.289-133.472.26-149.267-.243-202.014-2.527m407.609-674.61c.064 33.113 26.988 59.924 60.101 59.86 33.13-.065 59.94-26.974 59.892-60.088-.065-33.113-26.99-59.94-60.118-59.875-33.129.064-59.94 26.989-59.875 60.102M245.771 502.986c.275 141.8 115.441 256.498 257.207 256.223 141.783-.276 256.544-115.41 256.269-257.211-.276-141.752-115.458-256.515-257.257-256.24-141.767.276-256.495 115.46-256.219 257.228m90.055-.178c-.162-92.034 74.326-166.798 166.342-166.96 92.033-.178 166.812 74.278 166.99 166.328.179 92.05-74.31 166.797-166.358 166.976-92.016.178-166.796-74.294-166.974-166.344"
                            />
                          </defs>
                          <clipPath id="SVGID_00000170980134926788928000000000553113072940639111_">
                            <use
                              xlinkHref="#SVGID_1_"
                              style={{ overflow: "visible" }}
                            />
                          </clipPath>
                          <g
                            style={{
                              clipPath:
                                "url(#SVGID_00000170980134926788928000000000553113072940639111_)",
                            }}
                          >
                            <defs>
                              <path
                                id="SVGID_00000096756851418762435920000001711687824209778822_"
                                d="M-37.905-36.659h1080v1080.014h-1080z"
                              />
                            </defs>
                            <clipPath id="SVGID_00000075130749379876087420000012434501290736231839_">
                              <use
                                xlinkHref="#SVGID_00000096756851418762435920000001711687824209778822_"
                                style={{ overflow: "visible" }}
                              />
                            </clipPath>
                            <g
                              style={{
                                clipPath:
                                  "url(#SVGID_00000075130749379876087420000012434501290736231839_)",
                              }}
                            >
                              <defs>
                                <path
                                  id="SVGID_00000032622824924000771630000000461164216671436934_"
                                  d="M-42.905-41.66h1090v1090.015h-1090z"
                                />
                              </defs>
                              <clipPath id="SVGID_00000076589791919960347240000006817951357147468980_">
                                <use
                                  xlinkHref="#SVGID_00000032622824924000771630000000461164216671436934_"
                                  style={{ overflow: "visible" }}
                                />
                              </clipPath>
                              <g
                                style={{
                                  clipPath:
                                    "url(#SVGID_00000076589791919960347240000006817951357147468980_)",
                                }}
                              >
                                <defs>
                                  <path
                                    id="SVGID_00000086685721139758078450000004425164077134485120_"
                                    d="M-42.905-41.66h1090v1090.015h-1090z"
                                  />
                                </defs>
                                <clipPath id="SVGID_00000057848519819832226150000010698714775723389572_">
                                  <use
                                    xlinkHref="#SVGID_00000086685721139758078450000004425164077134485120_"
                                    style={{ overflow: "visible" }}
                                  />
                                </clipPath>
                                <g
                                  style={{
                                    clipPath:
                                      "url(#SVGID_00000057848519819832226150000010698714775723389572_)",
                                  }}
                                >
                                  <image
                                    style={{ overflow: "visible" }}
                                    width={2272}
                                    height={2272}
                                    xlinkHref="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEAlgCWAAD/7AARRHVja3kAAQAEAAAAHgAA/+4AIUFkb2JlAGTAAAAAAQMA EAMCAwYAAFokAABijgAAd23/2wCEABALCwsMCxAMDBAXDw0PFxsUEBAUGx8XFxcXFx8eFxoaGhoX Hh4jJSclIx4vLzMzLy9AQEBAQEBAQEBAQEBAQEABEQ8PERMRFRISFRQRFBEUGhQWFhQaJhoaHBoa JjAjHh4eHiMwKy4nJycuKzU1MDA1NUBAP0BAQEBAQEBAQEBAQP/CABEICOMI4QMBIgACEQEDEQH/ xADDAAEBAQEBAQEBAAAAAAAAAAAAAQUEBgMHAgEBAQADAQEAAAAAAAAAAAAAAAECAwUEBhAAAQIE BAcBAQEBAQAAAAAAAAMFcIA1FiIjMxQBEQIyEwQ0MRIGFZARAAADCAICAgEABwUJAQAAAAADo4AB cqLSBDREsXNDRcECESExQVGREjIQYdETM3GB8VJiksLiFBUSAAECBgEEAwABAwIHAAAAAAABAnCx cpIDM0QxMkNFcZFzERBBEmGCoCFRgUKDNP/aAAwDAQACEQMRAAAA9X5n5Z3e26jLei6jLRqMsajL GoyxqMsajLGoyxqMsajLJqMsajLGoyxqMsajLGoyxqMsalyqajLGoyxqMsajLJqMsajLGoyxqMsa jLRqMsajLGoyxqMsajLGoyxqMsajLppswabMGmyxqMwumzIajLppsyGoyy6jLGoyxqMsuoyxqMsu oyxqTMhqzMi6jLGoyy6jLGoyy6jLGoyy6jLGoyxqMsuoyxqMuLqsoarKLqMsajLLqMsajLLqMsaj LGoyi6rKGqyhqsouqyhqXKGoyy6jLGoyxqMouqyhqsoarKGqyi6rKGqyhqsouqyhqsoarKGqyhqM ouqyhqsoarKGqyi6rKGqylarKGqyhqsoarKLqsoarJGsyRrMkazJGsyRrMka0yhqsouqyhqsoarK GqyhqsoarKGqylarKGqyi6rKGqyhqsqGsyRrMkazJGsyRrMkazJGsyRrMkazJGsyRrMkazJGsyRr MkazJGsyRrMka2149hh+rvDOV4Obg7+Ds6w2UAAAAAEAAACAAAAAAAKlAQAAAAAAAAAAECABQFAE AKBLFWCwAAUAFABQAVLAFABQAUAFABQCVYAFABQAUAFgAUAAFABQEsBVgAAUAAFAAABUsAAtAAAA BQAAAAIFAAAAAAAC0AAAAAAAAABLFAAAAAAAAAAAAAAAAAAA1eDv4NfFDZQAAAAAAQAAAIAAAAAA WCgBAAAAAAAAAAQIAWFqCkAFABBQAAUAAFABQAVLAFABQAUAFABQJZVgAUAFBQAIFABQAAUAFASw VFAABQAAUAAFAgAAtAAABQAAAAAIFAAAAAAAC0AAAAAAAAABLFAAAAAAAAAAAAAAAAAAA1eDv4Nf GDYAAAAAAAABAAgAAACpSKIsKlAAQAAAAAAAIAAAAAAFBAFAAABQAUAAFABUsAUAFBQAUAAFBUsA UAFABQAWLAAFABQAAUBBbAAABQAAUAAFAgAoFAAABQAAAAAIFAAAAAAC0AAAAAAAAFBAEsUAAAAA AAAAAAAAAAAAADV4O/g18YNgAAIAAAAAAACwIAAAAWCglQoAAQAAAAAIAAAAAAAsAFALAAFAABQA UAAFSwBQUAFABQAUARbLAFABQAUARbLAFAABQAAUCFWAABQAAAUAAFQAAAtAAABQAAAAAIFAAAAA AC0AAAAAAAAFABEFAAAAAAAAAAAAAAAAAAA1eDv4NXGDYAAAAAAAAAAAABAAAAFgpBYKAAAEACAA AAAAAAAAUAAAFAABQAAUAFAlRQAUAFABQAUAlWABQAUAFASlSwBQAAUAFASwWFAABQAAUAABBbLA AFAAAAC0AAAAAQBRSAAAABQAAoAAICgAAAUCAAAAAAAAAFIAAAAAAAAADV4O/g1cYNlAAAAAABAA AAAAAAAAQAAUlQqUAAACAAAAAAAAAAAAAAUAAFABQAUBFVABQAUAFABQBFLAFABQAUAFlCABQAUA AFASwLFABQAAAUAAFllEAAFAAAABQAoAABLFUBAAAAFAAAAAAACgAAAUBLAAAAAAABQASwAAAAAA AAA1eDv4NXGDZQAAAAAAAAAAQAAAAAAAACoSgAAAACAAAAAAAAAAAUAAAFAABQAVKEFABQAUAFAB RAFABQAUAFARVQAUAAFAABQEpUsAAUAAFAAABQIAAFAAABQAAoAAFSwWCwAAAAUAAAAAAAKAABQA EogAAAABQAAACLAAAAAAAADV4O/P1ceo2KgqBYKgoAAAAAAAAAAQAAAAAACpQECAAAAAAAAAAAAU AAFAABQAAUQBQAUAFABQAUlIFABQAAUAFEVUAAUAFAABQAEsUAFAAABQAAUACABQAAAAUAAKCAtA QACwAABQAAAAAAAAAUAAAKAgAAACgAAAABKIAAAAAAADVz9DP1ccNlqCpQCAAAqUBAAAAAAAAAAA QAAAIWCpQAAAAAAAAAAAAAFAABQAAUgBQAUAFABQAUBBQAUAAFABQEpYIBQAtAABQAAWWUgAUAAF AABQAAIFAAAAABQAAAAUCUoBAABQAAAAAAAAUAAAAAACKqUAAAAAAAAAEsAAAAAAANTg0M/Vxw2U AAAAACxSKIoAAABAAAAAAAAAQAIAKJQAAAAAAAAAABQAAUAFRRABQAUAFABQAUBLFABQAAUAFAEU IBQAoFABQgALQBAFAABQAAUAAAQKVLAAAAFAAAABQAAAIKBQAAAAAAAAUAAAAAAABLCoqgAAAAAA AELBQAAAAAANTg7+DVxw2UAAAAAEAAAqCoKAAAAAAEAAACAAAAAFlAAAAAAAAAAAUAARQAAUAFAB QAUIC0ARQAlCgAlABQAVAABQAUAFAAABQEFAAC0AIBQoCUAIFqUQAAUAAAAAFAAAAAgUAKAAAAAA BQAAAAAAAAAIAAUlAAAKAEUAAAAAAAADVz+/g1ccNlAAAAAAAAAAAWEoAAAAAAAAgAAAEAAAAABQ KgqUAAAAABSIABQAAUAFABQAUARQAAUAFABQAEsWwAUAFAABQAAUACUWABQAAUAAKAEUUEAFRQAA AAUAAAAAAQBQAoAAAAAAFAAAAAAAAAAiiUAAAAAELQAAAAAAAAANTg7+DVyA2UEAAAAAAAAAACKg oAAAAAAAAQAAAAAAAAAAABYKgqJagoJYAUAAFAABQAUAFABUAAFABQAUAARVQBQAUAAFAABQAAVL AAFAABQAAUQFAIAFCgAAAAUAAAAFASwAAAAABQAAAoAAAAAAAAAAAAAAARQAAAAAAAoAAIA1ODv4 NfIDOgAAAAAAAAAAALBQAhBUFAAAAAAAAAAAAAAAAAAEAAoAAAKACgAAoAAKACopAoAAKACgAAoE CgAoAAKACgAAoAEACgAAoAAKAAAgApYAAABaAAAAACgCAAAAAAKAAAAAAAAFAAAAAAAoAAAgAAAA AAAAAAAABqcHfwauSGygAAAAgAAAAAAAAAFQVBUFQVBUFSgAAAIAAAACgBAAAAAAKAACgAAoAAKA ACpYAoAKAACgAoACKqACgAAoAKAACgAIKqAAAKAACgCFAIAqoAAAoAAAAUACgAJRFCAAACgAAAAA AAAABQAAAKAAAAIAAAAAAAAAAAACkUafB38GrkhsoAAAAAAAAAAAAAAAAAAAIAABUoAAAAAEAAAA oAAAAAKAACgAAoAAKIVCgAAoAKAACgApKIAKAACgAoAAKAJFi2iQFAAoAAKAAABAopAAAoAAAAAK AAAILBUUAACgAAAAAAAAAAoAAAUAAAABAAAAAAAAAAFEURQABp8HfwauUGygAAAAAAAAAgAAAAAA AAAAAAAAFSgQAAAAAAACgAAAAoAAAKIVBULUALYAAKAAEoAKAACgIKAACgAAoAAKAICqgAAoAAAK AAACoUUIAAKAAAACgAAACAoAgoAAUAAAAAAAAACgAAABQAAACWAAAAAAAAACwVBUFAABp8HfwauU GygAAAAABAAAAAAAAUAAAAAEAAAAAALKAAAAAAAAAoAAAKIVACgAAoAASgAAoAKAACgCAKACgAAo AAKAAIopAAoAAAKAAACiAFBAAoAAUAACgAAAAAAogAAAAAFAoAAAAAAAAAAAAAAAEFAAAAAAAAAA AAoAAGpwd/Bq5QZ0CKJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAsAAAAAFAAABQAAUAAAJQAAUAAFAB QACFAABQAAUAAFABSAsLABQAAAUAAAFEBSUEsUAAAAFAACgAAAAUABAAAAABQAAAAoAAAAAAAAAA AAFAAikiiKIolARQoAAAAAADUz9DP08oNmQAACwVBUoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgA AAoAQACgAAoAAKAACgACKWAAKAACgAAoAAKgKgCgAAoAAAAKAICgKICkAACgAAAAAAAoAUAlgAAA CgAAAAAAABQAAAAAAAAAKAAAAAAAAgAAABQAAQBqZ+hn6uWGzIAAAEAqCoKgqCoKAAAFBAAAUAAA AAAAAAAAAAAAAAAFACAAUAAAFAABQAAAUAAFQLBQAgAFAABQAAUBFCFAAABQAAAUAAQFUAQWUSwC 0AAAAAAFAAAAAAhSKEsUKAAAAAAAAAAAACgAUAAAAAAAAgoAAAIAAAAAAAADUz9DP1cwM6AAAAAA AAAsFQVBUFQVFVBUFAAAAAAACgAAAAAAAAABAKAAACgAAAoAAAKAACkFILEoAAKAAACgAAoAAKgA AAoAAKAAAACxQAIKALAAAABQKAAAAAAAAItAIAAABQAAAAAAAAAKAAAAAAAFAAAQCwUACWAAAAAA AAAGpn6Gfp5gbMgAAAAAAAAAAAAAAAAAAFgoAAACCoWoKgqCoKgoAAAAUAAAAFAAAEKRVgsAFACA AUAAFAABQAAAUAAFEBSABQAAAUAAAFAAELAUUBLAsAAAUAAAKAAAABQAAEAAAAAAFCgAAAAAAAAA AAAAAAAEsoACoKBAAAAAAAAAKNPP7+DTzQ2ZAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAFQVBULU FSgABC1BYAAAKAEAAoAAKAACgAAAoAQACgBUqKEAAAAoAAAKAAAAlLKAhYUUQKAAAAAAACgAAABQ AgAKQAKAAAAAAAFAAAAAAAAAAAAAJYoAIFLKQApFEURRFEUAoAGlwd/Bp5oZ5AAAAAAABQAAAAAA AAAAAAAAAAAAKAAAAAAAACgABAAKAAAACgAAAoAAAKAAChAAAKAAACkBYAoAAAAKAAACgAAAIAoI tgAAABQKAAAAAAAAAILC0CWUAAAAAAAAAAAAAAAFAoAAAAACURRFgAAAAAAAAURRKAGlwd/Bq5wZ 0AAAAAAAAAAAFAAAAAAAAAAACgAAUAAAAAAAJQAAAAAUAAAAFAAABQAAAlAAABQACChQCAsLBQAA AUAAAAFAAAAAQUoIAAAAUAAAAAKAAAABQAABAAAAKAAAAAAAABQAAAAAAAoAAAAAAAABKIoAAAAA AA0uDv4NPODZkAAAAAAAAAAAACgAAAAAAAAAAAAAoAAAAAAAKAAAACgAAAAAoAAAQCgAAoAAACWK sFgAAthAUAChAAAAAKAAACgAAAIAUACgAAAAAAAoAAAAUAAIAAAAAAAABaAAAAAAAAAAAAAAAFAA AAAAAAAAAAAAQGnwd/Bp54Z5AAAAAAAAAAAAABQAKAAAAAAAAAACgAAAAAAoAAAAAKAAEAAAoAAA AKAAACgCFQBKAAAACgAAAAoAAAAAKAAAAAgpRFgAAAAFoAAAAAAAAAAAEChQAAAAAAAAAAAUAAAA AAAAAAAAAAAAAAAFAAAAAJYAunwd/Bo58VsyAAAAAAAAAIKgoAAACFoAAAAAAAoAAFAIFgqCoKAF AAIKgqColqCpQAAFEKAAAQoUAAQqWIFsAAAFAAAABQAAAAgFAAACgAUAAAAQAABQAAAAAAAoAAFA AAQBQBAAACgAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAACFWKNLP0ODT4IszyAAWCoKgqCoqoKgsAA AAABYAUACoKgqCoLAAqCwUAAAAAFAAAAABQAAALAABQAAAgFAWAAAFAAAABQgAAAAFAAAAABQAAA AAACVYoiwAACgAAUAAAAAAAACKoAAQAAAAAACgAAAAAAAAAAAAAUKAAAAAAAAAAAAAAAAA0s/Qz9 HgDZmAAABUAAAAAAAAAAAAAKAAFAAAAAAoAAAAKAAAAAACgAAABAKAAAAACgAAAABKAAAACgAAAA AAoAAAAAAKAAAAAIAAAoAAAAAUAAAAAAAAAQoUAAAAAAAAAAFAAAAAAAAAAAAAAAABQAAAAAAAAA AGln6Gfo8IZ5AoAAAUAAAAAAAAAAAAACgAAAAAABaAAAACgAAAAAoAQAAAACgAAAAABKAAAACgAA AAABKAAAAAACgAAAAAAACLUpFVKCAAAAAACgAAABQAAACAAAAAAFAAAAAAAAAABQAAAAAAAAAAAA AAAAAAAAUAEAaWfoZ+nxBnkAAAAACgAAAAAAAAAAAAoAUAAAACgAAAAAoAAAAAKAAAAAACgBAAAA AKAAAAAChAAAAAAAKAAAAAACgAAAASgAQWAAACgABQAAAAAAAAAhYoFEpAAAAAAABQAAAAAAAAAA UAAAAAAAAACgAgAAKAAAAABpZ+hn6PEGeQAAAAAAAAKFAAAAAAAAAoAAAAAUCgAAAAoAAAAAAKAA AEAAAoAAAAAAASgAAAAAAoAAAAQAACgAAAAAAACLUFhQAAAAAAAAAAAAAUAACgAACFgABQAAAAAA AAAAAUAAAAAAAAAAAAFAAAAAAAAAAAAAaWfoZ+jxBnmAAAAAAAAAAACgAAAAAAAoUAAACgAEFShC 1BUFQVBUFQVLaEAAAAAAAoAAQAAAACgAAAABAAKAAAAAAAACgAAACFlEUSwVAAACgAAABQAAAAAA AAAAUgAAAAAABQAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAFAaWfoZ/n8YZ5gAAAAAAAAAAABaAA AAAACgAASwVFpYLBYAAKAAAACgAAVBUFAAAEoAAAAAAAAAQCgAAAAAAAoQAAAAAAAAAACiFgBQAA AAAAAAAAAAAUAAAAICkWAAAUAAAAAAAAFAAAAAAAAAABQAAAAAAAAAAAAAAAAAAGln6Gf5/IGzMA AAAAAAAAAAAAFAAAAABRKsAAAFAAAABQAAAoFCAoAIAWCoKAFAAACAAAAAAAAAUIAAAAAAABQAAA AAAACAoiwABQAAAAAAAoAAAAAAAAKAAiiKAIAAAKAAAAAAAAAACgAAAQAAAAAKABQAAAAAAAAAAA ANLP0M/z+QM8gAAUAAAAAAAAAAAFCgAEAFAAAABQoAAAFAAAABQAAAAAAAKiWpQAAAAAAAIAAAAB QAAAgAAAAAAFAAAAAAIAAAoAAAAAAAAAAAAAKAAAAAACkAAAAAAAKAAAAAAAAACgAAAAAAAAAAAA AAAAAAAAAANLP0M/z+QM8wAAAAAUAAAAAKAAABQEoQAAUKAABQAAAAUAAAAFAAAAAAAABQAKgqIq CoKlAAAAAgAAAFAAAAAAAAAAAAAASwKWAAAAAAAAACgAAAAAAAAAoAEASwBQQAAKBQAAQAAAKAAA AAAAAACgAAAAAAAAAAAAAAAAANLP0M/z+UMswAAAoAAAAFAAAAAAABUUlSgAAUAAAFACgAUAAAAF AAAAAAAACAUAAAACoKIAAAAAAAACUAAAAAAAAAAAAgqCwAAAAoAAAAAAAAAAAKAAAAAAEoAAUiiL AAAKAAAAAABAUKAAABAAAAAAAAAAAAAAoAAAAAADSz9DP83mDPMAAAAAAAAAFAAAAACgVFIsLAAB QAoAFAAABQAAAAUAAAAAAAAAAAJQAAFgqUACAAAAAAAAAAAAgAFJaSiKIoiiKIoiiLAAAAAAAAAA AKAAAAAAACgAQAAAQqAKAAAAACgAAAAAAAAAoAAAAAAAAAAAAAAAAAAAADSz9DP83lDPYAAAAAAA AAAAChQAAEoCKUSoABQKAAACgAABaAAACgAAAABAAAAAAAAAQKsUSgAAAAEAAAAAAAAAAAAACFQV BUAAAAAAAUAAAAAAAAAFAAAAACFRVQAAAAAABQICgAgAAAUAAAAAAAAAAAFAAAAAAAAAAAAAAaWf oZ/m8wZZgAAoAAAAAUAAACgAAASghaUIAAKAAAAChQAKAAAACgAAAAAABAAAAAAACxFAAAACgAAA ABAAhUFQWURRFEURRFEURRFEUQUAAAAAAAAAAFAAAAABQCUkURYAAFgFAAACkWAUAAAAAACABQAA AAAAAAAAAAAAAAAAAUAABpZ+hn+XzhnmAAAAAACgAAAAAAoAACVQCKsoQAAKAFAAoAAAKAAAFoAQ AAAAAAAEAAAAVBQBAAAAAAAAAKAAAAAQVBUFQVBUFgAAAAAAAABQAIAAAAAAFAAAAAABQAAJFEoA ABSAAAAAAFAAAAAAAAABQAAAAAAAAAAAAIAAABpZ+hn+XQGeYAAAAAAAAKAAAAAFAoACUAIKoQAU CgAAAoAAAWgAAoAAAQAAAAAAAEACkUAAAABAAAAAAAAAEURRFEURRFEURRFEUQAAAAUAAAAAAAAF AAAAAAgUAAILBQAABQABAAFAgAAAAAAUAAAAAAAAAAAAAAURVRRFEURRFEURRFGjn6Gf5POGewAA AAAAAAAAAFACgAAUAACUEsVSoAAFAAABQoAAFAAAAAAACAAUAAAAAIWCoKgqCgAAAACAAAAAAAAA AACCwoAAAAAAAAAAEACgAAAAAoAAAAACCgFlQAAAQCgAAAAAAoEAAAAAAACgAAAAACiKIoiiKJQA AAAAAA0c/Q4PLoiss5QAEAAUAAAAAAAKBQAAAAUACUpLFUIAAFACgAUAAAFAAAAAAACAAAAAAKgq CgCAUAAAAAAAAAAIACgAIoiiKIogAQAAAAAAKAAAAAAACgAQAAAAKAAAAAAEoAsQAAAKAAAAAACg AAAQAAAAUiiKAoAAAAAAAAAAADR4O/g8mgMtgACAKRRKCUQKAAFAAAAAoAAAAWgSgliqEAAFoAAA KAAAACgAAAAAAABAABYAAFEURRFBLAAAAAAAAAAAAAAAAAAAEAAFAAAAAAAAgUAAAAAFAAAAAAgU AAAABFVFgACAAABQAAAFgCkURVRRFEUSgAAAAAAAAAAAAAAABo8HfweTQGWYAKAAAABFEoJYBQKA AAACgABQAKAABCqlgFAAoAAAKAAAAAAACgAAALLAAAAAAhUFAAEAAAAAAAAAAAAAAAAEAUAACAAA AAABQAAAAAUCAAAABQAAAAAIFAAAARVRQAgFEUkUBQAAAAAAAAAUAAAAAAAAAAAAAABo8HfwePQG WwAAAAAAFACgIoASwBQAAAAtAAAABQAEstUIAAFAAABQAAAAAAAAAAAFiKlABCwAUBYKAAIAAAAA AAAAAABAoCKIsAAAAAAAAoAAAEAACgAAAAAoAEAAACgAAAAsAAAAAACgAAAAAAsAAAAAAAAAAAAA CgAAAAAANHg0M/xaQy2AAAAAAABQAKAAlEoRYAoAAUACgAAAoUABFKlEAKQKAAAAACgFEoAAAAJR FEEAFEURRFEUSgAAAAAAEABQAAAAAAAAAAAAEUkFAAAAABQAAAAIFAAAAABQAAIAAFAAAABYAAAA AAFAAAAAAAABQAAAAAAAAAAAAAAAGln6Gf4tIZbAAAAAAAAoAAAAAFAihKIALQAAAUAALQAAAVKA EogFFiiAAFJQAAAAABQAAgAAAAAAAAAAAAAAAAAAAAAEAAAAAAEqwAAAAAoEAAAACgAAAAQKAAAA CgAAQAAKAAAAACgAQAAAAKAAAAAAAAAAAACgAAAAAAANLP0M/wAOkMtgAAAAAAAAUCgAAAAAoCUR VRYAoAAAKFAAoAAAAKAAABFAKAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAABQCUQAAIAFAAAAAA BYAAAAFAAAAgUAAAAAFAAgAAUAAAAAAFAAAAgAAAUAAAAAAAAAAAAAAABpZ+hn+HUGWwAAUiiKIo iwACgAAAUAAAAALUolCLAFAACgUAAAFAAAABQAAAAAAAAUAAAAAAIAAAAAAAAAAAAAAAAAAACgAQ AABKEogoAAAEAACgAAAAoEAAACgAAAQKAAAAACgAAQAKAAAAAAACgAAAAAAAAAAAoAAAAAEAA0uD v4PBqDLYAAAAAABFgFopAAAAAAoAAAUCgRRFEChQAAKAAAACgAAAAAoAAAAAAAAAAAAQAAACgAAg AKAAAAACABQAAAAAAAAWAJRFEWAAUAACAABQAAAUCAAABQAAAAWAAAABQAAAAAIFAAAAAAABQAAA AAAAAAAAAAAAGlwd/B4NIZbAAAUAAAABKAoCLAVYsAAAAUAAKABQEoSiLLRSAABQAAAAAUAAAAAA AFAAAAAAAACAAAAAAAAAAAAAoAAAAAAEAACgAAAAAsSiAAAACgAAQAKAAACgQAAAKAAAACwAAAAA KAAAAAACgAAQAAAAAAAAKAAAAAAAA0uDv4OfqDLYAAAAAAAAAAFoAAEWKKRRAAABaAAAACgABUUo EUQAAKAAAAAACgAAAAAAAAAAAoAQAAAFBAUAAAACAAAAAAAABQAAIAAFAAARRFiBQAAAUAACABQA AAUCAAABQAAAAUACAAAABQAAAAAAUAAAAAAAAAAAAAAABp5+hwc/TFZbIoiiAAAABQAAAAoFAAAA AiliiCgAAUAAAFACgAAWKIUiiAAALFAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAQKAAAAACgAQAA AKAASiKSCgAAAoAAEACgAAAoAEAACgAAAAoAAEAAAACgAAAAAAAAAACqlAAACLAADT4O/g52oMtg AAAEURRAAFEAAFoAAAAKAAAlEWWgAAAAoAAAWgAAAAAJSxQABFEWAAKAAAAAAAAAACgAAAAAAAAA gAAAAAUAAAAACBQAAAAUCAAAABUWAAIFAAABQAIAFAAAABQAAIAFAAAAAABQAAAAAIFAACkURQAA AAAAAAABpcHfwc7UGWwAAAAAAAAFAiiLAoiygAUAAAAFACgIpYUgAAAUAAKABQAAAAAAUBKIsAAA AUAAAAAAAAAAAAAAAAAAAAAKBAAAAAAoAAEACgAAAAoEAASiCgAAQKAAACgAQAKAAAACgAAAQKAA AAAAACiiKIolAAAAAAAKAAAAAAA0uDv4ObpC7AAAoFAAAAAAAAABQIqooiiLFAAAABQoABKIpYog AAUAKAAAABQAAAAIogWxSLAAAAAAAAAFAAAAABAAAAAAoAAAAAKBAAAAoAAEAACgAAAsAiggFqKJ UBSBAoAAKAAAKSCgBSAACgAAAACrIolAAAAAKAAAAAAAAAAAAAAA0uDQ4ObqirsgAAAAoAAAAAAF AAAAAC0BKIoiwBQAAAtAAAABQIoiiAAC0AAAAAAFAAAlCLAAFAAAAAAAAAAAAAAAACgAQAAAKAAA ACwAAAAKABAAAoAAALAIoARalBFIsQKFIolAKAAASiKsASiKJQCgIoAAAACgAAQAAAAAAAAKAAAA AA0+Dv4OZqC7AAAIoiiKIqooiiKWKIsAAAAUAAAKBQAIoiiBQAoAAFAAAAABYoiiKIKABQAAAAAU gKIoiwAAAAAAAAAAAAAACgAAAAAoEAAACgAAAQKAAACgAQAKAAAACwCUAqKAAAoEAAACgAAAAoEA AAACgAAAAAAAoAAAAAAAAAAAADT4O/g5mkLsAAAABQAAAAAoACKJRYoiiKIsAUKAAABQEoiiKIst AAAAABQAAAAIpYKAAAABQAAAAIsAUAAAAAAAAAAAKABAAAAoAAAALAAAAAoAEACgAAAoEAACgAAA sAAACgAAAoAEAACgAAAAoAAEAACgAAAAAAAAAAAoAAAAADT4NDg5emKu2AAAAAAAAAAAAC0AAAAA FAiiKIqoAFAAAABQIqooiiBQAAAAAUACKqLAAFAAAABQEogAAAAAAAAAAoAAAAAAKBAAAAoAAAEC gAAAoEAACgAAQKAAACgAAoEAAACgAAAoAEAACgAAAAAoAAAAAAALAAAAAAAAAAAANTg7+Dl6Qu0A AAAACKIoiiKIpYAAAAKAABQAAAAUKiiKIAFAAAABQpKIogAAUAAAABKWLKAAABQAAEogAAUAAAAK AAABAAAAoAAAALAAAAAoAEACgAAAsAAACgAQAKAACgAAAsAAACgAAAAoAAECgAAAAAAoAAAAAAAA AAKAAAAAA1ODv4OVpBsACgAAAAAAAUAAAAAAAFiqiiLAAAFAAACkpYogAAAUAAKAilgAAAAAUACK qABQAAAAEpYAAAKAAAAAAAAACwAAAAKAAABAoAAAKBAAAoAAECgAAoAAECgAAAoAAAKBAAAoAAAK AAAAACwAAAAAAAKAAAAAAAAAAAA1OHu4eVpBsAASiKIoiiKIstAAAAAAAABQAAAAoFiiLAAAFACg EoiliwAAAAC0BKIoiwBQAAAAIstAAAABQEogAoAAAAAAAAAKAAAACwAAAAKBAAAAoEACgAAAoEAC gAAAoAEACgAAAoAAKAAABAoAAAAKAAAAACgAAAQAAAAAKAAAAAA1eDv4OTpBsAAAAAABQAAAAqKI oiiLFFIogAAAAtAAAiiLFAAACgAUCKIogUAKAAASlgAAAAUKShKIsAUAABKqBQAAAAAAAAsAAAAC gAQAAKAABAAooiiKIqyKIogoAAALAAAoAAAKABAoAAAKAAACgAAAsAAAAACgAAAAAAoAAAAAAAAA AADV4O/h5OiKbIoiiKIoiliiLAAAAAAAAKBQAAAIoixQAAAoAFASiKIoiiC0AAAFSiKIAKABQEoi iABQAoAFiwAAASqSlgAAAAAAAoAAAECgAAAQqoAAAUlLAAAAoAALAAEoiqgAAsAAACgAAoAAECgA AoAAAKAAAACgAAQAAAKAAAAAAAAAAAAAAA1eHu4eToBsAAAABQAAAAEoiiKIAAFAAACgAVKIoiiK IALQAAAAAWKIKABQAAIogAtAAAASliiACgEpYsAAAoFiiAAAACgAAAAAAsAFJYLCgAQoACgAQAKA AACgQAKAAEooikiiKqAACgAAAoAAKAABAoAAAKAAAAACgAAAAAQKAAAAAAAAAAA1uDv4eRogmwAA AFLAAKAAAAAAAABQAIoiiCgUAAAAAFSiKqKIogAUABKqKWAAAAABYqosAAAUBKIsoAFAiwACgUBK IAFCgAAQAAAqopEoigAKAABAoAAAECgAAoAALAAABKKBCpaBAIsoAAKAAACgAAoAAAKBAAAAoAAA AAAKAAAAAAAAAAAAAA1uHu4eP5wbAAAAAUAAAABKIoiqgAAUAAAAAFSiKqKIoiwABQAAoBKWLAAA KBUoiiAABQApKIogAUAKiwBQAEoiygUABKIALQAAQBQACgQAAKAAABAoAAAKBAAoAAAKBAAoCKAo CUAoCKIKBAAAoAAKAAACgAAAoAAAAKBAAAAAAAoAAACoKlAABADW4e/h43nixsAAABQAAAAAAAAA ApKWKIogAAAAUAAKAABYoiiAAC0ACKIsAUKAAAiiLFACgAWLAAAKilgAAEqoFAAAACkpYpAAAAoA EAACgAAAsAAACgAQAKAACgAAsAACgAAAoABKqLAAKBAAoAAKAAACgAAAAoAAAAAAKBAAAAFgqUAA AAAINfh7uHjecGwAAAFAAAAAAAiiKIogAAUKAAAigFiiKIogAoFAAAAiiLLQAAAIpYsoAAABKWKI soABKWKIKABYsAAApKWKIAAKAAAACgAAAQKFIoiiKIqyKIoACgAAsAAACooiiCgAQKAACgAAoABK qLAAKFIsAoAAAKAABAoAAAAKAAAAAAAWKqCpQAAAAAADW4e7i4vmiybAAAAAUAAAAAKAAAAABYoi iKIAKABQAAAEoirYogAAAAtiiKIAAFCkoiwABQAEqoogUBKIsoAFAiiCgAAWKIqooiwFIoiqASki gAKAAACgQAAKAABAoAAKAACgEoiqgQAKAACgAAoAAKiiLBSosAAoAAAKAAAACwAAAAAAKAqCoKAA AAAAAADX4e7h4vmCbAAAAAAUAAAABKIoiqiiKIAFAAAAACgWKIsAAAAUKAiiLAFCgAIoiiBQoABK IogUKAAiwBQpKIsAUAKSiLAAALQAAQAKAAAACgAAAoEAACgAAsAAACgAoAAKAASqixAAoAAKAACg AAoACLKAAWCwoAAAKAAAAChSKIpIoAAAACgAAAAAANfh7uHieYJsKIoiiFIAAFAAAAAAAAAACgWK IoiiKIsAAtAAAAiiKWCgAAIoirYAAABKWLKAAAABYsoABKWLAKAAiiLKBQEoiiKqKIsAAAooiwAC hSKIoiiKsiiKIqooiiKIqyKIoiqgAAoAAKAACgEoiygQLQQAKAACgAAoBKIsqoKCACgAAAAoAoii KJQCgAAAAAAAAAAANfi7uHieUJsAAAAAAAAABQAAAEoiiKIogAAtAAAASiKIstAAAABYqooiwAAB UqooiwAAC1KIogAApKWLAAFiqiwAACkoiliwACgAAAAoAAAKABAAoAAAKABAoAAKAACooiwCgAAo AAKASiChSCgAAoEACgAULAAUBLKAACwAAAoiqigAAAAAAAAAKAAAAA2OHu4uH5YrHZFEURRFEURR FEURRFVFEURSwAAAAAAAALFVFEWAAAAWgJRFEUQAWgAARRFgFoACURRBaAAlEUQWgJRFEWAWgRRF gFAAAqURVRRFgAFAAAgUAAAFAABQAAIFAABQAAUAAFARRFlABQAAUBFEqUKQUAAFAABQACVUoAQA UAAALUoAgAAAAUAAAAAAAAAABscXdw8LyhNgAAAAAAAAAAAAAAUCgJRFEURRAAoAUAlEURRAAoUA AAlEVbFgAAAlWxRAAARVRSxYABSURRAoAVFEWAKFARRFEAFAAABQAAAUAAFAAABQAIAFAJRFVFgF AABQAAUAlEWUAFAABQACVUWAUAAFAABQAAUlgAAFAFAAAUAAAAAAAAAAAFAAAmzxdvFwfIE2gAJR FEoAAAAJRFEURRFEURYAAoAUAABFEUsURZQAAAAEVbFEUQAAUCpRFEAFAoEURRBQACUsWUAABFLF lAARRFVAoAAUAlEURVRRFEURVRRFEUQUACBQAAAUAAFABUURYBQAAUAFAAQtQAUAAFABUWAAUAAF AABQAEFAACgAUAAAAAAFAAAAAAAAAAbPF3cXB8cVNkURRAAAApRFEUQAAAAAAAAALKCURVRYAAAA BaBFEURRFgFoAACURVQAKAAlVFEWAKFJRFEWAAVFLFEAFAsURYBQCURRFVFEWAAUAAAFAAABQAAU AAFARRBQAAUAAFARVQAAUAFARYBQAUAAFARZQAAUAAFoIChSWAAClAAgAAUAAAAAAAAAAAAAFbXF 28XA8YY7AAAoAAAAAAFAAAASiKIoiiKIsAAUKAASiKIoiwC0AAAAKSliiLAAKASiKIpYKAAiiLKB QAIqoogUACKqAAAirYoiiACgAAoAAAKAASiKqKIAKAACgAAoCKIqoAKAACgIqoAAKACkoiwCgAoA KAiwCgUAKAACgAIKAUAAAoAAAAAAKAABAAAAAANvi7eLgeMMdgEURRFEURRFCURRFEURVRRFgACg AAAAAAJSxVRRAAAABSUsURRFEFAAAqURVRRAABSUsUQAAUlEUQKFAJRFEFoCURRFVFgAAFAsURSR VRRFEVUAAFoAAAUAAFJRFJBQAUACpVRRABQAUBFVAABQAVFEFAABQCVUCgBQAAUAAFJYACgUAAAA FAAAAAAAAAAAAAbfF28fA8MVjtiiLAAAAAAAAAAAAAAAKBQAEoiiKIAAKAABUoiiKqKIsAUAAKSi KIogoAFiiLKAABYqooiwAASrYogAEqooiiC0AABKqKIoiwCgAAoAAAKAiiLKAACgAAoBKqKIAKAC 1KIsAoAKAiygAAoAKiiCgAoFSiCgAAoAAKASwClgqUAACgAAAAAAAoAAAAAADc4u3i+f8IY7AAAA AAUAAAAAAACKIoiiACiliiKIAAAAKSiKIogUAKAAAAiliqiiAACkoiiBQpKIoiiLKBQAIqosAAIq 2KIAKAAiiKqKIsUAKAACgIoiiKqKIsAoAAKASiKqACgAEqoAKACkoiwC0AKSiLKACgAEsoALQApK IAKAACgAUKgFgoAoEAAAACgAAAAAAAAAANzi7eP5/wAMVjsiiKIoiiKIoiiKIoiiKIpYoiiAAAAA ACgAAEpYoiiLKAAAAACopYoiiKIsoAABKWKqLAAKSliiLAAKAiiKIstASiKqLAABKtiiKIogoAAK iiKIoiqiiACgAAqKWLLAAAUKAiqiwCgAIqosAoAKSliwCgAqLAKACgIsoFACgEsoAKAAC0ACLAKA WCpQKAAAAAAAAACwAAAADd4u3i+e8IY7AAAAAAAAAAAAAAAAAUBKIoiiKIqoogAAAAAtAAiiKIoi qiwBQAoCKIoiygAIpYqoogAAqKWKIogoCKIogtAAiqiiLAAKAASliqiiLAKAACgEoiqiwACgAqKI sAoBKtiiACgEqosAoALYogoACKqACgAtEAoAAKgAtACgAApLAACoqpQAAAAAKAAAAAAAAAA3ePs4 /nueGOwAAFAAAAAAAAAAAiiKIoiiKIsAAUAKAAAAAAiqiiKIpYogAoABKIqoogAtASiKIogtAAii KqKIsAoCKWLAKASiKqKIFACgEoiiKqAACgAEq2KSLALQAIqosAoABKqLAKAC2KIsAoBKqLAKAC2L AKACosAUKAiqgAoBLKBQoAAKASwCgAAFgqKqCgAAAAAAAACgAAN7j7OP53nhjsAASiKIoiiKIoii KIoiiKIsAUAAAAAAAAAAKAiliiKIqooiiAAACgIpYoiiKqLABKqKIpYsAoBKIoiqgUABKqKIAKAi liiKqAACooiiKILQAAqKIoiiLKACkoiiLKAC2KIsAoBKqKIKAASrYsAoBKqLAKBYqoAKAiygUKAg oAKBYsoAAKAELCgUEACqgqCgAAACgAAAAAAAAN7j7eP53nxWOyKIoiiKIsAAAAAAAAAgAAKAABQA AAEoiiKqKIoiwACgUAAACKqKIoiiLKBQEoiqiiLAAKiliiKIKAAiqiiBQEqooiiLKAASliqiiACg EoiqiiLAFCkoiqiwACkoiygAAtiiCgAqKIKACkpYsAoCKqBQpKIKACosUKASqgAoBKtgAoACLLQA AoAAAAEClgqCpQAAAAAAAADf4+zj+d5wY7AAAAAAAUAAAAAAAAIiqiiKIoiiKIoiiKIsAAtAAAAC gAIoiiKWKqKIogoACKIqooiwBQpKIoiiCgEoiliygAIqooiiBQoCKIqosAAoCKWKIKAACkoiqgAE q2KIKAiiLKACkpYsoAKiiCgAqKWCgEogtCkogoALYAKACoALQIsoAALUAKAAAACgAFgqCpQAAKAA ABACCoPQcnZx/Oc4MdgAAAAACURRFEURRFEURRFEURSxRFEURRFEAAAAAAFAAAAJVsURRFEURVRR AABSURSxVRRFgABFVFEWAWgJRFEWUABFWxRFgAFARRFVFigAJVRRFgFAARVsUQUBFEVUAlVFgFoA EVUAFJSxZQAVFgFAJVsAFJRBaAlVABalEFABUWAWgJZQAUCoUAAAFAAAABQAAAAAAFQVBUFQVB6H j7OT5zmxWOyKIoiiKIoiiKIsACiKIqIAAAAKAAAAAAAABQAAoBKIoiiKIqooiiKIqoAFACooiiKI qoAACKtiiLAAKSiKIsoFSiKIqosAApKWKIogoACKqKIFCgIoiqgAoCKWCgIqoAKSiLALQIqoAKSl iygEqosApKWLKASrYAKSiC0BKqCgEqoFCkogoFACoAKAAAACgAAAAAAAAAAAoAD0XH2cfzfMDHYA AAAAAAACgABAAAUAAAAAAAAAAAAlEURVRRFEUsURVRRFEUQUAAAlVFEURRFlAoAEVUURYABSURSx YBSURRFVFgCgRVRRFgFAJSxVRYABUURRBaAFRRFgFRRBalEVUAAlVFgFoEVUAFRSwUBFlAoVABSV bABSUQWgJZQAWpYBQEWUChQEFAABQAAAAAUAAAAAAAAAAB6Lk7OP5vmBjsAAAAAAAAAAAASiKIoi iKIoiiKIoiiKIoiliiKIoiiKqKIoiiKIqooiiLAAKAAiqiliiKIsAoACKIqoogUBKqKIsApKIpYq osAAIqooiwC0CKIqoABKtiiLAKAiiLKBUqosAqKIsoFSiKqACosUKSiLKASrYsAqLALUqoAKSlgo BLKBUqoKASrYAKSiC0ABKqAC0AAALAAAAAAAAAAAAAAPR8nXyfOcwMMwAAAAAAEoiliiKIoiiKIo iiKIoiiAFIoiiKIoiiKIoiiKIqooiiKIqooiwABQoACKIqooiiKIKAAiiKtiiAASqiiKILQIoiiL KAAiqiliwACooiwC0CKqKIAKSliwCkoiygEq2LAKSiKILQIqoBKtiwCoogoFiygpKILUogoFiqgA qLLQEqoFCkogoBLLQAoCCgUAKAAAABAoAAAAAAFAAA9HydnJ83yorDZFEURRFEURRFEURRFEURYA AAAAAAAAAAAAAACrFEURVRRFEAFAAAABQAEURVRRFEUQUCgRRFVFEAAlVFLFEFARRFEVUCgJRFVF EAFRSxYBSURVRYAoVFEAFRRBaBFVABUUsAFRRBalEWUBFWwCVUFAsWUAlVAoVFgFsWUAFsAFJYBa FRYBQLBQAUlEChQAAAAUAAACAAoAAAAIB6Tk6+T5vlhhmAAAAUQAAAAKAAAAAAAAAAAAAAAAAAFA AAAABQAAAAUABFEVbFEURRABQCURRFVFgChUURRFgFJRFLFEWUAlEVUUQKlVFEAFRSxVQAEVUWAK lVFgFRRFlAsVUWACVbAJVRYBbFEFJSwUFRYBbFEFJSwUFRYBbFgFJSwUFRYBalEFAJZaAFAoEWUA AFAAAAAAAAAAAAAhR6Tk6+T5zlBr2AAAAAAAAAAAAAAAAAAAAAAAAAAoAAUAAAAAFAAAABQAEURV RRFEUQUAABFLFVFEABFVFEWAWgRRFEVUABFWxRAJVRRAoVFEWUAlEVbAJRFVAJVsWAUlEWAWpRFl ARZaBFVAqVUFJSxZQEWUCpZQUlLBSUQWgRZQVFLBSURZaAlVABalEFABQLFEFAAAAgKCABQKAAAC AAel5evk+b5QYbAAAAAgAAACKJQASiKIoiiKIoiiKIoiiKIoAAACgAAAAAoAAAAKAASiKIqooiiK IsoFAASiKqKIsAEqopYoiygEoiiKqBQIqosAEq2KIAKiiLKBUoiygEpYsoCKqACopYsAqKWCkogp KtgEqoFSqiwCosUKiwC2LKASrYBKqC1KIsoFSqgAtiygEqoFCkogAoAFiygQAABYAoAAAFAABFAD 0vJ18vzfKisM4oiiKAAAEoiiKiKIoiiKIoiiKIoiiKIoiiKIoilikACgAAAAAoAAAAAKAASiKqKW KIoiiKqAAAAiqiiLAFCooiiKqAAiiKtiwASiKqBUqoogEqopYsAqKIsoFiiLKAirYCKIsoFSqgEq osUKiykpYKAiygWLKAiy0KiwC2LAKSxQpKqBQqLALUogoLYAKSiC0BKIsoAKBREqCigAEoiiKIpQ AAIEKAPTcnXy/OcmK17IoiiKIoiiKIoiiKIoiiKIqIoiiKIoiiKIoiiKIoiiKqKIoAAACgAAAAAA oAABKIqooiiKIoiqiwAAASqiliiLAKSiKIqosAUCKqKIBKIq2ASqiiBUqoogAqKWCkoiiC1KIsoC KWCkoiygWKqAirYKiwCosUKiiC2KILYqoCKtgIsoKilgpKWCgIsoLUogpKWCgEqoFCgIogoAAKAA AAABQAAAAAsA9Ny9fJ83yQ15gFEURRFEAAAAAAAAAAAEAAAAFEVUURRFEURRFVFEoAAAAAABQAAC VUURRFEURRFVFEACgJVRRFEUQUBFEVbFEABFVFECpRFVAJVRSxYJVRRAqVUUQUlLFgFRRFlqURYB UUsFJRBalEFJVsAlVAqVUAlVAqVUFqUQUlLBSVUCpVQCVbBQEWUCxZQCVbABSUQWgAJVRYBQAAAA AAAUAAACggHp+Xq5fm+QGGwAAAAAAAAAIAAAAAAAAAAAAAKIoiiKIoiqiiKSKIoAACgAAAAEqooi iKIpYqooiiLAAKAiiKIoiygUCKIqosAIqopYBKIqosAtiiLAKilgEqosAtiiLAKilgqKIFSqiwSq ixQqLKBYsoCLLUoiygWLKSqgVKqBUqoBKtgpKILUogpKtgAqLFCosoBKtgAEqosAtAAiqgAAAAAo AAAAAAAD1HL1cvznIDXmAAAAAAAAAAAAEAAAAAAAAAAAFEVUURRFEURRFEURVSgAAAAAAFRRFEUR RFVFEURRABQCURSxRFVAAJVRRFgCpVRRFgBFWxYARVRYBbFEAlWxYBUUQKlVFglVFigRVQKlVAJV sFRRBalEFRSwVFEFsWUlEFqUQWpVQCVbAJVQWpRBSUsFJRBaFRYBSUsFAAJVQKAFAAAJRFlAAAAA AAAAeo5url+c5Aa8woAAIAAAAAlAAAAAAAAAAAAAAEAAFIoiiKIoiiKqKIoAASiUAoAACUIoiqii KIoiiLALQAIoiqiiKIBKqKWKIBKqKIsAWKqLACKtiwCoogVKqLBKqKWAiqgVKqLBKIstAiygWLKS iLLUqosEq2ASrYBKqC2LBKqBUqoLUogpKWCkqoFiygEq2CkogtAiygEq2LAAKSiLALQAAAoCAKIo gAAAAAPU8vVzfO8eK15xRFEURRFEURRFEURRFEURRFEVEURRFEUSgAAAAAAAAURVRRFEURRFJFEU RVAAAAAABQAEURRFLFVFgAAlEVUURRFgFsURRABUUsWAVFEWALFVFgFRSwEVUWKlVFgBFWwEVUCp RBUUsFRRBbFEFRVsBFlAsWUlEFqVUCxZQEWWpVQKlVAJVsFJYBbFgFRZaAlVAoVFgFAsWUAAFRYA oAUAAAABFVFEoRRFEUeo5url+c44a8wAAAAAAACiKIoiiKIoiiKIoiiKIpJQAAAAAAAFIoiiKIoi iKIqgAAAAAAAoAAACKIqooiiLAAKSiKIpYogpKIoiwC2KIogpKIpYKiiLALYogIq2ASqiwBYqoCK tgIqoFiykoixUqosEq2LKSlgpKILYsEqostSiC2LAKiy1KILUqoBKtgIsoFiygqLFCkogtAiygAt SiACgEoiygUAAAKAAAAAAA9TzdPN87xg15gAAAAAAAAABAABRFEURRFEURRFEURQAAAACAACkURV RRFEUAAAAAABQAAAACURVRRFEURYBaAlEURRFlARSxZQCURRBalEUQVFLFglVFEFsUQEVbFglEWU lLFlJRFlqURZalEFRSwEWUFsWCVUWKlVAsWUFRYqVUFqUQVFipVQWpRBUWKFRZQLFlARZaAlVAoV FgFAJVsAAFAJRFgChQAAAAAAAHquXq5vneMGvMAABKAAAAAAAAAAQAAAAAoiiKIoigAAAAAAAUii KIpIolAAAAKAAAAAAACkoiiKWKIqoAACKIqoogVKIqoBKIq2ASiKILYoiykoixQqKIFiqgEoiy1K IspKWCopYKiwC2LBKqBYqoFiygIstSqgWLKAiy1KqBUsoCLLUqoFSygIstCosAtiwCostASqgUCK qACgWLAKAAASqiwABQAAAAAPVc3VzfPcWK15xRFEURRFEURRFEURRKAAAAAQAAAAAURRFEUgAAAA AABRFEURQAFAAAAAAAgAWgAAJRFEVUURYAAJRFVFLAJRFVFglLFVFgBFWwEURZSUsWAVFLARVQLF VARSwVFEFsWCVUWKlVAqVUlEWWpRBalEFRZalEFqUQVFlqUQWxYBUFqUQWxZQEWWgRZQWxYBUWKF JRBaAlEFABbFEAAFAAARRFEUQUCgAer5unm+d4oa8wAAAAAAABSKIoiiKSUAAAAAAAABSKIoiiKA AAAAQAoiiKIoAAAAAACgAAAAAAIqooiiKIsAUKiiKIsAqKIsUCKqLAFiqgIoiy1KIsEq2KIKilgI qoFiwSqixUqoBKtgIq2AiykpYKixUqoFSqgqLFSqgVLKCoFSqgtiwSqgVKqC2LAKixQqC0CCgIst ASqgUKSiACgAWKqAAAACgAAAIsAPV8/TzfPcUNeYAAAAAAAAAAApFEURRFEURQAAEAAgApFEURQA AAAAKRRFEUkoAABQAAAAAAAAAUlEURSxRFEFAJRFEUQWpRFEFRRFigRVQCVbFglEWWpRFgFsUQEW WpRFlJSwEVbARZQLFlJRBbFglWwEWWpVQKlVARZalVAsWUlLBSWUCxZSUsFRZQLFlBbAJVQKlVAB UWKFJRBQKBFlABQKBFEAFAAAAAAAer5unn+f4sVrziiKIoiiKIoiiUAAAgAEAFIoiiKIolAAAAAA AUiiKSUAAAABSKIoigAAAAAAEAAAACgUCKIoiiKIsoBKIoirYBKIogtSiKIKilgIqoBKWLKSiLFC osEpYspKILYogtiwSiLLUogtiwSqgWLKSrYCLLUogtSiCostSiC2LBKtgqLALYKSlgqLKBYKSlgp KILUqoAKixQAqLALQIogoAAFCooiwAAAAAA9ZzdPN8/xQ15AAAAACkURRFEUSgAAAAAAKRRFEURS SgEAAACkURRKAAAIAKRRFEoAAAAAABQAAAAACURRFVFEWAKBFVFEAlEVbAJRFlAsUQVFLAJRFlJS xYJVRYqVUCxRBUWKlVFglWwEVbJRFlRYqVUCxZSUsFRYqVUCpZSVUCxZSVbAJZaBFlJVsBFloVFi pVQCVbBSUQWgRZQEWWgARVQKFARYABQAAKAlEURVQAHrOfo5/n+IGvMAAAAAAAAAAAoiiKJRAgAA AAAoiiKIoAABACiKJQAAAAKIoiklICgAAAAAAAAAAApKIoiliiACooiiASrYogIoiy0CLALYogIq oFSiLKSlgIq2AiykpYCKtgIspKWLKSlgqLBKtkogtiwSrYCLLUqoFiykogtiykpYKiy1KILUqoCL LUqoFSqgEq2ASqgVKqACopYKASiCgUAKiiAAAACgAUAD1nN08/A4kVrziiKIoiiKSUAAAgAAAAAU iiKAAAAAQAoiiKJSAAACiKJRAAAACiKIoiiUAAAAAAQAALQAAIoiiLAKAiiKWCkoiwBYqosEoixQ qKIFiqgIpYKiiBYspKIstSiC2LBKqLFSiC2LBKtgIspKWSqgWLKSrYCLLUogtiykpYKiwSrYKixU qoLYsAqC1KILUogqLLQEsoFSqgAEq2ACgIogtAAAiiLKAAAAAA9Zz9HPweIGrMAAAAAAUiiKIoii UAAAAQAoiiUAgAAAAoiiUQAAAoiiUgKACQAoiiKIolAKAAAAAAAAASiKIoiygAVKIsApKIsUKiiA SliykoixUqosEpYspKIsVKqLBKtgIsVKqASrYCLLUogtiwSrYCLKSlkqoFiykpYKixUqoLYsEq2C osEstSqgVKqC2LBKtgEqoLYsAqLFCosAtSiLKASrYAAAKiiBQoAACKIAAAD1vP0c/B4ga8wAAAAA AAAQAAAAoigIAAAAKIpAAAACiKJSAAAQUiiKAAABSKIoiiKSKJQAAAAAAAASqiiKWLAACKIsoFii LKAilgEqosEpYKSiBUqoBKWCopYCLKSlgqKWCosEpYKixUqoFiykpYKgWLKSlgqLBLLQqBUsoFgp LLUogtiykpYKiygWCkq2ASygWLKCoFCosAtAiwCgWKIKAASqgAUAAAKAAA9Zz9HPweIGvIoiiKIo iiKIoigIAAAAAAFIolEAAAAFIoCAAAQUigAAAAoipJQAAAKIoiiKIoAAAACgAEoiiKIogAAqKIFA iqiwBYogqKIFiqgWKIKilgIsoFiwSqgVKqBYsEqoFiykpYKixUqoFiwSy1KILYsEstSqgWLKSiC2 LKSlgqC1LBKtgpLFCospKWCostAiygWCkpYKAiygUKiwACkpYAKAAiiAC0AAAAD1vP0c/C4YaswA AAAAAABSKIoiiKJRAAABSKIqAAAAQUiiUAAAColEAAAFIoigAAEAKIoiiKJQAAlABKIoiiKIsoAF SiKIBKqKWASiKqBYogqKWAiygWLBKqLFSiC2KICLLUogtiwSqgWLBKtgIstSiSrYCLLUogtgIstS iC2LKSlgqC2LBKtgqLBKtgqLFCoFSygqBUqoLUogpKWCgIsoFAiygAEq2AAACkoiwAAABQPW8/R8 OFw4rXnFEURRFEUkoAAAAAAAAFEVAAAIAKRRKAAAABRKSAACkUSgAACCkVEoAAACkURRFEUkURRF EVUURSxRAAARRFlAqURYBSURYoEVUCxYJVRYqUQVFLARZalEWCVbARZalECxZSUQWxYJZalEFsWC UsFQLFlJSwVFlqWAWwVFipZQWwEWWpRBallAQWpZQLFlJVsAllAsWUFJSwAVFgFoEWAUAlLFlAAA AAJRFVFEUes+HRz8LiBryAAAAAAAAAFIoioAAABBSKAAAAACoikAAAAKAAAQqIolAAAAoikAAAAA FIoiiKIoiiKIogAAEqoogUCKIsoFiiLBKqLFSiLKSlgIstAiwSrYBKILYsEq2AixUqoFiykpZKIK ixUqoFiyksVKqBYspLFSqgtiwSrYCC2LKSlgqC1LALYspKWCospKWCkstAiykpYKASy0AKiwBQqL AKABYsAAoAAAAAD1vP0c/D4Ya8yiKIoiiKiKAAAAAAQAAolAAAAUiolEAAAFIolAAEFiKAAACiKQ AAAWIolAAAEAAAAACgAAAUCKIogEqopYBKIogpKWAirYCLBKtiwSiC2KIFiykogtiwSlgqLFSiC2 LCLLUogtiwSrZKIFiyksUKgtiwSrYCC2LKSxUqoLYsEstCosEq2CosVKqC2LAKgVKqC1KIKAiy0A CLKBQqLAAALYogAAAAAAr1vw+/w4fDDVmAAAAACAAAAFEUSgAAAAKSkgAAApFAAAILEUAAAFEogA AsRRKAAIKRRFEoAAAAAAAAAAJRFEURYBalEWAEVUCgRYJVsWCUQWxRAsWUlEWKlVAsWUlECxZSUs BFlqWCVbARZalECwVFipZSUsFRYqVUCxZSWWpRJVsFQKllJVsFQKlVAsWUlWwEWUlWwCWWgRZQWp YBQLBQCUQWgARZQAAKlEVUAAAAB67n6OficMNWQAAAApFEoAAAAAAAAFSAAACkUAAAgBUAAACkUg AAQUSgACCkUAABBRFJFAAAAAAUAAlEURSxYAJRFgFJSxYARZaBFgFsWCURYqVUBFloEWKllAsAll oEFJYqUQWxYJSwVAsWUlLBUCxZSUsFQLFlJSwVBbFgllqVbAQWxZSWWgRZSVbARZalEFsWUBBalV AoVABSUsAFJRAoUAlEAFAoEURRLAAB674ff4cThhryAAAAAAAAAAAAKiUQAAAUlAAEAFiUAAABSU QAIKJQABACgAAIFIpAAAAACiKIoiiKIoiiKIogAAIq2ASiLAFSqgEogtiiBYsoCLFSqgWLBKqBYs pKWAiy1KIFiyksUKgIsVKqBYKixUq2AgqLFSy0CC2LBLLUqoFgqLLUspKWCostSiC2LKSlgqLKSl gpLFCksoFSqgAqLFACksAUAKgAAoAFAAAA9b8Pv8OJwg15gAAAAAAAFRKIAAAAAUSgACAFQAAAAU SiAACwACAFEoAABBRKIAAKRQAAAEgApFEVUURRFEAACxRAARVsAlEAlWwCUQWpRARSwVFipVQLFg lVAsAlloEFsWCUsFRYqWUCwEWWpYBbARYqWUlWwEFqWCVbAQWxZUWWpSwVBbFlJSwVFglWwVFipV QWxYBUWKFQUCxZQALFlABUWAKAlVAAAAABQAHrfh0c/E4Ya8wACoiiKSUAAAAAABSKAAAQAqAAAA CkAAACFAAEFAAAgUlEAAAFJQACQUiiKAAAAAAAAAAIoiygWKIACLLQIsEpYspKIFSqgIsVKqBYsp KWAiy1KIFiykogtgEstSiBYspLFSiC2LBLLUogWCostSxQqBYspLLUsEq2CosVLKSrYKixUqoLYs Eq2CosEq2ASrYKSiC0CCgEsUKASwC0ACLKAAAAAAA9dz9Hw4vDDVkAAAAAAAAAAKSgAACAFQAAAA AogAAsSgACAKAAQKSiAACkUABIAKSgAAAKRRFJKAAEURRFEWKAAlEWUCxYARVQLFgCxZSUQKlVAs WCVUCxZSUsBBalglLBUWKllAsFRYqUQWwEWKlVAsFRYqWCVbBUCxZSWKlVBbAsWUlloVAsWUlWwE FJZaBBallAsWUFRYoVFgFqWAUCwAUBFgFoAEUQUAAAAB674ff4cXhhqyAAAAAAAKIolAAAEAFiUA AAABQEAAFgAAEFAAAgpAAAFAAJACgAAAUlEAACAAAAAAAAEqopYACLAKSlgEqoFiwBYsoCBUsoFg EstSiCosVKILYBLFSqgWLKSxQqBYsEq2AgWLKSxUqoFgIstSy1KILYKixUspLLQqBYspLLQILUso FgpLLQILUsoBKtgEsoFCoAKSxQApKIALQAEogAAAAPXfD7/DjcMNWQAAAACgAAAACABBQAAAAAog AAAsAAAgoAALEogAAoAAEgoAAAKSiABAAApFEUAJRFEURRFEAAlVFigRRAJVsAlgFsWALAJZQLBS WKFQKlglWwEWKlVAsFRYqUQWxYJZalECxZSWKlEFsBFlqWCVbAQWwVFipZalVBbARZallAsFJZaB BallAQWpZQLBQEFqVUChUWAAWwAAUlgCgBQAEURYAAeu+H3+HF4Ya8gCiKAAAAAAQAWJQAAAAAFJ RAAAgUAABBQAAIUQAAoACQAUAAAUQAIAAAKAAAQAAAAAAFSiACosUBKIBLLQIsUKgEsUKgVLALYB LLQICLLUogWLKSlgqBYsEq2AgtiwSxQqBYKSxUsUKgWCostSwSrYKgWC2LKSy1KILYspKWCospKW CostAgtSygIstAiygVKqAASy0AAKgAUAKAAAAA9d8Pv8OLwg15gAAAAAAgAsSgAAAAAAKgAAAQUA AAgCgAELKgACgAEgCgAAAogQAAKSgAACAFAAACURRFEWACUsWACVUCxYBbFglECpZQLBSWALBSWK BBalgCwVFipVQLAJZalgFsAlipZQLBUCpYJZaBBbAqWUlipVQWwEFsWUllqWKFQUlihUFqWAWwUl ihUFqWAUlihSWAWgRZQAWwAACVUACgAABQAHrvh9/hxeEGvMAAAEAAAKgAAAAAABZUAAACFAAAEA UAAgUBABQAJAFAAABRAgABQABAABSUAgAAAAAAKiwABYsAIstAgEq2ASxQqASxQqBUsAtgEsUKgE stSwBYLYsEstAgWCksUKgWASy1LALYCC2ASy1KILYFiykstSykpYKgtSwC2CoLUsAtiykpYKgoFg pKWCgIKBUsoACLLQAAEqoAFAAAAA9d8Pv8ONwg15gAgAAACkAAAAAAAAKIAAEKAAAIAKAABFCAAK AASAUAACiBAACygAIAKSgEAAAAAAAAAJVQACWKAllAsWAWwCUQWxYAsFJYoEFRYqUQWwCWWpRAsF JYqVUCwCWWgQLFlJYqWUlLBbAQWxYJZaBBbAJZallqUQWwVBalgFsFJYoVBalgFQWpYBbABbABUA FqWAUAlloAAAUlgCgAAAAeu+H3+HG4Qa8wQAAABSAAAAAAAABQEAACKAAEAAUAAhZUAAFAAAkWUA AWVAAgAUABABQAIAAAAAAAAAACosAAWASqgVLALYsAIFSygWASygWCksUCC1LBLFCoFiyksUCC1L BKtgIFSyksUKgWC2Aiy1LBLLQILYBLLUstAgtgpLFSygtgpLFCoLUsAqC1LALUALYAKgAtSwCgEp YKAAASygUAAAAD13w+/w43CDXkAAAALAAAAAAAAACiAAALLAAAIAoAABFCAALKABIAoAAKIAEAUA AIBQABAAABRFJFEURSwAACWUACwAVAqWACWWgQKlVARYqVUCxYJVsBBalgCwVAqWUCwEWWpYBbAJ YqWUCwVAsFJYqWKllAsFQWpYJZallAsFsWUlipVQWwCWWhUCpZQVAqWUFqWAVAoUlgFqUQUACwUA AAllAoAAAAHrvh38HJ4IaMwAABYAAAAAAAAAAoQAABZYAABFlAAAhZUAAAoAAkAoAAKECAFlAAQB ZQAIAAAUQAAAABLAFACoAFgAqBQIBLLQEsUKgEsUKgVLALYBLLUsAWCksVKILYBLLQIFgpLFSygW CoFiwSy1LFSqgWCoLUsEstSqgWCkstSxQqC2LBLLQqASy0KgVLKC1LAKgUKSwC0CACgVLAKAASiC 0AAAddx5n6A9HK6csy4/8jy7QAAAAAAAAAAAKAAAAAIABKAAAAACgAAAAAoAAQIAUAAAAAKAAAAA AAAAAAAAAAABAAAQAApBQAEAACBQpAAAgAWAAgoBABUABCgEFAQAEALUABABUKAQAIFCoACAC1AA QApBQAIKAQAAtgAAEAKAAAQUAAAKAAAgAL6Mz8/YNnk//9oACAECAAEFAPV9NHpS26Bt0DboG3QN ugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26B t0DboG3QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3Q NugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26 Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3 QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNugbdA26Bt0DboG3QNsgbZA2 yBtkBT00Ovp/5vsCOlA5HSgcjpQOR0oHI6UDkdKByOlA5HSgcjpQOR0oHI6UDkdKByOlA5HSgcjp QOR0oHI6UDkdKByOlA5HSgcjpQOR0oHI6UDkdKByOlA5HSgcjpQOR0oHJaUDktOByWnA5LTgclpw OS04HJacDktOByWnA5LTgclpwOT04HJ6cDk9OByfZA5Psgcn2QOT7IHJ9kDk+yB3R2QO6OyB3R2Q O6O2B3R2wO6O2B3R2wO6e2B3T2wO6e2B3T2wO6fyB3T+QO4fkDuH5A7h+QO4fkDuH5A7h/6tcYH8 f2B3H9gdx/YHcf2B3H9gd1fsDurugd1d0Durugd1d0Duvugd190Duvugd198Duvvgd198DlO+Byn fA5Tvgcp3wOU74HKakDlNSByupA5XUgcrqQOV1IHK6kDldSByupA5XVgctqwOW1YHLasDltWBy2r A5bVgctqwOW1YHLasDltWBy2rA5bVgctqwOW1YHL6sDl9WBy+tA5fWgcvrQOX1oHL60Dl9aBy+tA 5fWgcvrQOX1oHL60Dl9aBy+tA5fWgcvrQOX1oHL60Dl9aBy+tA5fWgd7afV0LwM4cOPHjtuJ7P5A zo/T/9oACAEDAAEFAOnp4cuXA5cDlwOXA5cDlwOXA5cDlwOXA5cDlwOXA5cDlwOXA5cDlwOXA5cD lwOXA5cDlwOXA5cDlwOXA5cDlwOXA5cDlwOXA5cDlwOXA5cDlwOXA5cDlwOXA5cDlwOXA/ngfzwP 54H89J/PSfz0n89J/PSfz0n8dJ/HSfx0n8dJ/HSfx0n8dB/HQfx0H8dB4+g8fQePoPH0Hj6Dx9B4 +g8fQePoPGmeNM8aZ4kzxJniTPEmeJM8SZ4kzxJniTPEmeJM8SZ4kzxJniTPEmeJI8KR4UjwpHhS PCkeFI8KR4UjwpHhSPCkeFI8KR4UjwpHhSPCkeFI8KR4UjwpHhSPCkeFI8KR4UjwpHhSPCkeFI8K R4UjwpHhSPCkeFI8KR4UjwpHhSPCkeFI8KR4UjwpHhSOv1kurp2Kxw/IHcPyB3D8gdw/IHcPyB3D 8gdw/IHcPyB3D8gdw/IHcPyB3D8gd0/kDun8gd0/kDun8gd09sDuntgd09sDuntgd09sDuntgd0d sDujtgd0dsDujtgd0dsDujsgd0dkDujsgd0dkDk+yByfZA5Psgcn2QOT7IHJ9kDk9OByenA5LTgc lpwOS04HJacDktOByWnA5LTgclpwOS0oHI6UDkdKByOlA5HSgcjpQOR0oHI6UDkdKByOlA5HSgcj pQOR0oHI6UDkdKByGlA5DSgchpQOQ0oHIaUDkNGByGjA5DRgchowOQ0YHIaMDkNGByGjA5DRgcho wOQ0YHIaMDkNGByGlA5DSgchpQOQ0oHI6UDkdKByOlA5HSgcjpQOR0oHI6UDkdKByOlA5HSgcjpQ OR0oHI6UDkdKByOlA5HSgcjpQOR0oHJaUDktOByWnA5LTgclpwOS04HJacDktOByWnA5LTgclpwO S04HJacDktOByenA5PTgcnpwOT04HJ6cDk+yByfZA5Psgcn2QOT7IHJ9kDk+yByfZA5Psgcn2QOT 7IHJ9kDk+yByfZA5Psgcn2QOT7IHJ9kDk+yByXVw6k4GdfX09HT/ANnoE/2Bns9p/9oACAEBAAEF AHt8Ta+hT/UPPX1XM9lzPZcz2XM9lzPZcz2XM9lzPZcz2XM9lzPZcz2XM9lzPZcz2XM9lzPZcz2X K9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZ cr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9 lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvRcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr 2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9lyvZcr2XK9ly vZcr2XM9lzPZcz2XM9lzPZcz2XM9lzPZcz2XM9lzPZcz2XM9lzPZcz2XM9lzPZcz2XM9lzPZcz2X M9lzPZcz2XM9lzPhcz2XM+FzPhcz4XM+FzPhcz4XM+FzPhcz4XM+FzPhcz4XO+FzPhc74XO+Fzvh c74XO+Fzvhc74XO+Fzvhc74XO+Fzvhc74XO+Fzvhc74XO+Fzvhc74XO+Fzvhc74XO+Fzvhc74XO+ Fzvhc74XO+Fzvhc74XO+Fzvhc74XO+Fzvhc74XO+Fzvhc74XO+Fzvhc74XO+FzvhdD4XO+Fzvhc7 4XQ+F0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0 PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6X Q+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0Pp dD6XQ+l0PpdD6XQ+l0PpdD6XQ+l0PpdD6XQ+nD/UvvDiy/6zq9hc/wBCp1KPEjd2e4PtXkcfavI4 +1eRx9q8jj7V5HH2ryOPtXkcfavI4+1eRx9q8jj7V5HH2ryOPtXkcfavI4+1eRx9q8jj7V5HH2ry OPtXkcfavI4+1eRx9q8jj7V5HH2ryOPtXkcfavI4+1eRx9q8jj7V5HH2ryOPtXkcfavI4+1eRx9q 8jj7V5HH2ryOPtYkcfaxI4/ViRx9rEjj9WJHH6sSOP1YkcfqxI4/ViRx+rEjj9WJHH6sSOP1Ykcf qxI4/ViRx+rEjj9WJHH6sSOP1YkcfqxI4/ViRx+rEjj9WJHH6sSOP1YkcfqxI4/ViRx+rEjj9WJH H6sSOP1YkcfqxI4/ViRx+rEjj9WJHH6sSOP1YkcfqxI4/ViRx+rEjj9WJHH6sSOP1YkcfqxI4/Vi Rx+rEjj9WJHH6sSOP1YkcfqxI4/ViRx+rEjj9WJHH6sSOP1YkcfqxI4/ViRx+rEjj9WJHH6sSOP1 YkcfqxI4/ViRx+rEjj9WJHH6sSOP1YkcfqxI4/ViRx+rEjj9WJHH6sSOPtXkcfavI4+1eRx9q8jj 7V5HH2ryOPtXkcfavI4+1eRx9q8jj7V5HH2ryOPtXkcfavI4+1eRx9q8jj7V5HH2ryOPtXkcfKvI 4+VeRx8q8jj5V5HHyrSOPlWkcfKtI4+VaRx8q0jj5VpHHyrSOPlWkcfKtI4+VaRx7q0jj3VpHHur SOPdWkce6tI491aRx7qsjj3VZHHuqyOPdVkce6rI491WRx6qsjj1VZHHqqyOPVVkceqrI49VWRx6 qsjj1VZHHqqSOPNUkceapI481SRx5qkjjzVJHHmqSOPNUkceapI481SRx4qkjjxU5HHipyOPFTkc eKnI48VORx4qcjjxU5HHepyOO9Tkcd6nI471KRx3qUjjvUpHHepSOO9SkcdqlI47VKRx2qUjjtUp HHapSOO1RkcdqjI47VGRx1qMjjrUZHHWoyOOtRkcdajI461GRx1qEjjpUJHHSoSOOlQkcdKhI46V CRx0qEjjpUJHHOoSOOf3yOOf3yOOf3yOOf3yOOf3yOOf3yOOX3yOOX3yOOX3SOOX3SOOX3SOOX3S OOX3SOOP3SOOP3SOOP3SOOP3SOOP3SOOP2yOOP2yOOP2yOOH2yOOH2yOOH2yOOH2yOOH2yOOH2yO OH2yOOH2yOOH2SOe/wDZI57/ANkjnv8A2SOe/wDZI57/ANkjnv8A2SOe/wDZI57/ANkjnv8A2SOe /wDZI5732SOe99kjnvfXI5731yOe99cjnvfXI5731yOe99cjnvfXI5731yOe99cjnvfXI5731yOe 99cjnvfXI5731yOe79cjnu/XI57v1yOe79cjnu/XI57v1yOe79Ujnu/VI57v1SOe79Ujnu/VI57v 1SOe79Ujnu/VI57v1SN+JUc/W6+CkjTa3LOHs/8AN9I4/in8/wBZZlmWZZlmWZZlmWZZlmWZZlmW ZZlmWZZlmWYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDA YDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAY DAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDAYDLMsyzLMsyzLMsyzLMsyzL MsyzLMsyzLMsyzLMsyzLMsyzLMoyjKMoyjKMoyjKMoyjKMoyjKMoyjKMoyjKMoyjKMoyTJMkyTJM kyTJMkyTJMkyTJMkyTJMkyTJMkyTJMkyTJMgyDIMgyDIMgyDIMgyDIMgyDIMgyDIMgyDIMgyDIMg yDIMgyDIMgyDIMgyDIMgyDIMgyDIMgyDIMgyDIMg4eDm1/If/9oACAECAgY/AGq5jXuc1HKrk/nq asViGrFYhqxWIasViGrFYhqxWIasViGrFYhqxWIasViGrFYhqxWIasViGrFYhqxWIasViGrFYhqx 2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYh qx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrH Yhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiG rHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2Iasd iGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2IasdiGrHYhqx2Ia sdiGrHYhqx2IasdiGrFYhqxWIasViGrFYhqxWIasViGrFYhqxWIasViGrFYhqxWIasViGrFYhqxW IasViGrFYhqxWIasViGrFYhqxWIasViGrFYhqxWIasViGrFYhqxWIasViGrFYhqxWIasViGrFYgr f8GsX+ytT+FT6P8Ax+zHQ2UD8dDZQPx0NlA/HQ2UD8dDZQPx0NlA/HQ2UD8dDZQPx0NlA/HQ2UD8 dDZQPx0NlA/HQ2UD8dDZQPx0NlA/HQ2UD8dDZQPx0NlA/HQ2UD8dDZQPx0NlA/HQ2UD2UNlA9lDZ QPZQ2UD2UNlA9lDZQPZQ2UD2UNlA9lDZQPZQ2UD2UNlA9lDZQPZQ2UD2UNlA9lDZQPZQ2UD2UNlA 9lLZQPZSkoHspSUD2UpKB7KUge2lIHtpSB7aUge2lIHtpSB7aUge2lIHtpSB7aUge2lIHt+Ege34 SB6fCQPT4SB6fCQPT4genxA9PiB6fED0gekD0/4ZZYHrA9fmB6/MD1+YHr8wPX5WB6/KwPX5WB7v lYHu+Vge6pYHuqWB7qlge6pYHuqWB7qlge6pYHuqWB76lge+pZwPfUs4HvrdOB763Tge+t04Hvrd OB763Tge+t04HvrdOB763Tge+t04HvrdOB763TgfkrdOB+St04H5K3TgfkrdOB+St04H5K3Tgfkr dOB+St04H5K3TgfkrdOB+T9HTgfk/R04H5P0dOB+T9HTgfk/R04H5P0dOB+T9HTgfk/R04H5P0dO B+T9HTgfk/R04H5P0dOB+T9HTgfk/R04H5P0dOB+T9HTgfk/R04H5P0dOB+T9HTgfk/R04H5P0dO B+T9HTgfk/R04H5Ecn8fy9XJ/qir/wAlgb/Cf3O5BNH/ALun/Y4BwDgHAOAcA4BwD15689eevPXn rz15689eevPXnrz15689eevPXnrz15689eevPXnrz15689eeuPXHrj1x649ceuPXHrj1x649ceuP XHrj1x649ceuPXHrj1x649ceuPXHrj1x649ceuPXHrz15689eevPXnrz15684BwDgHAOAcA4BwDg HBOCcE4JwTgnBOEcI4RwjhHCOEcM4ZwzhnDOGcQ4hxDiHFOKcU4pxTjHGOMcY4xxzjnHOOcc8B4D wHgPAeA8B4DwnhPCeE8J4TwnhPH/ALf6f//aAAgBAwIGPwA6IdEOiHRDoh0Q6IdEOh0Oh0Oh0Oh0 Oh0Oh0Oh0Oh0Oh0Oh0Oh0Oh0Oh0Oh0Oh0Oh0Oh0OiHRDoh0Q6IdEOiHRDoh0T6OifR0T6OifR2p9 Han0dqfR2t+jtb9Ha36O1v0drfo7W/R2t+jtb9Ha36O1v0drfo7W/R2t+jtb9Ha36Oxv0djfo7G/ SHY36Q7G/SHY36Q7GWodjLUOxlqHYy1DsZah2MtQ7GWodjLUOxlqHYy1DsZah2MtQ7GWodjLUOxl qHYy1DsZah2MtQ7GWodjLUOxlqHYy1DsZah2MtQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1 stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1 stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQ1stQVP8Gt/wBWp/B/b7EgekD0gekD0gekD0gekD0+IHp8 QPT4genxA9PiB6fED0+IHp8QPT4genxA9PhIHp8JA9PhIHp8JA9vwkD2/CQPb8JA9tKQPbSkD20p A9tKQPbSkD20pA9tKQPbSkD20pA9tKQPbSkD2UpA9lKSgeylJQPZSkoHsobKB7KGygeyhsoHsobK B7KGygeyhsoHsobKB7KGygeyhsoHsobKB7KGygfjobKB+OhsoH46GygfjobKB+OhsoH46Gygfjob KB+OhsoH46GygfjobKB+OhsoH4/zbKB+P82ygfj/ADbKB+P82ygfj/NsoH4/zbKB+P8ANsoH4/zb KB+P82ygfj/NsoH4/wA2ygfj/NsoH4/zbKB+P82ygfj/ADbKB+P82ygfj/NsoH4/zbKB+P8ANsoH 4/zbKB+P82ygfj/NsoH46GygfjobKB+OhsoH46GygfjobKB+OhsoH46GygfjobKB+OhsoH46Gygf jobKB+OhsoH46GygfjobKB7KGygeyhsoHsobKB7KGygeyhsoHsobKB7KGygeyhsoHsobKB7KGyge yhsoHsobKB7KGygeyhsoHsobKB7KGygeyhsoHspSUD2UpKB7KUlA9lKSgeylJQPZSkD2UpA9tKQP bSkD20pA9tKQPbSkD20pA9tKQPbSkD20pA9tKQPbSkD20pA9tKQPbSkD20pA9tKQPbSkD20pA9qp /wBESBqvcv8Ai1qfyqqa3C9/+w5ByDkHIOQcg5ByDkHIOQcg5ByDkHnPOec855zznnPOec855zzn nPOec855zznmPMeY8x5jzHmPMeY8x5jzHmPMeY8x5jzHmPMeY8x5jzHmPMeY8x5jzHmPMeY8x5jz nnPOec855zznIOQcg5ByDkHIOSck5JyTknJOUco5RyjlHKOWcs5ZyzlnLOYcw5hzDmHNOac05pzT mnOOcc45xzjnHOOec855zznnPOec8557A9gewPYHsD2B7A9gewPYHsD2B7AT/wCrr5+n9P/aAAgB AQEGPwD6/T6/X/MuTHfn6/R7/wBDnfq/m+37R+fqd9S3f8v1+n1/Ezvs8ZKZdAyUy6Bkpl0DJTLo GSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy 6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMl MugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0D JTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZd AyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSm XQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bk pl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMug ZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTL oGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyU y6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQM lMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0 DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZKZdAyUy6Bkpl0DJTLoGSmXQMlMugZSZ dAyky6BlJl0DKTLoGUmXQMpMugZSZdAyky6BlJl0DKTLoGUmXQMpMugZSZdAyky6BlJl0DKTLoGU mXQMpMugZSZdAyky6BlJl0DKTLoGUmXQMpMugZSZdAyky6BlJl0DKTLoGUmXQMpMugZSZdAyky6B lJl0DKTLoGUmXQMpMugZSZdAyky6BlJl0DKTLoGUmXQMpMugZSZdAyky6BlJl0DKTLoGUmXQMpMu gZSZdAyky6BlJl0DKTLoGUmXQMpMugZSZdAyky6BlJl0DKTLoGUmXQMpMugZSZdAyky6BlJl0DKT LoGUmXQMpMugZSZdAyky6BlJl0DKTLoGUmXQMpMugZSZdAyky6BlJl0DKTLoGUmXQMpMugZSZdAy ky6BlJl0DKTLoGUmXQMpMugZSZdAyky6BlJl0DKTLoDnvufy537Hll/h/wDD6D6Wt/8AX6/X7GP/ AJSzvp+h35f+p32+v9/73fw/b/ZdP+37Ps76u/2fX6u+rDn6vt/3/wDqLvsfww7ddj+GHbrsfww7 d9j+GHbrsfww7ddj+GHbrsfww7ddj+GHbrsfww7ddj+GHbrsfww7ddj+GHbrsfww7ddj+GHbvsfw w7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvs fww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHb vsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+G Hbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j +GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfww7d9j+GHbvsfw5h277H8MO3fY/hh2 77H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/h h277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY /hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3 fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3fY/hh277H8MO3XY/hh26jfww7dRv4Yduo38MO 3Ub+GHbqN/DDt1G/hh26jfww7dRv4Yduo38MO3Ub+GHbqN/DDt1G/hh26jfww7dRv4Yduo38MO3U b+GHbqN/DDt1G/hh26jfww7dRv4Yduo38MO3Ub+GHbqN/DDt1G/hh26jfww7dRv4Yduo38MO3Ub+ GHbqN/DDt1G/hh26j+GHbqP4Yduo38MO3Ub+GHbqP4Yduo/hh26j+GHbmP4YduY/hh25j+GHbmP4 YduY/hh25j+GHbmP4YduY/hh25j+GHbmP4YduY/hh25j+GHbmP4YduY/hh25j+GHbmP4YduY/hh2 5j+GHbmNh25jYduY2HbmNh25jYduY2HbmNh24jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh24 jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh24jYduI2HbiNh0+Nh0+Jh0+Jh0+Jh0+Jh0+Jh0+ Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh0+Jh06Jh06Jh06Jh06Jh06Jh06 Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh06Jh02Jh02Jh02 Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02 Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jh02Jhz+j7fw eHn/AFd+fp9v6v8Ape79DDf1JLc930/LnmGfj9H0+v7/APAf6c32/wAQ/wCR+n/5f9383/iNaca0 41pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjW nGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca041pxrTjWnGtONaca0415xrzjXnGvONeca 8415xrzjXnGvONeca8415xrzjXnGvONeca8415xrzjXnGvONeYa8w15hrzDXmGvMPBMPBMPBMPBM PBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMP BMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMPBMNeYa8w15hrz DXnGvONeca8415xrzjXnGvONeca041pxrTjWnGtONaca041pxrTjWnGtONacas41ZxqzjVnGrONW cas41ZxqzjVnGrONScak41JxqTjUUGooNRQaig1FBqKDTUGmoNNQaag01BpqDTUGmoNNQaag0lBp KDSUGkoNJQaSg0lBpKDSUGioNFQaKg0VBoqDRVGiqNFUaKo0FRoKjQVGgqNBUaCo0FRoKjQVGgqP Xqj16o9eqPXqj16o9eqPXqj16o9eqPXqj1yo9cqPXKj1yo9cqPXLD1yw9csPXLD1yw9csPWrD1qw 9asPWrD1qw9asPWrD1qw9asPWrD1qw9YsPWLD1iw9YsPWLD1iw9YsPWLD1iw9YsPWLD1iw9YsPWL D1iw9YsPWLD1iw9YsPWLD1iw9YsPWLD1aw9WsPVrD1aw9WsPVrD1aw9WsPVrD1aw9WsPVrB34/8A y/z/AH/53yHY/wDU/E/0v+P7/wCz/9k="
                                    transform="matrix(.48 0 0 .48 -43.26 -41.82)"
                                  />
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </switch>
                    </svg>
                  ),
                  leagueoflegends: (
                    <svg
                      className="w-10 h-10"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.6571 2V19.1875H20.6883L18.4383 22H4.87581L6.50081 19.1562V3.96875L5.00081 2H10.6571ZM11.8758 5.75C15.7821 5.8125 18.9071 8.96875 18.9071 12.875C18.9071 14.875 18.0946 16.6875 16.7508 17.9688H18.8758C19.8758 16.5625 20.4696 14.875 20.5008 13C20.5946 8.15625 16.7196 4.1875 11.8758 4.09375H11.8446L11.8758 5.75ZM5.28206 15.875C4.84456 14.9688 4.62581 13.9375 4.62581 12.875C4.62581 11.8125 4.87581 10.7812 5.28206 9.875V6.96875C3.90706 8.5 3.03206 10.5 3.00081 12.7188C2.96956 15.0312 3.84456 17.1562 5.28206 18.75V15.875Z"
                        fill="#CEA146"
                      />
                    </svg>
                  ),
                  paypal: (
                    <svg
                      className="w-11 h-11 text-black dark:text-white"
                      width="255"
                      height="255"
                      viewBox="0 0 255 255"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M229 128C229 72.2192 183.781 27 128 27C72.2192 27 27 72.2192 27 128C27 183.781 72.2192 229 128 229C183.781 229 229 183.781 229 128Z"
                        fill="currentColor"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M120.898 94.0834H157.196C176.685 94.0834 184.021 104.194 182.887 119.047C181.014 143.569 166.547 157.135 147.358 157.135H137.67C135.037 157.135 133.266 158.921 132.554 163.76L128.441 191.892C128.169 193.716 127.232 194.773 125.827 194.917H103.021C100.875 194.917 100.117 193.236 100.679 189.598L114.583 99.412C115.127 95.8021 117.057 94.0834 120.898 94.0834Z"
                        fill="#009EE3"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M97.2862 62H134.603C145.111 62 157.582 62.3423 165.915 69.8233C171.486 74.82 174.412 82.7707 173.738 91.337C171.448 120.293 154.406 136.516 131.542 136.516H113.144C110.007 136.516 107.938 138.628 107.053 144.339L101.914 177.588C101.578 179.739 100.664 181.01 99.0279 181.167H76.0007C73.4506 181.167 72.5463 179.211 73.2099 174.888L89.7613 68.3172C90.4249 64.034 92.7441 62 97.2862 62Z"
                        fill="#113984"
                      />
                    </svg>
                  ),
                  riotgames: (
                    <svg
                      className="w-10 h-10"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.6531 3.81836L2 8.39688L4.65437 17.7721L6.67454 17.5419L6.11908 11.6471L6.7824 11.3728L7.92784 17.3988L11.3804 17.0054L10.7667 10.499L11.4235 10.2277L12.6833 16.8572L16.1757 16.4588L15.5037 9.3268L16.1682 9.05253L17.5455 16.3027L20.998 15.9093V5.75828L12.6531 3.81836Z"
                        fill="#ED1C2C"
                      />
                      <path
                        d="M12.9033 18.0374L13.0791 18.9603L20.998 20.1855V17.1145L12.9076 18.0364L12.9033 18.0374Z"
                        fill="#ED1C2C"
                      />
                    </svg>
                  ),
                  tiktok: (
                    <svg
                      width={255}
                      height={255}
                      viewBox="0 0 255 255"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-black dark:text-white"
                    >
                      <path
                        d="M17 128C17 188.751 66.2487 238 127 238C187.751 238 237 188.751 237 128C237 67.2487 187.751 18 127 18C66.2487 18 17 67.2487 17 128Z"
                        fill="currentColor"
                      />
                      <path
                        d="M185.828 93.3215V87.5428C179.206 87.5491 172.726 85.6223 167.183 81.9988C171.964 87.4915 178.458 91.7448 185.828 93.3215Z"
                        fill="#25F4EE"
                      />
                      <path
                        d="M167.183 81.9988C161.744 75.7859 158.747 67.8088 158.75 59.5515H152.058C152.934 64.1202 154.725 68.4642 157.325 72.322C159.924 76.1798 163.278 79.4715 167.183 81.9988V81.9988Z"
                        fill="#FE2C55"
                      />
                      <path
                        d="M112.4 112.271V106.301C110.377 106.016 108.337 105.868 106.295 105.858C94.2862 105.872 82.7739 110.649 74.2827 119.14C65.7915 127.631 61.0148 139.144 61.0002 151.152C61.0028 158.434 62.7619 165.607 66.1285 172.064C69.495 178.52 74.3695 184.07 80.3382 188.24C72.5637 179.859 68.2715 168.832 68.3336 157.4C68.3228 145.611 72.9288 134.286 81.1651 125.851C89.4015 117.416 100.613 112.541 112.4 112.271V112.271Z"
                        fill="#25F4EE"
                      />
                      <path
                        d="M113.467 178.212C124.613 178.212 133.831 169.221 134.246 158.177L134.334 59.6945H152.19L152.165 59.5442C151.779 57.4887 151.584 55.4021 151.582 53.3108H127L126.96 151.944C126.756 157.287 124.493 162.343 120.644 166.054C116.795 169.765 111.659 171.842 106.313 171.85C102.969 171.852 99.6746 171.036 96.7173 169.474C100.461 174.674 106.566 178.212 113.467 178.212Z"
                        fill="#25F4EE"
                      />
                      <path
                        d="M106.294 130.278C94.8874 130.278 85.4714 139.749 85.4714 151.152C85.4714 159.098 90.1134 165.998 96.6988 169.463C94.1531 165.956 92.7824 161.734 92.7828 157.4C92.7886 151.916 94.9695 146.658 98.8471 142.78C102.725 138.901 107.982 136.72 113.466 136.713C115.538 136.718 117.597 137.04 119.571 137.67V112.546C117.549 112.26 115.509 112.112 113.466 112.102C113.1 112.102 112.755 112.12 112.399 112.131H112.304L112.238 131.147C110.314 130.549 108.309 130.255 106.294 130.278Z"
                        fill="#FE2C55"
                      />
                      <path
                        d="M185.828 93.0281L185.711 93.0061V112.007C173.402 111.977 161.413 108.08 151.439 100.867V151.141C151.449 157.074 150.289 162.951 148.024 168.435C145.76 173.919 142.436 178.902 138.242 183.099C134.048 187.296 129.068 190.625 123.586 192.894C118.104 195.163 112.228 196.328 106.295 196.322C97.0172 196.377 87.9503 193.559 80.3383 188.255C84.5679 192.815 89.6934 196.452 95.3939 198.939C101.094 201.427 107.247 202.71 113.467 202.709C125.478 202.695 136.994 197.917 145.486 189.423C153.978 180.928 158.754 169.412 158.765 157.4V107.387C168.739 114.557 180.716 118.405 193 118.387V93.7908C190.589 93.7898 188.185 93.5341 185.828 93.0281V93.0281Z"
                        fill="#FE2C55"
                      />
                      <path
                        d="M151.589 151.152V101.142C161.565 108.312 173.543 112.16 185.828 112.142V93.0171C178.584 91.4537 172.042 87.5838 167.183 81.9878C163.292 79.4572 159.955 76.1628 157.375 72.3042C154.794 68.4457 153.024 64.1034 152.172 59.5405H134.154L134.114 158.174C133.911 163.517 131.648 168.574 127.799 172.285C123.949 175.996 118.813 178.073 113.467 178.08C110.188 178.077 106.958 177.293 104.042 175.794C101.126 174.295 98.6093 172.124 96.6989 169.46C93.3564 167.709 90.5562 165.077 88.6012 161.85C86.6463 158.622 85.611 154.922 85.6072 151.148C85.614 145.664 87.7959 140.407 91.6741 136.529C95.5524 132.652 100.81 130.471 106.295 130.465C108.366 130.47 110.425 130.792 112.4 131.418V112.128C87.9172 112.703 68.1722 132.767 68.1722 157.4C68.1668 168.852 72.5161 179.877 80.3382 188.24C87.9364 193.589 97.0028 196.456 106.295 196.45C118.304 196.436 129.817 191.66 138.309 183.167C146.8 174.675 151.576 163.161 151.589 151.152V151.152Z"
                        fill="black"
                      />
                    </svg>
                  ),
                };

                if (m.type && (obj as any)[m.type]) {
                  return (
                    <div className="cursor-pointer" key={i}>
                      <Tippy
                        zIndex={99999999999999}
                        content={`${(Connections as any)[m.type].name}: ${
                          m?.name
                        } ${m.visible ? "[VISIBLE]" : ""}`}
                        animation="scale"
                        className="shadow-xl"
                      >
                        <div className="opacity-90 hover:opacity-100 ">
                          <a
                            href={
                              (Connections as any)[m.type].link && m.id
                                ? (Connections as any)[m.type].link +
                                  ((Connections as any)[m.type].id
                                    ? m.id
                                    : m.name)
                                : null
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            {(obj as any)[m.type]}
                          </a>
                        </div>
                      </Tippy>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="gap-4 lg:mx-10 md:mx-8 mx-2 lg:mt-4 md:mt-4 mt-2 relative group">
        <div
          id="blur_5"
          className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-hover:block"
          onClick={() => {
            const div = document.getElementById("blur_5_div");
            if (div) {
              div.classList.toggle("blur-xl");
              div.classList.toggle("pointer-events-none");
              div.classList.toggle("select-none");

              const el: any = document.getElementById("blur_5_show");
              if (el) el.classList.toggle("hidden");

              const el2: any = document.getElementById("blur_5_hide");
              if (el) el2.classList.toggle("hidden");
            }
          }}
        >
          <svg
            id="blur_5_show"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            className="fill-black dark:fill-white cursor-pointer pointer-events-auto opacity-80 hover:opacity-100"
          >
            <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
          </svg>
          <svg
            className="fill-black dark:fill-white cursor-pointer pointer-events-auto hidden opacity-80 hover:opacity-100"
            id="blur_5_hide"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
          >
            <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
          </svg>
        </div>
        <div className="px-4 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__delay-1s rounded-lg text-center w-full">
          <div id="blur_5_div_1">
            <div id="blur_5_div">
              <span className="mb-2 font-bold text-blue-400 flex items-start justify-start w-full">
                This feature is experimental, please report any issues to the
                Discord server.
              </span>
              <span
                className=" text-gray-900 dark:text-white lg:text-4xl md:text-3xl text-xl font-bold lg:flex md:flex sm:flex items-center"
                style={{
                  fontFamily:
                    "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
                }}
              >
                <ul
                  className="flex items-center lg:mr-6 md:mr-6 sm:mr-6 mr-1 lg:text-lg md:text-lg text-sm font-mono lg:pb-0 md:pb-0 sm:pb-0 pb-1"
                  style={{
                    flexGrow: "0.3",
                  }}
                >
                  <li
                    className={
                      "flex lg:p-2 md:p-2 sm:p-2 p-1 rounded-lg " +
                      (graphOption === "hourly"
                        ? "bg-gray-400 dark:bg-[#232323]"
                        : "")
                    }
                  >
                    <Tippy
                      zIndex={99999999999999}
                      content={"Hourly"}
                      animation="scale"
                      arrow={false}
                      placement="bottom"
                    >
                      <button
                        className="rounded-md "
                        onClick={() => {
                          setGraphOption("hourly");
                        }}
                        aria-label="hourly"
                      >
                        hourly
                      </button>
                    </Tippy>
                  </li>{" "}
                  <li
                    className={
                      "flex lg:p-2 md:p-2 sm:p-2 p-1 rounded-lg " +
                      (graphOption === "daily"
                        ? "bg-gray-400 dark:bg-[#232323]"
                        : "")
                    }
                  >
                    <Tippy
                      zIndex={99999999999999}
                      content={"Daily"}
                      animation="scale"
                      arrow={false}
                      placement="bottom"
                    >
                      <button
                        className="rounded-md "
                        onClick={() => {
                          setGraphOption("daily");
                        }}
                        aria-label="daily"
                      >
                        daily
                      </button>
                    </Tippy>
                  </li>{" "}
                  <li
                    className={
                      "flex lg:p-2 md:p-2 sm:p-2 p-1 rounded-lg " +
                      (graphOption === "monthly"
                        ? "bg-gray-400 dark:bg-[#232323]"
                        : "")
                    }
                  >
                    <Tippy
                      zIndex={99999999999999}
                      content={"Monthly"}
                      animation="scale"
                      arrow={false}
                      placement="bottom"
                    >
                      <button
                        className="rounded-md "
                        onClick={() => {
                          setGraphOption("monthly");
                        }}
                        aria-label="monthly"
                      >
                        monthly
                      </button>
                    </Tippy>
                  </li>{" "}
                  <li
                    className={
                      "flex lg:p-2 md:p-2 sm:p-2 p-1 rounded-lg " +
                      (graphOption === "yearly"
                        ? "bg-gray-400 dark:bg-[#232323]"
                        : "")
                    }
                  >
                    <Tippy
                      zIndex={99999999999999}
                      content={"Yearly"}
                      animation="scale"
                      arrow={false}
                      placement="bottom"
                    >
                      <button
                        className="rounded-md "
                        onClick={() => {
                          setGraphOption("yearly");
                        }}
                        aria-label=""
                      >
                        yearly
                      </button>
                    </Tippy>
                  </li>
                </ul>
                <ul className="lg:flex items-center grow-0 space-x-6 p-2 rounded-lg bg-gray-400 dark:bg-[#232323] lg:mr-4 md:mr-4 sm:mr-4 mr-1">
                  <li className="flex">
                    <Tippy
                      zIndex={99999999999999}
                      content={graphType === "areaspline" ? "Bar" : "Line"}
                      animation="scale"
                      arrow={false}
                      placement="bottom"
                    >
                      <button
                        className="rounded-md "
                        onClick={() => {
                          setGraphType(
                            graphType === "areaspline" ? "bar" : "areaspline"
                          );
                        }}
                        aria-label="Toggle graph mode"
                      >
                        {graphType === "bar" ? (
                          <svg
                            className="dark:fill-gray-300 dark:hover:fill-white fill-gray-900"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                          >
                            <path d="M3.4 18 2 16.6l7.4-7.45 4 4L18.6 8H16V6h6v6h-2V9.4L13.4 16l-4-4Z" />
                          </svg>
                        ) : (
                          <svg
                            className="dark:fill-gray-300 dark:hover:fill-white fill-gray-900"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                          >
                            <path d="M4 20V9h4v11Zm6 0V4h4v16Zm6 0v-7h4v7Z" />
                          </svg>
                        )}
                      </button>
                    </Tippy>
                  </li>
                </ul>
                <p className="flex items-center">
                  Active{" "}
                  {graphOption === "hourly"
                    ? "Hours"
                    : graphOption === "daily"
                    ? "Days"
                    : graphOption === "monthly"
                    ? "Months"
                    : "Years"}
                  <Tippy
                    zIndex={99999999999999}
                    content={
                      <>
                        <div className="text-white text-xl font-bold">
                          What are Active Hours?
                        </div>
                        <p className="text-white text-lg ">
                          Active Hours are the hours in which{" "}
                          {data?.dataFile ? "they " : "you "} are most active on
                          Discord sending messages.
                        </p>
                        <div className="flex items-center">
                          <svg
                            className="fill-red-400 mr-2 basis-[40%]"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                          >
                            <path d="M.275 21.425 12 1.15l11.725 20.275ZM12 17.925q.45 0 .788-.338.337-.337.337-.787t-.337-.775Q12.45 15.7 12 15.7t-.787.325q-.338.325-.338.775t.338.787q.337.338.787.338ZM11 15h2v-4.725h-2Z" />
                          </svg>
                          <b className="text-red-400 text-lg pt-1 ">
                            This is based on{" "}
                            {data?.dataFile ? "their " : "your "} device
                            timezone. If the graph is inacurrate, make sure{" "}
                            {data?.dataFile ? "their " : "your "} device
                            timezone is the same timezone as the usual timezone
                            you use when sending Discord messages.
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
                </p>
              </span>
              <div className="row-span-3 ">
                <div className="lg:mx-10 md:mx-8 mx-2">
                  <HighchartsReact
                    className="dark:fill-slate-900 fill-gray-300"
                    highcharts={Highcharts}
                    options={{
                      title: {
                        text: "",
                      },
                      xAxis: {
                        labels: {
                          formatter: function (a: any): any {
                            if (graphOption === "hours") return days_[a.value];
                            else if (graphOption === "daily")
                              return days_daily[a.value];
                            else if (graphOption === "monthly")
                              return days_monthly[a.value];
                            else if (graphOption === "yearly") {
                              const years =
                                data?.messages?.hoursValues?.yearly?.length;
                              if (years) {
                                const years_ =
                                  data?.messages?.hoursValues?.yearly
                                    ?.map(
                                      (year: any, index: number) =>
                                        new Date(Date.now()).getFullYear() -
                                        index
                                    )
                                    .reverse();
                                return years_[a.value];
                              }
                            }

                            return days_[a.value];
                          },
                          style: {
                            fontSize: "9px",
                            color: "#fff",
                            fontFamily: "Inter",
                          },
                        },
                      },
                      yAxis: {
                        gridLineColor: "#43464A",
                        gridLineWidth: 1,
                        title: {
                          text: "Messages",
                          style: {
                            fontSize: "20px",
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
                          data:
                            graphOption === "hourly"
                              ? data?.messages?.hoursValues?.hourly
                                ? makeData(data.messages.hoursValues.hourly, 24)
                                : new Array(24).fill(0)
                              : graphOption === "daily"
                              ? data?.messages?.hoursValues?.daily
                                ? makeData(data.messages.hoursValues.daily, 7)
                                : new Array(7).fill(0)
                              : graphOption === "monthly"
                              ? data?.messages?.hoursValues?.monthly
                                ? makeData(
                                    data.messages.hoursValues.monthly,
                                    12
                                  )
                                : new Array(12).fill(0)
                              : graphOption === "yearly"
                              ? data?.messages?.hoursValues?.yearly
                                ? makeData(
                                    data.messages.hoursValues.yearly,
                                    data.messages.hoursValues.yearly.length
                                  )
                                : new Array(3).fill(0)
                              : new Array(12).fill(0),
                          pointStart:
                            graphOption === "hourly"
                              ? data?.messages?.hoursValues?.hourly
                                ? makeData(
                                    data.messages.hoursValues.hourly,
                                    24
                                  )[0]
                                : 0
                              : graphOption === "daily"
                              ? data?.messages?.hoursValues?.daily
                                ? makeData(
                                    data.messages.hoursValues.daily,
                                    7
                                  )[0]
                                : 0
                              : graphOption === "monthly"
                              ? data?.messages?.hoursValues?.monthly
                                ? makeData(
                                    data.messages.hoursValues.monthly,
                                    12
                                  )[0]
                                : 0
                              : graphOption === "yearly"
                              ? data?.messages?.hoursValues?.yearly
                                ? makeData(
                                    data.messages.hoursValues.yearly,
                                    data.messages.hoursValues.yearly.length
                                  )[0]
                                : 0
                              : 0,
                          pointInterval: 86400000,
                        },
                      ],
                      plotOptions: {
                        series: {
                          fillColor: "rgba(124, 181, 236,0.1)",
                          marker: { enabled: false },
                          animation: {
                            duration: 10000,
                          },
                        },
                      },
                      tooltip: {
                        crosshairs: true,
                        backgroundColor: "#212529",
                        borderWith: 5,
                        className: "tooltip-hov",
                        // eslint-disable-next-line no-unused-vars
                        formatter: function (this: any): string {
                          if (graphOption === "hourly") {
                            return `<p style="font-weight: 200; font-family: Inter; color: white"></span><b style="font-weight: 600; font-family: Inter; color: white" ><span>${
                              this.y
                            }</b> messages ${
                              this.x && days_[this.x]
                                ? `at ${days_[this.x]}`
                                : `at ${days_[0]}`
                            }</p>`;
                          } else if (graphOption === "daily") {
                            return `<p style="font-weight: 200; font-family: Inter; color: white"></span><b style="font-weight: 600; font-family: Inter; color: white" ><span>${
                              this.y
                            }</b> messages ${
                              this.x && days_daily[this.x]
                                ? `at a ${days_daily[this.x]}`
                                : `at a ${days_daily[0]}`
                            }</p>`;
                          } else if (graphOption === "monthly") {
                            return `<p style="font-weight: 200; font-family: Inter; color: white"></span><b style="font-weight: 600; font-family: Inter; color: white" ><span>${
                              this.y
                            }</b> messages ${
                              this.x && days_monthly[this.x]
                                ? `in ${days_monthly[this.x]}`
                                : `in ${days_monthly[0]}`
                            }</p>`;
                          } else if (graphOption === "yearly") {
                            const years =
                              data?.messages?.hoursValues?.yearly?.length;
                            if (years) {
                              const years_ = data?.messages?.hoursValues?.yearly
                                ?.map(
                                  (year: any, index: number) =>
                                    new Date(Date.now()).getFullYear() - index
                                )
                                .reverse();

                              return `<p style="font-weight: 200; font-family: Inter; color: white"></span><b style="font-weight: 600; font-family: Inter; color: white" ><span>${
                                this.y
                              }</b> messages ${
                                this.x && years_[this.x]
                                  ? `in ${years_[this.x]} `
                                  : `in ${years_[0]} `
                              }</p>`;
                            } else return `<p>Unable to find option</p>`;
                          } else return `<p>Unable to find option</p>`;
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
                        type: graphType,
                        backgroundColor: "transparent",
                        zoomType: "x",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:grid grid-cols-2 grid-flow-col gap-4 lg:mx-10 md:mx-8 mx-2 lg:mt-4 md:mt-4 mt-2">
        <div className="lg:px-4 md:px-4 px-1 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg row-span-3 relative group">
          <div
            id="blur_6"
            className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-hover:block"
            onClick={() => {
              const div = document.getElementById("blur_6_div");
              if (div) {
                div.classList.toggle("blur-xl");
                div.classList.toggle("pointer-events-none");
                div.classList.toggle("select-none");

                const el: any = document.getElementById("blur_6_show");
                if (el) el.classList.toggle("hidden");

                const el2: any = document.getElementById("blur_6_hide");
                if (el) el2.classList.toggle("hidden");
              }
            }}
          >
            <svg
              id="blur_6_show"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto opacity-80 hover:opacity-100"
            >
              <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
            </svg>
            <svg
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto hidden opacity-80 hover:opacity-100"
              id="blur_6_hide"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
            >
              <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
            </svg>
          </div>
          <div id="blur_6_div">
            <span
              className="text-gray-900 dark:text-white text-2xl font-bold pt-4 lg:px-6 md:px-6 px-1 flex items-center uppercase"
              style={{
                fontFamily:
                  "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
              }}
            >
              Top Users
              {data?.messages?.topDMs && data?.messages?.topDMs?.length > 0 ? (
                <form className="ml-4">
                  <label
                    htmlFor="user-search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300 "
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
                      className="block p-2 pl-10 w-full text-sm bg-transparent rounded-lg border-gray-300 text-gray-900 dark:text-white border-none focus:border-current focus:ring-0 bg-gray-400 dark:bg-[#23272A] font-mono"
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
                            (p: any) =>
                              p.user_tag.toLowerCase().includes(search) ||
                              p.user_id.toLowerCase().includes(search)
                          );

                          if (filtered && filtered.length) {
                            setTopDMs(filtered);
                          } else setTopDMs(["noresults"]);
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
              <span className="text-black dark:text-gray-300 px-4">
                Showing{" "}
                {!topDMs.length && topDMs[0] !== "noresults"
                  ? data.messages.topDMs.length
                  : topDMs[0] !== "noresults"
                  ? topDMs.length
                  : "0"}
                /{data.messages.topDMs.length}
              </span>
            ) : (
              ""
            )}
            <div className="flex grow rounded-sm overflow-y-auto overflow-x-hidden h-[700px]">
              <div className="flex flex-col w-full px-1 pb-4 lg:px-3 md:px-3 lg:pt-0 md:pt-0 pt-2">
                {" "}
                {!data?.messages?.topDMs ? (
                  <div className="px-10 text-gray-900 dark:text-white text-3xl font-bold flex flex-col justify-center content-center align-center w-full h-full">
                    No Data was found or this option is disabled by{" "}
                    {data?.dataFile ? "them" : "you"}
                  </div>
                ) : (
                  ""
                )}
                {data?.messages?.topDMs && data?.messages?.topDMs?.length > 0
                  ? !(topDMs.length > 0) && topDMs[0] !== "noresults"
                    ? data?.messages?.topDMs.map((m: any, i: number) => {
                        return (
                          <div key={i}>
                            <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 hover:bg-gray-400 dark:hover:bg-[#23272A] px-2 rounded-lg">
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
                              <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1">
                                {m?.messageCount ? (
                                  <Tippy
                                    zIndex={99999999999999}
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
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2"
                                      width="24"
                                    >
                                      <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={
                                      (data?.dataFile ? "They " : "You ") +
                                      "have no messages"
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white cursor-not-allowed ml-2 opacity-60"
                                      width="24"
                                    >
                                      <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                    </svg>
                                  </Tippy>
                                )}
                                {m?.favoriteWords &&
                                m?.favoriteWords?.length > 0 ? (
                                  <Tippy
                                    zIndex={99999999999999}
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
                                                : "Your"}{" "}
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
                                              {m.favoriteWords.map(
                                                (f: any, i: number) => {
                                                  return (
                                                    <li key={i}>
                                                      {f.word}: {f.count} time
                                                      {f.count > 1 ? "s" : ""}
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
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
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={
                                      (data?.dataFile ? "They " : "You ") +
                                      "have no favorite words"
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                    >
                                      <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                                    </svg>
                                  </Tippy>
                                )}
                                {m?.topCursed && m?.topCursed?.length > 0 ? (
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={
                                      m.topCursed.length
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                      " Curse Words | Cursed " +
                                      Utils.getTopCount(m.topCursed) +
                                      " time" +
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
                                                : "Your"}{" "}
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
                                              {m.topCursed.map(
                                                (f: any, i: number) => {
                                                  return (
                                                    <li key={i}>
                                                      {f.word}: {f.count} time
                                                      {f.count > 1 ? "s" : ""}
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
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
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={
                                      (data?.dataFile ? "They " : "You ") +
                                      "have no curse words"
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                    >
                                      <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                    </svg>
                                  </Tippy>
                                )}
                                {m?.topLinks && m?.topLinks?.length > 0 ? (
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={
                                      m.topLinks.length +
                                      " Links | Sent " +
                                      Utils.getTopCount(m.topLinks) +
                                      " unique link" +
                                      (m.topLinks.length > 1 ? "s" : "")
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
                                                : "Your"}{" "}
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
                                              {m.topLinks.map(
                                                (f: any, i: number) => {
                                                  return (
                                                    <li key={i}>
                                                      <a
                                                        href={f.word}
                                                        className="opacity-80 hover:opacity-100"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                      >
                                                        {f.word}
                                                      </a>
                                                      : {f.count} time
                                                      {f.count > 1 ? "s" : ""}
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
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
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={
                                      (data?.dataFile ? "They " : "You ") +
                                      "have no links"
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                    >
                                      <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                                    </svg>
                                  </Tippy>
                                )}
                                {m?.topDiscordLinks &&
                                m?.topDiscordLinks?.length > 0 ? (
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={
                                      m.topDiscordLinks.length +
                                      " Discord Links | Sent " +
                                      Utils.getTopCount(m.topDiscordLinks) +
                                      " unique Discord link" +
                                      (m.topDiscordLinks.length > 1 ? "s" : "")
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
                                                : "Your"}{" "}
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
                                              {m.topDiscordLinks.map(
                                                (f: any, i: number) => {
                                                  return (
                                                    <li key={i}>
                                                      <a
                                                        href={f.word}
                                                        className="opacity-80 hover:opacity-100"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                      >
                                                        {f.word}
                                                      </a>
                                                      : {f.count} time
                                                      {f.count > 1 ? "s" : ""}
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
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
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={
                                      (data?.dataFile ? "They " : "You ") +
                                      "have no Discord links"
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                    >
                                      <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                                    </svg>
                                  </Tippy>
                                )}
                                {m?.oldestMessages &&
                                m?.oldestMessages?.length > 0 ? (
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={`${
                                      m.oldestMessages.length
                                    } Oldest Message${
                                      m.oldestMessages.length > 1 ? "s" : ""
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
                                                : "Your"}{" "}
                                              {m.oldestMessages.length < 10
                                                ? "Top 10"
                                                : `${m.oldestMessages.length}`}{" "}
                                              Oldest Message
                                              {m.favoriteWords.length === 1
                                                ? " is"
                                                : "s are"}
                                              :
                                            </span>
                                            <br />
                                            <ul className="list-disc ml-4">
                                              {m.oldestMessages.map(
                                                (f: any, i: number) => {
                                                  return (
                                                    <li key={i}>
                                                      <b>{f.sentence}</b>
                                                      <ul>
                                                        <li>
                                                          - sent at{" "}
                                                          {moment(
                                                            f.timestamp
                                                          ).format(
                                                            "MMMM Do YYYY, h:mm:ss a"
                                                          )}{" "}
                                                          <b>
                                                            (
                                                            {moment(
                                                              f.timestamp
                                                            ).fromNow()}
                                                            )
                                                          </b>
                                                        </li>
                                                        <li>
                                                          - sent to{" "}
                                                          <b>{f.author}</b>
                                                        </li>
                                                      </ul>
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
                                        );
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    >
                                      <path d="M4 14q0 2.2 1.075 4.012Q6.15 19.825 7.9 20.875q-.425-.6-.662-1.313Q7 18.85 7 18.05q0-1 .375-1.875t1.1-1.6L12 11.1l3.55 3.475q.7.7 1.075 1.588.375.887.375 1.887 0 .8-.237 1.512-.238.713-.663 1.313 1.75-1.05 2.825-2.863Q20 16.2 20 14q0-2.225-1.1-4.088Q17.8 8.05 16 7l-.45.55q-.325.4-.712.575-.388.175-.813.175-.775 0-1.4-.538Q12 7.225 12 6.3V3l-1.25.737Q9.5 4.475 8 5.875t-2.75 3.45Q4 11.375 4 14Zm8-.1-2.125 2.075q-.425.425-.65.963Q9 17.475 9 18.05q0 1.225.875 2.087Q10.75 21 12 21t2.125-.863Q15 19.275 15 18.05q0-.6-.225-1.125t-.65-.95Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={
                                      (data?.dataFile ? "They " : "You ") +
                                      "have no messages"
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                    >
                                      <path d="M7.9 20.875q-1.75-1.05-2.825-2.863Q4 16.2 4 14q0-2.625 1.25-4.675T8 5.875q1.5-1.4 2.75-2.138L12 3v3.3q0 .925.625 1.462.625.538 1.4.538.425 0 .813-.175.387-.175.712-.575L16 7q1.8 1.05 2.9 2.912Q20 11.775 20 14q0 2.2-1.075 4.012-1.075 1.813-2.825 2.863.425-.6.663-1.313Q17 18.85 17 18.05q0-1-.375-1.887-.375-.888-1.075-1.588L12 11.1l-3.525 3.475q-.725.725-1.1 1.6Q7 17.05 7 18.05q0 .8.238 1.512.237.713.662 1.313ZM12 21q-1.25 0-2.125-.863Q9 19.275 9 18.05q0-.575.225-1.112.225-.538.65-.963L12 13.9l2.125 2.075q.425.425.65.95.225.525.225 1.125 0 1.225-.875 2.087Q13.25 21 12 21Z" />
                                    </svg>
                                  </Tippy>
                                )}
                                {m?.topEmojis && m?.topEmojis?.length > 0 ? (
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={`${m.topEmojis.length} Top Emoji${
                                      m.topEmojis.length > 1 ? "s" : ""
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
                                                : "Your"}{" "}
                                              {m.topEmojis.length < 10
                                                ? "Top 10"
                                                : `${m.topEmojis.length}`}{" "}
                                              Top Emoji
                                              {m.topEmojis.length === 1
                                                ? " is"
                                                : "s are"}
                                              :
                                            </span>
                                            <br />
                                            <ul className="list-disc ml-4">
                                              {m.topEmojis.map(
                                                (f: any, i: number) => {
                                                  return (
                                                    <li key={i}>
                                                      <b>
                                                        {f.emoji}: {f.count}{" "}
                                                        time
                                                        {f.count > 1 ? "s" : ""}
                                                      </b>
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
                                        );
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    >
                                      <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={
                                      (data?.dataFile ? "They " : "You ") +
                                      "have no emojis"
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                    >
                                      <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                    </svg>
                                  </Tippy>
                                )}
                                {m?.topCustomEmojis &&
                                m?.topCustomEmojis?.length > 0 ? (
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={`${
                                      m.topCustomEmojis.length
                                    } Top Custom Emoji${
                                      m.topCustomEmojis.length > 1 ? "s" : ""
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
                                                : "Your"}{" "}
                                              {m.topCustomEmojis.length < 10
                                                ? "Top 10"
                                                : `${m.topCustomEmojis.length}`}{" "}
                                              Top Custom Emoji
                                              {m.topCustomEmojis.length === 1
                                                ? " is"
                                                : "s are"}
                                              :
                                            </span>
                                            <br />
                                            <ul className="list-disc ml-4">
                                              {m.topCustomEmojis.map(
                                                (f: any, i: number) => {
                                                  return (
                                                    <li key={i}>
                                                      {/<:.*?:(\d+)>/g.exec(
                                                        f.emoji
                                                      ) ? (
                                                        <Tippy
                                                          zIndex={
                                                            99999999999999
                                                          }
                                                          content={`${
                                                            f.emoji
                                                          } used ${
                                                            f.count
                                                          } time${
                                                            f.count === 1
                                                              ? ""
                                                              : "s"
                                                          }`}
                                                          animation="scale"
                                                          className="shadow-xl"
                                                        >
                                                          <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                            <Image
                                                              unoptimized={true}
                                                              src={Utils.createEmoji(
                                                                f.emoji
                                                              )}
                                                              alt="emoji"
                                                              height="50px"
                                                              width="50px"
                                                              draggable={false}
                                                            />
                                                          </div>
                                                        </Tippy>
                                                      ) : (
                                                        <>
                                                          {/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
                                                            f.emoji
                                                          ) ? (
                                                            <Tippy
                                                              zIndex={
                                                                99999999999999
                                                              }
                                                              content={`${
                                                                f.emoji
                                                              } used ${
                                                                f.count
                                                              } time${
                                                                f.count === 1
                                                                  ? ""
                                                                  : "s"
                                                              }`}
                                                              animation="scale"
                                                              className="shadow-xl"
                                                            >
                                                              <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                <Image
                                                                  unoptimized={
                                                                    true
                                                                  }
                                                                  src={Utils.createCustomEmoji(
                                                                    f.emoji
                                                                  )}
                                                                  alt="emoji"
                                                                  height="50px"
                                                                  width="50px"
                                                                  draggable={
                                                                    false
                                                                  }
                                                                />
                                                              </div>
                                                            </Tippy>
                                                          ) : (
                                                            ""
                                                          )}{" "}
                                                        </>
                                                      )}
                                                      : {f.count} time
                                                      {f.count > 1 ? "s" : ""}
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
                                        );
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                    >
                                      <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                    </svg>
                                  </Tippy>
                                ) : (
                                  <Tippy
                                    zIndex={99999999999999}
                                    content={
                                      (data?.dataFile ? "They " : "You ") +
                                      "have no custom emojis"
                                    }
                                    animation="scale"
                                    className="shadow-xl"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24"
                                      width="24"
                                      className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                    >
                                      <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                    </svg>
                                  </Tippy>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : topDMs?.map((m: any, i: number) => {
                        return (
                          <>
                            {m !== "noresults" ? (
                              <div key={i}>
                                <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 hover:bg-gray-400 dark:hover:bg-[#23272A] px-2 rounded-lg ">
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
                                  <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1">
                                    {m?.messageCount ? (
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={
                                          m.messageCount
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ","
                                            ) + " Messages"
                                        }
                                        animation="scale"
                                        className="shadow-xl"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          className="dark:fill-gray-300 dark:hover:fill-white ml-2"
                                          width="24"
                                        >
                                          <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                        </svg>
                                      </Tippy>
                                    ) : (
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={
                                          (data?.dataFile ? "They " : "You ") +
                                          "have no messages"
                                        }
                                        animation="scale"
                                        className="shadow-xl"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          className="dark:fill-gray-300 dark:hover:fill-white cursor-not-allowed ml-2 opacity-60"
                                          width="24"
                                        >
                                          <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                        </svg>
                                      </Tippy>
                                    )}
                                    {m?.favoriteWords &&
                                    m?.favoriteWords.length > 0 ? (
                                      <Tippy
                                        zIndex={99999999999999}
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
                                                    : "Your"}{" "}
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
                                                  {m.favoriteWords.map(
                                                    (f: any, i: number) => {
                                                      return (
                                                        <li key={i}>
                                                          {f.word}: {f.count}{" "}
                                                          time
                                                          {f.count > 1
                                                            ? "s"
                                                            : ""}
                                                        </li>
                                                      );
                                                    }
                                                  )}
                                                </ul>
                                              </div>
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
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={
                                          (data?.dataFile ? "They " : "You ") +
                                          "have no favorite words"
                                        }
                                        animation="scale"
                                        className="shadow-xl"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          width="24"
                                          className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                        >
                                          <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                                        </svg>
                                      </Tippy>
                                    )}
                                    {m?.topCursed && m?.topCursed.length > 0 ? (
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={
                                          m.topCursed.length
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ","
                                            ) +
                                          " Curse Words | Cursed " +
                                          Utils.getTopCount(m.topCursed) +
                                          " time" +
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
                                                    : "Your"}{" "}
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
                                                  {m.topCursed.map(
                                                    (f: any, i: number) => {
                                                      return (
                                                        <li key={i}>
                                                          {f.word}: {f.count}{" "}
                                                          time
                                                          {f.count > 1
                                                            ? "s"
                                                            : ""}
                                                        </li>
                                                      );
                                                    }
                                                  )}
                                                </ul>
                                              </div>
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
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={
                                          (data?.dataFile ? "They " : "You ") +
                                          "have no curse words"
                                        }
                                        animation="scale"
                                        className="shadow-xl"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          width="24"
                                          className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                        >
                                          <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                        </svg>
                                      </Tippy>
                                    )}
                                    {m?.topLinks && m?.topLinks?.length > 0 ? (
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={
                                          m.topLinks.length +
                                          " Links | Sent " +
                                          Utils.getTopCount(m.topLinks) +
                                          " unique link" +
                                          (m.topLinks.length > 1 ? "s" : "")
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
                                                    : "Your"}{" "}
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
                                                  {m.topLinks.map(
                                                    (f: any, i: number) => {
                                                      return (
                                                        <li key={i}>
                                                          <a
                                                            href={f.word}
                                                            className="opacity-80 hover:opacity-100"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                          >
                                                            {f.word}
                                                          </a>
                                                          : {f.count} time
                                                          {f.count > 1
                                                            ? "s"
                                                            : ""}
                                                        </li>
                                                      );
                                                    }
                                                  )}
                                                </ul>
                                              </div>
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
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={
                                          (data?.dataFile ? "They " : "You ") +
                                          "have no links"
                                        }
                                        animation="scale"
                                        className="shadow-xl"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          width="24"
                                          className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                        >
                                          <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                                        </svg>
                                      </Tippy>
                                    )}
                                    {m?.topDiscordLinks &&
                                    m?.topDiscordLinks.length > 0 ? (
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={
                                          m.topDiscordLinks.length +
                                          " Discord Links | Sent " +
                                          Utils.getTopCount(m.topDiscordLinks) +
                                          " unique Discord link" +
                                          (m.topDiscordLinks.length > 1
                                            ? "s"
                                            : "")
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
                                                    : "Your"}{" "}
                                                  {m.topDiscordLinks.length < 10
                                                    ? "Top 10"
                                                    : `${m.topDiscordLinks.length}`}{" "}
                                                  Discord Link
                                                  {m.topDiscordLinks.length ===
                                                  1
                                                    ? " is"
                                                    : "s are"}
                                                  :
                                                </span>
                                                <br />
                                                <ul className="list-disc ml-4">
                                                  {m.topDiscordLinks.map(
                                                    (f: any, i: number) => {
                                                      return (
                                                        <li key={i}>
                                                          <a
                                                            href={f.word}
                                                            className="opacity-80 hover:opacity-100"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                          >
                                                            {f.word}
                                                          </a>
                                                          : {f.count} time
                                                          {f.count > 1
                                                            ? "s"
                                                            : ""}
                                                        </li>
                                                      );
                                                    }
                                                  )}
                                                </ul>
                                              </div>
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
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={
                                          (data?.dataFile ? "They " : "You ") +
                                          "have no Discord links"
                                        }
                                        animation="scale"
                                        className="shadow-xl"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          width="24"
                                          className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                        >
                                          <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                                        </svg>
                                      </Tippy>
                                    )}
                                    {m?.oldestMessages &&
                                    m?.oldestMessages?.length > 0 ? (
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={`${
                                          m.oldestMessages.length
                                        } Oldest Message${
                                          m.oldestMessages.length > 1 ? "s" : ""
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
                                                    : "Your"}{" "}
                                                  {m.oldestMessages.length < 10
                                                    ? "Top 10"
                                                    : `${m.oldestMessages.length}`}{" "}
                                                  Oldest Message
                                                  {m.favoriteWords.length === 1
                                                    ? " is"
                                                    : "s are"}
                                                  :
                                                </span>
                                                <br />
                                                <ul className="list-disc ml-4">
                                                  {m.oldestMessages.map(
                                                    (f: any, i: number) => {
                                                      return (
                                                        <li key={i}>
                                                          <b>{f.sentence}</b>
                                                          <ul>
                                                            <li>
                                                              - sent at{" "}
                                                              {moment(
                                                                f.timestamp
                                                              ).format(
                                                                "MMMM Do YYYY, h:mm:ss a"
                                                              )}{" "}
                                                              <b>
                                                                (
                                                                {moment(
                                                                  f.timestamp
                                                                ).fromNow()}
                                                                )
                                                              </b>
                                                            </li>
                                                            <li>
                                                              - sent to{" "}
                                                              <b>{f.author}</b>
                                                            </li>
                                                          </ul>
                                                        </li>
                                                      );
                                                    }
                                                  )}
                                                </ul>
                                              </div>
                                            );
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          width="24"
                                          className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                        >
                                          <path d="M4 14q0 2.2 1.075 4.012Q6.15 19.825 7.9 20.875q-.425-.6-.662-1.313Q7 18.85 7 18.05q0-1 .375-1.875t1.1-1.6L12 11.1l3.55 3.475q.7.7 1.075 1.588.375.887.375 1.887 0 .8-.237 1.512-.238.713-.663 1.313 1.75-1.05 2.825-2.863Q20 16.2 20 14q0-2.225-1.1-4.088Q17.8 8.05 16 7l-.45.55q-.325.4-.712.575-.388.175-.813.175-.775 0-1.4-.538Q12 7.225 12 6.3V3l-1.25.737Q9.5 4.475 8 5.875t-2.75 3.45Q4 11.375 4 14Zm8-.1-2.125 2.075q-.425.425-.65.963Q9 17.475 9 18.05q0 1.225.875 2.087Q10.75 21 12 21t2.125-.863Q15 19.275 15 18.05q0-.6-.225-1.125t-.65-.95Z" />
                                        </svg>
                                      </Tippy>
                                    ) : (
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={
                                          (data?.dataFile ? "They " : "You ") +
                                          "have no messages"
                                        }
                                        animation="scale"
                                        className="shadow-xl"
                                      >
                                        <svg
                                          className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          width="24"
                                        >
                                          <path d="M7.9 20.875q-1.75-1.05-2.825-2.863Q4 16.2 4 14q0-2.625 1.25-4.675T8 5.875q1.5-1.4 2.75-2.138L12 3v3.3q0 .925.625 1.462.625.538 1.4.538.425 0 .813-.175.387-.175.712-.575L16 7q1.8 1.05 2.9 2.912Q20 11.775 20 14q0 2.2-1.075 4.012-1.075 1.813-2.825 2.863.425-.6.663-1.313Q17 18.85 17 18.05q0-1-.375-1.887-.375-.888-1.075-1.588L12 11.1l-3.525 3.475q-.725.725-1.1 1.6Q7 17.05 7 18.05q0 .8.238 1.512.237.713.662 1.313ZM12 21q-1.25 0-2.125-.863Q9 19.275 9 18.05q0-.575.225-1.112.225-.538.65-.963L12 13.9l2.125 2.075q.425.425.65.95.225.525.225 1.125 0 1.225-.875 2.087Q13.25 21 12 21Z" />
                                        </svg>
                                      </Tippy>
                                    )}
                                    {m?.topEmojis &&
                                    m?.topEmojis?.length > 0 ? (
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={`${
                                          m.topEmojis.length
                                        } Top Emoji${
                                          m.topEmojis.length > 1 ? "s" : ""
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
                                                    : "Your"}{" "}
                                                  {m.topEmojis.length < 10
                                                    ? "Top 10"
                                                    : `${m.topEmojis.length}`}{" "}
                                                  Top Emoji
                                                  {m.topEmojis.length === 1
                                                    ? " is"
                                                    : "s are"}
                                                  :
                                                </span>
                                                <br />
                                                <ul className="list-disc ml-4">
                                                  {m.topEmojis.map(
                                                    (f: any, i: number) => {
                                                      return (
                                                        <li key={i}>
                                                          <b>
                                                            {f.emoji}: {f.count}{" "}
                                                            time
                                                            {f.count > 1
                                                              ? "s"
                                                              : ""}
                                                          </b>
                                                        </li>
                                                      );
                                                    }
                                                  )}
                                                </ul>
                                              </div>
                                            );
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          width="24"
                                          className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                        >
                                          <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                        </svg>
                                      </Tippy>
                                    ) : (
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={
                                          (data?.dataFile ? "They " : "You ") +
                                          "have no emojis"
                                        }
                                        animation="scale"
                                        className="shadow-xl"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          width="24"
                                          className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                        >
                                          <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                        </svg>
                                      </Tippy>
                                    )}
                                    {m?.topCustomEmojis &&
                                    m?.topCustomEmojis?.length > 0 ? (
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={`${
                                          m.topCustomEmojis.length
                                        } Top Custom Emoji${
                                          m.topCustomEmojis.length > 1
                                            ? "s"
                                            : ""
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
                                                    : "Your"}{" "}
                                                  {m.topCustomEmojis.length < 10
                                                    ? "Top 10"
                                                    : `${m.topCustomEmojis.length}`}{" "}
                                                  Top Custom Emoji
                                                  {m.topCustomEmojis.length ===
                                                  1
                                                    ? " is"
                                                    : "s are"}
                                                  :
                                                </span>
                                                <br />
                                                <ul className="list-disc ml-4">
                                                  {m.topCustomEmojis.map(
                                                    (f: any, i: number) => {
                                                      return (
                                                        <li key={i}>
                                                          {/<:.*?:(\d+)>/g.exec(
                                                            f.emoji
                                                          ) ? (
                                                            <Tippy
                                                              zIndex={
                                                                99999999999999
                                                              }
                                                              content={`${
                                                                f.emoji
                                                              } used ${
                                                                f.count
                                                              } time${
                                                                f.count === 1
                                                                  ? ""
                                                                  : "s"
                                                              }`}
                                                              animation="scale"
                                                              className="shadow-xl"
                                                            >
                                                              <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                <Image
                                                                  unoptimized={
                                                                    true
                                                                  }
                                                                  src={Utils.createEmoji(
                                                                    f.emoji
                                                                  )}
                                                                  alt="emoji"
                                                                  height="50px"
                                                                  width="50px"
                                                                  draggable={
                                                                    false
                                                                  }
                                                                />
                                                              </div>
                                                            </Tippy>
                                                          ) : (
                                                            <>
                                                              {/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
                                                                f.emoji
                                                              ) ? (
                                                                <Tippy
                                                                  zIndex={
                                                                    99999999999999
                                                                  }
                                                                  content={`${
                                                                    f.emoji
                                                                  } used ${
                                                                    f.count
                                                                  } time${
                                                                    f.count ===
                                                                    1
                                                                      ? ""
                                                                      : "s"
                                                                  }`}
                                                                  animation="scale"
                                                                  className="shadow-xl"
                                                                >
                                                                  <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                    <Image
                                                                      unoptimized={
                                                                        true
                                                                      }
                                                                      src={Utils.createCustomEmoji(
                                                                        f.emoji
                                                                      )}
                                                                      alt="emoji"
                                                                      height="50px"
                                                                      width="50px"
                                                                      draggable={
                                                                        false
                                                                      }
                                                                    />
                                                                  </div>
                                                                </Tippy>
                                                              ) : (
                                                                ""
                                                              )}{" "}
                                                            </>
                                                          )}
                                                          : {f.count} time
                                                          {f.count > 1
                                                            ? "s"
                                                            : ""}
                                                        </li>
                                                      );
                                                    }
                                                  )}
                                                </ul>
                                              </div>
                                            );
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          width="24"
                                          className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                        >
                                          <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                        </svg>
                                      </Tippy>
                                    ) : (
                                      <Tippy
                                        zIndex={99999999999999}
                                        content={
                                          (data?.dataFile ? "They " : "You ") +
                                          "have no custom emojis"
                                        }
                                        animation="scale"
                                        className="shadow-xl"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="24"
                                          width="24"
                                          className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                        >
                                          <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                        </svg>
                                      </Tippy>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col justify-center items-center">
                                <span className="text-gray-900 dark:text-gray-200 text-2xl font-bold">
                                  NO RESULTS FOUND
                                </span>
                                <span className="text-gray-700 dark:text-gray-400 text-lg max-w-sm">
                                  We could not find what you are looking for.
                                  Try again with a different search term.
                                </span>
                              </div>
                            )}
                          </>
                        );
                      })
                  : ""}
              </div>
            </div>{" "}
          </div>
        </div>
        <div className="lg:px-4 md:px-4 px-1 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg row-span-3 lg:mt-0 mt-4 relative group">
          <div
            id="blur_7"
            className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-hover:block"
            onClick={() => {
              const div = document.getElementById("blur_7_div");
              if (div) {
                div.classList.toggle("blur-xl");
                div.classList.toggle("pointer-events-none");
                div.classList.toggle("select-none");

                const el: any = document.getElementById("blur_7_show");
                if (el) el.classList.toggle("hidden");

                const el2: any = document.getElementById("blur_7_hide");
                if (el) el2.classList.toggle("hidden");
              }
            }}
          >
            <svg
              id="blur_7_show"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto opacity-80 hover:opacity-100"
            >
              <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
            </svg>
            <svg
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto hidden opacity-80 hover:opacity-100"
              id="blur_7_hide"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
            >
              <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
            </svg>
          </div>
          <div id="blur_7_div_1">
            <div id="blur_7_div">
              <div className="lg:flex justify-between md:flex sm:flex items-center">
                <span
                  className="text-gray-900 dark:text-white text-2xl font-bold pt-4 lg:px-6 md:px-6 px-1 flex items-center mb-2 uppercase"
                  style={{
                    fontFamily:
                      "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
                  }}
                >
                  {messageType === "channelMode"
                    ? "Top Channels"
                    : messageType === "guildMode"
                    ? "Top Guilds"
                    : "Top Group DMs"}
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
                          id="search"
                          className="font-mono block p-2 pl-10 w-full text-sm bg-transparent rounded-lg border-gray-300  text-gray-900 dark:text-white border-none focus:border-current focus:ring-0 bg-gray-400 dark:bg-[#23272A]"
                          placeholder={
                            "Filter " +
                            (messageType === "channelMode"
                              ? "channels"
                              : messageType === "guildMode"
                              ? "guilds"
                              : "group DMs")
                          }
                          onChange={(e) => {
                            if (messageType === "channelMode") {
                              setTimeout(() => {
                                const possibilities =
                                  data?.messages?.topChannels;
                                if (!possibilities) return;
                                const search = e.target.value
                                  .toLowerCase()
                                  .trim();

                                if (search === "") {
                                  setTopChannels([]);
                                  return;
                                }
                                const filtered = possibilities.filter(
                                  (p: any) =>
                                    typeof p.name === "object"
                                      ? p.name[0]
                                          .toLowerCase()
                                          .includes(search) ||
                                        p.guildName
                                          .toLowerCase()
                                          .includes(search)
                                      : p.name.toLowerCase().includes(search) ||
                                        p.guildName
                                          .toLowerCase()
                                          .includes(search)
                                );

                                if (filtered && filtered.length) {
                                  setTopChannels(filtered);
                                } else setTopChannels(["noresults"]);
                              }, 100);
                            } else if (messageType === "guildMode") {
                              setTimeout(() => {
                                const possibilities = data?.messages?.topGuilds;
                                if (!possibilities) return;
                                const search = e.target.value
                                  .toLowerCase()
                                  .trim();

                                if (search === "") {
                                  setTopGuilds([]);
                                  return;
                                }
                                const filtered = possibilities.filter(
                                  (p: any) =>
                                    p.guildName.toLowerCase().includes(search)
                                );

                                if (filtered && filtered.length) {
                                  setTopGuilds(filtered);
                                } else setTopGuilds(["noresults"]);
                              }, 100);
                            } else if (messageType === "dmMode") {
                              setTimeout(() => {
                                const possibilities =
                                  data?.messages?.topGroupDMs;
                                if (!possibilities) return;
                                const search = e.target.value
                                  .toLowerCase()
                                  .trim();

                                if (search === "") {
                                  setTopGroupDMs([]);
                                  return;
                                }
                                const filtered = possibilities.filter(
                                  (p: any) =>
                                    p?.name?.toLowerCase()?.includes(search) ||
                                    p?.recipients?.toString()?.includes(search)
                                );

                                if (filtered && filtered.length) {
                                  setTopGroupDMs(filtered);
                                } else setTopGroupDMs(["noresults"]);
                              }, 100);
                            }
                          }}
                        />
                      </div>
                    </form>
                  ) : (
                    ""
                  )}
                </span>
                <ul className="flex items-center rounded-lg ml-2">
                  <li className="flex gap-1">
                    {data?.messages?.topChannels &&
                    data?.messages?.topChannels?.length > 0 ? (
                      <div
                        className={
                          "p-2 rounded-lg" +
                          (messageType === "channelMode"
                            ? " bg-gray-400 dark:bg-[#232323]"
                            : "")
                        }
                        onClick={() => {
                          const el: any = document.getElementById("search");
                          if (el) el.value = "";
                          setTopChannels([]);
                          setMessageType("channelMode");
                        }}
                      >
                        <Tippy
                          zIndex={99999999999999}
                          content="Channel Mode"
                          animation="scale"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                            className="cursor-pointer fill-black dark:fill-white opacity-90 hover:opacity-100"
                          >
                            <path d="m6 20 1-4H3.5l.5-2h3.5l1-4h-4L5 8h4l1-4h2l-1 4h4l1-4h2l-1 4h3.5l-.5 2h-3.5l-1 4h4l-.5 2h-4l-1 4h-2l1-4H9l-1 4Zm3.5-6h4l1-4h-4Z" />
                          </svg>
                        </Tippy>
                      </div>
                    ) : (
                      ""
                    )}
                    {data?.messages?.topGuilds &&
                    data?.messages?.topGuilds?.length > 0 ? (
                      <div
                        className={
                          "p-2 rounded-lg" +
                          (messageType === "guildMode"
                            ? " bg-gray-400 dark:bg-[#232323]"
                            : "")
                        }
                        onClick={() => {
                          const el: any = document.getElementById("search");
                          if (el) el.value = "";
                          setTopGuilds([]);
                          setMessageType("guildMode");
                        }}
                      >
                        <Tippy
                          zIndex={99999999999999}
                          content="Guild Mode"
                          animation="scale"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                            className="cursor-pointer fill-black dark:fill-white opacity-90 hover:opacity-100"
                          >
                            <path d="M4 13.525 6.525 11 4 8.475 1.475 11ZM17.5 13 20 9l2.5 4ZM0 18v-1.575q0-1.1 1.113-1.763Q2.225 14 4 14q.325 0 .625.012.3.013.575.063-.35.5-.525 1.075-.175.575-.175 1.225V18Zm6 0v-1.625q0-1.625 1.663-2.625 1.662-1 4.337-1 2.7 0 4.35 1 1.65 1 1.65 2.625V18Zm13.5 0v-1.625q0-.65-.163-1.225-.162-.575-.487-1.075.275-.05.563-.063Q19.7 14 20 14q1.8 0 2.9.662 1.1.663 1.1 1.763V18ZM12 12q-1.25 0-2.125-.875T9 9q0-1.275.875-2.138Q10.75 6 12 6q1.275 0 2.137.862Q15 7.725 15 9q0 1.25-.863 2.125Q13.275 12 12 12Z" />
                          </svg>
                        </Tippy>
                      </div>
                    ) : (
                      ""
                    )}
                    {data?.messages?.topGroupDMs &&
                    data?.messages?.topGroupDMs?.length > 0 ? (
                      <div
                        className={
                          "p-2 rounded-lg" +
                          (messageType === "dmMode"
                            ? " bg-gray-400 dark:bg-[#232323]"
                            : "")
                        }
                        onClick={() => {
                          const el: any = document.getElementById("search");
                          if (el) el.value = "";
                          setTopGroupDMs([]);
                          setMessageType("dmMode");
                        }}
                      >
                        <Tippy
                          zIndex={99999999999999}
                          content="Group DM Mode"
                          animation="scale"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                            className="cursor-pointer fill-black dark:fill-white opacity-90 hover:opacity-100"
                          >
                            <path d="M1 20v-2.8q0-.85.438-1.563.437-.712 1.162-1.087 1.55-.775 3.15-1.163Q7.35 13 9 13t3.25.387q1.6.388 3.15 1.163.725.375 1.162 1.087Q17 16.35 17 17.2V20Zm18 0v-3q0-1.1-.612-2.113-.613-1.012-1.738-1.737 1.275.15 2.4.512 1.125.363 2.1.888.9.5 1.375 1.112Q23 16.275 23 17v3ZM9 12q-1.65 0-2.825-1.175Q5 9.65 5 8q0-1.65 1.175-2.825Q7.35 4 9 4q1.65 0 2.825 1.175Q13 6.35 13 8q0 1.65-1.175 2.825Q10.65 12 9 12Zm10-4q0 1.65-1.175 2.825Q16.65 12 15 12q-.275 0-.7-.062-.425-.063-.7-.138.675-.8 1.037-1.775Q15 9.05 15 8q0-1.05-.363-2.025Q14.275 5 13.6 4.2q.35-.125.7-.163Q14.65 4 15 4q1.65 0 2.825 1.175Q19 6.35 19 8Z" />
                          </svg>
                        </Tippy>
                      </div>
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              </div>
              {messageType === "channelMode" ? (
                <>
                  {data?.messages?.topChannels &&
                  data?.messages?.topChannels?.length > 0 ? (
                    <span className="text-black dark:text-gray-300 px-4">
                      Showing{" "}
                      {!topChannels.length && topChannels[0] !== "noresults"
                        ? data.messages.topChannels.length
                        : topChannels[0] !== "noresults"
                        ? topChannels.length
                        : "0"}
                      /{data.messages.topChannels.length}
                    </span>
                  ) : (
                    ""
                  )}
                  <div className="flex grow rounded-sm overflow-y-auto overflow-x-hidden h-[700px]">
                    <div className="flex flex-col w-full px-3 pb-4 lg:px-3 md:px-3 lg:pt-0 md:pt-0 pt-2">
                      {" "}
                      {!data?.messages?.topChannels ? (
                        <div className="px-10 text-gray-900 dark:text-white text-3xl font-bold flex flex-col justify-center content-center align-center w-full h-full">
                          No Data was found or this option is disabled
                        </div>
                      ) : (
                        ""
                      )}
                      {data?.messages?.topChannels &&
                      data?.messages?.topChannels?.length > 0
                        ? !(topChannels.length > 0) &&
                          topChannels[0] !== "noresults"
                          ? data?.messages?.topChannels.map(
                              (m: any, i: number) => {
                                return (
                                  <>
                                    <div key={i}>
                                      <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 hover:bg-gray-400 dark:hover:bg-[#23272A] px-2 rounded-lg ">
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
                                              {m?.name ? (
                                                typeof m.name === "object" ? (
                                                  m?.name[0]?.length > 28 ? (
                                                    <Tippy
                                                      zIndex={99999999999999}
                                                      content={m.name[0]}
                                                      animation="scale"
                                                      className="shadow-xl"
                                                    >
                                                      <span>
                                                        {m.name[0].substring(
                                                          0,
                                                          28
                                                        ) + "..."}
                                                      </span>
                                                    </Tippy>
                                                  ) : (
                                                    m.name[0]
                                                  )
                                                ) : m?.name?.length > 28 ? (
                                                  <Tippy
                                                    zIndex={99999999999999}
                                                    content={m.name}
                                                    animation="scale"
                                                    className="shadow-xl"
                                                  >
                                                    <span>
                                                      {m.name.substring(0, 28) +
                                                        "..."}
                                                    </span>
                                                  </Tippy>
                                                ) : (
                                                  m.name
                                                )
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                            <span className="text-gray-400 text-sm -mt-2">
                                              {m?.guildName?.length > 28 ? (
                                                <Tippy
                                                  zIndex={99999999999999}
                                                  content={m.guildName}
                                                  animation="scale"
                                                  className="shadow-xl"
                                                >
                                                  <span>
                                                    {m.guildName.substring(
                                                      0,
                                                      28
                                                    ) + "..."}
                                                  </span>
                                                </Tippy>
                                              ) : (
                                                m.guildName
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1">
                                          {m?.messageCount ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.messageCount
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                  ) + " Messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2"
                                                width="24"
                                              >
                                                <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white cursor-not-allowed ml-2 opacity-60"
                                                width="24"
                                              >
                                                <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.favoriteWords &&
                                          m?.favoriteWords?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.favoriteWords.length
                                              } Favorite Word${
                                                m.favoriteWords.length > 1
                                                  ? "s"
                                                  : ""
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
                                                        {m.favoriteWords
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.favoriteWords.length}`}{" "}
                                                        Favorite Word
                                                        {m.favoriteWords
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.favoriteWords.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {f.word}:{" "}
                                                                {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no favorite words"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topCursed &&
                                          m?.topCursed?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topCursed.length
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                  ) +
                                                " Curse Words | Cursed " +
                                                Utils.getTopCount(m.topCursed) +
                                                " time" +
                                                (m.topCursed.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topCursed.length ===
                                                        1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topCursed.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {f.word}:{" "}
                                                                {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no curse words"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topLinks &&
                                          m?.topLinks?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topLinks.length +
                                                " Links | Sent " +
                                                Utils.getTopCount(m.topLinks) +
                                                " unique link" +
                                                (m.topLinks.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topLinks.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <a
                                                                  href={f.word}
                                                                  className="opacity-80 hover:opacity-100"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                >
                                                                  {f.word}
                                                                </a>
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no links"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topDiscordLinks &&
                                          m?.topDiscordLinks?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topDiscordLinks.length +
                                                " Discord Links | Sent " +
                                                Utils.getTopCount(
                                                  m.topDiscordLinks
                                                ) +
                                                " unique Discord link" +
                                                (m.topDiscordLinks.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topDiscordLinks
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.topDiscordLinks.length}`}{" "}
                                                        Discord Link
                                                        {m.topDiscordLinks
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topDiscordLinks.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <a
                                                                  href={f.word}
                                                                  className="opacity-80 hover:opacity-100"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                >
                                                                  {f.word}
                                                                </a>
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no Discord links"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.oldestMessages &&
                                          m?.oldestMessages?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.oldestMessages.length
                                              } Oldest Message${
                                                m.oldestMessages.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.oldestMessages
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.oldestMessages.length}`}{" "}
                                                        Oldest Message
                                                        {m.favoriteWords
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.oldestMessages.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <b>
                                                                  {f.sentence}
                                                                </b>
                                                                <ul>
                                                                  <li>
                                                                    - sent at{" "}
                                                                    {moment(
                                                                      f.timestamp
                                                                    ).format(
                                                                      "MMMM Do YYYY, h:mm:ss a"
                                                                    )}{" "}
                                                                    <b>
                                                                      (
                                                                      {moment(
                                                                        f.timestamp
                                                                      ).fromNow()}
                                                                      )
                                                                    </b>
                                                                  </li>
                                                                  <li>
                                                                    - sent to{" "}
                                                                    <b>
                                                                      {f.author}
                                                                    </b>
                                                                  </li>
                                                                </ul>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M4 14q0 2.2 1.075 4.012Q6.15 19.825 7.9 20.875q-.425-.6-.662-1.313Q7 18.85 7 18.05q0-1 .375-1.875t1.1-1.6L12 11.1l3.55 3.475q.7.7 1.075 1.588.375.887.375 1.887 0 .8-.237 1.512-.238.713-.663 1.313 1.75-1.05 2.825-2.863Q20 16.2 20 14q0-2.225-1.1-4.088Q17.8 8.05 16 7l-.45.55q-.325.4-.712.575-.388.175-.813.175-.775 0-1.4-.538Q12 7.225 12 6.3V3l-1.25.737Q9.5 4.475 8 5.875t-2.75 3.45Q4 11.375 4 14Zm8-.1-2.125 2.075q-.425.425-.65.963Q9 17.475 9 18.05q0 1.225.875 2.087Q10.75 21 12 21t2.125-.863Q15 19.275 15 18.05q0-.6-.225-1.125t-.65-.95Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                              >
                                                <path d="M7.9 20.875q-1.75-1.05-2.825-2.863Q4 16.2 4 14q0-2.625 1.25-4.675T8 5.875q1.5-1.4 2.75-2.138L12 3v3.3q0 .925.625 1.462.625.538 1.4.538.425 0 .813-.175.387-.175.712-.575L16 7q1.8 1.05 2.9 2.912Q20 11.775 20 14q0 2.2-1.075 4.012-1.075 1.813-2.825 2.863.425-.6.663-1.313Q17 18.85 17 18.05q0-1-.375-1.887-.375-.888-1.075-1.588L12 11.1l-3.525 3.475q-.725.725-1.1 1.6Q7 17.05 7 18.05q0 .8.238 1.512.237.713.662 1.313ZM12 21q-1.25 0-2.125-.863Q9 19.275 9 18.05q0-.575.225-1.112.225-.538.65-.963L12 13.9l2.125 2.075q.425.425.65.95.225.525.225 1.125 0 1.225-.875 2.087Q13.25 21 12 21Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topEmojis &&
                                          m?.topEmojis?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.topEmojis.length
                                              } Top Emoji${
                                                m.topEmojis.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.topEmojis.length < 10
                                                          ? "Top 10"
                                                          : `${m.topEmojis.length}`}{" "}
                                                        Top Emoji
                                                        {m.topEmojis.length ===
                                                        1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topEmojis.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <b>
                                                                  {f.emoji}:{" "}
                                                                  {f.count} time
                                                                  {f.count > 1
                                                                    ? "s"
                                                                    : ""}
                                                                </b>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no emojis"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topCustomEmojis &&
                                          m?.topCustomEmojis?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.topCustomEmojis.length
                                              } Top Custom Emoji${
                                                m.topCustomEmojis.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.topCustomEmojis
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.topCustomEmojis.length}`}{" "}
                                                        Top Custom Emoji
                                                        {m.topCustomEmojis
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topCustomEmojis.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {/<:.*?:(\d+)>/g.exec(
                                                                  f.emoji
                                                                ) ? (
                                                                  <Tippy
                                                                    zIndex={
                                                                      99999999999999
                                                                    }
                                                                    content={`${
                                                                      f.emoji
                                                                    } used ${
                                                                      f.count
                                                                    } time${
                                                                      f.count ===
                                                                      1
                                                                        ? ""
                                                                        : "s"
                                                                    }`}
                                                                    animation="scale"
                                                                    className="shadow-xl"
                                                                  >
                                                                    <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                      <Image
                                                                        unoptimized={
                                                                          true
                                                                        }
                                                                        src={Utils.createEmoji(
                                                                          f.emoji
                                                                        )}
                                                                        alt="emoji"
                                                                        height="50px"
                                                                        width="50px"
                                                                        draggable={
                                                                          false
                                                                        }
                                                                      />
                                                                    </div>
                                                                  </Tippy>
                                                                ) : (
                                                                  <>
                                                                    {/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
                                                                      f.emoji
                                                                    ) ? (
                                                                      <Tippy
                                                                        zIndex={
                                                                          99999999999999
                                                                        }
                                                                        content={`${
                                                                          f.emoji
                                                                        } used ${
                                                                          f.count
                                                                        } time${
                                                                          f.count ===
                                                                          1
                                                                            ? ""
                                                                            : "s"
                                                                        }`}
                                                                        animation="scale"
                                                                        className="shadow-xl"
                                                                      >
                                                                        <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                          <Image
                                                                            unoptimized={
                                                                              true
                                                                            }
                                                                            src={Utils.createCustomEmoji(
                                                                              f.emoji
                                                                            )}
                                                                            alt="emoji"
                                                                            height="50px"
                                                                            width="50px"
                                                                            draggable={
                                                                              false
                                                                            }
                                                                          />
                                                                        </div>
                                                                      </Tippy>
                                                                    ) : (
                                                                      ""
                                                                    )}{" "}
                                                                  </>
                                                                )}
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no custom emojis"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              }
                            )
                          : topChannels?.map((m: any, i: number) => {
                              return (
                                <>
                                  {m !== "noresults" ? (
                                    <div key={i}>
                                      <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 hover:bg-gray-400 dark:hover:bg-[#23272A] px-2 rounded-lg ">
                                        <div className="flex items-center max-w-full sm:max-w-4/6">
                                          <div className="text-gray-900 dark:text-white font-bold  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                                            <div className="flex items-center text-lg">
                                              {m?.name
                                                ? typeof m.name === "object"
                                                  ? m.name[0]
                                                  : m.name
                                                : ""}
                                            </div>
                                            <span className="text-gray-400 text-sm -mt-2">
                                              {m?.guildName?.length > 28 ? (
                                                <Tippy
                                                  zIndex={99999999999999}
                                                  content={m.guildName}
                                                  animation="scale"
                                                  className="shadow-xl"
                                                >
                                                  <span>
                                                    {m.guildName.substring(
                                                      0,
                                                      28
                                                    ) + "..."}
                                                  </span>
                                                </Tippy>
                                              ) : (
                                                m.guildName
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1">
                                          {m?.messageCount ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.messageCount
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                  ) + " Messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2"
                                                width="24"
                                              >
                                                <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white cursor-not-allowed ml-2 opacity-60"
                                                width="24"
                                              >
                                                <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.favoriteWords &&
                                          m?.favoriteWords.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.favoriteWords.length
                                              } Favorite Word${
                                                m.favoriteWords.length > 1
                                                  ? "s"
                                                  : ""
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
                                                        {m.favoriteWords
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.favoriteWords.length}`}{" "}
                                                        Favorite Word
                                                        {m.favoriteWords
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.favoriteWords.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {f.word}:{" "}
                                                                {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no favorite words"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topCursed &&
                                          m?.topCursed?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topCursed.length
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                  ) +
                                                " Curse Words | Cursed " +
                                                Utils.getTopCount(m.topCursed) +
                                                " time" +
                                                (m.topCursed.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topCursed.length ===
                                                        1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topCursed.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {f.word}:{" "}
                                                                {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no curse words"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topLinks &&
                                          m?.topLinks?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topLinks.length +
                                                " Links | Sent " +
                                                Utils.getTopCount(m.topLinks) +
                                                " unique link" +
                                                (m.topLinks.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topLinks.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <a
                                                                  href={f.word}
                                                                  className="opacity-80 hover:opacity-100"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                >
                                                                  {f.word}
                                                                </a>
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no links"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topDiscordLinks &&
                                          m?.topDiscordLinks?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topDiscordLinks.length +
                                                " Discord Links | Sent " +
                                                Utils.getTopCount(
                                                  m.topDiscordLinks
                                                ) +
                                                " unique Discord link" +
                                                (m.topDiscordLinks.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topDiscordLinks
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.topDiscordLinks.length}`}{" "}
                                                        Discord Link
                                                        {m.topDiscordLinks
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topDiscordLinks.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <a
                                                                  href={f.word}
                                                                  className="opacity-80 hover:opacity-100"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                >
                                                                  {f.word}
                                                                </a>
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no Discord links"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.oldestMessages &&
                                          m?.oldestMessages?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.oldestMessages.length
                                              } Oldest Message${
                                                m.oldestMessages.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.oldestMessages
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.oldestMessages.length}`}{" "}
                                                        Oldest Message
                                                        {m.favoriteWords
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.oldestMessages.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <b>
                                                                  {f.sentence}
                                                                </b>
                                                                <ul>
                                                                  <li>
                                                                    - sent at{" "}
                                                                    {moment(
                                                                      f.timestamp
                                                                    ).format(
                                                                      "MMMM Do YYYY, h:mm:ss a"
                                                                    )}{" "}
                                                                    <b>
                                                                      (
                                                                      {moment(
                                                                        f.timestamp
                                                                      ).fromNow()}
                                                                      )
                                                                    </b>
                                                                  </li>
                                                                  <li>
                                                                    - sent to{" "}
                                                                    <b>
                                                                      {f.author}
                                                                    </b>
                                                                  </li>
                                                                </ul>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M4 14q0 2.2 1.075 4.012Q6.15 19.825 7.9 20.875q-.425-.6-.662-1.313Q7 18.85 7 18.05q0-1 .375-1.875t1.1-1.6L12 11.1l3.55 3.475q.7.7 1.075 1.588.375.887.375 1.887 0 .8-.237 1.512-.238.713-.663 1.313 1.75-1.05 2.825-2.863Q20 16.2 20 14q0-2.225-1.1-4.088Q17.8 8.05 16 7l-.45.55q-.325.4-.712.575-.388.175-.813.175-.775 0-1.4-.538Q12 7.225 12 6.3V3l-1.25.737Q9.5 4.475 8 5.875t-2.75 3.45Q4 11.375 4 14Zm8-.1-2.125 2.075q-.425.425-.65.963Q9 17.475 9 18.05q0 1.225.875 2.087Q10.75 21 12 21t2.125-.863Q15 19.275 15 18.05q0-.6-.225-1.125t-.65-.95Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                              >
                                                <path d="M7.9 20.875q-1.75-1.05-2.825-2.863Q4 16.2 4 14q0-2.625 1.25-4.675T8 5.875q1.5-1.4 2.75-2.138L12 3v3.3q0 .925.625 1.462.625.538 1.4.538.425 0 .813-.175.387-.175.712-.575L16 7q1.8 1.05 2.9 2.912Q20 11.775 20 14q0 2.2-1.075 4.012-1.075 1.813-2.825 2.863.425-.6.663-1.313Q17 18.85 17 18.05q0-1-.375-1.887-.375-.888-1.075-1.588L12 11.1l-3.525 3.475q-.725.725-1.1 1.6Q7 17.05 7 18.05q0 .8.238 1.512.237.713.662 1.313ZM12 21q-1.25 0-2.125-.863Q9 19.275 9 18.05q0-.575.225-1.112.225-.538.65-.963L12 13.9l2.125 2.075q.425.425.65.95.225.525.225 1.125 0 1.225-.875 2.087Q13.25 21 12 21Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topEmojis &&
                                          m?.topEmojis?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.topEmojis.length
                                              } Top Emoji${
                                                m.topEmojis.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.topEmojis.length < 10
                                                          ? "Top 10"
                                                          : `${m.topEmojis.length}`}{" "}
                                                        Top Emoji
                                                        {m.topEmojis.length ===
                                                        1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topEmojis.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <b>
                                                                  {f.emoji}:{" "}
                                                                  {f.count} time
                                                                  {f.count > 1
                                                                    ? "s"
                                                                    : ""}
                                                                </b>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no emojis"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topCustomEmojis &&
                                          m?.topCustomEmojis?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.topCustomEmojis.length
                                              } Top Custom Emoji${
                                                m.topCustomEmojis.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.topCustomEmojis
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.topCustomEmojis.length}`}{" "}
                                                        Top Custom Emoji
                                                        {m.topCustomEmojis
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topCustomEmojis.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {/<:.*?:(\d+)>/g.exec(
                                                                  f.emoji
                                                                ) ? (
                                                                  <Tippy
                                                                    zIndex={
                                                                      99999999999999
                                                                    }
                                                                    content={`${
                                                                      f.emoji
                                                                    } used ${
                                                                      f.count
                                                                    } time${
                                                                      f.count ===
                                                                      1
                                                                        ? ""
                                                                        : "s"
                                                                    }`}
                                                                    animation="scale"
                                                                    className="shadow-xl"
                                                                  >
                                                                    <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                      <Image
                                                                        unoptimized={
                                                                          true
                                                                        }
                                                                        src={Utils.createEmoji(
                                                                          f.emoji
                                                                        )}
                                                                        alt="emoji"
                                                                        height="50px"
                                                                        width="50px"
                                                                        draggable={
                                                                          false
                                                                        }
                                                                      />
                                                                    </div>
                                                                  </Tippy>
                                                                ) : (
                                                                  <>
                                                                    {/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
                                                                      f.emoji
                                                                    ) ? (
                                                                      <Tippy
                                                                        zIndex={
                                                                          99999999999999
                                                                        }
                                                                        content={`${
                                                                          f.emoji
                                                                        } used ${
                                                                          f.count
                                                                        } time${
                                                                          f.count ===
                                                                          1
                                                                            ? ""
                                                                            : "s"
                                                                        }`}
                                                                        animation="scale"
                                                                        className="shadow-xl"
                                                                      >
                                                                        <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                          <Image
                                                                            unoptimized={
                                                                              true
                                                                            }
                                                                            src={Utils.createCustomEmoji(
                                                                              f.emoji
                                                                            )}
                                                                            alt="emoji"
                                                                            height="50px"
                                                                            width="50px"
                                                                            draggable={
                                                                              false
                                                                            }
                                                                          />
                                                                        </div>
                                                                      </Tippy>
                                                                    ) : (
                                                                      ""
                                                                    )}{" "}
                                                                  </>
                                                                )}
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no custom emojis"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col justify-center items-center">
                                      <span className="text-gray-900 dark:text-gray-200 text-2xl font-bold">
                                        NO RESULTS FOUND
                                      </span>
                                      <span className="text-gray-700 dark:text-gray-400 text-lg max-w-sm">
                                        We could not find what you are looking
                                        for. Try again with a different search
                                        term.
                                      </span>
                                    </div>
                                  )}
                                </>
                              );
                            })
                        : ""}
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
              {messageType === "guildMode" ? (
                <>
                  {data?.messages?.topGuilds &&
                  data?.messages?.topGuilds?.length > 0 ? (
                    <span className="text-black dark:text-gray-300 px-4">
                      Showing{" "}
                      {!topGuilds.length && topGuilds[0] !== "noresults"
                        ? data.messages.topGuilds.length
                        : topGuilds[0] !== "noresults"
                        ? topGuilds.length
                        : "0"}
                      /{data.messages.topGuilds.length}
                    </span>
                  ) : (
                    ""
                  )}
                  <div className="flex grow rounded-sm overflow-y-auto overflow-x-hidden h-[700px]">
                    <div className="flex flex-col w-full px-3 pb-4 lg:px-3 md:px-3 lg:pt-0 md:pt-0 pt-2">
                      {" "}
                      {!data?.messages?.topGuilds ? (
                        <div className="px-10 text-gray-900 dark:text-white text-3xl font-bold flex flex-col justify-center content-center align-center w-full h-full">
                          No Data was found or this option is disabled
                        </div>
                      ) : (
                        ""
                      )}
                      {data?.messages?.topGuilds &&
                      data?.messages?.topGuilds?.length > 0
                        ? !(topGuilds.length > 0) &&
                          topGuilds[0] !== "noresults"
                          ? data?.messages?.topGuilds.map(
                              (m: any, i: number) => {
                                return (
                                  <>
                                    <div key={i}>
                                      <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 hover:bg-gray-400 dark:hover:bg-[#23272A] px-2 rounded-lg ">
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
                                              {m?.guildName?.length > 28 ? (
                                                <Tippy
                                                  zIndex={99999999999999}
                                                  content={m.guildName}
                                                  animation="scale"
                                                  className="shadow-xl"
                                                >
                                                  <span>
                                                    {m.guildName.substring(
                                                      0,
                                                      28
                                                    ) + "..."}
                                                  </span>
                                                </Tippy>
                                              ) : (
                                                m.guildName
                                              )}
                                            </div>
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={m?.name?.join(", ")}
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <span className="text-gray-400 text-sm -mt-2">
                                                {m?.name?.length} channels
                                              </span>
                                            </Tippy>
                                          </div>
                                        </div>
                                        <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1">
                                          {m?.messageCount ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.messageCount
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                  ) + " Messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2"
                                                width="24"
                                              >
                                                <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white cursor-not-allowed ml-2 opacity-60"
                                                width="24"
                                              >
                                                <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.favoriteWords &&
                                          m?.favoriteWords?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.favoriteWords.length
                                              } Favorite Word${
                                                m.favoriteWords.length > 1
                                                  ? "s"
                                                  : ""
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
                                                        {m.favoriteWords
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.favoriteWords.length}`}{" "}
                                                        Favorite Word
                                                        {m.favoriteWords
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.favoriteWords.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {f.word}:{" "}
                                                                {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no favorite words"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topCursed &&
                                          m?.topCursed?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topCursed.length
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                  ) +
                                                " Curse Words | Cursed " +
                                                Utils.getTopCount(m.topCursed) +
                                                " time" +
                                                (m.topCursed.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topCursed.length ===
                                                        1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topCursed.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {f.word}:{" "}
                                                                {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no curse words"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topLinks &&
                                          m?.topLinks?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topLinks.length +
                                                " Links | Sent " +
                                                Utils.getTopCount(m.topLinks) +
                                                " unique link" +
                                                (m.topLinks.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topLinks.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <a
                                                                  href={f.word}
                                                                  className="opacity-80 hover:opacity-100"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                >
                                                                  {f.word}
                                                                </a>
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no links"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topDiscordLinks &&
                                          m?.topDiscordLinks?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topDiscordLinks.length +
                                                " Discord Links | Sent " +
                                                Utils.getTopCount(
                                                  m.topDiscordLinks
                                                ) +
                                                " unique Discord link" +
                                                (m.topDiscordLinks.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topDiscordLinks
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.topDiscordLinks.length}`}{" "}
                                                        Discord Link
                                                        {m.topDiscordLinks
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topDiscordLinks.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <a
                                                                  href={f.word}
                                                                  className="opacity-80 hover:opacity-100"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                >
                                                                  {f.word}
                                                                </a>
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no Discord links"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.oldestMessages &&
                                          m?.oldestMessages?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.oldestMessages.length
                                              } Oldest Message${
                                                m.oldestMessages.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.oldestMessages
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.oldestMessages.length}`}{" "}
                                                        Oldest Message
                                                        {m.favoriteWords
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.oldestMessages.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <b>
                                                                  {f.sentence}
                                                                </b>
                                                                <ul>
                                                                  <li>
                                                                    - sent at{" "}
                                                                    {moment(
                                                                      f.timestamp
                                                                    ).format(
                                                                      "MMMM Do YYYY, h:mm:ss a"
                                                                    )}{" "}
                                                                    <b>
                                                                      (
                                                                      {moment(
                                                                        f.timestamp
                                                                      ).fromNow()}
                                                                      )
                                                                    </b>
                                                                  </li>
                                                                  <li>
                                                                    - sent to{" "}
                                                                    <b>
                                                                      {f.author}
                                                                    </b>
                                                                  </li>
                                                                </ul>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M4 14q0 2.2 1.075 4.012Q6.15 19.825 7.9 20.875q-.425-.6-.662-1.313Q7 18.85 7 18.05q0-1 .375-1.875t1.1-1.6L12 11.1l3.55 3.475q.7.7 1.075 1.588.375.887.375 1.887 0 .8-.237 1.512-.238.713-.663 1.313 1.75-1.05 2.825-2.863Q20 16.2 20 14q0-2.225-1.1-4.088Q17.8 8.05 16 7l-.45.55q-.325.4-.712.575-.388.175-.813.175-.775 0-1.4-.538Q12 7.225 12 6.3V3l-1.25.737Q9.5 4.475 8 5.875t-2.75 3.45Q4 11.375 4 14Zm8-.1-2.125 2.075q-.425.425-.65.963Q9 17.475 9 18.05q0 1.225.875 2.087Q10.75 21 12 21t2.125-.863Q15 19.275 15 18.05q0-.6-.225-1.125t-.65-.95Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                              >
                                                <path d="M7.9 20.875q-1.75-1.05-2.825-2.863Q4 16.2 4 14q0-2.625 1.25-4.675T8 5.875q1.5-1.4 2.75-2.138L12 3v3.3q0 .925.625 1.462.625.538 1.4.538.425 0 .813-.175.387-.175.712-.575L16 7q1.8 1.05 2.9 2.912Q20 11.775 20 14q0 2.2-1.075 4.012-1.075 1.813-2.825 2.863.425-.6.663-1.313Q17 18.85 17 18.05q0-1-.375-1.887-.375-.888-1.075-1.588L12 11.1l-3.525 3.475q-.725.725-1.1 1.6Q7 17.05 7 18.05q0 .8.238 1.512.237.713.662 1.313ZM12 21q-1.25 0-2.125-.863Q9 19.275 9 18.05q0-.575.225-1.112.225-.538.65-.963L12 13.9l2.125 2.075q.425.425.65.95.225.525.225 1.125 0 1.225-.875 2.087Q13.25 21 12 21Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topEmojis &&
                                          m?.topEmojis?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.topEmojis.length
                                              } Top Emoji${
                                                m.topEmojis.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.topEmojis.length < 10
                                                          ? "Top 10"
                                                          : `${m.topEmojis.length}`}{" "}
                                                        Top Emoji
                                                        {m.topEmojis.length ===
                                                        1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topEmojis.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <b>
                                                                  {f.emoji}:{" "}
                                                                  {f.count} time
                                                                  {f.count > 1
                                                                    ? "s"
                                                                    : ""}
                                                                </b>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no emojis"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topCustomEmojis &&
                                          m?.topCustomEmojis?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.topCustomEmojis.length
                                              } Top Custom Emoji${
                                                m.topCustomEmojis.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.topCustomEmojis
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.topCustomEmojis.length}`}{" "}
                                                        Top Custom Emoji
                                                        {m.topCustomEmojis
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topCustomEmojis.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {/<:.*?:(\d+)>/g.exec(
                                                                  f.emoji
                                                                ) ? (
                                                                  <Tippy
                                                                    zIndex={
                                                                      99999999999999
                                                                    }
                                                                    content={`${
                                                                      f.emoji
                                                                    } used ${
                                                                      f.count
                                                                    } time${
                                                                      f.count ===
                                                                      1
                                                                        ? ""
                                                                        : "s"
                                                                    }`}
                                                                    animation="scale"
                                                                    className="shadow-xl"
                                                                  >
                                                                    <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                      <Image
                                                                        unoptimized={
                                                                          true
                                                                        }
                                                                        src={Utils.createEmoji(
                                                                          f.emoji
                                                                        )}
                                                                        alt="emoji"
                                                                        height="50px"
                                                                        width="50px"
                                                                        draggable={
                                                                          false
                                                                        }
                                                                      />
                                                                    </div>
                                                                  </Tippy>
                                                                ) : (
                                                                  <>
                                                                    {/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
                                                                      f.emoji
                                                                    ) ? (
                                                                      <Tippy
                                                                        zIndex={
                                                                          99999999999999
                                                                        }
                                                                        content={`${
                                                                          f.emoji
                                                                        } used ${
                                                                          f.count
                                                                        } time${
                                                                          f.count ===
                                                                          1
                                                                            ? ""
                                                                            : "s"
                                                                        }`}
                                                                        animation="scale"
                                                                        className="shadow-xl"
                                                                      >
                                                                        <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                          <Image
                                                                            unoptimized={
                                                                              true
                                                                            }
                                                                            src={Utils.createCustomEmoji(
                                                                              f.emoji
                                                                            )}
                                                                            alt="emoji"
                                                                            height="50px"
                                                                            width="50px"
                                                                            draggable={
                                                                              false
                                                                            }
                                                                          />
                                                                        </div>
                                                                      </Tippy>
                                                                    ) : (
                                                                      ""
                                                                    )}{" "}
                                                                  </>
                                                                )}
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no custom emojis"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              }
                            )
                          : topGuilds?.map((m: any, i: number) => {
                              return (
                                <>
                                  {m !== "noresults" ? (
                                    <div key={i}>
                                      <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 hover:bg-gray-400 dark:hover:bg-[#23272A] px-2 rounded-lg ">
                                        <div className="flex items-center max-w-full sm:max-w-4/6">
                                          <div className="text-gray-900 dark:text-white font-bold  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                                            <div className="flex items-center text-lg">
                                              {m?.guildName?.length > 28 ? (
                                                <Tippy
                                                  zIndex={99999999999999}
                                                  content={m.guildName}
                                                  animation="scale"
                                                  className="shadow-xl"
                                                >
                                                  <span>
                                                    {m.guildName.substring(
                                                      0,
                                                      28
                                                    ) + "..."}
                                                  </span>
                                                </Tippy>
                                              ) : (
                                                m.guildName
                                              )}
                                            </div>
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={m?.name?.join(", ")}
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <span className="text-gray-400 text-sm -mt-2">
                                                {m?.name?.length} channels
                                              </span>
                                            </Tippy>
                                          </div>
                                        </div>
                                        <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1">
                                          {m?.messageCount ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.messageCount
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                  ) + " Messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2"
                                                width="24"
                                              >
                                                <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white cursor-not-allowed ml-2 opacity-60"
                                                width="24"
                                              >
                                                <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.favoriteWords &&
                                          m?.favoriteWords.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.favoriteWords.length
                                              } Favorite Word${
                                                m.favoriteWords.length > 1
                                                  ? "s"
                                                  : ""
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
                                                        {m.favoriteWords
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.favoriteWords.length}`}{" "}
                                                        Favorite Word
                                                        {m.favoriteWords
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.favoriteWords.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {f.word}:{" "}
                                                                {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no favorite words"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topCursed &&
                                          m?.topCursed?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topCursed.length
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                  ) +
                                                " Curse Words | Cursed " +
                                                Utils.getTopCount(m.topCursed) +
                                                " time" +
                                                (m.topCursed.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topCursed.length ===
                                                        1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topCursed.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {f.word}:{" "}
                                                                {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no curse words"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topLinks &&
                                          m?.topLinks?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topLinks.length +
                                                " Links | Sent " +
                                                Utils.getTopCount(m.topLinks) +
                                                " unique link" +
                                                (m.topLinks.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topLinks.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <a
                                                                  href={f.word}
                                                                  className="opacity-80 hover:opacity-100"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                >
                                                                  {f.word}
                                                                </a>
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no links"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topDiscordLinks &&
                                          m?.topDiscordLinks?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topDiscordLinks.length +
                                                " Discord Links | Sent " +
                                                Utils.getTopCount(
                                                  m.topDiscordLinks
                                                ) +
                                                " unique Discord link" +
                                                (m.topDiscordLinks.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topDiscordLinks
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.topDiscordLinks.length}`}{" "}
                                                        Discord Link
                                                        {m.topDiscordLinks
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topDiscordLinks.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <a
                                                                  href={f.word}
                                                                  className="opacity-80 hover:opacity-100"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                >
                                                                  {f.word}
                                                                </a>
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no Discord links"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.oldestMessages &&
                                          m?.oldestMessages?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.oldestMessages.length
                                              } Oldest Message${
                                                m.oldestMessages.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.oldestMessages
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.oldestMessages.length}`}{" "}
                                                        Oldest Message
                                                        {m.favoriteWords
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.oldestMessages.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <b>
                                                                  {f.sentence}
                                                                </b>
                                                                <ul>
                                                                  <li>
                                                                    - sent at{" "}
                                                                    {moment(
                                                                      f.timestamp
                                                                    ).format(
                                                                      "MMMM Do YYYY, h:mm:ss a"
                                                                    )}{" "}
                                                                    <b>
                                                                      (
                                                                      {moment(
                                                                        f.timestamp
                                                                      ).fromNow()}
                                                                      )
                                                                    </b>
                                                                  </li>
                                                                  <li>
                                                                    - sent to{" "}
                                                                    <b>
                                                                      {f.author}
                                                                    </b>
                                                                  </li>
                                                                </ul>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M4 14q0 2.2 1.075 4.012Q6.15 19.825 7.9 20.875q-.425-.6-.662-1.313Q7 18.85 7 18.05q0-1 .375-1.875t1.1-1.6L12 11.1l3.55 3.475q.7.7 1.075 1.588.375.887.375 1.887 0 .8-.237 1.512-.238.713-.663 1.313 1.75-1.05 2.825-2.863Q20 16.2 20 14q0-2.225-1.1-4.088Q17.8 8.05 16 7l-.45.55q-.325.4-.712.575-.388.175-.813.175-.775 0-1.4-.538Q12 7.225 12 6.3V3l-1.25.737Q9.5 4.475 8 5.875t-2.75 3.45Q4 11.375 4 14Zm8-.1-2.125 2.075q-.425.425-.65.963Q9 17.475 9 18.05q0 1.225.875 2.087Q10.75 21 12 21t2.125-.863Q15 19.275 15 18.05q0-.6-.225-1.125t-.65-.95Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                              >
                                                <path d="M7.9 20.875q-1.75-1.05-2.825-2.863Q4 16.2 4 14q0-2.625 1.25-4.675T8 5.875q1.5-1.4 2.75-2.138L12 3v3.3q0 .925.625 1.462.625.538 1.4.538.425 0 .813-.175.387-.175.712-.575L16 7q1.8 1.05 2.9 2.912Q20 11.775 20 14q0 2.2-1.075 4.012-1.075 1.813-2.825 2.863.425-.6.663-1.313Q17 18.85 17 18.05q0-1-.375-1.887-.375-.888-1.075-1.588L12 11.1l-3.525 3.475q-.725.725-1.1 1.6Q7 17.05 7 18.05q0 .8.238 1.512.237.713.662 1.313ZM12 21q-1.25 0-2.125-.863Q9 19.275 9 18.05q0-.575.225-1.112.225-.538.65-.963L12 13.9l2.125 2.075q.425.425.65.95.225.525.225 1.125 0 1.225-.875 2.087Q13.25 21 12 21Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topEmojis &&
                                          m?.topEmojis?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.topEmojis.length
                                              } Top Emoji${
                                                m.topEmojis.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.topEmojis.length < 10
                                                          ? "Top 10"
                                                          : `${m.topEmojis.length}`}{" "}
                                                        Top Emoji
                                                        {m.topEmojis.length ===
                                                        1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topEmojis.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <b>
                                                                  {f.emoji}:{" "}
                                                                  {f.count} time
                                                                  {f.count > 1
                                                                    ? "s"
                                                                    : ""}
                                                                </b>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no emojis"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topCustomEmojis &&
                                          m?.topCustomEmojis?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.topCustomEmojis.length
                                              } Top Custom Emoji${
                                                m.topCustomEmojis.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.topCustomEmojis
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.topCustomEmojis.length}`}{" "}
                                                        Top Custom Emoji
                                                        {m.topCustomEmojis
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topCustomEmojis.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {/<:.*?:(\d+)>/g.exec(
                                                                  f.emoji
                                                                ) ? (
                                                                  <Tippy
                                                                    zIndex={
                                                                      99999999999999
                                                                    }
                                                                    content={`${
                                                                      f.emoji
                                                                    } used ${
                                                                      f.count
                                                                    } time${
                                                                      f.count ===
                                                                      1
                                                                        ? ""
                                                                        : "s"
                                                                    }`}
                                                                    animation="scale"
                                                                    className="shadow-xl"
                                                                  >
                                                                    <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                      <Image
                                                                        unoptimized={
                                                                          true
                                                                        }
                                                                        src={Utils.createEmoji(
                                                                          f.emoji
                                                                        )}
                                                                        alt="emoji"
                                                                        height="50px"
                                                                        width="50px"
                                                                        draggable={
                                                                          false
                                                                        }
                                                                      />
                                                                    </div>
                                                                  </Tippy>
                                                                ) : (
                                                                  <>
                                                                    {/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
                                                                      f.emoji
                                                                    ) ? (
                                                                      <Tippy
                                                                        zIndex={
                                                                          99999999999999
                                                                        }
                                                                        content={`${
                                                                          f.emoji
                                                                        } used ${
                                                                          f.count
                                                                        } time${
                                                                          f.count ===
                                                                          1
                                                                            ? ""
                                                                            : "s"
                                                                        }`}
                                                                        animation="scale"
                                                                        className="shadow-xl"
                                                                      >
                                                                        <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                          <Image
                                                                            unoptimized={
                                                                              true
                                                                            }
                                                                            src={Utils.createCustomEmoji(
                                                                              f.emoji
                                                                            )}
                                                                            alt="emoji"
                                                                            height="50px"
                                                                            width="50px"
                                                                            draggable={
                                                                              false
                                                                            }
                                                                          />
                                                                        </div>
                                                                      </Tippy>
                                                                    ) : (
                                                                      ""
                                                                    )}{" "}
                                                                  </>
                                                                )}
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no custom emojis"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col justify-center items-center">
                                      <span className="text-gray-900 dark:text-gray-200 text-2xl font-bold">
                                        NO RESULTS FOUND
                                      </span>
                                      <span className="text-gray-700 dark:text-gray-400 text-lg max-w-sm">
                                        We could not find what you are looking
                                        for. Try again with a different search
                                        term.
                                      </span>
                                    </div>
                                  )}
                                </>
                              );
                            })
                        : ""}
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
              {messageType === "dmMode" ? (
                <>
                  {data?.messages?.topGroupDMs &&
                  data?.messages?.topGroupDMs?.length > 0 ? (
                    <span className="text-black dark:text-gray-300 px-4">
                      Showing{" "}
                      {!topGroupDMs.length && topGroupDMs[0] !== "noresults"
                        ? data.messages.topGroupDMs.length
                        : topGroupDMs[0] !== "noresults"
                        ? topGroupDMs.length
                        : "0"}
                      /{data.messages.topGroupDMs.length}
                    </span>
                  ) : (
                    ""
                  )}
                  <div className="flex grow rounded-sm overflow-y-auto overflow-x-hidden h-[700px]">
                    <div className="flex flex-col w-full px-3 pb-4 lg:px-3 md:px-3 lg:pt-0 md:pt-0 pt-2">
                      {" "}
                      {!data?.messages?.topGroupDMs ? (
                        <div className="px-10 text-gray-900 dark:text-white text-3xl font-bold flex flex-col justify-center content-center align-center w-full h-full">
                          No Data was found or this option is disabled
                        </div>
                      ) : (
                        ""
                      )}
                      {data?.messages?.topGroupDMs &&
                      data?.messages?.topGroupDMs?.length > 0
                        ? !(topGroupDMs.length > 0) &&
                          topChannels[0] !== "noresults"
                          ? data?.messages?.topGroupDMs.map(
                              (m: any, i: number) => {
                                return (
                                  <>
                                    <div key={i}>
                                      <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 hover:bg-gray-400 dark:hover:bg-[#23272A] px-2 rounded-lg ">
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
                                              {m?.name
                                                ? m.name
                                                : "Unamed Group"}
                                            </div>
                                            <span className="text-gray-400 text-sm -mt-2">
                                              {m?.recipients} group members
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1">
                                          {m?.messageCount ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.messageCount
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                  ) + " Messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2"
                                                width="24"
                                              >
                                                <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white cursor-not-allowed ml-2 opacity-60"
                                                width="24"
                                              >
                                                <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.favoriteWords &&
                                          m?.favoriteWords?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.favoriteWords.length
                                              } Favorite Word${
                                                m.favoriteWords.length > 1
                                                  ? "s"
                                                  : ""
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
                                                        {m.favoriteWords
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.favoriteWords.length}`}{" "}
                                                        Favorite Word
                                                        {m.favoriteWords
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.favoriteWords.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {f.word}:{" "}
                                                                {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no favorite words"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topCursed &&
                                          m?.topCursed?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topCursed.length
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                  ) +
                                                " Curse Words | Cursed " +
                                                Utils.getTopCount(m.topCursed) +
                                                " time" +
                                                (m.topCursed.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topCursed.length ===
                                                        1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topCursed.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {f.word}:{" "}
                                                                {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no curse words"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topLinks &&
                                          m?.topLinks?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topLinks.length +
                                                " Links | Sent " +
                                                Utils.getTopCount(m.topLinks) +
                                                " unique link" +
                                                (m.topLinks.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topLinks.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <a
                                                                  href={f.word}
                                                                  className="opacity-80 hover:opacity-100"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                >
                                                                  {f.word}
                                                                </a>
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no links"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topDiscordLinks &&
                                          m?.topDiscordLinks?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topDiscordLinks.length +
                                                " Discord Links | Sent " +
                                                Utils.getTopCount(
                                                  m.topDiscordLinks
                                                ) +
                                                " unique Discord link" +
                                                (m.topDiscordLinks.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topDiscordLinks
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.topDiscordLinks.length}`}{" "}
                                                        Discord Link
                                                        {m.topDiscordLinks
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topDiscordLinks.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <a
                                                                  href={f.word}
                                                                  className="opacity-80 hover:opacity-100"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                >
                                                                  {f.word}
                                                                </a>
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no Discord links"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.oldestMessages &&
                                          m?.oldestMessages?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.oldestMessages.length
                                              } Oldest Message${
                                                m.oldestMessages.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.oldestMessages
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.oldestMessages.length}`}{" "}
                                                        Oldest Message
                                                        {m.favoriteWords
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.oldestMessages.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <b>
                                                                  {f.sentence}
                                                                </b>
                                                                <ul>
                                                                  <li>
                                                                    - sent at{" "}
                                                                    {moment(
                                                                      f.timestamp
                                                                    ).format(
                                                                      "MMMM Do YYYY, h:mm:ss a"
                                                                    )}{" "}
                                                                    <b>
                                                                      (
                                                                      {moment(
                                                                        f.timestamp
                                                                      ).fromNow()}
                                                                      )
                                                                    </b>
                                                                  </li>
                                                                  <li>
                                                                    - sent to{" "}
                                                                    <b>
                                                                      {f.author}
                                                                    </b>
                                                                  </li>
                                                                </ul>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M4 14q0 2.2 1.075 4.012Q6.15 19.825 7.9 20.875q-.425-.6-.662-1.313Q7 18.85 7 18.05q0-1 .375-1.875t1.1-1.6L12 11.1l3.55 3.475q.7.7 1.075 1.588.375.887.375 1.887 0 .8-.237 1.512-.238.713-.663 1.313 1.75-1.05 2.825-2.863Q20 16.2 20 14q0-2.225-1.1-4.088Q17.8 8.05 16 7l-.45.55q-.325.4-.712.575-.388.175-.813.175-.775 0-1.4-.538Q12 7.225 12 6.3V3l-1.25.737Q9.5 4.475 8 5.875t-2.75 3.45Q4 11.375 4 14Zm8-.1-2.125 2.075q-.425.425-.65.963Q9 17.475 9 18.05q0 1.225.875 2.087Q10.75 21 12 21t2.125-.863Q15 19.275 15 18.05q0-.6-.225-1.125t-.65-.95Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                              >
                                                <path d="M7.9 20.875q-1.75-1.05-2.825-2.863Q4 16.2 4 14q0-2.625 1.25-4.675T8 5.875q1.5-1.4 2.75-2.138L12 3v3.3q0 .925.625 1.462.625.538 1.4.538.425 0 .813-.175.387-.175.712-.575L16 7q1.8 1.05 2.9 2.912Q20 11.775 20 14q0 2.2-1.075 4.012-1.075 1.813-2.825 2.863.425-.6.663-1.313Q17 18.85 17 18.05q0-1-.375-1.887-.375-.888-1.075-1.588L12 11.1l-3.525 3.475q-.725.725-1.1 1.6Q7 17.05 7 18.05q0 .8.238 1.512.237.713.662 1.313ZM12 21q-1.25 0-2.125-.863Q9 19.275 9 18.05q0-.575.225-1.112.225-.538.65-.963L12 13.9l2.125 2.075q.425.425.65.95.225.525.225 1.125 0 1.225-.875 2.087Q13.25 21 12 21Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topEmojis &&
                                          m?.topEmojis?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.topEmojis.length
                                              } Top Emoji${
                                                m.topEmojis.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.topEmojis.length < 10
                                                          ? "Top 10"
                                                          : `${m.topEmojis.length}`}{" "}
                                                        Top Emoji
                                                        {m.topEmojis.length ===
                                                        1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topEmojis.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <b>
                                                                  {f.emoji}:{" "}
                                                                  {f.count} time
                                                                  {f.count > 1
                                                                    ? "s"
                                                                    : ""}
                                                                </b>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no emojis"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topCustomEmojis &&
                                          m?.topCustomEmojis?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.topCustomEmojis.length
                                              } Top Custom Emoji${
                                                m.topCustomEmojis.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.topCustomEmojis
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.topCustomEmojis.length}`}{" "}
                                                        Top Custom Emoji
                                                        {m.topCustomEmojis
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topCustomEmojis.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {/<:.*?:(\d+)>/g.exec(
                                                                  f.emoji
                                                                ) ? (
                                                                  <Tippy
                                                                    zIndex={
                                                                      99999999999999
                                                                    }
                                                                    content={`${
                                                                      f.emoji
                                                                    } used ${
                                                                      f.count
                                                                    } time${
                                                                      f.count ===
                                                                      1
                                                                        ? ""
                                                                        : "s"
                                                                    }`}
                                                                    animation="scale"
                                                                    className="shadow-xl"
                                                                  >
                                                                    <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                      <Image
                                                                        unoptimized={
                                                                          true
                                                                        }
                                                                        src={Utils.createEmoji(
                                                                          f.emoji
                                                                        )}
                                                                        alt="emoji"
                                                                        height="50px"
                                                                        width="50px"
                                                                        draggable={
                                                                          false
                                                                        }
                                                                      />
                                                                    </div>
                                                                  </Tippy>
                                                                ) : (
                                                                  <>
                                                                    {/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
                                                                      f.emoji
                                                                    ) ? (
                                                                      <Tippy
                                                                        zIndex={
                                                                          99999999999999
                                                                        }
                                                                        content={`${
                                                                          f.emoji
                                                                        } used ${
                                                                          f.count
                                                                        } time${
                                                                          f.count ===
                                                                          1
                                                                            ? ""
                                                                            : "s"
                                                                        }`}
                                                                        animation="scale"
                                                                        className="shadow-xl"
                                                                      >
                                                                        <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                          <Image
                                                                            unoptimized={
                                                                              true
                                                                            }
                                                                            src={Utils.createCustomEmoji(
                                                                              f.emoji
                                                                            )}
                                                                            alt="emoji"
                                                                            height="50px"
                                                                            width="50px"
                                                                            draggable={
                                                                              false
                                                                            }
                                                                          />
                                                                        </div>
                                                                      </Tippy>
                                                                    ) : (
                                                                      ""
                                                                    )}{" "}
                                                                  </>
                                                                )}
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no custom emojis"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              }
                            )
                          : topGroupDMs?.map((m: any, i: number) => {
                              return (
                                <>
                                  {m !== "noresults" ? (
                                    <div key={i}>
                                      <div className="lg:flex md:flex sm:flex items-center lg:py-10 md:py-10 sm:py-10 py-2 sm:flex-row lg:h-1 md:h-1 sm:h-1 hover:bg-gray-400 dark:hover:bg-[#23272A] px-2 rounded-lg ">
                                        <div className="flex items-center max-w-full sm:max-w-4/6">
                                          <div className="text-gray-900 dark:text-white font-bold  ml-4 overflow-hidden text-ellipsis whitespace-nowrap ">
                                            <div className="flex items-center text-lg">
                                              {m?.name}
                                            </div>
                                            <span className="text-gray-400 text-sm -mt-2">
                                              {m?.recipients} group members
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center self-center ml-auto lg:grid my-4 grid-rows-2 grid-flow-col gap-1">
                                          {m?.messageCount ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.messageCount
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                  ) + " Messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2"
                                                width="24"
                                              >
                                                <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white cursor-not-allowed ml-2 opacity-60"
                                                width="24"
                                              >
                                                <path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.favoriteWords &&
                                          m?.favoriteWords.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.favoriteWords.length
                                              } Favorite Word${
                                                m.favoriteWords.length > 1
                                                  ? "s"
                                                  : ""
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
                                                        {m.favoriteWords
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.favoriteWords.length}`}{" "}
                                                        Favorite Word
                                                        {m.favoriteWords
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.favoriteWords.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {f.word}:{" "}
                                                                {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no favorite words"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="m12 21-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4 2 9.3 2 8.15 2 5.8 3.575 4.225 5.15 2.65 7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55 1.175-.55 2.475-.55 2.35 0 3.925 1.575Q22 5.8 22 8.15q0 1.15-.387 2.25-.388 1.1-1.363 2.412-.975 1.313-2.625 2.963-1.65 1.65-4.175 3.925Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topCursed &&
                                          m?.topCursed?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topCursed.length
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                  ) +
                                                " Curse Words | Cursed " +
                                                Utils.getTopCount(m.topCursed) +
                                                " time" +
                                                (m.topCursed.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topCursed.length ===
                                                        1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topCursed.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {f.word}:{" "}
                                                                {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no curse words"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M11 11h2V5h-2Zm1 4q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topLinks &&
                                          m?.topLinks?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topLinks.length +
                                                " Links | Sent " +
                                                Utils.getTopCount(m.topLinks) +
                                                " unique link" +
                                                (m.topLinks.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topLinks.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <a
                                                                  href={f.word}
                                                                  className="opacity-80 hover:opacity-100"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                >
                                                                  {f.word}
                                                                </a>
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no links"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12t1.463-3.538Q4.925 7 7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h8v2Zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.462Q22 9.925 22 12q0 2.075-1.462 3.537Q19.075 17 17 17Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topDiscordLinks &&
                                          m?.topDiscordLinks?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                m.topDiscordLinks.length +
                                                " Discord Links | Sent " +
                                                Utils.getTopCount(
                                                  m.topDiscordLinks
                                                ) +
                                                " unique Discord link" +
                                                (m.topDiscordLinks.length > 1
                                                  ? "s"
                                                  : "")
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
                                                        {m.topDiscordLinks
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.topDiscordLinks.length}`}{" "}
                                                        Discord Link
                                                        {m.topDiscordLinks
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topDiscordLinks.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <a
                                                                  href={f.word}
                                                                  className="opacity-80 hover:opacity-100"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                >
                                                                  {f.word}
                                                                </a>
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
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
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no Discord links"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="m19.25 16.45-1.5-1.55q.975-.275 1.613-1.063Q20 13.05 20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.438Q22 9.875 22 12q0 1.425-.75 2.637-.75 1.213-2 1.813ZM15.85 13l-2-2H16v2Zm3.95 9.6L1.4 4.2l1.4-1.4 18.4 18.4ZM11 17H7q-2.075 0-3.537-1.463Q2 14.075 2 12q0-1.75 1.062-3.088Q4.125 7.575 5.75 7.15L7.6 9H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4Zm-3-4v-2h1.625l1.975 2Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.oldestMessages &&
                                          m?.oldestMessages?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.oldestMessages.length
                                              } Oldest Message${
                                                m.oldestMessages.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.oldestMessages
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.oldestMessages.length}`}{" "}
                                                        Oldest Message
                                                        {m.favoriteWords
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.oldestMessages.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <b>
                                                                  {f.sentence}
                                                                </b>
                                                                <ul>
                                                                  <li>
                                                                    - sent at{" "}
                                                                    {moment(
                                                                      f.timestamp
                                                                    ).format(
                                                                      "MMMM Do YYYY, h:mm:ss a"
                                                                    )}{" "}
                                                                    <b>
                                                                      (
                                                                      {moment(
                                                                        f.timestamp
                                                                      ).fromNow()}
                                                                      )
                                                                    </b>
                                                                  </li>
                                                                  <li>
                                                                    - sent to{" "}
                                                                    <b>
                                                                      {f.author}
                                                                    </b>
                                                                  </li>
                                                                </ul>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M4 14q0 2.2 1.075 4.012Q6.15 19.825 7.9 20.875q-.425-.6-.662-1.313Q7 18.85 7 18.05q0-1 .375-1.875t1.1-1.6L12 11.1l3.55 3.475q.7.7 1.075 1.588.375.887.375 1.887 0 .8-.237 1.512-.238.713-.663 1.313 1.75-1.05 2.825-2.863Q20 16.2 20 14q0-2.225-1.1-4.088Q17.8 8.05 16 7l-.45.55q-.325.4-.712.575-.388.175-.813.175-.775 0-1.4-.538Q12 7.225 12 6.3V3l-1.25.737Q9.5 4.475 8 5.875t-2.75 3.45Q4 11.375 4 14Zm8-.1-2.125 2.075q-.425.425-.65.963Q9 17.475 9 18.05q0 1.225.875 2.087Q10.75 21 12 21t2.125-.863Q15 19.275 15 18.05q0-.6-.225-1.125t-.65-.95Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no messages"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                              >
                                                <path d="M7.9 20.875q-1.75-1.05-2.825-2.863Q4 16.2 4 14q0-2.625 1.25-4.675T8 5.875q1.5-1.4 2.75-2.138L12 3v3.3q0 .925.625 1.462.625.538 1.4.538.425 0 .813-.175.387-.175.712-.575L16 7q1.8 1.05 2.9 2.912Q20 11.775 20 14q0 2.2-1.075 4.012-1.075 1.813-2.825 2.863.425-.6.663-1.313Q17 18.85 17 18.05q0-1-.375-1.887-.375-.888-1.075-1.588L12 11.1l-3.525 3.475q-.725.725-1.1 1.6Q7 17.05 7 18.05q0 .8.238 1.512.237.713.662 1.313ZM12 21q-1.25 0-2.125-.863Q9 19.275 9 18.05q0-.575.225-1.112.225-.538.65-.963L12 13.9l2.125 2.075q.425.425.65.95.225.525.225 1.125 0 1.225-.875 2.087Q13.25 21 12 21Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topEmojis &&
                                          m?.topEmojis?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.topEmojis.length
                                              } Top Emoji${
                                                m.topEmojis.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.topEmojis.length < 10
                                                          ? "Top 10"
                                                          : `${m.topEmojis.length}`}{" "}
                                                        Top Emoji
                                                        {m.topEmojis.length ===
                                                        1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topEmojis.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                <b>
                                                                  {f.emoji}:{" "}
                                                                  {f.count} time
                                                                  {f.count > 1
                                                                    ? "s"
                                                                    : ""}
                                                                </b>
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") + "have no emojis"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M15.5 11q.65 0 1.075-.425Q17 10.15 17 9.5q0-.65-.425-1.075Q16.15 8 15.5 8q-.65 0-1.075.425Q14 8.85 14 9.5q0 .65.425 1.075Q14.85 11 15.5 11Zm-7 0q.65 0 1.075-.425Q10 10.15 10 9.5q0-.65-.425-1.075Q9.15 8 8.5 8q-.65 0-1.075.425Q7 8.85 7 9.5q0 .65.425 1.075Q7.85 11 8.5 11Zm3.5 6.5q1.775 0 3.137-.975Q16.5 15.55 17.1 14H6.9q.6 1.55 1.963 2.525 1.362.975 3.137.975Zm0 4.5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                          {m?.topCustomEmojis &&
                                          m?.topCustomEmojis?.length > 0 ? (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={`${
                                                m.topCustomEmojis.length
                                              } Top Custom Emoji${
                                                m.topCustomEmojis.length > 1
                                                  ? "s"
                                                  : ""
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
                                                          : "Your"}{" "}
                                                        {m.topCustomEmojis
                                                          .length < 10
                                                          ? "Top 10"
                                                          : `${m.topCustomEmojis.length}`}{" "}
                                                        Top Custom Emoji
                                                        {m.topCustomEmojis
                                                          .length === 1
                                                          ? " is"
                                                          : "s are"}
                                                        :
                                                      </span>
                                                      <br />
                                                      <ul className="list-disc ml-4">
                                                        {m.topCustomEmojis.map(
                                                          (
                                                            f: any,
                                                            i: number
                                                          ) => {
                                                            return (
                                                              <li key={i}>
                                                                {/<:.*?:(\d+)>/g.exec(
                                                                  f.emoji
                                                                ) ? (
                                                                  <Tippy
                                                                    zIndex={
                                                                      99999999999999
                                                                    }
                                                                    content={`${
                                                                      f.emoji
                                                                    } used ${
                                                                      f.count
                                                                    } time${
                                                                      f.count ===
                                                                      1
                                                                        ? ""
                                                                        : "s"
                                                                    }`}
                                                                    animation="scale"
                                                                    className="shadow-xl"
                                                                  >
                                                                    <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                      <Image
                                                                        unoptimized={
                                                                          true
                                                                        }
                                                                        src={Utils.createEmoji(
                                                                          f.emoji
                                                                        )}
                                                                        alt="emoji"
                                                                        height="50px"
                                                                        width="50px"
                                                                        draggable={
                                                                          false
                                                                        }
                                                                      />
                                                                    </div>
                                                                  </Tippy>
                                                                ) : (
                                                                  <>
                                                                    {/<a:([a-zA-Z0-9_]+):([0-9]+)>/g.exec(
                                                                      f.emoji
                                                                    ) ? (
                                                                      <Tippy
                                                                        zIndex={
                                                                          99999999999999
                                                                        }
                                                                        content={`${
                                                                          f.emoji
                                                                        } used ${
                                                                          f.count
                                                                        } time${
                                                                          f.count ===
                                                                          1
                                                                            ? ""
                                                                            : "s"
                                                                        }`}
                                                                        animation="scale"
                                                                        className="shadow-xl"
                                                                      >
                                                                        <div className="cursor-pointer text-4xl opacity-90 hover:opacity-100">
                                                                          <Image
                                                                            unoptimized={
                                                                              true
                                                                            }
                                                                            src={Utils.createCustomEmoji(
                                                                              f.emoji
                                                                            )}
                                                                            alt="emoji"
                                                                            height="50px"
                                                                            width="50px"
                                                                            draggable={
                                                                              false
                                                                            }
                                                                          />
                                                                        </div>
                                                                      </Tippy>
                                                                    ) : (
                                                                      ""
                                                                    )}{" "}
                                                                  </>
                                                                )}
                                                                : {f.count} time
                                                                {f.count > 1
                                                                  ? "s"
                                                                  : ""}
                                                              </li>
                                                            );
                                                          }
                                                        )}
                                                      </ul>
                                                    </div>
                                                  );
                                                }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-pointer"
                                              >
                                                <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                              </svg>
                                            </Tippy>
                                          ) : (
                                            <Tippy
                                              zIndex={99999999999999}
                                              content={
                                                (data?.dataFile
                                                  ? "They "
                                                  : "You ") +
                                                "have no custom emojis"
                                              }
                                              animation="scale"
                                              className="shadow-xl"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                width="24"
                                                className="dark:fill-gray-300 dark:hover:fill-white ml-2 cursor-not-allowed opacity-60"
                                              >
                                                <path d="M12 22q-2.05 0-3.875-.788-1.825-.787-3.187-2.15-1.363-1.362-2.15-3.187Q2 14.05 2 12q0-2.15.825-3.988.825-1.837 2.213-3.187 1.387-1.35 3.187-2.1Q10.025 1.975 12 2q1.025 0 2 .175.975.175 2 .675l-3.475 1.6 4.75 2.3 1.45 3.175q-2.275.275-4.688-.525-2.412-.8-4.287-3.1-.875 2.125-2.387 3.5Q5.85 11.175 4 11.85q0 3.475 2.338 5.813Q8.675 20 12 20q3.4 0 5.725-2.4Q20.05 15.2 20 12q0-.35-.025-.625t-.075-.625L21.15 8q.45 1.05.65 2.012.2.963.2 1.988 0 2-.762 3.812-.763 1.813-2.1 3.188-1.338 1.375-3.163 2.188Q14.15 22 12 22Zm-3-7.75q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363Zm6 0q-.525 0-.887-.363-.363-.362-.363-.887t.363-.887q.362-.363.887-.363t.887.363q.363.362.363.887t-.363.887q-.362.363-.887.363ZM19.5 8l-1.1-2.4L16 4.5l2.4-1.1L19.5 1l1.1 2.4L23 4.5l-2.4 1.1Z" />
                                              </svg>
                                            </Tippy>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col justify-center items-center">
                                      <span className="text-gray-900 dark:text-gray-200 text-2xl font-bold">
                                        NO RESULTS FOUND
                                      </span>
                                      <span className="text-gray-700 dark:text-gray-400 text-lg max-w-sm">
                                        We could not find what you are looking
                                        for. Try again with a different search
                                        term.
                                      </span>
                                    </div>
                                  )}
                                </>
                              );
                            })
                        : ""}
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>{" "}
          </div>
        </div>
      </div>
      <div className="lg:grid my-4 grid-rows-2 grid-flow-col gap-4 lg:mx-10 md:mx-8 mx-2 lg:mt-4 md:mt-4 mt-2">
        <div className="lg:px-4 md:px-4 px-1 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg row-span-3 lg:flex md:flex items-center justify-center relative group">
          <div
            id="blur_8"
            className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-hover:block"
            onClick={() => {
              const div = document.getElementById("blur_8_div");
              if (div) {
                div.classList.toggle("blur-xl");
                div.classList.toggle("pointer-events-none");
                div.classList.toggle("select-none");

                const el: any = document.getElementById("blur_8_show");
                if (el) el.classList.toggle("hidden");

                const el2: any = document.getElementById("blur_8_hide");
                if (el) el2.classList.toggle("hidden");
              }
            }}
          >
            <svg
              id="blur_8_show"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto opacity-80 hover:opacity-100"
            >
              <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
            </svg>
            <svg
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto hidden opacity-80 hover:opacity-100"
              id="blur_8_hide"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
            >
              <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
            </svg>
          </div>
          <div
            id="blur_8_div"
            className="lg:flex md:flex items-center justify-center"
          >
            <div className="lg:mr-14 lg:ml-8 md:mr-12 md:ml-7 mb-2 lg:mb-0 md:mb-0">
              <span
                className="text-gray-900 dark:text-white font-bold xl:text-5xl lg:text-2xl hidden lg:block md:block uppercase"
                style={{
                  fontFamily:
                    "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
                }}
              >
                {data?.dataFile ? "Their" : "Your"} <br /> Discord <br /> Bots
              </span>
              <span className="text-gray-900 dark:text-white font-bold lg:hidden md:hidden text-xl">
                {data?.dataFile ? "Their" : "Your"} Discord Bots
              </span>
            </div>
            <div className="grid xl:grid-cols-8 xl2:grid-cols-6 xl3:grid-cols-8 lg:grid-cols-6 md1:grid-cols-4 xl1:grid-cols-4 grid-cols-6 justify-items-center">
              {data?.bots && data?.bots?.length > 0
                ? data.bots
                    .sort((a: any, b: any) => {
                      if (a.verified && !b.verified) {
                        return -1;
                      }
                      if (!a.verified && b.verified) {
                        return 1;
                      }
                      return 0;
                    })
                    .map((b: any, i: number) => {
                      return (
                        <div
                          className="cursor-pointer xl:m-1 m-2"
                          key={i}
                          id={"bot_" + i}
                          onClick={() => {
                            copyToClipboard(b.id);
                            noti("Copied ID to Clipboard");
                          }}
                        >
                          <Tippy
                            zIndex={99999999999999}
                            content={`${b?.verified ? "[🗸 VERIFIED]" : ""} ${
                              b.name
                            }`}
                            animation="scale"
                            className="shadow-xl"
                          >
                            <div className="text-5xl p-1 rounded-full flex items-center justify-center ring-2 ring-gray-500 opacity-90 hover:opacity-100">
                              <Image
                                unoptimized={true}
                                src={
                                  !b?.avatar?.endsWith("null.png")
                                    ? b?.avatar
                                    : "https://cdn.Discordapp.com/embed/avatars/" +
                                      Math.floor(Math.random() * 5) +
                                      ".png"
                                }
                                alt={b.name}
                                width={62}
                                height={62}
                                className="rounded-full"
                                onError={(e) => {
                                  (
                                    e.target as HTMLImageElement
                                  ).removeAttribute("srcset");
                                  (e.target as HTMLImageElement).src =
                                    "https://cdn.Discordapp.com/embed/avatars/" +
                                    Math.floor(Math.random() * 5) +
                                    ".png";
                                }}
                              />
                            </div>
                          </Tippy>
                        </div>
                      );
                    })
                : ""}
            </div>
            {!data?.bots ? (
              <div className="text-center text-gray-900 dark:text-white font-bold text-xl">
                No Bots were found or this option is was disabled by{" "}
                {data?.dataFile ? "them" : "you"}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="px-4 py-2 lg:my-0 my-4 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg row-span-3 col-span-2 relative group">
          <div
            id="blur_9"
            className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-hover:block"
            onClick={() => {
              const div = document.getElementById("blur_9_div");
              if (div) {
                div.classList.toggle("blur-xl");
                div.classList.toggle("pointer-events-none");
                div.classList.toggle("select-none");

                const el: any = document.getElementById("blur_9_show");
                if (el) el.classList.toggle("hidden");

                const el2: any = document.getElementById("blur_9_hide");
                if (el) el2.classList.toggle("hidden");
              }
            }}
          >
            <svg
              id="blur_9_show"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto opacity-80 hover:opacity-100"
            >
              <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
            </svg>
            <svg
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto hidden opacity-80 hover:opacity-100"
              id="blur_9_hide"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
            >
              <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
            </svg>
          </div>
          <div id="blur_9_div">
            {!data?.payments ? (
              <div className="flex items-center gap-2">
                {" "}
                <span className="text-gray-900 dark:text-white font-bold">
                  {data?.dataFile ? "They " : "You "}have no payments or this
                  option is disabled by {data?.dataFile ? "them" : "you"}.
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-white text-xl flex items-center">
                    <Tippy
                      zIndex={99999999999999}
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
                    {data?.dataFile ? "They've " : "You've "}spent{" "}
                    <p className="mx-1 font-extrabold text-blue-500 inline-flex">
                      {Utils.getMostUsedCurrency(
                        data.payments.transactions,
                        data?.payments?.total?.toFixed(2) ?? 0
                      )}
                    </p>
                    on Discord
                  </span>
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold text-xl mt-2 uppercase">
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
                  <ul className="text-gray-900 dark:text-white lg:text-xl md:text-xl font-bold list-disc mt-2 ml-6 text-xs">
                    {data?.payments?.transactions?.map((t: any, i: number) => {
                      return (
                        <li key={i}>
                          <div className="inline-flex">
                            <p className="mx-1 font-extrabold inline-flex">
                              {Utils.getMostUsedCurrency(
                                data.payments.transactions,
                                t?.amount ? t.amount : 0
                              )}
                            </p>
                            on
                            <Tippy
                              zIndex={99999999999999}
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
                <h3 className="text-gray-900 dark:text-white font-bold text-xl mt-2 flex items-center uppercase">
                  Nitro gifted to {data?.dataFile ? "Them" : "You"} by others
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-white font-bold">
                    {!data?.payments?.giftedNitro
                      ? `${
                          data?.dataFile ? "They " : "You "
                        } have not been gifted Nitro by anyone.`
                      : ""}
                  </span>
                  <ul className="text-gray-900 dark:text-white text-xl font-bold list-disc mt-2 ml-6">
                    {data?.payments?.giftedNitro
                      ? Object.keys(data?.payments?.giftedNitro)?.map(
                          (t: any, i: number) => {
                            return (
                              <li key={i}>
                                <div className="inline-flex">
                                  {t}:
                                  <p className="mx-1 font-extrabold text-blue-500">
                                    {data?.payments?.giftedNitro[t]}
                                  </p>
                                </div>
                              </li>
                            );
                          }
                        )
                      : ""}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="gap-4 lg:mx-10 md:mx-8 mx-2 lg:mt-4 md:mt-4 mt-2 pb-10">
        <div className="lg:px-4 md:px-4 px-1 py-2 bg-gray-300 dark:bg-[#2b2d31] animate__fadeIn animate__delay-1s rounded-lg text-left w-full relative group">
          <div
            id="blur_10"
            className="absolute right-[10px] top-[10px] z-[999999] lg:hidden md:hidden group-hover:block"
            onClick={() => {
              const div = document.getElementById("blur_10_div");
              if (div) {
                div.classList.toggle("blur-xl");
                div.classList.toggle("pointer-events-none");
                div.classList.toggle("select-none");

                const el: any = document.getElementById("blur_10_show");
                if (el) el.classList.toggle("hidden");

                const el2: any = document.getElementById("blur_10_hide");
                if (el) el2.classList.toggle("hidden");
              }
            }}
          >
            <svg
              id="blur_10_show"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto opacity-80 hover:opacity-100"
            >
              <path d="M12 16q1.875 0 3.188-1.312Q16.5 13.375 16.5 11.5q0-1.875-1.312-3.188Q13.875 7 12 7q-1.875 0-3.188 1.312Q7.5 9.625 7.5 11.5q0 1.875 1.312 3.188Q10.125 16 12 16Zm0-1.8q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.8q-3.65 0-6.65-2.038-3-2.037-4.35-5.462 1.35-3.425 4.35-5.463Q8.35 4 12 4q3.65 0 6.65 2.037 3 2.038 4.35 5.463-1.35 3.425-4.35 5.462Q15.65 19 12 19Zm0-7.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" />
            </svg>
            <svg
              className="fill-black dark:fill-white cursor-pointer pointer-events-auto hidden opacity-80 hover:opacity-100"
              id="blur_10_hide"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
            >
              <path d="m16.1 13.3-1.45-1.45q.225-1.175-.675-2.2-.9-1.025-2.325-.8L10.2 7.4q.425-.2.862-.3Q11.5 7 12 7q1.875 0 3.188 1.312Q16.5 9.625 16.5 11.5q0 .5-.1.938-.1.437-.3.862Zm3.2 3.15-1.45-1.4q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L7.65 4.85q1.025-.425 2.1-.638Q10.825 4 12 4q3.775 0 6.725 2.087Q21.675 8.175 23 11.5q-.575 1.475-1.512 2.738Q20.55 15.5 19.3 16.45Zm.5 6.15-4.2-4.15q-.875.275-1.762.413Q12.95 19 12 19q-3.775 0-6.725-2.087Q2.325 14.825 1 11.5q.525-1.325 1.325-2.463Q3.125 7.9 4.15 7L1.4 4.2l1.4-1.4 18.4 18.4ZM5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.5 0 .975-.062.475-.063.975-.138l-.9-.95q-.275.075-.525.112Q12.275 16 12 16q-1.875 0-3.188-1.312Q7.5 13.375 7.5 11.5q0-.275.037-.525.038-.25.113-.525Zm7.975 2.325ZM9.75 12.6Z" />
            </svg>
          </div>
          <div id="blur_10_div">
            <span
              className="text-gray-900 dark:text-white lg:text-4xl text-2xl font-bold flex items-center uppercase"
              style={{
                fontFamily:
                  "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
              }}
            >
              Statistics{" "}
              <Tippy
                zIndex={99999999999999}
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
                      </svg>
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
            <div className="text-gray-900 dark:text-white md:text-xl lg:text-xl font-bold text-[16px] mt-2">
              {data?.statistics
                ? Object.keys(data?.statistics)?.map((t: any, i: number) => {
                    if (!t) return;
                    if ((EventsJSON.events as any)[t] && data?.statistics[t]) {
                      return (
                        <div key={i}>
                          <div className="flex items-center mb-4">
                            {(statIcons as any)[t] ? (
                              <Tippy
                                zIndex={99999999999999}
                                animation="scale"
                                className="shadow-xl"
                                content={(EventsJSON.events as any)[t]}
                              >
                                <div className="cursor-default">
                                  {(statIcons as any)[t]}
                                </div>
                              </Tippy>
                            ) : (
                              ""
                            )}

                            <div
                              className="ml-1"
                              dangerouslySetInnerHTML={{
                                __html: (EventsJSON.e_dsc as any)[t]
                                  .toLowerCase()
                                  .replace(
                                    /{count}/g,
                                    `<b class="text-blue-400">${data?.statistics[t]}</b>`
                                  )
                                  .replace(
                                    /{you}/g,
                                    data?.dataFile ? "They" : "You"
                                  )
                                  .replace(
                                    /{you've}/g,
                                    data?.dataFile ? "They've" : "You've"
                                  )
                                  .replace(
                                    /{your}/g,
                                    data?.dataFile ? "Their" : "Your"
                                  ),
                              }}
                            />
                          </div>
                        </div>
                      );
                    } else if (t === "averageMessages") {
                      if (data?.statistics[t].day) {
                        return (
                          <div
                            key={i}
                            className="lg:inline-flex md:inline-flex lg:text-xl md:text-xl text-sm"
                          >
                            - {data?.dataFile ? "They " : "You "} send ~
                            {data?.statistics[t].day} Average Messages messages
                            per day, {data?.statistics[t].week} messages per
                            week, {data?.statistics[t].month} messages per
                            month, and {data?.statistics[t].year} messages per
                            year.
                          </div>
                        );
                      }
                    } else if (t === "averageOpenCount") {
                      if (data?.statistics[t].day) {
                        return (
                          <div
                            key={i}
                            className="lg:inline-flex md:inline-flex lg:text-xl md:text-xl text-sm"
                          >
                            - {data?.dataFile ? "They " : "You "} open Discord ~
                            {data?.statistics[t].day} times per day,{" "}
                            {data?.statistics[t].week} times per week,{" "}
                            {data?.statistics[t].month} times per month, and{" "}
                            {data?.statistics[t].year} times per year.
                          </div>
                        );
                      }
                    }
                  })
                : `This option was disabled by ${
                    data?.dataFile ? "them" : "you"
                  }.`}
            </div>
          </div>{" "}
        </div>
      </div>
      <div
        className="group animate__fadeIn animate__delay-5s animate__animated"
        id="popup__1"
      >
        <div className="fixed bottom-5 right-5 hidden lg:block opacity-70 hover:opacity-100 cursor-pointer ">
          <div className="bg-gray-300 dark:bg-[#232323] px-6 py-2">
            <a
              href="https://github.com/peterhanania/Discord-package"
              target="_blank"
              rel="noreferrer"
            >
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
                <div className="flex justify-end">
                  <Tippy
                    zIndex={99999999999999}
                    content={"Close"}
                    animation="scale"
                    className="shadow-xl"
                  >
                    <div
                      className="ml-2 p-1 hover:bg-[#2b2d31] hover:opacity-100 opacity-60 rounded-lg group-hover:block hidden w-8"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("popup__1")?.remove();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        className="fill-white cursor-pointer"
                      >
                        <path d="m6.3 19.6-1.85-1.9 5.675-5.7L4.45 6.25l1.85-1.9 5.725 5.75L17.7 4.35l1.85 1.9L13.875 12l5.675 5.7-1.85 1.9-5.675-5.75Z" />
                      </svg>
                    </div>
                  </Tippy>
                </div>
              </div>
              <p className="text-gray-900 dark:text-white text-sm max-w-[200px] text-left">
                Enjoying what you see? Star this repository on Github and follow
                the developer! Maintaining this project is a lot of work 😊
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
