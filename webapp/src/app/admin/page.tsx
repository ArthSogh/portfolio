import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ShieldAlert, LogOut } from "lucide-react";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    // Failsafe redirection in case middleware missed it
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800">
          <ShieldAlert className="text-emerald-500" size={32} />
          <h1 className="text-3xl font-bold tracking-tight">Zone Restreinte</h1>
        </div>

        <p className="text-slate-400 mb-6 text-lg">
          Bienvenue dans le Dashboard d'administration. Vous avez réussi à passer le middleware Next.js d'authentification lié à <strong>Supabase SSR</strong>.
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm mb-8 overflow-x-auto text-emerald-400">
          Utilisateur connecté : {user.email} <br/>
          ID : {user.id}
        </div>

        <form action="/auth/signout" method="post">
          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold">
            <LogOut size={18} /> Déconnexion
          </button>
        </form>
      </div>
    </div>
  );
}
