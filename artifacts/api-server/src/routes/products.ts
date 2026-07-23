import { Router } from "express";
import { getProducts } from "@workspace/db";

const router = Router();

router.get("/products", async (_req: any, res: any): Promise<void> => {
  const products = await getProducts();
  res.json({ products });
});

router.get("/products/:id", async (req: any, res: any): Promise<void> => {
  const products = await getProducts();
  const product = products.find((p: any) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ product });
});

export default router;
