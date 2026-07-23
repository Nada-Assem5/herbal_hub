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
