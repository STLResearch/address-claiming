import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Airspaces",
  description: "Claim and Verify an Airspace",
};

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
