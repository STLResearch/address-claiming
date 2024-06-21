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

  const deleteProperty = async ({ postData }: { postData: any }) => {
    try {
      const response = await deleteRequest({
        uri: `/private/properties/delete`,
        postData,
      })
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
    deleteProperty,
    getClaimedPropertiesByUserAddress
  };
};

export default PropertiesService;