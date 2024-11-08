import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join",
  description: "Create your SkyTrade account to manage your air rights, funds, and referrals with ease.",
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
