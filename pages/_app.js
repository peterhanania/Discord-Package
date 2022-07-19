import "./index.css";
import "animate.css";
import "./toastify.css";
import "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import React from "react";
import Loading from "../components/Loading";
import { DataProvider } from "../components/utils/context";

export default function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "dark");
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

    setTimeout(() => {
      setLoading(false);
    }, 1000);
    console.log(
      `
%c  %c

%cDiscord Package
Beta
`,
      "background: none;",
      "color: #888; font-size: 20px;",
      "color: #666; font-size: 15px;"
    );
  }, []);

  return loading ? (
    <Loading></Loading>
  ) : (
    <DataProvider>
      <Component {...pageProps} />
    </DataProvider>
  );
}
