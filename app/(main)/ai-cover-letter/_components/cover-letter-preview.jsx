"use client";

import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const CoverLetterPreview = ({ type = "coverLetter", data }) => {
  const [editableContent, setEditableContent] = useState(data?.content);
  const pdfRef = useRef();

  const handleDownload = () => {
    if (!pdfRef.current) return;

    const opt = {
      margin: 0,
      filename: "cover-letter.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(pdfRef.current).set(opt).save();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableContent);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Copy failed");
    }
  };

  const rendererData = {
    ...data,
    content: editableContent,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Editor Section */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
           <h2 className="text-2xl font-black gradient-title">Edit Draft</h2>
           <p className="text-muted-foreground text-sm">Refine your AI-generated letter below. Changes reflect instantly in the template.</p>
        </div>
        
        <Textarea
          className="h-[600px] font-medium leading-relaxed bg-card/20 border-white/5 p-6 focus-visible:ring-primary shadow-2xl"
          value={editableContent}
          onChange={(e) => setEditableContent(e.target.value)}
        />

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 glass" onClick={handleCopy}>
            📋 Copy Text
          </Button>
          <Button className="flex-1 bg-primary" onClick={handleDownload}>
            📄 Download Premium PDF
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="lg:sticky lg:top-24 space-y-6">
        <div className="flex flex-col gap-2">
           <h2 className="text-2xl font-black gradient-title">Live Template Preview</h2>
           <p className="text-muted-foreground text-sm">This is how your document will look when exported. (Matched to Professional Style)</p>
        </div>
        
        <div className="bg-slate-200 p-8 rounded-2xl shadow-inner max-h-[800px] overflow-y-auto">
           <div className="shadow-2xl origin-top scale-[0.9] -mb-10 lg:scale-100 lg:mb-0">
             <div ref={pdfRef}>
                <CoverLetterRenderer 
                   data={rendererData} 
                   templateId={data?.templateId || "professional"} 
                />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

import { CoverLetterRenderer } from "@/components/cover-letter-renderer";


export default CoverLetterPreview;
