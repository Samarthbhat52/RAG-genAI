import React from "react";
import Sidebar from "../_components/Sidebar";
import Header from "../_components/Header";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="border-border flex flex-1 border-x">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}

export default layout;
