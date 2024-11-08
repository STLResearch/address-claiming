"use client";
import React, { useState } from "react";
import { GoStack } from "react-icons/go";
import { BsLightning } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi2";
import Button from "../Shared/Button";
import { toast } from "react-toastify";
import BetaUserService from "@/services/BetaUserService";
import UserService from "@/services/UserService";
import useAuth from "@/hooks/useAuth";

const ComingSoon = () => {
  const { subscribeNewsLetters } = UserService();
  const { joinWaitlist } = BetaUserService();
  const { isLoggedIn } = useAuth();

  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);

  const handleJoinWaitlist = async () => {
    setIsJoiningWaitlist(true);
    try {
      if (!isLoggedIn) {
        toast.error(
          "You need to login to enable this feature"
        );
        return;
      }
      const response = await joinWaitlist();
      if (response && response.id) {
        toast.success(
          "You have successfully joined the waitlist, you will receive email notifications on the Auction House updates"
        );
      }
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast.error("Error joining waitlist");
    } finally {
      setIsJoiningWaitlist(false);
    }
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      if (!isLoggedIn) {
        toast.error(
          "You need to login to enable this feature"
        );
        return;
      }
      const response = await subscribeNewsLetters();

      if (response && response.id) {
        toast.success(
          "You have successfully subcribed to our newsletters, you will receive email notifications on updates and new features"
        );
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Error subscribing to newsletter");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="z-20 m-2 flex flex-col gap-4 overflow-hidden rounded-[30px] bg-white p-6 text-sml text-gray-600 shadow-md md:m-8 md:h-[668px] md:w-[518px]">
      <p className="text-center font-bold text-blue-500">
        <span className="text-lg font-bold">Access Coming Soon!</span>
      </p>
      <p>
        Thank you for your interest in the Auction House. Right now, access is exclusively available to our{" "}
        <span className="font-bold text-black">early birds</span> and{" "}
        <span className="font-bold text-black">most active members</span>.
      </p>
      <p className="text-center font-bold text-black">But don’t worry!</p>
      <p>
        We’re working hard to bring this experience to everyone. You’ll be notified as soon as it’s your turn to explore
        and participate in our exclusive auctions.
      </p>
      <p className="font-bold text-black">What can you do in the meantime?</p>
      <p className="flex items-center gap-2">
        <BsLightning className="h-8 w-8 font-bold text-blue-500" />{" "}
        <div>
          <span className="font-bold text-blue-500">Join the Waitlist</span>: Sign up now to secure your spot and
          receive priority access as we open this new feature gradually.
        </div>
      </p>
      <p className="flex items-center gap-2">
        <GoStack className="h-10 w-10 font-bold text-blue-500" />{" "}
        <div>
          <span className="font-bold text-blue-500">Subscribe to Our Newsletter</span>: Stay informed about updates,
          upcoming features, and special announcements by signing up for our newsletter.
        </div>
      </p>
      <p className="flex items-center gap-2">
        <HiOutlineSparkles className="h-10 w-10 font-bold text-blue-500" />{" "}
        <div>
          <span className="font-bold text-blue-500">Engage with the Community</span>: Connect with other auction
          enthusiasts and learn more about what’s coming.
        </div>
      </p>
      <p>Thank you for your patience and enthusiasm — we can’t wait for you to join us!</p>
      <Button isLoading={isJoiningWaitlist} label="Join the Waitlist Now!" onClick={handleJoinWaitlist} />
      <Button isLoading={isSubscribing} secondary label="Subscribe to our Newsletter" onClick={handleSubscribe} />
    </div>
  );
};

export default ComingSoon;
