"use client";

import Link from "next/link";
import { 
  Search, Bell, Settings, Filter, Download, 
  ChevronDown, SlidersHorizontal, X, CheckCircle2, 
  MoreHorizontal, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

// Mock Data
const candidates = [
  {
    id: 1,
    name: "Nguyen Van A",
    role: "Senior UX Designer",
    updated: "2 days ago",
    score: 95,
    note: "Strong portfolio match",
    skills: ["Figma", "Sketch"],
    exp: "5 Years",
    avatar: null, // No image, use fallback
    initials: "NA"
  },
  {
    id: 2,
    name: "Tran Thi B",
    role: "Product Designer",
    updated: "5 hours ago",
    score: 88,
    note: null,
    skills: ["Adobe XD", "UI/UX"],
    exp: "4 Years",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    initials: "TB"
  },
  {
    id: 3,
    name: "Le Van C",
    role: "UX Researcher",
    updated: "1 week ago",
    score: 82,
    note: null,
    skills: ["User Testing", "Research"],
    exp: "3 Years",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    initials: "LC"
  },
  {
    id: 4,
    name: "Pham Thi D",
    role: "UI Designer",
    updated: "yesterday",
    score: 75,
    note: null,
    skills: ["Visual Design"],
    exp: "2 Years",
    avatar: null,
    initials: "PD"
  },
  {
    id: 5,
    name: "Hoang Van E",
    role: "Graphic Designer",
    updated: "3 days ago",
    score: 60,
    note: null,
    skills: ["Photoshop"],
    exp: "2 Years",
    avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    initials: "HE"
  },
];

export default function CandidatesPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-slate-900">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800 mr-4">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
              </div>
              RecruitAI
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
              <Link href="#" className="hover:text-blue-600">Dashboard</Link>
              <Link href="#" className="hover:text-blue-600">Jobs</Link>
              <Link href="#" className="text-blue-600 font-bold">Candidates</Link>
              <Link href="#" className="hover:text-blue-600">Reports</Link>
            </nav>
          </div>

          {/* Right: Search & Profile */}
          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search candidates..." 
                className="pl-9 bg-slate-100 border-none rounded-full h-9 text-sm" 
              />
            </div>
            <Button variant="ghost" size="icon" className="text-slate-500">
                <Bell className="w-5 h-5" />
            </Button>
            <Avatar className="w-8 h-8 cursor-pointer border border-slate-200">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>HR</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        
        {/* CARD CONTAINER */}
        <Card className="min-h-[800px] bg-white border-none shadow-sm p-8 rounded-xl">
            
            {/* 1. PAGE TITLE & ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <span>Dashboard</span> <span className="text-slate-300">/</span>
                        <span>Senior UX Designer</span> <span className="text-slate-300">/</span>
                        <span className="text-slate-600 font-medium">Recommended Candidates</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Danh sách Ứng viên được đề xuất</h1>
                    <p className="text-slate-500 mt-1 text-sm">
                        AI Suggestion for <Link href="#" className="text-blue-600 font-semibold hover:underline">Senior UX Designer</Link>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="text-slate-700 border-slate-300 gap-2 h-9">
                        <SlidersHorizontal className="w-4 h-4" /> Customize AI
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-9 shadow-blue-200 shadow-md">
                        <Download className="w-4 h-4" /> Export List
                    </Button>
                </div>
            </div>

            {/* 2. FILTERS BAR */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="text-sm font-medium text-slate-400 mr-2">Filters:</span>
                
                {/* Filter Dropdowns */}
                <FilterButton label="Experience: > 3 Years" />
                <FilterButton label="Location: Ho Chi Minh" />
                <FilterButton label="Salary: Negotiable" />
                
                {/* Active Tag with Remove */}
                <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 h-9 px-3 text-sm font-medium gap-2 rounded-lg cursor-pointer">
                    Skills: Figma <X className="w-3.5 h-3.5" />
                </Badge>

                {/* Additional Filter */}
                <FilterButton label="AI Score: > 80%" />

                <Button variant="link" className="text-slate-400 hover:text-slate-600 text-sm ml-auto px-0">
                    Clear all
                </Button>
            </div>

            {/* 3. CANDIDATES TABLE */}
            <div className="rounded-lg border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-b-slate-100">
                            <TableHead className="w-[280px] py-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Candidate</TableHead>
                            <TableHead className="py-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Current Role</TableHead>
                            <TableHead className="w-[250px] py-4 text-xs font-bold uppercase text-slate-400 tracking-wider">AI Match Score</TableHead>
                            <TableHead className="py-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Key Skills</TableHead>
                            <TableHead className="py-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Experience</TableHead>
                            <TableHead className="text-right py-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {candidates.map((candidate) => (
                            <TableRow key={candidate.id} className="hover:bg-slate-50/80 border-b-slate-50 transition-colors group">
                                {/* Candidate Info */}
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-slate-100 bg-white">
                                            <AvatarImage src={candidate.avatar || ""} />
                                            <AvatarFallback className="text-xs font-bold text-slate-500 bg-slate-100">{candidate.initials}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{candidate.name}</div>
                                            <div className="text-[11px] text-slate-400">Updated {candidate.updated}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                
                                {/* Role */}
                                <TableCell className="text-sm text-slate-600 font-medium">
                                    {candidate.role}
                                </TableCell>

                                {/* AI Score */}
                                <TableCell>
                                    <div className="w-full max-w-[180px]">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`text-lg font-bold ${getScoreColor(candidate.score)}`}>
                                                {candidate.score}%
                                            </span>
                                            {candidate.score >= 90 && (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            )}
                                        </div>
                                        <Progress 
                                            value={candidate.score} 
                                            className="h-1.5 bg-slate-100" 
                                            // Note: Shadcn Progress indicator color is usually set via global CSS or utility class on the Indicator itself. 
                                            // Here we simulate visually with Tailwind classes on the wrapper if possible, 
                                            // or assuming default primary color. 
                                            // For specific colors per row, we might need a custom Progress component or inline styles.
                                            // Below is a simplified approach using default blue.
                                        />
                                         {/* Custom style to override Progress bar color based on score */}
                                         <style jsx global>{`
                                            /* Hacky way for demo purposes to color the progress bar */
                                         `}</style>
                                         <div className={`h-1.5 w-full bg-slate-100 rounded-full mt-1 overflow-hidden`}>
                                            <div 
                                                className={`h-full rounded-full ${getProgressBarColor(candidate.score)}`} 
                                                style={{ width: `${candidate.score}%` }}
                                            ></div>
                                         </div>

                                        {candidate.note && (
                                            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{candidate.note}</p>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Skills */}
                                <TableCell>
                                    <div className="flex flex-wrap gap-1.5">
                                        {candidate.skills.map((skill, i) => (
                                            <Badge key={i} variant="secondary" className="bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 font-normal">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>

                                {/* Experience */}
                                <TableCell className="text-sm text-slate-500">
                                    {candidate.exp}
                                </TableCell>

                                {/* Actions */}
                                <TableCell className="text-right">
                                    {/* Bọc nút Button bằng Link và trỏ tới ID động */}
                                    <Link href={`/recruiter/candidates/${candidate.id}`}>
                                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-xs h-8 px-3">
                                            View Profile
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* 4. PAGINATION */}
            <div className="flex items-center justify-between mt-6 px-2">
                <span className="text-sm text-slate-500">Showing 1 to 5 of 24 results</span>
                
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 text-slate-400" disabled>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="default" size="icon" className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-xs font-bold">1</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 text-xs font-medium hover:bg-slate-50">2</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 text-xs font-medium hover:bg-slate-50">3</Button>
                    <span className="text-slate-400 text-xs mx-1">...</span>
                    <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-50">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

        </Card>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS & FUNCTIONS ---

function FilterButton({ label }: { label: string }) {
    return (
        <Button variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 h-9 px-3 text-sm font-medium gap-2 rounded-lg">
            {label}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </Button>
    )
}

function getScoreColor(score: number) {
    if (score >= 90) return "text-blue-600";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-yellow-600";
    return "text-slate-500";
}

function getProgressBarColor(score: number) {
    if (score >= 90) return "bg-blue-600";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-slate-400";
}