/**
 * ResumeRenderer Component
 * Generic component to render structured resume data into various templates.
 */

"use client";
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
  
  // Helper to ensure description is always an array of lines
  const formatDescription = (desc) => {
    if (!desc) return [];
    if (Array.isArray(desc)) return desc;
    if (typeof desc === 'string') return desc.split('\n');
    return [];
  };

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
        {formatDescription(item.description).filter(l => l.trim()).map((line, i) => (
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
      {templateId === "executive" && <div className={styles.rightBottomAccent}></div>}
      
      {/* Summary */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{templateId === "executive" ? "PROFILE" : "Profile"}</h2>
        <div className="text-[0.95rem] leading-relaxed text-slate-600 font-medium">{summary}</div>
      </div>

      {/* Education moved to Main Content exactly under Profile for executive template */}
      {templateId === "executive" && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>EDUCATION</h2>
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
        <h2 className={styles.sectionTitle}>{templateId === "executive" ? "WORK EXPERIENCE" : "Work Experience"}</h2>
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
                     {formatDescription(item.description).filter(l => l.trim()).map((line, i) => (
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
                      {formatDescription(item.description).filter(l => l.trim()).map((line, i) => (
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
            <h2 className={styles.sectionTitle}>SKILLS</h2>
            <div className={styles.skillsList}>
              {(Array.isArray(skills) ? skills : skills.split(',')).map((s, i) => (
                <div key={i} className={styles.skillItem}>{s.trim()}</div>
              ))}
            </div>
          </div>
          <div className="w-full">
            <h2 className={styles.sectionTitle}>LANGUAGES</h2>
            <div className="flex flex-col gap-2 w-full">
              {/* Hardcoded Sample Languages to match image - ideally this should be from data */}
              <div className={styles.skillItem}>Indonesian</div>
              <div className={styles.skillItem}>Arabic</div>
              <div className={styles.skillItem}>Spanish</div>
              <div className={styles.skillItem}>French</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const YELLOW = "#f5b841";
  const DARK_BLUE = "#0e1b34";

  const ExecutiveMainContent = () => (
    <div style={{
      flex: 1, backgroundColor: "white", padding: "40px 40px 60px",
      display: "flex", flexDirection: "column", position: "relative", overflowY: "auto"
    }}>
      {/* Yellow bottom bar accent */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 28, backgroundColor: YELLOW }} />

      {/* PROFILE */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 16, fontWeight: 900, textTransform: "uppercase",
          letterSpacing: "0.15em", color: DARK_BLUE,
          borderBottom: `2px solid ${YELLOW}`, paddingBottom: 6, marginBottom: 12
        }}>PROFILE</h2>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#444", fontWeight: 400 }}>{summary}</p>
      </div>

      {/* EDUCATION */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 16, fontWeight: 900, textTransform: "uppercase",
          letterSpacing: "0.15em", color: DARK_BLUE,
          borderBottom: `2px solid ${YELLOW}`, paddingBottom: 6, marginBottom: 12
        }}>EDUCATION</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {education.map((edu, i) => (
            <div key={i}>
              <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: DARK_BLUE, marginBottom: 2 }}>
                {edu.title}
              </div>
              <div style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>
                • {edu.organization} ({edu.startDate}–{edu.endDate || "Present"})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WORK EXPERIENCE — 2 columns */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 16, fontWeight: 900, textTransform: "uppercase",
          letterSpacing: "0.15em", color: DARK_BLUE,
          borderBottom: `2px solid ${YELLOW}`, paddingBottom: 6, marginBottom: 12
        }}>WORK EXPERIENCE</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
          {(experience.length > 0 ? experience : SAMPLES.experience).map((item, index) => (
            <div key={index} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: DARK_BLUE, marginBottom: 2 }}>
                {item.title}
              </div>
              <div style={{ fontSize: 12, color: "#888", fontWeight: 500, marginBottom: 2 }}>
                {item.organization}
              </div>
              <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>
                {item.startDate} — {item.current ? "Present" : item.endDate}
              </div>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {formatDescription(item.description).filter(l => l.trim()).map((line, i) => (
                  <li key={i} style={{ fontSize: 11.5, color: "#555", lineHeight: 1.6, marginBottom: 3 }}>
                    {line.replace(/^[•\-\*]\s*/, '')}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* SKILLS + LANGUAGES side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", marginBottom: 36 }}>
        <div>
          <h2 style={{
            fontSize: 16, fontWeight: 900, textTransform: "uppercase",
            letterSpacing: "0.15em", color: DARK_BLUE,
            borderBottom: `2px solid ${YELLOW}`, paddingBottom: 6, marginBottom: 12
          }}>SKILLS</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(Array.isArray(skills) ? skills : skills.split(',')).map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#444", fontWeight: 500 }}>
                <span style={{ color: DARK_BLUE, fontSize: 8 }}>■</span>
                {s.trim()}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 style={{
            fontSize: 16, fontWeight: 900, textTransform: "uppercase",
            letterSpacing: "0.15em", color: DARK_BLUE,
            borderBottom: `2px solid ${YELLOW}`, paddingBottom: 6, marginBottom: 12
          }}>LANGUAGES</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(finalData.languages || ["Indonesian", "Arabic", "Spanish", "French"]).map((lang, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#444", fontWeight: 500 }}>
                <span style={{ color: DARK_BLUE, fontSize: 8 }}>■</span>
                {lang}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );



  const ExecutiveSidebar = () => (
    <div style={{ width: "38%", position: "relative", display: "flex", flexDirection: "column", flexShrink: 0, backgroundColor: YELLOW, minHeight: "100%" }}>
      {/* Dark blue area that fills the bottom portion with rounded top-right corner */}
      <div style={{
        position: "absolute", top: "22%", bottom: 0, left: 0, right: 0,
        backgroundColor: DARK_BLUE, borderTopRightRadius: "80px", zIndex: 0
      }} />

      {/* Inner content above the z-layers */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 32px 40px", height: "100%" }}>
        
        {/* Profile Photo */}
        <div style={{
          width: 200, height: 200, borderRadius: "50%",
          border: `14px solid ${DARK_BLUE}`,
          outline: `4px solid ${YELLOW}`,
          overflow: "hidden", flexShrink: 0,
          backgroundColor: "white", boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          marginBottom: 16
        }}>
          <img
            src={data?.contactInfo?.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"}
            alt={finalData.fullName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Name */}
        <h1 style={{
          fontSize: 26, fontWeight: 900, textTransform: "uppercase", color: "white",
          letterSpacing: "0.12em", width: "100%", textAlign: "left",
          margin: "12px 0 4px", lineHeight: 1.2
        }}>{finalData.fullName}</h1>

        {/* Profession */}
        <h2 style={{
          fontSize: 13, fontWeight: 500, textTransform: "uppercase",
          color: "rgba(255,255,255,0.8)", letterSpacing: "0.18em",
          width: "100%", textAlign: "left", marginBottom: 28
        }}>{experience[0]?.title || finalData.profession || "Marketing Manager"}</h2>

        {/* CONTACT section */}
        <div style={{ width: "100%" }}>
          <h3 style={{
            fontSize: 14, fontWeight: 900, textTransform: "uppercase",
            letterSpacing: "0.18em", color: "white",
            marginBottom: 20, textAlign: "left"
          }}>CONTACT</h3>

          {[
            { icon: "📞", value: contactInfo.mobile || "+123-456-7890" },
            { icon: "✉️", value: contactInfo.email || "hello@reallygreatsite.com" },
            { icon: "🌐", value: contactInfo.linkedin || "www.reallygreatsite.com" },
            { icon: "📍", value: data?.contactInfo?.address || "123 Anywhere St., Any City" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                backgroundColor: YELLOW, color: DARK_BLUE,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, flexShrink: 0, fontWeight: "bold"
              }}>{item.icon}</div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", wordBreak: "break-all", lineHeight: 1.4 }}>
                {item.value}
              </span>
            </div>
          ))}
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
    <div
      className={templateId !== "executive" ? styles.container : undefined}
      style={templateId === "executive" ? { display: "flex", width: "100%", minHeight: 1100, backgroundColor: "white", fontFamily: "'Inter', 'Segoe UI', sans-serif" } : undefined}
      id="resume-pdf"
    >
      {templateId === "executive" ? (
        <>
          <ExecutiveSidebar />
          <ExecutiveMainContent />
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

