import fs from "node:fs/promises";
import path from "node:path";
import { type Assessment, type InsertAssessment } from "./schema";

const DB_FILE = process.env.JSON_DB_PATH || path.join(process.cwd(), "db.json");

// Serial execution queue to prevent concurrent file writes/corruption
let writeQueue = Promise.resolve();

async function enqueueWrite<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    writeQueue = writeQueue.then(async () => {
      try {
        const res = await fn();
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function ensureDbFile(): Promise<void> {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export const DEFAULT_PRODUCTS = [
  {
    id: "focus-gummies",
    name: "Pure Botànica Focus Gummies",
    category: "Herbal Glycerite Gummies",
    theme: "strawberry/red",
    netWeight: "120g",
    count: "60 gummies",
    description: "A gentle, strawberry-infused glycerite formula crafted to help ease restlessness and support calm, centered concentration during homework or study time.",
    mainImage: "focus-gummies-main.png",
    openImage: "focus-gummies-open.png",
    images: {
      main: "focus-gummies-main.png",
      open: "focus-gummies-open.png"
    },
    price: 34.99
  },
  {
    id: "mineral-gummies",
    name: "Pure Botànica Mineral Gummies",
    category: "Herbal Glycerite Gummies",
    theme: "green",
    netWeight: "120g",
    count: "60 gummies",
    description: "Nourishing herbal glycerite formula with bio-active magnesium and soothing botanicals to support physical recovery, restful sleep, and healthy growth.",
    mainImage: "mineral-gummies-main.png",
    openImage: "mineral-gummies-open.png",
    images: {
      main: "mineral-gummies-main.png",
      open: "mineral-gummies-open.png"
    },
    price: 34.99
  }
];

export async function getProducts() {
  await ensureDbFile();
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
      return parsed.products;
    }
    return DEFAULT_PRODUCTS;
  } catch (err) {
    return DEFAULT_PRODUCTS;
  }
}

export async function getAllAssessments(): Promise<Assessment[]> {
  await ensureDbFile();
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    const raw = Array.isArray(parsed) ? parsed : (parsed.assessments || []);
    return raw.map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt),
    }));
  } catch (err) {
    console.error("Failed to read/parse DB_FILE, returning empty array", err);
    return [];
  }
}

export async function saveAssessments(assessments: Assessment[]): Promise<void> {
  await ensureDbFile();
  let existingProducts = DEFAULT_PRODUCTS;
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (parsed && Array.isArray(parsed.products)) {
      existingProducts = parsed.products;
    }
  } catch {}
  
  const payload = {
    products: existingProducts,
    assessments
  };
  const tempFile = `${DB_FILE}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(payload, null, 2), "utf-8");
  await fs.rename(tempFile, DB_FILE);
}

export async function insertAssessment(input: InsertAssessment): Promise<Assessment> {
  return enqueueWrite(async () => {
    const list = await getAllAssessments();
    const id = list.length > 0 ? Math.max(...list.map((a) => a.id)) + 1 : 1;
    const newAssessment: Assessment = {
      ...input,
      id,
      createdAt: new Date(),
    };
    list.push(newAssessment);
    await saveAssessments(list);
    return newAssessment;
  });
}

export async function getAssessmentById(id: number): Promise<Assessment | undefined> {
  const list = await getAllAssessments();
  return list.find((a) => a.id === id);
}

export async function deleteAssessmentById(id: number): Promise<Assessment | undefined> {
  return enqueueWrite(async () => {
    const list = await getAllAssessments();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) {
      return undefined;
    }
    const [deleted] = list.splice(index, 1);
    await saveAssessments(list);
    return deleted;
  });
}

export async function getAllAssessmentsSortedByDateDesc(): Promise<Assessment[]> {
  const list = await getAllAssessments();
  return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function listAssessments(params: {
  search?: string;
  recommendation?: string;
  page: number;
  limit: number;
}): Promise<{ total: number; rows: Assessment[] }> {
  const { search, recommendation, page, limit } = params;
  let list = await getAllAssessments();

  if (search) {
    const term = search.toLowerCase();
    list = list.filter(
      (a) =>
        a.parentName.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term) ||
        a.childName.toLowerCase().includes(term)
    );
  }

  if (recommendation) {
    list = list.filter((a) => a.recommendation === recommendation);
  }

  // Sort by createdAt desc
  list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const total = list.length;
  const offset = (page - 1) * limit;
  const rows = list.slice(offset, offset + limit);

  return { total, rows };
}

export * from "./schema";
