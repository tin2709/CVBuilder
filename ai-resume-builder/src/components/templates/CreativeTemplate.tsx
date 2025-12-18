import { Mail, Phone, MapPin, Linkedin } from "lucide-react";

// Props có thể nhận dữ liệu dynamic từ Editor, ở đây tôi hardcode để giống hình
export const CreativeTemplate = ({ data }: { data?: any }) => {
  return (
    <div className="w-full h-full bg-white shadow-lg text-slate-800 flex flex-row" style={{ aspectRatio: '210/297' }}>
      
      {/* CỘT TRÁI (30%) */}
      <div className="w-[32%] bg-[#F8FAFC] p-6 flex flex-col gap-8 border-r border-slate-100">
        
        {/* Avatar */}
        <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-yellow-100 border-4 border-white shadow-sm overflow-hidden relative">
                 <img src="https://avatar.iran.liara.run/public/boy" alt="Avatar" className="object-cover w-full h-full" />
            </div>
        </div>

        {/* Contact */}
        <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b pb-2">Contact</h3>
            <div className="space-y-3 text-[10px] md:text-xs">
                <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span>sarah.j@box.com</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>+1 555 000 1234</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>San Francisco, CA</span>
                </div>
            </div>
        </div>

        {/* Skills */}
        <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b pb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'TypeScript', 'Tailwind', 'Next.js', 'Figma'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
      </div>

      {/* CỘT PHẢI (70%) */}
      <div className="flex-1 p-8">
            {/* Header Info */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-1">Sarah Jenkins</h1>
                <p className="text-blue-600 font-medium text-sm uppercase tracking-wide">Senior Software Engineer</p>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                    Experienced software engineer with a focus on building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.
                </p>
            </div>

            {/* Experience */}
            <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Experience</h3>
                
                <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-sm text-slate-800">Tech Solutions Inc.</h4>
                        <span className="text-[10px] text-slate-400">2021 - Present</span>
                    </div>
                    <p className="text-xs text-slate-500 italic mb-2">Senior Frontend Developer</p>
                    <ul className="list-disc ml-4 space-y-1 text-[11px] text-slate-600">
                        <li>Led the migration of legacy codebase to React 18.</li>
                        <li>Improved site performance by 40% through code splitting.</li>
                        <li>Mentored a team of 4 junior developers.</li>
                    </ul>
                </div>

                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-sm text-slate-800">Creative Web Agency</h4>
                        <span className="text-[10px] text-slate-400">2018 - 2021</span>
                    </div>
                    <p className="text-xs text-slate-500 italic mb-2">Web Developer</p>
                    <ul className="list-disc ml-4 space-y-1 text-[11px] text-slate-600">
                        <li>Developed responsive websites for over 20 clients.</li>
                        <li>Implemented CI/CD pipelines to streamline deployment.</li>
                    </ul>
                </div>
            </div>

            {/* Education */}
            <div>
                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Education</h3>
                 <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-sm text-slate-800">University of Technology</h4>
                        <span className="text-[10px] text-slate-400">2014 - 2018</span>
                    </div>
                    <p className="text-xs text-slate-600">Bachelor of Science in Computer Science</p>
                </div>
            </div>
      </div>
    </div>
  );
};