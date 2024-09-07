import { useMemo } from "react";

const useIsMobile = () => {
  return useMemo(() => {
    const userAgent = navigator.userAgent;
    if (/android|iPhone|iPad|iPod/i.test(userAgent)) {
      return true;
    }
    return false;
  }, []);
};

export default useIsMobile;
