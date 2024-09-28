"use client";
import { useCallback, useEffect, useState } from "react";
import FileUploadHelper from "./FileUploadHelper";

const fileUpload = ({ files }: { files: string[] }) => {
  const [filesToUpload, setfilesToUpload] = useState<any>([]);

  const updateFiles = (files: File[]) => {
    setfilesToUpload([...files]);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      setfilesToUpload((previousFiles: File[]) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }
  }, []);

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () =>
      filesToUpload.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, [filesToUpload]);

  return (
    <FileUploadHelper
      onDrop={onDrop}
      files={filesToUpload}
      setFiles={updateFiles}
    />
  );
};

export default fileUpload;
