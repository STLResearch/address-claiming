import { useEffect, useState } from "react";
import { useMobile } from "@/hooks/useMobile";


export default function useTawk() {

  const { isMobile } = useMobile();
  const [doItAgain, setDoItAgain] = useState(false);

  useEffect(() => {
    var Tawk_API = global?.Tawk_API || undefined;
    if (!Tawk_API) return;

    if (isMobile) {
      if (Tawk_API.hideWidget !== undefined) {
        Tawk_API.hideWidget();
      } else if (!doItAgain) {
        setDoItAgain(true);
      }
    } else {
      if (Tawk_API.showWidget !== undefined) {
        Tawk_API.showWidget();
      } else if (doItAgain) {
        setDoItAgain(false);
      }
    }
  }, [isMobile, global.Tawk_API, doItAgain]);

  return null;
}
