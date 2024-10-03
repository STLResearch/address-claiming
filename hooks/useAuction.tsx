import { useContext, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { PropertyData } from "@/types";
import { Web3authContext } from "@/providers/web3authProvider";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setAirspaceList, setAssetId, setIsTriggerRefresh, setUserUSDWalletBalance } from "@/redux/slices/userSlice";
import { LAMPORTS_PER_SOL, VersionedTransaction } from "@solana/web3.js";

import { executeTransaction } from "@/utils/rent/transactionExecutor";
import MarketplaceService from "@/services/MarketplaceSercive";
import { toast } from "react-toastify";
import axios from "axios";
import { convertDate } from "@/utils";

interface SelectedPropertyI {
  assetId: string;
  propertyId: number;
  name: string;
  minSalePrice: number;
  endDate: Date | null;
}

export enum TransactionStatusEnum {
  PENDING,
  SUCCESS,
  FAILED,
}

const useAuction = () => {
  const { airspaceList, isTriggerRefresh, userSolBalance, userUSDWalletBalance, endDate, minSalePrice, assetId } =
    useAppSelector((state) => {
      const { airspaceList, isTriggerRefresh, userSolBalance, userUSDWalletBalance, endDate, minSalePrice, assetId } =
        state.userReducer;
      return {
        airspaceList,
        isTriggerRefresh,
        userSolBalance,
        userUSDWalletBalance,
        endDate,
        minSalePrice,
        assetId,
      };
    });
  const { getAuctions } = MarketplaceService();

  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<SelectedPropertyI[]>([]);
  const [airspaceAddress, setAirspaceAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(TransactionStatusEnum.PENDING);
  const [responseStatus, setResponseStatus] = useState<"SUCCESS" | "FAIL">("FAIL");
  const [txHash, setTxHash] = useState<string | null | undefined>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const { createAuction, submitAuction, getAuctionableAirspaces } = MarketplaceService();
  const { provider } = useContext(Web3authContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const { user } = useAuth();
  const { web3auth } = useContext(Web3authContext);

  useEffect(() => {
    (async () => {
      try {
        if (web3auth && web3auth?.status !== "connected") return;

        setLoading(true);
        const assetId = airspaceList.length > 0 ? airspaceList[airspaceList.length - 1]?.id : "";

        const airspaces = await getAuctionableAirspaces(pageNumber);

        if (airspaces.length < 10) {
          setHasMore(false);
        }

        dispatch(setAirspaceList(airspaces || []));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [pageNumber, isTriggerRefresh]);

  useEffect(() => {
    if (user && user.blockchainAddress) {
      const interval = setInterval(async () => {
        try {
          const response = await axios.post(String(process.env.NEXT_PUBLIC_SOLANA_API), {
            jsonrpc: "2.0",
            id: 1,
            method: "getTokenAccountsByOwner",
            params: [
              user.blockchainAddress,
              {
                mint: process.env.NEXT_PUBLIC_MINT_ADDRESS,
              },
              {
                encoding: "jsonParsed",
              },
            ],
          });
          const value = response.data.result.value;
          if (value.length < 1)
            dispatch(
              setUserUSDWalletBalance({
                amount: "0",
                isLoading: false,
              })
            );
          else
            dispatch(
              setUserUSDWalletBalance({
                amount: value[0].account.data.parsed.info.tokenAmount.uiAmountString,
                isLoading: false,
              })
            );
        } catch (error) {
          console.error(error);
          dispatch(
            setUserUSDWalletBalance({
              amount: userUSDWalletBalance.amount,
              isLoading: false,
            })
          );
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const handleNextPage = () => {
    if (!hasMore) return;
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const handlePrevPage = () => {
    if (pageNumber === 1) return;
    setHasMore(true);
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
  };

  const handleSelectItem = (item: PropertyData) => {
    //@ts-ignore
    dispatch(setAssetId(item?.layers[0].tokenId));
    setAirspaceAddress(item?.address);

    setSelectedItems((prevSelectedItems) => {
      const isItemSelected = prevSelectedItems.find((selectedItem) => selectedItem.propertyId === item.id);

      let updatedItems;
      if (isItemSelected) {
        updatedItems = prevSelectedItems.filter((selectedItem) => selectedItem.propertyId !== item.id);

        setSelectedItemId(null);
      } else {
        updatedItems = [
          ...prevSelectedItems,
          {
            propertyId: item.id,
            name: item.address,
            minSalePrice: 0,
            endDate: null,
          },
        ];

        // @ts-ignore
        setSelectedItemId(item?.id); // Select the item
      }

      return updatedItems;
    });
  };

  const handleUpdateItem = (id: number, minSalePrice: number, endDate: Date | null) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedItems = prevSelectedItems.map((selectedItem) =>
        selectedItem.propertyId === id ? { ...selectedItem, minSalePrice, endDate } : selectedItem
      );

      return updatedItems;
    });
  };

  const handleAddProperties = async () => {
    const balance = parseFloat((userSolBalance / LAMPORTS_PER_SOL).toString());

    if (balance === 0) {
      return toast.info(
        "You don't have sufficient funds to perform this operation, please top up your wallet with some Sol to continue"
      );
    }

    if (parseFloat(userUSDWalletBalance.amount) === 0) {
      return toast.info(
        "You don't have sufficient funds to perform this operation, please top up your wallet with some USD to continue"
      );
    }

    if (selectedItems.length === 0) {
      return toast.info("You must select an Airspace to continue");
    }

    if (!endDate) {
      return toast.info("You must select an End Date to continue");
    }
    if (!minSalePrice || minSalePrice <= 0) {
      return toast.info("You must enter a Minimum Sale Price to continue");
    }

    setIsProcessing(true);

    try {
      const dateStr = convertDate(endDate);
      const endTime = Math.floor(new Date(dateStr).getTime() / 1000);
      const currentTime = Math.floor(Date.now() / 1000);
      const durationInSeconds = endTime - currentTime;

      const postData = {
        assetId: assetId,
        seller: user?.blockchainAddress || "",
        initialPrice: Number(minSalePrice),
        secsDuration: durationInSeconds,
      };

      console.log({ postData });

      const response = await createAuction({ postData });

      if (response && response.tx[0]) {
        const transaction1 = VersionedTransaction.deserialize(new Uint8Array(Buffer.from(response.tx[0], "base64")));

        const tx1 = await executeTransaction(transaction1, provider);

        if (tx1) {
          const postData = {
            serializedTx: tx1,
          };

          const result = await submitAuction(postData);
          if (result && result.txSignature.length > 0) {
            setTxHash(result.txSignature);
            dispatch(setIsTriggerRefresh(true));
            setTransactionStatus(TransactionStatusEnum.SUCCESS);
            setResponseStatus("SUCCESS");
            setSelectedItems([]);
            setSelectedItemId(null);
            await getAuctions();
          } else {
            setTransactionStatus(TransactionStatusEnum.FAILED);
            setResponseStatus("FAIL");
          }
        } else {
          setTransactionStatus(TransactionStatusEnum.FAILED);
          setResponseStatus("FAIL");
        }
      } else {
        setTransactionStatus(TransactionStatusEnum.FAILED);
        setResponseStatus("FAIL");
      }
    } catch (error) {
      console.log({ error });
      setResponseStatus("FAIL");
    }
  };
  console.log({ selectedItems });

  useEffect(() => {
    setIsProcessing(false);
  }, []);

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
    transactionStatus,
    responseStatus,
    selectedItemId,
    selectedItems,
    userUSDWalletBalance,
    userSolBalance,
    airspaceAddress,
  };
};

export default useAuction;
