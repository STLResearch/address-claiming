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
        "Claim your airspace (full claim/verified airspace). This is per every unique claimed airspace. KYC completed is a precondition for this allocation.",
      points: "100 SKY points",
    },
    {
      description: "For claimed airspace which is fully validated done by the referred account.",
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
        "Claim or refer 1 airspace in a specific area:  New York: Manhattan & Boroughs Texas: Garland, Murphy, Plano, Richardson, Mesquite, Dallas, Rowlett, Colony, College Station Florida: Clermont, New Port Richey, Valrico, Winter Haven, Tampa, Brandon, Riverview, Seffner Arizona: Phoenix, Glendale, Peoria Arkansas: Farmington, Bentonville, Rogers, Pea Ridge Virginia: Virginia Beach Utah: Lindon, Herriman North Carolina: Raeford Boosting: SKY points eg x 3",
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
      {isMobile ?
        <div className="fixed left-0 top-0 z-50 h-full w-full overflow-x-auto bg-white">
          <div className="mb-4 flex items-center">
            <div
              className="flex w-full items-center justify-between bg-white px-4 py-5 text-[#222222]"
              style={{ boxShadow: "0px 2px 12px 0px #00000014" }}
            >
              <button onClick={onBack} className="mr-2 h-6 w-6">
                <ArrowLeftIcon />
              </button>
              <h2 className="flex-1 text-center text-lg font-bold">How can I earn SKY Points?</h2>
            </div>
          </div>
          <div className="mx-auto bg-white p-4">
            <div className="max-w-full px-4">
              <div className="min-w-full">
                {rows.map((row, index) => (
                  <div key={index} className={`${index % 2 === 0 ? "bg-[#E9F5FE]" : "bg-white"} flex`}>
                    <div className="w-1/2 border px-4 py-2 text-xs font-semibold">{row.description}</div>
                    <div className="w-1/2 border px-4 py-2 text-xs font-semibold text-[#4285F4]">{row.points}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      : <div>
          <Backdrop onClick={onBack} />
          <div className="no-scrollbar fixed left-1/2 top-1/2 z-50 max-h-[640px] -translate-x-1/2 -translate-y-1/2 transform overflow-x-auto py-10">
            <div className="mx-auto max-w-xl rounded-3xl border bg-white p-4 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex-1 text-center text-lg font-bold">How can I earn SKY Points?</h2>
                <button onClick={onBack} className="ml-4 h-4 w-4">
                  <CloseIcon />
                </button>
              </div>
              <div className="max-w-full px-6">
                <div className="min-w-full">
                  {" "}
                  {/* Container for scrollable content */}
                  {rows.map((row, index) => (
                    <div key={index} className={`${index % 2 === 0 ? "bg-[#E9F5FE]" : "bg-white"} flex`}>
                      <div className="w-1/2 border px-4 py-2 text-xs font-semibold">{row.description}</div>
                      <div className="w-1/2 border px-4 py-2 text-xs font-semibold text-[#4285F4]">{row.points}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default ActivitiesList;
