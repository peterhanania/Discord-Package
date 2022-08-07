import Head from "next/head";
import { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <div className="sp">
        <div className="sp1"></div>
        <div className="sp2"></div>
      </div>
    </>
  );
}
