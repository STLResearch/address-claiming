import { AuctionListingI, AuctionSubmitI } from "@/types";
import Service from "./Service";

const MarketplaceService = () => {
  const { getRequest, postRequest } = Service();

  const getAuctions = async (page: number = 1, limit: number = 10) => {
    try {
      const response = await getRequest({
        uri: `/market/nft?page=${page}&limit=${limit}`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const createAuction = async ({ postData }: { postData: AuctionListingI }) => {
    try {
      const response = await postRequest({
        uri: `/market/nft`,
        postData,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const submitAuction = async ({ postData }: { postData: AuctionSubmitI }) => {
    try {
      const response = await postRequest({
        uri: `/market/nft/txs/submit`,
        postData,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const searchAuctions = async ({
    postData,
  }: {
    postData: {
      minPrice: number;
      maxPrice: number;
    };
  }) => {
    try {
      const response = await postRequest({
        uri: `/market/nft/search`,
        postData,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getAuctions,
    createAuction,
    submitAuction,
    searchAuctions,
  };
};

export default MarketplaceService;
