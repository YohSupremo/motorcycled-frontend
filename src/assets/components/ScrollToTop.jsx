import { useEffect } from "react";
import { useLocation } from "react-router-dom";



const HASH_RETRY_DELAYS = [0, 150, 400, 800, 1400];


export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      
      if (search.includes("writeReview=true")) return undefined;

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
      return undefined;
    }

    const targetId = decodeURIComponent(hash.slice(1));
    let cancelled = false;
    const timers = [];

    const tryScroll = (index) => {
      if (cancelled) return;

      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const next = index + 1;
      if (next < HASH_RETRY_DELAYS.length) {
        timers.push(
          window.setTimeout(
            () => tryScroll(next),
            HASH_RETRY_DELAYS[next] - HASH_RETRY_DELAYS[index],
          ),
        );
      }
    };

    tryScroll(0);

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [pathname, search, hash]);

  return null;
}

export default ScrollToTop;
