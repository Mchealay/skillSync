"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { generateCoverLetter } from "@/actions/cover-letter";
import { coverLetterSchema } from "@/app/lib/schema";


// TEMP INLINE schema (replace with import if needed)
const schema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  tone: z.enum(["professional", "friendly", "enthusiastic"]),
  companyName: z.string().min(1, "Company Name is required"),
  jobTitle: z.string().min(1, "Job Title is required"),
  jobDescription: z.string().min(10, "Job Description is too short"),
});

import { useSearchParams } from "next/navigation";
import { COVER_LETTER_TEMPLATES } from "@/lib/cover-letter-templates";
import { Check } from "lucide-react";
import { useState } from "react";

export default function CoverLetterGenerator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialJobDescription = searchParams.get("jobDescription") || "";
  const [selectedTemplate, setSelectedTemplate] = useState("professional");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      jobDescription: initialJobDescription,
    }
  });


  const {
    loading: generating,
    fn: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter);

  const onSubmit = async (data) => {
    try {
      await generateLetterFn({
        ...data,
        templateId: selectedTemplate,
      });
    } catch (error) {
      console.error("error:", error);
      toast.error(error.message || "Error generating cover letter");
    }
  };

  useEffect(() => {
    if (generatedLetter) {
      toast.success("Cover letter generated!");
      router.push(`/ai-cover-letter/${generatedLetter.id}`);
      reset();
    }
  }, [generatedLetter]);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black gradient-title">Design Your Cover Letter</h1>
        <p className="text-muted-foreground text-lg">Select a template and provide details to generate an AI-tailored masterpiece.</p>
      </div>

      {/* Template Selection */}
      <div className="space-y-4">
        <Label className="text-sm font-black uppercase tracking-widest text-slate-500">Step 1: Choose Your Style</Label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.values(COVER_LETTER_TEMPLATES).map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`group cursor-pointer relative overflow-hidden rounded-2xl border-2 transition-all duration-500 hover:scale-[1.05] ${
                selectedTemplate === template.id
                  ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10"
                  : "border-white/5 bg-card/20 grayscale hover:grayscale-0"
              }`}
            >
              <div className="aspect-[3/4] p-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-black text-lg">{template.name}</h3>
                  <div className="w-10 h-1 bg-slate-200 rounded-full group-hover:bg-primary transition-colors" />
                </div>
                
                {selectedTemplate === template.id && (
                   <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full animate-in zoom-in">
                     <Check className="h-4 w-4" />
                   </div>
                )}
                
                {/* Real-Text Miniature Previews (Tiny but descriptive) */}
                <div className="mt-4 flex-1 rounded-lg border border-dashed border-slate-700 bg-slate-900/50 p-4 overflow-hidden relative text-[3px] font-medium leading-[1.1]">
                    {/* Skeleton Layout matched to Template ID */}
                    <div className="w-full h-full flex flex-col gap-3">
                         {template.id === 'modern' ? (
                            <div className="flex gap-2 h-full">
                               <div className="w-[30%] bg-slate-800 rounded flex flex-col gap-2 p-1 text-slate-400">
                                  <div className="h-1 w-full bg-slate-700/50 rounded-full mb-1" />
                                  <div className="space-y-0.5">
                                    <div className="tracking-widest font-black text-slate-500 uppercase text-[2px]">Contact</div>
                                    <div className="truncate">john@doe.com</div>
                                    <div className="truncate">+1 555-0000</div>
                                  </div>
                               </div>
                               <div className="w-[70%] flex flex-col gap-2 p-1 text-slate-400">
                                  <div className="h-3 w-3/4 bg-slate-700/30 rounded-sm mb-1" />
                                  <div className="space-y-1">
                                    <div className="tracking-widest font-black text-slate-600 uppercase text-[2px]">September 12, 2026</div>
                                    <p className="line-clamp-4">I am writing to express my strong interest in the Senior Product Lead position... My background in scaling SaaS platforms aligns with your mission...</p>
                                    <div className="mt-2 text-slate-300 font-bold">Sincerely, John Doe</div>
                                  </div>
                               </div>
                            </div>
                         ) : template.id === 'creative' ? (
                            <div className="flex flex-col gap-3 h-full uppercase tracking-tighter">
                               <div className="h-[30%] bg-slate-800 rounded flex items-center p-2 justify-between text-white">
                                  <div className="text-[10px] font-black">J. DOE</div>
                               </div>
                               <div className="grid grid-cols-2 gap-2 p-1 text-slate-500">
                                  <div className="space-y-2">
                                     <div className="font-black text-slate-400 border-b border-slate-700 pb-0.5">RECIPIENT</div>
                                     <div className="space-y-1">
                                        <div className="font-bold text-slate-300">TechCorp</div>
                                        <div className="h-[1px] w-full bg-slate-800 rounded" />
                                     </div>
                                  </div>
                                  <div className="space-y-2">
                                     <div className="font-black text-slate-400 border-b border-slate-700 pb-0.5">CONTENT</div>
                                     <p className="line-clamp-3 text-[2px]">Enthusiastic to contribute to your growth strategy...</p>
                                  </div>
                               </div>
                            </div>
                         ) : template.id === 'professional' ? (
                            <div className="flex flex-col items-center gap-2 h-full p-2 text-center text-slate-400">
                               <div className="text-slate-200 text-[8px] font-black tracking-[0.2em] mb-1">JOHN DOE</div>
                               <div className="w-full h-[1px] bg-slate-800" />
                               <div className="space-y-2 w-full text-left pt-2">
                                 <div className="font-black text-slate-600 uppercase text-[2px]">Official Letter</div>
                                 <p className="line-clamp-4 italic">Highly motivated professional seeking to apply my 10+ years experience to your engineering team's current challenges...</p>
                               </div>
                            </div>
                         ) : (
                            <div className="flex flex-col gap-3 h-full pt-4 text-slate-400">
                               <div className="text-white text-[8px] font-black border-b border-slate-800 pb-1">ATS MINIMALIST</div>
                               <div className="space-y-2 w-full">
                                 <div className="flex justify-between font-bold text-slate-500">
                                    <span>To: Hiring Team</span>
                                    <span>2026</span>
                                 </div>
                                 <p className="line-clamp-2">Experienced leader with a focal point on operational excellence and reliability.</p>
                               </div>
                            </div>
                         )}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="glass-card !bg-card/30 border-white/10 overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5">
          <CardTitle className="text-2xl font-black">Step 2: Provide Context</CardTitle>
          <CardDescription>Our AI uses these details to write a letter that perfectly matches the selected style.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Full Name</Label>
                <Input {...register("fullName")} className="glass h-12" placeholder="e.g., Alexander Smith" />
                {errors.fullName && <p className="text-destructive text-xs font-bold mt-1">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Desired Tone</Label>
                <select {...register("tone")} className="w-full glass h-12 px-3 rounded-md border-none focus:ring-1 focus:ring-primary outline-none appearance-none">
                  <option value="professional">🤵 Professional & Corporate</option>
                  <option value="friendly">🤝 Friendly & Approachable</option>
                  <option value="enthusiastic">⚡ Enthusiastic & Passionate</option>
                </select>
                {errors.tone && <p className="text-destructive text-xs font-bold mt-1">{errors.tone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Name</Label>
                <Input {...register("companyName")} className="glass h-12" placeholder="e.g., Google" />
                {errors.companyName && <p className="text-destructive text-xs font-bold mt-1">{errors.companyName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Job Title</Label>
                <Input {...register("jobTitle")} className="glass h-12" placeholder="e.g., Senior Frontend Engineer" />
                {errors.jobTitle && <p className="text-destructive text-xs font-bold mt-1">{errors.jobTitle.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Job Description</Label>
              <Textarea {...register("jobDescription")} className="glass h-48 resize-none p-4" placeholder="Paste the job requirements here for maximum tailoring..." />
              {errors.jobDescription && <p className="text-destructive text-xs font-bold mt-1">{errors.jobDescription.message}</p>}
            </div>

            <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-black rounded-2xl shadow-2xl shadow-primary/20 transition-all active:scale-95" disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Orchestrating AI Magic...
                </>
              ) : (
                "Generate Tailored Cover Letter"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

