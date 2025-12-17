import { ResumeData } from "@/types/resume";
import { Separator } from "@/components/ui/separator";

export const ProfessionalTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="font-serif text-gray-900">
      {/* Centered Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex justify-center gap-4 text-sm italic text-gray-600">
          <span>{data.personalInfo.email}</span>
          <span>|</span>
          <span>{data.personalInfo.phone}</span>
        </div>
      </div>

      <Separator className="bg-gray-800 mb-8" />

      {/* Content */}
      <div className="space-y-6">
        <section>
          <h3 className="text-center font-bold uppercase tracking-wider text-sm border-b border-gray-300 pb-2 mb-4">
            Professional Summary
          </h3>
          <p className="text-justify text-sm leading-relaxed">
            {data.personalInfo.summary}
          </p>
        </section>

        <section>
          <h3 className="text-center font-bold uppercase tracking-wider text-sm border-b border-gray-300 pb-2 mb-4">
            Work History
          </h3>
          <p className="text-center text-sm text-gray-400">...</p>
        </section>
      </div>
    </div>
  );
};