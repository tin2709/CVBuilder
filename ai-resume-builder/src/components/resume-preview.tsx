import { ResumeData } from "@/types/resume";
import { cn } from "@/lib/utils";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { ProfessionalTemplate } from "@/components/templates/ProfessionalTemplate";
import { CreativeTemplate } from "@/components/templates/CreativeTemplate";

interface ResumePreviewProps {
  data: ResumeData;
  templateId: string;
}

export default function ResumePreview({ data, templateId }: ResumePreviewProps) {
  
  // Logic render template
  const renderTemplate = () => {
    switch (templateId) {
      case "modern":
        return <ModernTemplate data={data} />;
      case "creative":
        return <CreativeTemplate data={data} />;
      case "professional":
        return <ProfessionalTemplate data={data} />;
      default:
        // Mặc định trả về Modern hoặc Blank
        return <ProfessionalTemplate data={data} />;
    }
  };

  return (
    <div className="flex justify-center py-8">
        {/* Khung A4 Wrapper - Luôn giữ nguyên kích thước */}
        <div 
            className={cn(
                "w-[210mm] min-h-[297mm] bg-white shadow-2xl overflow-hidden origin-top scale-[0.8] sm:scale-100", // Thêm scale để vừa màn hình nhỏ
                "p-[20mm]", // Padding chuẩn in ấn
                "transition-all duration-300 ease-in-out"
            )}
        >
            {/* Render component con bên trong */}
            {renderTemplate()}
        </div>
    </div>
  );
}