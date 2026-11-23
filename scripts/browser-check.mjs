import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.SITE_URL || "http://127.0.0.1:8000";
const paths = ["/", "/about/", "/health-check/", "/privacy/", "/terms/", "/safety/", "/trust/", "/enquiry/", "/sentinel/", "/trintech/", "/blog/", "/blog/password-security-2026.html"];
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

for (const path of ["/blog/", "/blog/password-security-2026.html"]) {
  await page.goto(base + path, { waitUntil: "domcontentloaded" });
  await page.locator("html").evaluate(el => el.setAttribute("data-theme", "light"));
  await page.waitForTimeout(600); // allow the theme transition to finish before measuring contrast
  const lightAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  for (const violation of lightAxe.violations) {
    if (["critical", "serious"].includes(violation.impact)) {
      const nodes = violation.nodes.map(node => `target=${node.target.join(" ")} ${(node.failureSummary || "").replace(/\\s+/g, " ").slice(0, 240)}`);
      failures.push(`${path} (light theme): axe ${violation.impact} ${violation.id} — ${violation.help}\\n` + nodes.join("\\n"));
    }
  }
}

await page.goto(base + "/", { waitUntil: "domcontentloaded" });
await page.setViewportSize({ width: 360, height: 800 });
const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
if (mobileOverflow) failures.push("homepage has horizontal overflow at 360px viewport");
const enquiryForm = page.locator("#enquiry-form");
if (await enquiryForm.count()) {
  const action = await enquiryForm.getAttribute("action");
  if (!action || !action.startsWith("mailto:")) failures.push("homepage enquiry form must prepare an email draft, not submit to a website backend");
  const missingLabels = await enquiryForm.evaluate(form => Array.from(form.querySelectorAll("input,select,textarea")).filter(el => {
    if (el.type === "hidden") return false;
    return !Array.from(form.querySelectorAll("label")).some(label => (el.id && label.htmlFor === el.id) || label.contains(el));
  }).map(el => el.id || el.name || el.tagName));
  if (missingLabels.length) failures.push("enquiry form controls missing labels: " + missingLabels.join(", "));
  const requiredConsents = await enquiryForm.locator('input[type="checkbox"][required]').count();
  if (requiredConsents < 2) failures.push("enquiry form must require authorisation and privacy acknowledgement");
  const privacyAcknowledgement = await enquiryForm.locator('input[name="Privacy acknowledgement"][required]').count();
  if (privacyAcknowledgement !== 1) failures.push("enquiry form must include a required privacy acknowledgement");
  const sensitiveFields = await enquiryForm.locator('input[type="password"], input[type="file"]').count();
  if (sensitiveFields) failures.push("public enquiry form must not request credentials or file uploads");
  if (!(await enquiryForm.locator('a[href="/privacy/"]').count())) failures.push("enquiry form must link to the Privacy Notice");
}
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
console.log(`Browser checks passed: ${paths.length} pages, Android-sized mobile, desktop, keyboard navigation, reduced motion, and serious/critical axe violations.`);
