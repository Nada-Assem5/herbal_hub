import fs from "node:fs";
import path from "node:path";
import mongoose, { Schema, model, type Document, type Model } from "mongoose";
import { type Assessment, type InsertAssessment } from "./schema/index.js";

// ── Connection ────────────────────────────────────────────────────────────────

function loadEnv() {
  if (process.env["MONGODB_URI"]) return;

  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "backend/.env"),
    path.resolve(process.cwd(), "../backend/.env"),
    path.resolve(process.cwd(), "atlas-credentials.env"),
    path.resolve(process.cwd(), "backend/atlas-credentials.env"),
  ];

  for (const envPath of candidates) {
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

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (connectionPromise) {
    try {
      await connectionPromise;
      return;
    } catch {
      connectionPromise = null;
    }
  }
  loadEnv();
  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    throw new Error(
      "MONGODB_URI environment variable is not set. Please add MONGODB_URI to your .env file or environment variables."
    );
  }
  connectionPromise = mongoose.connect(uri, {
    dbName: "herbalhub",
    serverSelectionTimeoutMS: 10_000,
  }).catch((err) => {
    connectionPromise = null;
    throw err;
  });
  await connectionPromise;
}

// ── Product Model ─────────────────────────────────────────────────────────────

export interface ProductDocument extends Document {
  id: string;
  name: string;
  category: string;
  theme: string;
  netWeight: string;
  count: string;
  description: string;
  mainImage: string;
  openImage: string;
  images: { main: string; open: string };
  price: number;
}

const productSchema = new Schema<ProductDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    theme: { type: String, required: true },
    netWeight: { type: String, required: true },
    count: { type: String, required: true },
    description: { type: String, required: true },
    mainImage: { type: String, required: true },
    openImage: { type: String, required: true },
    images: {
      main: { type: String, required: true },
      open: { type: String, required: true },
    },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const ProductModel: Model<ProductDocument> =
  mongoose.models["Product"] ||
  model<ProductDocument>("Product", productSchema);

// ── Assessment Model ──────────────────────────────────────────────────────────

export interface AssessmentDocument extends Document {
  id: number;
  parentName: string;
  email: string;
  phone?: string | null;
  childName: string;
  age: number;
  gender: string;
  activityLevel: string;
  focusDifficulty: string;
  hyperactivity: string;
  homework: string;
  diet: string;
  vegetables: string;
  supplements: string;
  allergies?: string | null;
  medications?: string | null;
  notes?: string | null;
  focusScore: number;
  mineralScore: number;
  recommendation: string;
  createdAt: Date;
}

const assessmentSchema = new Schema<AssessmentDocument>({
  id: { type: Number, required: true, unique: true },
  parentName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: null },
  childName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  activityLevel: { type: String, required: true },
  focusDifficulty: { type: String, required: true },
  hyperactivity: { type: String, required: true },
  homework: { type: String, required: true },
  diet: { type: String, required: true },
  vegetables: { type: String, required: true },
  supplements: { type: String, required: true },
  allergies: { type: String, default: null },
  medications: { type: String, default: null },
  notes: { type: String, default: null },
  focusScore: { type: Number, required: true },
  mineralScore: { type: Number, required: true },
  recommendation: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

const AssessmentModel: Model<AssessmentDocument> =
  mongoose.models["Assessment"] ||
  model<AssessmentDocument>("Assessment", assessmentSchema);

// ── Seed Data ─────────────────────────────────────────────────────────────────

export const DEFAULT_PRODUCTS = [
  {
    id: "focus-gummies",
    name: "Pure Botànica Focus Gummies",
    category: "Herbal Glycerite Gummies",
    theme: "strawberry/red",
    netWeight: "120g",
    count: "60 gummies",
    description:
      "A gentle, strawberry-infused glycerite formula crafted to help ease restlessness and support calm, centered concentration during homework or study time.",
    mainImage: "focus-gummies-main.png",
    openImage: "focus-gummies-open.png",
    images: {
      main: "focus-gummies-main.png",
      open: "focus-gummies-open.png",
    },
    price: 34.99,
  },
  {
    id: "mineral-gummies",
    name: "Pure Botànica Mineral Gummies",
    category: "Herbal Glycerite Gummies",
    theme: "green",
    netWeight: "120g",
    count: "60 gummies",
    description:
      "Nourishing herbal glycerite formula with bio-active magnesium and soothing botanicals to support physical recovery, restful sleep, and healthy growth.",
    mainImage: "mineral-gummies-main.png",
    openImage: "mineral-gummies-open.png",
    images: {
      main: "mineral-gummies-main.png",
      open: "mineral-gummies-open.png",
    },
    price: 34.99,
  },
];

/**
 * Seed the database with default products if none exist.
 * Also seeds the assessments from db.json if provided via SEED_DATA env var.
 */
async function seedIfEmpty(): Promise<void> {
  await connectDB();
  const count = await ProductModel.countDocuments();
  if (count === 0) {
    await ProductModel.insertMany(DEFAULT_PRODUCTS);
    console.log("[db] Seeded default products into MongoDB.");
  }
}

// ── Product Functions ─────────────────────────────────────────────────────────

export async function getProducts(): Promise<any[]> {
  await connectDB();
  await seedIfEmpty();
  const products = await ProductModel.find({}).lean();
  if (products.length === 0) {
    return DEFAULT_PRODUCTS;
  }
  return products;
}

// ── Assessment Functions ──────────────────────────────────────────────────────

function docToAssessment(doc: any): Assessment {
  return {
    id: doc.id,
    parentName: doc.parentName,
    email: doc.email,
    phone: doc.phone ?? null,
    childName: doc.childName,
    age: doc.age,
    gender: doc.gender,
    activityLevel: doc.activityLevel,
    focusDifficulty: doc.focusDifficulty,
    hyperactivity: doc.hyperactivity,
    homework: doc.homework,
    diet: doc.diet,
    vegetables: doc.vegetables,
    supplements: doc.supplements,
    allergies: doc.allergies ?? null,
    medications: doc.medications ?? null,
    notes: doc.notes ?? null,
    focusScore: doc.focusScore,
    mineralScore: doc.mineralScore,
    recommendation: doc.recommendation,
    createdAt: new Date(doc.createdAt),
  };
}

export async function getAllAssessments(): Promise<Assessment[]> {
  await connectDB();
  const docs = await AssessmentModel.find({}).lean();
  return docs.map(docToAssessment);
}

export async function insertAssessment(
  input: InsertAssessment
): Promise<Assessment> {
  await connectDB();
  // Get the next numeric ID (like an auto-increment)
  const last = await AssessmentModel.findOne({}).sort({ id: -1 }).lean();
  const id = last ? (last as any).id + 1 : 1;

  const newAssessment = new AssessmentModel({
    ...input,
    phone: input.phone ?? null,
    allergies: input.allergies ?? null,
    medications: input.medications ?? null,
    notes: input.notes ?? null,
    id,
    createdAt: new Date(),
  });
  await newAssessment.save();
  return docToAssessment(newAssessment.toObject());
}

export async function getAssessmentById(
  id: number
): Promise<Assessment | undefined> {
  await connectDB();
  const doc = await AssessmentModel.findOne({ id }).lean();
  if (!doc) return undefined;
  return docToAssessment(doc);
}

export async function deleteAssessmentById(
  id: number
): Promise<Assessment | undefined> {
  await connectDB();
  const doc = await AssessmentModel.findOneAndDelete({ id }).lean();
  if (!doc) return undefined;
  return docToAssessment(doc);
}

export async function getAllAssessmentsSortedByDateDesc(): Promise<
  Assessment[]
> {
  await connectDB();
  const docs = await AssessmentModel.find({}).sort({ createdAt: -1 }).lean();
  return docs.map(docToAssessment);
}

export async function listAssessments(params: {
  search?: string;
  recommendation?: string;
  page: number;
  limit: number;
}): Promise<{ total: number; rows: Assessment[] }> {
  await connectDB();
  const { search, recommendation, page, limit } = params;

  // Build MongoDB filter query
  const filter: Record<string, any> = {};

  if (recommendation) {
    filter["recommendation"] = recommendation;
  }

  if (search) {
    const term = search.trim();
    filter["$or"] = [
      { parentName: { $regex: term, $options: "i" } },
      { email: { $regex: term, $options: "i" } },
      { childName: { $regex: term, $options: "i" } },
    ];
  }

  const total = await AssessmentModel.countDocuments(filter);
  const offset = (page - 1) * limit;
  const docs = await AssessmentModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();

  return { total, rows: docs.map(docToAssessment) };
}

export * from "./schema/index.js";
