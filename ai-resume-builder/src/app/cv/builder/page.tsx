"use client";

import React, { useState,useEffect } from "react";
import {
  ArrowLeft, Download, Eye, Save, History,
  Type, Palette, LayoutTemplate, Grid, Plus, Trash2, GripVertical, Move, Settings, ArrowUp, ArrowDown,ZoomIn, ZoomOut,Undo2, Redo2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { HexColorPicker } from "react-colorful";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
   useDraggable, 
  useDroppable,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import RichTextToolbar from "@/components/CVBuilder/RichTextToolbar"; // Điều chỉnh đường dẫn cho đúng
import CVPreview from "@/components/CVBuilder/CVPreview";
// --- MOCK DATA & TYPES ---
type SectionType = {
  id: string;
  title: string;
   position: 'left' | 'right'; // Thêm thuộc tính này
  type: 'profile' | 'education' | 'experience' | 'skills' | 'custom';
  content: any;
  isVisible: boolean;
  settings?: { label: string; key: string; visible: boolean }[];
};

const INITIAL_SECTIONS: SectionType[] = [
  { id: 'profile', title: 'Personal Information',position: 'left', type: 'profile', content: {}, isVisible: true },
  { id: 'skills', title: 'Skills',position: 'left', type: 'skills', content: {}, isVisible: true },
    { id: 'cert', title: 'Certificate', position: 'left', type: 'custom', content: {}, isVisible: true },

  { id: 'education', title: 'Education',position: 'left', type: 'education', content: {}, isVisible: true },
  { id: 'objective', title: 'Career Objective',position: 'right', type: 'custom', content: {}, isVisible: true },
  { id: 'project', title: 'Project',position: 'right', type: 'custom', content: {}, isVisible: true },
];

const AVAILABLE_MODULES = [
  { id: 'awards', title: 'Giải thưởng' },
  { id: 'activities', title: 'Hoạt động' },
  { id: 'references', title: 'Người tham chiếu' },
  { id: 'interests', title: 'Sở thích' },
];
function DraggableModuleItem({ mod }: { mod: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-${mod.id}`,
    data: mod,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm hover:border-[#00b14f] transition-all cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 ring-2 ring-[#00b14f]' : ''}`}
    >
      <div className="flex items-center gap-3 text-slate-700">
        <Grid className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium">{mod.title}</span>
      </div>
      <Plus className="w-4 h-4 text-[#00b14f]" />
    </div>
  );
}
// --- COMPONENTS CON ---

// 1. Sortable Item Wrapper (Cho phép kéo thả)
// CVBuilderPage.tsx

// 1. Sortable Item Wrapper (Sửa lại để nhận thêm props settings)
function SortableSection({
  id,
  children,
  onDelete,
  onMoveUp,
  onMoveDown,
  settings,          // Thêm cái này
  onUpdateSettings   // Thêm cái này
}: {
  id: string,
  children: React.ReactNode,
  onDelete: () => void,
  onMoveUp: () => void,
  onMoveDown: () => void,
  settings?: SectionType['settings'],           // Định nghĩa kiểu optional
  onUpdateSettings?: (key: string) => void      // Định nghĩa kiểu optional
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
      className="group"
    >
      {/* 1. Rich Text Toolbar */}
      <div className={`absolute -top-14 left-0 z-[100] transition-all duration-200 ${isFocused || isHovered ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <RichTextToolbar isVisible={true} />
      </div>

      {/* 2. Các nút điều khiển */}
      <div className={`absolute -left-12 top-0 flex flex-col gap-1 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
        <button {...attributes} {...listeners} className="p-1.5 bg-white border rounded shadow hover:bg-slate-50 cursor-grab active:cursor-grabbing">
          <Move className="w-4 h-4 text-slate-500" />
        </button>
        <button onClick={onDelete} className="p-1.5 bg-white border rounded shadow hover:bg-red-50 text-red-500">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Vùng chứa nội dung */}
      <div 
        className={`rounded-lg border-2 transition-all p-2 ${
          isFocused ? 'border-[#00b14f] border-dashed bg-slate-50/50' : 'border-transparent group-hover:border-slate-200 group-hover:border-dashed'
        }`}
      >
        {children}
      </div>
    </div>
  );
}



// --- MAIN PAGE ---
export default function CVBuilderPage() {
  // States
    const [sections, setSections] = useState<SectionType[]>(INITIAL_SECTIONS);
  const [zoom, setZoom] = useState(100); // State cho Zoom
  const [isHoveringPreview, setIsHoveringPreview] = useState(false); 

  // Hàm xử lý tăng/giảm zoom bằng nút bấm
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 5, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 5, 50));
  const handleZoomChange = (value: number[]) => {
  setZoom(value[0]);
};
  const [styles, setStyles] = useState({
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 1.5,
    themeColor: '#FF9900', // TopCV Orange
    textColor: '#333333',
  });
  const [activeTab, setActiveTab] = useState('design');
const [past, setPast] = useState<SectionType[][]>([]);
const [future, setFuture] = useState<SectionType[][]>([]);
const updateSectionsWithHistory = (newSections: SectionType[]) => {
  setPast((prev) => [...prev, sections]); // Lưu trạng thái hiện tại vào quá khứ
  setFuture([]); // Xóa lịch sử Redo khi có hành động mới
  setSections(newSections);
};
  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handlers
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over) return;

  // TRƯỜNG HỢP 1: Kéo từ Sidebar vào Preview
  if (active.id.toString().startsWith('sidebar-')) {
    const moduleData = active.data.current;
    if (!moduleData) return;

    const newSection: SectionType = {
      id: `${moduleData.id}-${Date.now()}`,
      title: moduleData.title,
      type: 'custom',
      position: 'right',
      content: {},
      isVisible: true,
    };

    const overIndex = sections.findIndex((s) => s.id === over.id);
    let newSections = [...sections];

    if (overIndex !== -1) {
      newSections.splice(overIndex, 0, newSection);
    } else {
      newSections.push(newSection);
    }

    // Cập nhật thông qua hàm History
    updateSectionsWithHistory(newSections);
    return;
  }

  // TRƯỜNG HỢP 2: Sắp xếp lại các mục hiện có
  if (active.id !== over.id) {
    const oldIndex = sections.findIndex((i) => i.id === active.id);
    const newIndex = sections.findIndex((i) => i.id === over.id);
    
    const newSections = arrayMove(sections, oldIndex, newIndex);
    
    // Cập nhật thông qua hàm History
    updateSectionsWithHistory(newSections);
  }
};
  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id);
    if (direction === 'up' && index > 0) {
      setSections(arrayMove(sections, index, index - 1));
    } else if (direction === 'down' && index < sections.length - 1) {
      setSections(arrayMove(sections, index, index + 1));
    }
  };

  const toggleSetting = (sectionId: string, settingKey: string) => {
    setSections(prev => prev.map(s => {
      if (s.id === sectionId && s.settings) {
        return {
          ...s,
          settings: s.settings.map(opt =>
            opt.key === settingKey ? { ...opt, visible: !opt.visible } : opt
          )
        };
      }
      return s;
    }));
  };


const addModule = (module: { id: string, title: string }) => {
  const newSection: SectionType = { 
    ...module, 
    type: 'custom', 
    content: {}, 
    isVisible: true, 
    id: `${module.id}-${Date.now()}`,
    position: 'right' 
  };

  const newSections = [...sections, newSection];
  
  // Cập nhật thông qua hàm History
  updateSectionsWithHistory(newSections);
};
const undo = () => {
  if (past.length === 0) return;

  const previous = past[past.length - 1];
  const newPast = past.slice(0, past.length - 1);

  setFuture((prev) => [sections, ...prev]);
  setPast(newPast);
  setSections(previous);
};

const redo = () => {
  if (future.length === 0) return;

  const next = future[0];
  const newFuture = future.slice(1);

  setPast((prev) => [...prev, sections]);
  setFuture(newFuture);
  setSections(next);
};
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [sections, past, future]); // Quan trọng: dependency phải có đủ các mảng này

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans">

      {/* 1. TOP NAVBAR */}
      <header className="h-14 bg-white border-b px-4 flex justify-between items-center z-20 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="#" className="text-slate-500 hover:text-slate-800"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-lg text-slate-800">CV Java Developer - Phạm Trung Tín</h1>
            <div className="flex items-center gap-1 ml-4 border-l pl-4">
      <button 
        onClick={undo}
        disabled={past.length === 0}
        className={`p-2 rounded hover:bg-slate-100 ${past.length === 0 ? 'text-slate-300' : 'text-slate-600'}`}
        title="Hoàn tác (Ctrl+Z)"
      >
        <Undo2 className="w-5 h-5" />
      </button>
      <button 
        onClick={redo}
        disabled={future.length === 0}
        className={`p-2 rounded hover:bg-slate-100 ${future.length === 0 ? 'text-slate-300' : 'text-slate-600'}`}
        title="Làm lại (Ctrl+Shift+Z)"
      >
        <Redo2 className="w-5 h-5" />
      </button>
    </div>
  </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="gap-2"><Eye className="w-4 h-4" /> Xem trước</Button>
          <Button className="bg-[#00b14f] hover:bg-[#009e47] gap-2"><Save className="w-4 h-4" /> Lưu CV</Button>
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Tải xuống</Button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">

        {/* === LEFT SIDEBAR: TOOLS === */}
        <aside className="w-[320px] bg-white border-r flex flex-col shadow-lg z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
            <div className="flex border-b">
              <TabsList className="w-full justify-start bg-white p-0 h-12 rounded-none">
                <TabsTrigger value="design" className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#00b14f] data-[state=active]:text-[#00b14f]">
                  <Palette className="w-4 h-4 mr-2" /> Thiết kế
                </TabsTrigger>
                <TabsTrigger value="modules" className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#00b14f] data-[state=active]:text-[#00b14f]">
                  <LayoutTemplate className="w-4 h-4 mr-2" /> Thêm mục
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">

              {/* Tab 1: Thiết kế & Font */}
              <TabsContent value="design" className="mt-0 space-y-6">
                {/* Màu chủ đạo */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Màu chủ đạo</Label>
                  <div className="flex gap-2 mb-2">
                    {['#FF9900', '#00b14f', '#2563eb', '#dc2626', '#475569'].map(c => (
                      <button
                        key={c}
                        onClick={() => setStyles(s => ({ ...s, themeColor: c }))}
                        className={`w-8 h-8 rounded-full border-2 ${styles.themeColor === c ? 'border-black ring-1 ring-offset-1' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <HexColorPicker color={styles.themeColor} onChange={(c) => setStyles(s => ({ ...s, themeColor: c }))} className="w-full !h-32" />
                </div>

                {/* Font chữ */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Font chữ</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={styles.fontFamily}
                    onChange={(e) => setStyles(s => ({ ...s, fontFamily: e.target.value }))}
                  >
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                </div>

                {/* Cỡ chữ & Dãn dòng */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs font-bold text-slate-500 uppercase">Cỡ chữ</Label>
                      <span className="text-xs text-slate-400">{styles.fontSize}px</span>
                    </div>
                    <Slider
                      value={[styles.fontSize]}
                      min={10} max={20} step={1}
                      onValueChange={([v]) => setStyles(s => ({ ...s, fontSize: v }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs font-bold text-slate-500 uppercase">Dãn dòng</Label>
                      <span className="text-xs text-slate-400">{styles.lineHeight}</span>
                    </div>
                    <Slider
                      value={[styles.lineHeight]}
                      min={1} max={2} step={0.1}
                      onValueChange={([v]) => setStyles(s => ({ ...s, lineHeight: v }))}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Thêm mục (Kéo thả) */}
              <TabsContent value="modules" className="mt-0 space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Mục chưa sử dụng</Label>
                  <p className="text-xs text-slate-400 mb-2">Bấm dấu + để thêm vào CV</p>
                  <div className="grid gap-3">
                    {AVAILABLE_MODULES.map((mod) => (
                     <DraggableModuleItem key={mod.id} mod={mod} />

                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Sắp xếp mục đã dùng</Label>
                  <p className="text-xs text-slate-400 mb-2">Kéo thả để thay đổi vị trí bên phải</p>
                  {/* Danh sách Sortable thu nhỏ ở Sidebar để người dùng dễ hình dung */}
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                      {sections.map((section) => (
                        <SortableSection
                          key={section.id}
                          id={section.id}
                          onDelete={() => setSections(sections.filter(s => s.id !== section.id))}
                          onMoveUp={() => moveSection(section.id, 'up')}
                          onMoveDown={() => moveSection(section.id, 'down')}
                          settings={section.settings}
                          onUpdateSettings={(key) => toggleSetting(section.id, key)}
                        >
                          <div className="flex flex-col">
                            <h3 className="text-lg font-bold uppercase border-b-2 mb-2 pb-1" style={{ color: styles.themeColor, borderColor: styles.themeColor }}>
                              {section.title}
                            </h3>

                            {/* Render nội dung mẫu dựa trên settings */}
                            <div className="space-y-1 text-sm">
                              {section.id === 'profile' ? (
                                <div className="grid grid-cols-1 gap-1">
                                  {section.settings?.find(s => s.key === 'email')?.visible && <p>📧 trungtinpham336@gmail.com</p>}
                                  {section.settings?.find(s => s.key === 'phone')?.visible && <p>📞 0384924730</p>}
                                  {section.settings?.find(s => s.key === 'address')?.visible && <p>📍 Nhà thi đấu Đại Học Nông Lâm</p>}
                                  {section.settings?.find(s => s.key === 'link')?.visible && <p>🌐 linkedin.com/in/tin-pham</p>}
                                </div>
                              ) : (
                                <div className="min-h-[40px] text-slate-600 italic">
                                  Nhấp vào để nhập nội dung cho {section.title}...
                                </div>
                              )}
                            </div>
                          </div>
                        </SortableSection>
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* === RIGHT MAIN: PREVIEW CANVAS === */}
        <main className="flex-1 bg-slate-100 flex flex-col relative overflow-hidden"
        onMouseEnter={() => setIsHoveringPreview(true)}
  onMouseLeave={() => setIsHoveringPreview(false)}

        >
          {/* Thanh thông báo gợi ý */}
          <div className="bg-[#e5f7ed] text-[#00b14f] px-4 py-2 text-sm flex items-center justify-center border-b border-[#c2e0d1]">
            <span className="font-medium">Gợi ý:</span> Bôi đen văn bản để chỉnh sửa cỡ chữ và định dạng in đậm, in nghiêng!
          </div>

          {/* CANVAS AREA - ZOOM & SCROLL */}
<div className="flex-1 overflow-auto flex justify-center p-8 custom-scrollbar">
  <div
    style={{
      transform: `scale(${zoom / 100})`,
      transformOrigin: 'top center',
      transition: 'transform 0.15s ease-out'
    }}
    className="h-fit shadow-2xl"
  >
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <CVPreview
          sections={sections}
          styles={styles}
          SortableSection={SortableSection}
          onDelete={(id) => setSections(prev => prev.filter(s => s.id !== id))}
          onMoveUp={(id) => moveSection(id, 'up')}
          onMoveDown={(id) => moveSection(id, 'down')}
        />
      </SortableContext>
    </DndContext>
  </div>
</div>


          {/* Zoom Controls */}
         <div 
    className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300 z-[100]
      ${isHoveringPreview ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
  >
    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm shadow-2xl px-3 py-2 rounded-full border border-slate-200">
      
      {/* Nút Thu nhỏ */}
      <button 
        onClick={handleZoomOut}
        className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors"
      >
        <ZoomOut className="w-5 h-5" />
      </button>

      {/* Thanh kéo Slider */}
      <div className="w-40 flex items-center px-2">
        <Slider 
          value={[zoom]} 
          min={50} 
          max={200} 
          step={1} 
          onValueChange={([v]) => setZoom(v)}
          className="cursor-pointer" 
        />
      </div>

      {/* Chỉ số % */}
      <span className="text-sm font-bold text-slate-700 min-w-[45px] text-center">
        {zoom}%
      </span>

      {/* Nút Phóng to */}
      <button 
        onClick={handleZoomIn}
        className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      
    </div>
  </div>
</main>
      </div>
    </div>
  );
}

// Helper component Label
function Label({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={`mb-1 ${className}`}>{children}</div>;
}