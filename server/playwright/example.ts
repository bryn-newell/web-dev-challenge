import playwright from "playwright";

export default async (link: string) => {
  console.log("Running Playwright example...");
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(link);
  const title = await page.title();
  console.log("Page title:", title);
  const h1 = page.locator("h1").first();
  const h1Text = await h1.textContent();
  console.log("H1 text:", h1Text);
  const ps = await page.locator("p").all();
  console.log("paragraphs:", ps);
  const texts = await Promise.all(ps.map((p) => p.textContent()));
  const ptext = texts.join("\n");
  console.log("Extracted text:", ptext);
  // await page.waitForTimeout(5000); // Wait for 5 seconds
  await browser.close();

  return {
    title,
    header: h1Text,
    ptext,
  };
};
