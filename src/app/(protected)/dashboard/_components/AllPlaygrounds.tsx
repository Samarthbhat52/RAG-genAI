"use client";

import { api } from "@/trpc/react";
import React, { useEffect } from "react";
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
import { unsplash } from "@/lib/unsplash";

interface CardComponentProps {
  title: string;
  description?: string | null;
  id: string;
}
const CardComponent = (props: CardComponentProps) => {
  return (
    <Link href={`/dashboard/playground/${props.id}`}>
      <Card className="h-52 w-96">
        <CardHeader></CardHeader>
        <CardContent>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

function AllPlaygrounds() {
  const { data, isLoading } = api.playgroundRouter.getAllPlaygrounds.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {data?.map((playground) => (
        <CardComponent
          key={playground.id}
          title={playground.name}
          description={playground.description}
          id={playground.id}
        />
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
