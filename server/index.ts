import { serve } from "@hono/node-server";
import { Hono } from "hono";
import fs from "fs/promises";
import path from "path";

import example from "./playwright/example";
import { createOauthClient, createAgent } from "./atproto";

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

app.post("/login", async (c) => {
  const body = await c.req.json();

  const { handle } = body;

  console.log("Received handle:", handle);

  const client = createOauthClient();

  const url = await client.authorize(handle, {
    scope: "atproto transition:generic",
  });
  console.log("Authorization URL:", url);

  return c.json({
    url,
  });
});

app.get("/oauth-callback", async (c) => {
  const url = new URL(c.req.url);
  const searchParams = url.searchParams;

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const iss = searchParams.get("iss");

  console.log("code:", code);
  console.log("state:", state);
  console.log("iss:", iss);

  const client = createOauthClient();

  try {
    const { session } = await client.callback(searchParams);
    const agent = createAgent(session);

    const { data: user } = await agent.getProfile({ actor: session.did });

    return c.json({
      user,
    });
  } catch (error) {
    console.error("Error exchanging code:", error);
    return c.text("Failed to exchange code for session.", 500);
  }
});

app.post("/links", async (c) => {
  const db = await fs.readFile(path.join(process.cwd(), "db.json"), "utf8");

  const formData = await c.req.formData();

  const links = formData.get("links");
  console.log("Received links:", links);
});

app.post("/post", async (c) => {
  const { content } = await c.req.json();
  console.log("Received content for post:", content);

  const sessionFile = await fs.readFile(
    path.join(process.cwd(), "SavedSession.json"),
    "utf8",
  );

  const sessionStore = JSON.parse(sessionFile);
  const did = Object.keys(sessionStore)[0];

  const client = createOauthClient();
  const session = await client.restore(did);
  const agent = createAgent(session);

  await agent.post({
    text: content,
  });

  return c.json({
    success: true,
    message: "Post created successfully",
  });
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
