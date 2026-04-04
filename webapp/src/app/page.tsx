"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/useThemeStore";
import { Briefcase, Terminal, Sparkles } from "lucide-react";
import { useState } from "react";
import { playHoverSound, playSelectSound } from "@/utils/sounds";

const characters = [
  {
    id: "hr",
    title: "Le Recruteur",
    role: "Chercheur de talents",
    icon: Briefcase,
    color: "from-blue-500 to-indigo-800",
    shadow: "hover:shadow-blue-500/50",
    stats: "ROI: +97%  |  Orga: S",
    desc: "Vous cherchez la clarté, l'impact direct et des preuves concrètes. Entrez pour voir les résultats.",
  },
  {
    id: "lead_dev",
    title: "L'Ingénieur",
    role: "Architecte Backend",
    icon: Terminal,
    color: "from-emerald-500 to-teal-900",
    shadow: "hover:shadow-emerald-500/50",
    stats: "Sys: 100  |  Rust: A",
    desc: "Vous parlez code et infrastructure. Des architectures distribuées, du live-demo et de la technique pure.",
  },
  {
    id: "curieux",
    title: "L'Aventurier",
    role: "Visiteur Curieux",
    icon: Sparkles,
    color: "from-orange-400 to-fuchsia-700",
    shadow: "hover:shadow-orange-500/50",
    stats: "Fun: MAX  |  XP: +10",
    desc: "Pas de prise de tête algorithmique, juste des expériences créatives ludiques et un mini-jeu.",
  }
];

function Card3D({ char, isHovered, isNotHovered, setHoveredId, handleSelect }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHoveredId(null);
  };

  const onMouseEnter = () => {
    playHoverSound();
    setHoveredId(char.id);
  };

  const onClick = () => {
    playSelectSound();
    handleSelect(char.id);
  };

  const Icon = char.icon;

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isNotHovered ? 0.4 : 1, 
        scale: isHovered ? 1.05 : 1,
        y: 0 
      }}
      transition={{ duration: 0.4 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={`relative w-full aspect-[2/3] max-w-sm mx-auto rounded-[24px] p-[2px] cursor-pointer bg-gradient-to-b from-slate-600 to-slate-900 shadow-2xl transition-all duration-300 ${char.shadow}`}
    >
      <div 
        style={{ transformStyle: "preserve-3d" }} 
        className="absolute inset-[2px] bg-slate-900 rounded-[22px] overflow-hidden"
      >
        <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${char.color}`} />
        {isHovered && <motion.div layoutId="flare" className={`absolute -inset-20 bg-gradient-to-br ${char.color} opacity-40 blur-3xl`} style={{ translateZ: -20 }} />}
      </div>

      <div style={{ transform: "translateZ(60px)" }} className="relative h-full flex flex-col pointer-events-none p-8">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${char.color} shadow-lg ring-1 ring-white/20`}>
            <Icon className="text-white drop-shadow-md" size={36} />
          </div>
          <div className="text-xs font-black px-3 py-1.5 bg-black/60 rounded-full border border-white/20 text-white/90 shadow-inner">
            CLASS
          </div>
        </div>

        <div className="mt-8 space-y-1">
          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {char.title}
          </h2>
          <p className="text-sm text-yellow-400 font-bold tracking-widest uppercase opacity-90">{char.role}</p>
        </div>

        <div className="mt-auto space-y-5">
          <div className="text-sm font-mono font-bold bg-black/50 px-4 py-2.5 rounded-xl text-white/95 border border-white/10 shadow-inner text-center backdrop-blur-sm">
            {char.stats}
          </div>
          <div className="text-sm text-slate-300 leading-relaxed font-medium bg-slate-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-md">
            {char.desc}
          </div>
        </div>
      </div>
      
      {/* Glare effect */}
      <motion.div 
        style={{
          opacity: useTransform(y, [-0.5, 0.5], [0, 0.4]),
          background: "linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)",
        }}
        className="absolute inset-[2px] rounded-[22px] pointer-events-none mix-blend-overlay"
      />
    </motion.div>
  );
}

export default function CharacterSelection() {
  const router = useRouter();
  const setMode = useThemeStore((state) => state.setMode);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleSelect = (id: any) => {
    setIsExiting(true);
    setMode(id);
    setTimeout(() => {
      router.push("/portfolio");
    }, 800);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 pointer-events-none">
            <div className={`w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full blur-[150px] transition-colors duration-1000 ${hoveredId === 'hr' ? 'bg-blue-600' : hoveredId === 'lead_dev' ? 'bg-emerald-600' : hoveredId === 'curieux' ? 'bg-orange-600' : 'bg-slate-800'}`} />
          </div>

          <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="z-10 text-center mb-16 space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-2xl">
              Choisissez votre Classe
            </h1>
            <p className="text-xl text-slate-400 font-medium">
              Chaque classe dévoile une expérience unique dans le portfolio.
            </p>
          </motion.div>

          <div style={{ perspective: "1500px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-6xl z-10">
            {characters.map((char, index) => {
              const isHovered = hoveredId === char.id;
              const isNotHovered = hoveredId !== null && hoveredId !== char.id;

              return (
                <Card3D 
                  key={char.id} 
                  char={char} 
                  isHovered={isHovered} 
                  isNotHovered={isNotHovered} 
                  setHoveredId={setHoveredId} 
                  handleSelect={handleSelect} 
                />
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
