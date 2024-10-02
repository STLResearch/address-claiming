// app/rent/layout.tsx (server-side, no "use client")
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent Airspace",
  description:
    "Browse available airspace for rent, view pricing, and manage your rental agreements on the SkyTrade Rent page.",
};

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
