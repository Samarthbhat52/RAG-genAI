"use client";

import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { CloudUpload, File, Loader } from "lucide-react";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

interface UploadDropzoneProps {
  playgroundId: string;
  setDialogOpen: (open: boolean) => void;
}

function UploadDropzone({ playgroundId, setDialogOpen }: UploadDropzoneProps) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const utils = api.useUtils();

  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onClientUploadComplete: () => {
      toast.success("File(s) uploaded successfully");
      setDialogOpen(false);
      utils.filesRouter.getAllFilesCount.invalidate();
      utils.filesRouter.getFiles.invalidate({ playgroundId });
    },
    onUploadError(e) {
      toast.error(e.message);
    },
  });

  return (
    <Dropzone
      multiple={false}
      onDrop={async (file) => await startUpload(file, { playgroundId })}
      disabled={isUploading}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="m-4 h-64 rounded-md border border-dashed border-gray-300"
        >
          <div className="flex h-full w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-md bg-card hover:bg-gray-100"
            >
              <div className="flex w-full flex-col items-center justify-center space-y-2">
                <CloudUpload size={30} />
                <p>
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                {/* // TODO: Change dynamically */}
                <p className="text-sm text-muted-foreground">PDF (up to 4MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md outline outline-[1px] outline-zinc-200">
                  <div className="flex h-full items-center justify-center px-3 py-2">
                    <File size={18} />
                  </div>
                  <div className="h-full px-3 py-2">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading && uploadProgress < 100 ? (
                <div className="mx-auto w-full max-w-xs">
                  <Progress
                    className={cn(
                      "h-1 w-full bg-zinc-200",
                      uploadProgress === 100 && "bg-green-300",
                    )}
                    value={uploadProgress}
                  />
                </div>
              ) : uploadProgress === 100 ? (
                <div className="flex flex-col items-center space-y-1">
                  <Loader size={15} className="animate-spin" />
                  <p className="text-xs text-muted-foreground">
                    Creating embeddings
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This wont take long...
                  </p>
                </div>
              ) : null}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
}

export default UploadDropzone;
