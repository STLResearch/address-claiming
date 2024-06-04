import useOrigin from "@/hooks/useOrigin";
import { useState } from "react";
import { ShareIcon } from "../Icons";
interface InviteYourFriendsProps {
    referralCode:string;
  }
const InviteYourFriends:React.FC<InviteYourFriendsProps> = ({ referralCode }) => {
    const [friendEmail, setFriendEmail] = useState("");
    const origin = useOrigin();
  
    return (
      <div className="flex flex-col gap-[15px] px-[51px]">
        <p className="text-[#222222] text-xl font-normal">Invite your friends</p>
        <p className="text-light-grey text-[15px] font-normal">
          Insert your friend's email address and send them invitations to join us.
        </p>
        <div className="relative max-w-[522px]">
          <input
            value={friendEmail}
            onChange={(e) => {
              setFriendEmail(e.target.value);
            }}
            className="w-full rounded-lg py-[16px] pr-[45px] pl-[22px] outline-none border border-light-grey"
            type="email"
            name="friendEmail"
            id="friendEmail"
            placeholder="email address"
          />
          <div className="absolute right-[5px] top-1/2 -translate-y-1/2 w-[38px] h-[41px] bg-[#0653EA] flex items-center justify-center cursor-pointer rounded-lg">
            <a
              href={`mailto:${friendEmail}?body=${origin}/auth/r/${referralCode}`}
              target="_blank"
            >
              <div className="w-[15px] h-[15px] ">
                <ShareIcon color={"white"} />
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  };

  export default InviteYourFriends;