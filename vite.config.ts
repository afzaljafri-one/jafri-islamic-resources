import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// ==============================================================================
// Vite Configuration — Jafri Multilingual Religious Books & Audio Platform
// UmmahAPI operates as zero-key primary provider directly from the client.
// AlQuran Cloud operates without API keys directly from the client.
// Adhan-JS operates locally in the browser runtime.
// The retired IslamicAPI proxy has been safely decommissioned.
//
// Command 21 Release Gate Plugin:
// Excludes non-production POCs, test audio, QA reviews, and the 281 MB LiteRT
// model from the standard production deployment bundle (dist/).
// In production, neural models are loaded on-demand via official Hugging Face CDN.
// ==============================================================================

function excludeDevAssetsPlugin(): Plugin {
  return {
    name: 'exclude-dev-assets',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const excludedTargets = [
        'kokoro_spanish_poc',
        'neural_tts_samples',
        'mushaf-reviews',
        'browser_speech_poc.html',
        'browser_speech_poc_v1.html',
        'neural_tts_review.html',
        'voice_listening_evaluation.html',
      ];

      for (const target of excludedTargets) {
        const fullPath = path.join(distDir, target);
        if (fs.existsSync(fullPath)) {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(fullPath);
          }
        }
      }
    },
  };
}

export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE_PATH || (command === 'build' ? '/jafri-islamic-resources/' : '/'),
  plugins: [react(), excludeDevAssetsPlugin()],
  server: {
    port: 5173,
    host: true,
  },
}));
