import { PortfolioTabEnum } from "@/hooks/usePortfolioList";
import { formatDate } from "@/utils";
import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { ArrowLeftIcon, LocationPointIcon } from "../Icons";
import UploadVerifiedDocuments from "./UploadedVerifiedDocuments";
import Image from "next/image";
import { fetchMapboxStaticImage } from "@/utils/getMapboxStaticImage";
import { useAppSelector } from "@/redux/store";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
  Image as Img,
} from "@react-pdf/renderer";
import AirspaceRentalService from "@/services/AirspaceRentalService";
import PropertiesService from "@/services/PropertiesService";
import { PropertyData } from "@/types";

interface airspaceDetailsProps {
  airspace: any;
  onCloseModal: () => void;
  isOffer?: boolean;
  pageNumber?: number;
}

const formatPriceRange = (range) => {
  const [min, max] = range.split("-");
  return `$${min} - $${max}`;
};
const checkFacilities = (facilities) => {
  const trueFacilities: string[] = [];

  for (const [key, value] of Object.entries(facilities)) {
    if (value === true) {
        trueFacilities.push(key);
    }
  }

  return trueFacilities.length > 0
    ? trueFacilities.join(", ")
    : "No facilities available";
};
const Certificate = ({
  user,
  rentalId,
  dateOfRent,
  timeFrame,
  longitude,
  latitude,
  amount,
}) => {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      paddingRight: 30,
      paddingLeft: 30,
      paddingTop: 10,
      paddingBottom: 10,
    },
    title: {
      fontSize: 16,
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 10,
    },
    section: {
      margin: 10,
      paddingVertical: 10,
      fontSize: 12,
      lineHeight: 1.5,
    },
    bold: {
      fontWeight: "bold",
    },
    footer: {
      fontSize: 12,
      marginTop: 30,
      paddingHorizontal: 10,
    },
    image: {
      width: 200,
      height: 60,
      marginVertical: 20,
      margin: "right",
    },
    mb: {
      marginTop: 10,
    },

    mapImage: {
      margin: "auto",
      width: 450,
      height: 300,
      marginVertical: 10,
    },
  });

  return (
    <Document>
      <Page style={styles.page}>
        <Img style={styles.image} src={"/images/logwo.png"} />
        <Text style={styles.title}>Rental Certificate</Text>
        <View style={styles.section}>
          <Text>
            This certifies that {user.name}, with the blockchain address{" "}
            {user.blockchainAddress} has successfully rented an airspace on
            SkyTrade with the following details:
          </Text>
          <Text style={[styles.bold, styles.mb]}></Text>
          <Text style={styles.bold}>Rental ID: {rentalId}</Text>
          <Text style={styles.bold}>Date of Rental: {dateOfRent}</Text>{" "}
          <Text style={styles.bold}>Expiration Date: {timeFrame}</Text>
          <Text style={styles.bold}>Amount: {amount}</Text>
        </View>

        <Img
          style={styles.mapImage}
          src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${longitude},${latitude},14/600x600?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`}
        />

        <View style={styles.section}>
          <Text>
            This rental agreement is valid for the specified date and time frame
            mentioned above. This agreement is subject to SkyTrade&apos;s Rental
            Agreement and Terms of Service.
          </Text>

          <Text>
            If you have any questions or require more information, please
            contact the SkyTrade team and we will reach out at our earliest
            convenience.
          </Text>
        </View>
        <View style={styles.footer}>
          <Text>SkyTrade Team</Text>
          <Text>Website: https://app.sky.trade</Text>
          <Text>E-mail: info@sky.trade</Text>
        </View>
      </Page>
    </Document>
  );
};
const AirspaceDetails = ({
  airspace,
  onCloseModal,
  isOffer,
  pageNumber = 0,
}: airspaceDetailsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { editAirSpaceAddress } = PropertiesService();
  const { getUnverifiedAirspaces } = AirspaceRentalService();
  const [imageUrl, setImagaeUrl] = useState("");
  const [inputValue, setInputValue] = useState(airspace?.address);
  const { user, activePortfolioTab } = useAppSelector((state) => {
    const { user, activePortfolioTab } = state.userReducer;
    return { user, activePortfolioTab };
  });

  const handleGenerateCertificate = async () => {
    const rentalId = airspace?.id;
    const dateOfRent = formatDate(airspace?.metadata?.startTime);
    const timeFrame = formatDate(airspace?.metadata?.endTime);
    const amount = `$${airspace?.currentPrice}`;
    const longitude = airspace?.property?.longitude;
    const latitude = airspace?.property?.latitude;

    const certificate = (
      <Certificate
        user={user}
        longitude={longitude}
        latitude={latitude}
        rentalId={rentalId}
        dateOfRent={dateOfRent}
        timeFrame={timeFrame}
        amount={amount}
      />
    );

    const blob = await pdf(certificate).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };

  const handleEdit = async () => {
    if (!user?.blockchainAddress || inputValue === airspace?.address) return;
    try {
      setIsLoading(true);
      const editResponse = await editAirSpaceAddress({
        address: inputValue,
        propertyId: airspace.id,
      });
      if (editResponse) {
        const airspaceResp = await getUnverifiedAirspaces(pageNumber, 10);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  useEffect(() => {
    const handelAirspaceImage = async () => {
      const url = await fetchMapboxStaticImage(
        airspace?.latitude,
        airspace?.longitude,
      );
      setImagaeUrl(url);
    };
    if (!airspace) return;
    handelAirspaceImage();
  }, [airspace]);
  return (
    <div>
      <div className="fixed left-1/2 top-1/2 z-[500] flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-[15px] bg-white px-[29px] py-[30px] md:z-50 md:h-auto md:w-[689px] md:rounded-[30px]">
        <div
          className="relative -mx-[29px] -mt-[30px] flex items-center gap-[20px] px-[29px] py-[20px] md:mx-0 md:my-0 md:p-0 md:shadow-none"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="h-[12px] w-[16px] md:hidden" onClick={onCloseModal}>
            <ArrowLeftIcon />
          </div>
          <h2 className="text-center text-xl font-medium text-light-black">
            {inputValue}
          </h2>
          <div
            onClick={onCloseModal}
            className="absolute right-0 top-0 ml-auto hidden h-[15px] w-[15px] cursor-pointer md:block"
          >
            <IoCloseSharp className="h-4 w-4 text-black" />
          </div>
        </div>

        <div className="flex max-w-full items-center gap-[10px] rounded-lg border border-deep-blue px-[22px] py-4">
          <div className="h-6 w-6">
            <LocationPointIcon />
          </div>
          <input
            className="w-full max-w-full flex-1 overflow-hidden text-ellipsis whitespace-nowrap border-none text-[14px] font-normal text-light-black outline-none"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
        </div>

        <div>
          <Image
            src={imageUrl}
            alt="Map"
            width={50}
            height={50}
            className="h-[130px] w-[631px] object-cover"
          />
        </div>

        <div className="flex gap-[15px]">
          <p className="text-[14px] font-normal text-light-black">ID:</p>
          <p className="break-all text-[14px] font-normal text-light-grey">
            {airspace?.id}
          </p>
        </div>
        <div className="flex gap-[15px]">
          <p className="text-[14px] font-normal text-light-black">Details:</p>
          <p className="break-all text-[14px] font-normal text-light-grey">
            {airspace?.isRentableAirspace ? "On Rent" : "Not for Rent"}
          </p>
        </div>
        {airspace?.isRentableAirspace && (
          <div className="flex gap-[15px]">
            <p className="text-[14px] font-normal text-light-black">
              Current Rental Price:
            </p>
            <p className="break-all text-[14px] font-normal text-light-grey">
              {formatPriceRange(airspace.transitFee)}
            </p>
          </div>
        )}

        <div className="flex gap-[15px]">
          <p className="text-[14px] font-normal text-light-black">Time Zone:</p>
          <p className="break-all text-[14px] font-normal text-light-grey">
            {airspace?.timezone}
          </p>
        </div>
        <div className="flex gap-[15px]">
          <p className="text-[14px] font-normal text-light-black">
            Extra features:
          </p>
          <p className="break-all text-[14px] font-normal text-light-grey">
            {checkFacilities({
              hasLandingDeck: airspace?.hasLandingDeck,
              hasChargingStation: airspace?.hasChargingStation,
              hasStorageHub: airspace?.hasStorageHub,
            })}
          </p>
        </div>
        <div className="flex gap-[15px]">
          <p className="text-[14px] font-normal text-light-black">
            Availability:
          </p>
          <p className="break-all text-[14px] font-normal text-light-grey">
            Monday to Sunday 9:00 - 21:00
          </p>
        </div>
        {airspace?.metadata?.endTime && (
          <div className="flex gap-[15px]">
            <p className="text-[14px] font-normal text-light-black">
              Expiration Date:
            </p>
            <p className="text-[14px] font-normal text-light-grey">
              {formatDate(airspace?.metadata?.endTime)}
            </p>
          </div>
        )}
        <div>
          <UploadVerifiedDocuments
            requestDocument={airspace?.requestDocument || []}
          />
        </div>

        {isOffer ? (
          <div
            className="-mx-[30px] -mb-[30px] mt-auto flex gap-[20px] px-[14px] py-[16px] md:mx-0 md:mb-0 md:mt-[15px] md:px-0 md:py-0 md:shadow-none"
            style={{ boxShadow: "0px 0px 4.199999809265137px 0px #00000040" }}
          >
            <div className="flex flex-col">
              <p className="text-[12px] font-normal text-[#838187]">
                Offer received
              </p>
              <p className="text-2xl font-bold text-[#222222]"></p>
            </div>
            <div
              onClick={onCloseModal}
              className="flex flex-1 cursor-pointer items-center justify-center rounded-[5px] bg-white px-[20px] py-[10px] text-center text-[#0653EA]"
              style={{ border: "1px solid #0653EA" }}
            >
              Decline
            </div>
            <div
              className="flex flex-1 cursor-pointer items-center justify-center rounded-[5px] bg-[#0653EA] px-[20px] py-[10px] text-center text-white"
              style={{ border: "1px solid #0653EA" }}
            >
              Approve
            </div>
          </div>
        ) : (
          <div className="-mx-[30px] -mb-[30px] mt-auto flex gap-[20px] px-[14px] py-[16px] md:mx-0 md:mb-0 md:mt-[15px] md:px-0 md:py-0">
            <div
              onClick={onCloseModal}
              className="flex flex-1 cursor-pointer items-center justify-center rounded-[5px] bg-white px-[20px] py-[10px] text-center text-[#0653EA]"
              style={{ border: "1px solid #0653EA" }}
            >
              Cancel
            </div>
            <button
              onClick={
                activePortfolioTab === PortfolioTabEnum.RENTED
                  ? handleGenerateCertificate
                  : handleEdit
              }
              className={`flex flex-1 items-center justify-center rounded-[5px] bg-blue-500 px-[20px] py-[10px] text-center text-white`}
            >
              {isLoading ? (
                <>
                  {activePortfolioTab !== PortfolioTabEnum.RENTED &&
                    "Editing..."}
                </>
              ) : (
                <>
                  {activePortfolioTab === PortfolioTabEnum.RENTED
                    ? "Generate Certificate"
                    : "Edit"}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirspaceDetails;
