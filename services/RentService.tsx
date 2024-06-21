import Service from "./Service"

const RentService = () => {
  const { getRequest, patchRequest, postRequest, deleteRequest } = Service();

  const getRents = async ()=>{
    try {
      const response = await getRequest({
        uri: `/private/rents`
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  const getRentById = async (rentId: string | number) => {
    try {
      const response = await getRequest({
        uri: `/private/rents/find-one/${rentId}`
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  const updateRent = async (rent: any) => {
    try {
      const response = await patchRequest({
        uri: `/private/rents/update`,
        postData: rent
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  const createRent = async (rent: any) => {
    try {
      const response = await postRequest({
        uri: `/private/rents/create`,
        postData: rent
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  const deleteRent = async (rentId: string | number) => {
    try {
      const response = await deleteRequest({
        uri: `/private/rents/delete`,
        postData: rentId
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }


  return { 
    getRents,
    getRentById,
    updateRent,
    createRent,
    deleteRent
  };
};

export default RentService;