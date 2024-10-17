import Service from "./Service";

const UserService = () => {
  const { getRequest, postRequest, patchRequest, deleteRequest } = Service();

  const createUser = async (user: any) => {
    try {
      const response = await postRequest({
        uri: "/public/users/create",
        postData: user,
        isPublic: true,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateUser = async (user: any) => {
    try {
      const response = await patchRequest({
        uri: `/private/users/update`,
        postData: user,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const retrieveUserReferralData = async () => {
    try {
      const response = await getRequest({
        uri: `/private/users/retrieve-referral-data`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async () => {
    const resData = await getRequest({
      uri: `/private/users/session`,
    });
    if (resData.status === 200) {
      return {
        error: false,
        data: resData?.data,
      };
    }
    return {
      error: true,
      data: resData?.response?.data?.data,
    };
  };

  const deleteUser = async () => {
    try {
      const response = await deleteRequest({
        uri: `/private/users/delete`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createUser,
    retrieveUserReferralData,
    getUser,
    updateUser,
    deleteUser,
  };
};

export default UserService;
