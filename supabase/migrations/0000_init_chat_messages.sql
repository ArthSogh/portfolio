-- Migration pour la table chat_messages
CREATE TABLE public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    message TEXT NOT NULL,
    is_from_arthur BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active le Temps Réel pour cette table
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- RLS (Row Level Security)
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Autorise tout le monde à lire les messages (optionnel, selon sécurité)
CREATE POLICY "Allow anon read" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.chat_messages FOR INSERT WITH CHECK (true);
