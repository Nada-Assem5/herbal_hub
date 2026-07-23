import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Sync closed and open jar product images
const rootAssetDir = 'E:\\Nadod\\SkinType Classification';

const imageMap = [
  {
    // Focus Gummies Closed Jar (Gemini_Generated_Image_ejkt2aejkt2aejkt.png)
    src: path.join(rootAssetDir, 'Gemini_Generated_Image_ejkt2aejkt2aejkt.png'),
    fallbackSrc: path.join(rootAssetDir, 'focus-gummies-main.png'),
    dests: [
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/focus-gummies-main.jpg'),
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/focus-gummies-main.png'),
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/focus-gummies.jpg'),
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/focus-gummies.png'),
      path.resolve(import.meta.dirname, 'public/images/focus-gummies-main.png'),
      path.resolve(import.meta.dirname, 'public/images/focus-gummies.png'),
      path.resolve(import.meta.dirname, 'src/assets/focus-gummies-main.png'),
      path.resolve(import.meta.dirname, 'src/assets/Gemini_Generated_Image_ejkt2aejkt2aejkt.png')
    ]
  },
  {
    // Focus Gummies Open Jar (photo_2026-07-20_16-24-422.jpg)
    src: path.join(rootAssetDir, 'photo_2026-07-20_16-24-422.jpg'),
    dests: [
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/focus-gummies-open.jpg'),
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/focus-gummies-open.png'),
      path.resolve(import.meta.dirname, 'public/images/focus-gummies-open.png'),
      path.resolve(import.meta.dirname, 'src/assets/focus-gummies-open.png'),
      path.resolve(import.meta.dirname, 'src/assets/photo_2026-07-20_16-24-422.jpg')
    ]
  },
  {
    // Mineral Gummies Closed Jar (Gemini_Generated_Image_mluxnamluxnamlux.png)
    src: path.join(rootAssetDir, 'Gemini_Generated_Image_mluxnamluxnamlux.png'),
    fallbackSrc: path.join(rootAssetDir, 'Mineral-gummies-main.png'),
    dests: [
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/mineral-gummies-main.jpg'),
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/mineral-gummies-main.png'),
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/mineral-gummies.jpg'),
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/mineral-gummies.png'),
      path.resolve(import.meta.dirname, 'public/images/mineral-gummies-main.png'),
      path.resolve(import.meta.dirname, 'public/images/mineral-gummies.png'),
      path.resolve(import.meta.dirname, 'src/assets/mineral-gummies-main.png'),
      path.resolve(import.meta.dirname, 'src/assets/Gemini_Generated_Image_mluxnamluxnamlux.png')
    ]
  },
  {
    // Mineral Gummies Open Jar (photo_2026-07-20_16-24-423.jpg)
    src: path.join(rootAssetDir, 'photo_2026-07-20_16-24-423.jpg'),
    dests: [
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/mineral-gummies-open.jpg'),
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/mineral-gummies-open.png'),
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/mineral-gummies-alt.jpg'),
      path.resolve(import.meta.dirname, '../../attached_assets/generated_images/mineral-gummies-alt.png'),
      path.resolve(import.meta.dirname, 'public/images/mineral-gummies-open.png'),
      path.resolve(import.meta.dirname, 'src/assets/mineral-gummies-open.png'),
      path.resolve(import.meta.dirname, 'src/assets/photo_2026-07-20_16-24-423.jpg')
    ]
  }
];

imageMap.forEach(({ src, fallbackSrc, dests }) => {
  const actualSrc = fs.existsSync(src) ? src : (fallbackSrc && fs.existsSync(fallbackSrc) ? fallbackSrc : null);
  if (actualSrc) {
    dests.forEach(dest => {
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(actualSrc, dest);
    });
  }
});


import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
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
