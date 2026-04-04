"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
  Globe2, Trophy, Laugh, RotateCcw,
  Sparkles, MousePointerClick, Dice5
} from "lucide-react";

// ==========================================
// EPHEMERAL CAMEOS (Background Easter Eggs)
// ==========================================

const CAMEOS = [
  { id: "dino", emoji: "🦖", label: "No internet vibes", direction: "ltr" as const, speed: 5 },
  { id: "mushroom", emoji: "🍄", label: "Power up!", direction: "btu" as const, speed: 4 },
  { id: "dragon", emoji: "🐉", label: "Dracarys", direction: "rtl" as const, speed: 6 },
  { id: "naruto", emoji: "🏃‍♂️", label: "Naruto run!", direction: "ltr" as const, speed: 3.5 },
  { id: "wizard", emoji: "🧙‍♂️", label: "Expelliarmus!", direction: "rtl" as const, speed: 7 },
  { id: "football", emoji: "⚽", label: "Golazo!", direction: "ltr" as const, speed: 3 },
  { id: "rocket", emoji: "🚀", label: "To the moon", direction: "btu" as const, speed: 4 },
  { id: "ghost", emoji: "👻", label: "Boo!", direction: "rtl" as const, speed: 5 },
  { id: "star", emoji: "⭐", label: "Achievement unlocked", direction: "btu" as const, speed: 3 },
  { id: "sword", emoji: "⚔️", label: "Winter is coming", direction: "ltr" as const, speed: 4.5 },
  { id: "plumber", emoji: "🔧", label: "It's-a me!", direction: "btu" as const, speed: 3.5 },
  { id: "alien", emoji: "👾", label: "Space invader", direction: "rtl" as const, speed: 3 },
  { id: "crown", emoji: "👑", label: "GG", direction: "ltr" as const, speed: 5 },
  { id: "ninja", emoji: "🥷", label: "Kage bunshin!", direction: "rtl" as const, speed: 3 },
  { id: "ufo", emoji: "🛸", label: "I want to believe", direction: "ltr" as const, speed: 6 },
  { id: "trophy", emoji: "🏆", label: "Victory royale", direction: "btu" as const, speed: 4 },
  { id: "fire", emoji: "🔥", label: "This is fine", direction: "ltr" as const, speed: 3 },
  { id: "moon", emoji: "🌙", label: "Dark mode forever", direction: "rtl" as const, speed: 8 },
];

const EphemeralCameo = () => {
  const [activeCameo, setActiveCameo] = useState<typeof CAMEOS[0] | null>(null);
  const [yPos, setYPos] = useState(50);
  const [instanceKey, setInstanceKey] = useState(0);

  useEffect(() => {
    const spawnCameo = () => {
      const cameo = CAMEOS[Math.floor(Math.random() * CAMEOS.length)];
      setYPos(Math.random() * 60 + 15);
      setActiveCameo(cameo);
      setInstanceKey(k => k + 1);
      setTimeout(() => setActiveCameo(null), cameo.speed * 1000 + 500);
    };

    const firstTimeout = setTimeout(spawnCameo, 3000);
    const interval = setInterval(spawnCameo, 7000 + Math.random() * 5000);
    return () => { clearTimeout(firstTimeout); clearInterval(interval); };
  }, []);

  if (!activeCameo) return null;

  const getAnimation = () => {
    switch (activeCameo.direction) {
      case "ltr":
        return {
          initial: { x: "-15vw", y: 0, opacity: 0 },
          animate: { x: "115vw", y: [0, -30, 0, -20, 0], opacity: [0, 0.7, 0.7, 0.7, 0] },
          transition: { duration: activeCameo.speed, ease: "linear" as const },
        };
      case "rtl":
        return {
          initial: { x: "115vw", y: 0, opacity: 0 },
          animate: { x: "-15vw", y: [0, -35, 0, -15, 0], opacity: [0, 0.6, 0.6, 0.6, 0] },
          transition: { duration: activeCameo.speed, ease: "linear" as const },
        };
      case "btu":
        return {
          initial: { y: "110vh", x: 0, opacity: 0 },
          animate: { y: "-15vh", x: [0, 40, -30, 15, 0], opacity: [0, 0.7, 0.7, 0.5, 0] },
          transition: { duration: activeCameo.speed, ease: "easeOut" as const },
        };
    }
  };

  const anim = getAnimation();

  return (
    <motion.div
      key={`${activeCameo.id}-${instanceKey}`}
      {...anim}
      className="fixed z-[5] pointer-events-none select-none flex flex-col items-center gap-2"
      style={{
        top: activeCameo.direction === "btu" ? undefined : `${yPos}%`,
        left: activeCameo.direction === "btu" ? `${Math.random() * 60 + 20}%` : undefined,
        bottom: activeCameo.direction === "btu" ? 0 : undefined,
      }}
    >
      <span className="text-7xl md:text-8xl lg:text-9xl drop-shadow-2xl">{activeCameo.emoji}</span>
      <span className="text-xs md:text-sm font-bold text-white/50 whitespace-nowrap tracking-widest uppercase bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">{activeCameo.label}</span>
    </motion.div>
  );
};

// ==========================================
// FLOATING AMBIENT PARTICLES (always visible)
// ==========================================

const FloatingParticles = () => {
  const particles = [
    { emoji: "✦", x: "8%", y: "12%", dur: 18, delay: 0 },
    { emoji: "◆", x: "92%", y: "8%", dur: 22, delay: 3 },
    { emoji: "✧", x: "15%", y: "35%", dur: 20, delay: 1 },
    { emoji: "⬡", x: "88%", y: "42%", dur: 25, delay: 5 },
    { emoji: "✦", x: "5%", y: "60%", dur: 19, delay: 2 },
    { emoji: "◇", x: "95%", y: "55%", dur: 21, delay: 4 },
    { emoji: "✧", x: "10%", y: "78%", dur: 23, delay: 6 },
    { emoji: "⬡", x: "90%", y: "85%", dur: 17, delay: 1 },
    { emoji: "✦", x: "50%", y: "5%", dur: 24, delay: 3 },
    { emoji: "◆", x: "45%", y: "95%", dur: 20, delay: 7 },
    { emoji: "✧", x: "70%", y: "25%", dur: 26, delay: 2 },
    { emoji: "✦", x: "30%", y: "68%", dur: 18, delay: 5 },
  ];

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute text-white/[0.06] text-2xl md:text-3xl"
          style={{ left: p.x, top: p.y }}
          animate={{ y: [0, -15, 0, 10, 0], opacity: [0.04, 0.08, 0.04, 0.06, 0.04], scale: [1, 1.1, 1, 0.95, 1] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" as const }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
};

// ==========================================
// SCATTERED REFERENCE CARDS (between sections)
// ==========================================

const ScatteredRef = ({ emoji, text, align = "left" }: { emoji: string; text: string; align?: "left" | "right" | "center" }) => (
  <motion.div
    initial={{ opacity: 0, x: align === "left" ? -30 : align === "right" ? 30 : 0, y: 20 }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5 }}
    className={`max-w-3xl mx-auto my-12 flex items-center gap-4 ${align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start"} px-4`}
  >
    <div className="flex items-center gap-3 bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl px-5 py-3 shadow-lg hover:bg-white/[0.07] transition-colors group">
      <span className="text-3xl md:text-4xl group-hover:scale-125 transition-transform">{emoji}</span>
      <span className="text-white/40 text-sm md:text-base font-medium italic">{text}</span>
    </div>
  </motion.div>
);

// ==========================================
// FUN FACT STRIP
// ==========================================

const FunFactStrip = ({ facts }: { facts: string[] }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="max-w-5xl mx-auto my-16 overflow-hidden"
  >
    <div className="flex gap-4 py-3 animate-marquee">
      {[...facts, ...facts].map((fact, i) => (
        <div key={i} className="flex-shrink-0 bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm rounded-full px-5 py-2 text-white/40 text-xs md:text-sm font-medium whitespace-nowrap">
          {fact}
        </div>
      ))}
    </div>
    <style jsx>{`
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-marquee { animation: marquee 30s linear infinite; display: flex; width: max-content; }
    `}</style>
  </motion.div>
);

// ==========================================
// PERSONALITY TRAIT CARD
// ==========================================

const TraitCard = ({ emoji, title, desc }: { emoji: string; title: string; desc: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center hover:border-white/20 transition-colors shadow-lg"
  >
    <span className="text-4xl mb-3">{emoji}</span>
    <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">{title}</h4>
    <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
  </motion.div>
);

// ==========================================
// SECTION WRAPPER
// ==========================================

const Section = ({ title, icon: Icon, children, delay = 0 }: { title: string; icon: any; children: React.ReactNode; delay?: number }) => (
  <motion.section
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, delay }}
    className="w-full max-w-3xl mx-auto mb-16"
  >
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 shadow-lg">
        <Icon size={20} />
      </div>
      <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
    </div>
    <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  </motion.section>
);

// ==========================================
// 1. CHESS MODULE
// ==========================================

const ChessModule = () => {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState("Your move (White)");

  const makeEngineMove = async (currentFen: string) => {
    try {
      setStatus("Arthur's Bot thinking... (1700 Elo)");
      const res = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fen: currentFen, depth: 10 }),
      });
      const data = await res.json();
      if (data && data.move) {
        const g = new Chess(currentFen);
        g.move(data.move);
        setGame(g);
        if (g.isCheckmate()) setStatus("Checkmate! Bot wins.");
        else if (g.isDraw()) setStatus("Draw!");
        else setStatus("Your move");
      } else { throw new Error("No move"); }
    } catch {
      const possibleMoves = new Chess(currentFen).moves();
      if (possibleMoves.length > 0) {
        const captures = possibleMoves.filter((m) => m.includes("x"));
        const move = captures.length > 0 ? captures[Math.floor(Math.random() * captures.length)] : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        const g = new Chess(currentFen);
        g.move(move);
        setGame(g);
        setStatus("Your move (offline)");
      }
    }
  };

  const onDrop = ({ sourceSquare, targetSquare }: any) => {
    try {
      const g = new Chess(game.fen());
      const move = g.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      if (move === null) return false;
      setGame(g);
      makeEngineMove(g.fen());
      return true;
    } catch { return false; }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-white/50 text-sm mb-6 text-center max-w-md">
        I love chess — ~1700 Elo. This bot is calibrated to play at my level. Your move.
      </p>
      <div className="w-full max-w-xs aspect-square rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 mb-4">
        <Chessboard
          options={{
            position: game.fen(),
            onPieceDrop: onDrop,
            darkSquareStyle: { backgroundColor: "#6366f1" },
            lightSquareStyle: { backgroundColor: "#e0e7ff" },
            animationDurationInMs: 250,
          }}
        />
      </div>
      <div className="flex items-center justify-between w-full max-w-xs">
        <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${status.includes("Bot") || status.includes("thinking") ? "text-amber-300 bg-amber-300/10" : "text-emerald-300 bg-emerald-300/10"}`}>{status}</span>
        <button onClick={() => { setGame(new Chess()); setStatus("Your move"); }} className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/10"><RotateCcw size={16} /></button>
      </div>
    </div>
  );
};

// ==========================================
// 2. BACKGAMMON
// ==========================================

const BackgammonModule = () => {
  const [dice, setDice] = useState([6, 6]);
  const checkers = Array.from({ length: 6 }).map((_, i) => ({ id: i, isWhite: i < 3 }));
  const rollDice = () => setDice([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]);

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-white/50 text-sm mb-6 text-center max-w-md">
        Another strategy classic. Drag the checkers, roll the dice — feel the board.
      </p>
      <div className="flex gap-4 mb-6">
        <motion.div key={`d1-${dice[0]}`} initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} className="w-12 h-12 bg-white text-slate-900 font-black text-2xl rounded-xl flex items-center justify-center shadow-lg">{dice[0]}</motion.div>
        <motion.div key={`d2-${dice[1]}`} initial={{ rotate: 180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} className="w-12 h-12 bg-indigo-400 text-white font-black text-2xl rounded-xl flex items-center justify-center shadow-lg">{dice[1]}</motion.div>
      </div>
      <div className="w-full max-w-md bg-[#6b3e1f] p-3 rounded-xl border-4 border-[#4a2c13] shadow-2xl relative h-48 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 flex justify-around px-4 pointer-events-none">
          {[...Array(6)].map((_, i) => <div key={i} className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[70px] border-t-amber-200/30" />)}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4 pointer-events-none">
          {[...Array(6)].map((_, i) => <div key={i} className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[70px] border-b-red-900/40" />)}
        </div>
        {checkers.map((c) => (
          <motion.div key={c.id} drag dragConstraints={{ top: -70, bottom: 70, left: -140, right: 140 }} whileHover={{ scale: 1.1 }} whileDrag={{ scale: 1.3, zIndex: 50 }}
            className={`absolute w-9 h-9 rounded-full shadow-xl border-2 cursor-grab active:cursor-grabbing z-20 ${c.isWhite ? "bg-white border-slate-300" : "bg-red-600 border-red-800"}`}
            style={{ left: `calc(50% + ${(c.id % 3) * 40 - 40}px)`, top: c.isWhite ? "15%" : "55%" }}
          />
        ))}
      </div>
      <button onClick={rollDice} className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors border border-white/10">
        <Dice5 size={16} /> Roll Dice
      </button>
    </div>
  );
};

// ==========================================
// 3. LANGUAGES
// ==========================================

const LanguageModule = () => {
  const languages = [
    { id: "fr", lang: "French", word: "Bonjour", pron: "bon-zhoor", flag: "🇫🇷", color: "from-blue-500 to-blue-700" },
    { id: "en", lang: "English", word: "Hello", pron: "heh-loh", flag: "🇬🇧", color: "from-red-500 to-red-700" },
    { id: "hy", lang: "Armenian", word: "Բարև", pron: "ba-rev", flag: "🇦🇲", color: "from-orange-500 to-orange-700" },
    { id: "ru", lang: "Russian", word: "Привет", pron: "pree-vyet", flag: "🇷🇺", color: "from-emerald-500 to-emerald-700" },
  ];
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  return (
    <div className="w-full">
      <p className="text-white/50 text-sm mb-6 text-center max-w-md mx-auto">
        I speak 4 languages. Tap each card to discover how to say hello in my world.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {languages.map((l) => (
          <motion.div key={l.id} className="relative aspect-[3/4] w-full cursor-pointer"
            onClick={() => setFlipped((prev) => ({ ...prev, [l.id]: !prev[l.id] }))}
            whileHover={{ y: -6 }} whileTap={{ scale: 0.96 }}
            animate={{ rotateY: flipped[l.id] ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            style={{ transformStyle: "preserve-3d", perspective: 800 }}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-white/20 shadow-lg" style={{ backfaceVisibility: "hidden" }}>
              <Globe2 size={28} className="text-white/30 mb-2" />
              <span className="text-white/30 font-bold tracking-widest uppercase text-[10px]">Tap</span>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-br ${l.color} rounded-2xl border border-white/30 flex flex-col items-center justify-center p-3 text-center shadow-xl`} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              <span className="text-3xl mb-2">{l.flag}</span>
              <h4 className="text-white font-black text-xl drop-shadow-md leading-tight">{l.word}</h4>
              <p className="text-white/70 font-mono text-xs mt-1 bg-black/20 px-2 py-0.5 rounded-full">{l.pron}</p>
              <span className="text-[9px] text-white/50 uppercase font-bold tracking-widest mt-2">{l.lang}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. MIXED SPORTS REFLEX
// ==========================================

const SportsModule = () => {
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState<{ id: number; emoji: string; left: number }[]>([]);
  const ballId = useRef(0);
  const sports = ["⚽", "🎾", "🏓", "⚾", "🏀"];

  useEffect(() => {
    const interval = setInterval(() => {
      const emoji = sports[Math.floor(Math.random() * sports.length)];
      const id = ballId.current++;
      setBalls((c) => [...c, { id, emoji, left: Math.random() * 75 + 10 }]);
      setTimeout(() => setBalls((c) => c.filter((b) => b.id !== id)), 3000);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const catchBall = (id: number) => {
    setBalls((c) => c.filter((b) => b.id !== id));
    setScore((s) => s + 1);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-white/50 text-sm mb-4 text-center max-w-md">
        Football, tennis, ping pong, baseball, basketball — I love them all. Tap before they vanish!
      </p>
      <div className="text-white font-bold text-sm bg-white/10 px-5 py-1.5 rounded-full border border-white/10 mb-4">Score: {score}</div>
      <div className="w-full h-56 bg-black/30 rounded-2xl border border-white/10 relative overflow-hidden">
        <span className="absolute inset-0 flex items-center justify-center text-white/10 font-bold uppercase tracking-widest text-xs pointer-events-none">Tap the balls!</span>
        <AnimatePresence>
          {balls.map((b) => (
            <motion.button key={b.id} initial={{ y: -60, opacity: 0, scale: 0.5 }} animate={{ y: 220, opacity: 1, scale: 1.2, rotate: 360 }} exit={{ opacity: 0, scale: 2 }}
              transition={{ duration: 2.8, ease: "linear" as const }} onClick={() => catchBall(b.id)}
              className="absolute w-12 h-12 text-3xl flex items-center justify-center cursor-crosshair active:scale-75 transition-transform" style={{ left: `${b.left}%` }}>
              {b.emoji}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ==========================================
// 5. PRANK MODULE
// ==========================================

const PrankModule = () => {
  const [stage, setStage] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [won, setWon] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messages = ["Definitely clickable.", "Nice try.", "Getting warmer...", "Okay you're persistent.", "Fine. Click me."];

  const handleEvade = () => {
    if (won || stage >= 4) return;
    if (containerRef.current) {
      const box = containerRef.current.getBoundingClientRect();
      const range = stage < 2 ? 100 : stage < 3 ? box.width * 0.4 : 60;
      setPos({ x: (Math.random() - 0.5) * range, y: (Math.random() - 0.5) * Math.min(range, 120) });
      setStage((s) => s + 1);
    }
  };

  if (won) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} transition={{ type: "spring" }}>
          <Sparkles size={40} className="text-yellow-400 mb-3" />
        </motion.div>
        <h4 className="text-xl font-black text-white mb-1">You Got It!</h4>
        <p className="text-white/50 text-sm">Persistence is the best engineering skill.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-white/50 text-sm mb-4 text-center max-w-md">I like playful UX. Try clicking this button. I dare you.</p>
      <div ref={containerRef} className="w-full h-40 relative overflow-hidden flex items-center justify-center bg-black/20 rounded-2xl border border-white/10">
        <motion.button
          animate={{ x: pos.x, y: pos.y, scale: stage === 3 ? 0.5 : 1 }}
          transition={stage >= 3 ? { type: "spring", stiffness: 400, damping: 15 } : { type: "spring", stiffness: 300, damping: 20 }}
          onMouseEnter={stage < 4 ? handleEvade : undefined}
          onClick={() => { if (stage >= 4) setWon(true); else handleEvade(); }}
          className={`px-6 py-3 font-black uppercase tracking-widest rounded-xl shadow-lg relative z-10 text-sm transition-colors ${stage >= 4 ? "bg-emerald-500 text-white hover:bg-emerald-400 cursor-pointer" : "bg-red-500 text-white cursor-default"}`}
        >
          {messages[Math.min(stage, messages.length - 1)]}
        </motion.button>
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE
// ==========================================

export default function CuriousLayout() {
  return (
    <div className="w-full min-h-screen bg-[#0a0a1a] text-white font-sans overflow-x-hidden relative selection:bg-indigo-500/30">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(168,85,247,0.1),transparent)]" />
        <div className="absolute top-1/2 left-1/4 w-full h-full bg-[radial-gradient(ellipse_40%_30%_at_25%_50%,rgba(236,72,153,0.06),transparent)]" />
      </div>

      {/* Always-visible floating particles */}
      <FloatingParticles />

      {/* Big ephemeral cameos */}
      <EphemeralCameo />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="pt-36 pb-16 px-6 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 text-indigo-300 mb-5 border border-indigo-500/30 px-5 py-1.5 rounded-full uppercase tracking-widest text-xs font-bold bg-indigo-500/10 backdrop-blur-sm">
            <Sparkles size={14} /> Adventure Mode
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-5">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
              Playground.
            </span>
          </h1>
          <p className="text-white/50 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Less resume, more interaction. Scroll down to discover hobbies &amp; personality through play.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════ MARQUEE ═══════════════ */}
      <FunFactStrip facts={[
        "☕ Coffee-powered engineer",
        "♟️ 1700 Elo chess player",
        "🇫🇷 🇬🇧 🇦🇲 🇷🇺 Speaks 4 languages",
        "⚽ Football fanatic",
        "🎾 Tennis lover",
        "🏓 Ping pong pro",
        "🐍 Python whisperer",
        "🤖 AI builder",
        "🎲 Backgammon enthusiast",
        "🌙 Dark mode forever",
        "🔧 DevOps tinkerer",
        "🧩 Problem solver",
      ]} />

      <div className="px-4 sm:px-6 relative z-10 pb-40">

        {/* ═══════════════ SCATTERED REF ═══════════════ */}
        <ScatteredRef emoji="🎯" text="Strategy is not what you know — it's how you think." align="left" />

        {/* ═══════════════ CHESS ═══════════════ */}
        <Section title="Chess — 1700 Elo" icon={Trophy}>
          <ChessModule />
        </Section>

        <ScatteredRef emoji="🐉" text="Valar Morghulis. Valar Dohaeris." align="right" />

        {/* ═══════════════ PERSONALITY TRAITS ═══════════════ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto my-20">
          <TraitCard emoji="🧠" title="Strategist" desc="I think 5 moves ahead — in chess and in code." />
          <TraitCard emoji="🌍" title="Multicultural" desc="4 languages, multiple perspectives." />
          <TraitCard emoji="⚡" title="Builder" desc="I ship things. Fast." />
          <TraitCard emoji="😂" title="Humor" desc="If the code compiles, it's already funny." />
        </motion.div>

        <ScatteredRef emoji="🧙‍♂️" text="You're a wizard, Harry." align="left" />

        {/* ═══════════════ BACKGAMMON ═══════════════ */}
        <Section title="Backgammon" icon={Dice5} delay={0.1}>
          <BackgammonModule />
        </Section>

        <ScatteredRef emoji="🍜" text="Ramen is the developer's best friend." align="center" />

        {/* ═══════════════ LANGUAGES ═══════════════ */}
        <Section title="4 Languages" icon={Globe2} delay={0.1}>
          <LanguageModule />
        </Section>

        {/* ═══════════════ MORE PERSONALITY ═══════════════ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto my-20">
          <TraitCard emoji="🎵" title="Music" desc="I code better with lo-fi." />
          <TraitCard emoji="🏋️" title="Sport" desc="Mens sana in corpore sano." />
          <TraitCard emoji="🎮" title="Gamer" desc="From FIFA to Elden Ring." />
        </motion.div>

        <ScatteredRef emoji="🏃‍♂️" text="Believe it! — Naruto Uzumaki" align="right" />

        {/* ═══════════════ SPORTS REFLEX ═══════════════ */}
        <Section title="Sports Reflex" icon={MousePointerClick} delay={0.1}>
          <SportsModule />
        </Section>

        <ScatteredRef emoji="🦖" text="You have lost connection to the internet." align="left" />
        <ScatteredRef emoji="🍕" text="You can't write good code on an empty stomach." align="right" />

        {/* ═══════════════ UX PRANK ═══════════════ */}
        <Section title="UX Prank" icon={Laugh} delay={0.1}>
          <PrankModule />
        </Section>

        <ScatteredRef emoji="👾" text="Insert coin to continue." align="center" />

        {/* ═══════════════ CLOSING ═══════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mt-24 border-t border-white/10 pt-16"
        >
          <p className="text-white/30 text-sm font-medium tracking-wide">
            That was the playful side. The engineering still speaks for itself. ✌️
          </p>
        </motion.div>
      </div>
    </div>
  );
}
