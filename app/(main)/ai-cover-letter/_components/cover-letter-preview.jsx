"use client";

import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const CoverLetterPreview = ({ type = "coverLetter", data }) => {
  const [editableContent, setEditableContent] = useState(data?.content);
  const pdfRef = useRef();
  const previewContainerRef = useRef(null);

  // Sync content when data updates from parent
  useEffect(() => {
    if (data?.content) {
      setEditableContent(data.content);
    }
  }, [data?.content]);

  // Dynamically scale the preview to fill the container
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;
    
    const PREVIEW_WIDTH = 800; // Reference width
    const applyScale = () => {
      const available = container.offsetWidth;
      const scale = Math.min((available - 32) / PREVIEW_WIDTH, 1);
      container.style.setProperty("--preview-scale", scale.toFixed(4));
      // Adjust height to match scaled content
      const scaledHeight = 1100 * scale; 
      container.style.height = `${Math.max(scaledHeight + 40, 400)}px`;
    };

    applyScale();
    const ro = new ResizeObserver(applyScale);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

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
           <p className="text-muted-foreground text-sm">Matched to <span className="text-primary font-bold capitalize">{data?.templateId || "Professional"}</span> Style</p>
        </div>
        
        <div className="bg-slate-200/50 dark:bg-slate-900/50 p-4 sm:p-8 rounded-3xl shadow-inner border border-white/5 overflow-hidden">
           <div 
             ref={previewContainerRef}
             className="relative overflow-auto transition-all duration-500 rounded-xl"
           >
              <div
                className="absolute inset-0 flex items-start justify-center py-4 px-2"
              >
                <div 
                  className="origin-top shadow-2xl bg-white"
                  style={{
                    width: "800px",
                    transform: "scale(var(--preview-scale, 0.85))",
                    transformOrigin: "top center",
                  }}
                >
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
      </div>
    </div>
  );
};

import { CoverLetterRenderer } from "@/components/cover-letter-renderer";


export default CoverLetterPreview;
