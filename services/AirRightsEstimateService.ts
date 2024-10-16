import Service from "./Service";

const AirRightsEstimateService = () => {
  const { getRequest } = Service();

  const getAirRightEstimates = async (address: string) => {
    try {
      const response = await getRequest({
        uri: `/air-rights/search/address?address=${encodeURIComponent(address)}`,
        isPublic: true,
      });

      if (!response) {
        return undefined;
      }

      const result = response.data.status
        ? (response.data.result as any[])
        : [];

      if (result.length > 0) {
        const main = result.find((r) => r.isMain);
        const nearby = result.filter((r) => !r.isMain);

        return { main, nearby };
      }
    } catch (error) {
      return undefined;
    }
  };

  return {
    getAirRightEstimates,
  };
};

export default AirRightsEstimateService;
