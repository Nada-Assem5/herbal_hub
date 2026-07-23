import fs from "fs";
import path from "path";

// Delete package-lock.json and yarn.lock from the workspace root if they exist
const filesToDelete = ["package-lock.json", "yarn.lock"];
for (const file of filesToDelete) {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete ${file}:`, err);
    }
  }
}

// Check if process.env.npm_config_user_agent includes "pnpm"
const userAgent = process.env.npm_config_user_agent || "";
if (userAgent && !userAgent.includes("pnpm")) {
  console.error("Use pnpm instead");
  process.exit(1);
}

// Sync closed and open jar product images
const rootAssetDir = 'E:\\Nadod\\SkinType Classification';

const imageMap = [
  {
    // Focus Gummies Closed Jar (Gemini_Generated_Image_ejkt2aejkt2aejkt.png)
    src: path.join(rootAssetDir, 'Gemini_Generated_Image_ejkt2aejkt2aejkt.png'),
    fallbackSrc: path.join(rootAssetDir, 'focus-gummies-main.png'),
    dests: [
      path.resolve(process.cwd(), 'attached_assets/generated_images/focus-gummies-main.jpg'),
      path.resolve(process.cwd(), 'attached_assets/generated_images/focus-gummies-main.png'),
      path.resolve(process.cwd(), 'attached_assets/generated_images/focus-gummies.jpg'),
      path.resolve(process.cwd(), 'attached_assets/generated_images/focus-gummies.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/public/images/focus-gummies-main.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/public/images/focus-gummies.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/src/assets/focus-gummies-main.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/src/assets/Gemini_Generated_Image_ejkt2aejkt2aejkt.png')
    ]
  },
  {
    // Focus Gummies Open Jar (photo_2026-07-20_16-24-422.jpg)
    src: path.join(rootAssetDir, 'photo_2026-07-20_16-24-422.jpg'),
    dests: [
      path.resolve(process.cwd(), 'attached_assets/generated_images/focus-gummies-open.jpg'),
      path.resolve(process.cwd(), 'attached_assets/generated_images/focus-gummies-open.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/public/images/focus-gummies-open.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/src/assets/focus-gummies-open.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/src/assets/photo_2026-07-20_16-24-422.jpg')
    ]
  },
  {
    // Mineral Gummies Closed Jar (Gemini_Generated_Image_mluxnamluxnamlux.png)
    src: path.join(rootAssetDir, 'Gemini_Generated_Image_mluxnamluxnamlux.png'),
    fallbackSrc: path.join(rootAssetDir, 'Mineral-gummies-main.png'),
    dests: [
      path.resolve(process.cwd(), 'attached_assets/generated_images/mineral-gummies-main.jpg'),
      path.resolve(process.cwd(), 'attached_assets/generated_images/mineral-gummies-main.png'),
      path.resolve(process.cwd(), 'attached_assets/generated_images/mineral-gummies.jpg'),
      path.resolve(process.cwd(), 'attached_assets/generated_images/mineral-gummies.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/public/images/mineral-gummies-main.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/public/images/mineral-gummies.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/src/assets/mineral-gummies-main.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/src/assets/Gemini_Generated_Image_mluxnamluxnamlux.png')
    ]
  },
  {
    // Mineral Gummies Open Jar (photo_2026-07-20_16-24-423.jpg)
    src: path.join(rootAssetDir, 'photo_2026-07-20_16-24-423.jpg'),
    dests: [
      path.resolve(process.cwd(), 'attached_assets/generated_images/mineral-gummies-open.jpg'),
      path.resolve(process.cwd(), 'attached_assets/generated_images/mineral-gummies-open.png'),
      path.resolve(process.cwd(), 'attached_assets/generated_images/mineral-gummies-alt.jpg'),
      path.resolve(process.cwd(), 'attached_assets/generated_images/mineral-gummies-alt.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/public/images/mineral-gummies-open.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/src/assets/mineral-gummies-open.png'),
      path.resolve(process.cwd(), 'artifacts/pure-botanica/src/assets/photo_2026-07-20_16-24-423.jpg')
    ]
  }
];

imageMap.forEach(({ src, fallbackSrc, dests }) => {
  const actualSrc = fs.existsSync(src) ? src : (fallbackSrc && fs.existsSync(fallbackSrc) ? fallbackSrc : null);
  if (actualSrc) {
    dests.forEach(dest => {
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      try {
        fs.copyFileSync(actualSrc, dest);
        console.log('Copied branded product image to:', dest);
      } catch (err) {
        console.error('Failed to copy image:', err);
      }
    });
  }
});

