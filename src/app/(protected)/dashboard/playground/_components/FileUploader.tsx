"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

function FileUploader() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  console.log("slug id", id);

  return (
    <UploadDropzone
      input={{ playgroundId: id }}
      endpoint="pdfUploader"
      onClientUploadComplete={({ keys }) => {
        toast.success("File(s) uploaded successfully");
      }}
      onUploadError={(error: Error) => {
        toast.error(error.message);
      }}
    />
  );
}

export default FileUploader;
