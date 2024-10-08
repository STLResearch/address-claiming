import Service from "../Service";
import { GeneratePublicFileUploadUrlParams } from "./types";

export interface GeneratArispacePublicFileUploadUrlParams {
  fileType: string;
  referenceId: string | number;
}
const S3UploadServices = () => {
  const { postRequest } = Service();

  const generatePublicFileUploadUrl = async ({
    fileType,
    requestId,
  }: GeneratePublicFileUploadUrlParams) => {
    try {
      if (!fileType || !requestId) return;
      const response = await postRequest({
        uri: `/private/s3Upload/generate-public-file-upload-url?contentType=${fileType}&requestId=${requestId}`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  const generateArispacePublicFileUploadUrl = async ({
    fileType,
    referenceId,
  }: GeneratArispacePublicFileUploadUrlParams) => {
    try {
      if (!fileType || !referenceId) return;
      const response = await postRequest({
        uri: `/private/s3Upload/generate-public-file-upload-url?contentType=${fileType}&referenceId=${referenceId}`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  return {
    generatePublicFileUploadUrl,
    generateArispacePublicFileUploadUrl,
  };
};

export default S3UploadServices;
