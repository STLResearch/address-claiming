import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
} from "react-share";

import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
} from "react-share";

interface ShareButtonProps {
  url: string;
  setIsSharing: React.Dispatch<React.SetStateAction<boolean>>;
  platform: string;
}

const SocialShareButton: React.FC<ShareButtonProps> = ({
  url,
  setIsSharing,
  platform,
}) => {
  let ShareComponent;
  let IconComponent;

  switch (platform) {
    case "facebook":
      ShareComponent = FacebookShareButton;
      IconComponent = FacebookIcon;
      break;
    case "twitter":
      ShareComponent = TwitterShareButton;
      IconComponent = TwitterIcon;
      break;
    case "linkedin":
      ShareComponent = LinkedinShareButton;
      IconComponent = LinkedinIcon;
      break;
    case "telegram":
      ShareComponent = TelegramShareButton;
      IconComponent = TelegramIcon;
      break;
    case "whatsapp":
      ShareComponent = WhatsappShareButton;
      IconComponent = WhatsappIcon;
      break;
    case "reddit":
      ShareComponent = RedditShareButton;
      IconComponent = RedditIcon;
      break;
    default:
      return null;
  }

  const handleShareButtonClick = () => {
    setIsSharing(true);
  };

  return (
    <ShareComponent url={url}>
      <div
        onClick={handleShareButtonClick}
        className="flex items-center justify-center"
      >
        <IconComponent size={24} round />
      </div>
    </ShareComponent>
  );
};

interface ShareButtonsProps {
  url: string;
  setIsSharing: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, setIsSharing }) => {
  return (
    <div className="flex w-full justify-center space-x-10">
      <SocialShareButton
        url={url}
        setIsSharing={setIsSharing}
        platform="facebook"
      />
      <SocialShareButton
        url={url}
        setIsSharing={setIsSharing}
        platform="twitter"
      />
      <SocialShareButton
        url={url}
        setIsSharing={setIsSharing}
        platform="linkedin"
      />
      <SocialShareButton
        url={url}
        setIsSharing={setIsSharing}
        platform="telegram"
      />
      <SocialShareButton
        url={url}
        setIsSharing={setIsSharing}
        platform="whatsapp"
      />
      <SocialShareButton
        url={url}
        setIsSharing={setIsSharing}
        platform="reddit"
      />
    </div>
  );
};

export default ShareButtons;
