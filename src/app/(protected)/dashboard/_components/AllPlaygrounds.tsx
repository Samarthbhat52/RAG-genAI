"use client";

import { api } from "@/trpc/react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Ghost, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playgroundSelect } from "@/server/db/schema";
import { format } from "date-fns";

const CardComponent = ({ data }: { data: typeof playgroundSelect }) => {
  return (
    <Card className="w-full md:w-96">
      <Link href={`/dashboard/playground/${data.id}`}>
        <div className="relative aspect-video h-24 w-full">
          <Image
            src={"https://images.unsplash.com/photo-1626482973710-aebe8e9003f1"}
            className="h-10 w-full rounded-t-md object-cover"
            alt="Unsplash image"
            fill
          />
        </div>

        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>{data.description}</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Link>
      <CardFooter className="flex justify-between border-t border-border px-4 py-2">
        <div className={cn("flex items-center gap-2")}>
          <Plus size={15} />
          <p>{format(data.createdAt, "LLL yyyy")}</p>
        </div>
        <div>
          {/* // TODO: Add delete functionality  */}
          <Button
            variant={"destructive"}
            size={"sm"}
            className="flex items-center gap-1"
          >
            <Trash size={15} /> delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

function AllPlaygrounds() {
  const { data, isLoading } = api.playgroundRouter.getAllPlaygrounds.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!data?.length) {
    return (
      <div className="flex w-full flex-col items-center gap-1 pt-8">
        <Ghost size={30} />
        <p className="text-md font-medium">Looks so empty</p>
        <p className="text-sm text-muted-foreground">
          Create your first playground
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
      {data?.map((playground) => (
        <CardComponent data={playground} key={playground.id} />
      ))}
    </div>
  );
}

const Loader = () => {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-48 w-96" />
      <Skeleton className="h-48 w-96" />
    </div>
  );
};

export default AllPlaygrounds;
