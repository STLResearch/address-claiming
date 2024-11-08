import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Air Rights",
  description: "Claim and Verify an Air Right",
};

export default function AirspacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
