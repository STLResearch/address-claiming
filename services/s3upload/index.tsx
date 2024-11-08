import Service from "../Service";
import {
  GeneratePublicFileUploadUrlParams,
  GeneratePrivateFileUploadUrlParams,
  GeneratePrivateFileUploadUrlResponse,
  GeneratePublicFileUploadUrlResponse,
} from "./types";

const S3UploadServices = () => {
  const { postRequest } = Service();

  const generatePublicFileUploadUrls = async (
    postData: GeneratePublicFileUploadUrlParams,
  ): Promise<GeneratePublicFileUploadUrlResponse[] | void> => {
    try {
      if (!postData.referenceId || postData.contentTypes.length === 0) return;
      const response = await postRequest({
        uri: `/private/s3Upload/generate-public-file-upload-url`,
        postData,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  const generatePrivateFileUploadUrls = async (
    postData: GeneratePrivateFileUploadUrlParams,
  ): Promise<GeneratePrivateFileUploadUrlResponse[] | void> => {
    try {
      if (!postData.requestId || postData.contentTypes.length === 0) return;
      const response = await postRequest({
        uri: `/private/s3Upload/generate-private-file-upload-url`,
        postData,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  return {
    generatePublicFileUploadUrls,
    generatePrivateFileUploadUrls,
  };
};

export default S3UploadServices;
