import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Sync closed and open jar product images from local source directory
// Falls back gracefully if the source directory doesn't exist (e.g. in CI/Vercel)
const repoAssetsDir = path.resolve(import.meta.dirname, 'src/assets');

const imageMap = [
  {
    // Focus Gummies Closed Jar
    src: path.join(repoAssetsDir, 'Gemini_Generated_Image_ejkt2aejkt2aejkt.png'),
    fallbackSrc: path.join(repoAssetsDir, 'focus-gummies-main.png'),
    dests: [
      path.resolve(import.meta.dirname, 'public/images/focus-gummies-main.png'),
      path.resolve(import.meta.dirname, 'public/images/focus-gummies.png'),
      path.resolve(import.meta.dirname, 'src/assets/focus-gummies-main.png'),
    ],
  },
  {
    // Focus Gummies Open Jar
    src: path.join(repoAssetsDir, 'photo_2026-07-20_16-24-422.jpg'),
    dests: [
      path.resolve(import.meta.dirname, 'public/images/focus-gummies-open.png'),
      path.resolve(import.meta.dirname, 'src/assets/focus-gummies-open.png'),
    ],
  },
  {
    // Mineral Gummies Closed Jar
    src: path.join(repoAssetsDir, 'Gemini_Generated_Image_mluxnamluxnamlux.png'),
    fallbackSrc: path.join(repoAssetsDir, 'Mineral-gummies-main.png'),
    dests: [
      path.resolve(import.meta.dirname, 'public/images/mineral-gummies-main.png'),
      path.resolve(import.meta.dirname, 'public/images/mineral-gummies.png'),
      path.resolve(import.meta.dirname, 'src/assets/mineral-gummies-main.png'),
    ],
  },
  {
    // Mineral Gummies Open Jar
    src: path.join(repoAssetsDir, 'photo_2026-07-20_16-24-423.jpg'),
    dests: [
      path.resolve(import.meta.dirname, 'public/images/mineral-gummies-open.png'),
      path.resolve(import.meta.dirname, 'src/assets/mineral-gummies-open.png'),
    ],
  },
];

imageMap.forEach(({ src, fallbackSrc, dests }) => {
  const actualSrc = fs.existsSync(src)
    ? src
    : fallbackSrc && fs.existsSync(fallbackSrc)
      ? fallbackSrc
      : null;
  if (actualSrc) {
    dests.forEach((dest) => {
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      try {
        fs.copyFileSync(actualSrc, dest);
      } catch {
        // Non-fatal: asset copy failure shouldn't break the build
      }
    });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 5173;
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
