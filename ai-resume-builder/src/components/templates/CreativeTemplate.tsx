import { ResumeData } from "@/types/resume";

export const CreativeTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="font-sans">
      {/* Bold Header Background */}
      <div className="bg-rose-500 text-white -mx-[20mm] -mt-[20mm] p-[20mm] mb-8 shadow-md">
        <h1 className="text-5xl font-extrabold mb-2 tracking-tighter">
          {data.personalInfo.fullName || "YOUR NAME"}
        </h1>
        <p className="text-rose-100 text-lg font-light tracking-wide">
          Creative Developer / Designer
        </p>
        
        <div className="flex gap-6 mt-6 text-sm font-medium">
            <span className="bg-white/20 px-3 py-1 rounded-full">{data.personalInfo.email}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">{data.personalInfo.phone}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-8">
         {/* Left Column */}
         <div className="col-span-8 space-y-8">
            <section>
                <h3 className="text-2xl font-black text-rose-500 mb-4">About Me</h3>
                <p className="text-slate-700 leading-7">
                    {data.personalInfo.summary}
                </p>
            </section>
             <section>
                <h3 className="text-2xl font-black text-rose-500 mb-4">Experience</h3>
                <p className="text-slate-400">Loading...</p>
            </section>
         </div>

         {/* Right Sidebar (Skills placeholder) */}
         <div className="col-span-4 space-y-8 border-l border-rose-100 pl-6">
             <section>
                <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    <span className="bg-rose-100 text-rose-600 px-2 py-1 text-xs font-bold rounded">React</span>
                    <span className="bg-rose-100 text-rose-600 px-2 py-1 text-xs font-bold rounded">Next.js</span>
                    <span className="bg-rose-100 text-rose-600 px-2 py-1 text-xs font-bold rounded">Design</span>
                </div>
             </section>
         </div>
      </div>
    </div>
  );
};