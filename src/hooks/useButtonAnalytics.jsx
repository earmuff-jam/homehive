import { useLocation } from "react-router-dom";

import dayjs from "dayjs";

import { addDoc, collection } from "firebase/firestore";
import { analyticsFirestore } from "src/config";

/**
 * useButtonAnalytics ...
 *
 * tracks user interactivity with existing buttons and stores it in firestore
 *
 */
export const useButtonAnalytics = () => {
  const { pathname } = useLocation();
  const ipAddress = localStorage.getItem("ip");

  const logClick = async (label) => {
    if (!label) return;
    try {
      const analyticsCollection = collection(analyticsFirestore, "analytics");
      await addDoc(analyticsCollection, {
        ipAddress: ipAddress?.ipAddress || "",
        label,
        pathname,
        currentTime: dayjs().toISOString(),
      });
    } catch (error) {
      /* eslint-disable no-console */
      console.error("Error logging analytics:", error);
    }
  };

  return logClick;
};
