import Service from "./Service";
interface UpdateDocumentParams {
  paths: string[];
  requestId: string | number;
}

const DocumentUploadServices = () => {
  const { postRequest } = Service();

  const updateDocument = async ({ paths, requestId }: UpdateDocumentParams) => {
    try {
      const postData = {filePath:paths,requestId:requestId}
      if (!paths || !requestId) return;
      const response = await postRequest({
        uri: `/private/request-document/update-document-metadata`,
        postData
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
