"use client";

import React, { Fragment, SetStateAction, useState } from "react";
import AirspaceRentalService from "@/services/AirspaceRentalService";
import PropertiesService from "@/services/PropertiesService";
import { PropertyData, RequestDocument } from "@/types";
import { formatDate } from "@/utils";

import { ArrowLeftIcon, CloseIcon, LocationPointIcon } from "../Icons";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
  Image,
} from "@react-pdf/renderer";
import { useAppSelector } from "@/redux/store";
import { PortfolioTabEnum } from "@/hooks/usePortfolioList";
import UploadVerifiedDocuments from "./UploadedVerifiedDocuments";
import Backdrop from "../Backdrop";

interface ModalProps {
  airspace: any;
  onCloseModal: () => void;
  isOffer?: boolean;
  pageNumber?: number;
  setAirspaceList: (value: SetStateAction<PropertyData[]>) => void;
  requestDocument: RequestDocument[];
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

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
        <Image style={styles.image} src={"/images/logwo.png"} />
        <Text style={styles.title}>Rental Certificate</Text>
        <View style={styles.section}>
          <Text>
            This certifies that {user.name}, with the blockchain address{" "}
            {user.blockchainAddress} has successfully rented an air rights on
            SkyTrade with the following details:
          </Text>
          <Text style={[styles.bold, styles.mb]}></Text>
          <Text style={styles.bold}>Rental ID: {rentalId}</Text>
          <Text style={styles.bold}>Date of Rental: {dateOfRent}</Text>{" "}
          <Text style={styles.bold}>Expiration Date: {timeFrame}</Text>
          <Text style={styles.bold}>Amount: {amount}</Text>
        </View>

        <Image
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

const Modal = ({
  airspace,
  onCloseModal,
  isOffer,
  pageNumber = 0,
  setAirspaceList,
  requestDocument,
  setShowModal,
}: ModalProps) => {
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

  const [inputValue, setInputValue] = useState(airspace?.address);
  const { editAirSpaceAddress } = PropertiesService();
  const [isLoading, setIsLoading] = useState(false);
  const { getUnverifiedAirspaces } = AirspaceRentalService();

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
        setAirspaceList(airspaceResp.items);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const submittedDocumentsCount = requestDocument.filter((doc) => doc.status === 'SUBMITTED').length

  return (
    <Fragment>
      <Backdrop />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white py-[30px] md:rounded-[30px] px-[29px] w-full h-full md:h-auto md:w-[689px] z-[500] md:z-50 flex flex-col gap-[15px]">
        <div
          className="relative flex items-center gap-[20px] md:p-0 py-[20px] px-[29px] -mx-[29px] -mt-[30px] md:my-0 md:mx-0 md:shadow-none"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="w-[16px] h-[12px] md:hidden" onClick={onCloseModal}>
            <ArrowLeftIcon />
          </div>
          <h2 className="text-light-black text-center font-medium text-xl">
            {inputValue}
          </h2>
          <div
            onClick={onCloseModal}
            className="hidden md:block absolute top-0 right-0 w-[15px] h-[15px] ml-auto cursor-pointer"
          >
            <CloseIcon />
          </div>
        </div>

        <div className="flex items-center gap-[10px] py-4 px-[22px] rounded-lg border border-deep-blue max-w-full">
          <div className="w-6 h-6">
            <LocationPointIcon />
          </div>
          <input
            className="font-normal text-light-black text-[14px] flex-1 border-none outline-none whitespace-nowrap overflow-hidden text-ellipsis w-full max-w-full"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
        </div>

        <div className="flex gap-[15px]">
          <p className="text-[14px] font-normal text-light-black">ID:</p>
          <p className="text-[14px] font-normal text-light-grey break-all">
            {airspace?.id}
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
        {
          requestDocument && requestDocument?.length > 0 && submittedDocumentsCount > 0 &&
          
        <div>
          <UploadVerifiedDocuments requestDocument={requestDocument} />
        </div>
        }

        {isOffer ? (
          <div
            className="flex gap-[20px] md:mt-[15px] mt-auto py-[16px] md:py-0 -mx-[30px] md:mx-0 md:mb-0 -mb-[30px] px-[14px] md:px-0 md:shadow-none"
            style={{ boxShadow: "0px 0px 4.199999809265137px 0px #00000040" }}
          >
            <div className="flex flex-col">
              <p className="font-normal text-[12px] text-[#838187]">
                Offer received
              </p>
              <p className="font-bold text-2xl text-[#222222]"></p>
            </div>
            <div
              onClick={onCloseModal}
              className="flex-1 text-[#0653EA] rounded-[5px] bg-white text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center"
              style={{ border: "1px solid #0653EA" }}
            >
              Decline
            </div>
            <div
              className="flex-1 text-white rounded-[5px] bg-[#0653EA] text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center"
              style={{ border: "1px solid #0653EA" }}
            >
              Approve
            </div>
          </div>
        ) : (
          <div className="flex gap-[20px] md:mt-[15px] mt-auto -mx-[30px] md:mx-0 md:mb-0 -mb-[30px] px-[14px] md:px-0 py-[16px] md:py-0">
            <div
              onClick={() => {
                setShowModal(false);
              }}
              className="flex-1 text-[#0653EA] rounded-[5px] bg-white text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center"
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
              className={`bg-blue-500 flex-1 text-white rounded-[5px]  text-center py-[10px] px-[20px] flex items-center justify-center`}
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
    </Fragment>
  );
};

export default Modal;
