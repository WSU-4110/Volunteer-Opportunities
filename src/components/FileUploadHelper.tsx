"use client";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({
  onDrop,
  files,
  setFiles,
}: {
  onDrop: (file: File[]) => void;
  files: any;
  setFiles: (files: any) => void;
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "*": [],
    },
    maxSize: 1024 * 1000,
    onDrop,
  });

  const removeFile = (name: string) => {
    setFiles(files.filter((file: any) => file.path !== name));
  };

  return (
    <div>
      <div>
        <div {...getRootProps({})}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4 cursor-pointer">
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag & drop files here, or click to select files</p>
            )}
          </div>
        </div>

        {/* Preview */}
        <section className="mt-10">
          {/* Accepted files */}
          <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">
            Accepted Files
          </h3>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
            {files.map((file: any, i: number) => {
              return (
                <li
                  key={file.path + i}
                  className="relative rounded-md shadow-lg"
                >
                  <img
                    src={file.preview}
                    alt={file.path}
                    width={100}
                    height={100}
                    className="h-full w-full object-contain rounded-md"
                  />
                  <button
                    type="button"
                    className="w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                    onClick={() => removeFile(file.path)}
                  >
                    X
                  </button>
                  <p className="mt-2 text-neutral-500 text-[12px] font-medium">
                    {file.path}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dropzone;
