import Service from "./Service"

const PropertiesService = () => {
  const { getRequest, postRequest, patchRequest, deleteRequest } = Service();

  const getPropertyById = async (propertyId: string | number)=>{
    try {
      const response = await getRequest({
        uri: `/private/properties/find-one/${propertyId}`
      })
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getClaimedPropertiesByUserAddress = async ()=>{
    try {
      const response = await getRequest({
        uri: `/private/properties/user-properties`
      })
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const findPropertiesByCoordinates = async ({ postData }: {postData: any})=>{
    try {
      const response = await postRequest({
        uri: `/public/properties/`,
        postData,
        isPublic: true,
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  const updateClaimedProperty = async ({ postData }: { postData: any }) => {
    try {
      const response = await patchRequest({
        uri:  '/private/properties/update',
        postData,
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  const claimProperty = async ({ postData }: { postData: any }) => {
    try {
      const response = await postRequest({
        uri: '/private/properties/claim',
        postData,
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  const unclaimProperty = async (propertyId: number) => {
    try {
      const response = await patchRequest({
        uri: `/private/properties/unclaim-property/${propertyId}`,
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  const getRentedTimes = async (propertyId: string | number)=>{
    try {
      const response = await getRequest({
        uri: `/private/properties/get-rental-timeframe/${propertyId}`
      })
      console.log(response , "response")
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const editAirSpaceAddress = async (postData: {address: string, propertyId: number}) => {
    try {
      const response = await patchRequest({
        uri: `/private/properties/update`,
        postData,
      
      }) 
       console.log(postData, "postData")
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }


  return { 
    findPropertiesByCoordinates,
    getPropertyById,
    claimProperty,
    updateClaimedProperty,
    unclaimProperty,
    getClaimedPropertiesByUserAddress,
    getRentedTimes,
    editAirSpaceAddress
  };
};

export default PropertiesService;