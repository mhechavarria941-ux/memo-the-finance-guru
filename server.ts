import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate minimal compliant solid/branded PNG files in public/ if missing for PWA installability
function createSolidPngBuffer(width: number, height: number, r: number, g: number, b: number): Buffer {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf: Buffer): number {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type: string, data: Buffer): Buffer {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowSize = width * 3 + 1;
  const raw = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    raw[rowStart] = 0; // filter type 0
    const isBorder = y < height * 0.12 || y > height * 0.88;
    for (let x = 0; x < width; x++) {
      const colBorder = isBorder || x < width * 0.12 || x > width * 0.88;
      const idx = rowStart + 1 + x * 3;
      if (colBorder) {
        raw[idx] = 30;
        raw[idx + 1] = 27;
        raw[idx + 2] = 24;
      } else {
        raw[idx] = r;
        raw[idx + 1] = g;
        raw[idx + 2] = b;
      }
    }
  }

  const compressed = zlib.deflateSync(raw);
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

function ensurePwaIcons() {
  try {
    const publicDir = path.resolve(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const icons = [
      { name: 'apple-touch-icon.png', size: 180 },
      { name: 'pwa-192x192.png', size: 192 },
      { name: 'pwa-512x512.png', size: 512 },
      { name: 'pwa-maskable-512x512.png', size: 512 },
    ];
    for (const icon of icons) {
      const target = path.join(publicDir, icon.name);
      if (!fs.existsSync(target)) {
        const buf = createSolidPngBuffer(icon.size, icon.size, 200, 109, 59);
        fs.writeFileSync(target, buf);
      }
    }
  } catch {
    // Ignore read-only filesystem errors in production containers
  }
}

ensurePwaIcons();

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  // Cloud Run & container health check endpoints
  app.get(['/api/health', '/_ah/health'], (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // 1. Generate AI Interactive Scenario Quiz (Literal Apples-to-Apples style with Memo the Owl)
  app.post('/api/gemini/scenario', async (req, res) => {
    try {
      const { topic, track, difficulty, tastingStyle } = req.body || {};
      const ai = getGenAIClient();

      const prompt = `You are Memo, a wise, slightly sleepy, skinny owl who is a finances and accounting guru.
Create ONE interactive, realistic accounting/finance scenario question for an entry-to-intermediate student.
Topic focus: ${topic || 'Prime Cost & The Three Financial Statements'}
Track: ${track || 'accounting'}
Difficulty: ${difficulty || 'Foundational'}
Pedagogical Tasting Style: ${tastingStyle || 'Literal Ledger Auditing'}

CRITICAL RULES:
1. Explain everything in literal "apples to apples and pears to pears" terms — use exact dollar amounts and concrete business items (e.g., actual flour, hourly baker wages, cash register dollars, bank loans). Avoid confusing metaphors.
2. Provide 4 concrete multiple-choice options where 1 is right and 3 represent common student misconceptions.
3. Include a real, free open-access reference citation (e.g., OpenStax Principles of Financial Accounting, SEC EDGAR Investor.gov, Federal Reserve FRED Education, or MIT OpenCourseWare).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              memoIntro: { type: Type.STRING, description: "Memo the owl's friendly, sleepy-wise 1-sentence setup" },
              scenarioContext: { type: Type.STRING, description: "Concrete dollar-by-dollar situation" },
              ledgerSnapshot: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    lineItem: { type: Type.STRING },
                    amount: { type: Type.STRING },
                    note: { type: Type.STRING },
                  },
                  required: ['lineItem', 'amount', 'note'],
                },
              },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctIndex: { type: Type.INTEGER },
              applesToApplesExplanation: { type: Type.STRING, description: "Literal step-by-step math and logic without fluff" },
              teacherDiagnosticInsight: { type: Type.STRING, description: "What misconception this question tests for curriculum tailoring" },
              referenceSource: {
                type: Type.OBJECT,
                properties: {
                  organization: { type: Type.STRING },
                  documentTitle: { type: Type.STRING },
                  url: { type: Type.STRING },
                  licenseNote: { type: Type.STRING },
                },
                required: ['organization', 'documentTitle', 'url', 'licenseNote'],
              },
            },
            required: [
              'title',
              'memoIntro',
              'scenarioContext',
              'ledgerSnapshot',
              'question',
              'options',
              'correctIndex',
              'applesToApplesExplanation',
              'teacherDiagnosticInsight',
              'referenceSource',
            ],
          },
        },
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: 'Empty response from Gemini model.' });
      }
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (error) {
      console.error('Gemini scenario error:', error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to generate scenario.',
      });
    }
  });

  // 2. Ask Memo for a literal "Apples to Apples" custom flashcard & breakdown on any financial term
  app.post('/api/gemini/explain-concept', async (req, res) => {
    try {
      const { concept, track } = req.body || {};
      if (!concept || typeof concept !== 'string') {
        return res.status(400).json({ error: 'Please provide a concept name.' });
      }
      const ai = getGenAIClient();

      const prompt = `You are Memo, the skinny tired-eyed owl who teaches finance and accounting in literal, plain "apples to apples, pears to pears" terms.
The student wants to understand: "${concept}" (Track: ${track || 'general'}).
Create a study flashcard and literal ledger example that strips away textbook jargon and shows exact numbers. Cite a free open educational source.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              category: { type: Type.STRING },
              frontPrompt: { type: Type.STRING },
              literalDefinition: { type: Type.STRING },
              applesToApplesExample: { type: Type.STRING },
              formulaOrRule: { type: Type.STRING },
              memoTip: { type: Type.STRING },
              reference: {
                type: Type.OBJECT,
                properties: {
                  sourceName: { type: Type.STRING },
                  section: { type: Type.STRING },
                  url: { type: Type.STRING },
                  summary: { type: Type.STRING },
                },
                required: ['sourceName', 'section', 'url', 'summary'],
              },
            },
            required: [
              'term',
              'category',
              'frontPrompt',
              'literalDefinition',
              'applesToApplesExample',
              'formulaOrRule',
              'memoTip',
              'reference',
            ],
          },
        },
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: 'Empty response from Gemini model.' });
      }
      return res.json(JSON.parse(text));
    } catch (error) {
      console.error('Gemini explain-concept error:', error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to generate concept explanation.',
      });
    }
  });

  // 3. Generate Personalized Lesson Plan & Teacher Curriculum Tasting Recommendations
  app.post('/api/gemini/lesson-plan', async (req, res) => {
    try {
      const { goal, track, weeklyHours, weakAreas } = req.body || {};
      const ai = getGenAIClient();

      const prompt = `You are Memo, the finances & accounting guru owl.
Build a concise, actionable 4-step personalized study plan for a student:
- Selected Track: ${track || 'general'}
- Goal: ${goal || 'Master foundational accounting and financial statements'}
- Weekly Study Time: ${weeklyHours || 4} hours/week
- Diagnostic Weak Areas: ${Array.isArray(weakAreas) ? weakAreas.join(', ') : 'Prime Cost vs Overhead, Cash Flow timing'}

Keep explanations warm, encouraging, and strictly literal ("apples to apples").`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              planTitle: { type: Type.STRING },
              memoGreeting: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    literalObjective: { type: Type.STRING },
                    concreteExercise: { type: Type.STRING },
                    estimatedMinutes: { type: Type.INTEGER },
                    openSourceReading: { type: Type.STRING },
                  },
                  required: [
                    'stepNumber',
                    'title',
                    'literalObjective',
                    'concreteExercise',
                    'estimatedMinutes',
                    'openSourceReading',
                  ],
                },
              },
              teacherCurriculumNote: { type: Type.STRING },
            },
            required: ['planTitle', 'memoGreeting', 'steps', 'teacherCurriculumNote'],
          },
        },
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: 'Empty response from Gemini model.' });
      }
      return res.json(JSON.parse(text));
    } catch (error) {
      console.error('Gemini lesson-plan error:', error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to generate lesson plan.',
      });
    }
  });

  const distPath = path.join(__dirname, 'dist');
  const isDev =
    process.env.NODE_ENV === 'development' ||
    !fs.existsSync(path.join(distPath, 'index.html'));

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Memo Ledger server running on http://0.0.0.0:${PORT} (mode: ${isDev ? 'development' : 'production'})`);
  });
}

startServer();
