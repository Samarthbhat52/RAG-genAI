"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FilePlus, Ghost } from "lucide-react";
import React from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { UploadDropzone } from "@/lib/uploadthing";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";

function PDFList() {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = React.useState(false);
  const utils = api.useUtils();

  const { data: pdfList, isLoading } = api.filesRouter.getFiles.useQuery({
    playgroundId: id,
  });

  return (
    <div className="flex flex-1 flex-col gap-3 rounded-md border border-border p-4">
      <div className="flex items-center justify-between">
        <Label className="text-md font-semibold">Uploaded documents</Label>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "flex gap-2",
            )}
            disabled={isLoading}
          >
            Upload
            <FilePlus size={15} />
          </DialogTrigger>
          <DialogContent>
            <UploadDropzone
              input={{ playgroundId: id }}
              endpoint="pdfUploader"
              onClientUploadComplete={() => {
                setOpen(false);
                utils.filesRouter.getAllFilesCount.invalidate();
                utils.filesRouter.getFiles.invalidate({ playgroundId: id });
                toast.success("File(s) uploaded successfully");
              }}
              onUploadError={(error: Error) => {
                toast.error(error.message);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Loader />
      ) : pdfList ? (
        <ScrollArea className="h-80">
          {pdfList.map((pdf) => (
            <div
              className="mt-4 flex items-center gap-2 rounded-md bg-gray-100 p-2"
              key={pdf.id}
            >
              <FaRegFilePdf size={23} />
              <span className="font-medium">{pdf.name}</span>
            </div>
          ))}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : (
        <div className="flex h-80 flex-col items-center justify-center gap-3">
          <Ghost className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No files uploaded</p>
        </div>
      )}
    </div>
  );
}

const Loader = () => {
  return (
    <div className="flex h-80 flex-col gap-2 p-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

export default PDFList;
