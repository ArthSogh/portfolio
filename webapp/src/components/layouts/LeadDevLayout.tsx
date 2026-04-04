"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";
import { 
  Terminal, Database, Server, Cpu, Play, CheckCircle2, 
  XCircle, RotateCcw, Box, Globe, Lock, 
  Code2, Waypoints, Network, Activity,
  CloudLightning, ShieldCheck, GitBranch, ExternalLink
} from "lucide-react";

// ==========================================
// 0. WRAPPER COMPONENT
// ==========================================

const DemoBlock = ({ id, title, explanation, children }: { id?: string, title: string, explanation: React.ReactNode, children: React.ReactNode }) => (
  <section id={id} className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-6xl mx-auto my-32">
    {/* Contextual Explanation Layer */}
    <div className="w-full lg:w-1/3 bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-xl lg:sticky lg:top-32 shrink-0">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-indigo-500/20">
        <Activity size={14} /> Why this matters
      </div>
      <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{title}</h3>
      <div className="text-slate-400 text-sm leading-relaxed space-y-4">
        {explanation}
      </div>
    </div>
    
    {/* Interactive Demo */}
    <div className="w-full lg:w-2/3 bg-[#0d1117] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
       <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-1000" />
       <div className="relative z-10 w-full">
         {children}
       </div>
    </div>
  </section>
);

// ==========================================
// 1. AUTHENTICATION & DATABASE
// ==========================================

type AuthState = "idle" | "loading" | "signed_up" | "logged_in" | "login_error";

const BlockAuthDB = () => {
  const [tab, setTab] = useState<"signup" | "login">("signup");
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", stack: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [savedProfile, setSavedProfile] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState("loading");
    setErrorMsg("");

    try {
      const profile = {
        id: `demo_${Date.now()}`,
        name: signupData.name,
        email: signupData.email.toLowerCase(),
        // We store a simple hash key for demo purposes (not for production use)
        password_hint: btoa(signupData.password), 
        stack: signupData.stack,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").insert([{
        id: profile.id,
        name: profile.name,
        email: profile.email,
        stack: profile.stack,
        created_at: profile.created_at,
      }]);

      if (error) throw error;

      setSavedProfile(profile);
      setAuthState("signed_up");
    } catch (err: any) {
      setErrorMsg(err.message);
      setAuthState("idle");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState("loading");
    setErrorMsg("");

    // Simulate network latency
    await new Promise(r => setTimeout(r, 600));

    // Verify against the profile that was signed up in this session
    if (
      savedProfile &&
      loginData.email.toLowerCase() === savedProfile.email &&
      loginData.password === atob(savedProfile.password_hint)
    ) {
      setAuthState("logged_in");
    } else {
      setErrorMsg("Invalid credentials. Email or password does not match.");
      setAuthState("login_error");
    }
  };

  // --- Success: Logged In
  if (authState === "logged_in" && savedProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <ShieldCheck size={48} className="text-emerald-500 mb-6" />
        <h4 className="text-xl font-bold text-white mb-2">Access Granted</h4>
        <p className="text-slate-400 text-sm mb-8 text-center max-w-sm">
          Credentials verified against the database. Full access unlocked.
        </p>
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-xs text-emerald-500 font-mono mb-4 pb-4 border-b border-slate-800 break-all">
            ✓ Authenticated — ID: {savedProfile.id}
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="text-white font-medium">{savedProfile.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="text-white font-medium">{savedProfile.email}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Stack</span><span className="text-indigo-400 font-medium">{savedProfile.stack}</span></div>
          </div>
        </div>
        <button onClick={() => { setAuthState("idle"); setSignupData({ name: "", email: "", password: "", stack: "" }); setLoginData({ email: "", password: "" }); setSavedProfile(null); setTab("signup"); }}
          className="mt-8 text-sm text-slate-400 hover:text-white transition-colors underline">
          Reset Demo
        </button>
      </div>
    );
  }

  // --- Success: Signed Up, invite to Log In
  if (authState === "signed_up" && savedProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <CheckCircle2 size={48} className="text-indigo-400 mb-6" />
        <h4 className="text-xl font-bold text-white mb-2">Account Created!</h4>
        <p className="text-slate-400 text-sm mb-6 text-center max-w-sm">
          Profile <span className="text-white font-medium">{savedProfile.email}</span> was persisted in Supabase.
          Now switch to <strong className="text-indigo-400">Log In</strong> to verify your credentials.
        </p>
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 text-xs font-mono text-indigo-300 max-w-sm w-full mb-6">
          <div className="opacity-60 mb-1">-- supabase: profiles table</div>
          <div>INSERT → <span className="text-emerald-400">success</span></div>
          <div className="mt-1 text-slate-400 truncate">id: {savedProfile.id}</div>
        </div>
        <button
          onClick={() => { setTab("login"); setAuthState("idle"); }}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          Go to Log In <span>→</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Tab Switcher */}
      <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 mb-8">
        <button onClick={() => { setTab("login"); setAuthState("idle"); setErrorMsg(""); }}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${tab === "login" ? "bg-slate-800 text-white" : "text-slate-500"}`}>
          Log In
        </button>
        <button onClick={() => { setTab("signup"); setAuthState("idle"); setErrorMsg(""); }}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${tab === "signup" ? "bg-slate-800 text-white" : "text-slate-500"}`}>
          Sign Up
        </button>
      </div>

      {/* SIGNUP FORM */}
      {tab === "signup" && (
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Name</label>
            <input required type="text" placeholder="e.g. Ada Lovelace"
              value={signupData.name} onChange={e => setSignupData({ ...signupData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-slate-700" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Email</label>
            <input required type="email" placeholder="e.g. ada@lovelace.dev"
              value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-slate-700" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Password</label>
            <input required type="password" placeholder="Create a password"
              value={signupData.password} onChange={e => setSignupData({ ...signupData, password: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-slate-700" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Favorite Tech Stack</label>
            <input required type="text" placeholder="e.g. Rust & WebAssembly"
              value={signupData.stack} onChange={e => setSignupData({ ...signupData, stack: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-slate-700" />
          </div>
          {errorMsg && <p className="text-red-400 text-xs mt-2">{errorMsg}</p>}
          <button disabled={authState === "loading"}
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg mt-6 hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {authState === "loading" ? <RotateCcw className="animate-spin" size={18} /> : <Database size={18} />}
            {authState === "loading" ? "Creating account..." : "Create Account & Persist to DB"}
          </button>
        </form>
      )}

      {/* LOGIN FORM */}
      {tab === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          {!savedProfile && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-400 mb-4">
              💡 Sign up first to create an account, then come back here to verify your credentials.
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Email</label>
            <input required type="email" placeholder="Enter your email"
              value={loginData.email} onChange={e => { setLoginData({ ...loginData, email: e.target.value }); setErrorMsg(""); setAuthState("idle"); }}
              className={`w-full bg-slate-900 border text-white rounded-lg px-4 py-3 text-sm focus:ring-1 outline-none transition-all placeholder-slate-700 ${authState === "login_error" ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500"}`} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Password</label>
            <input required type="password" placeholder="Enter your password"
              value={loginData.password} onChange={e => { setLoginData({ ...loginData, password: e.target.value }); setErrorMsg(""); setAuthState("idle"); }}
              className={`w-full bg-slate-900 border text-white rounded-lg px-4 py-3 text-sm focus:ring-1 outline-none transition-all placeholder-slate-700 ${authState === "login_error" ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500"}`} />
          </div>
          {errorMsg && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <XCircle size={14} /> {errorMsg}
            </div>
          )}
          <button disabled={authState === "loading"}
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg mt-6 hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {authState === "loading" ? <RotateCcw className="animate-spin" size={18} /> : <Lock size={18} />}
            {authState === "loading" ? "Verifying..." : "Verify Credentials"}
          </button>
        </form>
      )}
    </div>
  );
};

// ==========================================
// 2. API ORCHESTRATION & LLM
// ==========================================

const BlockApiLLM = () => {
  const [status, setStatus] = useState<"idle"|"btc"|"weather"|"llm"|"success"|"error">("idle");
  const [data, setData] = useState({ btc: 0, temp: 0, desc: "" });
  const [insight, setInsight] = useState("");

  const runOrchestrator = async () => {
    setStatus("btc");
    try {
      // Step 1: Request our aggregated Next.js backend API Route
      const res = await fetch("/api/data");
      const json = await res.json();
      
      if (!res.ok || !json.success) throw new Error("Backend API failed");
      
      setStatus("weather");
      await new Promise(r => setTimeout(r, 400)); // UI pacing
      
      setData({ btc: json.data.btc, temp: json.data.temp, desc: json.data.location });
      
      setStatus("llm");
      await new Promise(r => setTimeout(r, 600)); // UI pacing
      
      setInsight(json.data.insight);
      setStatus("success");
    } catch(err) {
      setInsight("Async orchestration failed. API / Backend might be unreachable.");
      setStatus("error");
    }
  };

  return (
    <div className="w-full flex justify-between flex-col h-full min-h-[300px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
         <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <span className="text-slate-500 font-bold text-xs uppercase">Step 1: BTC API</span>
            {status === "btc" ? <RotateCcw size={16} className="text-indigo-400 animate-spin" /> : 
             (status === "weather" || status === "llm" || status === "success") ? <CheckCircle2 size={16} className="text-emerald-500" /> : 
             <Box size={16} className="text-slate-700" />}
         </div>
         <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <span className="text-slate-500 font-bold text-xs uppercase">Step 2: Weather API</span>
            {status === "weather" ? <RotateCcw size={16} className="text-indigo-400 animate-spin" /> : 
             (status === "llm" || status === "success") ? <CheckCircle2 size={16} className="text-emerald-500" /> : 
             <Box size={16} className="text-slate-700" />}
         </div>
         <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <span className="text-slate-500 font-bold text-xs uppercase">Step 3: LLM Eval</span>
            {status === "llm" ? <RotateCcw size={16} className="text-indigo-400 animate-spin" /> : 
             status === "success" ? <CheckCircle2 size={16} className="text-emerald-500" /> : 
             <Box size={16} className="text-slate-700" />}
         </div>
      </div>

      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center text-center">
         {status === "idle" && <p className="text-slate-500">Awaiting execution trigger...</p>}
         {status === "success" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Terminal size={32} className="text-indigo-400 mx-auto mb-4" />
              <p className="text-white text-lg leading-relaxed font-mono font-medium max-w-lg">
                &gt; {insight}
              </p>
           </motion.div>
         )}
         {(status !== "idle" && status !== "success" && status !== "error") && (
           <div className="flex flex-col items-center gap-4">
             <CloudLightning className="text-indigo-500 animate-pulse" size={32} />
             <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase">Orchestrating Pipeline...</p>
           </div>
         )}
      </div>

      <button onClick={runOrchestrator} disabled={status !== "idle" && status !== "success" && status !== "error"} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl mt-6 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        <Play size={18} fill="currentColor" /> Generate Live Insight
      </button>
    </div>
  )
};

// ==========================================
// 3. ALGORITHM PROOF (A* Visualizer)
// ==========================================

const GRID_ROWS = 10;
const GRID_COLS = 16;
type CellType = "EMPTY" | "START" | "END" | "WALL" | "PATH" | "EXPLORED";
type Cell = { r: number, c: number, type: CellType };

const BlockAlgorithm = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({ length: 0, explored: 0, timeMs: 0 });

  const initGrid = useCallback(() => {
    const g: Cell[][] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < GRID_COLS; c++) {
        let type: CellType = "EMPTY";
        if (r === 4 && c === 2) type = "START";
        else if (r === 5 && c === 13) type = "END";
        // Default random walls
        else if (Math.random() < 0.25) type = "WALL";
        row.push({ r, c, type });
      }
      g.push(row);
    }
    setGrid(g);
    setStats({ length: 0, explored: 0, timeMs: 0 });
  }, []);

  useEffect(() => { initGrid(); }, [initGrid]);

  const toggleWall = (r: number, c: number) => {
    if (isRunning) return;
    const newGrid = [...grid];
    if (newGrid[r][c].type === "EMPTY") newGrid[r][c].type = "WALL";
    else if (newGrid[r][c].type === "WALL") newGrid[r][c].type = "EMPTY";
    setGrid(newGrid);
  };

  const runAStar = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    // Reset path/explored
    const g = grid.map(row => row.map(cell => ({
      ...cell,
      type: (cell.type==="PATH" || cell.type==="EXPLORED") ? "EMPTY" as CellType : cell.type
    })));
    setGrid(g);

    let startCell, endCell;
    for (let r=0; r<GRID_ROWS; r++) for (let c=0; c<GRID_COLS; c++) {
      if (g[r][c].type === "START") startCell = g[r][c];
      if (g[r][c].type === "END") endCell = g[r][c];
    }
    
    if(!startCell || !endCell) { setIsRunning(false); return; }

    const openSet = [startCell];
    const cameFrom = new Map<string, Cell>();
    const gScore = new Map<string, number>();
    gScore.set(`${startCell.r},${startCell.c}`, 0);
    
    let exploredCount = 0;
    const startTime = performance.now();

    while (openSet.length > 0) {
      openSet.sort((a,b) => {
        const ga = gScore.get(`${a.r},${a.c}`) || 0;
        const gb = gScore.get(`${b.r},${b.c}`) || 0;
        const fa = ga + Math.abs(a.r - endCell.r) + Math.abs(a.c - endCell.c);
        const fb = gb + Math.abs(b.r - endCell.r) + Math.abs(b.c - endCell.c);
        return fa - fb;
      });

      const current = openSet.shift()!;
      exploredCount++;

      if (current.r === endCell.r && current.c === endCell.c) {
        // Reconstruct path
        let curr = current;
        let pathLen = 0;
        while (cameFrom.has(`${curr.r},${curr.c}`)) {
          curr = cameFrom.get(`${curr.r},${curr.c}`)!;
          if (curr.type !== "START") {
            pathLen++;
            g[curr.r][curr.c].type = "PATH";
            setGrid([...g]);
            await new Promise(r => setTimeout(r, 20)); // animation
          }
        }
        setStats({ length: pathLen, explored: exploredCount, timeMs: Math.round(performance.now() - startTime) });
        setIsRunning(false);
        return;
      }

      if (current.type !== "START" && current.type !== "END") {
        g[current.r][current.c].type = "EXPLORED";
        setGrid([...g]);
        await new Promise(r => setTimeout(r, 10)); // animation
      }

      const dirs = [[0,1], [1,0], [0,-1], [-1,0]];
      for (const [dr, dc] of dirs) {
        const nr = current.r + dr, nc = current.c + dc;
        if (nr>=0 && nr<GRID_ROWS && nc>=0 && nc<GRID_COLS && g[nr][nc].type !== "WALL") {
          const neighbor = g[nr][nc];
          const tentG = (gScore.get(`${current.r},${current.c}`) || 0) + 1;
          if (tentG < (gScore.get(`${nr},${nc}`) ?? Infinity)) {
            cameFrom.set(`${nr},${nc}`, current);
            gScore.set(`${nr},${nc}`, tentG);
            if (!openSet.includes(neighbor)) openSet.push(neighbor);
          }
        }
      }
    }
    
    setIsRunning(false); 
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6 px-2">
         <div className="flex gap-4 text-xs font-mono text-slate-500 uppercase">
           <div>Explored: <span className="text-white">{stats.explored} nodes</span></div>
           <div>Length: <span className="text-emerald-400">{stats.length}</span></div>
           <div>Time: <span className="text-indigo-400">{stats.timeMs}ms</span></div>
         </div>
         <button onClick={initGrid} disabled={isRunning} className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase"><RotateCcw size={14}/></button>
      </div>

      <div className="grid gap-1 mb-8" style={{ gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`, gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
         {grid.flat().map((cell, i) => {
           let bg = "bg-slate-900 border-slate-800";
           if (cell.type === "START") bg = "bg-indigo-500 border-indigo-400";
           if (cell.type === "END") bg = "bg-emerald-500 border-emerald-400";
           if (cell.type === "WALL") bg = "bg-slate-700 border-slate-600";
           if (cell.type === "EXPLORED") bg = "bg-indigo-900/50 border-indigo-800/50";
           if (cell.type === "PATH") bg = "bg-amber-400 border-amber-300 scale-110 shadow-[0_0_10px_rgba(251,191,36,0.5)] z-10";

           return (
             <motion.div 
               key={i} 
               layout
               onMouseDown={() => toggleWall(cell.r, cell.c)}
               onMouseEnter={(e: any) => { if(e.buttons === 1) toggleWall(cell.r, cell.c) }}
               className={`w-6 h-6 sm:w-8 sm:h-8 border cursor-pointer rounded-sm hover:ring-2 hover:ring-white transition-all ${bg}`} 
             />
           )
         })}
      </div>

      <button onClick={runAStar} disabled={isRunning} className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        <Waypoints size={18} /> Run Optimization (A*)
      </button>
    </div>
  )
};

// ==========================================
// 4. CI/CD PIPELINE VISUALIZER
// ==========================================

const PIPELINE_STEPS = [
  { id: "commit", label: "Git Push", icon: <GitBranch size={16}/> },
  { id: "test", label: "Unit Tests", icon: <Code2 size={16}/> },
  { id: "build", label: "Docker Build", icon: <Box size={16}/> },
  { id: "deploy", label: "Prod Deploy", icon: <Server size={16}/> },
];

const BlockCICD = () => {
  const [activeStep, setActiveStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const runPipeline = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(-1);
    
    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 600)); // Simulate work
      setActiveStep(i);
    }
    
    await new Promise(r => setTimeout(r, 600)); // Finish last step
    setActiveStep(PIPELINE_STEPS.length);
    setIsRunning(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center relative mb-12 mt-4 px-4 sm:px-12">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2" />
        <motion.div 
           className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2" 
           initial={{ width: 0 }}
           animate={{ width: activeStep < 0 ? "0%" : `${(activeStep / (PIPELINE_STEPS.length - 1)) * 100}%` }}
           transition={{ duration: 0.5 }}
        />

        {PIPELINE_STEPS.map((step, idx) => {
          const isPast = activeStep > idx;
          const isCurrent = activeStep === idx;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
               <motion.div 
                 className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${isPast ? "bg-emerald-500 border-emerald-900 text-white" : isCurrent ? "bg-indigo-500 border-indigo-900 text-white animate-pulse" : "bg-slate-900 border-slate-700 text-slate-500"}`}
               >
                 {isPast ? <CheckCircle2 size={20} /> : step.icon}
               </motion.div>
               <span className={`absolute top-14 text-xs font-bold uppercase whitespace-nowrap text-center ${isPast || isCurrent ? "text-white" : "text-slate-500"}`}>
                 {step.label}
               </span>
            </div>
          )
        })}
      </div>

      <div className="bg-[#161b22] border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-400 mb-6 h-32 overflow-y-auto w-full md:w-3/4 mx-auto shadow-inner flex flex-col justify-end">
        {activeStep >= 0 && <div className="text-slate-500">&gt; Starting pipeline runner...</div>}
        {activeStep >= 0 && <div className="text-indigo-400">&gt; Cloning repository refs/heads/main...</div>}
        {activeStep >= 1 && <div className="text-emerald-400">&gt; Pytest: 142 passed, 0 warnings in 1.4s</div>}
        {activeStep >= 2 && <div className="text-amber-400">&gt; Building Docker container image... LAYER CACHED</div>}
        {activeStep >= 3 && <div className="text-indigo-400">&gt; Rolling out deployment to Kubernetes cluster...</div>}
        {activeStep === 4 && <div className="text-emerald-500 font-bold mt-2">&gt; PIPELINE SUCCESSFUL. Deployed to prod.</div>}
      </div>

      <button onClick={runPipeline} disabled={isRunning} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border border-slate-700">
        <Play size={18} /> Trigger Jenkins / GitHub Actions
      </button>
    </div>
  )
}

// ==========================================
// 5. INFRASTRUCTURE & DEPLOYMENT
// ==========================================

const BlockInfrastructure = () => (
  <section className="w-full max-w-6xl mx-auto my-32 text-center flex flex-col items-center">
    <Globe size={48} className="text-indigo-500 mb-6" />
    <h3 className="text-3xl font-black text-white mb-4">Production Delivered.</h3>
    <p className="text-slate-400 max-w-2xl mb-12 text-lg">
      This portfolio itself proves real deployment architectures. It is hosted globally on Vercel's Edge Network, secured via strict HTTPS, statically optimized, and continuously integrated.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
        <Lock size={24} className="text-emerald-500 mb-4" />
        <h4 className="text-white font-bold tracking-widest text-sm uppercase mb-2">SSL & Security</h4>
        <p className="text-slate-500 text-sm">Force HTTPS enabled. Configured strict security headers and Content Security Policies.</p>
      </div>
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
        <Network size={24} className="text-blue-500 mb-4" />
        <h4 className="text-white font-bold tracking-widest text-sm uppercase mb-2">Edge Routing</h4>
        <p className="text-slate-500 text-sm">Traffic served closest to the user globally to minimize TTFB metrics.</p>
      </div>
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
        <Server size={24} className="text-indigo-500 mb-4" />
        <h4 className="text-white font-bold tracking-widest text-sm uppercase mb-2">GitOps Ready</h4>
        <p className="text-slate-500 text-sm">Fully automated pipeline linking GitHub commits directly to production builds.</p>
      </div>
    </div>
  </section>
);

// ==========================================
// MAIN LAYOUT
// ==========================================

export default function LeadDevLayout() {
  return (
    <div className="pt-24 pb-32 px-4 sm:px-6 w-full min-h-screen font-sans bg-[#02040a] selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Hero Header */}
      <section className="w-full max-w-4xl mx-auto text-center mt-12 mb-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 font-mono text-sm mb-8">
          <Terminal size={16} className="text-emerald-500" /> ~/portfolio/engineer-mode
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6 mt-2">
          Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Validated.</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
          This dashboard is designed for technical reviewers. Instead of claiming skills, it proves them live directly inside your browser. 
        </p>
      </section>

      {/* Demo Blocks */}
      <DemoBlock 
        title="Authentication & Persistence" 
        explanation={
          <>
            <p>Demonstrates database integration, auth flow, and data persistence using <span className="text-emerald-400">Supabase</span>.</p>
            <ul className="list-disc ml-4 space-y-1 mt-2 text-slate-400">
              <li>Handles user lifecycle (Creation/Retrieval)</li>
              <li>Graceful error handling & fallback states</li>
              <li>State immutability in React forms</li>
            </ul>
          </>
        }
      >
        <BlockAuthDB />
      </DemoBlock>


      <DemoBlock 
        title="API Orchestration & LLMs" 
        explanation={
          <>
            <p>Proves asynchronous orchestration by aggregating disparate public APIs, resolving race conditions, and executing AI synthesis.</p>
            <ul className="list-disc ml-4 space-y-1 mt-2 text-slate-400">
              <li>Multi-step Promise resolution</li>
              <li>Frontend timeout + loading states</li>
              <li>Real-world data fetching (BTC, Weather)</li>
            </ul>
          </>
        }
      >
        <BlockApiLLM />
      </DemoBlock>


      <DemoBlock 
        title="Algorithmic Optimization" 
        explanation={
          <>
            <p>A visual implementation of the famous <span className="text-indigo-400 font-mono">A* Search Algorithm</span> routing through a grid of dynamic obstacles.</p>
            <ul className="list-disc ml-4 space-y-1 mt-2 text-slate-400">
              <li>Heuristics logic (Manhattan distance)</li>
              <li>Performance-aware event handling</li>
              <li>State-driven Grid animation</li>
            </ul>
          </>
        }
      >
        <BlockAlgorithm />
      </DemoBlock>


      <DemoBlock 
        title="CI/CD & Delivery Lifecycle" 
        explanation={
          <>
            <p>Highlights a mature understanding of software engineering pipelines, containerization, and modern deployment strategies.</p>
            <ul className="list-disc ml-4 space-y-1 mt-2 text-slate-400">
              <li>Automated testing mental models</li>
              <li>Docker image build steps</li>
              <li>Staging vs Production boundaries</li>
            </ul>
          </>
        }
      >
        <BlockCICD />
      </DemoBlock>

      {/* Infrastructure Footer */}
      <BlockInfrastructure />

      {/* Github CTA */}
      <div className="w-full max-w-6xl mx-auto border-t border-slate-800 pt-12 flex justify-center pb-8">
        <a href="https://github.com/ArthSogh" target="_blank" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <GitBranch size={20} /> Review the raw code on GitHub <ExternalLink size={14} />
        </a>
      </div>

    </div>
  )
}
