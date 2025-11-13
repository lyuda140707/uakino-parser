import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import * as cheerio from "cheerio";
import { parseFilmPage } from "./uakinoParser.mjs";

const BASE = "https://uakino.best";

// ======================
// 🔍 Завантаження сторінки через серверну версію Chrome
// ======================
async function loadPage(url) {
  const executablePath = await chromium.executablePath;

  const browser = await puppeteer.launch({
    executablePath,
    headless: chromium.headless,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
  );

  await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });

  const html = await page.content();
  await browser.close();

  return html;
}

// ======================
async function getLatestFilms() {
  console.log("📡 Завантажую фільми через Chromium (Render)...");

  const html = await loadPage(`${BASE}/films/`);
  const $ = cheerio.load(html);

  const films = [];

  $("a.short-img").each((i, el) => {
    const link = $(el).attr("href");
    if (link && link.includes("/films/")) {
      films.push(BASE + link);
    }
  });

  console.log("Знайдено фільмів:", films.length);

  return films;
}

// ======================
async function main() {
  const films = await getLatestFilms();

  for (const filmUrl of films) {
    console.log("🎬 Парсимо:", filmUrl);
    await parseFilmPage(filmUrl);
  }

  console.log("✅ Готово.");
}

main();
