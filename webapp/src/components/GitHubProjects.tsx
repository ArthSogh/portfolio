"use client";

import useSWR from "swr";
import { GitBranch, Star, TerminalSquare } from "lucide-react";
import { PortfolioMode } from "@/store/useThemeStore";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GitHubProjects({ mode }: { mode: PortfolioMode }) {
  const { data, error, isLoading } = useSWR(
    "https://api.github.com/users/ArthurSog/repos?sort=updated&per_page=3",
    fetcher
  );

  const isLeadDev = mode === "lead_dev";
  const isCurious = mode === "curieux";

  if (error) return <div className="text-red-500 opacity-80">Erreur de chargement GitHub...</div>;
  if (isLoading) return <div className="animate-pulse flex gap-4">Chargement des dépôts...</div>;

  const repos = Array.isArray(data) ? data : [
    { id: 1, name: "Volinigi", description: "Plateforme SaaS B2B", html_url: "#", stargazers_count: 5 },
    { id: 2, name: "Dedicate", description: "Générateur de sites cadeaux AI", html_url: "#", stargazers_count: 12 },
    { id: 3, name: "armistice-robot-arm", description: "Bras robotique imprimé en 3D (C++)", html_url: "#", stargazers_count: 24 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {repos.slice(0, 3).map((repo: any) => (
        <a 
          key={repo.id} 
          href={repo.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`block p-6 rounded-2xl border transition-all hover:scale-105
            ${isLeadDev ? 'bg-black/80 border-emerald-800 text-emerald-400 hover:border-emerald-400' :
              isCurious ? 'bg-white shadow-xl shadow-orange-500/10 border-orange-200' :
              'bg-white border-slate-200 hover:shadow-lg'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            {isLeadDev ? <TerminalSquare size={20} /> : <GitBranch size={20} className={isCurious ? "text-orange-500" : "text-blue-500"} />}
            <h4 className="font-bold text-lg truncate">{repo.name}</h4>
          </div>
          <p className={`text-sm mb-4 line-clamp-2 ${isLeadDev ? 'opacity-70' : 'text-slate-600'}`}>
            {repo.description || "Aucune description fournie."}
          </p>
          <div className="flex items-center gap-1.5 text-sm font-medium opacity-80">
            <Star size={16} className={isCurious ? "text-yellow-500" : ""} />
            {repo.stargazers_count} stars
          </div>
        </a>
      ))}
    </div>
  );
}
