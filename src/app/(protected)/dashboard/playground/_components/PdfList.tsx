"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FilePlus, Ghost } from "lucide-react";
import React from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import UploadDropzone from "./Dropzone";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";

function PDFList() {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = React.useState(false);

  const { data: pdfList, isLoading } = api.filesRouter.getFiles.useQuery({
    playgroundId: id,
  });

  const { data: pdfCount } = api.filesRouter.getAllFilesCount.useQuery();

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
            // TODO: Add files limit dynamically
            disabled={isLoading || pdfCount?.[0]?.count === 15}
          >
            Upload
            <FilePlus size={15} />
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <UploadDropzone playgroundId={id} setDialogOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <SkeletonLoader />
      ) : pdfList?.length ? (
        <ScrollArea className="h-80">
          {pdfList.map((pdf) => (
            <div
              className="mt-4 flex items-center justify-between rounded-md bg-gray-100 p-2"
              key={pdf.id}
            >
              <div className="flex items-center gap-2">
                <FaRegFilePdf size={23} />
                <span className="truncate text-ellipsis font-medium">
                  {pdf.name}
                </span>
              </div>
            </div>
          ))}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : (
        <div className="flex h-80 flex-col items-center justify-center gap-2">
          <Ghost className="text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">No files uploaded</p>
            <p className="text-xs text-muted-foreground">
              Upload some PDFs to talk with worm.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const SkeletonLoader = () => {
  return (
    <div className="flex h-80 flex-col gap-2 p-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

export default PDFList;
