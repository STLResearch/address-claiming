import Service from "./Service";

const StripeService = () => {
  const { postRequest } = Service();

  const createStripe = async (postData: any) => {
    try {
      const response = await postRequest({
        uri: "/public/stripe/create",
        postData,
        isPublic: true,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createStripe,
  };
};

export default StripeService;
