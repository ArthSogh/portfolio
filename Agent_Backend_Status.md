# Agent Backend — État du Projet (03 Avril 2026)

> **À destination de tous les agents** : Ce fichier décrit l'état exact du backend, des APIs, de la base de données et des intégrations temps réel telles qu'elles existent aujourd'hui dans `webapp/`.

---

## 🗂 Architecture Globale

```
Portfolio/
├── webapp/                         # App Next.js 16 App Router (Turbopack)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Homepage — sélection de classe (HR / Lead Dev / Curieux)
│   │   │   ├── portfolio/page.tsx  # Page principale du portfolio (layout switcher)
│   │   │   ├── admin/page.tsx      # Dashboard admin protégé (Supabase Auth)
│   │   │   └── api/
│   │   │       ├── data/route.ts           # ✅ BTC (CoinGecko) + Météo (OpenMeteo) + LLM insight
│   │   │       ├── chat-send/route.ts      # ✅ Envoie message visiteur → Supabase + notif Telegram
│   │   │       ├── notify-visit/route.ts   # ✅ Notif silencieuse à l'arrivée d'un visiteur
│   │   │       └── telegram-webhook/route.ts # ✅ Reçoit les réponses d'Arthur depuis Telegram
│   │   ├── components/
│   │   │   ├── Chatbot.tsx                 # ✅ Chat temps réel Supabase Realtime
│   │   │   └── layouts/
│   │   │       ├── LeadDevLayout.tsx       # ✅ Auth Demo + API Demo + A* + CI/CD
│   │   │       ├── HrLayout.tsx            # Frontend only (pas de backend actif)
│   │   │       └── CuriousLayout.tsx       # ✅ Chess, Poker, Football, Langues, Prank
│   │   ├── utils/
│   │   │   ├── supabaseClient.ts           # ✅ Client browser (@supabase/ssr)
│   │   │   └── supabaseServer.ts           # ✅ Client serveur SSR (cookies)
│   │   ├── middleware.ts                   # ✅ Protège /admin/* uniquement
│   │   └── store/
│   │       ├── useThemeStore.ts            # Zustand — mode actif (hr/lead_dev/curieux)
│   │       └── modeStore.ts               # (alias/legacy)
├── supabase/migrations/
│   ├── 0000_init_chat_messages.sql         # ✅ Table chat_messages + Realtime
│   └── 0001_profiles.sql                  # ✅ Table profiles (démo auth Lead Dev)
└── Agent_Backend_Status.md                # 📄 CE FICHIER
```

---

## ✅ APIs Backend — État Fonctionnel

### `GET /api/data`
- **BTC** : CoinGecko API (gratuite, sans clé)
- **Météo** : OpenMeteo API — Paris (gratuite, sans clé)
- **LLM** : Vercel AI SDK (`ai` + `@ai-sdk/openai`) — génère un insight sarcastique
  - Si `OPENAI_API_KEY` absent → fallback propre avec message texte statique
- **Revalidation** : 60s (Next.js cache)
- **Utilisé par** : `LeadDevLayout.tsx` → bloc "API Orchestration & LLMs"

### `POST /api/chat-send`
- Insère le message visiteur dans `chat_messages` (Supabase Service Role)
- Envoie une notification Telegram à Arthur avec le `session_id` intégré dans le texte
- **Payload** : `{ message: string, sessionId: string }`

### `POST /api/notify-visit`
- Notifie Arthur à l'arrivée d'un visiteur sur `/portfolio` (silencieux, invisible côté UI)
- Inclut le mode choisi (HR / Lead Dev / Curieux) et le `session_id`
- **Payload** : `{ sessionId: string, mode: string }`

### `POST /api/telegram-webhook`
- Reçoit les **réponses d'Arthur depuis Telegram** (Arthur fait "Reply" sur le message de notif)
- Extrait le `session_id` du message original via regex
- Insère la réponse dans `chat_messages` avec `is_from_arthur: true`
- → Supabase Realtime le diffuse instantanément au navigateur du visiteur

---

## 🗄 Base de Données Supabase

### Table : `chat_messages`
```sql
id          UUID    PRIMARY KEY (gen_random_uuid())
session_id  TEXT    NOT NULL
message     TEXT    NOT NULL
is_from_arthur BOOLEAN DEFAULT false
created_at  TIMESTAMPTZ DEFAULT now()
```
- **Realtime activée** : oui (`supabase_realtime` publication)
- **RLS** : SELECT et INSERT ouverts (anon)
- **Migration** : `supabase/migrations/0000_init_chat_messages.sql`

### Table : `profiles`
```sql
id          TEXT    PRIMARY KEY  (format: demo_<timestamp>)
name        TEXT    NOT NULL
email       TEXT    NOT NULL
stack       TEXT    NOT NULL
created_at  TIMESTAMPTZ DEFAULT now()
```
- Utilisée par la démo Signup/Login de `LeadDevLayout`
- **RLS** : SELECT et INSERT ouverts (anon)
- **Migration** : `supabase/migrations/0001_profiles.sql`

> ⚠️ **Action requise** : Exécuter les deux migrations dans Supabase SQL Editor si ce n'est pas encore fait. Activer Realtime sur `chat_messages` dans le dashboard.

---

## 🔐 Authentification

- **Middleware** : `src/middleware.ts` — protège uniquement `/admin/*`, ne touche pas les API routes
- **Admin Page** : `/admin/page.tsx` — vérifie la session Supabase Auth via SSR cookies
- **Demo Auth (LeadDev)** : Flux complet Signup → DB insert → confirmation → Login → vérification credentials
  - Signup : insère dans `profiles`, stocke password en mémoire React (base64 pour la démo)
  - Login : compare email + password contre le profil de la session courante
  - Pas de `auth.signUp` Supabase (évite les validations email en prod)

---

## 💬 Chatbot Temps Réel

**Flux complet :**
```
Visiteur tape → /api/chat-send → Supabase INSERT → Telegram notif → Arthur voit le message
Arthur fait "Reply" sur Telegram → /api/telegram-webhook → Supabase INSERT (is_from_arthur=true)
→ Supabase Realtime → Chatbot.tsx reçoit l'INSERT → affiché instantanément
```

**Détails techniques :**
- Session ID : généré une fois par navigateur, stocké dans `sessionStorage`
- Realtime : souscription filtrée par `session_id` (un channel par visiteur)
- Pas de mise à jour optimiste (évite les messages en double — bug corrigé)
- Badge rouge sur le FAB quand Arthur a répondu et que le chat est fermé
- Notification silencieuse à l'arrivée sur `/portfolio` (avant même que le visiteur ouvre le chat)

**Intro messages par mode** (expliquent le rôle du chat à l'ouverture) :
- `lead_dev` : style terminal/code
- `hr` : formel, professionnel
- `curieux` : décontracté, emoji

---

## 📦 Dépendances Installées

```json
{
  "@supabase/supabase-js": "✅",
  "@supabase/ssr": "✅",
  "ai": "✅ (Vercel AI SDK v4)",
  "@ai-sdk/openai": "✅",
  "swr": "✅",
  "chess.js": "✅ v1.4.0",
  "react-chessboard": "✅ v5.10.0",
  "framer-motion": "✅",
  "zustand": "✅",
  "lucide-react": "✅"
}
```

---

## 🌍 Variables d'Environnement (`webapp/.env.local`)

| Variable | Obligatoire | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Clé publique Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Clé service (API routes uniquement) |
| `TELEGRAM_BOT_TOKEN` | ✅ | Token du bot Telegram (@BotFather) |
| `TELEGRAM_ARTHUR_CHAT_ID` | ✅ | Chat ID Telegram d'Arthur |
| `OPENAI_API_KEY` | ⚪ Optionnel | Si absent, l'insight LLM affiche un fallback statique |

---

## 🔧 Ce qui reste à faire (pour les prochains agents)

### Backend / DevOps
- [ ] **Enregistrer le webhook Telegram** une fois déployé sur Vercel :
  ```
  curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<domaine>.vercel.app/api/telegram-webhook"
  ```
- [ ] **Configurer les variables d'env** dans le dashboard Vercel (Settings → Environment Variables)
- [ ] **Activer Realtime** sur la table `chat_messages` dans Supabase dashboard si pas encore fait

### Frontend
- [ ] La page **HR Layout** n'a pas de backend actif — seule la démo est côté client
- [ ] Envisager un **système d'analytiques** (sessions visitées, modes choisis) via Supabase ou Vercel Analytics
- [ ] Envisager d'ajouter un **son de notification** quand Arthur répond dans le chat

### LLM
- [ ] Ajouter une vraie clé `OPENAI_API_KEY` (ou Vercel AI gratuit) pour activer l'insight LLM dans `/api/data`
- [ ] L'insight LLM utilisera automatiquement la clé une fois présente — aucun changement de code nécessaire

---

## 🟢 État Global : FONCTIONNEL en local

Le serveur de développement tourne sur `http://localhost:3000`.
Toutes les APIs sont opérationnelles. Supabase est connecté avec les vrais credentials.
Le webhook Telegram est prêt mais doit être enregistré après déploiement Vercel.
TypeScript : **0 erreur**.
