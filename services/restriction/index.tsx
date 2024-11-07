import Service from "../Service";
import { RestrictedAreaResponseI } from "./type";
import * as Sentry from "@sentry/nextjs";

const RestrictionService = () => {
  const { getRequest } = Service();

  const getRestrictedAreas = async (geoHash:string) => {
    try {
      const response = await getRequest({
        uri: `/restrictions?geoHash=${geoHash}`,
      });
      return response?.data as RestrictedAreaResponseI[];
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  return {
    getRestrictedAreas,
  };
};

export default RestrictionService;
