import { lazy } from "react";
const MobileHeader = lazy(() => import("@/app/_components/MobileHeader"));

function Dashboard() {
  return (
    <div className="flex w-full flex-col">
      <MobileHeader />
      <div></div>
    </div>
  );
}

export default Dashboard;
