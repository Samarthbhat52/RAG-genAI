"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import ModelSettings from "../(protected)/dashboard/playground/_components/ModelSettings";
import PDFList from "../(protected)/dashboard/playground/_components/PdfList";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Settings, SquareMenu } from "lucide-react";
import NavLinks from "./NavLinks";

interface MobileHeaderProps {
  playground?: boolean;
}

function MobileHeader({ playground = false }: MobileHeaderProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-border p-3 md:hidden">
      <div className="flex items-center gap-3">
        {playground ? (
          <Sheet>
            <SheetTrigger>
              <Settings />
            </SheetTrigger>
            <SheetContent side={"left"} className="w-full">
              <SheetHeader>
                <SheetTitle>Preferences</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-full">
                <div className="h-auto space-y-5 pb-14 pt-5">
                  <ModelSettings />
                  <PDFList />
                </div>
                <ScrollBar orientation="vertical" hidden={true} />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        ) : (
          <div></div>
        )}

        <Badge className="border-border border-green-600 bg-green-100 text-green-800 hover:bg-green-100">
          Early Access
        </Badge>
      </div>
      <Sheet>
        <SheetTrigger>
          <SquareMenu />
        </SheetTrigger>
        <SheetContent side={"right"} className="w-full">
          <ScrollArea className="flex h-full flex-col gap-2 pt-8">
            <NavLinks />
            <ScrollBar orientation="vertical" hidden={true} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileHeader;
