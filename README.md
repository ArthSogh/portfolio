# 🎮 Gamified Persona Portfolio — Arthur Soghoyan

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://portfolio-mu-tan-28.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Next.js-15+-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Database](https://img.shields.io/badge/Supabase-Realtime-blue?logo=supabase&logoColor=white)](https://supabase.com)

A premium, interactive, and gamified professional experience. This portfolio isn't just a static resume; it's a dynamic application that morphs its UI based on the visitor's persona, proving technical mastery through live demonstrations rather than simple bullet points.

---

## 🏛️ One Core, Three Universes
The application features a unified state architecture (`zustand`) that completely re-skins the experience for three distinct types of visitors:

### 1. 💼 [RH / Talent Scouter] — The "Precision" Mode
*   **Focus**: ROI, impact, and high-level career metrics.
*   **Design**: Clean, minimalist "Apple-style" grid layout.
*   **Key Sections**: Fast-scanning career highlights (ISFER, Stanley Robotics), core competencies, and a clear call-to-action for the CV download.

### 2. 🛠️ [Lead Dev / Engineer] — The "Expert" Mode
*   **Focus**: Technical depth, system architecture, and code quality.
*   **Features**:
    *   **Live API Orchestration**: Real-time Bitcoin & Weather fetching using standard serverless routes.
    *   **Algorithm Visualization**: Interactive A* Pathfinding demo built from scratch.
    *   **CI/CD Pipeline Visualization**: A motion-tracked timeline of a project's lifecycle.
    *   **Secure Auth Demo**: A functional Supabase Auth/Profile flow.

### 3. 🎲 [Visitor / Curious] — The "Aventure" Mode
*   **Focus**: Creativity, personality, and interaction design.
*   **Experience**: Hearthstone-inspired magical UI with physics-based card interactions.
*   **Games**:
    *   ♟️ **Chess Engine**: Playable `chess.js` integration.
    *   🃏 **Risk/Reward Poker**: A mini-game built with Framer Motion.
    *   ⚽ **Tactical Passing Puzzle**: Interactive canvas-style football logic.

---

## 💬 Live Interaction: Telegram Real-time Chat
One of the core features is a custom **Serverless Webhook Chat System**:
1.  **Visitor types** in the interactive chat widget (themed per persona).
2.  **Supabase** stores the message and triggers a Webhook.
3.  **Telegram Bot** notifies the developer (Arthur) on his phone.
4.  **Arthur replies from Telegram**; the message is instantly pushed back to the visitor's browser via **Supabase Realtime**.

*Includes custom Web Audio API sound effects for a premium native app feel.*

---

## 🛠️ Technical Stack
*   **Runtime**: Next.js 15+ (App Router) with Turbopack.
*   **Frontend**: React, TypeScript, Tailwind CSS 4.0.
*   **Animation**: Framer Motion (heavy physics and layout transitions).
*   **Backend & DB**: Supabase (PostgreSQL, Auth, Edge Functions, Realtime).
*   **Communications**: Telegram Bot API for live notifications.
*   **State**: Zustand (global persona synchronization).

---

## 🚀 Getting Started

### Local Development
```bash
# 1. Clone the repo
git clone https://github.com/ArthSogh/portfolio.git

# 2. Install dependencies
cd webapp
npm install

# 3. Setup environment variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# etc.

# 4. Run the engine
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 👨‍💻 Author
**Arthur Soghoyan** — Fullstack Engineer & Game Architect.
*   [GitHub](https://github.com/ArthSogh)
*   [Portfolio Live](https://portfolio-mu-tan-28.vercel.app)

---

> *"The best way to predict the future is to create it."*
