import React from "react";
import Header from "../_components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa6";
import Image from "next/image";
import { signIn } from "@/server/auth";

function AuthPage() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
      className="flex h-full items-center justify-center px-4"
    >
      <Card className="flex w-96 flex-col justify-between">
        <CardHeader className="flex flex-row gap-3">
          <Image
            src={"/worm.jpeg"}
            alt="logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <CardTitle className="text-xl">RagWorm.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-lg font-semibold">Sign In</p>
          <CardDescription className="text-muted-foreground">
            to continue to <span className="font-semibold">Ragworm</span>.
          </CardDescription>
        </CardContent>
        <CardFooter className="space-y-8">
          <Button type="submit" className="flex w-full items-center gap-2">
            <FaGithub size={15} />
            Continue with Github
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default AuthPage;
