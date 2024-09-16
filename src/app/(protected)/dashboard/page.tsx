import { MaxWidthWrapper } from "@/app/_components/MaxwidthWrapper";
import { lazy } from "react";
import OverviewCards from "./_components/Overview";
import { api, HydrateClient } from "@/trpc/server";
import { cn } from "@/lib/utils";
import { playfair } from "@/lib/fonts";
import AddPlayground from "./_components/AddPlayground";
import AllPlaygrounds from "./_components/AllPlaygrounds";
const MobileHeader = lazy(() => import("@/app/_components/MobileHeader"));

async function Dashboard() {
  await api.filesRouter.getAllFilesCount.prefetch();

  return (
    <HydrateClient>
      <div className="flex w-full flex-col">
        <MobileHeader />
        <MaxWidthWrapper className="space-y-12 p-6">
          <div className="space-y-6">
            <h1
              className={cn(
                "text-3xl font-bold sm:text-4xl md:text-5xl",
                playfair.className,
              )}
            >
              Overview
            </h1>
            <OverviewCards />
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1
                className={cn(
                  "text-3xl font-bold sm:text-4xl md:text-5xl",
                  playfair.className,
                )}
              >
                Playgrounds
              </h1>
              <AddPlayground />
            </div>

            <AllPlaygrounds />
          </div>
        </MaxWidthWrapper>
      </div>
    </HydrateClient>
  );
}

export default Dashboard;
