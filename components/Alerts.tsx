import { SpeakerphoneIcon, XIcon } from "@heroicons/react/outline";
import AlertJSON from "./json/alerts/index.json";
import { useEffect, useState, ReactElement } from "react";

export default function Alerts(): ReactElement {
  const [show, setShow] = useState<boolean>(false);
  const [alert_, setAlert] = useState<any>({});

  useEffect(() => {
    const alert = AlertJSON[AlertJSON.length - 1];
    if (localStorage.getItem(alert.id) !== "true") {
      setShow(true);
      setAlert(alert);
    }
  }, []);

  if (show && alert_) {
    return (
      <div className="bg-indigo-600 rounded" id="announcement">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                <SpeakerphoneIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">{alert_.title}</span>
                <span className="hidden md:inline">{alert_.title}</span>
              </p>
            </div>
            {alert_?.button ? (
              <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                <a
                  href={alert_.url ? alert_.url : null}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  {alert_.button}
                </a>
              </div>
            ) : (
              ""
            )}
            <div
              className="order-2 flex-shrink-0 sm:order-3 sm:ml-3"
              onClick={() => {
                localStorage.setItem(alert_.id, "true");
                setShow(false);
              }}
            >
              <button
                type="button"
                className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-non sm:-mr-2"
              >
                <span className="sr-only">Dismiss</span>
                <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else return <></>;
}
