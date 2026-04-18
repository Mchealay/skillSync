import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  const rendererData = {
    content: coverLetter?.content,
    companyName: coverLetter?.companyName,
    jobTitle: coverLetter?.jobTitle,
    templateId: coverLetter?.templateId,
    userName: coverLetter?.user.name,
    userEmail: coverLetter?.user.email,
    userMobile: coverLetter?.user.mobile, // Assuming mobile exists or add it
    userAddress: coverLetter?.user.address,
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-2 mb-8">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Button>
        </Link>

        <h1 className="text-5xl font-black gradient-title">
          {coverLetter?.jobTitle} 
          <span className="text-slate-500 font-medium block text-2xl mt-2">Draft for {coverLetter?.companyName}</span>
        </h1>
      </div>

      <CoverLetterPreview data={rendererData} />
    </div>
  );
}
