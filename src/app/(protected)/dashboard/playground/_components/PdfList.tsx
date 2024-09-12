"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FilePlus, Ghost, Loader, Trash } from "lucide-react";
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

  const { data: pdfCount } = api.filesRouter.getAllFilesCount.useQuery();

  const { mutate, isPending } = api.filesRouter.deleteFile.useMutation({
    onSuccess: () => {
      toast.success("File deleted");
      utils.filesRouter.getAllFilesCount.invalidate();
      utils.filesRouter.getFiles.invalidate({ playgroundId: id });
    },
    onError: () => {
      toast.error("Error deleting file");
    },
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
            // TODO: Add files limit dynamically
            disabled={isLoading || pdfCount?.[0]?.count === 15 || isPending}
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
              <Button
                variant={"ghost"}
                size={"icon"}
                className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                // TODO: Fix loading state change for all files when one is deleted
                onClick={() => mutate({ key: pdf.key })}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <Trash size={20} />
                )}
              </Button>
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
