import axios from "axios";
import Service from "./Service"

const MarketPlaceService = () => {
  const { getRequest, postRequest, patchRequest, deleteRequest } = Service();

  const getNfts = async (page: number, limit:  number)=>{
    // console.log('here 1')
    try {
      const response = await getRequest({
        uri: `/market/nft?page=${page}&limit=${limit}`,
        isPublic:true
      });
      if (!response) {
        return [];
      }
      console.log(response,"hello part 2");
      return response?.data;
    } catch (error) {
      console.error(error);
    //   console.log('error here 2',error)
      return [];
    }
  }

  const createBid = async (assetId: string,callerBlockchainAddress:string, bidOffer:  number,bidType:string)=>{
    try {
        console.log(assetId,callerBlockchainAddress,bidOffer,bidType,'why')
      const response = await postRequest({
        uri: `/market/nft/bid?assetId=${assetId}&callerBlockchainAddress=${callerBlockchainAddress}&bidOffer=${Number(bidOffer)}`,

      });
      if (!response) {
        return [];
      }
      console.log(response,"thanks");
      return response;
    } catch (error) {
      console.error(error);
      console.log('error here 2 thanks',error)
      return [];
    }
  }

  return { 
    getNfts,
    createBid
  };
};

export default MarketPlaceService;