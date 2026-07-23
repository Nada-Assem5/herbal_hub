import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Auto-load .env if present
const candidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../atlas-credentials.env"),
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
}

import app from "./app.js";
import { logger } from "./lib/logger.js";

const port = process.env["PORT"] ? Number(process.env["PORT"]) : 8080;

if (process.env["NODE_ENV"] !== "production" || process.env["PORT"]) {
  app.listen(port, (err: any) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
}

export default app;
