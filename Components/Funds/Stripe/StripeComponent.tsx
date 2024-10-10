import { loadStripeOnramp } from "@stripe/crypto";
import { CryptoElements, OnrampElement } from "./StripeCryptoElements";
import { CloseIconBlack } from "@/Components/Icons";
import "./StripeStyle.css";
export default function StripeOnrampComponent({ clientSecret, setClientSecret, showOnramp, setShowOnramp }) {
  const apiKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!apiKey) {
    throw new Error("Stripe Onramp Publishable Key is missing");
  }

  const stripeOnrampPromise = loadStripeOnramp(apiKey);

  const handleClose = () => {
    setClientSecret("");
    setShowOnramp(false);
  };

  return (
    <div>
      {showOnramp && (
        <div className="fund-table-scrollbar fixed bottom-0 left-0 z-[500] flex h-[500px] w-full flex-col overflow-y-auto overflow-x-hidden rounded-t-3xl bg-white backdrop-blur-md sm:left-1/2 sm:top-1/2 sm:w-[635px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[30px] md:z-50">
          <button
            onClick={handleClose}
            className="absolute right-4 top-3 z-[501] flex h-[10px] w-[10px] cursor-pointer items-center justify-center"
          >
            <CloseIconBlack />
          </button>

          <CryptoElements stripeOnramp={stripeOnrampPromise}>
            <OnrampElement clientSecret={clientSecret} id="onramp-element" />
          </CryptoElements>
        </div>
      )}
    </div>
  );
}
