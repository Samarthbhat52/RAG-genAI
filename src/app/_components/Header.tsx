import React from "react";
import WebsiteIcon from "./Icon";

function Header() {
  return (
    <div className="border-border flex h-16 items-center border">
      <div className="border-border flex h-full w-20 items-center justify-center border-r p-4">
        <WebsiteIcon />
      </div>
      <div className="p-4">content</div>
    </div>
  );
}

export default Header;
