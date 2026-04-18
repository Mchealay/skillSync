"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { onboardingSchema } from "@/app/lib/schema";
import { updateUser } from "@/actions/user";

const OnboardingForm = ({ industries }) => {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile completed successfully!");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading]);

  const watchIndustry = watch("industry");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-96 mesh-gradient opacity-30 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        <Card className="glass-card !bg-card/30 border-white/10 shadow-3xl overflow-hidden">
          <CardHeader className="space-y-4 p-8 text-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-primary/20"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <div className="space-y-2">
              <CardTitle className="gradient-title text-5xl font-black">
                Elevate Your Career
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground/80">
                Identify your industry to unlock hyper-personalized AI insights and strategic career guidance.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-8 pb-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Industry</Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("industry", value);
                      setSelectedIndustry(
                        industries.find((ind) => ind.id === value)
                      );
                      setValue("subIndustry", "");
                    }}
                  >
                    <SelectTrigger id="industry" className="glass h-12 hover:border-primary/40 transition-all">
                      <SelectValue placeholder="Target Industry" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      <SelectGroup>
                        <SelectLabel>Available Industries</SelectLabel>
                        {industries.map((ind) => (
                          <SelectItem key={ind.id} value={ind.id}>
                            {ind.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className="text-xs font-medium text-destructive mt-1">
                      {errors.industry.message}
                    </p>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {watchIndustry ? (
                    <motion.div
                      key="subindustry"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="subIndustry" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Specialization</Label>
                      <Select
                        onValueChange={(value) => setValue("subIndustry", value)}
                      >
                        <SelectTrigger id="subIndustry" className="glass h-12 hover:border-primary/40 transition-all">
                          <SelectValue placeholder="Your Focus Area" />
                        </SelectTrigger>
                        <SelectContent className="glass border-white/10">
                          <SelectGroup>
                            <SelectLabel>Focus Areas</SelectLabel>
                            {selectedIndustry?.subIndustries.map((sub) => (
                              <SelectItem key={sub} value={sub}>
                                {sub}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.subIndustry && (
                        <p className="text-xs font-medium text-destructive mt-1">
                          {errors.subIndustry.message}
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center border border-dashed border-white/10 rounded-lg p-2 opacity-50">
                       <p className="text-[10px] text-center text-muted-foreground uppercase tracking-tighter">Select industry first</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Experience (Years)</Label>
                <div className="relative">
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="e.g., 5"
                    className="glass h-12 pl-4 focus-visible:ring-primary/20 transition-all"
                    {...register("experience")}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/30">YEARS</div>
                </div>
                {errors.experience && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Expertise & Skills</Label>
                <Input
                  id="skills"
                  placeholder="Python, React, Strategic Planning, AWS..."
                  className="glass h-12 focus-visible:ring-primary/20 transition-all"
                  {...register("skills")}
                />
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Separate with commas for optimal AI processing
                </p>
                {errors.skills && (
                  <p className="text-xs font-medium text-destructive mt-1">{errors.skills.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Professional Background</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell your professional story..."
                  className="glass min-h-[120px] focus-visible:ring-primary/20 transition-all resize-none"
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="text-xs font-medium text-destructive mt-1">{errors.bio.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all active:scale-95" disabled={updateLoading}>
                {updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Syncing Profile...
                  </>
                ) : (
                  "Finalize & Enter Dashboard"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};


export default OnboardingForm;
