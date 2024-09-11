import React from "react";
import { Command } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NavLinks from "./NavLinks";

function Header() {
  return (
    <div className="hidden h-14 items-center justify-between border-b border-border p-3 md:flex">
      <div className="flex items-center gap-3">
        <Link
          href={"/"}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "hover:bg-zinc-200",
          )}
        >
          <Command />
        </Link>
        <h1 className="text-xl font-semibold">RAG Playground</h1>
        <Badge className="border-border border-green-600 bg-green-100 text-green-800 hover:bg-green-100">
          Early Access
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <NavLinks />
      </div>
    </div>
  );
}

export default Header;
