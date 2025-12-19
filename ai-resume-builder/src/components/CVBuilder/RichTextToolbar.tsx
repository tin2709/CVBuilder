"use client";

import React, { useState } from "react";
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  ChevronDown, Check
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const FONT_SIZES = ["10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "20px", "24px"];
const FONT_FAMILIES = ["Arial", "Inter", "Roboto", "Times New Roman", "Montserrat", "Be Vietnam Pro"];

const RichTextToolbar = ({ isVisible }: { isVisible: boolean }) => {
  const [fontSize, setFontSize] = useState("13px");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [color, setColor] = useState("#1a1c1e");

  if (!isVisible) return null;

  // Hàm thực thi lệnh quan trọng: e.preventDefault() để không mất focus của con trỏ chuột
  const applyStyle = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault();
    document.execCommand(command, false, value);
  };

  // Hàm riêng cho Size vì execCommand 'fontSize' chỉ nhận giá trị 1-7
  const applyFontSize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    setFontSize(size);
    // Cách hack để set px thực tế: tạo 1 span bao quanh
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const span = document.createElement("span");
        span.style.fontSize = size;
        const range = selection.getRangeAt(0);
        range.surroundContents(span);
    }
  };

  return (
    <div className="absolute -top-14 left-0 flex items-center bg-white border border-slate-200 shadow-xl rounded-xl p-1 z-[100] h-[48px]">
      
      {/* 1. SELECT FONT SIZE */}
      <Popover>
        <PopoverTrigger asChild>
          <button onMouseDown={(e) => e.preventDefault()} className="flex items-center gap-1 text-[13px] font-medium hover:bg-slate-100 px-3 py-2 rounded-l-lg border-r h-full min-w-[65px]">
            {fontSize} <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-32 p-1 flex flex-col max-h-60 overflow-y-auto" align="start">
          {FONT_SIZES.map(size => (
            <button 
              key={size} 
              onMouseDown={(e) => applyFontSize(e, size)}
              className="flex items-center justify-between px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-600 rounded"
            >
              <span className={fontSize === size ? "text-green-500 font-medium" : ""}>{size}</span>
              {fontSize === size && <Check className="w-3 h-3 text-green-500" />}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      {/* 2. SELECT FONT FAMILY */}
      <Popover>
        <PopoverTrigger asChild>
          <button onMouseDown={(e) => e.preventDefault()} className="flex items-center gap-1 text-[13px] font-medium hover:bg-slate-100 px-3 py-2 border-r h-full min-w-[80px]">
            {fontFamily} <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-1 flex flex-col" align="start">
          {FONT_FAMILIES.map(font => (
            <button 
              key={font} 
              onMouseDown={(e) => { setFontFamily(font); applyStyle(e, 'fontName', font); }}
              className="flex items-center justify-between px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-600 rounded"
              style={{ fontFamily: font }}
            >
              <span className={fontFamily === font ? "text-green-500 font-medium" : ""}>{font}</span>
              {fontFamily === font && <Check className="w-3 h-3 text-green-500" />}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      {/* 3. COLOR PICKER */}
      <Popover>
        <PopoverTrigger asChild>
          <button onMouseDown={(e) => e.preventDefault()} className="p-2 border-r h-full flex items-center">
            <div className="w-6 h-6 rounded-full border border-slate-300 ring-2 ring-white" style={{ backgroundColor: color }} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4" align="center">
          <p className="text-sm font-bold mb-3 text-slate-700">Bảng màu gợi ý</p>
          <div className="flex gap-2 mb-4">
             {['#FF9900', '#00BCD4', '#757575'].map(c => (
               <button key={c} onClick={() => setColor(c)} className="w-8 h-8 rounded-md" style={{ backgroundColor: c }} />
             ))}
          </div>
          <HexColorPicker color={color} onChange={setColor} className="!w-full !h-40 mb-4" />
          <div className="flex gap-2 items-center mb-4">
              <div className="w-10 h-8 rounded bg-slate-900" style={{ backgroundColor: color }}></div>
              <input value={color} readOnly className="flex-1 bg-slate-100 p-1.5 rounded text-center text-sm font-mono" />
          </div>
          <div className="flex justify-end gap-2 border-t pt-3">
             <button className="px-4 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded">Hủy</button>
             <button 
                onMouseDown={(e) => applyStyle(e, 'foreColor', color)}
                className="px-4 py-1.5 text-sm bg-green-500 text-white rounded font-bold"
             >
                Cập nhật
             </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* 4. FORMATTING BUTTONS */}
      <div className="flex items-center gap-0.5 px-2 border-r">
        <ToolbarButton onClick={(e) => applyStyle(e, 'bold')} icon={<Bold className="w-4 h-4" />} />
        <ToolbarButton onClick={(e) => applyStyle(e, 'italic')} icon={<Italic className="w-4 h-4" />} />
        <ToolbarButton onClick={(e) => applyStyle(e, 'underline')} icon={<Underline className="w-4 h-4" />} />
      </div>

      {/* 5. LISTS & ALIGNMENT */}
      <div className="flex items-center gap-0.5 px-2">
        <ToolbarButton onClick={(e) => applyStyle(e, 'insertUnorderedList')} icon={<List className="w-4 h-4" />} />
        <ToolbarButton onClick={(e) => applyStyle(e, 'justifyLeft')} icon={<AlignLeft className="w-4 h-4" />} />
        <ToolbarButton onClick={(e) => applyStyle(e, 'justifyCenter')} icon={<AlignCenter className="w-4 h-4" />} />
      </div>
    </div>
  );
};

const ToolbarButton = ({ onClick, icon }: { onClick: (e: any) => void, icon: React.ReactNode }) => (
  <button onMouseDown={onClick} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded transition-colors">
    {icon}
  </button>
);

export default RichTextToolbar;