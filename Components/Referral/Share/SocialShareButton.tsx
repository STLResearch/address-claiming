import React, { ReactNode } from "react";

interface SocialShareButtonProps {
  platform: "facebook" | "linkedin" | "twitter";
  onClick: () => void;
  children: ReactNode;
}

const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  platform,
  onClick,
  children,
}) => (
  <div
    onClick={onClick}
    className="py-[14px] px-[13.9px] rounded-lg bg-[#DFF1FF] flex items-center justify-center cursor-pointer"
  >
    <div className="w-5 h-5 flex items-center justify-center">{children}</div>
  </div>
);

export default SocialShareButton;
