/**
 * Resume Template Definitions
 * Each template defines a specific layout and styling for resume sections.
 */

export const RESUME_TEMPLATES = {
  professional: {
    id: "professional",
    name: "Professional",
    description: "Classical clean design for executive and corporate roles.",
    styles: {
      container: "w-full p-14 bg-white text-gray-800 font-serif leading-relaxed",
      header: "flex flex-col items-center border-b-2 border-slate-900 pb-8 mb-10 text-center",
      name: "text-5xl font-black uppercase tracking-[0.2em] text-slate-900 mb-4",
      contact: "flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500",
      section: "mb-10",
      sectionTitle: "text-xl font-bold uppercase tracking-[0.15em] border-b-2 border-slate-200 pb-2 mb-6 text-slate-800",
      content: "space-y-6",
      itemTitle: "font-black text-slate-900 text-lg",
      itemSubtitle: "flex justify-between items-baseline font-bold text-slate-600 mb-2",
      itemDescription: "text-[0.925rem] leading-relaxed list-disc marker:text-slate-400 pl-4 space-y-1.5",
    }
  },
  executive: {
    id: "executive",
    name: "Executive",
    description: "Premium left-sidebar design with profile picture and bold accents.",
    styles: {
      container: "w-full bg-white flex min-h-[1100px]",
      sidebar: "w-[35%] bg-[#0e1b34] text-white p-8 flex flex-col items-center relative overflow-hidden",
      sidebarTopAccent: "absolute top-[-2%] left-[-5%] w-[110%] h-[300px] bg-[#f5b841] -z-10",
      photoWrapper: "w-48 h-48 rounded-full border-[10px] border-[#0e1b34] overflow-hidden mt-12 mb-6 relative z-10 flex-shrink-0 bg-white ring-4 ring-[#f5b841] shadow-2xl",
      photo: "w-full h-full object-cover",
      name: "text-[28px] font-black uppercase text-white mb-0.5 text-left tracking-wider w-full",
      profession: "text-[12px] font-medium tracking-[0.2em] text-gray-300 mb-10 text-left uppercase w-full",
      contact: "w-full space-y-4 mb-10 mt-6",
      contactItem: "flex items-center gap-3 text-[11px] text-gray-300",
      contactIcon: "text-[#0e1b34] bg-[#f5b841] p-1.5 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-xs",
      main: "w-[65%] p-10 bg-white right-content-wrapper relative",
      rightTopAccent: "absolute top-0 right-0 w-full h-4 bg-[#f5b841]",
      section: "mb-6",
      sectionTitle: "text-lg font-black uppercase tracking-widest text-[#0e1b34] mb-3",
      sidebarSectionTitle: "text-lg font-bold uppercase tracking-widest text-white mb-4 w-full text-left self-start",
      content: "space-y-4",
      itemContainer: "mb-5",
      itemTitle: "font-black text-[#0e1b34] text-[13px] uppercase mb-0.5",
      itemOrganization: "text-[11px] font-medium text-gray-500 mb-1",
      itemSubtitle: "flex justify-between items-baseline font-medium text-gray-500 mb-1 text-[11px]",
      itemDescription: "text-[11px] leading-relaxed list-disc marker:text-[#0e1b34] pl-4 space-y-1 text-gray-600",
      gridTwoCols: "grid grid-cols-2 gap-x-8 gap-y-4",
      skillsList: "space-y-2 w-full",
      skillItem: "text-[11px] text-gray-700 font-medium flex items-center gap-2 before:content-['■'] before:text-[#0e1b34] before:text-[8px]",
      educationItem: "mb-3 w-full text-left",
      educationDegree: "font-black text-[#0e1b34] text-[12px] uppercase mb-0.5",
      educationSchool: "text-gray-600 text-[11px] mb-0.5 font-medium",
      educationDate: "text-gray-500 text-[10px]",
    }
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Sleek 2-column layout with a professional slate sidebar.",
    styles: {
      container: "w-full bg-white shadow-2xl font-sans min-h-[1100px] flex",
      sidebar: "w-[30%] bg-slate-900 text-white p-10 flex flex-col gap-10",
      main: "w-[70%] p-14 bg-white",
      header: "mb-12",
      name: "text-5xl font-black tracking-tight text-slate-900 mb-2",
      contact: "flex flex-col gap-4 text-xs font-medium text-slate-300",
      contactItem: "flex flex-col gap-1",
      contactLabel: "uppercase tracking-widest text-slate-500 font-bold text-[10px]",
      section: "mb-12",
      sectionTitle: "text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 after:content-[''] after:h-1 after:flex-1 after:bg-slate-100",
      sidebarSectionTitle: "text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-4 pb-2 border-b border-slate-800",
      content: "space-y-8",
      itemTitle: "font-black text-slate-900 text-xl",
      itemSubtitle: "text-sm font-bold text-slate-500 uppercase tracking-widest flex justify-between items-center mb-3",
      itemDescription: "text-[0.95rem] text-slate-600 leading-relaxed list-disc pl-5 marker:text-slate-300",
    }
  },
  creative: {
    id: "creative",
    name: "Creative",
    description: "Canva-inspired bold layout with a modern color palette and dynamic sections.",
    styles: {
      container: "w-full bg-white font-sans overflow-hidden min-h-[1100px]",
      header: "bg-slate-900 p-16 text-white grid grid-cols-2 items-center gap-10",
      name: "text-6xl font-black tracking-tighter leading-none",
      contact: "flex flex-col gap-3 text-sm font-medium text-slate-300",
      body: "p-16 grid grid-cols-3 gap-14",
      main: "col-span-2",
      sidebar: "col-span-1",
      section: "mb-12",
      sectionTitle: "text-3xl font-black text-slate-900 mb-8 relative before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-12 before:h-1 before:bg-slate-900",
      sidebarSectionTitle: "text-lg font-black text-slate-900 mb-6 pb-2 border-b-4 border-slate-100",
      content: "space-y-8",
      itemTitle: "font-black text-slate-900 text-xl",
      itemSubtitle: "text-slate-500 text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2",
      itemDescription: "text-[0.95rem] text-slate-700 leading-relaxed list-none space-y-2 border-l-2 border-slate-100 pl-6",
    }
  },
  simple: {
    id: "simple",
    name: "Simple",
    description: "The minimalist equivalent—clean, fast, and 100% ATS-proof.",
    styles: {
      container: "w-full p-14 bg-white text-black font-sans tracking-tight",
      header: "mb-10 text-center",
      name: "text-4xl font-black mb-2",
      contact: "flex justify-center flex-wrap gap-x-6 text-[13px] border-y border-gray-200 py-3 mb-10",
      section: "mb-10",
      sectionTitle: "text-sm font-black uppercase tracking-[0.25em] text-gray-900 border-b-2 border-gray-900 pb-1 mb-6",
      content: "space-y-6",
      itemTitle: "font-black text-lg",
      itemSubtitle: "flex justify-between font-bold text-gray-600 mb-1 italic",
      itemDescription: "text-[13px] leading-relaxed list-disc pl-5",
    }
  }
};

