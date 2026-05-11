"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="cursor-pointer rounded-full"
      onClick={() => window.print()}
    >
      <Download data-icon="inline-start" />
      打印 / PDF
    </Button>
  );
}
