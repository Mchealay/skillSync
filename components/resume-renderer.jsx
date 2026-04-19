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

  const Header = () => {
    if (templateId === "executive") return null; // Handled in Sidebar & MainContent for executive
    
    return (
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
  };

  const MainContent = () => (
    <div className={styles.main}>
      {templateId === "executive" && <div className={styles.rightTopAccent}></div>}
      
      {/* Summary */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile</h2>
        <div className="text-[0.95rem] leading-relaxed text-slate-600 font-medium">{summary}</div>
      </div>

      {/* Education moved to Main Content exactly under Profile for executive template */}
      {templateId === "executive" && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className="flex flex-col gap-3 w-full">
            {education.map((edu, i) => (
              <div key={i} className={styles.educationItem}>
                  <div className={styles.educationDegree}>{edu.title}</div>
                  <div className={styles.educationSchool}>• {edu.organization} ({edu.startDate}-{edu.endDate || 'Present'})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Work Experience</h2>
        <div className={templateId === "executive" ? styles.gridTwoCols : styles.content}>
          {experience.length > 0 ? experience.map((item, index) => (
             templateId === "executive" ? (
                <div key={index} className={styles.itemContainer}>
                   <div className={styles.itemTitle}>{item.title}</div>
                   <div className={styles.itemOrganization}>{item.organization}</div>
                   <div className={styles.itemSubtitle}>
                      <span>{item.startDate} — {item.current ? "Present" : item.endDate}</span>
                   </div>
                   <ul className={styles.itemDescription}>
                     {item.description?.split('\n').filter(l => l.trim()).map((line, i) => (
                       <li key={i} className="relative">{line.replace(/^[•\-\*]\s*/, '')}</li>
                     ))}
                   </ul>
                </div>
             ) : renderItem(item, index)
          )) : (
            <p className="text-xs italic text-slate-300">Add your experience to replace this sample...</p>
          )}
        </div>
      </div>

      {/* Projects */}
      {projects.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Projects</h2>
          <div className={styles.content}>
            {projects.map((item, index) => (
              templateId === "executive" ? (
                 <div key={index} className={styles.itemContainer}>
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={styles.itemOrganization}>{item.organization}</div>
                    <div className={styles.itemSubtitle}>
                       <span>{item.startDate} — {item.current ? "Present" : item.endDate}</span>
                    </div>
                    <ul className={styles.itemDescription}>
                      {item.description?.split('\n').filter(l => l.trim()).map((line, i) => (
                        <li key={i} className="relative">{line.replace(/^[•\-\*]\s*/, '')}</li>
                      ))}
                    </ul>
                 </div>
              ) : renderItem(item, index)
            ))}
          </div>
        </div>
      )}

      {/* Sections moved from sidebar for executive template */}
      {templateId === "executive" && (
        <div className={styles.gridTwoCols}>
          <div className="w-full">
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.skillsList}>
              {(Array.isArray(skills) ? skills : skills.split(',')).map((s, i) => (
                <div key={i} className={styles.skillItem}>{s.trim()}</div>
              ))}
            </div>
          </div>
          <div className="w-full">
            <h2 className={styles.sectionTitle}>Languages</h2>
            <div className="flex flex-col gap-2 w-full">
              {/* Hardcoded Sample Languages to match image - ideally this should be from data */}
              <div className="text-[11px] font-medium text-gray-700 flex items-center gap-2 before:content-['■'] before:text-[#0e1b34] before:text-[8px]">Indonesian</div>
              <div className="text-[11px] font-medium text-gray-700 flex items-center gap-2 before:content-['■'] before:text-[#0e1b34] before:text-[8px]">Arabic</div>
              <div className="text-[11px] font-medium text-gray-700 flex items-center gap-2 before:content-['■'] before:text-[#0e1b34] before:text-[8px]">Spanish</div>
              <div className="text-[11px] font-medium text-gray-700 flex items-center gap-2 before:content-['■'] before:text-[#0e1b34] before:text-[8px]">French</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ExecutiveSidebar = () => (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTopAccent}></div>
      
      <div className={styles.photoWrapper}>
        <img 
           src={data?.contactInfo?.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"} 
           alt={finalData.fullName} 
           className={styles.photo}
        />
      </div>

      <h1 className={styles.name}>{finalData.fullName}</h1>
      {/* Assuming a profession field might exist, mapping from title or hardcoding for now based on image */}
      <h2 className={styles.profession}>{experience[0]?.title || "Professional"}</h2>

      <div className={styles.contact}>
        <h2 className={styles.sidebarSectionTitle}>Contact</h2>
        <div className={styles.contactItem}>
          <div className={styles.contactIcon}>📞</div>
          <span>{contactInfo.mobile || "+123-456-7890"}</span>
        </div>
        <div className={styles.contactItem}>
          <div className={styles.contactIcon}>✉️</div>
          <span className="break-all">{contactInfo.email || "hello@reallygreatsite.com"}</span>
        </div>
        <div className={styles.contactItem}>
           <div className={styles.contactIcon}>🌐</div>
           <span className="break-all">{contactInfo.linkedin || "www.reallygreatsite.com"}</span>
        </div>
        <div className={styles.contactItem}>
           <div className={styles.contactIcon}>📍</div>
           <span className="break-all">{data?.contactInfo?.address || "123 Anywhere St., Any City"}</span>
        </div>
      </div>
      
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
      {templateId === "executive" ? (
        <>
          <ExecutiveSidebar />
          <MainContent />
        </>
      ) : templateId === "modern" ? (
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

