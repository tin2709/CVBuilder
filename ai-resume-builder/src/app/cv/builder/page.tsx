"use client";

import { 
  ArrowLeft, Download, Eye, Save, Sparkles, User, 
  Briefcase, GraduationCap, Wrench, ChevronLeft, Plus, 
  LayoutGrid, History, Settings
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreativeTemplate } from "@/components/templates/CreativeTemplate"; // Import template vừa tạo

export default function CVBuilderPage() {
  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans">
      
      {/* 1. TOP NAVIGATION */}
      <header className="h-14 bg-white border-b px-4 flex justify-between items-center z-20 shrink-0">
        <div className="flex items-center gap-4">
             <Link href="/cv/templates" className="text-slate-500 hover:text-slate-800">
                <ArrowLeft className="w-5 h-5" />
             </Link>
             <div className="flex flex-col">
                <span className="text-xs text-slate-400">Dashboard / My CVs / Software Engineer CV</span>
                <h1 className="font-bold text-sm text-slate-800">Software Engineer CV</h1>
             </div>
             <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-2">Version 2.4</span>
        </div>

        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-2 text-slate-600">
                <History className="w-4 h-4"/> Versions
            </Button>
            <Button size="sm" className="h-8 gap-2 bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4"/> Save Draft
            </Button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* === LEFT SIDEBAR: EDITOR TOOLS === */}
        <aside className="w-[350px] bg-white border-r flex flex-col shadow-sm z-10">
            <div className="p-4 border-b">
                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 bg-slate-100">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* AI Suggestion Banner */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 relative overflow-hidden">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-indigo-900">AI Suggestion Available</h4>
                            <p className="text-[10px] text-indigo-700 mt-1 leading-tight">
                                Your profile summary could be more impactful. Would you like the AI to rewrite it?
                            </p>
                            <button className="text-[10px] font-bold text-indigo-600 mt-2 hover:underline">Apply Suggestions</button>
                        </div>
                    </div>
                </div>

                {/* Form Sections (Accordion) */}
                <Accordion type="single" collapsible defaultValue="personal" className="w-full">
                    
                    <AccordionItem value="personal" className="border rounded-lg mb-2 px-1">
                        <AccordionTrigger className="hover:no-underline px-2 py-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <User className="w-4 h-4 text-blue-500" /> Personal Details
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-2 pb-4 space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                                <Avatar className="w-16 h-16 border-2 border-slate-100">
                                    <AvatarImage src="https://avatar.iran.liara.run/public/boy" />
                                    <AvatarFallback>SJ</AvatarFallback>
                                </Avatar>
                                <Button variant="outline" size="sm" className="text-xs h-8">Upload Photo</Button>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Full Name</Label>
                                <Input defaultValue="Sarah Jenkins" className="h-9" />
                            </div>
                             <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Professional Title</Label>
                                <Input defaultValue="Senior Software Engineer" className="h-9" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-500">Email</Label>
                                    <Input defaultValue="sarah.j@example.com" className="h-9" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-500">Phone</Label>
                                    <Input defaultValue="+1 (555) 000-1234" className="h-9" />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="experience" className="border rounded-lg mb-2 px-1">
                        <AccordionTrigger className="hover:no-underline px-2 py-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Briefcase className="w-4 h-4 text-slate-400" /> Work Experience
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-2">
                             <div className="text-xs text-slate-400">Content here...</div>
                        </AccordionContent>
                    </AccordionItem>

                     <AccordionItem value="education" className="border rounded-lg mb-2 px-1">
                        <AccordionTrigger className="hover:no-underline px-2 py-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <GraduationCap className="w-4 h-4 text-slate-400" /> Education
                            </div>
                        </AccordionTrigger>
                         <AccordionContent className="px-2">
                             <div className="text-xs text-slate-400">Content here...</div>
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="skills" className="border rounded-lg mb-2 px-1">
                        <AccordionTrigger className="hover:no-underline px-2 py-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Wrench className="w-4 h-4 text-slate-400" /> Skills
                            </div>
                        </AccordionTrigger>
                         <AccordionContent className="px-2">
                             <div className="text-xs text-slate-400">Content here...</div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>
        </aside>

        {/* === RIGHT MAIN: PREVIEW CANVAS === */}
        <main className="flex-1 bg-slate-100 flex flex-col relative overflow-hidden">
            
            {/* Toolbar */}
            <div className="h-12 flex justify-between items-center px-6 border-b bg-white/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2 bg-white rounded-md border p-1 shadow-sm">
                    <Button variant="ghost" size="icon" className="h-6 w-6"><LayoutGrid className="w-3 h-3"/></Button>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><span className="text-xs">-</span></Button>
                    <span className="text-xs font-mono w-8 text-center">100%</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><span className="text-xs">+</span></Button>
                </div>
                
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-600">
                        <Eye className="w-3 h-3 mr-1"/> Preview
                    </Button>
                    <Button size="sm" className="h-8 text-xs bg-slate-900 text-white hover:bg-slate-800">
                        <Download className="w-3 h-3 mr-1"/> Download PDF
                    </Button>
                </div>
            </div>

            {/* CANVAS AREA */}
            <div className="flex-1 overflow-auto flex justify-center p-8 custom-scrollbar">
                {/* A4 Scale Container */}
                <div className="relative shadow-2xl transition-transform duration-200 origin-top" style={{ width: '210mm', minHeight: '297mm' }}>
                    {/* HERE IS THE MAGIC: We render the component that looks like the image */}
                    <CreativeTemplate />
                </div>
            </div>

        </main>
      </div>
    </div>
  );
}