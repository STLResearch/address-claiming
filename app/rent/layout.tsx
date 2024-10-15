import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent Airspace",
  description:
    "Browse available air rights for rent, view pricing, and manage your rental agreements on the SkyTrade Rent page.",
};

export default function RentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
