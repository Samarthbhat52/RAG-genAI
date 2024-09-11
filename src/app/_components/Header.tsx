import React from "react";
import WebsiteIcon from "./Icon";

function Header() {
  return (
    <div className="flex h-16 items-center border border-border">
      <div className="flex h-full w-20 items-center justify-center border-r border-border p-4">
        <WebsiteIcon />
      </div>
      <div className="p-4"></div>
    </div>
  );
}

export default Header;
