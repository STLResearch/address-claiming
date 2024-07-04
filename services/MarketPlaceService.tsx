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

      console.log(response?.data,"hello part 2");
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const createBid = async ({postData})=>{
    try {
        // console.log(assetId,callerBlockchainAddress,bidOffer,bidType,'why')
      const response = await postRequest({
        uri: '/market/nft/bid',
        postData
      });
      
      console.log(response,"thanks");
      return response;
    } catch (error) {
      console.error(error);
      console.log('error here 2 thanks',error)
      return [];
    }
  }
  const submitSignature = async ({postData})=>{
    try {
      console.log(postData,"postData")
        // console.log(assetId,signature)
      const response = await postRequest({
        uri: '/market/nft/tx/submit',
        postData

      });
      console.log(response,"hello from service")
      return response;
    } catch (error) {
      console.error(error);
      console.log('error here 2 thanks',error)
      return [];
    }
  }

  return { 
    getNfts,
    createBid,
    submitSignature
  };
};

export default MarketPlaceService;