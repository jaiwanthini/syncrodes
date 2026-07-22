"use client";

import { useEffect, useState } from "react";

export function useStreamingText(fullText: string, enabled: boolean, speedMs = 12) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!enabled) {
      setDisplayed(fullText);
      return;
    }

    setDisplayed("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setDisplayed(fullText.slice(0, index));
      if (index >= fullText.length) {
        window.clearInterval(timer);
      }
    }, speedMs);

    return () => window.clearInterval(timer);
  }, [enabled, fullText, speedMs]);

  return displayed;
}
