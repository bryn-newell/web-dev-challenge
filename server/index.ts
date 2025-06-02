import { serve } from "@hono/node-server";
import { Hono } from "hono";

import example from "./playwright/example";

const app = new Hono();
app.post("/example", async (c) => {
  const body = await c.req.json();
  const url = body.url;
  console.log("Received URL:", url);
  try {
    // Call the example function from playwright
    const { ptext, header, title } = await example(url);

    return c.json({
      title,
      header,
      ptext,
    });
  } catch (e) {
    console.error("Error during example execution:", e);
    return c.text("An error occurred while running the example.", 500);
  }
});

const server = serve(app);

// graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
