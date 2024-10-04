import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funds",
  description:
    "Deposit, withdraw, and manage your funds effortlessly on the SkyTrade Funds page. Keep track of your transactions and balances.",
};

export default function FundsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
