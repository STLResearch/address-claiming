import useOrigin from "@/hooks/useOrigin";
import ReferralCodeService from "@/services/ReferralCodeService";
import { useRouter } from "next/navigation";
import { useEffect, useState, MouseEvent, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { FacebookIcon, LinkedInIcon, XIcon } from "../../Shared/Icons";
import CopyableInput from "./CopyableInput";
import SocialShareButton from "./SocialShareButton";
import { User } from "@/types";
import useAuth from "@/hooks/useAuth";

interface ShareProps {
  referralCode: string;
  isLoading: boolean;
}

const Share: React.FC<ShareProps> = ({
  referralCode,
  isLoading,
}) => {

  const { user } = useAuth();
  const [isCopied, setIsCopied] = useState({ code: false, link: false });
  const [temporalReferralCode, setTemporalReferralCode] =
    useState(referralCode);
  const { updateReferral } = ReferralCodeService();
  const origin = useOrigin();
  const router = useRouter();

  useEffect(() => {
    if (!isCopied.code) return;
    let timeoutId: NodeJS.Timeout;
    (() => {
      timeoutId = setTimeout(() => {
        setIsCopied((prev) => ({ ...prev, code: false }));
      }, 2000);
    })();

    return () => timeoutId && clearTimeout(timeoutId);
  }, [isCopied.code, user]);

  useEffect(() => {
    if (!isCopied.link) return;
    let timeoutId: NodeJS.Timeout;
    (() => {
      timeoutId = setTimeout(() => {
        setIsCopied((prev) => ({ ...prev, link: false }));
      }, 2000);
    })();

    return () => timeoutId && clearTimeout(timeoutId);
  }, [isCopied.link]);

  useEffect(() => {
    setTemporalReferralCode(referralCode);
  }, [referralCode, user]);

  const handleCopy = (e: MouseEvent, text: string, isCode: boolean) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    setIsCopied((prev) => ({
      code: isCode ? true : prev.code,
      link: !isCode ? true : prev.link,
    }));
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTemporalReferralCode(e.target.value.toUpperCase());
  };

  const handleUpdateReferralCode = async () => {
    if (temporalReferralCode.length !== 6) {
      toast.error("Referral code must be six(6) characters");
      return;
    }
    try {
      if (!user) {
        toast.error("User not logged");
        return;
      }
      const {
        ownedReferralCode: { id },
      } = user;
      const postData = { code: temporalReferralCode };
      const resp = await updateReferral({ postData });
      if (resp?.codeChanged) {
        toast.success("Referral code updated successfully");
        const storedUser = JSON.parse(localStorage.getItem("user")!);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            ownedReferralCode: {
              id,
              code: temporalReferralCode,
              codeChanged: true,
            },
          })
        );
        router.refresh();
      } else if (resp && resp.errorMessage) {
        toast.error(resp.errorMessage)
      }
      else toast.error("Error when updating referral")
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      setTemporalReferralCode(referralCode);
    }
  };

  const canCopy = referralCode === temporalReferralCode;
  const canChangeCode = !canCopy && !user?.ownedReferralCode?.codeChanged;

  return (
    <div className="flex flex-wrap gap-8">
      <div className="flex flex-col gap-[15px] px-[51px]">
        <p className="text-[#222222] text-xl font-normal">
          Share the referral link or code
        </p>
        <p className="text-[#87878D] text-[15px] font-normal">
          You can also share your referral link or code by copying and sending
          it or sharing it on your social media. You can define your code once
          by entering your preferred value and pressing enter.
        </p>
        <div className="flex flex-wrap gap-[21px]">
          <div className="flex gap-[9px] flex-wrap justify-evenly">
            <CopyableInput
              isLoading={isLoading}
              value={temporalReferralCode}
              isCopied={isCopied.code}
              readOnly={user?.ownedReferralCode?.codeChanged}
              canCopy={canCopy}
              canChangeCode={canChangeCode}
              handleCopy={(e) => handleCopy(e, referralCode, true)}
              handleOnChange={handleOnChange}
              handleUpdateReferralCode={handleUpdateReferralCode}
            />
          </div>
          <div className="flex gap-[9px] flex-wrap justify-between">
            <CopyableInput
              isLoading={isLoading}
              isReferralLink={false}
              value={`${origin}/r/${referralCode}`}
              canCopy={canCopy}
              isCopied={isCopied.link}
              handleCopy={(e) =>
                handleCopy(e, `${origin}/r/${referralCode}`, false)
              }
              disabled={true}
            />
            <SocialShareButton
              platform="facebook"
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${origin}/r/${referralCode}`,
                  "_blank"
                )
              }
            >
              <FacebookIcon />
            </SocialShareButton>
            <SocialShareButton
              platform="linkedin"
              onClick={() =>
                window.open(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${origin}/r/${referralCode}`,
                  "_blank"
                )
              }
            >
              <LinkedInIcon />
            </SocialShareButton>
            <SocialShareButton
              platform="twitter"
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?text=${origin}/r/${referralCode}`,
                  "_blank"
                )
              }
            >
              <XIcon />
            </SocialShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;