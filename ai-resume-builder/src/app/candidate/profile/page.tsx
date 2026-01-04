"use client";

import { useState, useEffect } from "react";
import {
  useMyProfile,
  useProfileActions,
  useExperienceActions,
  useProjectActions,
  useEducationActions
} from "@/hooks/use-candidate-data";
import {
  Loader2, Plus, Trash2, PenLine, Sparkles, User, Briefcase,
  GraduationCap, Code2, Settings, Github, Linkedin, Globe,
  MapPin, Phone, Mail, ExternalLink, Calendar, Save, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function CandidateProfilePage() {
  
  const { data: profileRes, isLoading } = useMyProfile();
  const profile = profileRes?.data;
  
  // Gọi các Hook Actions
  const profileActions = useProfileActions();
  const expActions = useExperienceActions();
  const projActions = useProjectActions();
  const eduActions = useEducationActions();
  
  // State tạm để lưu thông tin chung khi gõ
  const [localSkills, setLocalSkills] = useState<string[]>([]);
  const [generalInfo, setGeneralInfo] = useState<any>({});

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Hiện tại";
    return new Date(dateStr).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
  };

 
  useEffect(() => {
    if (profile?.skills) {
      setLocalSkills(profile.skills);
    }
  }, [profile?.skills]);
 if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
    </div>
  );
  // 3. Hàm thêm một ô nhập kỹ năng mới
  const addSkillField = () => {
    setLocalSkills([...localSkills, ""]);
  };

  // 4. Hàm cập nhật giá trị kỹ năng tại một vị trí
  const updateSkillValue = (index: number, value: string) => {
    const newSkills = [...localSkills];
    newSkills[index] = value;
    setLocalSkills(newSkills);
  };

  // 5. Hàm xóa kỹ năng
  const removeSkill = (index: number) => {
    setLocalSkills(localSkills.filter((_, i) => i !== index));
  };

  // 6. Kiểm tra xem dữ liệu có thay đổi so với bản gốc không để hiện nút Lưu
  const isSkillsChanged = JSON.stringify(localSkills) !== JSON.stringify(profile?.skills);


  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hồ sơ chuyên nghiệp</h1>
            <p className="text-slate-500">Quản lý thông tin cá nhân và lộ trình sự nghiệp của bạn.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-slate-200">Xem bản PDF</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 px-8 shadow-lg shadow-blue-200"
              onClick={() => profileActions.update.mutate({ ...profile, ...generalInfo })}
              disabled={profileActions.update.isPending}
            >
              {profileActions.update.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Lưu thay đổi
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR (Thông tin cá nhân nhanh) */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-none shadow-sm sticky top-24 overflow-hidden">
              <div className="h-2 bg-blue-600" />
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-inner uppercase">
                  {profile?.user?.name?.[0]}
                </div>
                <h3 className="font-bold text-xl text-slate-900">{profile?.user?.name}</h3>
                <p className="text-sm text-blue-600 font-medium mb-6 uppercase tracking-wider">{profile?.headline}</p>

                <div className="text-left space-y-4 mb-8">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-slate-400">EMAIL</Label>
                    <div className="flex items-center gap-2 text-sm text-slate-600"><Mail className="w-3 h-3" /> {profile?.user?.email}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-slate-400">ĐIỆN THOẠI</Label>
                    <Input
                      className="h-8 text-sm"
                      defaultValue={profile?.phone}
                      onChange={(e) => setGeneralInfo({ ...generalInfo, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-slate-400">ĐỊA CHỈ</Label>
                    <Input
                      className="h-8 text-sm"
                      defaultValue={profile?.address}
                      onChange={(e) => setGeneralInfo({ ...generalInfo, address: e.target.value })}
                    />
                  </div>
                </div>

                <Separator className="my-6" />
                <Progress value={85} className="h-1.5" />
              </CardContent>
            </Card>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-9 space-y-8">

            {/* 1. GIỚI THIỆU & MẠNG XÃ HỘI */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Sparkles className="text-blue-600 w-5 h-5" /> Giới thiệu bản thân</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">HEADLINE</Label>
                  <Input
                    defaultValue={profile?.headline}
                    onChange={(e) => setGeneralInfo({ ...generalInfo, headline: e.target.value })}
                    placeholder="Ví dụ: Senior Java Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">TÓM TẮT CHUYÊN MÔN</Label>
                  <Textarea
                    defaultValue={profile?.summary}
                    onChange={(e) => setGeneralInfo({ ...generalInfo, summary: e.target.value })}
                    className="min-h-[100px] bg-slate-50 border-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputGroup label="Github" icon={<Github className="w-4 h-4" />} value={profile?.githubUrl} onChange={(val: any) => setGeneralInfo({ ...generalInfo, githubUrl: val })} />
                  <InputGroup label="Linkedin" icon={<Linkedin className="w-4 h-4" />} value={profile?.linkedinUrl} onChange={(val: any) => setGeneralInfo({ ...generalInfo, linkedinUrl: val })} />
                  <InputGroup label="Portfolio" icon={<Globe className="w-4 h-4" />} value={profile?.portfolioUrl} onChange={(val: any) => setGeneralInfo({ ...generalInfo, portfolioUrl: val })} />
                </div>
              </CardContent>
            </Card>

            {/* 2. KINH NGHIỆM LÀM VIỆC */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><Briefcase className="text-blue-600 w-5 h-5" /> Kinh nghiệm làm việc</CardTitle>
                <ExperienceDialog mode="add" onSave={(data: any) => expActions.add.mutate(data)} />
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {profile?.workExperiences?.map((exp: any) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-blue-100 group">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{exp.role}</h4>
                        <p className="text-blue-600 text-sm">{exp.companyName} • <span className="text-slate-500 font-normal">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span></p>
                        <p className="text-sm text-slate-600 mt-2">{exp.description}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExperienceDialog mode="edit" initialData={exp} onSave={(data: any) => expActions.update.mutate({ id: exp.id, data })} />
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => expActions.remove.mutate(exp.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 3. DỰ ÁN */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><Code2 className="text-blue-600 w-5 h-5" /> Dự án cá nhân</CardTitle>
                <ProjectDialog mode="add" onSave={(data: any) => projActions.add.mutate(data)} />
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile?.projects?.map((proj: any) => (
                  <div key={proj.id} className="p-5 rounded-2xl border bg-slate-50/50 group relative">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-bold text-slate-900">{proj.projectName}</h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ProjectDialog mode="edit" initialData={proj} onSave={(data: any) => projActions.update.mutate({ id: proj.id, data })} />
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => projActions.remove.mutate(proj.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {proj.techStack?.map((t: string) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 4. HỌC VẤN */}
              <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="text-blue-600 w-5 h-5" /> Học vấn</CardTitle>
                  <EducationDialog mode="add" onSave={(data: any) => eduActions.add.mutate(data)} />
                </CardHeader>
                 <CardContent className="p-6 space-y-6">
                  {profile?.educations?.map((edu: any) => (
                    <div key={edu.id} className="group flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900">{edu.schoolName}</h4>
                        <p className="text-xs text-slate-500">{edu.major} • {formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                        {/* Hiển thị GPA: Nếu null thì hiện 0.0 */}
                        <Badge className="mt-2 bg-emerald-50 text-emerald-700 border-emerald-100">
                          GPA: {edu.gpa ?? "0.0"}
                        </Badge>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                        <EducationDialog mode="edit" initialData={edu} onSave={(data: any) => eduActions.update.mutate({ id: edu.id, data })} />
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => eduActions.remove.mutate(edu.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 5. KỸ NĂNG */}
              <Card className="border-none shadow-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="text-blue-600 w-5 h-5" /> Kỹ năng
                  </CardTitle>

                  {/* Nút lưu chỉ hiện khi có sự thay đổi */}
                  {isSkillsChanged && (
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs animate-in fade-in slide-in-from-right-2"
                      onClick={() => profileActions.update.mutate({ ...profile, skills: localSkills.filter(s => s.trim() !== "") })}
                      disabled={profileActions.update.isPending}
                    >
                      {profileActions.update.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                      Lưu kỹ năng
                    </Button>
                  )}
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {localSkills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-1 group animate-in zoom-in-95 duration-200">
                        <div className="relative">
                          <Input
                            value={skill}
                            onChange={(e) => updateSkillValue(index, e.target.value)}
                            placeholder="Nhập kỹ năng..."
                            className="h-8 text-sm pr-7 min-w-[120px] bg-blue-50/30 border-blue-100 focus:border-blue-400 focus:bg-white transition-all w-fit"
                            autoFocus={skill === ""}
                          />
                          <button
                            onClick={() => removeSkill(index)}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 p-0.5 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 h-8 rounded-lg transition-all"
                      onClick={addSkillField}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Thêm kỹ năng
                    </Button>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-4 italic">
                    * Bấm "Thêm kỹ năng" để thêm nhiều mục. Nhấn X để xóa. Đừng quên bấm Lưu để cập nhật hồ sơ.
                  </p>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS CHO FORM ---

function InputGroup({ label, icon, value, onChange }: any) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
        {icon} {label}
      </Label>
      <Input
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 text-sm"
      />
    </div>
  );
}

// Dialog Component mẫu cho Experience
function ExperienceDialog({ mode, initialData, onSave }: any) {
  const [data, setData] = useState(initialData || { companyName: '', role: '', startDate: '', endDate: '', description: '' });
  return (
    <Dialog>
      <DialogTrigger asChild>
        {mode === 'add' ? (
          <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50"><Plus className="w-4 h-4 mr-1" /> Thêm mới</Button>
        ) : (
          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600 transition-colors"><PenLine className="w-4 h-4" /></Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{mode === 'add' ? 'Thêm kinh nghiệm mới' : 'Chỉnh sửa kinh nghiệm'}</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Công ty</Label><Input value={data.companyName} onChange={e => setData({ ...data, companyName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Chức vụ</Label><Input value={data.role} onChange={e => setData({ ...data, role: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Ngày bắt đầu</Label><Input type="date" value={data.startDate?.split('T')[0]} onChange={e => setData({ ...data, startDate: e.target.value })} /></div>
            <div className="space-y-2"><Label>Ngày kết thúc</Label><Input type="date" value={data.endDate?.split('T')[0]} onChange={e => setData({ ...data, endDate: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Mô tả công việc</Label><Textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })} /></div>
          <Button className="w-full bg-blue-600" onClick={() => onSave(data)}>Lưu thông tin</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Dialog Component mẫu cho Project
function ProjectDialog({ mode, initialData, onSave }: any) {
  const [data, setData] = useState(initialData || { projectName: '', description: '', githubLink: '', liveLink: '', techStack: [] });
  return (
    <Dialog>
      <DialogTrigger asChild>
        {mode === 'add' ? (
          <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50"><Plus className="w-4 h-4 mr-1" /> Thêm dự án</Button>
        ) : (
          <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-blue-600"><PenLine className="w-3 h-3" /></Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Thông tin dự án</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2"><Label>Tên dự án</Label><Input value={data.projectName} onChange={e => setData({ ...data, projectName: e.target.value })} /></div>
          <div className="space-y-2"><Label>Mô tả</Label><Textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Github</Label><Input value={data.githubLink} onChange={e => setData({ ...data, githubLink: e.target.value })} /></div>
            <div className="space-y-2"><Label>Live Link</Label><Input value={data.liveLink} onChange={e => setData({ ...data, liveLink: e.target.value })} /></div>
          </div>
          <Button className="w-full bg-blue-600" onClick={() => onSave(data)}>Lưu dự án</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Dialog Component mẫu cho Education
function EducationDialog({ mode, initialData, onSave }: any) {
  // Thêm GPA vào state mặc định
  const [data, setData] = useState(initialData || { schoolName: '', major: '', startDate: '', endDate: '', gpa: '' });
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {mode === 'add' ? (
          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600"><Plus className="w-4 h-4" /></Button>
        ) : (
          <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-blue-600"><PenLine className="w-3 h-3" /></Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Thông tin học vấn</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Trường học</Label><Input value={data.schoolName} onChange={e => setData({ ...data, schoolName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Ngành học</Label><Input value={data.major} onChange={e => setData({ ...data, major: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Bắt đầu</Label><Input type="date" value={data.startDate?.split('T')[0]} onChange={e => setData({ ...data, startDate: e.target.value })} /></div>
            <div className="space-y-2"><Label>Kết thúc</Label><Input type="date" value={data.endDate?.split('T')[0]} onChange={e => setData({ ...data, endDate: e.target.value })} /></div>
          </div>
          {/* Ô NHẬP GPA MỚI THÊM */}
          <div className="space-y-2">
            <Label>Điểm trung bình (GPA)</Label>
            <Input 
              placeholder="Ví dụ: 3.6/4.0 hoặc 8.5/10" 
              value={data.gpa || ""} 
              onChange={e => setData({ ...data, gpa: e.target.value })} 
            />
          </div>
          <Button className="w-full bg-blue-600" onClick={() => onSave(data)}>Lưu học vấn</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}