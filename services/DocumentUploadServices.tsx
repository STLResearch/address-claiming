import Service from "./Service";
interface UpdateDocumentParams {
  path: string;
  requestId: string | number;
}

const DocumentUploadServices = () => {
  const { postRequest } = Service();

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
    updateDocument,
  };
};

export default DocumentUploadServices;
