/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
export default function Home() {
  return (
    <>
      <Head>
        <title>📦 Discord Package Explorer and Viewer | Privacy 📦</title>
      </Head>
      <div className="h-screen mt-10 relative px-20 text-black dark:text-white py-10">
        <h1
          className="text-2xl text-black dark:text-white flex items-center justify-center uppercase"
          style={{
            fontFamily:
              "Ginto,system-ui,-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,sans-serif",
          }}
        >
          📦 Our Privacy Policy
        </h1>

        <div>
          <div>
            <div>
              <p className="font-bold text-xl">Privacy Policy</p>
              <u className="italic">Updated on: Sep 29, 2022</u>
              <p className="pb-1">
                Welcome to <b>discord package</b>. Your privacy is very
                important to us.
              </p>
              <p>
                Discord Package is dedicated to protecting the privacy rights of
                our users ("users" or "you"). This Privacy Policy (the "Policy")
                describes the ways we collect, store, use, and manage the
                information, including personal information, that you provide or
                we collect in connection with our website.
              </p>
              <p>
                By using the Service, you are expressing your agreement to this
                Policy and the processing of your data, including your personal
                information, in the manner provided in this Policy. If you do
                not agree to these terms, please do not use the Service.
              </p>
              <p className="py-1 font-bold">Information Collection</p>
              <p>
                When you interact with us through the Services we do not store
                any bit of information from you. Your data is stored on your
                browser, on your device, not anywhere else.
              </p>
              <p>
                <b>Data We Collect Automatically:</b> When you interact with us
                through the Services, we receive and store certain information
                such as an Session statistics; Approximate geolocation; Browser
                and device information using google analytics. We may store such
                information or such information may be included in databases
                owned and maintained by affiliates, agents or service providers.
                The Services may use such information and pool it with other
                information to track, for example, the total number of visitors
                to our Site.
              </p>

              <p>
                We may use third party web site analytic tools such as Google
                Analytics on our website that employ cookies to collect certain
                information concerning your use of our Services. However, you
                can disable cookies by changing your browser settings. Further
                information about the procedure to follow in order to disable
                cookies can be found on your Internet browser provider's website
                via your help screen.
              </p>
              <p>
                If you do not wish to receive personalized advertising that is
                delivered by third parties outside of the Service, you may be
                able to exercise that choice through opt-out programs that are
                administered by third parties.
              </p>
              <p className="py-1 font-bold">Use of information</p>
              <p>
                We only use the data collected by google analytics to track our
                growth. Your personal package data is not stored anywhere so;
              </p>
              <ul className="list-disc">
                <li>
                  Analysing and improving our site, e.g. collecting information
                  about how you use our Services to optimize the design and
                  placement of certain features;
                </li>
                <li>Tracking site growth.</li>
              </ul>
              <p className="py-2 font-bold">Disclosure of information</p>
              <p>
                Discord Package is not in the business of selling your
                information because we simply don't have any information of you.
                <ul className="font-bold list-disc">
                  <li>
                    We do not store any form of data as we don't have any third
                    party services.
                  </li>
                  <li>
                    Our code is fully open sourced and available for inspection
                    on the Github repository.
                  </li>
                  <li>
                    We do not have a backend server. Everything runs on the
                    frontend.
                  </li>
                  <li>
                    We run the website using Netlify (Netlify.com) directly from
                    the main repository
                  </li>
                  <li>
                    No database, no storage or any other form of data is stored.
                  </li>
                </ul>
              </p>

              <p className="py-2 font-bold">Third parties</p>
              <ul className="list-disc">
                <li>Google Analytics</li>
              </ul>
              <p className="font-bold">General Contact Information</p>
              <p>peter@pogy.xyz</p>
              <p>
                If you have any questions about this Policy, please contact me
                at peter@pogy.xyz
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
