import { CloseIcon, CloseIconBlack, LocationPointIcon } from "@/Components/Icons";
import useAuth from "@/hooks/useAuth";
import { Web3authContext } from "@/providers/web3authProvider";
import AirspaceRentalService from "@/services/AirspaceRentalService";
import { Connection, VersionedTransaction, PublicKey } from "@solana/web3.js";
import React, { useContext, useEffect, useState } from "react";
import SuccessModal from "../SuccessModal";
import { getTokenBalance } from "@/utils/apiUtils/apiFunctions";
import { validateRental } from "@/utils/rent/rentalValidation";
import { handleMintResponse } from "@/utils/rent/mintResponseHandler";
import { executeTransaction } from "@/utils/rent/transactionExecutor";
import { PropertyData } from "@/types";
import { toast } from "react-toastify";
import Backdrop from "@/Components/Backdrop";
import { removePubLicUserDetailsFromLocalStorageOnClose } from "@/helpers/localstorage";
import { useMobile } from "@/hooks/useMobile";
import LoadingButton from "@/Components/LoadingButton/LoadingButton";
import { getMapboxStaticImage } from "@/utils/getMapboxStaticImage";
import { ArrowLeftIcon } from "@/Components/Icons";
import Carousel from "@/Components/Shared/Carousel";
import { createNonceIx } from "../../../helpers/solanaHelper";
interface RentPreviewProps {
  setShowRentPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRentDetail: React.Dispatch<React.SetStateAction<boolean>>;
  rentData: PropertyData | null | undefined;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  date: any;
}
const RentPreview: React.FC<RentPreviewProps> = ({
  setShowRentPreview,
  setShowRentDetail,
  rentData,
  setIsLoading,
  isLoading,
  date,
}) => {
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const { isMobile } = useMobile();
  const [finalAns, setFinalAns] = useState<
    { status: string; message?: string | undefined; tokenId?: string } | null | undefined
  >();
  const { user, redirectIfUnauthenticated, setAndClearOtherPublicRouteData } = useAuth();
  const { getNonceAccountEntry, createMintRentalToken, executeMintRentalToken } = AirspaceRentalService();
  const { provider } = useContext(Web3authContext);

  localStorage.setItem("rentData", JSON.stringify(rentData));

  useEffect(() => {
    if (user) {
      getTokenBalance(user, setTokenBalance);
    }
  }, [user]);
  const handleRentAirspace = async () => {
    try {
      const isRedirecting = redirectIfUnauthenticated();
      const connection = new Connection(process.env.NEXT_PUBLIC_RPC_TARGET as string);
      if (isRedirecting) {
        setAndClearOtherPublicRouteData("rentData", rentData);
        return;
      }
      const currentDate = new Date();
      const startDate = new Date(date.toString());
      const endDate = new Date(startDate.getTime() + 30 * 60000);

      if (!rentData?.price) {
        toast.error("Price for airspace not found");
        return;
      }

      if (
        !validateRental(rentData?.price, currentDate, startDate, endDate, tokenBalance, setFinalAns, setShowSuccess)
      ) {
        return;
      }

      setIsLoading(true);
      if (rentData?.layers) {
        const nonceAccountEntry = await getNonceAccountEntry();
        if (!nonceAccountEntry) {
          toast.error("something went wrong!");
          return;
        }
        const nonceAccount = await createNonceIx(connection, new PublicKey(nonceAccountEntry.publicKey));

        const postData = {
          callerAddress: user?.blockchainAddress,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          landAssetIds: [rentData.layers[0].tokenId],
          nonceAccount,
          nonceAccountEntry,
        };

        const createMintResponse = await createMintRentalToken({ postData });
        let mintResponse;
        if (createMintResponse) {
          mintResponse = await handleMintResponse(createMintResponse, setIsLoading, setShowSuccess, setFinalAns);
        } else {
          toast.error("some thing went wrong!");
          return;
        }
        if (!mintResponse) return;
        const transaction = VersionedTransaction.deserialize(new Uint8Array(Buffer.from(createMintResponse, "base64")));
        const txString = await executeTransaction(transaction, provider);

        if (!txString) return;
        const postExecuteMintData = {
          transaction: txString,
          landAssetIds: [rentData?.layers[0].tokenId],
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        };

        const executionResponse = await executeMintRentalToken({
          postData: { ...postExecuteMintData },
        });

        if (executionResponse && executionResponse.errorMessage) {
          toast.error(executionResponse.errorMessage);
          return;
        }
        if (executionResponse) {
          if (executionResponse.data && executionResponse.data.status === "success") {
            setFinalAns({
              status: "Rent Successful",
              message: executionResponse.data.message,
            });
          } else if (executionResponse.data) {
            setFinalAns({
              status: "Rent failed",
              message: executionResponse.data.message,
            });
          }
          setShowSuccess(true);
        }
      } else {
        toast.error("something went wrong!");
      }
      localStorage.removeItem("rentData");
    } catch (error) {
      console.error("error here", error);
      setFinalAns({ status: "Rent failed", message: error.message });
      localStorage.removeItem("rentData");
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <SuccessModal
        setShowSuccess={setShowSuccess}
        finalAns={finalAns}
        rentData={rentData}
        setShowRentDetail={setShowRentDetail}
      />
    );
  }

  const formattedDate = date.format("DD MMMM YYYY");
  const formattedTimeStart = date.format("H:mm");
  const formattedTimeEnd = date.add(30, "minute").format("H:mm");
  const formattedTime = `${formattedTimeStart} - ${formattedTimeEnd}`;

  const images = [
    { image_url: "/images/imagetest1.jpg" },
    { image_url: "/images/imagetest2.jpg" },
    { image_url: "/images/imagetest3.jpg" },
  ];
  if(rentData){
    const imageUrl = getMapboxStaticImage(rentData.latitude, rentData.longitude);
    images.unshift({ image_url: imageUrl });
  }
  return (
    <div>
      {!isMobile && <Backdrop />}
      <div
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926", zIndex: 100 }}
        className="fixed bottom-[74px] left-0 z-[100] flex h-[415px] w-full touch-manipulation flex-col gap-[15px] overflow-auto rounded-t-[30px] bg-white pt-[30px] sm:left-1/2 sm:top-1/2 sm:h-[406px] sm:overflow-hidden sm:pb-[30px] md:z-40 md:w-[689px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[30px]"
      >
        <div className="flex flex-col gap-[15px] px-[30px]">
          <div className="relative -mx-[29px] -mt-[30px] flex touch-manipulation items-center gap-[20px] px-[29px] pt-[20px] md:mx-0 md:my-0 md:p-0 md:shadow-none">
            <div
              onClick={() => {
                setShowRentPreview(false);
                setShowRentDetail(true);
              }}
              className="absolute right-3 top-1 ml-auto hidden h-[15px] w-[15px] cursor-pointer sm:block"
            >
              <CloseIconBlack />
            </div>
            <div
              className="hidden h-[12px] w-[16px] cursor-pointer sm:block"
              onClick={() => {
                setShowRentPreview(false);
                setShowRentDetail(true);
              }}
            >
              <ArrowLeftIcon />
            </div>
            <div
              onClick={() => {
                setShowRentPreview(false);
                removePubLicUserDetailsFromLocalStorageOnClose("rentData");
              }}
              className="flex w-full flex-col items-center justify-center gap-4 sm:gap-0"
            >
              <div className="block h-2 w-16 animate-pulse rounded-3xl bg-light-grey sm:hidden sm:h-0"></div>
              {/* <h4>{registeredAddress?.length} Airspaces available</h4> */}
              <div className="flex w-full items-center justify-center">
                <h2 className="text-center text-xl font-medium leading-[30px] text-[#222222]">Rental Preview</h2>
              </div>
            </div>

            <div
              onClick={() => {
                setShowRentPreview(false);
                removePubLicUserDetailsFromLocalStorageOnClose("rentData");
              }}
              className="absolute right-0 top-0 ml-auto hidden h-[15px] w-[15px] cursor-pointer md:block"
            >
              <CloseIcon />
            </div>
          </div>
          <div className="flex touch-manipulation items-center gap-[10px] rounded-lg border border-[#4285F4] p-[11px]">
            <div className="flex h-full w-6 items-center">
              <LocationPointIcon />
            </div>
            <p className="flex flex-1 items-center text-[14px] font-normal text-[#222222]">
              {rentData ? rentData.address : ""}
            </p>
          </div>
          <div>
            <div className="relative h-[130px] w-full">
              <Carousel images={images} />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-y-[15px] text-[14px] leading-[21px] text-light-black">
              <div className="flex">
                <div>ID::</div>
                <div className="pl-[15px] text-light-grey">{rentData?.id}</div>
              </div>
            </div>
          </div>
          <hr className="hidden sm:flex" />
        </div>

        <div className="flex touch-manipulation items-center justify-between gap-[20px] px-[29px] py-[20px] text-[14px] shadow-[0px_0px_4.2px_0px_rgba(0,0,0,0.25)] sm:py-0 sm:shadow-none">
          <div className="flex items-center justify-center">
            <div className="pr-[10px] text-light-black">
              <div className="text-2xl font-bold leading-9">&#36;{rentData?.price}</div>
            </div>
            <div className="border-l-[1px] border-[#000] border-opacity-20 pl-[10px]">
              <p className="text-[11px] leading-[16.5px] text-light-dark">{formattedDate}</p>
              <p className="text-[11px] leading-[16.5px] text-light-dark">{formattedTime}</p>
            </div>
          </div>
          <LoadingButton
            onClick={handleRentAirspace}
            isLoading={isLoading}
            className="flex w-1/2 cursor-pointer touch-manipulation items-center justify-center rounded-[5px] bg-[#0653EA] px-[22px] py-[10px] text-center text-white"
          >
            {isMobile ? "Confirm Rental" : "Confirm Rental now"}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};
export default RentPreview;
