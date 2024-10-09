import Service from "../Service";
import { GeneratePublicFileUploadUrlParams } from "./types";


const S3UploadServices = () => {
  const { postRequest } = Service();

  const generatePublicFileUploadUrl = async ({
    fileType,
    requestId,
  }: GeneratePublicFileUploadUrlParams) => {
    try {
      const postData = {contentTypes:fileType,requestId:requestId}
      if (!fileType || !requestId) return;
      const response = await postRequest({
        uri: `/private/request-document/generate-upload-url`,
        postData
      });
      return response?.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  return {
    generatePublicFileUploadUrl,
  };
};

export default S3UploadServices;
