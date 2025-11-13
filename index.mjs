import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { parseFilmPage } from "./uakinoParser.mjs";

const BASE = "https://uakino.best";

// ======================
// 🔍 DEBUG: Дивимось, що відповідає сайт
// ======================
async function debugFetch() {
  const res = await fetch(`${BASE}/films/`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "text/html",
    }
  });

  const text = await res.text();

  console.log("HTML length:", text.length);
  console.log("First 300 chars:", text.slice(0, 300));

  return text;
}

// ======================
// 🔍 Беремо новинки
// ======================
async function getLatestFilms() {
  const html = await debugFetch();
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
// 🎬 Головна функція
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
