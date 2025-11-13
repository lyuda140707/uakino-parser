import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { extractVideo } from "./videoExtractor.mjs";
import { writeRow } from "./sheets.mjs";

export async function parseFilmPage(url) {
  const html = await fetch(url).then(r => r.text());
  const $ = cheerio.load(html);

  const title = $(".finfo h1").text().trim();
  const poster = $(".fposter img").attr("src");
  const description = $(".fdesc").text().trim();
  const year = $(".fmeta").text().match(/(\d{4})/)?.[1] || "";
  const genres = $(".meta a[href*='/films/genre']")
      .map((i, el) => $(el).text().trim()).get().join(", ");

  const iframe = $("iframe").attr("src");
  const video = iframe ? await extractVideo(iframe) : "";

  await writeRow([
    title,
    description,
    year,
    genres,
    poster,
    video,
    url
  ]);
}
