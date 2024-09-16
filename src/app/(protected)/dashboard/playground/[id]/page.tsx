import ModelSettings from "../_components/ModelSettings";
import PDFList from "../_components/PdfList";
import ChatArea from "../_components/ChatArea";
import { HydrateClient } from "@/trpc/server";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { playground } from "@/server/db/schema";
import { redirect } from "next/navigation";
import { lazy } from "react";
import { MaxWidthWrapper } from "@/app/_components/MaxwidthWrapper";
const MobileHeader = lazy(() => import("@/app/_components/MobileHeader"));

async function Playground({ params }: { params: { id: string } }) {
  const playgroundExists = await db.query.playground.findFirst({
    where: eq(playground.id, params.id),
  });

  if (!playgroundExists) return redirect("/dashboard");

  return (
    <HydrateClient>
      <MaxWidthWrapper className="flex w-full flex-col">
        <MobileHeader playground />
        <div className="flex flex-1 justify-center gap-4 p-6">
          <div className="hidden h-full w-1/4 flex-col space-y-4 lg:flex">
            <ModelSettings />
            <PDFList />
          </div>
          <ChatArea />
        </div>
      </MaxWidthWrapper>
    </HydrateClient>
  );
}

export default Playground;
