"use client";
import { useRef } from "react";
import TawkMessengerReact, {
  TawkMessenger,
} from "@tawk.to/tawk-messenger-react";

const TawkMessengerComponent = () => {
  const tawkMessengerRef = useRef<TawkMessenger>(null);

  return (
    <div className="z-10">

      <TawkMessengerReact
        propertyId="655381bacec6a912820fc8a3"
        widgetId="1hf735gcu"
        ref={tawkMessengerRef}
      />
    </div>
  );
};

export default TawkMessengerComponent;
