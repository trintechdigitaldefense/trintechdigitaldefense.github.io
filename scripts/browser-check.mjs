import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.SITE_URL || "http://127.0.0.1:8000";
const paths = ["/", "/about/", "/privacy/", "/terms/", "/safety/", "/trust/", "/enquiry/", "/sentinel/", "/trintech/"];
const browser = await chromium.launch({ headless: true });
const errors = [];
const failures = [];
const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
const page = await context.newPage();
page.on("pageerror", error => errors.push("pageerror: " + error.message));
page.on("console", message => { if (message.type() === "error") errors.push("console: " + message.text()); });
page.on("response", response => {
  if (response.status() >= 400 && new URL(response.url()).origin === new URL(base).origin) {
    errors.push("HTTP " + response.status() + " " + response.url());
  }
});

for (const path of paths) {
  const response = await page.goto(base + path, { waitUntil: "domcontentloaded" });
  if (!response || !response.ok()) failures.push(path + " did not return a successful response");
  if (!(await page.title()).trim()) failures.push(path + " has no document title");
  const mobileOverflowForPage = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (mobileOverflowForPage) failures.push(path + " has horizontal overflow at 360px viewport");
  await page.setViewportSize({ width: 1365, height: 900 });
  const desktopOverflowForPage = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (desktopOverflowForPage) {
    const offenders = await page.evaluate(() => Array.from(document.querySelectorAll("body *")).map(el => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return { tag: el.tagName, id: el.id, className: typeof el.className === "string" ? el.className : "", left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, position: style.position, overflowX: style.overflowX };
    }).filter(item => item.right > window.innerWidth + 1 && item.width > 0).sort((a,b) => b.right - a.right).slice(0,12));
    failures.push(path + " has horizontal overflow at 1365px viewport: " + JSON.stringify(offenders));
  }
  await page.setViewportSize({ width: 360, height: 800 });
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  for (const violation of axe.violations) {
    const line = `${path}: axe ${violation.impact || "unknown"} ${violation.id} — ${violation.help}`;
    const nodes = violation.nodes.map(node => `target=${node.target.join(" ")} ${(node.failureSummary || "").replace(/\\s+/g, " ").slice(0, 240)}`);
    if (["critical", "serious"].includes(violation.impact)) failures.push(line + "\\n" + nodes.join("\\n"));
    else console.log("WARN " + line + "\\n" + nodes.join("\\n"));
  }
}

await page.goto(base + "/", { waitUntil: "domcontentloaded" });
await page.setViewportSize({ width: 360, height: 800 });
const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
if (mobileOverflow) failures.push("homepage has horizontal overflow at 360px viewport");
await page.evaluate(() => document.activeElement?.blur());
await page.keyboard.press("Tab");
const firstFocus = await page.evaluate(() => document.activeElement?.className || "");
if (!String(firstFocus).includes("skip-link")) failures.push("first keyboard tab does not focus the skip link");
const hamburger = page.locator("#hamburger");
if (await hamburger.count()) {
  await hamburger.click();
  if (await hamburger.getAttribute("aria-expanded") !== "true") failures.push("mobile menu did not set aria-expanded=true");
  await page.keyboard.press("Escape");
  if (await hamburger.getAttribute("aria-expanded") !== "false") failures.push("Escape did not close mobile menu");
}

await page.setViewportSize({ width: 1365, height: 900 });
const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
if (desktopOverflow) failures.push("homepage has horizontal overflow at 1365px viewport");

await page.emulateMedia({ reducedMotion: "reduce" });
const reducedMotion = await page.locator(".status-dot").first().evaluate(el => getComputedStyle(el).animationDuration).catch(() => "0s");
if (parseFloat(reducedMotion) > 0.001) failures.push("reduced-motion preference is not respected for status animation");

if (errors.length) failures.push(...errors);
await browser.close();
if (failures.length) {
  console.error(failures.map(x => "FAIL " + x).join("\n"));
  process.exit(1);
}
console.log("Browser checks passed: 7 pages, Android-sized mobile, desktop, keyboard navigation, reduced motion, and serious/critical axe violations.");
