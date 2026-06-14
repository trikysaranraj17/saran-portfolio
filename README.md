# Saranraj — 3D Cinematic Dramatic Space Portfolio

This is a premium, fully interactive, 3D space-themed portfolio web application built for **Saranraj** (Freelance Web Developer and BCA Student). Every click, hover, drag, and scroll action triggers dramatic space-flight camera transitions and particle reactions.

## 🚀 Tech Stack

- **Framework:** Next.js (App Router, Turbopack)
- **3D Engine:** Three.js (for the global galaxy background, planet meshes, asteroid belts, orbiting electron paths, and wireframe initials)
- **Animation:** GSAP + Custom Lerped Smooth Scrolling
- **Styling:** Vanilla CSS (Tailwind avoided for strict aesthetic control)
- **Database:** MongoDB Atlas via Mongoose ODM
- **Deployment:** Vercel

---

## 🌌 Core Features

1. **Ambient 3D Space Background:** A Three.js canvas utilizing 8000+ stars, a spinning planet with atmospheric glow, asteroid belt orbits, and wireframe glowing logo elements.
2. **Smooth Scroll Engine:** Custom linear interpolation (lerping) smooth scroll wrapper to ensure luxurious glide feel.
3. **Responsive Custom Cursor:** A custom neon-cyan glowing cursor and lagging trailing ring that dynamically expands and pulses on interactive elements.
4. **Interactive Hexagonal Grid:** Dynamic CSS grid displaying Saranraj's developer skills with custom SVG/Lucide iconography.
5. **Draggable Project Carousel:** A smooth horizontal project catalog supporting click-and-drag mouse mechanics and arrow keyboard navigation.
6. **Transmission Comms (Contact Form):** A responsive, glassmorphic contact portal sending signals directly to MongoDB.

---

## 🛠️ Setup & Environment Configuration

### 1. Environment Variables

Create or update the `.env.local` file in the root directory. Provide a valid MongoDB Atlas connection string:

```env
# MongoDB Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/saranportfolio?retryWrites=true&w=majority
```

### 2. Seeding the Database

Once your MongoDB credentials are configured, populate the database with the initial projects by running:

```bash
node scripts/seed.js
```

### 📦 Local File Fallback Mode (No-DB Mode)

To facilitate effortless offline development and review, the application implements an **automatic database fallback mode**. If `MONGODB_URI` is not configured or the connection fails:
- **Projects Feed:** The app gracefully falls back to displaying built-in static seed projects.
- **Transmissions Form:** Contact submissions are saved locally to `data/transmissions.json` inside the project.
- **Analytics Tracking:** Page views and visitor metrics are saved to `data/analytics.json`.

---

## 💻 Development Commands

Install dependencies (if not already completed):

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Compile a production build:

```bash
npm run build
```

Run ESLint rules:

```bash
npm run lint
```
