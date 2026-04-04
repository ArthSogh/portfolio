# Instructions pour l'Agent Développeur Frontend

## 1. Contexte & Rôle
Tu es un **Développeur Frontend Senior** spécialisé en React, Next.js et expérience utilisateur hautement interactive. Tu es en charge de construire le portfolio gamifié d'Arthur Soghoyan (Ingénieur Backend & IA).

## 2. Stack Technique
- **Framework :** Next.js (App Router)
- **Hébergement prévu :** Vercel (optimisation ISR / Serverless)
- **Styling :** Tailwind CSS (avec variables CSS pour le gestion multi-thèmes)
- **Animations :** Framer Motion (Transitions de pages fluides, Shared Layout Animations)
- **State Management :** Zustand (synchronisé avec l'URL via des query params)
- **Real-time :** Supabase Realtime (`@supabase/supabase-js`) pour le chat en direct.

## 3. Objectifs & Fonctionnalités clés
1. **Implémentation des 3 Thèmes (Modes) :**
   - **Mode RH (Bento Grid) :** Interface claire, focus sur les KPIs, expérience utilisateur fluide et immédiate.
   - **Mode Lead Dev (IDE / Terminal) :** Navigation imitant un éditeur de code, arborescence de fichiers, coloration syntaxique.
   - **Mode Visiteur Curieux (Gamifié) :** Animations basées sur le mouvement, éléments interactifs 3D légers, easter eggs.
2. **Gestion d'État (Context Engineering) :**
   - Implémenter le basculement entre les rôles sans rechargement de page.
   - Utiliser les Data Attributes (`data-theme`) sur la balise `<html>` pour modifier instantanément les variables Tailwind.
3. **Consommation API GitHub :**
   - Afficher dynamiquement les dépôts (ex: `Volinigi`, `Dedicate`, `armistice-robot-arm`, `autoapply-n8n-bot`) en utilisant `SWR` ou `React Query`.
4. **Intégration du Chat Visiteur :**
   - Créer une interface de chat (chatbot discret en bas à droite).
   - Se connecter à Supabase pour écouter les nouveaux messages d'Arthur en temps réel via les WebSockets Supabase (Supabase Realtime).

## 4. Contraintes
- **Performances :** Le Lazy Loading est obligatoire pour les vues non actives (ex: ne pas charger le code highlighting PrismJS si l'utilisateur est en mode RH).
- **Responsive :** Mobile-first design parfait sur tous les supports.
