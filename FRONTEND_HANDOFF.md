# Frontend Architecture & Technical Handoff Guide

## 1. Overview
The Frontend for Arthur Soghoyan's "Gamified Portfolio" has been completely developed, designed, and stabilized. Built atop the **Next.js App Router (v16.2 Turbopack)**, the architecture leverages `React hooks`, `Tailwind CSS` for styling, and `Framer Motion` for heavy physics-based interactive animations.
The codebase lives entirely within the `webapp/` directory.

---

## 2. Page Structure & Persona Routing
The application uses a unified architecture mapped to a centralized global state to minimize unnecessary page routing while completely morphing the UI visually.

* **State Management**: Handled globally via `zustand` in `src/store/modeStore.ts`. It synchronizes the current persona (`hr`, `lead_dev`, `curieux`).
* **Landing Page (`/`)**: A 3D "Hero Selection" Tavern interface. Clicking a card updates the Zustand store and injects a parameter (`?mode=...`) reflecting the layout.
* **Dynamic Portfolio Layer (`/portfolio`)**: A single unified container that conditionally renders one of three layouts based on the persona state:
  1. `HrLayout.tsx`: Linear/Apple-style clean grids highlighting ROIs, fast-scanning metrics, and specific career achievements (ISFER, Stanley Robotics).
  2. `LeadDevLayout.tsx`: A dark-mode technical dashboard proving skills live with local API Orchestration, A* Pathfinding Visualizers, an active Auth Demo, and a CI/CD timeline animation.
  3. `CuriousLayout.tsx`: A Hearthstone-inspired magical UI featuring a playable Chess board (`chess.js`), Poker risk games, football tactical puzzles, and interactive UX pranks.

---

## 3. Database & Supabase Requirements (For Backend Agent)
The frontend is pre-configured to communicate with Supabase via `src/utils/supabaseClient.ts`. The underlying Database tables and **Row Level Security (RLS)** policies MUST properly be configured by the Backend agent to prevent frontend crashes or auth rejections.

Here are the specific definitions currently hard-coded and expected by the frontend hooks:

### A. The "Profiles" Table (Used in `LeadDevLayout.tsx`)
The `LeadDev` mode contains an interactive Authentication demo block. It calls `supabase.auth.signUp()` and subsequently attempts to `insert` the profile metadata into the database.
* **Table Name**: `profiles`
* **Expected Columns**:
  * `id` (uuid, primary key, matches `auth.users.id`)
  * `name` (text)
  * `email` (text)
  * `stack` (text - Favorite Tech Stack)
  * `city` (text)
  * `created_at` (timestamp)
* **Action Required (Backend)**: Create this table. The table must allow inserts for authenticated users (or an override if the demo runs in anon mode) and selects to fetch their own profile. *(Note: The frontend currently employs a graceful fallback catching mechanism if this table drops, but setting it up perfectly prevents the fallback from firing).*

### B. The "Chat Messages" Table (Used in Telegram Webhook route)
* **Table Name**: `chat_messages`
* **Expected Columns**:
  * `id` (uuid, primary key)
  * `session_id` (text - the session tracking string of the current website visitor)
  * `message` (text)
  * `is_from_arthur` (boolean - true if the Telegram webhook pushed it, false if visitor typed it)
* **Action Required (Backend)**: Validate the serverless interceptor `api/telegram-webhook/route.ts` mapped to a Telegram Bot token, allowing Arthur to respond to portfolio visitors live from his phone.

---

## 4. DevOps & Hosting Guidelines (For Vercel)
The DevOps agent must handle the CI/CD pipeline bridging GitHub to Vercel/Render.

### Build Configuration
* **Framework Preset**: Next.js
* **Build Command**: `npm run build`
* **Install Command**: `npm install`
* **Output Directory**: `.next`

### Required Environment Variables
The DevOps agent must set up the Vercel Production and Preview environments with the following exact keys to allow unhindered Database communication:
```env
# Mandatory for standard Frontend-to-Supabase connections
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...

# Mandatory ONLY in secure backend environments (Serverless Webhooks)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1...
```

### Specific DevOps Considerations
* The application runs intensive `useEffect` polling and heavy Framer Motion DOM repaints (`"use client"`). Performance is mostly reliant on the client device, but asset delivery from Edge caches is crucial.
* API Orchestrator Block (in `LeadDevLayout.tsx`) fetches from public APIs (Open-Meteo & CoinDesk). Ensure outbound API requests aren't blocked by any Vercel Firewall rules.

---

## 5. Third-Party NPM Dependencies Installed
If any CI/CD environment caching issues arise, refer to the core stack:
- `framer-motion` (v11+)
- `zustand` 
- `@supabase/supabase-js` 
- `lucide-react` (Vector icons)
- `chess.js` & `react-chessboard` (Game logic and components)

*Generated automatically by the Frontend AI Agent to ensure total decoupling and perfect API boundary mapping for the Backend and DevOps Agents.*
