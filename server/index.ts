import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import fs from "fs/promises";
import path from "path";

import read from "./playwright/read";
import { createOauthClient, createAgent } from "./atproto";
import { post } from "./post";

const app = new Hono();

app.use("*", cors({ origin: "*" }));

app.post("/example", async (c) => {
  const body = await c.req.json();
  const url = body.url;
  console.log("Received URL:", url);
  try {
    // Call the example function from playwright
    const { ptext, header, title } = await read(url);

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

  const { links } = await c.req.json();

  console.log("Received links:", links);
  const dbData = JSON.parse(db);
  dbData.links = links;

  await fs.writeFile(
    path.join(process.cwd(), "db.json"),
    JSON.stringify(dbData, null, 2),
  );
  console.log("Links saved to db.json");
  return c.json({
    success: true,
    message: "Links saved successfully",
  });
});

app.post("/post", async (c) => {
  const db = await fs.readFile(path.join(process.cwd(), "db.json"), "utf8");
  const dbData = JSON.parse(db);

  const { links } = dbData;

  const readArticles = await Promise.all(
    links.map(async (link) => await read(link)),
  );

  readArticles.forEach(async (article) => {
    const { link, ptext, header, title } = article;
    const text = `${title}\n${header}\n${ptext}`;
    console.log("Posting article text:", text);
    post(link, text);
  });

  return c.json({
    success: true,
    message: "Posts created successfully",
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
