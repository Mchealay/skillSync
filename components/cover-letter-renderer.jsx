/**
 * CoverLetterRenderer Component
 * Renders cover letter data into selected templates.
 */

import React from "react";
import { COVER_LETTER_TEMPLATES } from "@/lib/cover-letter-templates";
import { format } from "date-fns";

export function CoverLetterRenderer({ data, templateId = "professional" }) {
  const template = COVER_LETTER_TEMPLATES[templateId] || COVER_LETTER_TEMPLATES.professional;
  const { styles } = template;

  const SAMPLES = {
    userName: "Johnathan Doe",
    userEmail: "john.doe@techflow.com",
    userMobile: "+1 (555) 987-6543",
    userAddress: "New York, NY",
    companyName: "InnovateX Solutions",
    jobTitle: "Senior Product Director",
    content: "I am writing to express my enthusiastic interest in the Senior Product Director position at InnovateX Solutions, as advertised in your recent career posting. With over 12 years of experience in leading high-impact product teams and a proven track record of scaling SaaS platforms for global markets, I am confident that my strategic vision and technical leadership align perfectly with InnovateX's mission to redefine the analytics landscape.\n\nThroughout my career at TechFlow Systems, I have spearheaded the development of AI-driven engines that not only increased ARR by 35% but also radically improved user retention through intuitive UX overhauls. I pride myself on my ability to bridge the gap between complex engineering requirements and business growth objectives, ensuring that every product milestone delivers measurable value to stakeholders.\n\nI have long admired InnovateX's commitment to cutting-edge research and market-disrupting solutions. I am eager to bring my expertise in cross-functional team leadership and data-driven product strategy to your talented team and contribute to your continued success in the upcoming fiscal year. Thank you for your time and consideration of my candidacy."
  };

  const finalData = {
    ...SAMPLES,
    ...data
  };

  const { 
    content,
    companyName, 
    jobTitle, 
    userName, 
    userEmail, 
    userMobile, 
    userAddress 
  } = finalData;

  // Ensure content is always a string for safe rendering
  const safeContent = Array.isArray(content) ? content.join('\n\n') : (content || "");

  const Header = ({ dark = false }) => (
    <div className={styles.header}>
      <h1 className={`${styles.name} ${dark ? 'text-white' : ''}`}>{userName}</h1>
      <div className={styles.contact}>
        {userEmail && (
          <div className={styles.contactItem}>
            {templateId === "modern" && <span className={styles.contactLabel}>Email</span>}
            <span className={dark ? 'text-slate-300' : ''}>{userEmail}</span>
          </div>
        )}
        {userMobile && (
          <div className={styles.contactItem}>
            {templateId === "modern" && <span className={styles.contactLabel}>Phone</span>}
            <span className={dark ? 'text-slate-300' : ''}>{userMobile}</span>
          </div>
        )}
        {userAddress && (
          <div className={styles.contactItem}>
            {templateId === "modern" && <span className={styles.contactLabel}>Location</span>}
            <span className={dark ? 'text-slate-300' : ''}>{userAddress}</span>
          </div>
        )}
      </div>
    </div>
  );

  const LetterBody = () => (
    <div className={templateId === "creative" ? styles.body_container : ""}>
      <div className={styles.date}>{format(new Date(), "MMMM dd, yyyy")}</div>
      
      <div className={styles.recipient}>
        <p className="font-black text-slate-900 mb-1">To the Hiring Team at</p>
        <p className="text-xl font-black text-slate-900">{companyName}</p>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">{jobTitle} Role</p>
      </div>

      <div className={styles.content}>
        <div className={styles.salutation}>Dear Hiring Manager,</div>
        <div className={styles.body}>{safeContent}</div>
        <div className={styles.signature}>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Sincerely,</p>
          <p>{userName}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container} id="cover-letter-pdf">
      {templateId === "modern" ? (
        <>
          <div className={styles.sidebar}>
            <div className="mt-auto">
               <div className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] mb-6">Contact Info</div>
               <Header dark />
            </div>
          </div>
          <div className={styles.main}>
            <div className="mb-14">
               <h1 className={styles.name}>{userName}</h1>
               <div className="h-1 w-20 bg-slate-900 mt-4" />
            </div>
            <LetterBody />
          </div>
        </>
      ) : (
        <>
          <Header />
          <LetterBody />
        </>
      )}
    </div>
  );
}

