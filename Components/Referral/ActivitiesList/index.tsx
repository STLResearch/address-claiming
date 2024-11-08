import Backdrop from "@/Components/Backdrop";
import { ArrowLeftIcon, InfoIcon } from "@/Components/Icons";
import { CloseIcon } from "@/Components/Shared/Icons";
import { useMobile } from "@/hooks/useMobile";
import React, { useState } from "react";

interface ActivitiesListProps {
  onBack: () => void;
}

const ActivitiesList: React.FC<ActivitiesListProps> = ({ onBack }) => {
  const { isMobile } = useMobile();
  const rows = [
    {
      description: "Account Registration (no KYC required to get these points)",
      points: "5 SKY points",
    },
    {
      description:
        "Claim your air rights (full claim/verified air rights). This is per every unique claimed air rights. KYC completed is a precondition for this allocation.",
      points: "100 SKY points",
    },
    {
      description:
        "For claimed air rights which is fully validated done by the referred account.",
      points:
        "100 SKY points to you and 100 SKY points to your friend (this is part of the points allocation 2) + 10% bonus on the referred income stream from air-right rental",
    },
    {
      description:
        "Refer a friend (friend registers an account, but KYC on that friend’s account is not required for the introducing account to get their SKY points, fraudulent activity will be minimized by T&Cs where we say we will deduct points for fraudulent acts if discovered)",
      points: "5 SKY points",
    },
    {
      description: "For making a first valid bid in the Auction House",
      points: "100 SKY points",
    },
    {
      description:
        "Claim or refer 1 air rights in a specific area:  New York: Manhattan & Boroughs Texas: Garland, Murphy, Plano, Richardson, Mesquite, Dallas, Rowlett, Colony, College Station Florida: Clermont, New Port Richey, Valrico, Winter Haven, Tampa, Brandon, Riverview, Seffner Arizona: Phoenix, Glendale, Peoria Arkansas: Farmington, Bentonville, Rogers, Pea Ridge Virginia: Virginia Beach Utah: Lindon, Herriman North Carolina: Raeford Boosting: SKY points eg x 3",
      points: "5 SKY points/drone",
    },
    {
      description: "Track a drone with the radar app",
      points: "5 SKY points/drone",
    },
    {
      description:
        "Track a drone with the radar app in a specific area:  Texas: Garland, Murphy, Plano, Richardson, Mesquite, Dallas, Rowlett, Colony, College Station Florida: Clermont, New Port Richey, Valrico, Winter Haven, Tampa, Brandon, Riverview, Seffner Arizona: Phoenix, Glendale, Peoria Arkansas: Farmington, Bentonville, Rogers, Pea Ridge Virginia: Virginia Beach Utah: Lindon, Herriman North Carolina: Raeford Boosting: SKY points eg x 3",
      points: "Boosting: SKY points eg x 3",
    },
  ];
  return (
    <div>
      {isMobile ? (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 overflow-x-auto ">
          <div className="flex items-center mb-4">
            <div
              className="flex px-4  items-center justify-between py-5  w-full text-[#222222] bg-white"
              style={{ boxShadow: "0px 2px 12px 0px #00000014" }}
            >
              <button onClick={onBack} className="mr-2 h-6 w-6">
                <ArrowLeftIcon />
              </button>
              <h2 className="text-lg font-bold flex-1 text-center">
                How can I earn SKY Points?
              </h2>
            </div>
          </div>
          <div className="p-4 mx-auto bg-white">
            <div className="max-w-full px-4">
              <div className="min-w-full">
                {rows.map((row, index) => (
                  <div
                    key={index}
                    className={`${index % 2 === 0 ? "bg-[#E9F5FE]" : "bg-white"} flex`}
                  >
                    <div className="py-2 font-semibold px-4 border w-1/2 text-xs">
                      {row.description}
                    </div>
                    <div className="py-2 font-semibold px-4 border w-1/2  text-[#4285F4] text-xs">
                      {row.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Backdrop onClick={onBack} />
          <div className="max-h-[640px] overflow-x-auto z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-10 no-scrollbar">
            <div className="border rounded-3xl shadow-lg p-4 max-w-xl mx-auto bg-white">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex-1 text-center">
                  How can I earn SKY Points?
                </h2>
                <button onClick={onBack} className="h-4 w-4 ml-4">
                  <CloseIcon />
                </button>
              </div>
              <div className="max-w-full px-6">
                <div className="min-w-full">
                  {" "}
                  {/* Container for scrollable content */}
                  {rows.map((row, index) => (
                    <div
                      key={index}
                      className={`${index % 2 === 0 ? "bg-[#E9F5FE]" : "bg-white"} flex`}
                    >
                      <div className="py-2 font-semibold px-4 border w-1/2 text-xs">
                        {row.description}
                      </div>
                      <div className="py-2 font-semibold px-4 border w-1/2  text-[#4285F4] text-xs">
                        {row.points}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesList;
