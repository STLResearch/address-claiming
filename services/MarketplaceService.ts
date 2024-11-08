import Service from "./Service";

const MarketplaceService = () => {
  const { getRequest, postRequest } = Service();

  const getAuctionableProperties = async (
    callerAddress: string | undefined,
    page?: number,
  ) => {
    try {
      if (!callerAddress) return [];
      const response = await getRequest({
        uri: `/private/auction-house/get-auctionable-airspaces?page=${page}&limit=${10}`,
      });
      if (!response) {
        return [];
      }
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getAuctions = async (
    page: number = 1,
    limit: number = 10,
    min_price = 0,
    max_price = 9999999999999,
    filter: string = "ONGOING",
  ) => {
    try {
      const response = await getRequest({
        uri: `/private/auction-house/get-all-auctions?page=${page}&limit=${limit}&min_price=${min_price}&max_price=${max_price}&filter=${filter}`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const createAuction = async ({ postData }: { postData: any }) => {
    try {
      const response = await postRequest({
        uri: `/private/auction-house/generate-create-auction-tx`,
        postData,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const submitAuction = async (postData: { serializedTx: string }) => {
    try {
      const response = await postRequest({
        uri: `/private/auction-house/send-tx`,
        postData,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const searchAuctions = async (
    search_text: string | undefined,
    page: number = 1,
    limit: number = 10,
    min_price = 0,
    max_price = 9999999999999,

  ) => {
    try {
      const response = await getRequest({
        uri: `/private/auction-house/search-auctions?search_text=${search_text}&page=${page}&limit=${limit}&min_price=${min_price}&max_price=${max_price}`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const filterAuctions = async (minPrice: number, maxPrice: number) => {
    try {
      const response = await postRequest({
        uri: `/market/nft/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const createBid = async (postData, auction, amount) => {
    try {
      const response = await postRequest({
        uri: `/private/auction-house/generate-place-bid-tx?auction=${auction}&amount=${parseFloat(amount)}`,
        postData,
      });

      return response?.data;
    } catch (error) {
      console.error(error);

      return [];
    }
  };
  const submitSignature = async ({ postData }) => {
    try {
      const response = await postRequest({
        uri: "/private/auction-house/send-tx",
        postData,
      });

      return response;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const getAuctionableAirspaces = async (page: number, limit: number = 10) => {
    try {
      const response = await getRequest({
        uri: `/private/auction-house/get-auctionable-airspaces?page=${page}&limit=${limit}`,
      });

      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const getAuctionWithBid = async (auction_id: number) => {
    try {
      const response = await getRequest({
        uri: `/private/auction-house/get-auction-with-bids?auction_id=${auction_id}`,
      });

      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getAuctionableProperties,
    getAuctions,
    createAuction,
    submitAuction,
    searchAuctions,
    filterAuctions,
    createBid,
    submitSignature,
    getAuctionableAirspaces,
    getAuctionWithBid,
  };
};

export default MarketplaceService;
