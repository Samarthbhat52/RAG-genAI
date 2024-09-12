import React from "react";
import Header from "../_components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa6";
import { signIn } from "@/server/auth";

function AuthPage() {
  return (
    <div>
      <Header />
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
        className="flex flex-1 justify-center pt-40"
      >
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-lg">Sign in to Worm.</CardTitle>
            <CardDescription>
              Welcome! Please sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <Button type="submit" className="flex w-full items-center gap-2">
              <FaGithub size={15} />
              Continue with Github
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default AuthPage;
