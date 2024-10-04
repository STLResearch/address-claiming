import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Profile Informartion",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
