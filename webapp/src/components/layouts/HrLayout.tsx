"use client";

import { motion, Variants } from "framer-motion";
import { ArrowDown, Briefcase, Cpu, GraduationCap, MapPin, Code, Wrench, Globe, TerminalSquare, Database, Sparkles, Brain, Server } from "lucide-react";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { ease: "easeOut", duration: 0.4 }
  }
};

const BentoBox = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <motion.div 
    id={id}
    variants={itemVariants}
    className={`relative overflow-hidden rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 hover:shadow-md transition-all duration-300 ${className}`}
  >
    <div className="relative z-10 h-full flex flex-col">
      {children}
    </div>
  </motion.div>
);

function HeroCard({ className }: { className?: string }) {
  return (
    <BentoBox className={`flex flex-col justify-center bg-slate-50 dark:bg-[#0b1120] ${className}`}>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800/50 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Open to work
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold bg-white dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs uppercase tracking-widest">
          <MapPin size={12} /> Paris
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
        Arthur Soghoyan
      </h1>
      <h2 className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
        Software Engineer – Embedded & Intelligent Systems
      </h2>
      <p className="text-base text-slate-500 dark:text-slate-400 font-medium mb-8 max-w-xl leading-relaxed">
        Bridging hardware, software, and intelligent automation. Focused on building clean architectures and delivering high-ROI engineering solutions.
      </p>
      <div className="flex flex-wrap gap-4 mt-auto">
        <a href="#projects" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-sm shadow-sm hover:opacity-90 transition-opacity text-center flex-1 sm:flex-none">
          Explore Projects
        </a>
        <a href="#skills" onClick={(e) => { e.preventDefault(); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-center flex-1 sm:flex-none">
          View Skills
        </a>
      </div>
    </BentoBox>
  );
}

function ExperienceCard({ className }: { className?: string }) {
  return (
    <BentoBox className={className}>
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
        <Briefcase className="text-indigo-500" size={20} /> Experience
      </h3>
      <div className="space-y-8 pb-2">
        
        {/* Stanley Robotics */}
        <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 pl-6">
          <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-[#0f172a]" />
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">Stanley Robotics</h4>
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3">Backend Engineer (Algorithms & Optimization)</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
             {['Kotlin', 'Python', 'BigQuery', 'Docker', 'Kubernetes', 'CI/CD'].map((tch, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-bold uppercase tracking-wider">{tch}</span>
             ))}
          </div>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 font-medium list-none">
            <li className="flex items-start gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:shrink-0 before:bg-slate-300 dark:before:bg-slate-600 before:rounded-full before:mt-1.5">Designed optimization algorithms for large-scale robotic parking systems</li>
            <li className="flex items-start gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:shrink-0 before:bg-slate-300 dark:before:bg-slate-600 before:rounded-full before:mt-1.5">Processed massive datasets using GCP (BigQuery)</li>
            <li className="flex items-start gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:shrink-0 before:bg-slate-300 dark:before:bg-slate-600 before:rounded-full before:mt-1.5">Improved parking optimization efficiency by 20–30% (production deployed)</li>
            <li className="flex items-start gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:shrink-0 before:bg-slate-300 dark:before:bg-slate-600 before:rounded-full before:mt-1.5">Developed scoring algorithms for intelligent robot decision-making</li>
            <li className="flex items-start gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:shrink-0 before:bg-slate-300 dark:before:bg-slate-600 before:rounded-full before:mt-1.5">Contributed to full product lifecycle: Architecture, Backend (Kotlin), Unit testing (Pytest), CI/CD (GitLab CI), Containerization, Simulation testing (Digital Twin)</li>
          </ul>
        </div>

        {/* ISFER */}
        <div className="relative border-l-2 border-transparent ml-3 pl-6">
          <div className="absolute w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-[#0f172a]" />
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">ISFER</h4>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3">Software Engineer (R&D, Fullstack / Backend)</p>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 font-medium list-none">
            <li className="flex items-start gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:shrink-0 before:bg-slate-300 dark:before:bg-slate-600 before:rounded-full before:mt-1.5">Led software development for an industrial site in Montpellier</li>
            <li className="flex items-start gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:shrink-0 before:bg-slate-300 dark:before:bg-slate-600 before:rounded-full before:mt-1.5">Daily collaboration with technicians, chemists, and physicists</li>
            <li className="flex items-start gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:shrink-0 before:bg-slate-300 dark:before:bg-slate-600 before:rounded-full before:mt-1.5">Developed backend and frontend systems using Python (Kivy)</li>
            <li className="flex items-start gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:shrink-0 before:bg-slate-300 dark:before:bg-slate-600 before:rounded-full before:mt-1.5">Built real-time interfaces connected to IoT devices</li>
            <li className="flex items-start gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:shrink-0 before:bg-slate-300 dark:before:bg-slate-600 before:rounded-full before:mt-1.5">Integrated hardware components (sensors, microcontrollers via I2C, WiFi, Ethernet)</li>
            <li className="flex items-start gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:shrink-0 before:bg-slate-300 dark:before:bg-slate-600 before:rounded-full before:mt-1.5">Implemented computer vision features (image analysis)</li>
            <li className="flex items-start gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:shrink-0 before:bg-slate-300 dark:before:bg-slate-600 before:rounded-full before:mt-1.5">Set up unit testing, CI/CD pipelines and designed APIs</li>
          </ul>
        </div>
      </div>
    </BentoBox>
  );
}

function ProjectAutoApply({ className }: { className?: string }) {
  return (
    <BentoBox className={className}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="text-blue-500" size={24} /> AutoApply
        </h3>
        <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 text-xs font-bold rounded uppercase tracking-wider">AI Automation Platform</span>
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 leading-relaxed">
        Built a fully automated job application system powered by AI. End-to-end automated pipeline from job discovery to application submission.
      </p>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Key Features</h4>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
            <li className="flex gap-2 items-start"><span className="text-blue-500 mt-0.5 font-bold">›</span> Web scraping of job offers (HTML parsing)</li>
            <li className="flex gap-2 items-start"><span className="text-blue-500 mt-0.5 font-bold">›</span> AI agent for filtering and summarization</li>
            <li className="flex gap-2 items-start"><span className="text-blue-500 mt-0.5 font-bold">›</span> Telegram bot integration for user decision loop ("Apply" / "Reject")</li>
            <li className="flex gap-2 items-start"><span className="text-blue-500 mt-0.5 font-bold">›</span> Automated application via Browser automation (Puppeteer)</li>
            <li className="flex gap-2 items-start"><span className="text-blue-500 mt-0.5 font-bold">›</span> Dynamic AI-based motivation letter generation</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {['JavaScript', 'Puppeteer', 'AWS EC2', 'PostgreSQL', 'Docker', 'Browserless', 'Webhooks & APIs', 'GitHub / GitLab'].map((tch, i) => (
              <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors">
                {tch}
              </span>
            ))}
          </div>
        </div>
      </div>
    </BentoBox>
  )
}

function ProjectRoboticArm({ className }: { className?: string }) {
  return (
    <BentoBox className={className}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
           <Wrench className="text-orange-500" size={24} /> Robotic Arm
        </h3>
        <span className="px-2.5 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 text-xs font-bold rounded uppercase tracking-wider">Hardware Integration</span>
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 leading-relaxed flex-1">
        Built a 6-axis robotic arm with inverse kinematics culminating in an autonomous pick-and-place system.
      </p>
      
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 font-medium mb-8">
        <li className="flex gap-2 items-center"><span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Raspberry Pi + I2C communication</li>
        <li className="flex gap-2 items-center"><span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Python control system</li>
        <li className="flex gap-2 items-center"><span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Camera + OpenCV (color detection)</li>
        <li className="flex gap-2 items-center"><span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Remote SSH control</li>
      </ul>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {['Python', 'C++', 'Raspberry Pi', 'OpenCV', 'Inverse Kinematics'].map((tch, i) => (
          <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors">
            {tch}
          </span>
        ))}
      </div>
    </BentoBox>
  )
}

function EducationCard({ className }: { className?: string }) {
  return (
    <BentoBox className={className}>
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
        <GraduationCap className="text-purple-500" size={20} /> Education
      </h3>
      <div className="space-y-8 mt-4">
        
        <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 pl-6">
          <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-[#0f172a]" />
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">ENS Paris-Saclay</h4>
          <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-3">M2 – Intelligent Systems</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
             <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-bold uppercase tracking-wider">Python</span>
             <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-bold uppercase tracking-wider">MATLAB</span>
          </div>
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 font-medium list-none">
            <li className="flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-slate-400 before:rounded-full">Optimization algorithms</li>
            <li className="flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-slate-400 before:rounded-full">Robotics (inverse kinematics)</li>
            <li className="flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-slate-400 before:rounded-full">Simulation / Digital Twin</li>
          </ul>
        </div>

        <div className="relative border-l-2 border-transparent ml-3 pl-6">
          <div className="absolute w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-[#0f172a]" />
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">ESME</h4>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3">Engineering School – Embedded Systems</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
             <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-bold uppercase tracking-wider">C++</span>
             <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-bold uppercase tracking-wider">Python</span>
             <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-bold uppercase tracking-wider">Linux</span>
          </div>
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 font-medium list-none">
            <li className="flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-slate-400 before:rounded-full">Arduino, Raspberry Pi</li>
            <li className="flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-slate-400 before:rounded-full">Hardware/software integration</li>
            <li className="flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-slate-400 before:rounded-full">Networking (IP, WiFi)</li>
          </ul>
        </div>
      </div>
    </BentoBox>
  )
}

const SKILL_CATEGORIES = [
  { title: "Programming", icon: <Code size={16} />, tags: ["Python", "C++", "JavaScript", "MATLAB"] },
  { title: "Systems", icon: <TerminalSquare size={16} />, tags: ["Linux", "Bash"] },
  { title: "Embedded", icon: <Cpu size={16} />, tags: ["Arduino", "Raspberry Pi", "Sensors"] },
  { title: "Networking", icon: <Globe size={16} />, tags: ["IP", "WiFi"] },
  { title: "AI / Robotics", icon: <Brain size={16} />, tags: ["OpenCV", "Inverse Kinematics", "Simulation"] },
  { title: "Cloud / DevOps", icon: <Server size={16} />, tags: ["AWS EC2", "Docker", "GitHub", "GitLab"] },
  { title: "Backend / Data", icon: <Database size={16} />, tags: ["PostgreSQL", "APIs", "Webhooks"] },
];

function SkillsCard({ className }: { className?: string }) {
  return (
    <BentoBox className={className}>
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
        <Database className="text-emerald-500" size={20} /> Technical Skills
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <div key={idx}>
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm mb-3">
              {cat.icon} {cat.title}
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold text-slate-600 dark:text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </BentoBox>
  )
}

function CVCard({ className }: { className?: string }) {
  return (
    <BentoBox className={`bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 border-transparent cursor-pointer group !p-0 ${className}`}>
      <a href="/CV_Soghoyan.pdf" target="_blank" className="relative h-full flex items-center justify-between p-6 sm:p-8 z-10 w-full overflow-hidden text-left">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white dark:text-slate-900 mb-1">Download CV</h3>
          <p className="text-slate-400 dark:text-slate-600 font-medium text-xs sm:text-sm">Detailed PDF Version</p>
        </div>
        
        <div className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/5 flex flex-shrink-0 items-center justify-center border border-white/20 dark:border-black/10 group-hover:bg-white/20 dark:group-hover:bg-black/10 transition-colors">
          <ArrowDown className="text-white dark:text-slate-900" size={20} />
        </div>
      </a>
    </BentoBox>
  );
}

const SectionTitle = ({ title, icon, id }: { title: string, icon: React.ReactNode, id?: string }) => (
  <div id={id} className="lg:col-span-12 flex items-center gap-4 mt-10 mb-2 px-2 scroll-mt-24">
    <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-300 shadow-sm">
      {icon}
    </div>
    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{title}</h2>
  </div>
);

function ProjectVolingi({ className }: { className?: string }) {
  return (
    <BentoBox className={className}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="text-purple-500" size={24} /> Volingi
        </h3>
        <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50 text-xs font-bold rounded uppercase tracking-wider">SaaS & Microservices</span>
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 leading-relaxed flex-1">
        Fullstack development of a B2B SaaS platform. Managed complete product lifecycle including architecture, microservices, and CI/CD pipelines. Features complex dashboards and data modeling.
      </p>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {['TypeScript', 'Next.js', 'Supabase', 'Stripe', 'Docker'].map((tch, i) => (
          <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors">
            {tch}
          </span>
        ))}
      </div>
    </BentoBox>
  )
}

function ProjectDedicate({ className }: { className?: string }) {
  return (
    <BentoBox className={className}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code className="text-teal-500" size={24} /> Dedicate
        </h3>
        <span className="px-2.5 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/50 text-xs font-bold rounded uppercase tracking-wider">Generative AI Web</span>
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 leading-relaxed flex-1">
        Backend engineering and cloud performance optimization for an AI-powered personalized gift site generator. Focus on high scalability and low latency rendering.
      </p>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {['TypeScript', 'React', 'Generative AI', 'Cloud Opt', 'Vercel'].map((tch, i) => (
          <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors">
            {tch}
          </span>
        ))}
      </div>
    </BentoBox>
  )
}

export default function HrLayout() {
  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 w-full max-w-7xl mx-auto min-h-screen font-sans bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10"
      >
        <HeroCard className="lg:col-span-12" />

        <SectionTitle title="Professional Experience & Education" icon={<Briefcase className="text-indigo-500" size={28} />} />

        <ExperienceCard className="lg:col-span-12 xl:col-span-7" />
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
          <EducationCard className="flex-1" />
          <CVCard />
        </div>

        <SectionTitle id="projects" title="Personal Projects & Engineering" icon={<Code className="text-blue-500" size={28} />} />

        <ProjectAutoApply className="lg:col-span-12 xl:col-span-7" />
        <ProjectRoboticArm className="lg:col-span-12 xl:col-span-5" />
        
        <ProjectVolingi className="lg:col-span-12 xl:col-span-6" />
        <ProjectDedicate className="lg:col-span-12 xl:col-span-6" />

        <SectionTitle id="skills" title="Technical Skills" icon={<Database className="text-emerald-500" size={28} />} />

        <SkillsCard className="lg:col-span-12" />
      </motion.div>
    </div>
  );
}
