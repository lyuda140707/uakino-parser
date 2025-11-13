import fetch from "node-fetch";

export async function extractVideo(iframeUrl) {
  try {
    const html = await fetch(iframeUrl).then(r => r.text());
    const match = html.match(/https:\/\/[^"]+\.m3u8/);

    if (match) return match[0];
    return iframeUrl;
  } catch (e) {
    return "";
  }
}
