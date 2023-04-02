/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import React from "react";

class ErrorBoundary extends React.Component<any> {
  state: {
    hasError: boolean;
    error: string;
  };
  constructor(props: { children: any }) {
    super(props);

    this.state = { hasError: false, error: "" };
  }
  static getDerivedStateFromError(error: any) {
    console.log(error);

    return { hasError: true, error: error.message };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.log({ error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <>
          <Head>
            <title>Discord Package - An Error has occured</title>
          </Head>
          <div className="h-screen flex justify-center items-center">
            <div className="flex items-center flex-col justify-center lg:flex-row py-28 px-6 md:px-24 lg:px-24 md:py-20 lg:py-32 gap-16 lg:gap-28">
              <div className="w-full lg:w-1/4 flex items-center justify-center">
                <img
                  className="hidden lg:block"
                  src={process.env.NEXT_PUBLIC_DOMAIN + "/discord-package.png"}
                  alt=""
                  draggable="false"
                />
                <img
                  className="hidden md:block lg:hidden w-1/2"
                  src={process.env.NEXT_PUBLIC_DOMAIN + "/discord-package.png"}
                  alt=""
                  draggable="false"
                />
                <img className="md:hidden" src="/discord-package.png" alt="" />
              </div>
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                <div>
                  <h1 className="py-4 text-2xl lg:text-5xl md:text-4xl font-extrabold dark:text-white text-gray-800">
                    An Error Occured
                  </h1>
                  <p className="pb-8 text-2xl dark:text-white text-gray-800 max-w-lg">
                    An error has just occured, please report this issue to the
                    discord server! However, before doing so, try pressing on
                    the &apos;retry&apos; button, if it does not work, click the
                    button below to join the Discord, take a screenshot of the
                    error below and send it to channel
                    <code className="mx-1">
                      <u>#bug-reports</u>
                    </code>
                    and we will try to fix it as soon as possible.
                  </p>
                  <div className="pb-8 text-2xl font-bold text-red-500 max-w-lg">
                    {this.state.error}
                  </div>
                  <a
                    onClick={() => {
                      this.setState({ hasError: false });
                    }}
                    className="cursor-pointer button-green h-5"
                    style={{
                      padding: "10px 40px",
                    }}
                  >
                    Retry
                  </a>
                  <Link href={process.env.NEXT_PUBLIC_DOMAIN + "/discord"}>
                    <a
                      className="cursor-pointer button-green ml-3"
                      style={{
                        padding: "10px 40px",
                      }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Join the Discord Server
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
