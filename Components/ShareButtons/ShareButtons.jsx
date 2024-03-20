import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton
} from "react-share";

import { FacebookIcon, XIcon, LinkedinIcon,TelegramIcon,WhatsappIcon,RedditIcon } from "react-share";
const ShareButtons = ({ url,  text ,setIsSharing}) => {
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
