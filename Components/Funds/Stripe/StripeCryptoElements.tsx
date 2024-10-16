import React, { ReactNode } from "react";

type CryptoElementsContextType = {
  onramp: any | null;
} | null;

const CryptoElementsContext =
  React.createContext<CryptoElementsContextType>(null);

export const CryptoElements = ({
  stripeOnramp,
  children,
}: {
  stripeOnramp: Promise<any>;
  children: ReactNode;
}) => {
  const [ctx, setContext] = React.useState<CryptoElementsContextType>(() => ({
    onramp: null,
  }));

  React.useEffect(() => {
    let isMounted = true;

    Promise.resolve(stripeOnramp).then((onramp) => {
      if (onramp && isMounted) {
        setContext((ctx) => (ctx?.onramp ? ctx : { onramp }));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [stripeOnramp]);

  return (
    <CryptoElementsContext.Provider value={ctx}>
      {children}
    </CryptoElementsContext.Provider>
  );
};

export const useStripeOnramp = () => {
  const context = React.useContext(CryptoElementsContext);
  if (!context) {
    throw new Error(
      "useStripeOnramp must be used within a CryptoElementsProvider",
    );
  }
  return context.onramp;
};

export const OnrampElement = ({
  clientSecret,
  appearance = { theme: "light" },
  ...props
}: {
  clientSecret: string;
  appearance?: any;
  [key: string]: any;
}) => {
  const stripeOnramp = useStripeOnramp();
  const onrampElementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const containerRef = onrampElementRef.current;
    if (containerRef) {
      containerRef.innerHTML = "";

      if (clientSecret && stripeOnramp) {
        stripeOnramp
          .createSession({
            clientSecret,
            appearance,
          })
          .mount(containerRef);
      }
    }
  }, [clientSecret, stripeOnramp]);

  return <div {...props} ref={onrampElementRef}></div>;
};
