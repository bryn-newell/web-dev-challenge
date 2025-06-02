import fs from "fs/promises";
import path from "path";
import { createOauthClient, createAgent } from "./atproto";

export const post = async (link: string, content: string) => {
  const sessionFile = await fs.readFile(
    path.join(process.cwd(), "SavedSession.json"),
    "utf8",
  );

  const sessionStore = JSON.parse(sessionFile);
  const did = Object.keys(sessionStore)[0];

  const client = createOauthClient();
  const session = await client.restore(did);
  const agent = createAgent(session);

  const sentences = getRandomSentences(content);
  console.log("Random sentences:", sentences);

  const text = `
  "${sentences.join(" ")}"\n
  ${link}
  `;

  console.log("Posting content:", text);

  console.log("text.length:", text.length);

  await agent.post({
    text,
  });
};

const getRandomSentences = (text: string) => {
  const matches = text.match(/[^\.!\?]+[\.!\?]+/g);
  if (!matches) return [text.trim()];

  // remove extra whitespace
  matches.forEach((match, index) => {
    matches[index] = match.replace(/\s+/g, " ");
  });
  const sentences = matches.map((match) => match.trim());

  const randomIndex = Math.floor(Math.random() * sentences.length);

  const randomNumber = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3
  const selectedSentences = sentences.slice(
    randomIndex,
    randomIndex + randomNumber,
  );

  let totalLength = 0;

  const maxLength = 250;

  const finalSentences: string[] = [];

  for (let sentence of selectedSentences) {
    totalLength += sentence.length;
    if (totalLength < maxLength) {
      finalSentences.push(sentence);
    }
  }
  return finalSentences.map((sentence) => sentence.trim());
};
