/**
 * Cover Letter Template Definitions
 * Mirrors the Resume templates for visual consistency.
 */

export const COVER_LETTER_TEMPLATES = {
  professional: {
    id: "professional",
    name: "Professional",
    styles: {
      container: "max-w-4xl mx-auto p-14 bg-white text-gray-800 font-serif leading-relaxed min-h-[1000px]",
      header: "flex flex-col items-center border-b-2 border-slate-900 pb-8 mb-10 text-center",
      name: "text-5xl font-black uppercase tracking-[0.2em] text-slate-900 mb-4",
      contact: "flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500",
      content: "space-y-6 text-[1.1rem] leading-loose text-slate-700",
      date: "text-slate-500 font-bold mb-8",
      recipient: "mb-8",
      salutation: "font-bold text-slate-900 mb-4",
      body: "whitespace-pre-line",
      signature: "mt-12 pt-8 border-t border-slate-100 font-bold",
    }
  },
  modern: {
    id: "modern",
    name: "Modern",
    styles: {
      container: "max-w-4xl mx-auto bg-white shadow-2xl font-sans min-h-[1000px] flex",
      sidebar: "w-[30%] bg-slate-900 text-white p-10 flex flex-col gap-10",
      main: "w-[70%] p-14 bg-white",
      header: "mb-12",
      name: "text-5xl font-black tracking-tight text-slate-900 mb-2",
      contact: "flex flex-col gap-4 text-xs font-medium text-slate-300",
      contactItem: "flex flex-col gap-1",
      contactLabel: "uppercase tracking-widest text-slate-500 font-bold text-[10px]",
      content: "space-y-6 text-[1rem] leading-relaxed text-slate-600",
      date: "text-slate-400 font-bold mb-10 uppercase tracking-widest text-xs",
      recipient: "mb-10 text-slate-900 font-bold",
      salutation: "font-black text-slate-900 text-xl mb-6",
      body: "whitespace-pre-line",
      signature: "mt-16 text-slate-900 font-black text-xl",
    }
  },
  creative: {
    id: "creative",
    name: "Creative",
    styles: {
      container: "max-w-4xl mx-auto bg-white font-sans overflow-hidden min-h-[1000px]",
      header: "bg-slate-900 p-16 text-white grid grid-cols-2 items-center gap-10",
      name: "text-6xl font-black tracking-tighter leading-none",
      contact: "flex flex-col gap-3 text-sm font-medium text-slate-300",
      body_container: "p-16 max-w-2xl mx-auto",
      content: "space-y-8 text-[1.1rem] leading-relaxed text-slate-700",
      date: "text-primary font-black mb-8 uppercase tracking-widest text-sm",
      recipient: "mb-10 p-6 bg-slate-50 border-l-8 border-slate-900",
      salutation: "text-3xl font-black text-slate-900 mb-8",
      body: "whitespace-pre-line border-l-2 border-slate-100 pl-8",
      signature: "mt-12 font-black text-2xl text-slate-900",
    }
  },
  simple: {
    id: "simple",
    name: "Simple",
    styles: {
      container: "max-w-4xl mx-auto p-14 bg-white text-black font-sans tracking-tight min-h-[1000px]",
      header: "mb-10",
      name: "text-4xl font-black mb-2",
      contact: "flex flex-wrap gap-x-6 text-[13px] border-y border-gray-200 py-3 mb-10",
      content: "space-y-6 text-[1rem] leading-normal text-gray-800",
      date: "mb-8",
      recipient: "mb-10 font-bold",
      salutation: "font-black mb-4",
      body: "whitespace-pre-line",
      signature: "mt-12 font-black border-t-2 border-black pt-4",
    }
  }
};
