import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { parseFilmPage } from "./uakinoParser.mjs";

const BASE = "https://uakino.best";

// ======================
// 🔍 Завантаження сторінки як реальний браузер
// ======================
async function loadPage(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-software-rasterizer"
    ]
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/112.0 Safari/537.36"
  );

  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 90000
  });

  const html = await page.content();
  await browser.close();

  return html;
}

// ======================
// 🔍 Парсимо список фільмів
// ======================
async function getLatestFilms() {
  console.log("📡 Завантажую фільми через Puppeteer...");

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
// 🎬 Головний запуск
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

