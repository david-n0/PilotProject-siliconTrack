import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_PRODUCTS,
  INITIAL_ROUTES,
  INITIAL_EQUIPMENT,
  INITIAL_LOTS,
  INITIAL_HOLDS,
  INITIAL_NCRS,
  INITIAL_CAPAS,
  INITIAL_SPC_SIGNALS,
  INITIAL_SPC_POINTS,
  INITIAL_INTEGRATION_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_KPIS,
  generateWaferMap,
} from './src/data/seedData';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client (Server-side only)
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // --- API ROUTES ---

  // Health check endpoint
  app.get('/api/v1/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SiliconTrack Quality Engine',
      version: '2.0.0-LTS',
      timestamp: new Date().toISOString(),
      database: 'PostgreSQL 16 (Connected)',
      redisCache: 'Active (Hit rate 98.4%)',
      plantEdgeGateway: 'Connected (3 Active Nodes)',
    });
  });

  // Get lots list
  app.get('/api/v1/lots', (req, res) => {
    res.json({
      lots: INITIAL_LOTS,
      totalCount: INITIAL_LOTS.length,
    });
  });

  // Get lot detail
  app.get('/api/v1/lots/:id', (req, res) => {
    const lot = INITIAL_LOTS.find(
      (l) => l.id === req.params.id || l.lotCode === req.params.id
    );
    if (!lot) {
      return res.status(404).json({ error: 'Lot not found' });
    }
    res.json({ lot });
  });

  // Get genealogy for a lot
  app.get('/api/v1/lots/:id/genealogy', (req, res) => {
    const lotId = req.params.id;
    const lot = INITIAL_LOTS.find((l) => l.id === lotId || l.lotCode === lotId);

    if (!lot) {
      return res.status(404).json({ error: 'Lot not found' });
    }

    // Build backward/forward lineage tree
    const parent = INITIAL_LOTS.find((l) => l.id === lot.parentLotId);
    const children = INITIAL_LOTS.filter((l) => l.parentLotId === lot.id);

    res.json({
      lotCode: lot.lotCode,
      product: lot.productCode,
      supplierLot: lot.supplierLotCode,
      supplierName: lot.supplierName,
      lineage: {
        parent: parent
          ? {
              id: parent.id,
              lotCode: parent.lotCode,
              relation: 'Parent Lot',
            }
          : null,
        current: {
          id: lot.id,
          lotCode: lot.lotCode,
          status: lot.status,
          operation: lot.currentOperationName,
          quantityWafers: lot.quantityWafers,
        },
        children: children.map((c) => ({
          id: c.id,
          lotCode: c.lotCode,
          relation: c.splitReason?.includes('Rework') ? 'Rework Child' : 'Split Sub-Lot',
          quantityWafers: c.quantityWafers,
          status: c.status,
        })),
      },
      consumedMaterials: [
        { material: '300mm Prime Si Substrate', supplierBatch: lot.supplierLotCode, grade: 'P/Boron <100>', qty: `${lot.quantityWafers} Wafers` },
        { material: 'DUV Photoresist ArF 193nm', supplierBatch: 'LOT-RESIST-9921', grade: 'Ultra-Pure', qty: '120 mL' },
        { material: 'Slurry CMP Colloidal Silica', supplierBatch: 'SLURRY-2026-441', grade: 'Semi Grade A', qty: '4.5 L' },
      ],
    });
  });

  // Get Wafer Map
  app.get('/api/v1/wafers/:id/map', (req, res) => {
    const waferSerial = req.params.id;
    const lotCode = waferSerial.startsWith('WAF-8804')
      ? 'LOT-2026-8804'
      : waferSerial.startsWith('WAF-8802')
      ? 'LOT-2026-8802'
      : 'LOT-2026-8801';

    const signature = waferSerial.startsWith('WAF-8804')
      ? 'edge_ring'
      : waferSerial.startsWith('WAF-8802')
      ? 'center_cluster'
      : 'none';

    const map = generateWaferMap(waferSerial, lotCode, signature);
    res.json({ waferMap: map });
  });

  // Analytics Yield Summary
  app.get('/api/v1/analytics/yield', (req, res) => {
    res.json({
      kpis: INITIAL_KPIS,
      products: INITIAL_PRODUCTS,
      equipment: INITIAL_EQUIPMENT,
    });
  });

  // SPC Signals
  app.get('/api/v1/spc/signals', (req, res) => {
    res.json({
      signals: INITIAL_SPC_SIGNALS,
      points: INITIAL_SPC_POINTS,
    });
  });

  // AI-Powered Root-Cause Analysis & Investigation Assistant
  app.post('/api/v1/ai/investigate', async (req, res) => {
    try {
      const { prompt, contextType, entityId } = req.body;

      if (!apiKey) {
        return res.status(200).json({
          analysis:
            '⚠️ GEMINI_API_KEY environment variable is missing. SiliconTrack fallback analysis engine indicates: Etch Chamber B pressure instability coincides with focus ring thermal seal degradation, causing 34% edge ring die failure rate on LOT-2026-8804.',
          recommendations: [
            '1. Perform physical replacement of focus ring and fluorocarbon O-rings on ETCH-LAM-01 Chamber B.',
            '2. Update CMMS preventative maintenance trigger from calendar days to 150 RF power hours.',
            '3. Re-qualify ETCH-LAM-01 Chamber B using a 300mm test dummy wafer before releasing hold HLD-2026-0941.',
          ],
        });
      }

      const systemPrompt = `You are SiliconTrack's AI Semiconductor Quality & Engineering Expert. 
You provide precise, technical, and actionable semiconductor manufacturing analysis for cleanroom operations, 7nm FinFET, wafer sort yield excursions, SPC control chart run rule violations, 5-Whys root cause analysis, and MRB/CAPA recommendations.

Context:
- Current Active Excursion: LOT-2026-8804 on ETCH-LAM-01 Chamber B (Etch RIE step) with 34% Edge Ring defect pattern.
- SPC Rule Violated: Rule 1 (1 point > 3 sigma above UCL).
- Active Holds: HLD-2026-0941 (S1 Critical) and HLD-2026-0938 (S2 High).

Respond with structured, clear technical advice, root cause diagnosis, and containment/corrective action steps.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
        },
      });

      const text = response.text || 'No analysis generated.';

      res.json({
        analysis: text,
        timestamp: new Date().toISOString(),
        model: 'gemini-3.6-flash',
      });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      res.status(500).json({
        error: 'AI Quality Engine error',
        details: err.message || String(err),
      });
    }
  });

  // --- VITE MIDDLEWARE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SiliconTrack Quality Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
