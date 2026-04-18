import { getResume } from "@/actions/resume";
import ProResumeBuilder from "./_components/pro-builder";

export default async function ResumePage() {
  const resume = await getResume();
  
  // Try to parse content as JSON if it exists, otherwise pass null
  let initialData = null;
  if (resume?.content) {
    try {
      initialData = JSON.parse(resume.content);
    } catch (e) {
      // Fallback if content was markdown
      console.log("Existing resume was markdown, starting fresh with Pro builder");
    }
  }

  return (
    <div className="container mx-auto py-10">
      <ProResumeBuilder initialData={initialData} />
    </div>
  );
}
