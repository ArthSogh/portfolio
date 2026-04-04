"use client";
import { useThemeStore } from "@/store/useThemeStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Undo2 } from "lucide-react";
import dynamic from 'next/dynamic';
import Chatbot from "@/components/Chatbot";

const HrLayout = dynamic(() => import('@/components/layouts/HrLayout'), { ssr: false });
const LeadDevLayout = dynamic(() => import('@/components/layouts/LeadDevLayout'), { ssr: false });
const CuriousLayout = dynamic(() => import('@/components/layouts/CuriousLayout'), { ssr: false });

export default function PortfolioPage() {
  const mode = useThemeStore((state) => state.mode);
  const router = useRouter();

  if (!mode) return null;

  const isLeadDev = mode === "lead_dev";
  const isCurious = mode === "curieux";

  const getContainerClass = () => {
    if (isLeadDev) return "bg-[#06100a] text-emerald-400 font-mono";
    if (isCurious) return "bg-[#FEFAEC] text-slate-800 font-sans"; 
    return "bg-slate-50 text-slate-900 font-sans tracking-tight";
  };


  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen relative overflow-x-hidden ${getContainerClass()}`}
    >
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center max-w-6xl mx-auto right-0 z-50 pointer-events-none">
        <button 
          onClick={() => router.push("/")}
          className={`pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all backdrop-blur-md shadow-lg border
            ${isLeadDev ? 'bg-black/80 text-emerald-400 border-emerald-900 hover:bg-emerald-900/50 hover:shadow-emerald-500/20' : 
              isCurious ? 'bg-orange-500 text-white hover:bg-orange-600 border-transparent shadow-orange-500/30' :
              'bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-blue-600/30'}`}
        >
          <Undo2 size={18} />
          {isLeadDev ? "cd .." : "Changer de classe"}
        </button>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {mode === 'hr' && <HrLayout />}
          {mode === 'lead_dev' && <LeadDevLayout />}
          {mode === 'curieux' && <CuriousLayout />}
        </motion.div>
      </AnimatePresence>

      <Chatbot mode={mode} />
    </motion.main>
  );
}
