import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { parseFilmPage } from "./uakinoParser.mjs";

const BASE = "https://uakino.best";

async function getLatestFilms() {
  const html = await fetch(`${BASE}/films/`).then(r => r.text());
  const $ = cheerio.load(html);

  const films = [];
  $(".short-img a").each((i, el) => {
    const link = $(el).attr("href");
    if (link.includes("/films/")) films.push(BASE + link);
  });

  return films;
}

async function main() {
  const films = await getLatestFilms();

  for (const filmUrl of films) {
    console.log("🎬 Парсимо:", filmUrl);
    await parseFilmPage(filmUrl);
  }

  console.log("✅ Готово.");
}

main();
