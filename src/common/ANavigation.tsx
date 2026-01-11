import { ReactNode, createContext, useContext, useEffect } from "react";

import { useLocation } from "react-router-dom";

import dayjs from "dayjs";

import { useGetCurrentIPAddressQuery } from "features/Api/analyticsApi";
import { addDoc, collection } from "firebase/firestore";
import { analyticsFirestore } from "src/config";

// NavigationContextType ...
interface NavigationContextType {
  pathname: string;
}

// NavigationProviderProps ...
interface NavigationProviderProps {
  children: ReactNode;
}

const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === "true";
const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const { pathname } = useLocation();
  const userIPAddress = localStorage?.getItem("ip");

  useGetCurrentIPAddressQuery(undefined, {
    skip: !!userIPAddress,
  });

  useEffect(() => {
    // log data only if analytics is enabled
    if (analyticsEnabled) {
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
  }, [pathname, userIPAddress]);

  return (
    <NavigationContext.Provider value={{ pathname }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useLocationContext = (): NavigationContextType =>
  useContext(NavigationContext);
