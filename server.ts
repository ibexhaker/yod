import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instructions for Omni AI guide
const OMNI_SYSTEM_INSTRUCTION = `You are Omni, the intelligent, highly knowledgeable, and eloquent AI guide of Snap Grid.
Snap Grid is a high-fashion, avant-garde editorial photography platform and community.
Key features of Snap Grid:
1. Editorial Monographs Feed: High-resolution visual captures with double-tap likes, camera EXIF analysis, and rich comments.
2. Post Editing & Darkroom Studio: Photographers can edit their posts, apply visual filters (Cyber Blue, Monochrome, Sepia Noir, Golden Hour, Emerald, etc.) and fine-tune Exposure/Brightness, Contrast, Saturation, and Vignette sliders.
3. Full-Motion Shorts: Fullscreen cinematic vertical video reels with sound and instant friend sharing.
4. Friend Letters (Direct Chat): Private messaging with friends, complete with Shorts attachments and real-time sharing.
5. Curated Themes: White & Blue (default, pristine gallery white with cobalt blue accents), Blue & Black (obsidian dark mode with electric blue luminescence), and White & Black (monochrome high-fashion contrast). Users choose when creating an account and can toggle anytime.
6. Community & Discovery: Visual search by camera, tags, and aesthetic exploration.

Your role:
- Guide users on how to use Snap Grid and show them around.
- Provide expert advice on photography composition, lighting, camera lenses, EXIF settings, and creative color grading.
- Be articulate, inspiring, intelligent, and warm. Provide structured, concise responses with helpful bullet points when appropriate.`;

// Fallback intelligent answers if no API key is configured
function getOmniSmartFallback(userMessage: string): string {
  const query = userMessage.toLowerCase();

  if (query.includes('around') || query.includes('tour') || query.includes('guide') || query.includes('show')) {
    return `Welcome to **Snap Grid**! I'm **Omni**, your intelligent curator & visual guide. Here is your quick tour:

1. **Editorial Feed**: Explore fine art photography monographs. Double-tap any image to appreciate, inspect technical EXIF data (shutter, lens, aperture), or add your perspective.
2. **Post Editor & Darkroom**: Tap the **"Edit Post"** button on any of your captures to tweak visual filters (like *Cyber Blue*, *Sepia Noir*, or *35mm Monochrome*) and fine-tune Brightness, Contrast, and Saturation sliders.
3. **Full-Motion Shorts**: Tap **"Shorts"** in the navigation to experience immersive vertical reels with ambient soundscapes.
4. **Letters & Friend Chat**: Tap **"Chat"** to connect with creators, exchange thoughts, and send Shorts directly into conversations.
5. **Theme Customizer**: Snap Grid offers three curated palettes: **White & Blue** (default), **Blue & Black**, and **White & Black**. Toggle them anytime from the top bar!

Where would you like to explore first?`;
  }

  if (query.includes('edit') || query.includes('filter') || query.includes('adjust') || query.includes('slider')) {
    return `**Editing Posts & Fine-Tuning Filters on Snap Grid**:

- **Opening the Editor**: On any post in your Feed or Profile, tap the **"Edit Post"** option.
- **Filter Presets**: Choose between **Cyber Blue** (punchy architectural cool tone), **Monochrome** (high-contrast 35mm street film), **Sepia Noir** (vintage warmth), **Golden Hour**, or **Matte Film**.
- **Darkroom Sliders**:
  - **Exposure / Brightness**: Balance highlight roll-off and shadow depth.
  - **Contrast**: Enhance visual punch or soften tonal gradients.
  - **Saturation**: Dial in vivid colors or drop down to subtle hues.
  - **Vignette / Blur**: Focus viewer attention directly on your subject.
- **Caption & EXIF**: Update your location, narrative, and technical camera specs anytime!`;
  }

  if (query.includes('theme') || query.includes('blue') || query.includes('black') || query.includes('white')) {
    return `**Snap Grid's Tri-Palette Visual Themes**:

Snap Grid features three tailored aesthetic palettes:
1. 🔵 **White & Blue** (*Default*): Crisp gallery white backdrop with cobalt and sapphire blue accents. Pristine and modern.
2. 🌌 **Blue & Black**: Deep obsidian black canvas with radiant electric cyan and neon blue luminescence. Perfect for nighttime darkrooms.
3. ⚪ **White & Black**: Classic high-fashion editorial monochrome with pure ivory whites and matte carbon blacks.

You can select your theme during account creation or switch it anytime via the **Theme Switcher** in the top navigation bar!`;
  }

  if (query.includes('short') || query.includes('reel') || query.includes('video')) {
    return `**Shorts & Direct Sharing**:

Snap Grid Shorts bring cinematic motion to your photography feed:
- **Watching**: Head to the **Shorts** tab to scroll full-screen vertical captures accompanied by curated audio tracks.
- **Sharing to Friends**: Inside any chat in **Letters**, tap the **Shorts** launcher to pick and send video clips directly to your friends!`;
  }

  return `As **Omni**, I'm here to elevate your vision on Snap Grid. 

Whether you're dialing in darkroom contrast curves, composing an architectural monograph, switching between our **White & Blue**, **Blue & Black**, and **White & Black** themes, or sharing Shorts with friends in Letters, I've got you covered.

Feel free to ask me for composition critiques, camera EXIF recommendations, or a guided tour of any feature!`;
}

// POST /api/omni/chat
app.post('/api/omni/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message string is required' });
  }

  try {
    if (ai) {
      // Build conversation context
      const chatHistory = Array.isArray(history)
        ? history.slice(-6).map((h: { sender: string; text: string }) => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          }))
        : [];

      const contents = [
        ...chatHistory,
        {
          role: 'user',
          parts: [{ text: `${OMNI_SYSTEM_INSTRUCTION}\n\nUser Question: ${message}` }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
      });

      const replyText = response.text || getOmniSmartFallback(message);
      return res.json({ reply: replyText });
    } else {
      // Graceful smart fallback when API key is not yet configured in environment
      const fallbackReply = getOmniSmartFallback(message);
      return res.json({ reply: fallbackReply });
    }
  } catch (error: any) {
    console.error('Omni AI Chat error:', error);
    // Return intelligent fallback answer on API error
    const fallbackReply = getOmniSmartFallback(message);
    return res.json({ reply: fallbackReply });
  }
});

// Vite middleware for dev or static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Snap Grid server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
