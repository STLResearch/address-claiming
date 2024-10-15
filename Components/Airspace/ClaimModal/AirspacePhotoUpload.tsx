import React, { useState } from "react";
import { DropzoneRootProps, useDropzone } from "react-dropzone";
import { ArrowMoveIcon, DeleteIcon, FileIcon } from "../../Icons";
import { isFileSizeValid } from "@/utils/propertyUtils/fileUpload";
import { toast } from "react-toastify";
import S3UploadServices from "@/services/s3upload";
import { defaultData } from "@/types";

const AirspacePhotoUpload = ({
  selectedFiles,
  setSelectedFiles,
  data,
  setData,
}: {
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  data: defaultData;
}) => {
  const onDrop = (acceptedFiles: File[]) => {
    const isValid = acceptedFiles.every((file) => isFileSizeValid(file));

    if (isValid) {
      setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
    } else {
      toast.error("File size must be less than 20MB!");
    }
  };

  const { getRootProps } = useDropzone({ onDrop });

  return (
    <div className="">
      <div className="my-4">
        <h1 className="text-[#87878D] text-[14px]">
          Upload Airspace Photo (Optional)
        </h1>
        <p className="text-[#87878D] text-xs italic my-3">
          Note that we generate a map view of your airspace location.
        </p>
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-[5px] mt-1">
            <input
              className="w-[18px] h-[18px] cursor-pointer"
              type="checkbox"
              id="photos"
              name="photos"
              checked={data?.orderPhotoforGeneratedMap}
              onChange={() =>
                setData((prev) => ({
                  ...prev,
                  orderPhotoforGeneratedMap: !prev.orderPhotoforGeneratedMap,
                }))
              }
            />
            <label
              htmlFor="photos"
              className="text-[#87878D] text-[14px] font-normal"
            >
              Order my photos before the generated map
            </label>
          </div>
        </div>
      </div>
      <div
        {...(getRootProps() as DropzoneRootProps)}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500"
      >
        {!selectedFiles ? (
          <p className="text-base font-medium text-[#87878D]">
            Drag here or click to upload
          </p>
        ) : (
          <p className="text-base font-medium text-[#87878D]">{`${selectedFiles.map((f) => f.name).join(",")} Drag here or click to upload`}</p>
        )}
      </div>
      <div className="flex  justify-between flex-wrap gap-6">
        {selectedFiles.length > 0 &&
          selectedFiles.map((selectedFile, index) => (
            <div
              key={index}
              className="w-[280px] h-[69px] flex items-center justify-between p-2 border border-gray-300 rounded shadow-sm mt-4"
            >
              <div className="flex items-center">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Thumbnail"
                  className="w-[42px] h-[42px] rounded"
                />
                <span className="ml-2 text-sm">{selectedFile.name}</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-[24px] h-[24px]">
                  <ArrowMoveIcon />
                </div>
                <div className="w-[24px] h-[24px]">
                  <FileIcon />
                </div>
                <div className="w-[24px] h-[24px]">
                  <DeleteIcon />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AirspacePhotoUpload;
