import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FilePlus } from "lucide-react";
import React from "react";
import { FaRegFilePdf } from "react-icons/fa6";

// TODO: Fetch PDFs from database later
const pdfs = [
  { id: 1, name: "AnnualReport2023.pdf" },
  { id: 2, name: "ProductManual_ModelXYZ.pdf" },
  { id: 3, name: "Presentation_NewProject.pdf" },
  { id: 4, name: "Invoice_ClientName_001.pdf" },
  { id: 5, name: "ResearchPaper_Topic.pdf" },
  { id: 6, name: "Resume_YourName.pdf" },
  { id: 7, name: "Tutorial_HowTo.pdf" },
  { id: 8, name: "Ebook_Title.pdf" },
  { id: 9, name: "Whitepaper_Industry.pdf" },
  { id: 10, name: "CaseStudy_SuccessStory.pdf" },
];

function PDFList() {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border p-4">
      <div className="flex items-center justify-between">
        <Label className="text-md font-semibold">Uploaded documents</Label>
        <Button size="sm" variant="secondary" className="flex gap-2">
          Upload
          <FilePlus size={15} />
        </Button>
      </div>

      <ScrollArea className="h-72">
        {pdfs.map((pdf) => (
          <div
            className="mt-4 flex items-center gap-2 rounded-md bg-secondary p-2"
            key={pdf.id}
          >
            <FaRegFilePdf size={23} />
            <span className="font-medium">{pdf.name}</span>
          </div>
        ))}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}

export default PDFList;
