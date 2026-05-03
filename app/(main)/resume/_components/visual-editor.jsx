"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Plus,
  Trash2,
  Phone,
  Mail,
  Linkedin,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";

function SectionCard({ icon: Icon, title, children, color = "text-primary" }) {
  return (
    <Card className="border border-white/8 bg-white/3 overflow-hidden">
      <CardHeader className="bg-white/5 py-3 px-4">
        <CardTitle className="text-xs font-bold flex items-center gap-2 uppercase tracking-wider">
          <Icon className={`w-4 h-4 ${color}`} /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">
      {children}
    </label>
  );
}

export default function VisualEditor({ data, onChange }) {
  const [expandedExp, setExpandedExp] = useState({});
  const [expandedEdu, setExpandedEdu] = useState({});

  const updateData = (newData) => onChange(newData);

  const updateContact = (field, value) =>
    updateData({ ...data, contactInfo: { ...data.contactInfo, [field]: value } });

  const updateArrayItem = (key, index, field, value) => {
    const newArr = [...(data[key] || [])];
    newArr[index] = { ...newArr[index], [field]: value };
    updateData({ ...data, [key]: newArr });
  };

  const addArrayItem = (key, newItem) =>
    updateData({ ...data, [key]: [...(data[key] || []), newItem] });

  const removeArrayItem = (key, index) =>
    updateData({ ...data, [key]: (data[key] || []).filter((_, i) => i !== index) });

  const toggleExpand = (state, setState, idx) =>
    setState((prev) => ({ ...prev, [idx]: !prev[idx] }));

  if (!data) {
    return (
      <div className="py-16 text-center text-muted-foreground text-sm italic">
        Generate a resume first to use the Visual Editor.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* ── Contact Info ── */}
      <SectionCard icon={User} title="Contact Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <Input
              value={data.fullName || ""}
              onChange={(e) => updateData({ ...data, fullName: e.target.value })}
              placeholder="Jane Smith"
              className="h-8 text-xs bg-black/20"
            />
          </div>
          <div>
            <FieldLabel>Job Title / Role</FieldLabel>
            <Input
              value={data.contactInfo?.title || ""}
              onChange={(e) => updateContact("title", e.target.value)}
              placeholder="Software Engineer"
              className="h-8 text-xs bg-black/20"
            />
          </div>
          <div>
            <FieldLabel><Mail className="inline w-3 h-3 mr-1" />Email</FieldLabel>
            <Input
              value={data.contactInfo?.email || ""}
              onChange={(e) => updateContact("email", e.target.value)}
              placeholder="jane@example.com"
              className="h-8 text-xs bg-black/20"
            />
          </div>
          <div>
            <FieldLabel><Phone className="inline w-3 h-3 mr-1" />Phone</FieldLabel>
            <Input
              value={data.contactInfo?.mobile || ""}
              onChange={(e) => updateContact("mobile", e.target.value)}
              placeholder="+1 555 000 0000"
              className="h-8 text-xs bg-black/20"
            />
          </div>
          <div>
            <FieldLabel><Linkedin className="inline w-3 h-3 mr-1" />LinkedIn</FieldLabel>
            <Input
              value={data.contactInfo?.linkedin || ""}
              onChange={(e) => updateContact("linkedin", e.target.value)}
              placeholder="linkedin.com/in/jane"
              className="h-8 text-xs bg-black/20"
            />
          </div>
          <div>
            <FieldLabel><MapPin className="inline w-3 h-3 mr-1" />Location</FieldLabel>
            <Input
              value={data.contactInfo?.address || ""}
              onChange={(e) => updateContact("address", e.target.value)}
              placeholder="City, Country"
              className="h-8 text-xs bg-black/20"
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Summary ── */}
      <SectionCard icon={User} title="Professional Summary">
        <Textarea
          value={data.summary || ""}
          onChange={(e) => updateData({ ...data, summary: e.target.value })}
          placeholder="Write a compelling summary about your professional background..."
          className="min-h-[90px] text-xs bg-black/20 leading-relaxed resize-y"
        />
        <p className="text-[9px] text-muted-foreground mt-1 italic">
          Aim for 2–4 concise sentences highlighting your value.
        </p>
      </SectionCard>

      {/* ── Work Experience ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" /> Work Experience
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] gap-1"
            onClick={() =>
              addArrayItem("experience", {
                title: "",
                organization: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
              })
            }
          >
            <Plus className="w-3 h-3" /> Add Role
          </Button>
        </div>

        {(data.experience || []).map((exp, idx) => (
          <Card key={idx} className="border border-white/8 bg-white/3">
            {/* Collapsible header */}
            <button
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              onClick={() => toggleExpand(expandedExp, setExpandedExp, idx)}
            >
              <span className="text-xs font-bold text-left truncate">
                {exp.title || `Role ${idx + 1}`}
                {exp.organization ? ` · ${exp.organization}` : ""}
              </span>
              <div className="flex items-center gap-2 ml-2 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); removeArrayItem("experience", idx); }}
                  className="text-destructive/60 hover:text-destructive transition-colors p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                {expandedExp[idx]
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>

            {/* Expanded fields */}
            {expandedExp[idx] !== false && (
              <CardContent className="px-4 pb-4 space-y-3 border-t border-white/8 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Job Title</FieldLabel>
                    <Input
                      value={exp.title}
                      onChange={(e) => updateArrayItem("experience", idx, "title", e.target.value)}
                      placeholder="Senior Engineer"
                      className="h-8 text-xs bg-black/20"
                    />
                  </div>
                  <div>
                    <FieldLabel>Company / Organization</FieldLabel>
                    <Input
                      value={exp.organization}
                      onChange={(e) => updateArrayItem("experience", idx, "organization", e.target.value)}
                      placeholder="Acme Corp"
                      className="h-8 text-xs bg-black/20"
                    />
                  </div>
                  <div>
                    <FieldLabel>Start Date</FieldLabel>
                    <Input
                      value={exp.startDate}
                      onChange={(e) => updateArrayItem("experience", idx, "startDate", e.target.value)}
                      placeholder="Jan 2022"
                      className="h-8 text-xs bg-black/20"
                    />
                  </div>
                  <div>
                    <FieldLabel>End Date</FieldLabel>
                    <Input
                      value={exp.current ? "Present" : exp.endDate}
                      disabled={exp.current}
                      onChange={(e) => updateArrayItem("experience", idx, "endDate", e.target.value)}
                      placeholder="Dec 2024 or Present"
                      className="h-8 text-xs bg-black/20"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-[10px] text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current || false}
                    onChange={(e) => updateArrayItem("experience", idx, "current", e.target.checked)}
                    className="accent-primary"
                  />
                  Currently working here
                </label>
                <div>
                  <FieldLabel>Responsibilities (one per line = one bullet point)</FieldLabel>
                  <Textarea
                    value={Array.isArray(exp.description) ? exp.description.join("\n") : exp.description || ""}
                    onChange={(e) => updateArrayItem("experience", idx, "description", e.target.value)}
                    placeholder={"• Led team of 5 engineers to deliver X\n• Reduced latency by 40%"}
                    className="min-h-[100px] text-xs bg-black/20 resize-y"
                  />
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {(!data.experience || data.experience.length === 0) && (
          <p className="text-xs text-muted-foreground italic text-center py-4">No experience added yet.</p>
        )}
      </div>

      {/* ── Education ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-purple-400" /> Education
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] gap-1"
            onClick={() =>
              addArrayItem("education", { title: "", organization: "", startDate: "", endDate: "" })
            }
          >
            <Plus className="w-3 h-3" /> Add Degree
          </Button>
        </div>

        {(data.education || []).map((edu, idx) => (
          <Card key={idx} className="border border-white/8 bg-white/3">
            <button
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              onClick={() => toggleExpand(expandedEdu, setExpandedEdu, idx)}
            >
              <span className="text-xs font-bold text-left truncate">
                {edu.title || `Degree ${idx + 1}`}
                {edu.organization ? ` · ${edu.organization}` : ""}
              </span>
              <div className="flex items-center gap-2 ml-2 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); removeArrayItem("education", idx); }}
                  className="text-destructive/60 hover:text-destructive transition-colors p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                {expandedEdu[idx]
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>

            {expandedEdu[idx] !== false && (
              <CardContent className="px-4 pb-4 space-y-3 border-t border-white/8 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Degree / Qualification</FieldLabel>
                    <Input
                      value={edu.title}
                      onChange={(e) => updateArrayItem("education", idx, "title", e.target.value)}
                      placeholder="B.Sc. Computer Science"
                      className="h-8 text-xs bg-black/20"
                    />
                  </div>
                  <div>
                    <FieldLabel>Institution</FieldLabel>
                    <Input
                      value={edu.organization}
                      onChange={(e) => updateArrayItem("education", idx, "organization", e.target.value)}
                      placeholder="MIT"
                      className="h-8 text-xs bg-black/20"
                    />
                  </div>
                  <div>
                    <FieldLabel>Start Year</FieldLabel>
                    <Input
                      value={edu.startDate}
                      onChange={(e) => updateArrayItem("education", idx, "startDate", e.target.value)}
                      placeholder="2018"
                      className="h-8 text-xs bg-black/20"
                    />
                  </div>
                  <div>
                    <FieldLabel>End Year</FieldLabel>
                    <Input
                      value={edu.endDate}
                      onChange={(e) => updateArrayItem("education", idx, "endDate", e.target.value)}
                      placeholder="2022"
                      className="h-8 text-xs bg-black/20"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {(!data.education || data.education.length === 0) && (
          <p className="text-xs text-muted-foreground italic text-center py-4">No education added yet.</p>
        )}
      </div>

      {/* ── Skills ── */}
      <SectionCard icon={Code} title="Skills & Expertise">
        <Input
          value={Array.isArray(data.skills) ? data.skills.join(", ") : data.skills || ""}
          onChange={(e) =>
            updateData({ ...data, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
          }
          placeholder="React, Node.js, Python, Leadership..."
          className="text-xs bg-black/20"
        />
        <p className="text-[9px] text-muted-foreground mt-2 italic">
          Separate each skill with a comma.
        </p>
        {/* Tag preview */}
        {(Array.isArray(data.skills) ? data.skills : []).filter(Boolean).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(Array.isArray(data.skills) ? data.skills : []).filter(Boolean).map((s, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
