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
      container: "w-full p-14 bg-white text-gray-800 font-serif leading-relaxed break-words",
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
      container: "w-full bg-white flex min-h-[1100px] relative overflow-hidden break-words",
      sidebar: "w-[38%] bg-[#f5b841] relative flex flex-col shrink-0",
      sidebarInner: "relative z-10 flex flex-col w-full pt-12 px-10 h-full",
      sidebarBlueArea: "absolute top-[18%] bottom-0 left-0 w-full bg-[#0e1b34] rounded-tr-[90px] z-0",
      photoWrapper: "w-[240px] h-[240px] rounded-full border-[15px] border-[#0e1b34] overflow-hidden mt-2 mb-4 relative z-20 flex-shrink-0 bg-white ring-[4px] ring-[#f5b841] self-center shadow-2xl",
      photo: "w-full h-full object-cover",
      name: "text-[32px] leading-tight font-black uppercase text-white mb-1 text-left tracking-wider w-full mt-10",
      profession: "text-[14px] font-medium tracking-[0.2em] text-white mb-12 text-left uppercase w-full",
      contact: "w-full space-y-4 mt-2",
      contactItem: "flex items-center gap-4 text-[12px] text-white font-medium",
      contactIcon: "text-[#0e1b34] bg-[#f5b841] p-1.5 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold",
      main: "w-[62%] p-12 bg-white relative z-10 flex flex-col pb-20",
      rightBottomAccent: "absolute bottom-0 right-0 w-full h-[30px] bg-[#f5b841]",
      section: "mb-7",
      sectionTitle: "text-[16px] font-black uppercase tracking-widest text-[#0e1b34] mb-4",
      sidebarSectionTitle: "text-[16px] font-black uppercase tracking-widest text-white mb-6 w-full text-left",
      content: "space-y-5",
      itemContainer: "mb-5",
      itemTitle: "font-black text-[#0e1b34] text-[13px] uppercase mb-1",
      itemOrganization: "text-[12px] font-medium text-gray-500 mb-1",
      itemSubtitle: "flex justify-between items-baseline font-medium text-gray-500 mb-2 text-[11px]",
      itemDescription: "text-[11.5px] leading-relaxed list-disc marker:text-[#0e1b34] pl-4 space-y-1.5 text-gray-600",
      gridTwoCols: "grid grid-cols-2 gap-x-10 gap-y-6",
      skillsList: "space-y-3 w-full",
      skillItem: "text-[12px] text-gray-700 font-medium flex items-center gap-3 before:content-['■'] before:text-[#0e1b34] before:text-[8px]",
      educationItem: "mb-4 w-full text-left",
      educationDegree: "font-black text-[#0e1b34] text-[13px] uppercase mb-1",
      educationSchool: "text-gray-600 text-[12px] mb-0.5 font-medium",
      educationDate: "text-gray-500 text-[11px]",
    }
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Sleek 2-column layout with a professional slate sidebar.",
    styles: {
      container: "w-full bg-white shadow-2xl font-sans min-h-[1100px] flex break-words",
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
      container: "w-full bg-white font-sans overflow-hidden min-h-[1100px] break-words",
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
      container: "w-full p-14 bg-white text-black font-sans tracking-tight break-words",
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

