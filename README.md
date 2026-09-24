# Snap Grid 📸

A visual storytelling, photography curation, and short-form video platform built with **React**, **TypeScript**, **Tailwind CSS**, and **Express**.

![Snap Grid](public/logo.svg)

---

## ✨ Features

- **Curated Feeds & Stories**: High-fidelity photography showcases, editorial layout, and story carousels.
- **Shorts & Video Snaps**: Vertical short-form video player with autoplay, likes, comments, and direct sharing.
- **Direct Messaging & Shorts Sharing**:
  - Real-time direct chat between friends.
  - Interactive "Send Short" drawer to share any reel directly into chat with playable previews.
  - Friend requests and connections.
- **Darkroom Studio & Visual Filters**:
  - 12 photo presets (*Noir 35mm, Cyber Blue, Golden Hour, Sepia, Vivid Pop, Neon Cyan, Emerald, Soft Fade, High Contrast, etc.*).
  - Fine-grained darkroom sliders: Brightness, Contrast, Saturation, Sepia, Grayscale, and Soft Focus Blur.
  - In-place post editor for captions, tags, and location.
- **Omni AI Assistant**:
  - Interactive intelligent guide powered by server-side Gemini (`/api/omni/chat`).
  - Provides tour guides, feature recommendations, darkroom tips, and app navigation.
- **Multi-Theme Engine**:
  - **White & Blue**: Clean, modern editorial style with vibrant sapphire accents.
  - **Blue & Black**: High-contrast, immersive night theme.
  - **White & Black**: Minimalist monochrome gallery aesthetic.
- **Curator Profiles & Account Switcher**:
  - Seamless switching between multiple accounts or signing up with custom themes and bios.
  - Bookmarks / Saved posts archive.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend / Proxy**: Express, tsx
- **Build Tool**: Vite
- **AI Integration**: Google GenAI SDK (`@google/genai`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (optional, for Gemini AI features):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Development Server
Start the development server (runs full-stack with Express + Vite on port 3000):
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🌐 Deploy to Netlify

### Option 1: Git Repository (Recommended)
1. Push your project to GitHub, GitLab, or Bitbucket.
2. Go to [app.netlify.com](https://app.netlify.com/) and click **"Add new site"** -> **"Import an existing project"**.
3. Select your repository.
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. *(Optional)* In **Site configuration > Environment variables**, add `GEMINI_API_KEY` for live Omni AI responses.
6. Click **Deploy**.

### Option 2: Drag & Drop (Netlify Drop)
1. Run `npm run build` locally.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist/` folder.

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 📁 Project Structure

```
├── public/               # Static assets & SVG logo
├── src/
│   ├── components/       # Modular UI components (Navigation, Feed, Reels, Chat, Modals)
│   │   ├── DirectMessagesDrawer.tsx # Real-time chat & Shorts sharing
│   │   ├── EditPostModal.tsx        # Visual filters & darkroom editing
│   │   ├── OmniAssistant.tsx        # AI guide & chat assistant
│   │   ├── ReelsView.tsx            # Shorts & vertical video reel player
│   │   ├── SnapGridLogo.tsx         # Brand logo component
│   │   └── ...
│   ├── data.ts           # Initial sample posts, reels, and profiles
│   ├── types.ts          # TypeScript interfaces & definitions
│   ├── utils/            # Audio sound effects & darkroom theme calculations
│   ├── App.tsx           # Main application shell
│   └── main.tsx          # React entrypoint
├── server.ts             # Express backend proxy for Gemini AI
├── package.json
└── vite.config.ts
```

---

## 📄 License
MIT
