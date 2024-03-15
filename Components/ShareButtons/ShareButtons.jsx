import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookMessengerShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton
} from "react-share";

import { FacebookIcon, XIcon, LinkedinIcon,FacebookMessengerIcon,TelegramIcon,WhatsappIcon,RedditIcon } from "react-share";
import useOrigin from "@/hooks/useOrigin";
const ShareButtons = ({ url, title, text, hashtags ,setIsSharing}) => {
  const origin = useOrigin();
  return (
    <div className="flex w-full justify-center space-x-10 ">
      <FacebookShareButton  quote={text} url={url}>
        <div onClick={()=>setIsSharing(true)} className=" flex items-center justify-center">
          <FacebookIcon size={24} round />
        </div>
      </FacebookShareButton>
      <TwitterShareButton url={url}>
        <div className=" flex items-center justify-center">
          <XIcon size={24} round />
        </div>
      </TwitterShareButton>
      <LinkedinShareButton url={url}>
        <div className=" flex items-center justify-center">
          <LinkedinIcon size={24} round />
        </div>
      </LinkedinShareButton>
      {/* <FacebookMessengerShareButton url={url} source={url}>
        <div className=" flex items-center justify-center">
          <FacebookMessengerIcon size={24} round />
        </div>
      </FacebookMessengerShareButton> */}
      <TelegramShareButton url={url}>
        <div className=" flex items-center justify-center">
          <TelegramIcon size={24} round />
        </div>
      </TelegramShareButton>
      <WhatsappShareButton url={url}>
        <div className=" flex items-center justify-center">
          <WhatsappIcon size={24} round />
        </div>
      </WhatsappShareButton>
      <RedditShareButton url={url} >
        <div className=" flex items-center justify-center">
          <RedditIcon size={24} round />
        </div>
      </RedditShareButton>
    </div>
  );
};

export default ShareButtons;
