import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Manage your Airspaces, Bids and Offers",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
