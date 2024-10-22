import Service from "./Service";

const AirspaceRentalService = () => {
  const { getRequest, postRequest } = Service();

  const getPropertiesByUserAddress = async (type: string, limit: string | number, afterAssetId?: string) => {
    try {
      const response = await getRequest({
        uri: `/private/properties/user-verified-properties?type=${type}&limit=${limit}&afterAssetId=${afterAssetId || ""}`,
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

  const getNonceAccountEntry = async () => {
    try {
      const response = await getRequest({
        uri: `/private/airspace-rental/get-nonce-account-entry`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  const getRetrievePendingRentalAirspace = async (page: string | number, limit: string | number) => {
    try {
      const response = await getRequest({
        uri: `/private/airspace-rental/retrieve-pending-rental-airspace?limit=${limit}&page=${page || "1"}`,
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

  const getUnverifiedAirspaces = async (page: string | number, limit: string | number) => {
    try {
      const response = await getRequest({
        uri: `/private/airspace-rental/retrieve-unverified-airspace?limit=${limit}&page=${page || "1"}`,
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

  const getRejectedAirspaces = async (page: string | number, limit: string | number) => {
    try {
      const response = await getRequest({
        uri: `/private/airspace-rental/retrieve-rejected-airspace?limit=${limit}&page=${page || "1"}`,
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
  const getTotalAirspacesByUserAddress = async () => {
    try {
      const response = await getRequest({
        uri: `/private/airspace-rental/retrieve-total-airspace`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getSingleAsset = async (assetId: string) => {
    try {
      if (!assetId) return null;
      const response = await getRequest({
        uri: `/public/airspace-rental/retrieve-single-asset/${assetId}`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const createMintRentalToken = async ({ postData }: { postData: any }) => {
    try {
      const response = await postRequest({
        uri: `/private/airspace-rental/create-mint-rental-token-ix`,
        postData,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  const executeMintRentalToken = async ({ postData }: { postData: any }) => {
    try {
      const response = await postRequest({
        uri: `/private/airspace-rental/execute-mint-rental-token-ix`,
        postData,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getPropertiesByUserAddress,
    getUnverifiedAirspaces,
    getRejectedAirspaces,
    getNonceAccountEntry,
    createMintRentalToken,
    executeMintRentalToken,
    getTotalAirspacesByUserAddress,
    getSingleAsset,
    getRetrievePendingRentalAirspace,
  };
};

export default AirspaceRentalService;
