import dynamic from "next/dynamic";
import { Suspense } from "react";

const DynamicLoading = dynamic(()=>import("./component"),{ssr:false});

export default function GoogleAds(props: { format: string, slot: string, responsive: string }) {

  return (
   <Suspense fallback={<div>Loading...</div>}>
      <DynamicLoading format={props.format} slot={props.slot} responsive={props.responsive} />
    </Suspense>
  );
}
