export interface GeneratePublicFileUploadUrlParams {
  contentTypes: string[];
  referenceId: string;
}

export interface GeneratePrivateFileUploadUrlParams {
  contentTypes: string[];
  requestId: number;
}

export interface GeneratePublicFileUploadUrlResponse {
  uploadUrl: string;
  key: string;
  previewDomain: string;
  previewUrl: String;
}

export interface GeneratePrivateFileUploadUrlResponse {
  uploadUrl: string;
  key: string;
}
