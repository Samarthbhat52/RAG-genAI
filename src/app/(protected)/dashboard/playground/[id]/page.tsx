import React from "react";
import ModelSettings from "../_components/ModelSettings";
import PDFList from "../_components/PdfList";

function Playground() {
  return (
    <div className="flex gap-3 p-10">
      <div className="space-y-8">
        <ModelSettings />
        <PDFList />
      </div>
      <div></div>
    </div>
  );
}

export default Playground;
