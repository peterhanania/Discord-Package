/* eslint-disable no-unexpected-multiline */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { ReactElement } from "react";
import { SnackbarProvider } from "notistack";
import { dataAtom } from "./atoms/demo";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Loading from "./Loading";

export default function Upload(): ReactElement<any> {
  const [data] = useAtom(dataAtom);

  const DynamicComponent = dynamic(() => import("./Data"), {
    ssr: true,
    loading: () => <SnackbarProvider><Loading skeleton={true} /></SnackbarProvider>,
  });

  return data ? (
    <Suspense fallback={<SnackbarProvider><Loading skeleton={true}/></SnackbarProvider>}>
      <SnackbarProvider>
        <DynamicComponent data={data} demo={true} />
      </SnackbarProvider>
    </Suspense>
  ) : (
    <></>
  );
}
