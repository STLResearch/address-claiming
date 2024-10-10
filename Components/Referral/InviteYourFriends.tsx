import React, { useState } from "react";
import { ShareIcon } from "../Icons";
import ReferralCodeService from "@/services/ReferralCodeService";
import { toast } from "react-toastify";
interface InviteYourFriendsProps {
  referralCode: string;
}

const InviteYourFriends: React.FC<InviteYourFriendsProps> = ({ referralCode }) => {
  const [friendEmail, setFriendEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { sendReferral } = ReferralCodeService();

  const handleReferUser = async () => {
    try {
      setIsLoading(true);
      if (isLoading) return;
      if (!friendEmail) {
        toast.error("Enter the receiver email");
        return;
      }

      const resp = await sendReferral(friendEmail);
      if (resp) {
        toast.success("Referral sent successfully");
      } else toast.error("Error when sending referral");
    } catch (error) {
      console.error(error);
      toast.error(error.messsage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[15px] px-[51px]">
      <p className="text-xl font-normal text-[#222222]">Invite your friends</p>
      <p className="text-[15px] font-normal text-[#87878D]">
        Insert your friend&apos;s email address and send them invitations to join us.
      </p>
      <div className="relative max-w-[522px]">
        <input
          value={friendEmail}
          onChange={(e) => {
            setFriendEmail(e.target.value);
          }}
          className="w-full rounded-lg py-[16px] pl-[22px] pr-[45px] outline-none"
          style={{ border: "1px solid #87878D" }}
          type="email"
          name="friendEmail"
          id="friendEmail"
          placeholder="email address"
        />
        <div
          onClick={handleReferUser}
          className={`absolute right-[5px] top-1/2 flex h-[41px] w-[38px] -translate-y-1/2 items-center justify-center bg-[#0653EA] ${isLoading ? "cursor-wait" : "cursor-pointer"} rounded-lg`}
        >
          <div className="h-6 w-6">
            <ShareIcon color={"white"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteYourFriends;
