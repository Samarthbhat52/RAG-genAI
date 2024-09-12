"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

function OverviewCards() {
  const { data: playgrounds, isLoading: playgroundsLoading } =
    api.playgroundRouter.getPlaygroundsCount.useQuery();

  const { data: files, isLoading: filesLoading } =
    api.filesRouter.getAllFilesCount.useQuery();

  if (playgroundsLoading || filesLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
      <Card className="flex w-full flex-col justify-center sm:w-96">
        <CardHeader>
          <CardTitle>Playgrounds</CardTitle>
          <CardDescription>Your interactive AI workspaces</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-2xl font-bold">
            {playgrounds ? playgrounds[0]?.count : 0} / 5
          </p>
          <Progress
            value={playgrounds ? (playgrounds[0]?.count! / 5) * 100 : 0}
          />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Upgrade your account to increase the limit
          </p>
        </CardFooter>
      </Card>

      <Card className="flex w-full flex-col justify-center sm:w-96">
        <CardHeader>
          <CardTitle>Files</CardTitle>
          <CardDescription>Assets across all Playgrounds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-2xl font-bold">
            {files ? files[0]?.count : 0} / 15
          </p>
          <Progress value={files ? (files[0]?.count! / 15) * 100 : 0} />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Upgrade your account to increase file capacity
          </p>
        </CardFooter>
      </Card>
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

export default OverviewCards;
