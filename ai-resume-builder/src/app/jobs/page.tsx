"use client";

import Link from "next/link";
import { 
  Bot, Search, MapPin, Briefcase, DollarSign, 
  Sparkles, Filter, Bookmark, Grid, List, 
  ChevronDown, Globe, Clock
} from "lucide-react";

// Import UI components dựa trên file structure bạn cung cấp
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label"; // Thường đi kèm checkbox

// Mock Data cho Job List
const JOBS = [
  {
    id: 1,
    title: "Senior UX Designer",
    company: "TechSolutions Inc.",
    logo: "TS",
    logoColor: "bg-slate-900 text-white",
    match: 98,
    location: "Remote",
    type: "Full-time",
    salary: "$3k - $5k",
    posted: "2 days ago",
    tags: ["Figma", "User Research", "Prototyping"],
    featured: true
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "CreativeFlow Studio",
    logo: "CF",
    logoColor: "bg-yellow-100 text-yellow-700",
    match: 92,
    location: "Hanoi",
    type: "Contract",
    salary: "$1.5k - $2.5k",
    posted: "5 hours ago",
    tags: ["React", "Tailwind", "TypeScript"],
    featured: false
  },
  {
    id: 3,
    title: "Product Manager (AI)",
    company: "Global Systems Ltd.",
    logo: "GS",
    logoColor: "bg-green-100 text-green-700",
    match: 85,
    location: "Ho Chi Minh",
    type: "Full-time",
    salary: "Negotiable",
    posted: "1 week ago",
    tags: ["Product Strategy", "AI/ML", "Agile"],
    featured: false
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "DataCorp Analytics",
    logo: "DA",
    logoColor: "bg-teal-100 text-teal-700",
    match: 78,
    location: "Remote",
    type: "Full-time",
    salary: "$4k - $6k",
    posted: "3 days ago",
    tags: ["Python", "SQL", "Big Data"],
    featured: false
  }
];

export default function JobSearchPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* --- 1. HEADER (Giữ nguyên style gọn gàng) --- */}
      <header className="border-b sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Bot className="w-5 h-5" />
            </div>
            SmartJobs AI
          </Link>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <Link href="#" className="text-blue-600 font-semibold">Jobs</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Companies</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">AI Career Guide</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-slate-600 hover:text-blue-600 font-medium">Log In</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">Sign Up</Button>
          </div>
        </div>
      </header>

      {/* --- 2. HERO SECTION (Search & Title) --- */}
      <section className="pt-16 pb-12 px-4 text-center max-w-4xl mx-auto">
        <Badge variant="secondary" className="mb-4 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1">
          <Sparkles className="w-3 h-3 mr-2" /> AI-Powered Matching
        </Badge>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Find your dream job with AI
        </h1>
        <p className="text-slate-500 mb-10 max-w-2xl mx-auto">
          Our intelligent system analyzes your profile to find positions that perfectly match your skills, experience, and career goals.
        </p>

        {/* Search Bar Container */}
        <div className="bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              className="pl-10 border-none shadow-none focus-visible:ring-0 h-12 text-base" 
              placeholder="Search by title, skill, or ask AI (e.g., 'React jobs')" 
            />
          </div>
          <Separator orientation="vertical" className="hidden md:block h-8 self-center bg-slate-200" />
          <Separator orientation="horizontal" className="md:hidden w-full bg-slate-200" />
          <div className="flex-1 relative group">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              className="pl-10 border-none shadow-none focus-visible:ring-0 h-12 text-base" 
              placeholder="City, state, or 'Remote'" 
            />
          </div>
          <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">
            Find Jobs
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            { label: "Remote", icon: Globe },
            { label: "Full-time", icon: Clock },
            { label: "Engineering", icon: Briefcase },
            { label: "Design", icon: Sparkles },
            { label: "> $2000", icon: DollarSign },
          ].map((tag, idx) => (
            <Button key={idx} variant="outline" className="rounded-full border-slate-200 bg-slate-50/50 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 h-9 text-xs">
              <tag.icon className="w-3.5 h-3.5 mr-1.5" /> {tag.label}
            </Button>
          ))}
        </div>
      </section>

      {/* --- 3. MAIN CONTENT (Sidebar + Job List) --- */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-12 gap-8">
          
          {/* === LEFT SIDEBAR (Filters) === */}
          <aside className="hidden lg:block col-span-3 space-y-8">
            
            {/* AI Insight Box */}
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold text-sm">
                <div className="p-1 bg-blue-600 rounded text-white"><Bot className="w-3 h-3"/></div>
                AI Search Insight
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Based on your profile, we prioritized jobs requiring <span className="font-semibold text-slate-900">Python</span> and <span className="font-semibold text-slate-900">UI Design</span> skills.
              </p>
            </div>

            {/* Filter Group: Job Type */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Job Type</h3>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-3">
                {[
                  { id: "full", label: "Full-time", count: 102, checked: true },
                  { id: "contract", label: "Contract", count: 45, checked: false },
                  { id: "part", label: "Part-time", count: 12, checked: false },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox id={item.id} checked={item.checked} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                    <Label htmlFor={item.id} className="text-sm text-slate-600 font-medium flex-1 cursor-pointer">{item.label}</Label>
                    <span className="text-xs text-slate-400">({item.count})</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Filter Group: Salary (Visual Mock) */}
            <div className="space-y-4">
               <h3 className="font-bold text-slate-900">Salary Range</h3>
               <div className="px-1 pt-2 pb-6">
                 {/* Mock Slider Visual */}
                 <div className="relative h-1.5 bg-slate-200 rounded-full">
                    <div className="absolute left-[20%] right-[30%] top-0 bottom-0 bg-blue-600 rounded-full"></div>
                    <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow cursor-pointer hover:scale-110 transition-transform"></div>
                    <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow cursor-pointer hover:scale-110 transition-transform"></div>
                 </div>
                 <div className="flex justify-between mt-3 text-xs font-medium text-slate-500">
                    <span>$1k</span>
                    <span className="text-slate-900">$2.5k - $5k</span>
                    <span>$10k+</span>
                 </div>
               </div>
            </div>

            <Separator />

            {/* Filter Group: Experience */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">Experience Level</h3>
              <div className="space-y-3">
                {[
                  { id: "entry", label: "Entry Level", count: 24, checked: false },
                  { id: "mid", label: "Mid Level", count: 56, checked: true },
                  { id: "senior", label: "Senior Level", count: 39, checked: false },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox id={item.id} checked={item.checked} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                    <Label htmlFor={item.id} className="text-sm text-slate-600 font-medium flex-1 cursor-pointer">{item.label}</Label>
                    <span className="text-xs text-slate-400">({item.count})</span>
                  </div>
                ))}
              </div>
            </div>

          </aside>

          {/* === RIGHT CONTENT (Job List) === */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">124 Jobs Found</h2>
                <p className="text-xs text-slate-500">Sorted by <span className="text-blue-600 font-medium">AI Relevance</span></p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-600">
                  Most Relevant (AI) <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                   <Button variant="ghost" size="icon" className="h-7 w-7 bg-white shadow-sm text-blue-600 rounded-md">
                      <Grid className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600">
                      <List className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {JOBS.map((job) => (
                <Card key={job.id} className="group hover:border-blue-200 hover:shadow-md transition-all duration-200 border-slate-200">
                  <CardContent className="p-5">
                    
                    {/* Header: Logo, Title, Match Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${job.logoColor}`}>
                          {job.logo}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-slate-500 font-medium">{job.company}</p>
                        </div>
                      </div>
                      
                      {/* Match Badge */}
                      <Badge 
                        variant="outline" 
                        className={`border-0 gap-1.5 py-1 px-2 ${
                          job.match > 90 
                            ? "bg-green-50 text-green-700 ring-1 ring-green-100" 
                            : "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                        }`}
                      >
                        {job.match > 90 && <Sparkles className="w-3 h-3 fill-current" />}
                        {job.match}% Match
                      </Badge>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-slate-50 text-slate-600 hover:bg-slate-100 font-normal border border-slate-100">
                        <MapPin className="w-3 h-3 mr-1" /> {job.location}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-50 text-slate-600 hover:bg-slate-100 font-normal border border-slate-100">
                        <Briefcase className="w-3 h-3 mr-1" /> {job.type}
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium border border-blue-100">
                        {job.salary}
                      </Badge>
                    </div>

                    <Separator className="my-4 bg-slate-100" />

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Posted {job.posted}</span>
                      
                      <div className="flex gap-2">
                         <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                            <Bookmark className="w-4 h-4" />
                         </Button>
                         <Button size="sm" className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 shadow-none font-semibold transition-all">
                            View Details
                         </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-6">
              <Button variant="outline" className="h-10 px-6 border-slate-200 text-slate-600 font-medium hover:bg-slate-50">
                Load More Jobs <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>

          </div>
        </div>
      </main>
      
      {/* Footer minimal */}
      <footer className="border-t py-8 text-center text-xs text-slate-400">
        <p>&copy; 2024 SmartJobs AI. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
           <Link href="#" className="hover:text-slate-600">Privacy Policy</Link>
           <Link href="#" className="hover:text-slate-600">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}