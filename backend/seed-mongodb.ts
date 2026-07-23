/**
 * seed-mongodb.ts
 * ---------------
 * Migration script: reads existing db.json and imports products + assessments into MongoDB.
 *
 * Usage:
 *   npx tsx seed-mongodb.ts
 *   npm run seed
 */

import mongoose, { Schema, model } from "mongoose";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_JSON_PATH = path.resolve(__dirname, "./db.json");

// ── Load Environment Variables ───────────────────────────────────────────────

function loadEnv() {
  if (process.env["MONGODB_URI"]) return;

  const envFiles = [
    path.resolve(__dirname, ".env"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "atlas-credentials.env"),
  ];

  for (const envPath of envFiles) {
    if (fs.existsSync(envPath)) {
      if (typeof (process as any).loadEnvFile === "function") {
        try {
          (process as any).loadEnvFile(envPath);
        } catch {
          // ignore
        }
      }
      if (!process.env["MONGODB_URI"]) {
        try {
          const content = fs.readFileSync(envPath, "utf-8");
          for (const line of content.split("\n")) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
              const [key, ...vals] = trimmed.split("=");
              const varName = key.trim();
              let varVal = vals.join("=").trim();
              if (
                (varVal.startsWith('"') && varVal.endsWith('"')) ||
                (varVal.startsWith("'") && varVal.endsWith("'"))
              ) {
                varVal = varVal.slice(1, -1);
              }
              if (varName && !process.env[varName]) {
                process.env[varName] = varVal;
              }
            }
          }
        } catch {
          // ignore
        }
      }
      if (process.env["MONGODB_URI"]) break;
    }
  }
}

loadEnv();

// ── Schemas (minimal – for seeding) ─────────────────────────────────────────

const productSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: String,
    category: String,
    theme: String,
    netWeight: String,
    count: String,
    description: String,
    mainImage: String,
    openImage: String,
    images: { main: String, open: String },
    price: Number,
  },
  { _id: false }
);

const assessmentSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  parentName: String,
  email: String,
  phone: { type: String, default: null },
  childName: String,
  age: Number,
  gender: String,
  activityLevel: String,
  focusDifficulty: String,
  hyperactivity: String,
  homework: String,
  diet: String,
  vegetables: String,
  supplements: String,
  allergies: { type: String, default: null },
  medications: { type: String, default: null },
  notes: { type: String, default: null },
  focusScore: Number,
  mineralScore: Number,
  recommendation: String,
  createdAt: { type: Date, default: () => new Date() },
});

const ProductModel =
  mongoose.models["Product"] || model("Product", productSchema);
const AssessmentModel =
  mongoose.models["Assessment"] || model("Assessment", assessmentSchema);

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is required.");
    console.error(
      "Please set MONGODB_URI in your .env file or environment variables."
    );
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(uri, {
    dbName: "herbalhub",
    serverSelectionTimeoutMS: 10_000,
  });
  console.log("✅ Connected to database 'herbalhub'.");

  // Read db.json
  let data: { products?: any[]; assessments?: any[] } = {};
  try {
    const raw = await readFile(DB_JSON_PATH, "utf-8");
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`❌ Could not read ${DB_JSON_PATH}:`, err);
    process.exit(1);
  }

  // Seed products
  if (Array.isArray(data.products) && data.products.length > 0) {
    for (const product of data.products) {
      await ProductModel.updateOne(
        { id: product.id },
        { $set: product },
        { upsert: true }
      );
    }
    console.log(`✅ Seeded ${data.products.length} products.`);
  } else {
    console.log("ℹ️ No products found in db.json – skipping.");
  }

  // Seed assessments
  if (Array.isArray(data.assessments) && data.assessments.length > 0) {
    for (const assessment of data.assessments) {
      await AssessmentModel.updateOne(
        { id: assessment.id },
        { $set: { ...assessment, createdAt: new Date(assessment.createdAt) } },
        { upsert: true }
      );
    }
    console.log(`✅ Seeded ${data.assessments.length} assessments.`);
  } else {
    console.log("ℹ️ No assessments found in db.json – skipping.");
  }

  await mongoose.disconnect();
  console.log("🏁 Seeding complete.");
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
