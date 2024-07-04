import { useContext, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import AirspaceRentalService from "@/services/AirspaceRentalService";
import { AuctionSubmitI, PropertyData } from "@/types";
import { Web3authContext } from "@/providers/web3authProvider";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setAirspaceList } from "@/redux/slices/userSlice";
import { VersionedTransaction } from "@solana/web3.js";
import { executeTransaction } from "@/utils/rent/transactionExecutor";
import MarketplaceService from "@/services/MarketplaceService";

interface SelectedPropertyI {
  assetId: string;
  propertyId: number;
  name: string;
  minSalePrice: number;
  endDate: Date | null;
}

const useAuction = () => {
  const { airspaceList } = useAppSelector((state) => {
    const { airspaceList } = state.userReducer;
    return { airspaceList };
  });

  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const { user } = useAuth();
  const { web3auth } = useContext(Web3authContext);

  const {
    getPropertiesByUserAddress,
    getUnverifiedAirspaces,
    getRejectedAirspaces,
  } = AirspaceRentalService();

  useEffect(() => {
    (async () => {
      try {
        if (web3auth && web3auth?.status !== "connected") return;

        setLoading(true);
        const assetId = airspaceList.length > 0 ? airspaceList.at(-1)?.id : "";

        const airspaces = await getPropertiesByUserAddress(
          user?.blockchainAddress,
          "landToken",
          10,
          String(assetId)
        );
        console.log({ airspaces });

        if (airspaces.length < 10) {
          setHasMore(false);
        }

        if (pageNumber === 1) {
          dispatch(setAirspaceList(airspaces));
        } else {
          let updatedAirspaces = [...airspaceList, ...airspaces];
          dispatch(setAirspaceList(updatedAirspaces));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [web3auth?.status, pageNumber]);

  const handleNextPage = () => {
    if (!hasMore) return;
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const handlePrevPage = () => {
    if (pageNumber === 1) return;
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
  };

  const [selectedItems, setSelectedItems] = useState<SelectedPropertyI[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessfull, setIsSuccessfull] = useState(false);
  const [responseStatus, setResponseStatus] = useState<"SUCCESS" | "FAIL">(
    "FAIL"
  );
  const [txHash, setTxHash] = useState<string | null | undefined>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null); // Track the selected item
  const { createAuction, submitAuction } = MarketplaceService();
  const { provider } = useContext(Web3authContext);

  const handleSelectItem = (item: PropertyData) => {
    console.log({ item });
    setSelectedItems((prevSelectedItems) => {
      const isItemSelected = prevSelectedItems.find(
        (selectedItem) => selectedItem.propertyId === item.propertyId
      );

      let updatedItems;
      if (isItemSelected) {
        updatedItems = prevSelectedItems.filter(
          (selectedItem) => selectedItem.propertyId !== item.propertyId
        );
        setSelectedItemId(null); // Deselect the item
      } else {
        updatedItems = [
          ...prevSelectedItems,
          {
            assetId: item.id,
            propertyId: item.propertyId,
            name: item.address,
            minSalePrice: 0,
            endDate: null,
          },
        ];
        // @ts-ignore
        setSelectedItemId(item?.propertyId); // Select the item
      }

      return updatedItems;
    });
  };

  const handleUpdateItem = (
    id: number,
    minSalePrice: number,
    endDate: Date | null
  ) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedItems = prevSelectedItems.map((selectedItem) =>
        selectedItem.propertyId === id
          ? { ...selectedItem, minSalePrice, endDate }
          : selectedItem
      );
      console.log("Updated Items:", updatedItems);
      return updatedItems;
    });
  };

  const handleAddProperties = async () => {
    console.log({ selectedItems });

    setIsProcessing(true);
    console.log("Selected Items:", selectedItems);
    try {
      const postData = {
        propertyId: selectedItems[0].propertyId,
        listingType: "Auction",
        isActive: true,
        listingPrice: selectedItems[0].minSalePrice,
        endDate: selectedItems[0].endDate,
      };
      const response = await createAuction({ postData });
      if (response && response.tx) {
        const transaction1 = VersionedTransaction.deserialize(
          new Uint8Array(Buffer.from(response.tx[0], "base64"))
        );

        const transaction2 = VersionedTransaction.deserialize(
          new Uint8Array(Buffer.from(response.tx[1], "base64"))
        );

        const tx1 = await executeTransaction(transaction1, provider);
        const tx2 = await executeTransaction(transaction2, provider);

        if (tx1 && tx2) {
          console.log({ tx1, tx2 });
          console.log({ selectedItems });

          const postData: AuctionSubmitI = {
            signatures: [tx1, tx2],
            assetId: selectedItems[0].assetId,
          };

          console.log({ postData });

          const result = await submitAuction({ postData });

          if (result && result.txid.length > 0) {
            console.log({ result });
            setTxHash(result.txid[0]);
            setIsSuccessfull(true);
            setResponseStatus("SUCCESS");
            setSelectedItems([]);
            setSelectedItemId(null);
          }
        }
      } else {
        setIsSuccessfull(false);
        setIsProcessing(false);
        setResponseStatus("FAIL");
      }
    } catch (error) {
      console.log({ error });
      setIsProcessing(false);
      setResponseStatus("FAIL");
    }
  };

  return {
    loading,
    airspaceList,
    pageNumber,
    handlePrevPage,
    handleNextPage,
    hasMore,
    handleSelectItem,
    handleAddProperties,
    handleUpdateItem,
    txHash,
    isProcessing,
    setIsProcessing,
    isSuccessfull,
    responseStatus,
    selectedItemId,
    selectedItems,
  };
};

export default useAuction;
