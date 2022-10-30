import "./styles/index.css";
import "animate.css";
import "./styles/toastify.css";
import "./styles/skeleton.scss";
import "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import React, { useEffect } from "react";
import Loading from "../components/Loading";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import * as ga from "../lib/ga";
import ErrorBoundary from "components/error/errorBoundary";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "dark");
    }

    if (!localStorage.getItem("debug")) {
      localStorage.setItem("debug", "true");
    }

    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (window.location.href.includes("demo=true")) {
      document.body.innerHTML = `<div class="sp"><div class="sp1"></div><div class="sp2"></div></div><div class="flex items-center justify-center dark:text-white text-gray-900 text-xl font-mono font-bold">Redirecting you to demo page, stay tight!</div>`;

      window.location.href = "/demo";
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
    console.log(
      "%c🚀 Welcome to Discord Package 🚀\nPlease Report bugs to Peter_#4444",
      "font-size: 1.5rem; font-weight: bold; color: #fff; background: #000; padding: 0.5rem;"
    );
    console.log(
      "%cMake sure to join the Discord server and leave your ideas, bug reports, and feedback to improve the service!",
      "font-size: 0.8rem; font-weight: bold; color: #fff; background: #000; padding: 0.3rem;"
    );
  }, []);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ErrorBoundary>
      {loading ? (
        <SnackbarProvider>
          <Loading skeleton={false} />
        </SnackbarProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </ErrorBoundary>
  );
}
