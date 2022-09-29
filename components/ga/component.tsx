import { useEffect } from "react";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

export default function GoogleAdsComponent(props: { format: string, slot: string, responsive: string }) {
  const { slot } = props;
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({
        google_ad_client: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE,
      });
    } catch (error) {
      // nothing
    }
  }, [slot]);

  return (
    <div key={slot}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={"ca-pub-" + process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}
        data-ad-slot={props.slot}
        data-ad-format={props.format}
        data-full-width-responsive={props.responsive}
      ></ins>
    </div>
  );
}
