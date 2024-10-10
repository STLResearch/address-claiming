import React, { ReactNode } from "react";

interface SocialShareButtonProps {
  platform: "facebook" | "linkedin" | "twitter";
  onClick: () => void;
  children: ReactNode;
}

const SocialShareButton: React.FC<SocialShareButtonProps> = ({ platform, onClick, children }) => (
  <div
    onClick={onClick}
    className="flex cursor-pointer items-center justify-center rounded-lg bg-[#DFF1FF] px-[13.9px] py-[14px]"
  >
    <div className="flex h-5 w-5 items-center justify-center">{children}</div>
  </div>
);

export default SocialShareButton;
