"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader, PlusSquare } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createPlaygroundSchema } from "@/lib/schema";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddPlayground() {
  const utils = api.useUtils();
  const form = useForm<z.infer<typeof createPlaygroundSchema>>({
    resolver: zodResolver(createPlaygroundSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data: playgrounds } =
    api.playgroundRouter.getAllPlaygrounds.useQuery();

  const { mutate, isPending } =
    api.playgroundRouter.createPlayground.useMutation({
      onSuccess: (data) => {
        toast.success("Playground created successfully");
        utils.playgroundRouter.getAllPlaygrounds.invalidate();
      },
      onError: () => {
        toast.error("Error creating playground");
        form.reset();
      },
    });

  function onSubmit(values: z.infer<typeof createPlaygroundSchema>) {
    mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "flex items-center gap-2",
          buttonVariants({
            size: "sm",
          }),
        )}
        // TODO: Add a max number of playgrounds dynamically
        disabled={playgrounds?.length === 5}
      >
        Create <PlusSquare size={15} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new playground</DialogTitle>
          <DialogDescription>
            Create a playground where your documents come alive and engage in
            conversation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your playground's display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="flex w-full gap-1"
              disabled={isPending}
            >
              {isPending && <Loader size={15} className="animate-spin" />}
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddPlayground;
