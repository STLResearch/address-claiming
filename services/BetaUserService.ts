import Service from "./Service";

const BetaUserService = () => {
  const { getRequest, postRequest, patchRequest } = Service();

  

  const joinWaitlist = async () => {
    try {
      const response = await postRequest({
        uri: `private/beta-user/register`,
        postData: {
            userId: null
        },

      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    joinWaitlist,
  };
};

export default BetaUserService;
