"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeData } from "@/types/resume";
import { Wand2 } from "lucide-react"; // Icon cây đũa thần cho AI

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
  
  // Hàm xử lý thay đổi thông tin cá nhân
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [name]: value },
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. PERSONAL INFO */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Ví dụ: Phạm Trung Tín"
                value={data.personalInfo.fullName}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="email@example.com"
                value={data.personalInfo.email}
                onChange={handlePersonalInfoChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="0384..."
              value={data.personalInfo.phone}
              onChange={handlePersonalInfoChange}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="summary">Giới thiệu bản thân</Label>
              <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                <Wand2 className="w-4 h-4 mr-2" />
                AI Rewrite
              </Button>
            </div>
            <Textarea
              id="summary"
              name="summary"
              placeholder="Tóm tắt ngắn gọn về bạn..."
              className="h-32"
              value={data.personalInfo.summary}
              onChange={handlePersonalInfoChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. EXPERIENCE (Làm mẫu tĩnh trước, sau này thêm nút Add sau) */}
      <Card>
        <CardHeader>
           <CardTitle>Kinh nghiệm làm việc</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">Chức năng thêm kinh nghiệm sẽ code ở phần sau...</p>
        </CardContent>
      </Card>
    </div>
  );
}