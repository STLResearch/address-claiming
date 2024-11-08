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

  const handleDelete = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const handleDragStart = (index: number, event: React.DragEvent) => {
    event.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer.getData("text/plain"), 10);

    const targetElement = event.currentTarget as HTMLDivElement;
    const targetIndex = parseInt(targetElement.dataset.index || "", 10);

    if (draggedIndex !== targetIndex) {
      const updatedFiles = [...selectedFiles];
      const [draggedFile] = updatedFiles.splice(draggedIndex, 1);
      updatedFiles.splice(targetIndex, 0, draggedFile);
      setSelectedFiles(updatedFiles);
    }
  };
  const { getRootProps , getInputProps , open} = useDropzone({ onDrop , noClick: true , 
    accept: {
    'image/*': [] 
    }
  });

  return (
    <div className="">
      <div className="my-4">
        <h1 className="text-[#87878D] text-[14px]">
          Upload Air Rights Photo (Optional)
        </h1>
        <p className="text-[#87878D] text-xs italic my-3">
          Note that we generate a map view of your air rights location.
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
        onClick={open}
      >
        <input {...getInputProps()} />
        {!selectedFiles ? (
          <p className="text-base font-medium text-[#87878D]">
            Drag here or click to upload
          </p>
        ) : (
          <p className="text-base font-medium text-[#87878D] text-center max-w-full truncate">
            {`${selectedFiles.map((f) => f.name).join(", ")} Drag here or click to upload`}
          </p>
          )}
      </div>
      <div className="flex  justify-between flex-wrap gap-6">
        {selectedFiles.length > 0 &&
          selectedFiles.map((selectedFile, index) => (
            <div
              key={index}
              className="w-[280px] h-[69px] flex items-center justify-between p-2 border border-gray-300 rounded shadow-sm mt-4"
              draggable
              onDragStart={(e) => handleDragStart(index, e)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-index={index}
            >
              <div className="flex items-center w-[70%]">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Thumbnail"
                  className="w-[42px] h-[42px] rounded"
                />
                <div className="ml-2 text-sm truncate max-w-full">{selectedFile.name}</div>
              </div>
              <div className="flex space-x-2 ">
                <div 
                className="w-[24px] h-[24px] cursor-pointer"
                onDragStart={(e) => handleDragStart(index, e)}
                >
                  <ArrowMoveIcon />
                </div>
                <div 
                className="w-[24px] h-[24px] cursor-pointer"
                onClick={() => handleDelete(index)}
                >
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
