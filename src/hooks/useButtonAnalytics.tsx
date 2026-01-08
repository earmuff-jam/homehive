import { useLocation } from "react-router-dom";

import dayjs from "dayjs";

import { addDoc, collection } from "firebase/firestore";
import { analyticsFirestore } from "src/config";

// TAnalyticsPayload ...
type TAnalyticsPayload = {
  ipAddress: string;
  label: string;
  pathname: string;
  currentTime: string;
};

// useButtonAnalytics ...
export const useButtonAnalytics = () => {
  const { pathname } = useLocation();

  const storedIp = localStorage.getItem("ip");

  const logClick = async (label?: string): Promise<void> => {
    if (!label) return;

    try {
      const analyticsCollection = collection(analyticsFirestore, "analytics");

      const payload: TAnalyticsPayload = {
        ipAddress: storedIp ?? "",
        label,
        pathname,
        currentTime: dayjs().toISOString(),
      };

      await addDoc(analyticsCollection, payload);
    } catch (error) {
      /* eslint-disable no-console */
      console.error("Error logging analytics:", error);
    }
  };

  return logClick;
};
