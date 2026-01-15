"use client";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { IconUpload, IconX, IconFileText } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

export const FileUpload = ({
  onFileSelect,
  selectedFile,
}: {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const file = newFiles[0] || null;
    onFileSelect(file);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: handleFileChange,
    noClick: true,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
  });

  return (
    <div
      {...getRootProps()}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "relative w-full group transition-all duration-300 ease-in-out",
        "rounded-[2rem] border-2 border-dashed px-6 py-8 text-center cursor-pointer", // Adjusted padding
        "min-h-[180px] flex flex-col items-center justify-center", // Added fixed height constraints
        isDragActive
          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-400 dark:hover:border-blue-500/50"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
        className="hidden"
        accept=".pdf,.docx,.txt"
      />

      {selectedFile ? (
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/20 rounded-xl text-blue-600">
                <IconFileText size={20} />
              </div>
              <div className="text-left truncate">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                  {selectedFile.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <IconX size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all duration-300">
            <IconUpload stroke={1.5} size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Drop your report here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              or{" "}
              <span className="text-blue-600 font-semibold underline underline-offset-2">
                browse files
              </span>
            </p>
          </div>
          <div className="flex gap-1.5">
            {["PDF", "DOCX", "TXT"].map((ext) => (
              <span
                key={ext}
                className="px-1.5 py-0.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 rounded"
              >
                {ext}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};