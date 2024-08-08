import Service from "./Service"

const AirspaceRentalService = () => {
  const { getRequest, postRequest } = Service();

  const getPropertiesByUserAddress = async (callerAddress: string | undefined, type: string, limit: string | number, afterAssetId?: string)=>{
    try {
      if (!callerAddress) return [];
      const response = await getRequest({
        uri: `/private/airspace-rental/retrieve-tokens?callerAddress=${callerAddress}&type=${type}&limit=${limit}&afterAssetId=${afterAssetId || ""}`
      });
      if (!response) {
        return [];
      }
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getUnverifiedAirspaces = async (callerAddress: string | undefined, page: string | number, limit: string | number)=>{
    try {
      if (!callerAddress) return [];
      const response = await getRequest({
        uri: `/private/airspace-rental/retrieve-unverified-airspace?callerAddress=${callerAddress}&limit=${limit}&page=${page || "1"}`
      })
      if (!response) {
        return [];
      }
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getRejectedAirspaces = async (callerAddress: string | undefined, page: string | number, limit: string | number)=>{
    try {
      if (!callerAddress) return [];
      const response = await getRequest({
        uri: `/private/airspace-rental/retrieve-rejected-airspace?callerAddress=${callerAddress}&limit=${limit}&page=${page || "1"}`
      })
      if (!response) {
        return [];
      }
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  const getTotalAirspacesByUserAddress = async (callerAddress: string | undefined)=>{
    try {
      if (!callerAddress) return [];
      const response = await getRequest({
        uri: `/private/airspace-rental/retrieve-total-airspace?callerAddress=${callerAddress}`,
      })
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getSingleAsset = async (assetId: string) => {
    try {
      if (!assetId) return null;
      const response = await getRequest({
        uri: `/private/airspace-rental/retrieve-single-asset/${assetId}`,
      })
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const createMintRentalToken = async ({ postData }: {postData: any})=>{
    try {
      const response = await postRequest({
        uri: `/private/airspace-rental/create-mint-rental-token-ix`,
        postData,
      })
      return response?.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message)
    }
  }

  const executeMintRentalToken = async ({ postData }: { postData: any }) => {
    try {
      const response = await postRequest({
        uri: `/private/airspace-rental/execute-mint-rental-token-ix`,
        postData,
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }
  const getPendingAirspaces = async (callerAddress: string | undefined, page: string | number, limit: string | number)=>{
    try {
      const response = await getRequest({
        uri: `/private/airspace-rental/retrieve-pending-rental-airspace?callerAddress=${callerAddress}&limit=${limit}&page=${page || "1"}`
      })
      console.log(response, "response")
      if (!response) {
        return [];
      }
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  

  return { 
    getPropertiesByUserAddress,
    getUnverifiedAirspaces,
    getRejectedAirspaces,
    createMintRentalToken,
    executeMintRentalToken,
    getTotalAirspacesByUserAddress, 
    getSingleAsset,
    getPendingAirspaces
  };
};

export default AirspaceRentalService;