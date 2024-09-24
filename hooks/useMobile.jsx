"use client";
import { useEffect, useState } from "react";

export const useMobile = () => {
  const [windowWidth, setWindowWidth] = useState();
  const [alreadySet, setAlreadySet] = useState(false);

  useEffect(() => {
    if (windowWidth) return;
    if (!global || !global.window) return;
    setWindowWidth(global.window.innerWidth);
  }, [global]);

  const isMobile = windowWidth < 768;

  const handleResize = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    if (!window) return;
    if (alreadySet) return;
    window.addEventListener("resize", handleResize);
    setAlreadySet(true);
    return () => window.removeEventListener("resize", handleResize);
  }, [global]);

  return { isMobile };
};
