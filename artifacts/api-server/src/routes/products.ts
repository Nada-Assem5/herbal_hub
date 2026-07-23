import { Router, type IRouter } from "express";
import { getProducts } from "@workspace/db";

const router: IRouter = Router();

router.get("/products", async (_req, res): Promise<void> => {
  const products = await getProducts();
  res.json({ products });
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const products = await getProducts();
  const product = products.find((p: any) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ product });
});

export default router;
