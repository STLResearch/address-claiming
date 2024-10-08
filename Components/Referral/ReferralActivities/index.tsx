import React, { useState } from "react";
import ActivitiesList from "../ActivitiesList";

import { useMobile } from "@/hooks/useMobile";

const ReferralActivities: React.FC = () => {
  const { isMobile } = useMobile();
  const [showActivities, setShowActivities] = useState(false);
  return (
    <div className="mt-4 md:mt-0 w-full md:w-w-1/2 px-4 md:px-8">
      <div
        className=" py-5 px-4 md:px-6 rounded-[30px] bg-white  w-full shadow-xl"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <div className="">
          <h3 className="text-xl font-semibold mt-4">
            How can I earn SKY Points?
          </h3>
          {isMobile ? (
            <div className="flex flex-col w-full mt-4 space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Account Registration</p>
                <span className="text-[#4285F4] text-sm font-medium">
                  5 SKY points
                </span>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Claim your air rights</p>
                <span className="text-[#4285F4] text-sm font-medium">
                  100 SKY points
                </span>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Refer a friend</p>
                <span className="text-[#4285F4] text-sm font-medium">
                  100 SKY points
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-col w-full mt-4">
              <p className="text-sm font-semibold">
                Account Registration{" "}
                <span className="text-[#D3D3D3] text-sm font-light">
                  {" "}
                  ---------
                </span>{" "}
                <span className="text-[#4285F4] text-sm font-medium">
                  5 SKY points
                </span>{" "}
              </p>
              <p className="text-sm font-semibold">
                Claim your air rights
                <span className="text-[#D3D3D3] text-sm font-light">
                  {" "}
                  ----------
                </span>{" "}
                <span className="text-[#4285F4] text-sm font-medium">
                  100 SKY points
                </span>{" "}
              </p>
              <p className="text-sm font-semibold">
                Refer a friend{" "}
                <span className="text-[#D3D3D3] text-sm font-light">
                  {" "}
                  ----------------
                </span>{" "}
                <span className="text-[#4285F4] text-sm font-medium">
                  100 SKY points to you and your friend
                </span>{" "}
              </p>
            </div>
          )}
          <div className="">
            <div className="flex justify-end mt-2">
              <button
                className="text-[#0653EA] font-semibold hover:underline text-sm"
                onClick={() => {
                  setShowActivities(true);
                }}
              >
                View full list
              </button>
            </div>
          </div>
          {showActivities && (
            <ActivitiesList onBack={() => setShowActivities(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralActivities;
