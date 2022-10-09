import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* google adsense */}
        {/* <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
        (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}",
            enable_page_level_ads: true
            });
            `,
          }}
        /> */}
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#5865F2" />
        <meta
          name="title"
          content="📦 Discord Data Package Viewer and Explorer ✨ "
        />
        <meta
          name="description"
          content="Discord Data Package Viewer makes it easy to explore your Discord data package. Dig through all your old dms, messages, guilds, and more. Find forgotten memories & uncovered hidden gems."
        />
        <meta
          name="image"
          content="https://discordpackage.com/discord-package.png"
        />
        <meta
          name="keywords"
          content="discord package, discord, discord package viewer, discord data package explorer, view your discord package"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://discordpackage.com" />
        <meta
          property="og:title"
          content="📦 Discord Data Package Viewer and Explorer ✨"
        />
        <meta
          property="og:description"
          content="Discord Data Package Viewer makes it easy to explore your Discord data package. Dig through all your old dms, messages, guilds, and more. Find forgotten memories & uncovered hidden gems."
        />
        <meta
          property="og:image"
          content="https://discordpackage.com/thumbnail.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://discordpackage.com" />
        <meta
          property="twitter:title"
          content="Discord Data Package Viewer and Explorer"
        />
        <meta
          property="twitter:description"
          content="Discord Data Package Viewer makes it easy to explore your Discord data package. Dig through all your old dms, messages, guilds, and more. Find forgotten memories & uncovered hidden gems."
        />
        <meta
          property="twitter:image"
          content="https://discordpackage.com/discord-package.png"
        />
        <noscript>
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "#2b2d31",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: "26px",
                fontFamily:
                  "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
              }}
            >
              You need to enable Javascript on this browser so that you continue
              using the service.
            </span>
          </div>
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
