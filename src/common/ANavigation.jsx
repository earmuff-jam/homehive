import { createContext, useContext, useEffect } from "react";
import React from "react";

import { useLocation } from "react-router-dom";

import dayjs from "dayjs";

import { useGetCurrentIPAddressQuery } from "features/Api/analyticsApi";
import { addDoc, collection } from "firebase/firestore";
import { analyticsFirestore } from "src/config";

/**
 * NavigationProvider ...
 *
 * Provider context used to perform analytics on navigation routes. This context
 * wraps the application around router history, which in turn updates the firestore
 * db based on the change in the routes of the application layer.
 */

const NavigationContext = createContext();
const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS || "false";

export const NavigationProvider = ({ children }) => {
  const { pathname } = useLocation();
  const userIPAddress = localStorage?.getItem("ip");

  useGetCurrentIPAddressQuery(undefined, {
    skip: !!userIPAddress,
  });

  useEffect(() => {
    // log data only if analytics is enabled
    if (analyticsEnabled?.toLowerCase() === "true") {
      const logUserAnalyticsToFirestore = async () => {
        try {
          if (pathname) {
            const analytics = collection(analyticsFirestore, "analytics");
            await addDoc(analytics, {
              ipAddress: userIPAddress,
              url: pathname,
              currentTime: dayjs().toISOString(),
            });
          }
        } catch (error) {
          /* eslint-disable no-console */
          console.error("Error logging page location:", error);
        }
      };

      logUserAnalyticsToFirestore();
    }
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ pathname }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useLocationContext = () => useContext(NavigationContext);
