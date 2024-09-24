import Service from "./Service";
interface GenerateS3UploadUrlParams {
  fileType: string;
  requestId: string | number;
}

interface UpdateDocumentParams {
  path: string;
  requestId: string | number;
}

const DocumentUploadServices = () => {
  const { getRequest, postRequest, patchRequest } = Service();

  const generateS3UploadUrl = async ({
    fileType,
    requestId,
  }: GenerateS3UploadUrlParams) => {
    try {
      if (!fileType || !requestId) return;
      const response = await postRequest({
        uri: `/private/request-document/generate-upload-url?contentType=${fileType}&requestId=${requestId}`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  };
  const updateDocument = async ({ path, requestId }: UpdateDocumentParams) => {
    try {
      if (!path || !requestId) return;
      const response = await postRequest({
        uri: `/private/request-document/update-document-metadata?filePath=${path}&requestId=${requestId}`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  return {
    generateS3UploadUrl,
    updateDocument,
  };
};

export default DocumentUploadServices;
