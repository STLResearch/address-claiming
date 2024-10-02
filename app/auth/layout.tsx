// app/rent/layout.tsx (server-side, no "use client")
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Securely access your SkyTrade account. Manage your airspace, funds, and referrals with ease.",
};

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
