import React from "react";
import ModelSettings from "../_components/ModelSettings";
import PDFList from "../_components/PdfList";
import ChatArea from "../_components/ChatArea";
import ChatInput from "../_components/ChatInput";

function Playground() {
  return (
    <div className="flex flex-1 justify-center gap-4 p-10">
      <div className="hidden h-full w-1/4 flex-col space-y-4 lg:flex">
        <ModelSettings />
        <PDFList />
      </div>
      <div className="flex w-3/4 flex-col justify-between rounded-md border border-border bg-card p-4">
        <ChatArea />
        <ChatInput />
      </div>
    </div>
  );
}

export default Playground;
