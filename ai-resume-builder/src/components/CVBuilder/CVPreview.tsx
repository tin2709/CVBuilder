// CVPreview.tsx
import React from "react";
// 1. Sửa lỗi: Thêm 'Plus' vào danh sách import
import { Mail, Phone, Linkedin, MapPin, Briefcase, GraduationCap, Award, Plus } from "lucide-react";

interface CVPreviewProps {
  sections: any[];
  styles: any;
  SortableSection: React.ComponentType<any>;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

const CVPreview = ({ sections, styles, SortableSection, onDelete, onMoveUp, onMoveDown }: CVPreviewProps) => {

  // 2. Sửa lỗi: Đổi tên hàm thành 'renderSectionContent' và thêm tham số 'isLeft'
  const renderSectionContent = (section: any, isLeft: boolean) => {
    // Thiết lập màu sắc dựa trên vị trí (Sidebar hay Main)
    const textColor = isLeft ? "text-white/90" : "text-slate-600";
    const titleColor = isLeft ? "text-white border-gray-500" : "text-[#f39c12] border-[#f39c12]";

    switch (section.type) {
      case 'awards':
        return (
          <div className="space-y-2">
             <div className="flex justify-between items-center">
                <h3 className={`text-lg font-bold uppercase border-b pb-1 w-full ${titleColor}`} contentEditable suppressContentEditableWarning>
                   Danh hiệu và giải thưởng
                </h3>
                <button className="ml-2 bg-[#00b14f] text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 shrink-0">
                   <Plus className="w-3 h-3" /> Thêm
                </button>
             </div>
             <div className="flex gap-4 text-[12px] text-gray-400 italic">
                <span contentEditable suppressContentEditableWarning>Thời gian</span>
                <span contentEditable suppressContentEditableWarning>Tên giải thưởng</span>
             </div>
          </div>
        );

      case 'activities':
        return (
          <div className="space-y-3">
            <div className={`inline-block border rounded-lg px-4 py-1 mb-2 ${isLeft ? 'border-white' : 'border-[#f39c12]'}`}>
               <h3 className={`text-sm font-bold uppercase ${isLeft ? 'text-white' : 'text-[#f39c12]'}`} contentEditable suppressContentEditableWarning>Hoạt động</h3>
            </div>
            <div className={`space-y-2 text-[12px] ${textColor}`}>
               <p className="flex items-center gap-2 italic"><span className="text-[#f39c12]">●</span> Vị trí của bạn</p>
               <p className="italic ml-4 opacity-70">// Bắt đầu - Kết thúc</p>
               <p className="font-bold ml-4 uppercase">Tên tổ chức</p>
               <p className="ml-4 italic">Mô tả hoạt động</p>
            </div>
          </div>
        );

      case 'references':
        return (
          <div className="space-y-2 text-left">
             <h3 className={`text-lg font-bold border-b pb-1 ${titleColor}`} contentEditable suppressContentEditableWarning>
                Người giới thiệu
             </h3>
             <p className={`text-[12px] italic leading-relaxed ${textColor}`} contentEditable suppressContentEditableWarning>
                Thông tin người tham chiếu bao gồm tên, chức vụ và thông tin liên hệ
             </p>
          </div>
        );

      case 'interests':
        return (
          <div className="space-y-2">
             <h3 className={`text-lg font-bold border-b pb-1 ${titleColor}`} contentEditable suppressContentEditableWarning>
                Sở thích
             </h3>
             <p className={`text-[12px] italic ${textColor}`} contentEditable suppressContentEditableWarning>
                Điền các sở thích của bạn
             </p>
          </div>
        );

      default:
        return (
          <div className="flex flex-col gap-1 text-left">
            <h3 className={`text-lg font-bold uppercase border-b pb-1 ${titleColor}`} contentEditable suppressContentEditableWarning>
              {section.title}
            </h3>
            <div className={`text-[13px] outline-none ${textColor}`} contentEditable suppressContentEditableWarning>
              Nhấp vào để nhập nội dung cho {section.title}...
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="bg-white shadow-2xl min-h-[297mm] w-[210mm] flex overflow-hidden origin-top transition-transform duration-200"
      style={{ fontFamily: styles.fontFamily }}
    >
      {/* CỘT TRÁI (SIDEBAR) */}
      <aside className="w-[35%] bg-[#4b4e51] text-white p-6 flex flex-col gap-6 text-left">
        <div className="w-full aspect-[3/4] border-4 border-white rounded shadow-md overflow-hidden bg-slate-200 mb-2">
           <img src="https://i.imgur.com/your-image-url.jpg" alt="Avatar" className="w-full h-full object-cover" />
        </div>

        {/* 3. Sửa lỗi: Thêm kiểu dữ liệu 'any' cho s và section */}
        {sections
          .filter((s: any) => s.position === 'left')
          .map((section: any) => (
            <SortableSection
              key={section.id}
              id={section.id}
              onDelete={() => onDelete(section.id)}
              onMoveUp={() => onMoveUp(section.id)}
              onMoveDown={() => onMoveDown(section.id)}
            >
              {renderSectionContent(section, true)}
            </SortableSection>
          ))}
      </aside>

      {/* CỘT PHẢI (MAIN CONTENT) */}
      <main className="flex-1 p-10 flex flex-col gap-8 bg-white text-slate-800 text-left">
        <header className="text-left">
          <h1 className="text-4xl font-extrabold uppercase mb-1 tracking-tight" contentEditable suppressContentEditableWarning>
            Phạm Trung Tín
          </h1>
          <h2 className="text-xl font-bold text-gray-700" contentEditable suppressContentEditableWarning>
            JAVA DEVELOPER
          </h2>
        </header>

        {sections
          .filter((s: any) => s.position === 'right')
          .map((section: any) => (
            <SortableSection
              key={section.id}
              id={section.id}
              onDelete={() => onDelete(section.id)}
              onMoveUp={() => onMoveUp(section.id)}
              onMoveDown={() => onMoveDown(section.id)}
            >
              {renderSectionContent(section, false)}
            </SortableSection>
          ))}
      </main>
    </div>
  );
};

export default CVPreview;