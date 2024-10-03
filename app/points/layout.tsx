import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referral Program",
  description:
    "Refer friends to SkyTrade and earn rewards. Track your referrals, view bonus details, and maximize your benefits.",
};

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
