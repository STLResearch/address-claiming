import { loadStripeOnramp } from "@stripe/crypto";
import { CryptoElements, OnrampElement } from "./StripeCryptoElements";
import { CloseIconBlack } from "@/Components/Icons";
import "./StripeStyle.css";
export default function StripeOnrampComponent({
  clientSecret,
  setClientSecret,
  showOnramp,
  setShowOnramp,
}) {
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
        <div className="fixed  bottom-0 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-white sm:rounded-[30px] rounded-t-3xl  overflow-y-auto overflow-x-hidden z-[500] md:z-50 flex flex-col fund-table-scrollbar h-[500px] backdrop-blur-md  w-full sm:w-[635px] ">
          <button
            onClick={handleClose}
            className="absolute top-3 right-4 w-[10px] h-[10px] cursor-pointer z-[501] flex items-center justify-center"
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
