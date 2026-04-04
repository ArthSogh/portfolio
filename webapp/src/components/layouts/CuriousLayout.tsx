"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { 
  Swords, Flame, Globe2, Target, ScrollText, 
  PlayCircle, RotateCcw, AlertTriangle, Eye, 
  ArrowRight, Flag, Laugh, Coins, Crown, Quote, Sparkles, ShieldCheck
} from "lucide-react";

// ==========================================
// THEME WRAPPER
// ==========================================

const FantasyCard = ({ title, desc, identity, children, icon: Icon }: any) => (
  <motion.section 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    className="relative w-full max-w-5xl mx-auto my-32 flex flex-col md:flex-row gap-8 items-start"
  >
    {/* Explanation Scroll / Side Menu */}
    <div className="w-full md:w-[320px] shrink-0 bg-[#2b1d14] rounded-sm border-2 border-[#5c4033] shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative z-20">
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#aa7c11] rounded-full border-2 border-[#ffdf73] flex items-center justify-center shadow-lg transform -rotate-12">
         <Icon size={24} className="text-[#3b2713]" />
      </div>
      
      <div className="p-6 pt-10">
        <h3 className="text-2xl font-black text-[#f4e4bc] uppercase tracking-widest font-serif mb-2 drop-shadow-md">{title}</h3>
        <p className="text-[#b59e7a] text-sm italic mb-6 leading-relaxed">"{desc}"</p>
        
        <div className="bg-[#1c130d] border border-[#3e2b1d] p-4 rounded-sm shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10"><ScrollText size={64}/></div>
          <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2 block relative z-10">What this reveals</span>
          <p className="text-[#e2d3b5] text-sm leading-relaxed relative z-10 font-serif">
            {identity}
          </p>
        </div>
      </div>
    </div>
    
    {/* Interactive Zone */}
    <div className="flex-1 w-full bg-[#1c130d] rounded-sm border-2 border-[#3e2b1d] shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-4 md:p-8 relative min-h-[400px] flex items-center justify-center overflow-hidden banner-texture">
       {/* Ambient magical glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />
       <div className="relative z-10 w-full">
         {children}
       </div>
    </div>
  </motion.section>
);

// ==========================================
// 1. CHESS MODULE
// ==========================================

const ChessModule = () => {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState("Your move (White)");

  const makeRandomMove = useCallback((currentGame: Chess) => {
    const possibleMoves = currentGame.moves();
    if (currentGame.isGameOver() || currentGame.isDraw() || possibleMoves.length === 0) {
      if (currentGame.isCheckmate()) setStatus("Checkmate! You win!");
      else setStatus("Game Over. Draw.");
      return;
    }
    let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    const captures = possibleMoves.filter((m: string) => m.includes('x'));
    if (captures.length > 0) move = captures[Math.floor(Math.random() * captures.length)];

    setTimeout(() => {
      const g = new Chess(currentGame.fen());
      g.move(move);
      setGame(g);
      if (g.isCheckmate()) setStatus("Checkmate! Bot wins.");
      else if (g.isDraw()) setStatus("Draw!");
      else setStatus("Your move");
    }, 400);
  }, []);

  // react-chessboard v5.10: onPieceDrop receives PieceDropHandlerArgs
  const onPieceDrop = ({ sourceSquare, targetSquare }: any): boolean => {
    try {
      const g = new Chess(game.fen());
      const move = g.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      if (!move) return false;
      setGame(g);
      setStatus("Bot is thinking...");
      setTimeout(() => makeRandomMove(g), 300);
      return true;
    } catch { return false; }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
       <div className="w-full flex justify-between items-center bg-[#2b1d14] px-4 py-2 border border-[#5c4033] rounded-sm mb-4">
         <div className="flex items-center gap-2">
           <Crown size={20} className="text-[#d4af37]" />
           <span className="text-[#f4e4bc] font-bold text-sm">Arthur Bot (1700 Elo)</span>
         </div>
         <span className="text-[#b59e7a] text-xs font-serif italic max-w-[120px] text-right truncate">Strategy-first</span>
       </div>
       
       <div className="w-full aspect-square border-4 border-[#3e2b1d] shadow-[0_0_20px_rgba(0,0,0,1)] bg-[#1c130d] rounded-sm overflow-hidden">
         <Chessboard 
           options={{
             position: game.fen(),
             onPieceDrop,
             darkSquareStyle: { backgroundColor: "#5c4033" },
             lightSquareStyle: { backgroundColor: "#d0ab7a" },
             animationDurationInMs: 300
           }}
         />
       </div>
       
       <div className="w-full flex justify-between items-center mt-6">
         <span className={`font-bold font-serif px-4 py-2 bg-[#2b1d14] border border-[#3e2b1d] rounded-sm ${status.includes("Bot") ? "text-[#d4af37]" : "text-[#8cb85c]"}`}>
           {status}
         </span>
         <button onClick={() => { setGame(new Chess()); setStatus("Your move"); }} className="p-2 bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 rounded-sm border border-[#d4af37]/30 transition-colors">
           <RotateCcw size={20} />
         </button>
       </div>
    </div>
  )
};

// ==========================================
// 2. MULTILINGUAL CARDS
// ==========================================

const LanguageModule = () => {
  const languages = [
    { id: "fr", lang: "French", native: "Français", word: "Découvrir", flag: "🇫🇷" },
    { id: "en", lang: "English", native: "English", word: "Explore", flag: "🇬🇧" },
    { id: "hy", lang: "Armenian", native: "Հայերեն", word: "Բացահայտել", flag: "🇦🇲" },
    { id: "ru", lang: "Russian", native: "Русский", word: "Исследовать", flag: "🇷🇺" },
  ];
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-md mx-auto perspective-1000">
      {languages.map(l => (
        <motion.div 
          key={l.id}
          className="relative aspect-[3/4] w-full cursor-pointer preserve-3d"
          onClick={() => setFlipped(prev => ({...prev, [l.id]: !prev[l.id]}))}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotateY: flipped[l.id] ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Back (Cover) */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#2b1d14] to-[#1c130d] border-2 border-[#8b6533] rounded-md shadow-lg flex items-center justify-center p-3" style={{ backfaceVisibility: "hidden" }}>
             <div className="w-full h-full border border-[#5c4033] rounded-sm flex flex-col items-center justify-center opacity-60 bg-[url('https://www.transparenttextures.com/patterns/old-mathematics.png')]">
               <Globe2 size={32} className="text-[#a48243]" />
             </div>
          </div>
          {/* Front (Revealed) */}
          <div className="absolute inset-0 backface-hidden bg-[#e8dbbf] border-2 border-[#d4af37] rounded-md shadow-[0_0_20px_rgba(212,175,55,0.3)] flex flex-col items-center justify-center p-4 text-center overflow-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
             <div className="absolute inset-1 border border-[#cebb9a] pointer-events-none" />
             <span className="text-3xl mb-3 drop-shadow-md">{l.flag}</span>
             <h4 className="text-[#3b2713] font-black uppercase tracking-widest text-sm mb-1">{l.native}</h4>
             <p className="text-[#8c6b45] font-serif text-lg font-bold">"{l.word}"</p>
             <span className="absolute bottom-3 text-[10px] text-[#aa8e67] uppercase font-bold tracking-widest">{l.lang}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
};

// ==========================================
// 3. POKER RISK MODULE
// ==========================================

const PokerModule = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const options = [
    { title: "Play Safe", result: "You gained exactly 1 point.", icon: <ShieldCheck size={28}/>, color: "text-[#8cb85c]" },
    { title: "Bluff", result: "They folded. You won the pot with 7-high.", icon: <Eye size={28}/>, color: "text-[#5bc0de]" },
    { title: "All-In", result: "Lost it all. But it was computationally optimal.", icon: <Flame size={28}/>, color: "text-[#d9534f]" }
  ];

  if (selected !== null) {
    const opt = options[selected];
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className={`p-6 rounded-full bg-[#1c130d] border border-[#3e2b1d] shadow-[0_0_40px_rgba(0,0,0,1)] mb-6 ${opt.color}`}>
          {opt.icon}
        </div>
        <h4 className="text-3xl font-black text-[#f4e4bc] font-serif mb-4">{opt.title}</h4>
        <p className={`text-xl font-bold font-serif ${opt.color} mb-8`}>"{opt.result}"</p>
        <button onClick={() => setSelected(null)} className="px-6 py-2 border-2 border-[#5c4033] text-[#d0ab7a] hover:bg-[#5c4033] hover:text-[#f4e4bc] transition-colors rounded-sm uppercase tracking-widest font-bold text-sm">Play Another Hand</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center items-center w-full mt-4">
      {options.map((opt, i) => (
        <motion.button 
          key={i}
          onClick={() => setSelected(i)}
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          className="w-full md:w-32 aspect-[2/3] bg-gradient-to-b from-[#2e1d16] to-[#1c110a] border-2 border-[#8b5a2b] shadow-xl rounded-md flex flex-col items-center justify-center text-center p-4 group"
        >
          <div className="w-12 h-12 rounded-full border border-[#5c4033] flex items-center justify-center mb-4 group-hover:border-[#d4af37] transition-colors text-[#a68656]">
            {opt.icon}
          </div>
          <span className="text-[#e2d3b5] font-black uppercase tracking-wider text-sm">{opt.title}</span>
        </motion.button>
      ))}
    </div>
  )
};

// ==========================================
// 4. FOOTBALL TACTICAL PUZZLE
// ==========================================

const FootballModule = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [status, setStatus] = useState("Click players to build a passing play");
  const targetSequence = [0, 2, 1, 3]; // The "correct" tactical pass 

  const players = [
    { id: 0, label: "CDM", x: "10%", y: "50%", color: "bg-[#0b5394]" },
    { id: 1, label: "CAM", x: "60%", y: "20%", color: "bg-[#0b5394]" },
    { id: 2, label: "RW", x: "40%", y: "80%", color: "bg-[#0b5394]" },
    { id: 3, label: "ST", x: "85%", y: "50%", color: "bg-[#0b5394]" },
    { id: 4, label: "DEF", x: "30%", y: "40%", color: "bg-[#cc0000]" }, // Enemy
    { id: 5, label: "DEF", x: "70%", y: "60%", color: "bg-[#cc0000]" }, // Enemy
  ];

  const handlePlayerClick = (id: number) => {
    if (id >= 4) {
       setStatus("Intercepted! Passing linearly into defenders is dangerous.");
       setSequence([]);
       return;
    }
    const newSeq = [...sequence, id];
    setSequence(newSeq);
    
    if (newSeq.length === targetSequence.length) {
      if (newSeq.every((val, index) => val === targetSequence[index])) {
        setStatus("Beautiful! Escaped the press and found the striker.");
      } else {
        setStatus("Pass completed, but the attack lost momentum.");
      }
      setTimeout(() => setSequence([]), 2500);
    } else {
      setStatus(`Passing... (${newSeq.length}/${targetSequence.length})`);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-[#1a4a2b] border-[6px] border-[#f4e4bc]/80 relative overflow-hidden shadow-inner mb-6">
         {/* Field lines */}
         <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/40 -translate-x-1/2" />
         <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full border-4 border-white/40 -translate-x-1/2 -translate-y-1/2" />
         
         {/* Players */}
         {players.map(p => (
           <motion.button 
             key={p.id}
             onClick={() => handlePlayerClick(p.id)}
             whileHover={{ scale: 1.2 }}
             whileTap={{ scale: 0.9 }}
             initial={false}
             animate={sequence.includes(p.id) ? { scale: 1.15, outline: "3px solid #d4af37" } : { scale: 1, outline: "0px solid transparent" }}
             className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg ${p.color} -translate-x-1/2 -translate-y-1/2`}
             style={{ left: p.x, top: p.y }}
           >
             {p.label}
           </motion.button>
         ))}

         {/* SVG Connecting lines for passes */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none">
           {sequence.length > 1 && sequence.map((id, index) => {
             if (index === 0) return null;
             const prev = players.find(p => p.id === sequence[index - 1]);
             const curr = players.find(p => p.id === id);
             if(!prev || !curr) return null;
             return (
               <line 
                 key={index} 
                 x1={prev.x} y1={prev.y} x2={curr.x} y2={curr.y} 
                 stroke="#d4af37" strokeWidth="3" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]"
               />
             )
           })}
         </svg>
      </div>
      <div className="px-6 py-2 bg-[#2b1d14] border border-[#5c4033] rounded-sm text-[#d4af37] font-serif font-bold text-sm text-center">
        {status}
      </div>
    </div>
  )
};

// ==========================================
// 5. PRANK MODULE
// ==========================================

const PrankModule = () => {
  const [hoverCount, setHoverCount] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [won, setWon] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHover = () => {
    if (won || hoverCount >= 4) return;
    if (containerRef.current) {
       const box = containerRef.current.getBoundingClientRect();
       setPos({
         x: (Math.random() - 0.5) * (box.width - 150),
         y: (Math.random() - 0.5) * (box.height - 50)
       });
       setHoverCount(c => c + 1);
    }
  };

  if (hoverCount >= 4 || won) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center px-4 animate-in fade-in zoom-in">
        <Laugh size={48} className="text-[#d4af37] mb-4" />
        <h4 className="text-2xl font-black text-[#e2d3b5] font-serif mb-2">Alright, you caught me.</h4>
        <p className="text-[#a68656] text-sm">Sometimes UIs should enforce boundaries. But persistence wins.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-[300px] relative overflow-hidden flex items-center justify-center">
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 text-[#a68656]">
         <AlertTriangle size={64} />
       </div>
       <motion.button 
         animate={{ x: pos.x, y: pos.y }}
         transition={{ type: "spring", stiffness: 400, damping: 20 }}
         onMouseEnter={handleHover}
         onClick={() => setWon(true)}
         className="px-6 py-3 bg-[#d9534f] text-white font-bold font-serif uppercase tracking-widest rounded-sm border-2 border-red-900 shadow-xl relative z-10"
       >
         {hoverCount === 0 ? "Do Not Click" : "Nice Try"}
       </motion.button>
    </div>
  )
};

// ==========================================
// MAIN PAGE
// ==========================================

export default function CuriousLayout() {
  return (
    <div className="w-full min-h-screen bg-[#1c130d] text-[#e2d3b5] font-sans selection:bg-[#d4af37]/30 selection:text-[#fff] overflow-x-hidden relative" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')" }}>
      
      {/* Ambient Lighting */}
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-full blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#8b5a2b]/20 to-transparent rounded-full blur-[100px] pointer-events-none translate-y-1/2 translate-x-1/2" />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 text-center relative z-10">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
           <div className="inline-flex items-center gap-2 text-[#d4af37] mb-6 border border-[#d4af37]/30 px-6 py-2 rounded-full uppercase tracking-widest text-xs font-bold bg-[#2b1d14]/80 backdrop-blur-sm">
             <Sparkles size={16} /> Adventure Mode
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-[#f4e4bc] font-serif tracking-tight drop-shadow-xl mb-6">
             Welcome to the Tavern.
           </h1>
           <p className="text-[#a68656] text-xl md:text-2xl font-serif max-w-2xl mx-auto italic">
             "Less resume, more interaction. A playful way to explore who I am."
           </p>
         </motion.div>
      </section>

      <div className="px-4 sm:px-6 relative z-10 pb-40">

        <FantasyCard 
          icon={Swords}
          title="The Chess Board" 
          desc="Strategic thinking isn't just for code." 
          identity="Demonstrates pattern recognition, deep calculation under pressure, and a passion for strategy games. Built locally with chess.js for instant zero-latency processing."
        >
          <ChessModule />
        </FantasyCard>

        <FantasyCard 
          icon={Globe2}
          title="Language Deck" 
          desc="Words carry worlds." 
          identity="A deep multicultural identity. Speaking 4 languages allows for adaptable communication styles, cultural empathy, and breaking down complex localized problems."
        >
          <LanguageModule />
        </FantasyCard>

        <FantasyCard 
          icon={Coins}
          title="The Risk Table" 
          desc="Every decision is a gamble." 
          identity="Reflects an appreciation for probability, risk-calculation, and strategic risk-reward balances under conditions of uncertainty."
        >
          <PokerModule />
        </FantasyCard>

        <FantasyCard 
          icon={Target}
          title="Tactical Setup" 
          desc="Finding the perfect passing lane." 
          identity="A passion for football and team sports. Highlights a mind drawn to tactical sequences, team positioning, and anticipating movements before they happen."
        >
          <FootballModule />
        </FantasyCard>

        <FantasyCard 
          icon={Laugh}
          title="The Secret Boss" 
          desc="Code doesn't always have to be serious." 
          identity="A quick demonstration of playful UX and an appreciation for humor. Software is built by humans, for humans. A lighthearted touch goes a long way."
        >
          <PrankModule />
        </FantasyCard>

        <section className="mt-40 text-center max-w-2xl mx-auto border-t border-[#3e2b1d] pt-20">
          <Quote size={48} className="text-[#5c4033] mx-auto mb-6" />
          <h2 className="text-3xl font-black text-[#f4e4bc] font-serif mb-6">The Adventure Concludes</h2>
          <p className="text-[#a68656] text-lg font-serif mb-10 leading-relaxed">
            That was the playful side. But the engineering version is still 100% real.
          </p>
          <div className="flex justify-center gap-4">
             <button onClick={() => window.location.href='?mode=lead_dev'} className="px-8 py-4 bg-gradient-to-b from-[#2b1d14] to-[#1c130d] border-2 border-[#8b5a2b] text-[#f4e4bc] hover:border-[#d4af37] transition-colors rounded-sm uppercase tracking-widest font-bold text-sm shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
               Return to Engineering
             </button>
          </div>
        </section>

      </div>
    </div>
  );
}
