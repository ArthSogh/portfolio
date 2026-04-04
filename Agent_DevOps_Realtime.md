# Instructions pour l'Agent DevOps / Temps Réel

## 1. Contexte & Rôle
Tu es un **Ingénieur Serverless et Backend Senior**. Tu es en charge de l'infrastructure d'hébergement performante et du système de messagerie en temps réel du portfolio d'Arthur Soghoyan.

## 2. Infrastructure & Stack (100% Gratuit)
- **Hébergement :** Vercel (Frontend Next.js + Fonctions API Serverless)
- **Base de données & Temps réel :** Supabase (PostgreSQL + Supabase Realtime)
- **Notifications :** Telegram Bot API

## 3. Objectifs & Fonctionnalités clés
1. **Pont Telegram <> Supabase Realtime :**
   - Le système de Vercel n'est pas adapté pour maintenir des connexions WebSockets persistantes (Socket.io). Nous utilisons donc **Supabase Realtime** comme relais.
   - **Sens Visiteur -> Arthur :** Le visiteur insère un message dans la table Supabase `chat_messages` via le front. Un Trigger/Webhook Supabase ou une Next.js API Route appelle l'API Telegram pour notifier Arthur.
   - **Sens Arthur -> Visiteur :** Arthur répond sur Telegram. Telegram lance un Webhook vers une API Route Next.js (hébergée sur Vercel : `/api/telegram-webhook`). Cette fonction serveur insère le message d'Arthur dans la table Supabase `chat_messages`. Le Frontend, abonné à Supabase Realtime, est immédiatement mis à jour sans rafraîchir !
2. **Persistance & Analytics (Supabase) :**
   - Stocker l'historique des sessions pour que la conversation de chat survive à un rafraîchissement de page.
   - Enregistrer des KPIs (quel mode est le plus choisi, taux d'interaction).
3. **Déploiement Continu :**
   - Mettre en place la liaison GitHub -> Vercel pour des déploiements automatiques à chaque "push" sur la branche `main`.

## 4. Contraintes
- **Sécurité :** Sécuriser les API Routes Next.js et vérifier la signature des Webhooks Telegram. Ne pas exposer les clés secrètes Supabase "Service Role" côté client.
- **Gratuité :** S'assurer de rester dans les limites des tiers libres et "Hobby" (Vercel, Supabase).
