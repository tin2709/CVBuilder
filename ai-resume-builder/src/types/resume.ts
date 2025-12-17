// types/resume.ts
export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    summary: string;
  };
  experience: {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
  }[];
}