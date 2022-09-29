import Demo from "../components/demo";
import Head from "next/head";

export default function DemoComponent() {
  return (
    <>
      <Head>
        <title>📦 Discord Package Explorer Demo ✨</title>
      </Head>
      <div className="h-screen">
        <Demo />
      </div>
    </>
  );
}
