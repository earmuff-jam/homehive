import { useEffect } from "react";

/**
 * useFetchUserIp ...
 *
 * saves the user ip address into the provided local storage.
 * this ip address is not accurate to pin point the user however,
 * it is only used to be served as a user metrics.
 *
 */
export const useFetchUserIp = () => {
  useEffect(() => {
    const fetchUserIp = async () => {
      try {
        const currentIpAddress = localStorage.getItem("ip");
        if (!currentIpAddress) {
          const response = await fetch("https://api.ipify.org/?format=json");
          const data = await response.json();
          const ip = data?.ip || "";
          localStorage.setItem("ip", ip);
        }
      } catch (err) {
        /* eslint-disable no-console */
        console.error("Error retrieving user ip:", err);
      }
    };

    fetchUserIp();
  }, []);
};
