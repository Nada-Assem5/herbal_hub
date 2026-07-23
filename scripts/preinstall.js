import fs from "fs";
import path from "path";

// Sync closed and open jar product images from src/assets to public/images
// Falls back gracefully if source images are not present (e.g. in CI/Vercel)
const repoAssetsDir = path.resolve(process.cwd(), "frontend/src/assets");

const imageMap = [
  {
    // Focus Gummies Closed Jar
    src: path.join(repoAssetsDir, "Gemini_Generated_Image_ejkt2aejkt2aejkt.png"),
    fallbackSrc: path.join(repoAssetsDir, "focus-gummies-main.png"),
    dests: [
      path.resolve(process.cwd(), "frontend/public/images/focus-gummies-main.png"),
      path.resolve(process.cwd(), "frontend/public/images/focus-gummies.png"),
      path.resolve(process.cwd(), "frontend/src/assets/focus-gummies-main.png"),
    ],
  },
  {
    // Focus Gummies Open Jar
    src: path.join(repoAssetsDir, "photo_2026-07-20_16-24-422.jpg"),
    dests: [
      path.resolve(process.cwd(), "frontend/public/images/focus-gummies-open.png"),
      path.resolve(process.cwd(), "frontend/src/assets/focus-gummies-open.png"),
    ],
  },
  {
    // Mineral Gummies Closed Jar
    src: path.join(repoAssetsDir, "Gemini_Generated_Image_mluxnamluxnamlux.png"),
    fallbackSrc: path.join(repoAssetsDir, "Mineral-gummies-main.png"),
    dests: [
      path.resolve(process.cwd(), "frontend/public/images/mineral-gummies-main.png"),
      path.resolve(process.cwd(), "frontend/public/images/mineral-gummies.png"),
      path.resolve(process.cwd(), "frontend/src/assets/mineral-gummies-main.png"),
    ],
  },
  {
    // Mineral Gummies Open Jar
    src: path.join(repoAssetsDir, "photo_2026-07-20_16-24-423.jpg"),
    dests: [
      path.resolve(process.cwd(), "frontend/public/images/mineral-gummies-open.png"),
      path.resolve(process.cwd(), "frontend/src/assets/mineral-gummies-open.png"),
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
        console.log("Copied product image to:", path.relative(process.cwd(), dest));
      } catch (err) {
        console.error("Failed to copy image:", err);
      }
    });
  }
});
