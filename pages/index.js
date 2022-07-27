import Upload from "../components/Upload";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Discord Package Explorer</title>
      </Head>
      <div className="h-screen">
        <Upload />
      </div>
    </>
  );
}
