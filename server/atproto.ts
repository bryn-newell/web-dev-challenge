import { promises as fs } from "fs";

import {
  NodeOAuthClient,
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedStateStore,
  NodeSavedState,
  OAuthSession,
} from "@atproto/oauth-client-node";
import { Agent } from "@atproto/api";
import path from "path";

export class StateStore implements NodeSavedStateStore {
  async get(key: string): Promise<NodeSavedState | undefined> {
    console.log("StateStore.get", key);
    const filePath = path.join(process.cwd(), "SavedState.json");
    const data = await fs.readFile(filePath, "utf8");
    const store = JSON.parse(data);
    const value = store[key];
    console.log("StateStore.get value", value);

    return value as NodeSavedState;
  }
  async set(key: string, value: NodeSavedState): Promise<void> {
    console.log("StateStore.set", key, value);
    const filePath = path.join(process.cwd(), "SavedState.json");
    const data = await fs.readFile(filePath, "utf8");
    const store = JSON.parse(data);
    store[key] = value;
    await fs.writeFile(filePath, JSON.stringify(store, null, 2));
  }

  async del(key: string): Promise<void> {
    console.log("StateStore.del", key);
    const filePath = path.join(process.cwd(), "SavedState.json");
    const data = await fs.readFile(filePath, "utf8");
    const store = JSON.parse(data);
    delete store[key];
    await fs.writeFile(filePath, JSON.stringify(store, null, 2));
  }
}

export class SessionStore implements NodeSavedSessionStore {
  async get(key: string): Promise<NodeSavedSession | undefined> {
    console.log("SessionStore.get key", key);
    const filePath = path.join(process.cwd(), "SavedSession.json");
    const data = await fs.readFile(filePath, "utf8");
    const store = JSON.parse(data);
    const value = store[key];
    console.log("SessionStore.get value", value);

    return value as NodeSavedSession;
  }

  async set(key: string, value: NodeSavedSession): Promise<void> {
    console.log("SessionStore.set", key, value);
    const filePath = path.join(process.cwd(), "SavedSession.json");
    const data = await fs.readFile(filePath, "utf8");
    const store = JSON.parse(data);
    store[key] = value;
    await fs.writeFile(filePath, JSON.stringify(store, null, 2));
  }

  async del(key: string): Promise<void> {
    console.log("SessionStore.del", key);
    const filePath = path.join(process.cwd(), "SavedSession.json");
    const data = await fs.readFile(filePath, "utf8");
    const store = JSON.parse(data);
    delete store[key];
    await fs.writeFile(filePath, JSON.stringify(store, null, 2));
  }
}
export function createOauthClient() {
  const client = new NodeOAuthClient({
    clientMetadata: {
      client_id: `http://localhost?scope=${encodeURIComponent(
        "atproto transition:generic",
      )}&redirect_uri=http://[::1]:3000/oauth-callback`,
      redirect_uris: ["http://[::1]:3000/oauth-callback"],
      scope: "atproto transition:generic",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      application_type: "web",
      token_endpoint_auth_method: "none",
      dpop_bound_access_tokens: true,
    },
    stateStore: new StateStore(),
    sessionStore: new SessionStore(),
  });

  return client;
}

export function createAgent(session: OAuthSession) {
  const agent = new Agent(session);

  return agent;
}
