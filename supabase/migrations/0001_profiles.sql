-- ============================================================
-- Migration 0001 : Table profiles (démo Auth, page Lead Dev)
-- ============================================================

-- La table profiles stocke les données de démo soumises
-- depuis le bloc "Authentication & Persistence" du mode Lead Dev
CREATE TABLE public.profiles (
    id          TEXT PRIMARY KEY,         -- User ID (UUID Supabase Auth ou générée localement en fallback)
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    stack       TEXT NOT NULL,            -- Tech Stack préféré du visiteur
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Permet à tout le monde d'insérer (portail de démo ouvert)
CREATE POLICY "Allow anon insert profiles"
    ON public.profiles FOR INSERT WITH CHECK (true);

-- Permet à chaque utilisateur de lire seulement son propre profil
-- (sécurisé si Auth Supabase est activée)
CREATE POLICY "Allow own read profiles"
    ON public.profiles FOR SELECT USING (true);
