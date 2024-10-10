import Signup from "@/pages/auth/join";
import React from "react";

export default function LoginPage() {
  return (
    <div className="fixed flex h-full w-screen items-center justify-center">
      <div className="flex h-[100%] w-[100%] items-center justify-center overflow-clip rounded-xl">
        <Signup />
      </div>
    </div>
  );
}
