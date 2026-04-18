"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Layout, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  Download,
  Mail,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { RESUME_TEMPLATES } from "@/lib/resume-templates";
import { ResumeRenderer } from "@/components/resume-renderer";
import { generateStructuredResume, saveResume, updateResumeSettings } from "@/actions/resume";
import useFetch from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, title: "Choose Template", icon: Layout },
  { id: 2, title: "Tailor Content", icon: Zap },
  { id: 3, title: "Finalize", icon: FileText },
  { id: 4, title: "Cover Letter", icon: Mail },
];

export default function ProResumeBuilder({ initialData }) {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialData ? 3 : 1);
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeData, setResumeData] = useState(initialData || null);
  const [jsonString, setJsonString] = useState(JSON.stringify(initialData, null, 2) || "");
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    loading: isSaving,
    fn: saveResumeFn,
  } = useFetch(saveResume);

  const {
    loading: isSettingUpdate,
    fn: updateSettingsFn,
  } = useFetch(updateResumeSettings);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateStructuredResume(jobDescription);
      setResumeData(data);
      setJsonString(JSON.stringify(data, null, 2));
      setCurrentStep(3);
      toast.success("Resume tailored successfully!");
    } catch (error) {
      toast.error("Failed to generate resume. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalize = async () => {
    try {
      // Save content as JSON string (or markdown formatted)
      // For simplicity in this version, we save as JSON string for the renderer
      await saveResumeFn(JSON.stringify(resumeData));
      await updateSettingsFn({ 
        templateId: selectedTemplate, 
        jobDescription 
      });
      toast.success("Resume finalized and saved!");
      setCurrentStep(4);
    } catch (error) {
      toast.error("Failed to save resume.");
    }
  };

  const generatePDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("resume-pdf");
    const opt = {
      margin: 0,
      filename: `resume-${selectedTemplate}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* 🧭 Progress Tracker */}
      <div className="flex justify-between items-center mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 dark:bg-gray-800" />
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-4">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : 
                  isCompleted ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400 dark:bg-gray-800"}
              `}>
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-gray-500"}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Choose Template */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold gradient-title">Select Your Style</h2>
              <p className="text-muted-foreground">Choose a template that best fits your industry and personality.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(RESUME_TEMPLATES).map((template) => (
                <div 
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`
                    relative cursor-pointer group rounded-xl overflow-hidden border-2 transition-all duration-300
                    ${selectedTemplate === template.id ? 'border-primary ring-4 ring-primary/10' : 'border-transparent hover:border-gray-200'}
                  `}
                >
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
                      {/* Real-Text Miniature Previews (Tiny but descriptive) */}
                      <div className="w-full h-full bg-white shadow-lg origin-top scale-75 group-hover:scale-110 transition-transform duration-500 rounded sm overflow-hidden relative text-[3px] font-medium leading-tight">
                         {template.id === 'modern' ? (
                            <div className="flex h-full">
                               <div className="w-1/3 bg-slate-900 flex flex-col gap-2 p-2 text-slate-400">
                                  <div className="h-2 w-full bg-slate-700/50 rounded-full mb-1" />
                                  <div className="space-y-1">
                                    <div className="tracking-widest font-black text-slate-500">CONTACT</div>
                                    <div>123 Street Ave</div>
                                    <div>john@doe.com</div>
                                  </div>
                                  <div className="mt-4 space-y-1">
                                     <div className="tracking-widest font-black text-slate-500">EXPERTISE</div>
                                     <div className="flex flex-wrap gap-0.5">
                                       <span className="bg-slate-800 px-1 rounded-full text-[2px]">Strategy</span>
                                       <span className="bg-slate-800 px-1 rounded-full text-[2px]">AI/ML</span>
                                     </div>
                                  </div>
                               </div>
                               <div className="w-2/3 p-4 flex flex-col gap-4">
                                  <div>
                                     <div className="text-slate-900 text-[8px] font-black leading-none">JOHNATHAN DOE</div>
                                     <div className="text-slate-500 text-[5px] font-bold mt-1">Senior Product Executive</div>
                                  </div>
                                  <div className="space-y-1 text-slate-400">
                                    <div className="font-black text-slate-800 text-[4px]">PROFESSIONAL SUMMARY</div>
                                    <p className="line-clamp-3">Strategic thought leader with 12+ years experience scaling SaaS platforms and driving multi-million dollar revenue growth...</p>
                                  </div>
                                  <div className="space-y-2 mt-1">
                                    <div className="font-black text-slate-800 text-[4px]">WORK EXPERIENCE</div>
                                    <div className="flex justify-between items-start">
                                       <div className="font-black text-slate-700">TechFlow Systems</div>
                                       <div className="text-[2px]">2021 — Pres</div>
                                    </div>
                                    <p className="line-clamp-2">Spearheaded the launch of a flagship AI-powered analytics engine...</p>
                                  </div>
                               </div>
                            </div>
                         ) : template.id === 'creative' ? (
                            <div className="flex flex-col h-full uppercase tracking-tighter">
                               <div className="h-1/3 bg-slate-900 p-4 flex flex-col justify-end text-white">
                                  <div className="text-[12px] font-black leading-none">J. DOE</div>
                                  <div className="text-[5px] font-bold text-slate-400">Product Leader</div>
                               </div>
                               <div className="p-4 grid grid-cols-2 gap-4 text-slate-500">
                                  <div className="space-y-2">
                                     <div className="font-black text-slate-800 border-b-2 border-slate-100 pb-1">EXPERIENCE</div>
                                     <div className="space-y-1">
                                        <div className="font-bold text-slate-600">InnovateX</div>
                                        <div className="h-1 w-full bg-slate-50 rounded" />
                                        <div className="h-1 w-2/3 bg-slate-50 rounded" />
                                     </div>
                                  </div>
                                  <div className="space-y-2">
                                     <div className="font-black text-slate-800 border-b-2 border-slate-100 pb-1">EXPERTISE</div>
                                     <div className="flex flex-wrap gap-1">
                                       <span className="bg-slate-100 px-1 rounded">GROWTH</span>
                                       <span className="bg-slate-100 px-1 rounded">EXECUTION</span>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         ) : template.id === 'professional' ? (
                            <div className="flex flex-col items-center p-6 gap-3 text-center">
                               <div className="text-slate-900 text-[10px] font-black tracking-[0.2em]">JOHN DOE</div>
                               <div className="flex gap-2 text-[3px] font-bold text-slate-400">
                                  <span>Email</span> <span>•</span> <span>Phone</span> <span>•</span> <span>LinkedIn</span>
                               </div>
                               <div className="w-full h-0.5 bg-slate-900 mt-1" />
                               <div className="space-y-2 w-full text-left mt-2">
                                  <div className="text-[5px] font-black text-slate-800 border-b border-slate-200">WORK HISTORY</div>
                                  <div className="flex justify-between font-bold text-slate-600">
                                     <span>Senior Strategy Lead</span>
                                     <span>2020-Present</span>
                                  </div>
                                  <p className="text-slate-400 line-clamp-3">Spearheaded $5M digital transformation projects for Fortune 500...</p>
                               </div>
                            </div>
                         ) : (
                            <div className="p-6 space-y-4 text-black font-sans leading-tight">
                               <div className="text-center">
                                  <div className="text-[10px] font-black">JOHN DOE</div>
                                  <div className="text-[4px] border-y border-slate-100 py-1 mt-2">Home | Email | Phone</div>
                               </div>
                               <div className="pt-2 space-y-3">
                                  <div className="text-[5px] font-black border-b-2 border-slate-900">EXPERIENCE</div>
                                  <div>
                                     <div className="flex justify-between font-bold">
                                        <span>Product Manager</span>
                                        <span>2018-2021</span>
                                     </div>
                                     <p className="text-slate-500 mt-1">Lead development teams to scale core product features...</p>
                                  </div>
                               </div>
                            </div>
                         )}
                      </div>
                  </div>
                  <div className="p-4 bg-background/80 backdrop-blur-md absolute bottom-0 w-full border-t">
                    <h3 className="font-bold text-sm">{template.name}</h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <Button size="lg" onClick={() => setCurrentStep(2)} className="rounded-full px-8">
                Next <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Tailor Content */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 max-w-2xl mx-auto"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold gradient-title flex items-center justify-center gap-2">
                <Sparkles className="text-primary w-8 h-8" />
                Tailor with AI
              </h2>
              <p className="text-muted-foreground">Paste the job description and let our AI optimize your resume for the role.</p>
            </div>

            <Card className="border-2 border-primary/10 overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Job Description (Optional)</label>
                  <Textarea 
                    placeholder="Paste the job requirements here..."
                    className="min-h-[200px] border-none focus-visible:ring-0 resize-none bg-muted/20"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-6">
              <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                <ChevronLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button size="lg" onClick={handleGenerate} disabled={isGenerating} className="rounded-full px-8 relative overflow-hidden group">
                 {isGenerating ? (
                   <>
                     <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Tailoring...
                   </>
                 ) : (
                   <>
                     Tailor My Resume <Zap className="ml-2 w-4 h-4 text-yellow-400 group-hover:scale-125 transition-transform" />
                   </>
                 )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Finalize & Edit */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 py-4 z-50 border-b">
               <div className="flex items-center gap-4">
                 <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)}>
                   <ChevronLeft className="w-4 h-4 mr-2" /> Back
                 </Button>
                 <div className="hidden sm:block">
                   <h2 className="text-lg font-bold">Refine & Finalize</h2>
                   <p className="text-xs text-muted-foreground">Template: <span className="capitalize text-primary font-medium">{selectedTemplate}</span></p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" onClick={generatePDF}>
                   <Download className="w-4 h-4 mr-2" /> Download PDF
                 </Button>
                 <Button size="sm" onClick={handleFinalize} disabled={isSaving}>
                   {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save & Continue"}
                 </Button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
               {/* ✍️ Editor Section */}
               <div className="space-y-6">
                 <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-black gradient-title">Edit Resume Data</h3>
                    <p className="text-muted-foreground text-sm">Fine-tune the content below. Changes reflect instantly in the live preview.</p>
                 </div>
                 
                 <div className="relative group">
                    <Textarea
                      className="h-[800px] font-mono text-xs leading-relaxed bg-card/20 border-white/5 p-6 focus-visible:ring-primary shadow-2xl transition-all duration-300 group-hover:bg-card/30"
                      value={jsonString}
                      onChange={(e) => {
                        const newString = e.target.value;
                        setJsonString(newString);
                        try {
                          const parsed = JSON.parse(newString);
                          setResumeData(parsed);
                        } catch (err) {
                          // Silently fail preview update if JSON is invalid while typing
                        }
                      }}
                    />
                    
                    {/* Floating help tip */}
                    <div className="absolute bottom-4 right-4 bg-primary/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/20 text-[10px] font-bold text-primary flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap className="w-3 h-3" /> Valid JSON Required
                    </div>
                 </div>
               </div>

               {/* 🖼️ Live Preview Section */}
               <div className="sticky top-24 space-y-6">
                 <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-black gradient-title">Live Preview</h3>
                    <p className="text-muted-foreground text-sm">Professional orientation (A4 format). Best for standard recruitment.</p>
                 </div>

                 <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-2xl shadow-inner max-h-[900px] overflow-y-auto flex justify-center border-2 border-dashed border-primary/10">
                    <div className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] origin-top scale-[0.9] lg:scale-100 -mb-20 lg:mb-0 transition-transform duration-500">
                      <ResumeRenderer data={resumeData} templateId={selectedTemplate} />
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Cover Letter Redirect */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 space-y-8 max-w-xl mx-auto"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-bold">Resume Complete!</h2>
            <p className="text-xl text-muted-foreground">
              Your tailored resume is saved. Would you like to generate a matching cover letter for this role?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="rounded-full px-10" 
                onClick={() => router.push(`/ai-cover-letter/new?jobDescription=${encodeURIComponent(jobDescription)}`)}
              >
                Generate Cover Letter <Mail className="ml-2 w-5 h-5" />
              </Button>

              <Button variant="outline" size="lg" className="rounded-full px-10" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
