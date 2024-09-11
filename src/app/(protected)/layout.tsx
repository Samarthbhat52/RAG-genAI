import React from "react";
import Header from "../_components/Header";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1">{children}</div>
    </div>
  );
}

export default layout;
