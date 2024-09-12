import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import React from "react";

function AddPlayground() {
  return (
    <Button size="sm" className="flex items-center gap-2">
      Create <PlusSquare size={15} />
    </Button>
  );
}

export default AddPlayground;
