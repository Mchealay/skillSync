/**
 * ResumeRenderer Component
 * Generic component to render structured resume data into various templates.
 */

import React from "react";
import { RESUME_TEMPLATES } from "@/lib/resume-templates";

export function ResumeRenderer({ data, templateId = "professional" }) {
  const template = RESUME_TEMPLATES[templateId] || RESUME_TEMPLATES.professional;
  const { styles } = template;

  // Ultra-Premium Canva Samples
  const SAMPLES = {
    fullName: "Johnathan Doe",
    summary: "Strategic Thought Leader and Senior Product Executive with 12+ years of experience in scaling high-growth SaaS platforms. Expert in leveraging AI/ML to drive product innovation, optimizing cross-functional workflows, and leading global teams to deliver user-centric solutions that capture market share and drive multi-million dollar revenue growth.",
    skills: ["Product Strategy", "Growth Hacking", "AI/ML Integration", "Agile Leadership", "Cross-functional Management", "User Experience (UX)", "Stakeholder Relations", "Data-Driven Decision Making"],
    experience: [
      {
        title: "Senior Product Director",
        organization: "TechFlow Systems (Global)",
        startDate: "Mar 2021",
        endDate: "Present",
        current: true,
        description: "Spearheaded the launch of a flagship AI-powered analytics engine, resulting in a 35% increase in ARR within 12 months.\nOrchestrated a global team of 45+ across engineering, design, and marketing to streamline the product lifecycle.\nImplemented a data-driven prioritization framework that reduced time-to-market by 22%."
      },
      {
        title: "Lead Product Manager",
        organization: "InnovateX Solutions",
        startDate: "Jan 2018",
        endDate: "Feb 2021",
        current: false,
        description: "Redesigned the core mobile application, achieving a 4.8-star rating on the App Store and 1M+ active users.\nNegotiated critical partnerships with third-party providers, saving $500K in annual operational costs.\nMentored a team of 5 junior PMs, all of whom were promoted within two years."
      }
    ],
    education: [
      {
        title: "MBA in Strategic Management",
        organization: "Stanford Graduate School of Business",
        startDate: "2015",
        endDate: "2017"
      },
      {
        title: "B.S. in Computer Science",
        organization: "Massachusetts Institute of Technology (MIT)",
        startDate: "2011",
        endDate: "2015"
      }
    ]
  };

  const finalData = {
    ...SAMPLES,
    ...data,
    contactInfo: {
      email: data?.contactInfo?.email || "john.doe@techflow.com",
      mobile: data?.contactInfo?.mobile || "+1 (555) 987-6543",
      linkedin: data?.contactInfo?.linkedin || "linkedin.com/in/johnathandoe",
      ...data?.contactInfo
    }
  };

  const { contactInfo, summary, skills, experience, education, projects = [] } = finalData;

  // Helper for item rendering
  const renderItem = (item, index) => (
    <div key={index} className="mb-6 group">
      <div className={styles.itemSubtitle}>
        <span className={styles.itemTitle}>{item.title}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          {item.startDate} — {item.current ? "Present" : item.endDate}
        </span>
      </div>
      <div className="text-sm font-black text-slate-500 mb-3 uppercase tracking-wider">{item.organization}</div>
      <ul className={styles.itemDescription}>
        {item.description?.split('\n').filter(l => l.trim()).map((line, i) => (
          <li key={i} className="relative">
            {line.replace(/^[•\-\*]\s*/, '')}
          </li>
        ))}
      </ul>
    </div>
  );

  const Header = () => (
    <div className={styles.header}>
      <h1 className={`${styles.name} ${templateId === 'creative' ? 'text-white' : 'text-slate-900'}`}>{finalData.fullName}</h1>
      <div className={styles.contact}>
        {contactInfo.email && (
          <div className={styles.contactItem}>
            {templateId === "modern" && <span className={styles.contactLabel}>Email</span>}
            <span className={templateId === 'creative' ? 'text-slate-300' : ''}>{contactInfo.email}</span>
          </div>
        )}
        {contactInfo.mobile && (
          <div className={styles.contactItem}>
            {templateId === "modern" && <span className={styles.contactLabel}>Phone</span>}
            <span className={templateId === 'creative' ? 'text-slate-300' : ''}>{contactInfo.mobile}</span>
          </div>
        )}
        {contactInfo.linkedin && (
          <div className={styles.contactItem}>
            {templateId === "modern" && <span className={styles.contactLabel}>LinkedIn</span>}
            <span className={templateId === 'creative' ? 'text-slate-300' : ''}>{contactInfo.linkedin}</span>
          </div>
        )}
      </div>
    </div>
  );

  const MainContent = () => (
    <div className={styles.main}>
      {/* Summary */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile</h2>
        <div className="text-[0.95rem] leading-relaxed text-slate-600 font-medium">{summary}</div>
      </div>

      {/* Work Experience */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        <div className={styles.content}>
          {experience.length > 0 ? experience.map(renderItem) : (
            <p className="text-xs italic text-slate-300">Add your experience to replace this sample...</p>
          )}
        </div>
      </div>

      {/* Projects */}
      {projects.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Projects</h2>
          <div className={styles.content}>
            {projects.map(renderItem)}
          </div>
        </div>
      )}
    </div>
  );

  const SidebarContent = () => (
    <div className={styles.sidebar}>
      {/* Skills */}
      <div className={styles.section}>
        <h2 className={`${templateId === "modern" || templateId === "creative" ? styles.sidebarSectionTitle : styles.sectionTitle} ${templateId === 'modern' ? 'text-slate-300' : ''}`}>
          Expertise
        </h2>
        <div className="flex flex-wrap gap-2">
          {(Array.isArray(skills) ? skills : skills.split(',')).map((s, i) => (
            <span key={i} className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${templateId === "modern" || templateId === "creative" ? 'bg-slate-800 text-slate-300 italic' : 'bg-slate-100 text-slate-700'}`}>
              {s.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className={styles.section}>
        <h2 className={`${templateId === "modern" || templateId === "creative" ? styles.sidebarSectionTitle : styles.sectionTitle} ${templateId === 'modern' ? 'text-slate-300' : ''}`}>
          Education
        </h2>
        <div className="space-y-6">
          {education.map((edu, i) => (
            <div key={i} className="group">
              <div className={`font-black uppercase tracking-widest text-xs mb-1 ${templateId === 'modern' || templateId === 'creative' ? 'text-white' : 'text-slate-900'}`}>{edu.title}</div>
              <div className={`text-[10px] font-bold uppercase tracking-tighter mb-1 ${templateId === 'modern' || templateId === 'creative' ? 'text-slate-400' : 'text-slate-500'}`}>{edu.organization}</div>
              <div className="text-[9px] font-black text-slate-500 uppercase">{edu.startDate} — {edu.endDate}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  return (
    <div className={styles.container} id="resume-pdf">
      {templateId === "modern" ? (
        <>
          <SidebarContent />
          <div className={styles.main}>
            <Header />
            <div className="mt-8">
               <MainContent />
            </div>
          </div>
        </>
      ) : templateId === "creative" ? (
        <>
          <Header />
          <div className={styles.body}>
            <MainContent />
            <SidebarContent />
          </div>
        </>
      ) : (
        <>
          <Header />
          <MainContent />
          <SidebarContent />
        </>
      )}
    </div>
  );
}

