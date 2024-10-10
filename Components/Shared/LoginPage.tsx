"use client";
import Signup from "@/app/auth/page";
import React from "react";

export default function LoginPage() {
  return (
    <div className="fixed flex h-full w-screen items-center justify-center">
      <div className="flex h-screen w-[100%] items-center justify-center overflow-clip md:h-[100%] md:rounded-xl">
        <Signup />
      </div>
    </div>
  );
}
