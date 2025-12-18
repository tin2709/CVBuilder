"use client";

import { 
  Search, MapPin, Users, Plus, Star, CheckCircle, 
  ThumbsUp, Share2, MoreHorizontal, Filter, Building2,
  ExternalLink,Link,Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function CompanyReviewPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* HEADER */}
      <header className="border-b sticky top-0 z-50 bg-white px-6 h-16 flex items-center justify-between">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
               <div className="bg-blue-600 p-1 rounded text-white transform rotate-45">
                  <div className="transform -rotate-45"><Building2 className="w-4 h-4"/></div>
               </div>
               RecruitAI
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
               <a href="#" className="hover:text-blue-600">Jobs</a>
               <a href="#" className="text-blue-600">Companies</a>
               <a href="#" className="hover:text-blue-600">Salaries</a>
               <a href="#" className="hover:text-blue-600">Community</a>
            </nav>
         </div>
         <div className="flex items-center gap-4">
            <div className="relative w-64 hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <Input className="pl-9 h-9 bg-slate-50" placeholder="Search companies..." />
            </div>
            <Button variant="ghost" className="text-sm font-medium">Employers</Button>
            <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">Login</Button>
         </div>
      </header>

      {/* HERO SECTION */}
      <div className="relative">
         {/* Cover Image */}
         <div className="h-48 md:h-64 bg-gradient-to-r from-blue-400 to-indigo-500 w-full relative overflow-hidden">
            <img 
               src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80" 
               className="w-full h-full object-cover opacity-30 mix-blend-overlay"
               alt="Cover"
            />
         </div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
            <div className="flex flex-col md:flex-row items-end md:items-center -mt-12 md:-mt-16 gap-6 mb-8">
               {/* Logo */}
               <div className="w-32 h-32 rounded-xl border-4 border-white bg-teal-700 shadow-md flex items-center justify-center p-2 z-10">
                  <div className="text-white text-center">
                     <div className="font-bold text-2xl">Tech</div>
                     <div className="text-[10px] uppercase tracking-wider">Solutions</div>
                  </div>
               </div>
               
               {/* Info */}
               <div className="flex-1 pb-2">
                  <h1 className="text-3xl font-bold text-slate-900">TechSolutions Vietnam</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-2">
                     <span className="flex items-center"><Building2 className="w-4 h-4 mr-1"/> Information Technology</span>
                     <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> Ho Chi Minh City</span>
                     <span className="flex items-center"><Users className="w-4 h-4 mr-1"/> 500+ Employees</span>
                  </div>
               </div>

               {/* Actions */}
               <div className="flex gap-3 pb-2 w-full md:w-auto mt-4 md:mt-0">
                  <Button variant="outline" className="border-slate-300 text-slate-700 font-semibold px-6">Follow</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow-lg shadow-blue-200">
                     <Plus className="w-4 h-4 mr-2"/> Write a Review
                  </Button>
               </div>
            </div>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* === LEFT SIDEBAR (Stats & About) === */}
            <div className="col-span-1 md:col-span-4 space-y-6">
               
               {/* Rating Overview */}
               <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                     <h3 className="font-bold text-slate-800 mb-4">Rating Overview</h3>
                     <div className="flex items-end gap-3 mb-6">
                        <span className="text-5xl font-bold text-blue-600">4.2</span>
                        <div className="mb-1">
                           <div className="flex text-yellow-400 gap-0.5 text-sm mb-1">
                              <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 text-slate-200 fill-slate-200"/>
                           </div>
                           <p className="text-xs text-slate-500">Based on 128 reviews</p>
                        </div>
                     </div>

                     <div className="space-y-2">
                        {[5,4,3,2,1].map((star, i) => (
                           <div key={star} className="flex items-center gap-3 text-sm">
                              <span className="w-3 text-slate-600 font-medium">{star}</span>
                              <Progress value={[60, 25, 10, 3, 2][i]} className="h-2 bg-slate-100 [&>div]:bg-blue-600" />
                              <span className="w-8 text-right text-slate-400 text-xs">{[40, 40, 10, 5, 5][i]}%</span>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>

               {/* Quick Stats */}
               <div className="grid grid-cols-2 gap-4">
                  <Card className="border-slate-200 shadow-sm">
                     <CardContent className="p-4 text-center">
                        <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                           <ThumbsUp className="w-5 h-5"/>
                        </div>
                        <div className="font-bold text-xl text-slate-900">90%</div>
                        <div className="text-xs text-slate-500">Recommend to a friend</div>
                     </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                     <CardContent className="p-4 text-center">
                        <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                           <CheckCircle className="w-5 h-5"/>
                        </div>
                        <div className="font-bold text-xl text-slate-900">85%</div>
                        <div className="text-xs text-slate-500">Approve of CEO</div>
                     </CardContent>
                  </Card>
               </div>

               {/* About */}
               <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                     <h3 className="font-bold text-slate-800 mb-3">About TechSolutions</h3>
                     <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        TechSolutions Vietnam is a leading provider of software development services. We specialize in AI, Cloud Computing, and Enterprise Solutions. Our mission is to transform businesses through technology.
                     </p>
                     <div className="flex flex-wrap gap-2 mb-4">
                        {['Java', 'React', 'AWS', 'Python'].map(tag => (
                           <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">{tag}</Badge>
                        ))}
                     </div>
                     <Link href="#" className="text-sm text-blue-600 font-semibold flex items-center hover:underline">
                        View Website <ExternalLink className="w-3 h-3 ml-1"/>
                     </Link>
                  </CardContent>
               </Card>

            </div>

            {/* === RIGHT CONTENT (Reviews) === */}
            <div className="col-span-1 md:col-span-8 space-y-6">
               
               {/* AI Summary Box */}
               <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
                     <div className="p-1 bg-white rounded text-blue-600 shadow-sm"><Sparkles className="w-4 h-4"/></div>
                     AI Review Summary
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                     Analysis of <span className="font-semibold text-blue-700">128 reviews</span> indicates a highly positive sentiment regarding <span className="font-semibold">work-life balance</span> and <span className="font-semibold">comprehensive benefits</span>. However, approximately 15% of recent reviews mention <span className="font-semibold text-red-600/80">communication challenges</span> with middle management during project pivots.
                  </p>
               </div>

               {/* Review Header */}
               <div className="flex items-center justify-between pt-2">
                  <h2 className="font-bold text-lg text-slate-900">128 Employee Reviews</h2>
                  <Button variant="outline" size="sm" className="border-slate-200 text-slate-600">
                     Most Recent <Filter className="w-3 h-3 ml-2"/>
                  </Button>
               </div>

               {/* Review Item 1 */}
               <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">AN</div>
                           <div>
                              <div className="font-bold text-sm text-slate-900">Senior Backend Engineer</div>
                              <div className="text-xs text-slate-500">Current Employee • 3+ years • Hanoi</div>
                           </div>
                        </div>
                        <span className="text-xs text-slate-400">Oct 24, 2023</span>
                     </div>

                     <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-blue-600 gap-0.5"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                        <span className="font-bold text-slate-900">"Great place for career growth"</span>
                     </div>

                     <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                           <div className="font-bold text-green-800 text-xs flex items-center mb-1"><Plus className="w-3 h-3 mr-1"/> Pros</div>
                           <p className="text-xs text-slate-700 leading-relaxed">The mentorship program is excellent. Senior engineers are always willing to help. The tech stack is modern and we get to experiment with new tools often. Free lunch is a huge plus!</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                           <div className="font-bold text-red-800 text-xs flex items-center mb-1"><div className="w-3 h-0.5 bg-red-800 mr-1 rounded-full"></div> Cons</div>
                           <p className="text-xs text-slate-700 leading-relaxed">Sometimes the project deadlines can be a bit aggressive. The office space is getting a bit crowded as the team grows rapidly.</p>
                        </div>
                     </div>

                     <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                           <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-500 hover:text-blue-600 text-xs">
                              <ThumbsUp className="w-3.5 h-3.5 mr-1.5"/> Helpful (12)
                           </Button>
                           <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-500 hover:text-blue-600 text-xs">
                              <Share2 className="w-3.5 h-3.5 mr-1.5"/> Share
                           </Button>
                        </div>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-[10px] uppercase tracking-wide">Verified</Badge>
                     </div>
                  </CardContent>
               </Card>

               {/* Review Item 2 */}
               <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <Avatar className="w-10 h-10 border border-slate-200">
                              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" />
                              <AvatarFallback>PM</AvatarFallback>
                           </Avatar>
                           <div>
                              <div className="font-bold text-sm text-slate-900">Product Manager</div>
                              <div className="text-xs text-slate-500">Former Employee • 1 year • Ho Chi Minh City</div>
                           </div>
                        </div>
                        <span className="text-xs text-slate-400">Sep 15, 2023</span>
                     </div>

                     <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-blue-600 gap-0.5"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 text-slate-200 fill-slate-200"/></div>
                        <span className="font-bold text-slate-900">"Good benefits, unclear direction"</span>
                     </div>

                     <p className="text-sm text-slate-600 mb-4">
                        The compensation package is above market rate, including premium insurance for family. However, the product roadmap changes too frequently which causes frustration among the dev team.
                     </p>

                     <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                           <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-500 hover:text-blue-600 text-xs">
                              <ThumbsUp className="w-3.5 h-3.5 mr-1.5"/> Helpful (5)
                           </Button>
                           <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-500 hover:text-blue-600 text-xs">
                              <Share2 className="w-3.5 h-3.5 mr-1.5"/> Share
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <div className="text-center pt-4">
                  <Button variant="ghost" className="text-slate-900 font-semibold hover:bg-slate-100 w-full">Show More Reviews</Button>
               </div>

            </div>
         </div>
      </main>
    </div>
  );
}