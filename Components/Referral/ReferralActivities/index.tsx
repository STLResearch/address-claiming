import React, { useState } from "react";
import ActivitiesList from "../ActivitiesList";

import { useMobile } from "@/hooks/useMobile";

const ReferralActivities: React.FC = () => {
  const { isMobile } = useMobile();
  const [showActivities, setShowActivities] = useState(false);
  return (
    <div className="md:w-w-1/2 mt-4 w-full px-4 md:mt-0 md:px-8">
      <div
        className="w-full rounded-[30px] bg-white px-4 py-5 shadow-xl md:px-6"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <div className="">
          <h3 className="mt-4 text-xl font-semibold">How can I earn SKY Points?</h3>
          {isMobile ?
            <div className="mt-4 flex w-full flex-col space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Account Registration</p>
                <span className="text-sm font-medium text-[#4285F4]">5 SKY points</span>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Claim your airspace</p>
                <span className="text-sm font-medium text-[#4285F4]">100 SKY points</span>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Refer a friend</p>
                <span className="text-sm font-medium text-[#4285F4]">100 SKY points</span>
              </div>
            </div>
          : <div className="mt-4 w-full flex-col">
              <p className="text-sm font-semibold">
                Account Registration <span className="text-sm font-light text-[#D3D3D3]"> ---------</span>{" "}
                <span className="text-sm font-medium text-[#4285F4]">5 SKY points</span>{" "}
              </p>
              <p className="text-sm font-semibold">
                Claim your airspace
                <span className="text-sm font-light text-[#D3D3D3]"> ----------</span>{" "}
                <span className="text-sm font-medium text-[#4285F4]">100 SKY points</span>{" "}
              </p>
              <p className="text-sm font-semibold">
                Refer a friend <span className="text-sm font-light text-[#D3D3D3]"> ----------------</span>{" "}
                <span className="text-sm font-medium text-[#4285F4]">100 SKY points to you and your friend</span>{" "}
              </p>
            </div>
          }
          <div className="">
            <div className="mt-2 flex justify-end">
              <button
                className="text-sm font-semibold text-[#0653EA] hover:underline"
                onClick={() => {
                  setShowActivities(true);
                }}
              >
                View full list
              </button>
            </div>
          </div>
          {showActivities && <ActivitiesList onBack={() => setShowActivities(false)} />}
        </div>
      </div>
    </div>
  );
};

export default ReferralActivities;
