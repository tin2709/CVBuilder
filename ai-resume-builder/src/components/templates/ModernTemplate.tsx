import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";

export const ModernTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="font-sans text-slate-800">
      {/* Header */}
      <div className="border-l-4 border-blue-600 pl-6 mb-8">
        <h1 className="text-4xl font-bold text-blue-900 uppercase tracking-tight">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <p className="text-lg text-slate-500 mt-2">{data.personalInfo.summary?.slice(0, 50)}...</p>
      </div>

      {/* Contact Info - Grid 2 cột */}
      <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-500" />
          {data.personalInfo.email || "email@example.com"}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-500" />
          {data.personalInfo.phone || "0123 456 789"}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Summary */}
        <section>
          <h3 className="text-lg font-bold text-blue-900 uppercase border-b border-blue-200 pb-1 mb-3">
            Profile Summary
          </h3>
          <p className="text-sm leading-relaxed text-slate-700">
            {data.personalInfo.summary}
          </p>
        </section>

        {/* Experience Placeholder */}
        <section>
          <h3 className="text-lg font-bold text-blue-900 uppercase border-b border-blue-200 pb-1 mb-3">
            Experience
          </h3>
          <p className="text-sm text-slate-400 italic">Add experience to see details...</p>
        </section>
      </div>
    </div>
  );
};