"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Hook để lấy templateId
import ResumeForm from "@/components/resume-form";
import ResumePreview from "@/components/resume-preview";
import { ResumeData } from "@/types/resume";
import { templates } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditorPage() {
  const params = useParams();
  const templateId = params.templateId as string;

  // Lấy thông tin mẫu hiện tại để hiển thị tên
  const currentTemplate = templates.find(t => t.id === templateId);

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      summary: "",
    },
    experience: [],
    education: [],
  });

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Editor */}
      <header className="border-b bg-white h-16 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                    {currentTemplate ? currentTemplate.name : "Tự thiết kế"}
                    <span className="text-xs font-normal text-slate-400 border px-2 py-0.5 rounded-full">Draft</span>
                </h1>
            </div>
        </div>
        <div className="flex gap-3">
             <Button variant="outline">Lưu nháp</Button>
             <Button className="bg-blue-600 hover:bg-blue-700">Xuất PDF</Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Cột Trái: Editor */}
        <div className="w-1/2 p-6 overflow-y-auto border-r bg-white scroll-smooth">
          <div className="max-w-xl mx-auto pb-20">
            <ResumeForm 
              data={resumeData} 
              onChange={setResumeData} 
            />
          </div>
        </div>

        {/* Cột Phải: Preview */}
        <div className="w-1/2 bg-slate-100/80 relative overflow-y-auto flex justify-center p-8">
          <ResumePreview 
            data={resumeData} 
            templateId={templateId} // Truyền ID xuống để đổi style
          />
        </div>
      </div>
    </main>
  );
}