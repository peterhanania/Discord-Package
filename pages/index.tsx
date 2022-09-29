import Upload from "../components/Upload";
import Head from "next/head";
import { SnackbarProvider } from "notistack";

export default function Home() {
  return (
    <>
      <Head>
        <title>📦 Discord Package Explorer ✨</title>
      </Head>
     
        <SnackbarProvider>
          <Upload />
        </SnackbarProvider>
    
      
    </>
  );
}
