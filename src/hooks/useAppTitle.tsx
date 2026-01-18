import { useEffect } from "react";

// useAppTitle ...
export const useAppTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | HomeHiveSolutions`;
  }, [title]);
};
