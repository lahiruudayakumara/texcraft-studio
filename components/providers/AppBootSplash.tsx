"use client";

import { useEffect, useState } from "react";

import { SplashScreen } from "@/components/brand/SplashScreen";

type AppBootSplashProps = {
  children: React.ReactNode;
};

export function AppBootSplash({ children }: AppBootSplashProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setIsFading(true), 1200);
    const hideTimer = window.setTimeout(() => setIsVisible(false), 1800);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {children}
      {isVisible && (
        <div
          className={`fixed inset-0 z-[120] transition-opacity duration-500 ${
            isFading ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
        >
          <SplashScreen />
        </div>
      )}
    </>
  );
}
