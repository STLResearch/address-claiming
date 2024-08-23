import Service from "./Service";

const AirspaceRentalService = () => {
  const { getRequest, postRequest } = Service();

  const getPropertiesByUserAddress = async (
    callerAddress: string | undefined,
    type: string,
    limit: string | number,
    afterAssetId?: string
  ) => {
    try {
      if (!callerAddress) return [];
      const response = await getRequest({
        uri: `/public/airspace-rental/retrieve-tokens?callerAddress=${callerAddress}&type=${type}&limit=${limit}&afterAssetId=${afterAssetId || ""}`,
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

  const getRetrievePendingRentalAirspace = async (
    callerAddress: string | undefined,
    page: string | number,
    limit: string | number
  ) => {
    try {
      if (!callerAddress) return [];
      const response = await getRequest({
        uri: `/public/airspace-rental/retrieve-pending-rental-airspace?callerAddress=${callerAddress}&limit=${limit}&page=${page || "1"}`,
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

  const getBidsAndOffers = async (callerAddress) => {
    try {
      if (!callerAddress) return [];
      const response = await getRequest({
        uri: `/private/auction-house/get-user-bids`,
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

  const getUnverifiedAirspaces = async (
    callerAddress: string | undefined,
    page: string | number,
    limit: string | number
  ) => {
    try {
      if (!callerAddress) return [];
      const response = await getRequest({
        uri: `/public/airspace-rental/retrieve-unverified-airspace?callerAddress=${callerAddress}&limit=${limit}&page=${page || "1"}`,
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

  const getRejectedAirspaces = async (
    callerAddress: string | undefined,
    page: string | number,
    limit: string | number
  ) => {
    try {
      if (!callerAddress) return [];
      const response = await getRequest({
        uri: `/public/airspace-rental/retrieve-rejected-airspace?callerAddress=${callerAddress}&limit=${limit}&page=${page || "1"}`,
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
  const getTotalAirspacesByUserAddress = async (
    callerAddress: string | undefined
  ) => {
    try {
      if (!callerAddress) return [];
      const response = await getRequest({
        uri: `/public/airspace-rental/retrieve-total-airspace?callerAddress=${callerAddress}`,
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
    createMintRentalToken,
    executeMintRentalToken,
    getTotalAirspacesByUserAddress,
    getSingleAsset,
    getRetrievePendingRentalAirspace,
    getBidsAndOffers,
  };
};

export default AirspaceRentalService;

[
  {
    id: 1,
    assetId: "BgDdafbrDVPNQ81tygmTwSEmDgewQ48rY6T3TBzXKBJt",
    seller: "8MbJpTkFxpnQcxs1No1WLhvAfAz8pZViw1yJRbcWDU2M",
    pdaAddress: "EM1DSHyPfk93ct2fDJoNLkpKYzySF5F89quo3xcRP9uF",
    initialPrice: 100,
    endDate: "2024-08-21T21:57:19.000Z",
    currentPrice: 0,
    currentBidder: null,
    paymentToken: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    transactions: [],
    isCancelled: false,
    isExecuted: false,
    AuctionBid: [],
    layer: {
      id: 35,
      createdAt: "2024-08-21T20:18:49.090Z",
      updateAt: "2024-08-21T21:56:30.110Z",
      tokenId: "BgDdafbrDVPNQ81tygmTwSEmDgewQ48rY6T3TBzXKBJt",
      propertyId: 37,
      isCurrentlyInAuction: true,
      property: {
        id: 37,
        createdAt: "2024-08-21T20:18:49.090Z",
        updateAt: "2024-08-21T20:18:55.018Z",
        title: "",
        transitFee: "",
        address: "",
        timezone: "",
        hasLandingDeck: false,
        hasChargingStation: false,
        hasStorageHub: false,
        isFixedTransitFee: false,
        isRentableAirspace: false,
        ownerId: 6,
        noFlyZone: false,
        isBoostedArea: false,
        latitude: 0,
        longitude: 0,
        propertyStatusId: 1,
        isActive: true,
        isPropertyRewardClaimed: false,
      },
    },
  },
  {
    id: 3,
    assetId: "HfFSKW29SnT59dzWsZzxJ3Dih9yTm6CXFhYFVZvMQT2R",
    seller: "8nUQ9RZLLJkeJPFHatJUF9zVpg4cT7RZ6NHVJFfPpTaC",
    pdaAddress: "6txpMYywuUsWad1JtHUh5wdR4iJyWWrczByecoVdTB9v",
    initialPrice: 1,
    endDate: "2024-09-06T06:03:01.000Z",
    currentPrice: 0,
    currentBidder: null,
    paymentToken: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    transactions: [],
    isCancelled: false,
    isExecuted: false,
    AuctionBid: [],
    layer: {
      id: 3,
      createdAt: "2024-08-14T18:24:47.879Z",
      updateAt: "2024-08-22T06:03:27.392Z",
      tokenId: "HfFSKW29SnT59dzWsZzxJ3Dih9yTm6CXFhYFVZvMQT2R",
      propertyId: 4,
      isCurrentlyInAuction: true,
      property: {
        id: 4,
        createdAt: "2024-08-14T18:18:21.447Z",
        updateAt: "2024-08-14T18:24:49.106Z",
        title: "Dire Dawa",
        transitFee: "1-99",
        address: "Dire Dawa, Ethiopia",
        timezone: "Europe/london",
        hasLandingDeck: false,
        hasChargingStation: false,
        hasStorageHub: false,
        isFixedTransitFee: false,
        isRentableAirspace: true,
        ownerId: 1,
        noFlyZone: false,
        isBoostedArea: false,
        latitude: 9.5913193,
        longitude: 41.8566373,
        propertyStatusId: 1,
        isActive: true,
        isPropertyRewardClaimed: false,
      },
    },
  },
  {
    id: 4,
    assetId: "9SgBVTh47TDMVUExdB9bLsbsKGTRbAjRSa2CU9ANaF5Q",
    seller: "8nUQ9RZLLJkeJPFHatJUF9zVpg4cT7RZ6NHVJFfPpTaC",
    pdaAddress: "Ct9fs1dEhr1CzHwPf1EAwwBff3m97hk6DqhDvi4jUmAj",
    initialPrice: 1,
    endDate: "2024-09-06T06:15:41.000Z",
    currentPrice: 2,
    currentBidder: "A1HS5KnAzG2HHft79sHxoh72LQgYUK33Ee1LCHqqvJxo",
    paymentToken: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    transactions: [
      "5DNXo6zWHQHbZfDhHSRbXB646ohmsc3ms4umpuKQ7AshdH4izDkA21DGEb1Mmfd5Eoe4wnxKwYmMj8QyWwubDwua",
    ],
    isCancelled: false,
    isExecuted: false,
    AuctionBid: [
      {
        id: 2,
        price: 2,
        bidder: "A1HS5KnAzG2HHft79sHxoh72LQgYUK33Ee1LCHqqvJxo",
        transaction:
          "5DNXo6zWHQHbZfDhHSRbXB646ohmsc3ms4umpuKQ7AshdH4izDkA21DGEb1Mmfd5Eoe4wnxKwYmMj8QyWwubDwua",
        auctionId: 4,
      },
    ],
    layer: {
      id: 1,
      createdAt: "2024-08-14T18:21:57.133Z",
      updateAt: "2024-08-22T06:16:16.659Z",
      tokenId: "9SgBVTh47TDMVUExdB9bLsbsKGTRbAjRSa2CU9ANaF5Q",
      propertyId: 1,
      isCurrentlyInAuction: true,
      property: {
        id: 1,
        createdAt: "2024-08-14T18:17:24.111Z",
        updateAt: "2024-08-14T18:21:58.111Z",
        title: "Awasa",
        transitFee: "1-99",
        address: "Awasa, Sidama, Ethiopia",
        timezone: "Europe/london",
        hasLandingDeck: false,
        hasChargingStation: false,
        hasStorageHub: false,
        isFixedTransitFee: false,
        isRentableAirspace: true,
        ownerId: 1,
        noFlyZone: false,
        isBoostedArea: false,
        latitude: 7.065289,
        longitude: 38.476398,
        propertyStatusId: 1,
        isActive: true,
        isPropertyRewardClaimed: false,
      },
    },
  },
  {
    id: 5,
    assetId: "GHY1jJ3Qzb8ricmeLxy7bNiDZMtr6RF4NGN6bqSA3qez",
    seller: "4otPWkKMYXnKGXU3znfGA1J7TvATxj9P5bRmwPQGEGv5",
    pdaAddress: "5EVYWPqyjsWywBmxTH2U3uEho86YwKf2L3Sp8igNPgzs",
    initialPrice: 1,
    endDate: "2024-08-28T13:44:50.000Z",
    currentPrice: 0,
    currentBidder: null,
    paymentToken: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    transactions: [
      "2NZVthfWyBgg2pCHQabpbmT2XhjFquDEPAxybpA1HxxQQm9bq6veeQ5Gh4LiW7AbieTEyvCS14SddhN4gSDEpPGa",
    ],
    isCancelled: false,
    isExecuted: false,
    AuctionBid: [],
    layer: {
      id: 37,
      createdAt: "2024-08-22T13:30:50.796Z",
      updateAt: "2024-08-22T13:33:39.944Z",
      tokenId: "GHY1jJ3Qzb8ricmeLxy7bNiDZMtr6RF4NGN6bqSA3qez",
      propertyId: 39,
      isCurrentlyInAuction: true,
      property: {
        id: 39,
        createdAt: "2024-08-22T12:38:43.597Z",
        updateAt: "2024-08-22T13:30:51.539Z",
        title: "Centro Financiero LAFISE Bancentro",
        transitFee: "1-99",
        address:
          "Centro Financiero LAFISE Bancentro, Km. 5 1/2 Carretera Masaya, Managua, Managua, Nicaragua",
        timezone: "Europe/london",
        hasLandingDeck: false,
        hasChargingStation: false,
        hasStorageHub: false,
        isFixedTransitFee: false,
        isRentableAirspace: true,
        ownerId: 8,
        noFlyZone: false,
        isBoostedArea: false,
        latitude: 12.115687,
        longitude: -86.256576,
        propertyStatusId: 1,
        isActive: true,
        isPropertyRewardClaimed: false,
      },
    },
  },
  {
    id: 6,
    assetId: "xBQYrrZjJ4C3SSQ22NoGtyXm9L7Mq5mkFzqyptMYF4q",
    seller: "4otPWkKMYXnKGXU3znfGA1J7TvATxj9P5bRmwPQGEGv5",
    pdaAddress: "33MTvSicQQ2MSfauYbYW4r396zk5BPMEpBif7kSqF7f6",
    initialPrice: 1,
    endDate: "2024-08-31T13:59:51.000Z",
    currentPrice: 0,
    currentBidder: null,
    paymentToken: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    transactions: [
      "2rA7KVqVkBUmGJeN7Y6BLnaTmGJPSEiLxa8UVwr7w8npfMaxY75FHnmmqxVLT6B6rd7XmpiH5Zk24U2LSFwYsbN4",
    ],
    isCancelled: false,
    isExecuted: false,
    AuctionBid: [],
    layer: {
      id: 38,
      createdAt: "2024-08-22T13:31:11.826Z",
      updateAt: "2024-08-22T13:49:12.082Z",
      tokenId: "xBQYrrZjJ4C3SSQ22NoGtyXm9L7Mq5mkFzqyptMYF4q",
      propertyId: 40,
      isCurrentlyInAuction: true,
      property: {
        id: 40,
        createdAt: "2024-08-22T12:42:26.747Z",
        updateAt: "2024-08-22T13:31:12.743Z",
        title: "Caxena",
        transitFee: "1-99",
        address:
          "Caxena, Lugar de Oucias, Carralcova, Viana do Castelo 4970-105, Portugal",
        timezone: "Europe/london",
        hasLandingDeck: false,
        hasChargingStation: false,
        hasStorageHub: false,
        isFixedTransitFee: false,
        isRentableAirspace: true,
        ownerId: 8,
        noFlyZone: false,
        isBoostedArea: false,
        latitude: 41.904421,
        longitude: -8.366545,
        propertyStatusId: 1,
        isActive: true,
        isPropertyRewardClaimed: false,
      },
    },
  },
];
