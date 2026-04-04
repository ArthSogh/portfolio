# PRD & MASTER PROMPT: Gamified Portfolio - Arthur Soghoyan

## 1. CONTEXTE GÉNÉRAL
**Propriétaire :** Arthur Soghoyan [cite: 26, 28]
**Poste :** Software Engineer spécialisé en Backend & Intégration IA [cite: 27, 29, 30].
**Objectif :** Créer un portfolio interactif "gamifié" où l'expérience utilisateur s'adapte au rôle choisi par le visiteur (Recruteur, Lead Dev, ou Visiteur). Le site doit intégrer une messagerie en direct via Telegram pour une communication immédiate [cite: 49].

---

## 2. PERSONAS ET EXPÉRIENCE UTILISATEUR (UX)

### A. Profil : Recruteur / RH
* **Focus :** Efficacité, mots-clés et impact business [cite: 30, 31].
* **Contenu Star :** Projet **AutoApply** (Pipeline de recrutement IA, réduction des coûts d'inférence de 97%) [cite: 44, 46, 50].
* **Mots-clés prioritaires :** Python, SQL, Cloud (AWS/GCP), CI/CD, Intégration LLM [cite: 15, 16, 18, 31, 47].
* **Design :** Interface de type "Bento Grid" épurée et professionnelle.

### B. Profil : Lead Dev / Ingénieur
* **Focus :** Expertise technique, architecture et qualité du code [cite: 30, 31].
* **Contenu Star :** **Stanley Robotics** (Algorithmes de scoring, Digital Twins) [cite: 33, 35] et **HandMotion3D** (PyTorch, MediaPipe, 3D Tracking) [cite: 53, 54].
* **Détails Techniques :** Multithreading, protocoles embarqués (I2C, SPI), Docker, Kubernetes, Datadog [cite: 16, 18, 37, 40, 41].
* **Design :** Style "IDE / Terminal", navigation par lignes de commande ou structure de dossiers.

### C. Profil : Visiteur Curieux
* **Focus :** Personnalité, interactivité et "Wow factor".
* **Contenu :** Joueur d'échecs de compétition (1700 Elo), joueur de Poker [cite: 60, 61].
* **Design :** Expérience ludique, animations basées sur le mouvement (référence au suivi de mouvement 3D) [cite: 54, 55].

---

## 3. SPÉCIFICATIONS TECHNIQUES (STACK RECOMMANDÉE)

* **Frontend :** Next.js (App Router), Tailwind CSS, Framer Motion (pour les transitions entre les rôles).
* **Backend :** FastAPI (Python) pour gérer la logique et les Webhooks [cite: 31, 35].
* **Système de Chat :**
    * **Entrée :** Chatbot discret sur le site (Socket.io).
    * **Sortie :** Notification immédiate sur le compte Telegram d'Arthur [cite: 4, 5, 49].
    * **Interaction :** Arthur répond sur Telegram -> Le visiteur voit la réponse en temps réel sur le site.
* **Intégrations :** GitHub API (récupération dynamique des repositories), PostgreSQL (historique des sessions).

---

## 4. INSTRUCTIONS POUR LES AGENTS
Chaque agent doit agir selon son expertise tout en respectant l'unité de ce PRD :
* **Agent UI/UX :** Doit créer des thèmes CSS commutables dynamiquement basés sur la sélection de rôle initiale.
* **Agent Backend :** Doit fournir le code pour le pont Telegram-Socket.io et sécuriser les échanges.
* **Agent Contenu :** Doit extraire les informations du CV d'Arthur (Expériences chez Stanley Robotics, iSpheres) pour les reformuler selon le niveau de technicité du rôle choisi [cite: 33, 38].

---

## 5. DONNÉES CLÉS DU CV (RÉFÉRENCES)
* **Formation :** ENS-ParisSaclay (M2 Intelligent Systems), Esme Sudria (Embedded Systems) [cite: 9, 10].
* **Langues :** Français, Anglais, Arménien, Russe [cite: 22, 23, 24, 25].
* **Expertise Cloud :** GCP (BigQuery), AWS (EC2) [cite: 16, 36, 48].
