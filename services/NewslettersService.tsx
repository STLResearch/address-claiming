import Service from "./Service";

const NewslettersService = () => {
  const { getRequest, postRequest, patchRequest } = Service();

  const getNewsLetters = async () => {
    try {
      const response = await getRequest({
        uri: `/public/newsletters`,
        isPublic: true,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getNewsLetters,
  };
};

export default NewslettersService;
