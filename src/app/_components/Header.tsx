import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NavLinks from "./NavLinks";
import Image from "next/image";
import { MaxWidthWrapper } from "./MaxwidthWrapper";

function Header() {
  return (
    <div className="border-b border-border bg-background">
      <MaxWidthWrapper className="hidden h-14 items-center justify-between p-3 md:flex">
        <div className="flex items-center gap-3">
          <Link
            href={"/"}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "hover:bg-zinc-200",
            )}
          >
            <Image
              src={"/worm.jpeg"}
              width={40}
              height={40}
              alt={"logo"}
              className="rounded-md"
            />
          </Link>
          <h1 className="text-xl font-medium">RAG Worm.</h1>
          <Badge className="border-border border-green-600 bg-green-100 text-green-800 hover:bg-green-100">
            Early Access
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <NavLinks />
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export default Header;
