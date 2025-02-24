import AlertJSON from "./json/alerts/index.json";
import { useEffect, useState, ReactElement } from "react";
import { IconSpeakerphone, IconX } from "@tabler/icons-react";

interface Alert {
  id: string;
  title: string;
  button?: string;
  url?: string;
}

export default function Alerts(): ReactElement<any> {
  const [show, setShow] = useState<boolean>(false);
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    const latestAlert = AlertJSON[AlertJSON.length - 1] as Alert;
    if (localStorage.getItem(latestAlert.id) !== "true") {
      setShow(true);
      setAlert(latestAlert);
    }
  }, []);

  const handleDismiss = () => {
    if (alert) {
      localStorage.setItem(alert.id, "true");
      setShow(false);
    }
  };

  if (!show || !alert) {
    return <></>;
  }

  return (
    <aside 
      role="alert"
      aria-label="Announcement"
      className="bg-indigo-600 rounded" 
      id="announcement"
    >
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-indigo-800">
              <IconSpeakerphone
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </span>
            <h2 className="ml-3 font-medium text-white truncate">
              <span className="md:hidden">{alert.title}</span>
              <span className="hidden md:inline">{alert.title}</span>
            </h2>
          </div>

          {alert.button && (
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <a
                href={alert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
              >
                {alert.button}
              </a>
            </div>
          )}

          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              aria-label="Dismiss alert"
            >
              <IconX className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
